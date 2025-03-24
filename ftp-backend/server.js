const express = require('express');
const cors = require('cors');
// const mqtt = require('mqtt');
const app = express();
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const port = process.env.PORT;
// const MQTT_BROKER = 'mqtt://192.168.4.1:1883'; // Arduino AP address
// const MQTT_TOPIC = 'car/commands'; // Topic for car commands

// Initialize MQTT client
// const mqttClient = mqtt.connect(MQTT_BROKER);

// mqttClient.on('connect', () => {
//     console.log('Connected to MQTT broker');
// });

// mqttClient.on('error', (err) => {
//     console.error('MQTT error:', err);
// });

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
    console.log(`Command received: ${serialComms}`);
    
    // Commented out MQTT publishing
    // mqttClient.publish(MQTT_TOPIC, serialComms, (err) => {
    //     if (err) {
    //         console.error('MQTT publish error:', err);
    //         res.status(500).json({ error: 'Failed to send command' });
    //     } else {
    //         res.json({ message: `Command sent: ${serialComms}` });
    //     }
    // });
    
    // Simple response without MQTT
    res.json({ message: `Command received: ${serialComms}` });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
