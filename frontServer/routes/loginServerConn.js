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
		tasks[taskId++] = callback;

		socket.emit('register', {
			'name' : name, 
			'username' : username,
			'password' : password,
			'taskId' : taskId-1
		});


	};

	socket.on('register', function(data) {
		taskFinished(data);
	});

	this.login = function (username, password, callback) {
		tasks[taskId++] = callback;

		socket.emit('login', {
			'username' : username,
			'password' : password,
			'taskId' : taskId-1
		});
	};

	socket.on('login', function(data) {
		taskFinished(data);
	});

	this.searchBuddyKeyword = function (keyword, callback) {
		tasks[taskId++] = callback;
		socket.emit('searchUsersKeyword', {
			'keyword' : keyword,
			'taskId' : taskId-1
		});
	};

	socket.on('searchUsersKeyword', function (data) {
		taskFinished(data);
	});

	// task finished
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