# routers/websocket.py
from fastapi import WebSocket, APIRouter
from utils.websocket_manager import manager

router = APIRouter()

@router.websocket("/ws/locations")
async def websocket_locations(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            data = await ws.receive_text()
    except Exception:
        pass
    finally:
        await manager.disconnect(ws)
