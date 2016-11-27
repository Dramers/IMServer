function DBManager() {

	var fs = require('fs');
	var config = JSON.parse(fs.readFileSync('server.config', 'utf-8'));

	var mongoose = require('mongoose');
	var uri = config['db'];
	mongoose.Promise = global.Promise;
	global.db = mongoose.createConnection(uri);

	var MsgModel = require('../model/MsgModel');

	this.addMsg = function (data, callback){

		var model = new MsgModel({
			fromUserId : data.fromUserId,
			toUserId : data.toUserId,
			contentStr : data.contentStr,
			serverReceiveDate : new Date(),
			msgId : data.msgId,
			msgContentType : data.msgContentType,
			sessionId : data.sessionId,
			state : 1
		});

		model.save(function (err, doc) {
			data.serverReceiveDate = new Date().getTime() / 1000;
			data.state = 1;
			callback(err, data);
		});
	};

	this.updateMsgStatus = function (msgId, state, callback) {
		MsgModel.fineOne({ 'msgId' : msgId}, function (err, doc) {
			if (err) { return callback(err, doc)};

			doc.state = state;
			model.save(callback);
		});
	}

	this.queryOneMsg = function (msgId, callback) {
		MsgModel.fineOne({'msgId' : msgId}, callback);
	}
}

module.exports = DBManager;