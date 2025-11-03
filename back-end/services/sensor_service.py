from sqlalchemy.orm import Session
from datetime import datetime
from models import SensorData
from utils.websocket_manager import manager


class SensorService:
    def __init__(self, db: Session):
        self.db = db

    async def add_sensor_data(self, helmet_id: int, heart_rate: int, body_temp: float, fall_detected: bool):
        """Insert new sensor data record."""
        db_sensor_data = SensorData(
            helmet_id=helmet_id,
            heart_rate=heart_rate,
            body_temp=body_temp,
            fall_detected=fall_detected,
            timestamp=datetime.utcnow(),
        )

        self.db.add(db_sensor_data)
        self.db.commit()
        self.db.refresh(db_sensor_data)

        await manager.broadcast(
            f"📡 Helmet {helmet_id} | HR={heart_rate} | Temp={body_temp} | Fall={fall_detected}"
        )
        return db_sensor_data

    def get_all_sensor_data(self):
        return self.db.query(SensorData).all()

    def get_by_helmet(self, helmet_id: int):
        return self.db.query(SensorData).filter(SensorData.helmet_id == helmet_id).all()
