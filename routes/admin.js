var express = require('express');
var router = express.Router();
var db = require('../db/db');
const session = require('express-session');
var path = require('path');
const { error, log } = require('console');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', ({ root: 'admin' }));
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password; // Perbaikan: Menggunakan req.body.password
  const query = 'SELECT * FROM admin WHERE email = ? AND password = ?'; // Perbaikan: Menambahkan operator AND pada query
  db.query(query, [email, password], (err, result) => { // Perbaikan: Mengubah parameter 'ressult' menjadi 'result'
    if (err) {
      console.error('Kesalahan Query: ', err.stack);
    }
    if (result.length > 0) {
      const user = result[0];
      req.session.user = email;
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/admin');
    }
  });
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/admin', 'dashboard.html')); // Perbaikan: Menggunakan string 'admin' sebagai root
});

router.get('/data_aduan', (req, res, next) => {
  db.query('SELECT * FROM data_aduan INNER JOIN aduan ON data_aduan.id_aduan = aduan.id_aduan', (err, rows) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

router.get('/data-aduan', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/admin', 'data-aduan.html'));
});

router.get('/tabel_aduan', (req, res, next) => {
  db.query('SELECT * FROM data_aduan INNER JOIN aduan ON data_aduan.id_aduan = aduan.id_aduan', (err, rows) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

router.get('/data-aduan', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/admin', 'data-aduan.html'));
});

router.post('/tinjau_aduan', (req, res) => {
  const id_aduan = req.body.id_aduan;
  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().split('T')[0];
  const query = 'SELECT * FROM data_aduan INNER JOIN aduan ON data_aduan.id_aduan = aduan.id_aduan WHERE data_aduan.id_aduan = ?';
  const query1 = 'UPDATE data_aduan SET confirm_at = ?, status = ? WHERE id_aduan = ?';
  db.query(query, [id_aduan], (err, rows) => {
    if(err) {
      console.error('terjadi error: ',err);
      res.status(500).send('Internal server error');
    } else {
      let status;
      console.log('ini adalah data dari user', typeof rows[0].status);
      if(rows[0].status === 1) {
      status = 3;
      } else if(rows[0].status ===  4) {
        status = 4;
     } else if(rows[0].status === 6) {
       status = 6;
    } else if(rows[0].status === 8) {
      status = 8;
   }
      else {
        console.log('kesalahan dalam logika');
      }
      console.log(status);
      db.query(query1, [formattedDate, status, id_aduan], (err) => {
        if (err){
          console.error('Kesalahan saat Update: ', err);
        } else {
          res.json(rows);
        }
      });
    }
  });
});

router.post('/proses', (req, res) => {
  const aduan = req.body.Jcase;
  const id_aduan = req.body.id_aduan;
  const Currentstatus = req.body.status;
  console.log(aduan);
  console.log('statusnya adalah: ', Currentstatus);
  const query = 'SELECT *  FROM tb_jenis_aduan INNER JOIN tb_case ON tb_jenis_aduan.id_jenis_aduan = tb_case.id_jenis_aduan WHERE tb_jenis_aduan.nama = ?';
  const query1 = 'UPDATE data_aduan SET status = ? WHERE id_aduan = ?';
  db.query(query, [aduan], (err, rows) => {
    if (err) {
      console.error('Terjadi kesalahan saat memproses data', err);
      res.status(500).send('Internal Server Error');
    } else {
      if(Currentstatus === "6") {
        var status = 6;
      } else if(Currentstatus === "8") {
        var status = 8;
      } else if(Currentstatus === "3") {
        var status = 3;
      } else {
        console.log('kesalahana saat mengolah status');
      }
      db.query(query1, [status, id_aduan], (err) => {
        if (err) {
          console.error('Terjadi kesalahan', err);
          res.status(500).send('Internal Server Error');
        } else {
         const query2 =  `SELECT *
          FROM tb_instasi WHERE id_instasi IN (?, ?, ?)
        `;
        const sol1 = rows[0].sol_1;
        const sol2 = rows[0].sol_2;
        const sol3 = rows[0].sol_3;
        console.log(sol1, sol2, sol3);
        db.query(query2, [sol1, sol2, sol3], (err, sols) => {
          if(err) {
            console.error('kesalahan Database', err);
          } else {
            console.log(sols);
            res.json(sols);
          }
        });
          }
        })
        }
      });
    });

    router.post('/admin-respon', (req, res) => {
      const id_aduan = req.body.id_aduan;
      var data = req.body.value;
      var Currentstatus = req.body.status;
      console.log(id_aduan, data);
      const query = `SELECT * FROM data_aduan INNER JOIN aduan ON data_aduan.id_aduan = aduan.id_aduan`;
      db.query(query, [id_aduan], (error) => {
          if(error) {
              console.error('terjadi error: ', error);
          } else {
                  if (Currentstatus === "6") {
                    var status = 7;
                  } else if (Currentstatus === "8") {
                    var status = 9;
                  } else {
                    var status = 4;
                  }
                  var confirm = `UPDATE data_aduan SET status = ? WHERE id_aduan = ?`;
                  db.query(confirm, [status, id_aduan], (err, confirmed) => {
                      if(err) {
                          console.error('terjadi kesalahan: ', err);
                      } else {
                          res.send(confirmed);
                      }
                  })
          }
      })
  });

  router.get('/tabel_user', (req, res, next) => {
    db.query('SELECT * FROM users', (err, rows) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(rows);
      }
    });
  });

  router.get('/data-users', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/admin', 'tabel_user.html'));
  });

  router.post('/addUser', (req, res) => {
    var name = req.body.nama;
    var NIK = req.body.NIK;
    var query = `INSERT INTO users (name, NIK, password) VALUES (?, ?, 12345)`;
    db.query(query, [name, NIK], (err) => {
      if(err) {
        console.error('terjadi kesalahan saat input user', err);
        res.send(err);
      } else {
        res.status(200).send({ message: 'data ditambahkan' });
      }
    });
  });

  router.get('/getUserData', (req, res) => {
    const userId = req.query.userId;
    console.log(userId);
    var query = `SELECT * FROM users WHERE id_user = ?`;
    db.query(query, [userId], (error, rows) => {
      if(error) {
        console.log(error);
      } else {
        res.send(rows);
      }
    });
  });

  router.post('/editUser', (req, res) => {
    const userId = req.body.userId;
    console.log('user id yang diubah ',userId);
    var name = req.body.nama;
    var NIK = req.body.NIK;
    var query = `UPDATE users SET name = ?, NIK = ?, password = '12345' WHERE id_user = ?`;

    db.query(query, [name, NIK, userId], (err) => {
        if (err) {
            console.error('terjadi kesalahan saat update user', err);
            res.send(err);
        } else {
            res.status(200).send('data diubah.'); // Change the response message as needed
        }
    });
});

router.get('/data-instansi', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/admin', 'tabel_instasi.html'));
})

