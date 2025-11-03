from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    DateTime, ForeignKey, DECIMAL, Enum, BigInteger
)
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class HelmetStatus(enum.Enum):
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"

class Soldier(Base):
    __tablename__ = "soldiers"

    soldier_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    rank = Column(String(50))
    unit = Column(String(100))

    # One-to-one relationship (a soldier has one helmet)
    helmet = relationship(
        "Helmet", back_populates="assigned_soldier", uselist=False
    )


# Helmet Table
class Helmet(Base):
    __tablename__ = "helmets"

    helmet_id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum(HelmetStatus), default=HelmetStatus.inactive, nullable=False)
    assigned_soldier_id = Column(Integer, ForeignKey("soldiers.soldier_id"), nullable=True)

    # Relationships
    assigned_soldier = relationship("Soldier", back_populates="helmet")
    sensors = relationship("SensorData", back_populates="helmet", cascade="all, delete-orphan")
    locations = relationship("LocationData", back_populates="helmet", cascade="all, delete-orphan")


# Sensor Data Table
class SensorData(Base):
    __tablename__ = "sensor_data"

    sensor_id = Column(BigInteger, primary_key=True, index=True)
    helmet_id = Column(Integer, ForeignKey("helmets.helmet_id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    heart_rate = Column(Integer)
    body_temp = Column(Float)
    fall_detected = Column(Boolean, default=False)

    # Relationship
    helmet = relationship("Helmet", back_populates="sensors")


# Location Data Table
class LocationData(Base):
    __tablename__ = "location_data"

    location_id = Column(BigInteger, primary_key=True, index=True)
    helmet_id = Column(Integer, ForeignKey("helmets.helmet_id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))

    # Relationship
    helmet = relationship("Helmet", back_populates="locations")
