from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Soldier as SoldierModel
from schemas import SoldierCreate, Soldier as SoldierSchema
from utils.websocket_manager import manager

router = APIRouter(prefix="/soldiers", tags=["Soldiers"])

# Create Soldier
@router.post("/", response_model=SoldierSchema)
async def create_soldier(soldier: SoldierCreate, db: Session = Depends(get_db)):
    """Create a new soldier."""
    db_soldier = SoldierModel(
        name=soldier.name,
        rank=soldier.rank,
        unit=soldier.unit
    )

    db.add(db_soldier)
    db.commit()
    db.refresh(db_soldier)

    await manager.broadcast(f"soldier added name={soldier.name} | rank={soldier.rank} | unit={soldier.unit}")

    return db_soldier


# Get all Soldiers
@router.get("/", response_model=list[SoldierSchema])
def get_soldiers(db: Session = Depends(get_db)):
    """Get all soldiers."""
    return db.query(SoldierModel).all()


# Get specific Soldier by ID
@router.get("/{soldier_id}", response_model=SoldierSchema)
def get_soldier(soldier_id: int, db: Session = Depends(get_db)):
    """Get specific soldier info."""
    soldier = db.query(SoldierModel).filter(SoldierModel.soldier_id == soldier_id).first()
    if not soldier:
        raise HTTPException(status_code=404, detail="Soldier not found")
    return soldier


# Get Helmet assigned to a Soldier
@router.get("/{soldier_id}/helmet")
def get_soldier_helmet(soldier_id: int, db: Session = Depends(get_db)):
    """Get the helmet assigned to a soldier."""
    soldier = db.query(SoldierModel).filter(SoldierModel.soldier_id == soldier_id).first()
    if not soldier:
        raise HTTPException(status_code=404, detail="Soldier not found")

    if not soldier.helmet:
        return {"message": "This soldier does not have a helmet assigned."}

    return soldier.helmet
