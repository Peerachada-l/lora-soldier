from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from database import Base, engine
from routers import soldier, helmet, sensor, location
from utils.websocket_manager import manager

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Soldier Monitoring System")

# Register routers
app.include_router(soldier.router)
app.include_router(helmet.router)
app.include_router(sensor.router)
app.include_router(location.router)


@app.get("/")
def root():
    return {"message": "Soldier Monitoring API is running."}

# websocket
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"📩 Received from client: {data}")

            # Example: echo or broadcast
            await manager.broadcast(f"📡 Broadcast: {data}")

    except WebSocketDisconnect:
        manager.disconnect(websocket)