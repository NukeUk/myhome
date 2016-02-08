var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My home' });
});

router.get('/api/db', function(req, res, next) {
  res.render('homeDB', { title: 'My home' });
});


module.exports = router;
