require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
