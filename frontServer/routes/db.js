function DBManager() {

	var mongoose = require('mongoose');
	var uri = 'mongodb://localhost/mongoose-shared-connection';
	mongoose.Promise = global.Promise;
	global.db = mongoose.createConnection(uri);

	var io = require('socket.io-client');
	var socket = io.connect('http://127.0.0.1:3004');
	socket.on('connect', function() {
		console.log('connect');
	});

	socket.on('disconnect', function() {
		console.log('disconnect');
	});

	this.register = function (name, username, password){
	};
}

module.exports = LoginClient;