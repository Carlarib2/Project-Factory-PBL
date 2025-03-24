const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
