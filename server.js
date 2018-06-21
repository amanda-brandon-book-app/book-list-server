'use strict';

// Application dependencies 
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// Application setup
const app = express();
const PORT = process.env.PORT;

// Database setup
// postgres://amanda:1234@localhost:5432/books_app'; - Linux
// postgres://localhost:5432/books_app - Mac Env link
const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
client.on('error', err => console.log(err));

// Application middleware
app.use(cors());

// +++++++++++++ API endpoints +++++++++++++

// ================ GETS ===================

// Fetch all books
app.get('/api/v1/books', (req, res) => {
    console.log('New GET request');
    let SQL = `SELECT * FROM books;`;
    client.query(SQL)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

// Fetch books w/o description (slim version)
app.get('/api/v1/books-slim', (req, res) => {
    console.log('New slimmed GET request')
    let SQL = `
        SELECT book_id, title, author, image_url FROM books;
        `;
    client.query(SQL)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

// Fetch single book
app.get('/api/v1/books/:id', (req, res) => {
    console.log('New GET request for single object')
    let SQL = `
        SELECT * FROM books WHERE book_id=$1;
        `;
    let values = [request.body.book_id];
    client.query(SQL, values)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

// ================ POSTS ==================



// =========================================

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`The server is listening on port ${PORT}`));
