# utils/websocket_manager.py
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"✅ New connection: {len(self.active_connections)} active")

    def disconnect(self, websocket: WebSocket):
        """Remove a disconnected WebSocket."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"❌ Connection closed: {len(self.active_connections)} active")

    async def broadcast(self, message: str):
        """Send a message to all connected clients."""
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()
