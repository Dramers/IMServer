function LoginClient() {
	var io = require('socket.io-client');
	var fs = require('fs');
	var config = JSON.parse(fs.readFileSync('server.config', 'utf-8'));
	var loginUrl = config['loginServers'][0];
	console.log('connect loginserver ' + loginUrl);
	var socket = io.connect(loginUrl);

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

		console.log('queryMsgServerAddress login'); 
		this.queryMsgServerAddress(function (err, address) {
			if (err) { return callback({'code' : 1, 'result' : err.message}); }

			console.log('queryMsgServerAddress login begin'); 
			sendTask('login', {
				'username' : username,
				'password' : password,
			}, function (data) {
	
				var code = data.code;
				var result = data.result;
				if (code == 0) { result.msgServerAddress = address; };
				
				callback({'code' : code, 'result' : result});
			});
		});
		
	};

	this.queryMsgServerAddress = function (callback) {
		console.log('queryMsgServerAddress');
		testMsgServerAddress(0, config['msgServers'], function (err, address) {
			callback(err, address);
		});
	}

	function testMsgServerAddress (index, addresses, callback) {
		// body...
		if (index >= addresses.length) { return callback(new Error('no free msgServer'), null)};

		console.log('testMsgServerAddress ' + index + ' ' + addresses);
		var address = addresses[index];
		var msgConnect = io.connect(address);
		msgConnect.on('connect', function() {
			console.log('testMsgServerAddress connect');
			msgConnect.emit('canConnect');

			msgConnect.once('canConnect', function (data) {

				console.log('testMsgServerAddress receive ' + data);
				if (data) {
					callback(null, address);
				}
				else {
					testMsgServerAddress(index+1, addresses, callback);
				}

				msgConnect.close();
			});
		});
	}

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

	this.queryUserInfo = function (userId, callback) {
		sendTask('queryUserInfo', {
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