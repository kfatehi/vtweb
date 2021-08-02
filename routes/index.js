var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) { 
  res.render('index', { user: req.user });
});

module.exports = router;
