var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', ({ root: 'public' }));
});

router.get('/layanan', (req, res) => {
  res.sendFile('services.html', ({ root: 'public' }));
});

router.get('/kontak', (req, res) => {
  res.sendFile('contact.html', ({ root: 'public' }));
});

router.get('/tentang', (req, res) => {
  res.sendFile('about.html', ({ root: 'public' }));
})

module.exports = router;
