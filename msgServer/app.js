var io = require('socket.io')();
var HashMap = require('hashmap');
var db = require('./module/db');
var dbManager = new db();

var clientInfos = new HashMap();

var maxClientCount = 1000;

io.on('connection', function (client) {

	client.once('canConnect', function () {
		if (clientInfos.count() < maxClientCount) { 
			client.emit('canConnect', true)
		}
		else {
			client.emit('canConnect', false)
		}
	});

	client.once('getUserId', function (data) {
		var userId = data.userId;

		clientInfos.set(userId, client);

		client.on('message', function (data) {
			var fromUserId = data.fromUserId;
			var toUserId = data.toUserId;

			// save Msg
			dbManager.addMsg(data, function (err, doc) {
				if (err) { return client.emit('receiveError', err)};

				// receive 
				client.emit('messageStatus', {
					"msgId" : doc.msgId,
					'status' : 2
				});

				var toClient = clientInfos.get(toUserId);
				if (toClient) { toClient.emit('message', data)};
			});
		});

		client.on('messageStatus', function (data) {
			dbManager.updateMsgStatus(data.msgId, data.status, function (err, doc) {
				if (err) console.log('messageStatus update error' + err);
			});
		});
	});
});

io.listen(3005);
console.log('listening on 3005');