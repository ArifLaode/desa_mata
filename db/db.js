const mysql = require('mysql');

const db = mysql.createConnection({
    host: '103.56.204.45',
    user: 'desamata_rasyid',
    password: '#Aramata12',
    database: 'desamata_des_tree',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = db;
