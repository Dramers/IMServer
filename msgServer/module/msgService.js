function MsgService(client) {
	var db = require('./msgdb');
		var dbManager = new db();

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
			console.log(' : ' + toClient + ' toUserId: ' + toUserId);
			if (toClient) { 
				doc["sendDate"] = data.sendDate
				toClient.emit('message', doc);
			};
		});
	});

	client.on('messageStatus', function (data) {
		dbManager.updateMsgStatus(data.msgId, data.status, function (err, doc) {
			if (err) console.log('messageStatus update error' + err);
		});
	});
}

module.exports = MsgService;