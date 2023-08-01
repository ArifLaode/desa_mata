const mysql = require('mysql2');
require('dotenv').config();


const db = mysql.createConnection(process.env.DB_SERVER);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = db;
