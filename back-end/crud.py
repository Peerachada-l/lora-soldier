from sqlalchemy.orm import Session
import models, schemas

# ===== Helmet CRUD =====
def get_helmets(db: Session):
    return db.query(models.Helmet).all()

def get_helmet(db: Session, helmet_id: int):
    return db.query(models.Helmet).filter(models.Helmet.helmet_id == helmet_id).first()

def create_helmet(db: Session, helmet: schemas.HelmetCreate):
    db_helmet = models.Helmet(status=helmet.status)
    db.add(db_helmet)
    db.commit()
    db.refresh(db_helmet)
    return db_helmet

# ===== Soldier CRUD =====
def get_soldiers(db: Session):
    return db.query(models.Soldier).all()

def create_soldier(db: Session, soldier: schemas.SoldierCreate):
    db_soldier = models.Soldier(
        name=soldier.name,
        rank=soldier.rank,
        unit=soldier.unit,
        helmet_id=soldier.helmet_id
    )
    db.add(db_soldier)
    db.commit()
    db.refresh(db_soldier)
    return db_soldier

# ===== Sensor Data CRUD =====
def get_sensor_data(db: Session, helmet_id: int = None):
    query = db.query(models.SensorData)
    if helmet_id:
        query = query.filter(models.SensorData.helmet_id == helmet_id)
    return query.all()

def create_sensor_data(db: Session, data: schemas.SensorDataCreate):
    db_data = models.SensorData(**data.dict())
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data

# ===== Location Data CRUD =====
def get_location_data(db: Session, helmet_id: int = None):
    query = db.query(models.LocationData)
    if helmet_id:
        query = query.filter(models.LocationData.helmet_id == helmet_id)
    return query.all()

def create_location_data(db: Session, data: schemas.LocationDataCreate):
    db_data = models.LocationData(**data.dict())
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data
