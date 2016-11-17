function ConnectionManager(maxClientCount) {

	var HashMap = require('hashmap');
	var clientInfos = new HashMap();
	global.clientInfos = clientInfos;

	var db = require('./msgdb');
	var dbManager = new db();

	var MsgService = require('./msgService');
	var GroupService = require('./groupService');

	this.receiveClient = function (client) {
		client.on('disconnect', function () {
			var key = clientInfos.search(client);
			if (key) {
				clientInfos.remove(key);
			};
		});

		client.once('canConnect', function () {
			if (clientInfos.count() < maxClientCount) { 
				client.emit('canConnect', true)
			}
			else {
				client.emit('canConnect', false)
			}
		});

		client.once('getUserId', function (data) {
			var userId = data;

			clientInfos.set(userId, client);
			console.log('clientInfo set userId: ' + userId);

			MsgService(client);
			GroupService(client);
		});
	}
}

module.exports = ConnectionManager;