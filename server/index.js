const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();c
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Example WebSocket handling
wss.on('connection', (ws) => {
    console.log('🪖 Soldier connected');
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received data:', data);
        // TODO: save to MongoDB
    });
});

server.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
);
