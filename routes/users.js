var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// define the about route
router.get('/about', function(req, res) {
  res.send('About users');
});

module.exports = router;
