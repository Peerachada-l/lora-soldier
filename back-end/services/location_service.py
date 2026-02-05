from sqlalchemy.orm import Session
from datetime import datetime
from models import LocationData
from utils.websocket_manager import manager
import json


class LocationService:
    def __init__(self, db: Session):
        self.db = db

    async def add_location(self, helmet_id: int, latitude: float, longitude: float):
        db_location = LocationData(
            helmet_id=helmet_id,
            latitude=latitude,
            longitude=longitude,
            timestamp=datetime.utcnow(),
        )

        self.db.add(db_location)
        self.db.commit()
        self.db.refresh(db_location)

        payload = {
            "helmet_id": helmet_id,
            "latitude": latitude,
            "longitude": longitude,
            "heart_rate": getattr(db_location, "heart_rate", None),
            "fall_detected": getattr(db_location, "fall_detected", False),
            "name": getattr(db_location, "name", f"Helmet {helmet_id}"),
            "unit": getattr(db_location, "unit", "Unknown"),
            "status": getattr(db_location, "status", "Active")
        }

        await manager.broadcast(json.dumps(payload))

        return db_location

    def get_all(self):
        return self.db.query(LocationData).all()

    def get_by_helmet(self, helmet_id: int):
        return self.db.query(LocationData).filter(LocationData.helmet_id == helmet_id).all()
