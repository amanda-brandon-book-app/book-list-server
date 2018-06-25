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

// Fetch single book
app.get('/api/v1/books/:id', (req, res) => {
    console.log('New GET request for single object')
    let SQL = `
        SELECT * FROM books WHERE book_id=${req.params.id};
        `;
    client.query(SQL)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

// ================ POSTS ==================

app.post('/api/v1/books', function(req, res) {
    console.log('New post request');
    let SQL = 'INSERT INTO books(title, author, isbn, image_url, description)VALUES($2, $3, $4, $5, $6) WHERE book_id=$1 ON CONFLICT DO NOTHING;';
    let values = [
        req.params.id,
        req.body.title,
        req.body.author,
        req.body.isbn,
        req.body.image_url,
        req.body.description
    ];
    client.query(SQL, values)
    .then(res => res.sendStatus(201))
    .catch(console.error);
});

// ================ PUTS ==================

app.put('/api/v1/books/:id', (req, res) => {
    console.log('New put request')
    let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5 WHERE book_id=$6;`;
    let values = [
        req.body.title, 
        req.body.author, 
        req.body.isbn, 
        req.body.image_url, 
        req.body.description, 
        req.params.id
    ];
    client.query(SQL, values)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

// ============== DELETES ================

app.delete('/api/v1/books/:id', (req, res) => {
    let SQL = 'DELETE FROM books WHERE book_id=$1;'; 
    let values = [req.params.id];
    client.query(SQL, values)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

// =========================================

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`The server is listening on port ${PORT}`));
