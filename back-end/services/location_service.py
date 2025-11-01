from sqlalchemy.orm import Session
from datetime import datetime
from models import LocationData
from utils.websocket_manager import manager


class LocationService:
    def __init__(self, db: Session):
        self.db = db

    async def add_location(self, helmet_id: int, latitude: float, longitude: float):
        """Insert new GPS coordinate."""
        db_location = LocationData(
            helmet_id=helmet_id,
            latitude=latitude,
            longitude=longitude,
            timestamp=datetime.utcnow(),
        )

        self.db.add(db_location)
        self.db.commit()
        self.db.refresh(db_location)

        await manager.broadcast(f"📍 Helmet {helmet_id} moved to ({latitude}, {longitude})")

        return db_location

    def get_all(self):
        return self.db.query(LocationData).all()

    def get_by_helmet(self, helmet_id: int):
        return self.db.query(LocationData).filter(LocationData.helmet_id == helmet_id).all()
