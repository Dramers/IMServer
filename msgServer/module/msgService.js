function MsgService(client) {
	var db = require('./msgdb');
	var dbManager = new db();

	var groupDB = require('./groupDB');
	var groupDBManager = new groupDB();

	function queryGroup(groupId, callback) {
		groupDBManager.query(groupId, callback);
	}
 
	function sendMessage(toUserId, message) {
		var toClient = clientInfos.get(toUserId);
		console.log(' sendMessage: ' + toClient + ' toUserId: ' + toUserId + ' Content: ' + message.contentStr);
		if (toClient) { 
			message["sendDate"] = message.sendDate;
			toClient.emit('message', message);
		};
	}

	client.on('message', function (data) {

		// save Msg
		dbManager.addMsg(data, function (err, doc) {
			if (err) { return client.emit('receiveError', err)};

			// receive 
			client.emit('messageStatus', {
				"msgId" : doc.msgId,
				'status' : 2
			});
			
			var sessionId = data.sessionId;
			if (sessionId) {
				// 群组消息
				// 获取群组
				queryGroup(sessionId, function (err, doc) {

					// 未找到群组信息
					if (err) { return };

					var fromUserId = data.fromUserId;
					var memberIds = doc.memberIds;
					for (var i = memberIds.length - 1; i >= 0; i--) {
						var userId = memberIds[i];
						
						if (userId != fromUserId) {
							sendMessage(userId, data);
						};
					};
				});
			}
			else {
				// 个人消息
				sendMessage(data.toUserId, data);
			}
		});
	});

	client.on('messageStatus', function (data) {
		dbManager.updateMsgStatus(data.msgId, data.status, function (err, doc) {
			if (err) console.log('messageStatus update error' + err);
		});
	});
}

module.exports = MsgService;