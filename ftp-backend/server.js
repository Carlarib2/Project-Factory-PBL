const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

function generateRandomSensorData() {
    return {
        speed: Math.random() * 30,
        temperature: 20 + Math.random() * 15,
        humidity: Math.random() * 100,
        battery: Math.max(0, 100 - Math.random() * 30),
        motorTemp: 30 + Math.random() * 40,
        distance: Math.random() * 1000,
        rpm: Math.random() * 5000,
        gps: {
            lat: 37.7749 + (Math.random() - 0.5) * 0.01,
            lng: -122.4194 + (Math.random() - 0.5) * 0.01
        },
        signalStrength: Math.random() * 100,
        acceleration: {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            z: Math.random() * 2 - 1
        },
        steeringAngle: Math.random() * 90 - 45
    };
}

wss.on('connection', (ws) => {
    console.log('New connection');
    
    // Send initial data
    ws.send(JSON.stringify(generateRandomSensorData()));
    
    // Send new data every 20 seconds
    const interval = setInterval(() => {
        ws.send(JSON.stringify(generateRandomSensorData()));
    }, 20000);
    
    ws.on('close', () => {
        clearInterval(interval);
    });
});

app.get('/api', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

app.post('/api/serial-commands', (req, res) => {
    const { serialComms } = req.body;
    console.log(`Car is moving ${serialComms}`);
    res.json({ message: `Car is moving ${serialComms}` });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
