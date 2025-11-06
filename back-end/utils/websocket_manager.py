# utils/websocket_manager.py
from typing import List
from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"🟢 WebSocket connected: {len(self.active_connections)} clients")

    async def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"🔴 WebSocket disconnected: {len(self.active_connections)} clients left")

    async def broadcast(self, message: str):
        print(f"📢 Broadcasting message to {len(self.active_connections)} clients: {message}")
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                await self.disconnect(connection)

manager = WebSocketManager()
