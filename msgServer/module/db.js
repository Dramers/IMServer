function DBManager() {

	var mongoose = require('mongoose');
	var uri = 'mongodb://localhost/mongoose-shared-connection';
	mongoose.Promise = global.Promise;
	global.db = mongoose.createConnection(uri);

	var MsgModel = require('../model/MsgModel');
	var SessionModel = require('../model/SessionModel');

	function newMsgId(callback) {
		MsgModel.count(function(err, count) {
			callback(err, count);
		});
	};

	function newSessionId(callback) {
		SessionModel.count(function(err, count) {
			callback(err, count);
		});
	};

	this.newMsgId = function(callback) {
		newMsgId(callback);
	};

	this.addMsg = function (data, callback){

		newMsgId(function (err, msgCount) {
			if (err) return callback(err, doc);

			var model = new MsgModel({
				fromUserId : data.fromUserId,
				toUserId : data.toUserId,
				contentStr : data.contentStr,
				serverReceiveDate : Date.now,
				msgId : msgCount + 1,
				msgContentType : data.msgContentType,
				sessionId : data.sessionId,
				state : 1
			});

			model.save(function (err, doc) {
				callback(err, doc);
			});
			
		});
		
	};

	this.updateMsgStatus = function (msgId, state, callback) {
		MsgModel.fineOne({ 'msgId' : msgId}, function (err, doc) {
			if (err) { return callback(err, doc)};

			doc.state = state;
			model.save(callback);
		});
	} 

	this.update = function (userModel, callback) {
		userModel.save(function (err, doc) {
			callback(err, doc);
		});
	}

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