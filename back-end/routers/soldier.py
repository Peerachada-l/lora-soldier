from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from database import get_db
from schemas import SoldierCreate, Soldier as SoldierSchema
from services.soldier_service import SoldierService

router = APIRouter(prefix="/soldiers", tags=["Soldiers"])

@router.post("/", response_model=SoldierSchema)
async def create_soldier(soldier: SoldierCreate, db: Session = Depends(get_db)):
    service = SoldierService(db)
    return await service.create_soldier(
        name=soldier.name, rank=soldier.rank, unit=soldier.unit
    )


@router.get("/", response_model=list[SoldierSchema])
def get_soldiers(db: Session = Depends(get_db)):
    service = SoldierService(db)
    return service.get_all_soldiers()

@router.get("/detailed")
def get_soldiers_with_details(db: Session = Depends(get_db)):
    return SoldierService(db).get_all_soldiers_with_details()


@router.get("/{soldier_id}", response_model=SoldierSchema)
def get_soldier(soldier_id: int, db: Session = Depends(get_db)):
    service = SoldierService(db)
    return service.get_soldier_by_id(soldier_id)


@router.get("/{soldier_id}/helmet")
def get_soldier_helmet(soldier_id: int, db: Session = Depends(get_db)):
    service = SoldierService(db)
    return service.get_soldier_helmet(soldier_id)

@router.put("/{soldier_id}")
async def edit_soldier(
    soldier_id: int,
    name: str = Body(None),
    rank: str = Body(None),
    unit: str = Body(None),
    db: Session = Depends(get_db)
):
    service = SoldierService(db)
    return await service.edit_soldier(soldier_id, name, rank, unit)


@router.delete("/{soldier_id}")
async def remove_soldier(soldier_id: int, db: Session = Depends(get_db)):
    service = SoldierService(db)
    return await service.remove_soldier(soldier_id)
