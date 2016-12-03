function MsgService(client) {
	var db = require('./msgdb');
	var msgDBManager = new db();

	var groupDB = require('./groupDB');
	var groupDBManager = new groupDB();

	var OfflineMsgDB = require('../model/OfflineMsgModel');
	var offlineMsgDB = new OfflineMsgDB();

	var Response = require('./Response');
	var response = new Response();

	function queryGroup(groupId, callback) {
		groupDBManager.query(groupId, callback);
	}
 
	function sendMessage(toUserId, message) {
		var toClient = clientInfos.get(toUserId);
		console.log(' sendMessage: ' + toClient + ' toUserId: ' + toUserId + ' Content: ' + message.contentStr);
		if (toClient) { 
			message["sendDate"] = message.sendDate;
			toClient.emit('message', message);

			// 单人消息的回执
			if (message.sessionId == null) {
				sendMessageState(message.fromUserId, message.msgId, 2);
			};
		}
		else {
			// 存入离线消息
			offlineMsgDB.add('message', toUserId, message, null);
		}
	}

	function sendMessageState(toUserId, msgId, state) {
		var fromClient = clientInfos.get(toUserId);
		// 单人消息的回执
		if (fromClient) {
			fromClient.emit('messageStatus', {'msgId' : msgId, 'status' : state});

			msgDBManager.updateMsgStatus(msgId, 2, function (err, doc) {
				console.log('updateMsgStatus with user: ' + toUserId + ' err: ' + err + ' msgId: ' + msgId);
			});
		}
		else {
			// 离线存储
			offlineMsgDB.add('messageStatus', toUserId, {
				"msgId" : msgId,
				'status' : state
			}, null);
		}
	}

	client.on('message', function (data) {

		// save Msg
		msgDBManager.addMsg(data, function (err, doc) {
			if (err) { return client.emit('receiveError', err)};

			// receive 
			sendMessageState(data.fromUserId, doc.msgId, 1);
			
			var sessionId = data.sessionId;
			if (sessionId) {
				// 群组消息
				// 获取群组
				queryGroup(sessionId, function (err, doc) {

					// 未找到群组信息
					if (err) { return };

					var memberIds = doc.memberIds;
					for (var i = memberIds.length - 1; i >= 0; i--) {
						var userId = memberIds[i];
						
						if (userId != data.fromUserId) {
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

	client.on('queryOffineMessage', function (data) {
		console.log('queryOffline Message1');
		offlineMsgDB.query(data.userId, function (err, doc) {

			console.log('queryOffline Message length: ' + doc.length);
			if (err) {
				response.send(client, data.taskId, err, doc, 'queryOffineMessage');
				return;
			};

			if (doc.length == 0) {
				response.send(client, data.taskId, err, [], 'queryOffineMessage');
				return;
			}

			for (var i = doc.length - 1; i >= 0; i--) {
				var offlineMsg = doc[i];

				// 消息的离线
				if (offlineMsg.labelName == 'message') {
					var message = offlineMsg.content;
					console.log('queryOffline Message content: ' + message);
					if (message.sessionId != null) {
						sendMessageState(fromUserId, message.msgId, 2);
					}
				}
			}

			response.send(client, data.taskId, err, doc, 'queryOffineMessage');

			offlineMsgDB.delete(data.userId, function (err, doc) {
				console.log('delete offlineMsg with user: ' + data.userId + ' err: ' + err);
			});
		});
	});

	client.on('queryMessageInfo', function (data) {
		msgDBManager.queryOneMsg(data.msgId, function (err, doc) {
			response.send(client, data.taskId, err, doc, 'queryMessageInfo');
		});
	});

	client.on('messageStatus', function (data) {

		var msgIds = data.msgIds;
		for (var i = msgIds.length - 1; i >= 0; i--) {
			var msgId = msgIds[i];
			msgDBManager.queryOneMsg(msgId, function (err, doc) {
				if (err == null && doc != null) {
					sendMessageState(doc.fromUserId, msgId, data.state);
				};
			});
		};
	});
}

module.exports = MsgService;