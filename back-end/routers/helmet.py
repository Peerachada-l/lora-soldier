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

@router.put("/{helmet_id}/status")
async def update_status(helmet_id: int, status: HelmetStatus, db: Session = Depends(get_db)):
    return await HelmetService(db).update_status(helmet_id, status)

@router.delete("/{helmet_id}")
async def delete_helmet(helmet_id: int, db: Session = Depends(get_db)):
    return await HelmetService(db).remove_helmet(helmet_id)
