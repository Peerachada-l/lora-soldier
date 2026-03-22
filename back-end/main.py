from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models  # noqa: F401 — register all models before create_all
from routers import soldier, helmet, sensors, websocket, auth
from utils.websocket_manager import manager

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Soldier Monitoring System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # Add this
)

# Register routers
app.include_router(auth.router)
app.include_router(soldier.router)
app.include_router(helmet.router)
app.include_router(sensors.router)
app.include_router(websocket.router)


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