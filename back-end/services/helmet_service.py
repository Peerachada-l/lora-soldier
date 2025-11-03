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

        # Prevent assigning a helmet that is already assigned
        if helmet.assigned_soldier_id:
            raise HTTPException(status_code=400, detail="Helmet already assigned. Use reassign instead.")

        # 🚫 Prevent assigning to a soldier who already has another helmet
        existing_helmet = self.db.query(Helmet).filter(Helmet.assigned_soldier_id == soldier_id).first()
        if existing_helmet:
            raise HTTPException(
                status_code=400,
                detail=f"Soldier {soldier_id} already has Helmet {existing_helmet.helmet_id} assigned.",
            )

        helmet.assigned_soldier_id = soldier_id
        self.db.commit()

        await manager.broadcast(f"🪖 Helmet {helmet_id} assigned to Soldier {soldier_id}")
        return {"message": f"Helmet {helmet_id} assigned to Soldier {soldier_id}"}

    async def reassign_helmet(self, helmet_id: int, soldier_id: int):
        """Reassign a helmet from one soldier to another."""
        helmet = self.db.query(Helmet).filter(Helmet.helmet_id == helmet_id).first()
        soldier = self.db.query(Soldier).filter(Soldier.soldier_id == soldier_id).first()

        if not helmet:
            raise HTTPException(status_code=404, detail="Helmet not found")
        if not soldier:
            raise HTTPException(status_code=404, detail="Soldier not found")

        previous_soldier = helmet.assigned_soldier_id

        # 🚫 Prevent reassigning to the same soldier
        if previous_soldier == soldier_id:
            raise HTTPException(status_code=400, detail=f"Helmet {helmet_id} is already assigned to this soldier.")

        # 🚫 Prevent reassigning to a soldier who already has another helmet
        existing_helmet = self.db.query(Helmet).filter(Helmet.assigned_soldier_id == soldier_id).first()
        if existing_helmet:
            raise HTTPException(
                status_code=400,
                detail=f"Soldier {soldier_id} already has Helmet {existing_helmet.helmet_id} assigned.",
            )

        helmet.assigned_soldier_id = soldier_id
        self.db.commit()

        if previous_soldier:
            await manager.broadcast(
                f"♻️ Helmet {helmet_id} reassigned from Soldier {previous_soldier} to Soldier {soldier_id}"
            )
            return {
                "message": f"Helmet {helmet_id} reassigned from Soldier {previous_soldier} to Soldier {soldier_id}"
            }
        else:
            await manager.broadcast(f"🪖 Helmet {helmet_id} assigned to Soldier {soldier_id}")
            return {"message": f"Helmet {helmet_id} assigned to Soldier {soldier_id}"}

    async def unassign_helmet(self, helmet_id: int):
        """Unassign a soldier from a helmet."""
        helmet = self.db.query(Helmet).filter(Helmet.helmet_id == helmet_id).first()
        if not helmet:
            raise HTTPException(status_code=404, detail="Helmet not found")

        if not helmet.assigned_soldier_id:
            return {"message": f"Helmet {helmet_id} is already available."}

        helmet.assigned_soldier_id = None
        self.db.commit()

        await manager.broadcast(f"🔄 Helmet {helmet_id} unassigned")
        return {"message": f"Helmet {helmet_id} unassigned successfully."}

    async def remove_helmet(self, helmet_id: int):
        """Remove a helmet from the database."""
        helmet = self.db.query(Helmet).filter(Helmet.helmet_id == helmet_id).first()
        if not helmet:
            raise HTTPException(status_code=404, detail="Helmet not found")
        self.db.delete(helmet)
        self.db.commit()
        return {"message": f"Helmet #{helmet_id} removed successfully"}
