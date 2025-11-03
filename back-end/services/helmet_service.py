from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Helmet, HelmetStatus, Soldier
from utils.websocket_manager import manager


class HelmetService:
    def __init__(self, db: Session):
        self.db = db

    async def add_helmet(self, status: HelmetStatus = HelmetStatus.inactive):
        """Create new helmet record."""
        helmet = Helmet(status=status)
        self.db.add(helmet)
        self.db.commit()
        self.db.refresh(helmet)
        await manager.broadcast(f"🎖️ Helmet {helmet.helmet_id} added (status={status.value})")
        return helmet

    def get_all_helmets(self):
        return self.db.query(Helmet).all()

    def get_available_helmets(self):
        return self.db.query(Helmet).filter(Helmet.assigned_soldier_id == None).all()

    def get_unavailable_helmets(self):
        return self.db.query(Helmet).filter(Helmet.assigned_soldier_id != None).all()

    async def assign_helmet(self, helmet_id: int, soldier_id: int):
        """Assign an available helmet to a soldier."""
        helmet = self.db.query(Helmet).filter(Helmet.helmet_id == helmet_id).first()
        soldier = self.db.query(Soldier).filter(Soldier.soldier_id == soldier_id).first()

        if not helmet:
            raise HTTPException(status_code=404, detail="Helmet not found")
        if not soldier:
            raise HTTPException(status_code=404, detail="Soldier not found")
        if helmet.assigned_soldier_id:
            raise HTTPException(status_code=400, detail="Helmet already assigned")

        helmet.assigned_soldier_id = soldier_id
        self.db.commit()

        await manager.broadcast(f"🪖 Helmet {helmet_id} assigned to Soldier {soldier_id}")
        return {"message": f"Helmet {helmet_id} assigned to Soldier {soldier_id}"}

    async def unassign_helmet(self, helmet_id: int):
        """Unassign a soldier from a helmet."""
        helmet = self.db.query(Helmet).filter(Helmet.helmet_id == helmet_id).first()
        if not helmet:
            raise HTTPException(status_code=404, detail="Helmet not found")

        if not helmet.assigned_soldier_id:
            return {"message": f"Helmet {helmet_id} is still available"}

        helmet.assigned_soldier_id = None
        self.db.commit()

        await manager.broadcast(f"🔄 Helmet {helmet_id} unassigned")
        return {"message": f"Helmet {helmet_id} unassigned successfully."}
