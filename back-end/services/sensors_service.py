# services/sensor_service.py
from sqlalchemy.orm import Session
from datetime import datetime
from models import SensorData, Soldier
from fastapi import HTTPException

class SensorService:
    def __init__(self, db: Session):
        self.db = db

    async def add_sensor_data(self, soldier_id: int, heart_rate: int, body_temp: float,
                              fall_detected: bool, latitude: float, longitude: float):
        """Insert new telemetry (sensor + location) record for the soldier."""
        
        # Validate soldier exists
        soldier = self.db.query(Soldier).filter(Soldier.soldier_id == soldier_id).first()
        if not soldier:
            raise HTTPException(status_code=404, detail="Soldier not found")

        db_data = SensorData(
            soldier_id=soldier_id,
            heart_rate=heart_rate,
            body_temp=body_temp,
            fall_detected=fall_detected,
            latitude=latitude,
            longitude=longitude,
            timestamp=datetime.utcnow()
        )

        self.db.add(db_data)
        self.db.commit()
        self.db.refresh(db_data)

        return db_data

    def get_all(self):
        """Return full telemetry history."""
        return self.db.query(SensorData).all()

    def get_by_soldier(self, soldier_id: int):
        """Return telemetry history of a specific soldier."""
        return self.db.query(SensorData).filter(SensorData.soldier_id == soldier_id).all()
