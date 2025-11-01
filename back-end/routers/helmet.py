from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import HelmetStatus
from services.helmet_service import HelmetService

router = APIRouter(prefix="/helmets", tags=["Helmets"])

@router.post("/")
async def add_helmet(status: HelmetStatus = HelmetStatus.inactive, db: Session = Depends(get_db)):
    return await HelmetService(db).add_helmet(status)

@router.get("/")
def get_helmets(db: Session = Depends(get_db)):
    return HelmetService(db).get_all_helmets()

@router.get("/available")
def get_available_helmets(db: Session = Depends(get_db)):
    return HelmetService(db).get_available_helmets()

@router.get("/unavailable")
def get_unavailable_helmets(db: Session = Depends(get_db)):
    return HelmetService(db).get_unavailable_helmets()

@router.put("/{helmet_id}/assign/{soldier_id}")
async def assign_helmet(helmet_id: int, soldier_id: int, db: Session = Depends(get_db)):
    return await HelmetService(db).assign_helmet(helmet_id, soldier_id)

@router.put("/{helmet_id}/unassign")
async def unassign_helmet(helmet_id: int, db: Session = Depends(get_db)):
    return await HelmetService(db).unassign_helmet(helmet_id)
