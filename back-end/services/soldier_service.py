# services/soldier_service.py
from sqlalchemy.orm import Session
from models import Soldier as SoldierModel
from fastapi import HTTPException
from utils.websocket_manager import manager


class SoldierService:
    def __init__(self, db: Session):
        self.db = db

    async def create_soldier(self, name: str, rank: str, unit: str):
        """Create a new soldier record."""
        db_soldier = SoldierModel(name=name, rank=rank, unit=unit)
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
        return self.db.query(SoldierModel).all()

    def get_soldier_by_id(self, soldier_id: int):
        """Return a single soldier by ID."""
        soldier = (
            self.db.query(SoldierModel)
            .filter(SoldierModel.soldier_id == soldier_id)
            .first()
        )
        if not soldier:
            raise HTTPException(status_code=404, detail="Soldier not found")
        return soldier

    def get_soldier_helmet(self, soldier_id: int):
        """Return helmet assigned to soldier."""
        soldier = (
            self.db.query(SoldierModel)
            .filter(SoldierModel.soldier_id == soldier_id)
            .first()
        )
        if not soldier:
            raise HTTPException(status_code=404, detail="Soldier not found")

        if not soldier.helmet:
            return {"message": "This soldier does not have a helmet assigned."}

        return soldier.helmet
