from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    DateTime, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

# Soldier Table
class Soldier(Base):
    __tablename__ = "soldiers"

    soldier_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    rank = Column(String(50))
    unit = Column(String(100))
    helmet_id = Column(Integer, ForeignKey("helmets.helmet_id"), nullable=True)
    helmet_worn = Column(Boolean, default=False)
    timestamp = Column(DateTime, nullable=True)

    helmet = relationship("Helmet", back_populates="soldier")
    sensor_data = relationship("SensorData", back_populates="soldier", cascade="all, delete-orphan")


# Helmet Table

class HelmetStatus(enum.Enum):
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"

class Helmet(Base):
    __tablename__ = "helmets"

    helmet_id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum(HelmetStatus), default=HelmetStatus.inactive)
    
    soldier = relationship("Soldier", back_populates="helmet",  uselist=False)

# Sensor Data Table
class SensorData(Base):
    __tablename__ = "sensor_data"

    sensor_id = Column(Integer, primary_key=True, index=True)
    soldier_id = Column(Integer, ForeignKey("soldiers.soldier_id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    heart_rate = Column(Integer, default=0)
    body_temp = Column(Float, default=0)
    fall_detected = Column(Boolean, default=False)

    latitude = Column(Float)
    longitude = Column(Float)

    soldier = relationship("Soldier", back_populates="sensor_data")
