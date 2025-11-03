const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL client

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ PostgreSQL connection
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch(err => console.error('❌ PostgreSQL connection error:', err));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ✅ WebSocket handling
wss.on('connection', (ws) => {
    console.log('🪖 Helmet connected via WebSocket');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log('📩 Received data:', data);

            // Example expected data from helmet:
            // {
            //   "helmet_id": 1,
            //   "heart_rate": 82,
            //   "body_temp": 36.9,
            //   "fall_detected": false,
            //   "latitude": 13.7563,
            //   "longitude": 100.5018
            // }

            // ✅ Save Sensor Data
            await pool.query(
                `INSERT INTO sensor_data (helmet_id, timestamp, heart_rate, body_temp, fall_detected)
                 VALUES ($1, NOW(), $2, $3, $4)`,
                [data.helmet_id, data.heart_rate, data.body_temp, data.fall_detected]
            );

            // ✅ Save Location Data
            await pool.query(
                `INSERT INTO location_data (helmet_id, timestamp, latitude, longitude)
                 VALUES ($1, NOW(), $2, $3)`,
                [data.helmet_id, data.latitude, data.longitude]
            );

            // ✅ Broadcast to all connected clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        event: "update",
                        message: `Helmet ${data.helmet_id} updated`,
                        data
                    }));
                }
            });

        } catch (err) {
            console.error('⚠️ Error processing message:', err);
        }
    });

    ws.on('close', () => console.log('❌ Helmet disconnected'));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 WebSocket Server running on port ${PORT}`));
