from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import SensorData as SensorData
from schemas import SensorDataCreate, SensorData as SensorSchema
from datetime import datetime
from utils.websocket_manager import manager

router = APIRouter(prefix="/sensors", tags=["Sensor Data"])

@router.post("/{helmet_id}", response_model=SensorSchema)
async def add_sensor_data(helmet_id: int, sensor: SensorDataCreate, db: Session = Depends(get_db)):
    """Add a new sensor data record."""
    db_sensor_data = SensorData(
        helmet_id=helmet_id,
        heart_rate=sensor.heart_rate,
        body_temp=sensor.body_temp,
        fall_detected=sensor.fall_detected,
        timestamp=datetime.utcnow()
    )

    db.add(db_sensor_data)
    db.commit()
    db.refresh(db_sensor_data)

    await manager.broadcast(f"New sensor data: {db_sensor_data.helmet_id} | HR={db_sensor_data.heart_rate} | Temp={db_sensor_data.body_temp} | Fall={db_sensor_data.fall_detected}")
    
    return db_sensor_data

@router.get("/")
def get_locations(db: Session = Depends(get_db)):
    return db.query(SensorData).all()


@router.get("/{helmet_id}")
def get_sensor_data(helmet_id: int, db: Session = Depends(get_db)):
    """Get all sensor data for a given helmet."""
    return db.query(SensorData).filter(SensorData.helmet_id == helmet_id).all()
