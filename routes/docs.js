var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var db = require('../db');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Set S3 endpoint to Vultr Object Storage
const spacesEndpoint = new aws.Endpoint('ewr1.vultrobjects.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'vtmedia',
    acl: 'public-read',
    key: function (req, file, cb) {
      console.log(file);
      cb(null, req.user.id+'-'+Date.now().toString()+'-'+file.originalname);
    }
  })
}).single('upload');

var router = express.Router();

router.get('/', ensureLoggedIn(), async function(req, res, next) {
  let {rows: docs} = await db.query('SELECT * FROM docs WHERE user_id = $1', [req.user.id]);
  res.render('docs/index', { user: req.user, docs });
});

router.get('/new', ensureLoggedIn(), async function(req, res, next) {
  let {rows:[user]} = await db.query('SELECT id, username, name FROM users WHERE id = $1', [ req.user.id ]);
  res.render('docs/new', { user });
});

router.post('/', ensureLoggedIn(), function(req, res, next) {
	upload(req, res, function(error) {
		if (error) {
			console.log(error);
			return res.send('error');
		}
    let query = {
      text: 'INSERT INTO docs (user_id, title, originalname, mimetype, url) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [
        req.user.id,
        req.file.originalname,
        req.file.originalname,
        req.file.mimetype,
        req.file.location
      ]
    }
    db.query(query, (err, {rows:[doc]})=>{
      if (err) { return next(err) }
      return res.json({location: '/docs/'+doc.id});
    });
	});
});

router.get('/:id', ensureLoggedIn(), async function(req, res, next) {
  let {rows: [doc]} = await db.query('SELECT * FROM docs WHERE user_id = $1 AND id = $2', [req.user.id, req.params.id]);
  console.log(doc);
  res.render('docs/show', { user: req.user, doc });
});

module.exports = router;
