from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import LocationData as LocationData
from schemas import LocationDataCreate, LocationData as LocationSchema
from datetime import datetime
from utils.websocket_manager import manager


router = APIRouter(prefix="/locations", tags=["Location Data"])

@router.post("/{helmet_id}", response_model=LocationSchema)
async def add_location_data(helmet_id: int, location: LocationDataCreate, db: Session = Depends(get_db)):
    db_location = LocationData(
        helmet_id=helmet_id,
        latitude=location.latitude,
        longitude=location.longitude,
        timestamp=datetime.utcnow()
    )
    db.add(db_location)
    db.commit()
    db.refresh(db_location)

    await manager.broadcast(f"Helmet {helmet_id} moved to ({location.latitude}, {location.longitude})")

    return db_location


@router.get("/")
def get_locations(db: Session = Depends(get_db)):
    return db.query(LocationData).all()

@router.get("/{helmet_id}")
def get_location_data(helmet_id: int, db: Session = Depends(get_db)):
    """Get all GPS location records for a helmet."""
    return db.query(LocationData).filter(LocationData.helmet_id == helmet_id).all()
