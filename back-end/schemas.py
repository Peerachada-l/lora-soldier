# schemas.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class SoldierBase(BaseModel):
    name: str
    rank: Optional[str] = None
    unit: Optional[str] = None


class SoldierCreate(SoldierBase):
    helmet_id: Optional[int] = None


class Soldier(SoldierBase):
    soldier_id: int
    helmet_id: Optional[int]
    helmet_worn: bool
    timestamp: Optional[datetime]
    

    class Config:
        from_attribute = True


class HelmetStatusEnum(str, Enum):
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"


class Helmet(BaseModel):
    helmet_id: int
    status: HelmetStatusEnum

    class Config:
        from_attribute = True


class SensorDataCreate(BaseModel):
    heart_rate: Optional[int] = 0
    body_temp: Optional[float] = 0
    fall_detected: Optional[bool] = False
    latitude: Optional[float]
    longitude: Optional[float]


class SensorData(BaseModel):
    data_id: int
    soldier_id: int
    heart_rate: int
    body_temp: float
    fall_detected: bool
    latitude: Optional[float]
    longitude: Optional[float]
    timestamp: datetime

    class Config:
        from_attribute = True


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
