var express = require('express');
var router = express.Router();
var db = require('../db/db');
var session = require('express-session');



router.post('/', (req, res) => {
    const nama = req.body.nama;
    const wa = req.body.wa;
    const aduan = req.body.aduan;
    const pesan = req.body.pesan;
    const idUser = req.session.user ? req.session.user.id_user : null;
    console.log('id usernya adalah',idUser);
    const query = 'INSERT INTO aduan (id_user, nama, wa, aduan, pesan) VALUES (?, ?, ?, ?, ?)';
    const query1 = 'INSERT INTO data_aduan (id_aduan, status) VALUES (?, 1)';
    
    db.query(query, [idUser, nama, wa, aduan, pesan], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(`kesalahan server`);
        } else {
            const idAduan = result.insertId; // Mendapatkan nilai id_aduan yang di-generate
            
            db.query(query1, [idAduan], (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(`kesalahan server`);
                } else {
                    console.log('data berhasil ditambahkan');
                    res.status(200).send('Data berhasil ditambahkan');
                }
            });
        }
    });
});



module.exports = router;