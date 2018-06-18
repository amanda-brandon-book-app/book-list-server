'use strict';

// Application dependencies 
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// Application setup
const app = express();
const PORT = process.env.PORT;

// Database setup

// Application middleware
app.use(cors());

// API endpoints
app.get('/api/v1/test', (req, res) => {
    console.log('You\'re a wizard Harry');
    res.send('Connected to server');
});

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`The server is listening on port ${PORT}`));