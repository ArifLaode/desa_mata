const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'sql209.infinityfree.com',
    user: 'if0_34701946',
    password: '#Aramata12',
    database: 'des_tree'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = db;
