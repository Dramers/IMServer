var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var uri = 'mongodb://localhost/mongoose-shared-connection';
mongoose.Promise = global.Promise;
global.db = mongoose.createConnection(uri);

var UserModel = require('../model/userModel');
var ErrorModel = require('../model/errorModel');

/* GET users listing. */
router.post('/register', function (req, res, next) {
	UserModel.find({username : req.body.username}, function (err, docs) {
		if (err) return next(err);

		if (docs.length > 0) {
			res.send(ErrorModel(1, 'username exist'));
			return;
		}

		UserModel.count(function (err, count) {

			if (err) return next(err);

			var model = new UserModel({
				userId : count + 1,
				name : req.body.name,
				username : req.body.username,
				password : req.body.password
			});

			model.save(function (err, doc) {
				if (err) return next(err);

				res.send(doc);
			});
		});
	});
});

router.post('/login', function (req, res, next) {

	UserModel.findOne({username : req.body.username}, function (err, doc) {
		if (err) return next(err);

		if (doc && req.body.password == doc.password) {
			doc.code = 0;
			var resDatas = {
				'userId' : doc.userId,
				'name' : doc.name,
				'msgServerTCPAddress' : 'localhost:3001'
			};
			res.send(doc);
		}
		else {
			res.send(ErrorModel(2, 'username or password error'));
		}
	});
	
});

router.post('/logout', function (req, res, next) {
	UserModel.findOne({userId : req.body.userId}, function (err, doc) {
		if (err) return next(err);

		if (doc) {
			// 删除信息
			res.send(ErrorModel(0, 'success'));
		}
		else {
			res.send(ErrorModel(3, 'user not exist'));
		}
	});
});

module.exports = router;
