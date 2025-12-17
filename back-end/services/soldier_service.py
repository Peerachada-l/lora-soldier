# services/soldier_service.py
from sqlalchemy.orm import Session, joinedload
from models import Soldier, SensorData, Helmet
from fastapi import HTTPException
from utils.websocket_manager import manager
from sqlalchemy import desc
from datetime import datetime


class SoldierService:
    def __init__(self, db: Session):
        self.db = db

    # CREATE
    async def create_soldier(self, name: str, rank: str, unit: str):
        soldier = Soldier(
            name=name,
            rank=rank,
            unit=unit,
            helmet_worn=False
        )
        self.db.add(soldier)
        self.db.commit()
        self.db.refresh(soldier)

        await manager.broadcast(
            f"🪖 Soldier added: {name} | {rank} | {unit}"
        )
        return soldier

    # READ
    def get_all_soldiers(self):
        return self.db.query(Soldier).all()

    def get_soldier_by_id(self, soldier_id: int):
        soldier = self.db.query(Soldier).filter(
            Soldier.soldier_id == soldier_id
        ).first()

        if not soldier:
            raise HTTPException(status_code=404, detail="Soldier not found")
        return soldier

    def get_soldier_helmet(self, soldier_id: int):
        soldier = self.get_soldier_by_id(soldier_id)

        if not soldier.helmet or not soldier.helmet_worn:
            return {
                "soldier_id": soldier_id,
                "helmet": None,
                "helmet_worn": False,
                "timestamp": None
            }

        return {
            "soldier_id": soldier.soldier_id,
            "helmet_id": soldier.helmet.helmet_id,
            "helmet_status": soldier.helmet.status.value,
            "helmet_worn": soldier.helmet_worn,
            "timestamp": soldier.timestamp
        }
    
    # EDIT
    async def edit_soldier(
        self,
        soldier_id: int,
        name: str = None,
        rank: str = None,
        unit: str = None
    ):
        soldier = self.get_soldier_by_id(soldier_id)

        if name is not None:
            soldier.name = name
        if rank is not None:
            soldier.rank = rank
        if unit is not None:
            soldier.unit = unit

        self.db.commit()
        self.db.refresh(soldier)

        await manager.broadcast(f"✏️ Soldier {soldier_id} updated")
        return soldier
    
    # HELMET ACTIONS
    async def wear_helmet(self, soldier_id: int, helmet_id: int):
        soldier = self.get_soldier_by_id(soldier_id)
        helmet = self.db.query(Helmet).filter(
            Helmet.helmet_id == helmet_id
        ).first()

        if not helmet:
            raise HTTPException(status_code=404, detail="Helmet not found")

        # Helmet already worn by another soldier
        existing = self.db.query(Soldier).filter(
            Soldier.helmet_id == helmet_id,
            Soldier.helmet_worn == True
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="Helmet already worn")

        soldier.helmet_id = helmet_id
        soldier.helmet_worn = True
        soldier.timestamp = datetime.utcnow()

        self.db.commit()

        await manager.broadcast(
            f"🪖 Soldier {soldier_id} wears Helmet {helmet_id}"
        )
        return soldier

    async def remove_helmet(self, soldier_id: int):
        soldier = self.get_soldier_by_id(soldier_id)

        if not soldier.helmet_worn:
            return {"message": "Soldier is not wearing a helmet"}

        soldier.helmet_id = None
        soldier.helmet_worn = False
        soldier.timestamp = datetime.utcnow()

        self.db.commit()

        await manager.broadcast(
            f"Soldier {soldier_id} removed helmet"
        )
        return {"message": "Helmet removed successfully"}

    # DELETE
    async def remove_soldier(self, soldier_id: int):
        soldier = self.get_soldier_by_id(soldier_id)

        self.db.delete(soldier)
        self.db.commit()

        await manager.broadcast(f"Soldier {soldier_id} removed")
        return {"message": f"Soldier {soldier_id} removed successfully"}

    # DETAILED VIEW
    def get_all_soldiers_with_details(self):
        soldiers = (
            self.db.query(Soldier)
            .options(joinedload(Soldier.helmet))
            .all()
        )

        result = []

        for soldier in soldiers:
            data = {
                "soldier_id": soldier.soldier_id,
                "name": soldier.name,
                "rank": soldier.rank,
                "unit": soldier.unit,
                "helmet": None,
                "latest_sensor": None
            }

            if soldier.helmet and soldier.helmet_worn:
                data["helmet"] = {
                    "helmet_id": soldier.helmet.helmet_id,
                    "status": soldier.helmet.status.value,
                    "helmet_worn": soldier.helmet_worn,
                    "timestamp": soldier.timestamp
                }

            latest_sensor = (
                self.db.query(SensorData)
                .filter(SensorData.soldier_id == soldier.soldier_id)
                .order_by(desc(SensorData.timestamp))
                .first()
            )

            if latest_sensor:
                data["latest_sensor"] = {
                    "heart_rate": latest_sensor.heart_rate,
                    "body_temp": latest_sensor.body_temp,
                    "fall_detected": latest_sensor.fall_detected,
                    "latitude": latest_sensor.latitude,
                    "longitude": latest_sensor.longitude,
                    "timestamp": latest_sensor.timestamp.isoformat()
                }

            result.append(data)

        return result
