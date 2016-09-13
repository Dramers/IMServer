function DBManager() {

	var mongoose = require('mongoose');
	var uri = 'mongodb://localhost/mongoose-shared-connection';
	mongoose.Promise = global.Promise;
	global.db = mongoose.createConnection(uri);

	var UserModel = require('../model/userModel');
	var ErrorModel = require('../model/errorModel');

	function newUserId(callback) {
		UserModel.count(function(err, count) {
			callback(err, count);
		});
	};

	this.newUserId = function(callback) {
		newUserId(callback);
	};

	this.add = function (username, password, name, callback){

		newUserId(function (err, count) {
			if (err) return callback(err, doc);

			console.log('name: ' + name);
			console.log('password: ' + password);
			console.log('username: ' + username);
			var model = new UserModel({
				userId : count + 1,
				name : name,
				username : username,
				password : password
			});

			model.save(function (err, doc) {
				if (err) return callback(err, doc);;

				callback(err, doc);
			});
		});
		
	};

	this.findOne = function (userId, username, callback) {
		var searchInfo = {};

		if (userId) { searchInfo.userId = userId};
		if (username) { searchInfo.username = username};

		UserModel.findOne(searchInfo, function (err, doc) {
			callback(err, doc);
		});

	};

	this.searchKeyword = function (keyword, callback) {

		var qs = '/' + keyword + '/';
		console.log('searchKeyword: ' + qs);
		UserModel.find({'username': new RegExp(keyword)}, function (err, docs) {
			console.log('searchKeyword finished: ' + docs.length);
			callback(err, docs);
		});
	};
}

module.exports = DBManager;