# services/helmet_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Helmet, HelmetStatus
from utils.websocket_manager import manager
# from datetime import datetime

class HelmetService:
    def __init__(self, db: Session):
        self.db = db

    async def add_helmet(self, status: HelmetStatus):
        helmet = Helmet(status=status)
        self.db.add(helmet)
        self.db.commit()
        self.db.refresh(helmet)

        await manager.broadcast(f"🪖 Helmet {helmet.helmet_id} added")
        return helmet

    def get_all_helmets(self):
        return self.db.query(Helmet).all()

    async def update_status(self, helmet_id: int, status: HelmetStatus):
        helmet = self.db.query(Helmet).filter_by(helmet_id=helmet_id).first()
        if not helmet:
            raise HTTPException(status_code=404, detail="Helmet not found")

        helmet.status = status
        self.db.commit()

        await manager.broadcast(f"Helmet {helmet_id} status: {status.value}")
        return helmet

    async def remove_helmet(self, helmet_id: int):
        helmet = self.db.query(Helmet).filter_by(helmet_id=helmet_id).first()
        if not helmet:
            raise HTTPException(status_code=404, detail="Helmet not found")

        self.db.delete(helmet)
        self.db.commit()
        return {"message": "Helmet removed"}
