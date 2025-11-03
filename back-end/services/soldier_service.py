# services/soldier_service.py
from sqlalchemy.orm import Session
from models import Soldier, Helmet, SensorData, LocationData
from fastapi import HTTPException
from utils.websocket_manager import manager
from sqlalchemy import desc


class SoldierService:
    def __init__(self, db: Session):
        self.db = db

    async def create_soldier(self, name: str, rank: str, unit: str):
        """Create a new soldier record."""
        db_soldier = Soldier(name=name, rank=rank, unit=unit)
        self.db.add(db_soldier)
        self.db.commit()
        self.db.refresh(db_soldier)

        # Broadcast WebSocket event
        await manager.broadcast(
            f"🪖 Soldier added: name={name} | rank={rank} | unit={unit}"
        )

        return db_soldier

    def get_all_soldiers(self):
        """Return all soldiers."""
        return self.db.query(Soldier).all()

    def get_soldier_by_id(self, soldier_id: int):
        """Return a single soldier by ID."""
        soldier = (
            self.db.query(Soldier)
            .filter(Soldier.soldier_id == soldier_id)
            .first()
        )
        if not soldier:
            raise HTTPException(status_code=404, detail="Soldier not found")
        return soldier

    def get_soldier_helmet(self, soldier_id: int):
        """Return helmet assigned to soldier."""
        soldier = (
            self.db.query(Soldier)
            .filter(Soldier.soldier_id == soldier_id)
            .first()
        )
        if not soldier:
            raise HTTPException(status_code=404, detail="Soldier not found")

        if not soldier.helmet:
            return {"message": "This soldier does not have a helmet assigned."}

        return soldier.helmet
    
    def get_all_soldiers_with_details(self):
        """Return all soldiers with their assigned helmet, latest sensor + location data."""
        soldiers = self.db.query(Soldier).all()
        result = []

        for soldier in soldiers:
            soldier_data = {
                "soldier_id": soldier.soldier_id,
                "name": soldier.name,
                "rank": soldier.rank,
                "unit": soldier.unit,
                "helmet_id": None,
                "helmet_status": None,
                "latest_sensor": None,
                "latest_location": None
            }

            if soldier.helmet:
                helmet = soldier.helmet
                soldier_data["helmet_id"] = helmet.helmet_id
                soldier_data["helmet_status"] = helmet.status.value

                # Get latest sensor data
                latest_sensor = (
                    self.db.query(SensorData)
                    .filter(SensorData.helmet_id == helmet.helmet_id)
                    .order_by(desc(SensorData.timestamp))
                    .first()
                )
                if latest_sensor:
                    soldier_data["latest_sensor"] = {
                        "heart_rate": latest_sensor.heart_rate,
                        "body_temp": latest_sensor.body_temp,
                        "fall_detected": latest_sensor.fall_detected,
                        "timestamp": latest_sensor.timestamp.isoformat()
                    }

                # Get latest location data
                latest_location = (
                    self.db.query(LocationData)
                    .filter(LocationData.helmet_id == helmet.helmet_id)
                    .order_by(desc(LocationData.timestamp))
                    .first()
                )
                if latest_location:
                    soldier_data["latest_location"] = {
                        "latitude": float(latest_location.latitude),
                        "longitude": float(latest_location.longitude),
                        "timestamp": latest_location.timestamp.isoformat()
                    }

            result.append(soldier_data)

        return result
