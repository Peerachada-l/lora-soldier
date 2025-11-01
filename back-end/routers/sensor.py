from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import SensorDataCreate, SensorData as SensorSchema
from services.sensor_service import SensorService

router = APIRouter(prefix="/sensors", tags=["Sensor Data"])

@router.post("/{helmet_id}", response_model=SensorSchema)
async def add_sensor_data(helmet_id: int, sensor: SensorDataCreate, db: Session = Depends(get_db)):
    service = SensorService(db)
    return await service.add_sensor_data(
        helmet_id=helmet_id,
        heart_rate=sensor.heart_rate,
        body_temp=sensor.body_temp,
        fall_detected=sensor.fall_detected,
    )

@router.get("/")
def get_all_sensor_data(db: Session = Depends(get_db)):
    return SensorService(db).get_all_sensor_data()

@router.get("/{helmet_id}")
def get_sensor_data(helmet_id: int, db: Session = Depends(get_db)):
    return SensorService(db).get_by_helmet(helmet_id)
