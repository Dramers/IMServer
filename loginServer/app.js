var io = require('socket.io')();
var HashMap = require('hashmap');
var db = require('./module/db');
var dbManager = new db();
var fs = require('fs');

var UserModel = require('./model/userModel');
var ErrorModel = require('./model/errorModel');

function sendError (client, taskId, result, emitName) {
	// body...
	res = {'code': 1, 'taskId': taskId, 'result': result};
	client.emit(emitName, res);
};

function sendRes (client, taskId, result, emitName) {
	res = {'code': 0, 'taskId': taskId, 'result': result};
	client.emit(emitName, res);
};

io.on('connection', function(client){

	// login method
	client.on('login', function (data) {
		dbManager.findOne(null, data.username, function (err, doc) {
			if (err) return sendError(client, data.taskId, err.message, 'login');
			if (doc && doc.password == data.password) {
				return sendRes(client, data.taskId, doc, 'login'); 
			}

			sendError(client, data.taskId, 'username or password error', 'login');
		});
	});

	client.on('register', function (data) {

		var username = data.username;
		var name = data.name;
		var password = data.password;
		var taskId = data.taskId;
		dbManager.findOne(null, username, function (err, doc) {

			var res = {};

			if (err) {
				return sendError(client, taskId, err.message, 'register');
			}

			if (doc) {
				return sendError(client, taskId, 'username exist', 'register');
			}

			dbManager.add(username, password, name, function (err , doc) {
				if (err) {
					return sendError(client, taskId, err.message, 'register');
				} 

				sendRes(client, data.taskId, doc, 'register');
			});
		});
	});

	client.on('logout', function (data) {
		console.log('logout' + data);
	});

	// buddys 
	client.on('searchUsersKeyword', function (data) {
		console.log('searchUsersKeyword: ' + data);
		dbManager.searchKeyword(data.keyword, function (err, docs) {
			if (err) { return sendError(client, data.taskId, err.message, 'searchUsersKeyword')};

			sendRes(client, data.taskId, docs, 'searchUsersKeyword');
		});
	});

	client.on('queryBuddys', function (data) {
		dbManager.findOne(data.userId, null, function (err, doc) {
			if (err) sendError(client, data.taskId, err.message, 'queryBuddys');

			if (!doc) sendError(client, data.taskId, 'user not exist', 'queryBuddys');

			var buddys = [];
			var searchCount = 0;
			console.log('queryBuddys' + doc.buddyIds);
			console.log('queryBuddys lentth: ' + doc.buddyIds.length);
			if (doc.buddyIds.length == 0) { return sendRes(client, data.taskId, buddys, 'queryBuddys'); };

			for (var i = doc.buddyIds.length - 1; i >= 0; i--) {
				var buddyId = doc.buddyIds[i];
				console.log('queryBuddys ' + buddyId);
				dbManager.findOne(buddyId, null, function (err, subDoc) {
					console.log('queryBuddys' + buddyId + ' ' + err);
					if (subDoc) {
						buddys.push(subDoc);
					};
					searchCount++;

					if (searchCount == doc.buddyIds.length) {
						sendRes(client, data.taskId, buddys, 'queryBuddys');
					};
				});
			};
		});
	});

	client.on('queryUserInfo', function (data) {
		console.log('queryUserInfo ' + data.userId);
		dbManager.findOne(data.userId, null, function (err, doc) {
			if (err) { return sendError(client, data.taskId, err.message, 'queryUserInfo')};

			if (!doc) return sendError(client, data.taskId, 'user not exist', 'queryUserInfo');

			sendRes(client, data.taskId, doc, 'queryUserInfo');
		})
	});

	client.on('addBuddys', function (data) {
		console.log('addBuddys' + data);
		dbManager.findOne(data.userId, null, function (err, doc) {
			if (err) sendError(client, data.taskId, err.message, 'addBuddys');

			if (!doc) sendError(client, data.taskId, 'user not exist', 'addBuddys');

			console.log('add buddys is111 ' + data.buddyIds);

			for (var i = data.buddyIds.length - 1; i >= 0; i--) {
				var needAddBuddyId = data.buddyIds[i]
				console.log('add buddys is222 ' + needAddBuddyId);
				var needAdd = true;

				for (var i = doc.buddyIds.length - 1; i >= 0; i--) {
					var buddyId = doc.buddyIds[i]
					if (needAddBuddyId == buddyId) {
						needAdd = false;
						break;
					}
				}

				if (needAdd) { doc.buddyIds.push(needAddBuddyId); }
			};
			
			console.log('add buddys is ' + doc.buddyIds);

			dbManager.update(doc, function (err, doc) {
				if (err) { return sendError(client, data.taskId, err.message, 'addBuddys')};

				sendRes(client, data.taskId, null, 'addBuddys');
			});
		});
	});

	client.on('removeBuddys', function (data) {
		console.log('removeBuddys' + data);
		dbManager.findOne(data.userId, null, function (err, doc) {
			if (err) sendError(client, data.taskId, err.message, 'removeBuddys');

			if (!doc) sendError(client, data.taskId, 'user not exist', 'removeBuddys');

			console.log('remove buddys is111 ' + data.buddyIds);

			for (var i = data.buddyIds.length - 1; i >= 0; i--) {
				var needAddBuddyId = data.buddyIds[i]
				console.log('remove buddys is222 ' + needAddBuddyId);
				for (var i = doc.buddyIds.length - 1; i >= 0; i--) {
					var buddyId = doc.buddyIds[i]
					if (needAddBuddyId == buddyId) {
						doc.buddyIds.splice(i, 1);
						break;
					}
				}
			};
			
			console.log('remove buddys is ' + doc.buddyIds);

			dbManager.update(doc, function (err, doc) {
				if (err) { return sendError(client, data.taskId, err.message, 'removeBuddys')};

				sendRes(client, data.taskId, null, 'removeBuddys');
			});
		});
	});


});



var config = JSON.parse(fs.readFileSync('server.config', 'utf-8'));

io.listen(Number(config["serverPort"]));
console.log('listening on ' + Number(config["serverPort"]));