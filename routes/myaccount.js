var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var db = require('../db');

var router = express.Router();

/* GET users listing. */
router.get('/',
  ensureLoggedIn(),
  function(req, res, next) {
    db.query('SELECT id, username, name FROM users WHERE id = $1', [ req.user.id ], function(err, results) {
      if (err) { return next(err); }
    
      let row = results.rows[0];
      var user = {
        id: row.id.toString(),
        username: row.username,
        displayName: row.name
      };
      res.render('profile', { user: user });
    });
  });

module.exports = router;
