# routers/sensors.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import SensorDataCreate, SensorData as SensorSchema
from services.sensors_service import SensorService
from utils.websocket_manager import manager
import json

router = APIRouter(prefix="/sensors", tags=["Sensor Data"])

@router.post("/{soldier_id}", response_model=SensorSchema)
async def add_sensor_data(soldier_id: int, sensor: SensorDataCreate, db: Session = Depends(get_db)):
    try:
        service = SensorService(db)
        new_data = await service.add_sensor_data(
            soldier_id=soldier_id,
            heart_rate=sensor.heart_rate,
            body_temp=sensor.body_temp,
            fall_detected=sensor.fall_detected,
            latitude=sensor.latitude,
            longitude=sensor.longitude,
        )

        # Broadcast minimal update to clients
        await manager.broadcast(json.dumps({
            "type": "location_update",
            "soldier_id": soldier_id,
            "latitude": new_data.latitude,
            "longitude": new_data.longitude,
            "heart_rate": new_data.heart_rate,
            "fall_detected": new_data.fall_detected,
            "timestamp": new_data.timestamp.isoformat()
        }))

        return new_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
def get_all_sensor_data(db: Session = Depends(get_db)):
    return SensorService(db).get_all()


@router.get("/{soldier_id}")
def get_sensor_data_by_soldier(soldier_id: int, db: Session = Depends(get_db)):
    return SensorService(db).get_by_soldier(soldier_id)
