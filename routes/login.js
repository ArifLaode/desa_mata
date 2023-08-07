var express = require('express');
var router = express.Router();
var db = require('../db/db');
const session = require('express-session');
var path = require('path');
const { error } = require('console');
const { stat } = require('fs');


router.post('/', (req, res) => { 
    const NIK = req.body.NIK;
    const password = req.body.password;

    const query = `SELECT * FROM users WHERE NIK = ? AND password = ?`;
    db.query(query, [NIK, password], (err, result) => {
        if (err) {
            console.error('Kesalahan query: ', err.stack);
        } 
        if (result.length > 0) {
            const user = result[0]; 
            req.session.user = user; 
            res.redirect('/layanan/Masyarakat');
        } else {
            res.redirect('/layanan');
        }
    });
});

router.get('/Masyarakat/get-user', (req, res) => {
    const user = req.session.user.name;
    console.log(user);
    res.send(user);
});

router.get('/Masyarakat', (req, res) => {
    if(req.session.user) {
        res.sendFile(path.join(__dirname , '..', '/public', 'app.html'));
    } else {
        res.redirect('/layanan');
    }
});

router.get('/Masyarakat/riwayat', (req, res) => {
    if(req.session.user) {
        res.sendFile(path.join(__dirname , '..', '/public', 'riwayat.html'));
    } else {
        res.redirect('/layanan');
    }
});



router.get('/Masyarakat/data_aduan', (req, res) => {
    const user = req.session.user.id_user;
    const query = `SELECT * FROM data_aduan INNER JOIN aduan ON data_aduan.id_aduan = aduan.id_aduan WHERE id_user = ?`;
    db.query(query, [user], (err, rows) => {
        if(err) {
            console.error('Terjadi kesalahan server: ', err);
        } else {
            res.json(rows);
        }
    })
});

router.get('/Masyarakat/admin-respon', (req, res) => {
    const user = req.session.user.id_user;
    const query = `SELECT * FROM data_aduan INNER JOIN aduan ON data_aduan.id_aduan = aduan.id_aduan WHERE id_user = ?`;
    db.query(query, [user], (err, rows) => {
        if(err) {
            console.error('Terjadi kesalahan server: ', err);
        } else {
                res.json(rows);
        }
    })
});

router.post('/Masyarakat/respon_user', (req, res) => {
    var val = req.body.value;
    var idAduan = req.body.idAduan;
    var Currentstatus = req.body.status;
    console.log('Status yang dikirim dari user adalah', typeof Currentstatus);
    console.log(val, idAduan);
    if(val === "1") {
        var query = `UPDATE data_aduan SET data_aduan.status = 10 WHERE id_aduan = ?`;
        db.query(query, [idAduan], (err, result) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Internal Server Error ' + err.message);
            } else {
              console.log('Query executed successfully:', result);
              res.send(result);
            }
          });          
    } else {
        if (Currentstatus === "7") {
            var Pstatus = 8;
        } else {
            var Pstatus = 6;
        }
        var query1 = `UPDATE data_aduan SET data_aduan.status = ? WHERE id_aduan = ?`;
        db.query(query1, [Pstatus, idAduan], (err, result) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Internal Server Error ' + err.message);
            } else {
              console.log('Query executed successfully:', result);
              res.send(result);
            }
          }); 
    }
});

router.post('/Masyarakat/gantiPassword', (req, res) => {
    const user = req.session.user.id_user;
    const password = req.body.passwordBaru;
    console.log('passwordnya adalah',password);
    var query = `UPDATE users SET password = ? WHERE id_user = ?`;
    db.query(query, [password, user], (err) => {
        if (err) {
            console.error('terjadi kesalahan saat update user', err);
            res.send(err);
        } else {
            res.status(200).send('password berhasil diubah');
        }
    });
});

// Step 1: Add a new route for logout
router.get('/logout', (req, res) => {
    // Step 2: Destroy the session to log out the user
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session: ', err.stack);
        }
        // Step 3: Redirect the user to the desired destination after logout
        res.redirect('/layanan'); // You can redirect to the home page or any other page you prefer after logout
    });
});



module.exports = router;
