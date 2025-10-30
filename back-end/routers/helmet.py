from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Helmet, HelmetStatus, Soldier
from utils.websocket_manager import manager

router = APIRouter(prefix="/helmets", tags=["Helmets"])


@router.post("/")
async def add_helmet(status: HelmetStatus = HelmetStatus.inactive, db: Session = Depends(get_db)):
    helmet = Helmet(status=status)
    db.add(helmet)
    db.commit()
    db.refresh(helmet)

    await manager.broadcast(f"Helmet added successfully")

    return helmet


@router.get("/")
def get_helmets(db: Session = Depends(get_db)):
    return db.query(Helmet).all()


@router.get("/available")
def get_available_helmets(db: Session = Depends(get_db)):
    """List all helmets not currently assigned."""
    return db.query(Helmet).filter(Helmet.assigned_soldier_id == None).all()

@router.get("/unavailable")
def get_available_helmets(db: Session = Depends(get_db)):
    """List all helmets currently assigned."""
    return db.query(Helmet).filter(Helmet.assigned_soldier_id != None).all()


@router.put("/{helmet_id}/assign/{soldier_id}")
def assign_helmet(helmet_id: int, soldier_id: int, db: Session = Depends(get_db)):
    """Assign an available helmet to a soldier."""
    helmet = db.query(Helmet).filter(Helmet.helmet_id == helmet_id).first()
    soldier = db.query(Soldier).filter(Soldier.soldier_id == soldier_id).first()

    if not helmet:
        raise HTTPException(status_code=404, detail="Helmet not found")
    if not soldier:
        raise HTTPException(status_code=404, detail="Soldier not found")
    if helmet.assigned_soldier_id:
        raise HTTPException(status_code=400, detail="Helmet already assigned")

    helmet.assigned_soldier_id = soldier_id
    db.commit()
    return {"message": f"Helmet {helmet_id} assigned to Soldier {soldier_id}"}


@router.put("/{helmet_id}/unassign")
def unassign_helmet(helmet_id: int, db: Session = Depends(get_db)):
    """Unassign a soldier from a helmet."""
    helmet = db.query(Helmet).filter(Helmet.helmet_id == helmet_id).first()
    if not helmet:
        raise HTTPException(status_code=404, detail="Helmet not found")
    
    if not helmet.assigned_soldier_id:
        return {"message": f"Helmet {helmet_id} is still available"}

    helmet.assigned_soldier_id = None
    db.commit()
    return {"message": f"Helmet {helmet_id} unassigned successfully."}

# @router.put("/{helmet_id}/status")
# def change_helmet_status(helmet_id: int, status: HelmetStatus, db: Session = Depends(get_db)):
#     """Change helmet operational status (active/inactive/maintenance)."""
#     helmet = db.query(Helmet).filter(Helmet.helmet_id == helmet_id).first()

#     if not helmet:
#         raise HTTPException(status_code=404, detail="Helmet not found")

#     helmet.status = status
#     db.commit()
#     db.refresh(helmet)
#     return {"message": f"Helmet {helmet_id} status updated to '{status.value}'"}