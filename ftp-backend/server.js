const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const app = express();
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const port = process.env.PORT;

const mqttClient = mqtt.connect('mqtt://localhost');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
));

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

// Route to control direction
app.post('/api/serial-commands', (req, res) => {
  const direction = req.body.command;
  mqttClient.publish('vehicle/direction', direction);
  console.log(`Direction command sent: ${direction}`);
  res.send('Direction command sent');
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