router.get('/tabel_insta', (req, res, next) => {
  db.query('SELECT * FROM tb_instasi', (err, rows) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

router.get('/getInstaData', (req, res) => {
  const userId = req.query.userId;
  console.log(userId);
  var query = `SELECT * FROM tb_instasi WHERE id_instasi = ?`;
  db.query(query, [userId], (error, rows) => {
    if(error) {
      console.log(error);
    } else {
      res.send(rows);
    }
  });
});

router.post('/editInsta', (req, res) => {
  const userId = req.body.userId;
  console.log('user id yang diubah ',userId);
  var name = req.body.nama;
  var instansi = req.body.insta;
  var wa = req.body.WA;
  var query = `UPDATE tb_instasi SET nama = ?, instasi = ?, no_wa = ? WHERE id_instasi = ?`;

  db.query(query, [name, instansi, wa, userId], (err) => {
      if (err) {
          console.error('terjadi kesalahan saat update user', err);
          res.send(err);
      } else {
          res.status(200).send('data diubah.'); // Change the response message as needed
      }
  });
});

router.post('/addInsta', (req, res) => {
  var name = req.body.nama;
  var instansi = req.body.Instasi;
  var wa = req.body.no_wa;
  var query = `INSERT INTO tb_instasi (name, instasi, no_wa) VALUES (?, ?, ?)`;
  db.query(query, [name, instansi, wa], (err) => {
    if(err) {
      console.error('terjadi kesalahan saat input user', err);
      res.send(err);
    } else {
      res.status(200).send({ message: 'data ditambahkan' });
    }
  });
});

router.get('/data-case', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/admin', 'tabel_solusi.html'));
});

router.get('/tabel_case', (req, res, next) => {
  const promiseQuery1 = new Promise((resolve, reject) => {
    db.query(`SELECT * 
    FROM tb_case 
    INNER JOIN tb_jenis_aduan ON tb_case.id_jenis_aduan = tb_jenis_aduan.id_jenis_aduan`, (err, rows) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  const promiseQuery2 = new Promise((resolve, reject) => {
    db.query(`SELECT * FROM tb_instasi`, (err, rows) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  Promise.all([promiseQuery1, promiseQuery2])
    .then((results) => {
      const [resultQuery1, resultQuery2] = results;
      // Gabungkan hasil dari kedua query jika diperlukan
      // Misalnya: const combinedResults = { query1Result: resultQuery1, query2Result: resultQuery2 };
      res.send({ query1Result: resultQuery1, query2Result: resultQuery2 });
    })
    .catch((err) => {
      console.error('Error executing queries:', err);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/getCaseData', (req, res) => {
  const userCase = req.query.userCase; // Ambil id_jenis_aduan dari query params

  // Query pertama
  const query1 = `SELECT *
  FROM tb_case
  INNER JOIN tb_instasi ON tb_instasi.id_instasi = tb_case.sol_1
  WHERE tb_case.id_jenis_aduan = ?;`;

  // Query kedua
  const query2 = `SELECT *
  FROM tb_case
  INNER JOIN tb_instasi ON tb_case.sol_2 = tb_instasi.id_instasi
  WHERE tb_case.id_jenis_aduan = ?;`;

  // Query ketiga
  const query3 = `SELECT *
  FROM tb_case
  INNER JOIN tb_instasi ON tb_case.sol_3 = tb_instasi.id_instasi
  WHERE tb_case.id_jenis_aduan = ?;`;

  const query4 = `SELECT * FROM tb_instasi`;

  // Eksekusi query ke database untuk mengambil data
  db.query(query1, [userCase], (err, result1) => {
    if (err) {
      console.error('Error executing query 1:', err);
      return res.status(500).send('Internal Server Error');
    }

    db.query(query2, [userCase], (err, result2) => {
      if (err) {
        console.error('Error executing query 2:', err);
        return res.status(500).send('Internal Server Error');
      }

      db.query(query3, [userCase], (err, result3) => {
        if (err) {
          console.error('Error executing query 3:', err);
          return res.status(500).send('Internal Server Error');
        }

        db.query(query4, (err, result4) => {
          if (err) {
            console.error('Error executing query 4:', err);
            return res.status(500).send('Internal Server Error');
          }

          // Menggabungkan hasil query menjadi satu objek
          const combinedResults = {
            query1Result: result1,
            query2Result: result2,
            query3Result: result3,
            query4Result: result4,
          };

          // Kirimkan hasil ke sisi klien (frontend)
          res.send(combinedResults);
        });
      });
    });
  });
});


router.post('/editCase', (req, res) => {
  const userCase = req.body.userCase;
  console.log(userCase);
  var sol1 = req.body.sol1;
  var sol2 = req.body.sol2;
  var sol3 = req.body.sol3;
  console.log(sol1, sol2, sol3);
  var query = `UPDATE tb_case SET sol_1 = ?, sol_2 = ?, sol_3 = ? WHERE id_case = ?`;

  db.query(query, [sol1, sol2, sol3, userCase], (err) => {
      if (err) {
          console.error('terjadi kesalahan saat update user', err);
          res.send(err);
      } else {
          res.status(200).send({ message: 'data diubah' }); // Change the response message as needed
      }
  });
});

module.exports = router;