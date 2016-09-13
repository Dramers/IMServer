var io = require('socket.io')();
var HashMap = require('hashmap');
var db = require('./module/db');
var dbManager = new db();

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
});



io.listen(3004);
console.log('listening on 3004');