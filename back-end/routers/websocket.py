# routers/websocket.py
from fastapi import WebSocket, APIRouter
from utils.websocket_manager import manager

router = APIRouter()

@router.websocket("/ws/locations")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            data = await ws.receive_text()
            print("Received: " + data)
    except Exception:
        pass
    finally:
        await manager.disconnect(ws)