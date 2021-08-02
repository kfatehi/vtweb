var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var db = require('../db');
var router = express.Router();

router.get('/', ensureLoggedIn(), async function(req, res, next) {
  let {rows:[user]} = await db.query('SELECT id, username, name FROM users WHERE id = $1', [ req.user.id ]);
  res.render('profile', { user });
});

module.exports = router;
