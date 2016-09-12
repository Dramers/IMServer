var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/register', function (req, res, next) {
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	loginConn.register(name, username, password, function (doc) {
		console.log('register finished: ' + doc);
		res.send(doc);
	});

});

router.post('/login', function (req, res, next) {
	loginConn.login(req.body.username, req.body.password, function (doc) {
		res.send(doc);
	});
});

router.post('/logout', function (req, res, next) {
	next();
});

module.exports = router;