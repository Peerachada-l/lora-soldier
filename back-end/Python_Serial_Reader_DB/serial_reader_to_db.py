from math import sqrt
import serial.tools.list_ports
import serial
import json
#import psycopg2
from dotenv import load_dotenv
import requests
import os

load_dotenv()

url = "http://localhost:8000"

ports = serial.tools.list_ports.comports()
port = None
for p in ports:
    port = p.device
    print(p.device)

ser = serial.Serial('COM6', 115200, timeout=1)

# conn = psycopg2.connect(
#     host=os.getenv("POSTGRES_HOST"),
#     dbname=os.getenv("POSTGRES_DB"),
#     user=os.getenv("POSTGRES_USER"),
#     password=os.getenv("POSTGRES_PASSWORD"),
#     port=os.getenv("POSTGRES_PORT")
# )

# cur = conn.cursor()

# counter = 0
# execute_interval = 1
accelMag = 0
fall_detected = False
while True:
    line = ser.readline().decode("utf-8", errors="ignore").strip()
    if not line:
        continue
    start = line.find("{")
    end = line.rfind("}")

    if start == -1 or end == -1:
        continue
    json_str = line[start:end+1]
    try:
        data = json.loads(json_str)
        ir = data["IR"]
        heart_rate = data["AvgBPM"]
        body_temp = data["TempC"]
        accelX = data["AccelX"]
        accelY = data["AccelY"]
        accelZ = data["AccelZ"]
        accelMag = sqrt(accelX*accelX + accelY*accelY + accelZ*accelZ) #length of 3D vector
        print("accelMag: ", accelMag)
        if accelMag > 10:
            fall_detected = True
        else:
            fall_detected = False
        if ir < 10000:
            heart_rate = 0
            body_temp = 0.0
        payload = {
            "heart_rate": heart_rate,
            "body_temp": body_temp,
            "fall_detected": fall_detected,
            "latitude": data["Lat"],
            "longitude": data["Lng"]
        }
        print(data)
        requests.post(url+"/sensors/"+str(data['ID']), json=payload)
        # payload = {
        #     "latitude": data["Lat"],
        #     "longitude": data["Lng"]
        # }
        #requests.post(url+"/locations/"+str(data['ID']), json=payload)
        #print(f"HelmetID:{type(data['HelmetID'])}, AvgBPM:{type(data['AvgBPM'])}, TemperatureC:{type(data['TemperatureC'])}")
        #sql = "INSERT INTO sensor_data (heart_rate, body_temp, helmet_id) VALUES (%s, %s, %s)"
        #cur.execute(sql, (data["AvgBPM"], data["TemperatureC"], data["HelmetID"]))
        #counter += 1
        #if counter % execute_interval == 0:
        #    conn.commit()
    except json.JSONDecodeError:
        print("bad json:", line)
    except Exception as e:
        print("Error:", e)

    