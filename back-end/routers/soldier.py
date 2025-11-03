from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import SoldierCreate, Soldier as SoldierSchema
from services.soldier_service import SoldierService

router = APIRouter(prefix="/soldiers", tags=["Soldiers"])

@router.post("/", response_model=SoldierSchema)
async def create_soldier(soldier: SoldierCreate, db: Session = Depends(get_db)):
    """Create a new soldier (via service layer)."""
    service = SoldierService(db)
    return await service.create_soldier(
        name=soldier.name, rank=soldier.rank, unit=soldier.unit
    )


@router.get("/", response_model=list[SoldierSchema])
def get_soldiers(db: Session = Depends(get_db)):
    """Get all soldiers (via service layer)."""
    service = SoldierService(db)
    return service.get_all_soldiers()

@router.get("/detailed")
def get_soldiers_with_details(db: Session = Depends(get_db)):
    return SoldierService(db).get_all_soldiers_with_details()


@router.get("/{soldier_id}", response_model=SoldierSchema)
def get_soldier(soldier_id: int, db: Session = Depends(get_db)):
    """Get specific soldier info."""
    service = SoldierService(db)
    return service.get_soldier_by_id(soldier_id)


@router.get("/{soldier_id}/helmet")
def get_soldier_helmet(soldier_id: int, db: Session = Depends(get_db)):
    """Get the helmet assigned to a soldier."""
    service = SoldierService(db)
    return service.get_soldier_helmet(soldier_id)

# @router.get("/detailed")
# def get_soldiers_with_details(db: Session = Depends(get_db)):
#     """Get all soldiers with helmet + latest sensor/location data."""
#     service = SoldierService(db)
#     return service.get_all_soldiers_with_details()
