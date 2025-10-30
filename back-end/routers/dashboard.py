# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from sqlalchemy import desc
# from database import get_db
# from models import Soldier, SensorData, LocationData
# import schemas

# router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# # 1. Get all soldiers with latest data
# @router.get("/soldiers-status")
# def get_soldiers_status(db: Session = Depends(get_db)):
#     soldiers = db.query(Soldier).all()
#     response = []

#     for soldier in soldiers:
#         # Latest sensor record
#         latest_sensor = (
#             db.query(SensorData)
#             .filter(SensorData.helmet_id == soldier.helmet_id)
#             .order_by(desc(SensorData.timestamp))
#             .first()
#         )

#         # Latest location record
#         latest_location = (
#             db.query(LocationData)
#             .filter(LocationData.helmet_id == soldier.helmet_id)
#             .order_by(desc(LocationData.timestamp))
#             .first()
#         )

#         response.append({
#             "soldier_id": soldier.soldier_id,
#             "name": soldier.name,
#             "rank": soldier.rank,
#             "unit": soldier.unit,
#             "helmet_id": soldier.helmet_id,
#             "latest_sensor": {
#                 "heart_rate": latest_sensor.heart_rate if latest_sensor else None,
#                 "body_temp": latest_sensor.body_temp if latest_sensor else None,
#                 "fall_detected": latest_sensor.fall_detected if latest_sensor else None,
#                 "timestamp": latest_sensor.timestamp if latest_sensor else None,
#             } if latest_sensor else None,
#             "latest_location": {
#                 "latitude": float(latest_location.latitude) if latest_location else None,
#                 "longitude": float(latest_location.longitude) if latest_location else None,
#                 "timestamp": latest_location.timestamp if latest_location else None,
#             } if latest_location else None
#         })
    
#     return response


# # 2. Get a single soldier’s history (for charts / map trails)
# @router.get("/soldier/{soldier_id}/history")
# def get_soldier_history(soldier_id: int, db: Session = Depends(get_db)):
#     soldier = db.query(Soldier).filter(Soldier.soldier_id == soldier_id).first()
#     if not soldier:
#         raise HTTPException(status_code=404, detail="Soldier not found")

#     sensor_history = (
#         db.query(SensorData)
#         .filter(SensorData.helmet_id == soldier.helmet_id)
#         .order_by(desc(SensorData.timestamp))
#         .limit(100)  # last 100 records
#         .all()
#     )

#     location_history = (
#         db.query(LocationData)
#         .filter(LocationData.helmet_id == soldier.helmet_id)
#         .order_by(desc(LocationData.timestamp))
#         .limit(100)
#         .all()
#     )

#     return {
#         "soldier_id": soldier.soldier_id,
#         "name": soldier.name,
#         "rank": soldier.rank,
#         "unit": soldier.unit,
#         "sensor_history": [
#             {
#                 "heart_rate": s.heart_rate,
#                 "body_temp": s.body_temp,
#                 "fall_detected": s.fall_detected,
#                 "timestamp": s.timestamp,
#             }
#             for s in sensor_history
#         ],
#         "location_history": [
#             {
#                 "latitude": float(l.latitude),
#                 "longitude": float(l.longitude),
#                 "timestamp": l.timestamp,
#             }
#             for l in location_history
#         ],
#     }


# # 3. Get alerts (falls, abnormal vitals)
# @router.get("/alerts")
# def get_alerts(db: Session = Depends(get_db)):
#     alerts = []

#     # Falls
#     fall_events = db.query(SensorData).filter(SensorData.fall_detected == True).all()
#     for event in fall_events:
#         alerts.append({
#             "helmet_id": event.helmet_id,
#             "type": "Fall Detected",
#             "timestamp": event.timestamp
#         })

#     # Abnormal vitals
#     abnormal_vitals = (
#         db.query(SensorData)
#         .filter((SensorData.heart_rate < 40) | (SensorData.heart_rate > 180) | (SensorData.body_temp > 39))
#         .all()
#     )
#     for event in abnormal_vitals:
#         alerts.append({
#             "helmet_id": event.helmet_id,
#             "type": "Abnormal Vitals",
#             "heart_rate": event.heart_rate,
#             "body_temp": event.body_temp,
#             "timestamp": event.timestamp
#         })

#     return alerts
