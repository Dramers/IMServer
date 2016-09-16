function LoginClient() {
	var io = require('socket.io-client');
	var socket = io.connect('http://127.0.0.1:3004');

	var taskId = 0;
	var tasks = {};

	socket.on('connect', function() {
		console.log('connect');
	});

	socket.on('disconnect', function() {
		console.log('disconnect');
	});

	this.register = function (name, username, password, callback){
		sendTask('register', {
			'name' : name, 
			'username' : username,
			'password' : password,
		}, callback);
	};

	this.login = function (username, password, callback) {

		sendTask('login', {
			'username' : username,
			'password' : password,
		}, callback);
	};

	// buddy
	this.searchBuddyKeyword = function (keyword, callback) {
		sendTask('searchUsersKeyword', {
			'keyword' : keyword,
		}, callback);
	};

	this.addBuddys = function (userId, buddyIds, callback) {
		sendTask('addBuddys', {
			'userId' : userId,
			'buddyIds' : buddyIds
		}, callback);
	};

	this.removeBuddys = function (userId, buddyIds, callback) {
		sendTask('removeBuddys', {
			'userId' : userId,
			'buddyIds' : buddyIds
		}, callback);
	}

	this.queryBuddys = function (userId, callback) {
		sendTask('queryBuddys', {
			'userId' : userId
		}, callback);
	};

	// task method
	function sendTask(eventName, data, callback) {
		tasks[taskId++] = callback;
		data['taskId'] = taskId-1;
		socket.emit(eventName, data);
		socket.once(eventName, function (data) {
			taskFinished(data);
		});
	}

	function taskFinished(data) {
		var callback = tasks[data.taskId];
		if (callback) {
			var code = data.code;
			var result = data.result;
			callback({'code' : code, 'result' : result});
			tasks[data.taskId] = null;
		};
	}
}

module.exports = LoginClient;