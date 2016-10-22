var io = require('socket.io')();
var HashMap = require('hashmap');
var db = require('./module/db');
var dbManager = new db();
var fs = require('fs');

var clientInfos = new HashMap();

var maxClientCount = 1000;

io.on('connection', function (client) {

	console.log('connection ' + client);
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

		client.on('message', function (data) {

			console.log('receive message data');
			var fromUserId = data.fromUserId;
			var toUserId = data.toUserId;
			console.log('receive message data ' + fromUserId + ' ' + toUserId);

			// save Msg
			dbManager.addMsg(data, function (err, doc) {
				if (err) { return client.emit('receiveError', err)};

				// receive 
				client.emit('messageStatus', {
					"msgId" : doc.msgId,
					'status' : 2
				});


				var toClient = clientInfos.get(toUserId);
				console.log('client: ' + toClient + ' toUserId: ' + toUserId);
				if (toClient) { 
					doc["sendDate"] = data.sendDate
					toClient.emit('message', doc);
					console.log('send client message');
				};
			});
		});

		client.on('messageStatus', function (data) {
			dbManager.updateMsgStatus(data.msgId, data.status, function (err, doc) {
				if (err) console.log('messageStatus update error' + err);
			});
		});

		client.on('createGroup', function (data) {

		});

		client.on('queryGroups', function (data) {
			
		});

		client.on('updateGroupInfo', function (data) {
			
		});

		client.on('deleteGroup', function (data) {
			
		});
	});
});

var config = JSON.parse(fs.readFileSync('server.config', 'utf-8'));

io.listen(Number(config["serverPort"]));
console.log('listening on ' + Number(config["serverPort"]));