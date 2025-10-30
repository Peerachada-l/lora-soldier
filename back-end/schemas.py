from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Soldier
class SoldierBase(BaseModel):
    name: str
    rank: Optional[str] = None
    unit: Optional[str] = None

class SoldierCreate(SoldierBase):
    helmet_id: Optional[int] = None

class Soldier(SoldierBase):
    soldier_id: int
    # helmet_id: Optional[int] = None

    class Config:
        orm_mode = True


# Helmet
class HelmetStatusEnum(str, Enum):
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"

class HelmetBase(BaseModel):
    status: HelmetStatusEnum

class HelmetCreate(HelmetBase):
    soldier_id: Optional[int] = None

class Helmet(HelmetBase):
    helmet_id: int
    soldier: Optional[Soldier] = None
    sensor_data: Optional[List["SensorData"]] = []
    location_data: Optional[List["LocationData"]] = []

    class Config:
        orm_mode = True


# SensorData
class SensorDataCreate(BaseModel):
    heart_rate: int
    body_temp: float
    fall_detected: bool

class SensorData(BaseModel):
    sensor_id: int
    helmet_id: int
    heart_rate: int
    body_temp: float
    fall_detected: bool
    timestamp: datetime

    class Config:
        orm_mode = True


# LocationData
class LocationDataCreate(BaseModel):
    latitude: float
    longitude: float

class LocationData(BaseModel):
    location_id: int
    helmet_id: int
    latitude: float
    longitude: float
    timestamp: datetime

    class Config:
        orm_mode = True

# To allow forward references for nested models
Helmet.update_forward_refs()
SensorData.update_forward_refs()
LocationData.update_forward_refs()
