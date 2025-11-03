from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import LocationDataCreate, LocationData as LocationSchema
from services.location_service import LocationService

router = APIRouter(prefix="/locations", tags=["Location Data"])

@router.post("/{helmet_id}", response_model=LocationSchema)
async def add_location_data(helmet_id: int, location: LocationDataCreate, db: Session = Depends(get_db)):
    service = LocationService(db)
    return await service.add_location(helmet_id, location.latitude, location.longitude)

@router.get("/")
def get_all_locations(db: Session = Depends(get_db)):
    return LocationService(db).get_all()

@router.get("/{helmet_id}")
def get_location_data(helmet_id: int, db: Session = Depends(get_db)):
    return LocationService(db).get_by_helmet(helmet_id)
