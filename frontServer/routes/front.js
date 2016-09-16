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

// buddys
router.post('/searchBuddyKeyword', function (req, res, next) {

	loginConn.searchBuddyKeyword(req.body.keyword, function (doc) {
		res.send(doc);
	});
});

router.post('/addBuddys', function (req, res, next) {
	console.log('addBUddys buddyIds: ' + req.body.buddyIds);
	loginConn.addBuddys(req.body.userId, req.body.buddyIds, function (doc) {
		res.send(doc);
	});
});

router.post('/removeBuddys', function (req, res, next) {
	console.log('removeBuddys buddyIds: ' + req.body.buddyIds);
	loginConn.removeBuddys(req.body.userId, req.body.buddyIds, function (doc) {
		res.send(doc);
	});
});

router.post('/queryBuddys', function (req, res, next) {
	console.log('1223');
	loginConn.queryBuddys(req.body.userId, function (doc) {
		res.send(doc);
	});
});

module.exports = router;