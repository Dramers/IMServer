/* 
 * 删除数组中指定值 
 */  
Array.prototype.remove=function(value){    
  var len = this.length;  
  for(var i=0,n=0;i<len;i++){//把出了要删除的元素赋值给新数组    
    if(this[i]!=value){    
      this[n++]=this[i];  
    }else{  
      console.log(i);//测试所用  
    }  
  }    
  this.length = n;  
}; 

function GroupService(client) {

	var groupDB = require('./groupDB');
	var dbManager = new groupDB();

	var Response = require('./Response');
	var response = new Response();

	var GroupUserDB = require('./userDB');
	var userDB = new GroupUserDB();

	var OfflineMsgDB = require('../model/OfflineMsgModel');
	var offlineMsgDB = new OfflineMsgDB();

	function sendGroupNotiMemerIds(labelName, message, userIds) {
		for (var i = userIds.length - 1; i >= 0; i--) {
			var userId = userIds[i];
			sendGroupNoti(labelName, message, userId);
		};
	}

	function sendGroupNoti(labelName, message, toUserId) {

		if (toUserId == null) { return };

		var toClient = clientInfos.get(toUserId);
		console.log(' sendGroupNoti: ' + labelName + ' client: ' + toClient + ' toUserId: ' + toUserId + ' message: ' + message + ' toClient: ' + toClient);

		if (toClient) {
			toClient.emit(labelName, message);
		}
		else {
			offlineMsgDB.add(labelName, toUserId, message, null);
		}
	}

	client.on('createGroup', function (data) {
		console.log('createGroup' + data.userId);
		var groupName = data.groupName;
		var userId = data.userId;
		var memberIds = data.memberIds;
		var groupHeadImage = data.groupHeadImage;

		dbManager.add({
			groupName: groupName,
			groupHeadImage: groupHeadImage,
			creator: userId,
			memberIds: memberIds,
		}, function (err, doc) {

			if (err) {
				response.send(client, data.taskId, err, doc, 'createGroup');
				return;
			}

			userDB.joinGroup(userId, doc.groupId, function (err, doc) {
				response.send(client, data.taskId, err, doc, 'createGroup');
			});

			// 通知群友
			sendGroupNotiMemerIds('createGroupNoti', doc, memberIds);
		});
	});

	client.on('queryGroupList', function (data) {

		console.log('queryGroups user: ' + data.userId);

		userDB.query(data.userId, function (err, groupUserModel) {
			// console.log()

			if (err) { return response.send(client, data.taskId, err, null, 'queryGroupList'); };

			var groupIds = groupUserModel.groupIds;
			console.log('queryGroups query user groupIds count: ' + groupIds.length );


			if (groupIds.length == 0) {
				return response.send(client, data.taskId, null, [], 'queryGroupList');
			}

			var groups = [];
			var count = 0;

			console.log('===========' + groupIds);

			for (var i = 0; i < groupIds.length; i++) {
				var groupId = groupIds[i];
				console.log('queryGroups query group Id: ' + groupId );
				dbManager.query(groupId, function (err, doc) {

					console.log('queryGroups query group: ' + doc );
					count++;
					if (doc) {
						groups.push(doc);
					}

					if (count == groupIds.length) {
						response.send(client, data.taskId, null, groups, 'queryGroupList');
					}
				});
			}
		});
	});

	client.on('queryGroupInfo', function (data) {
		var groupId = data.groupId;

		dbManager.query(groupId, function (err, doc) {
			response.send(client, data.taskId, err, doc, 'queryGroupInfo');
			
		});
	});

	client.on('updateGroupInfo', function (data) {
		
		var groupId = data.groupId;
		var groupName = data.groupName;
		var userId = data.userId;
		var creator = data.creator;
		var groupHeadImage = data.groupHeadImage;

		dbManager.query(groupId, function (err, doc) {
			if (doc) {
				doc.groupName = groupName;
				doc.creator = creator;
				doc.groupHeadImage = groupHeadImage;

				dbManager.update(doc, function (err, doc) {
					response.send(client, data.taskId, err, null, 'updateGroupInfo');

					if (err == null && doc != null) {
						// 通知群友
						sendGroupNotiMemerIds('groupInfoUpdateNoti', doc, doc.memberIds);
					};
				});
			}
			else {
				response.send(client, data.taskId, err, null, 'updateGroupInfo');


			}
		});
	});

	client.on('deleteGroup', function (data) {
		var groupId = data.groupId;
		var userId = data.userId;

		dbManager.query(groupId, function(err, doc) {

			if (doc) {

				if (doc.creator != userId) {
					// 成员离群
					data.members = [userId];
					kickGroupMembers(data);
				}
				else {
					// 群主删群
					var members = doc.memberIds;

					if (members.length == 0) {
						dbManager.deleteGroup(groupId, function (err, doc) {
							response.send(client, data.taskId, err, null, 'deleteGroup');

							if (err == null && doc != null) {
								// 通知群友
								sendGroupNotiMemerIds('deleteGroupNoti', doc, doc.memberIds);
							};
						});
					}

					for (var i = members.length - 1; i >= 0; i--) {
						var memberId = members[i];
						var queryCount = 0;
						userDB.query(memberId, function (err, doc) {
							queryCount++;
							if (doc) {
								doc.groupIds.remove(groupId);
								userDB.update(doc, function	(err, doc) {});
							}

							if (queryCount == members.length) {
								dbManager.deleteGroup(groupId, function (err, doc) {
									response.send(client, data.taskId, err, null, 'deleteGroup');
									if (err == null && doc != null) {
										// 通知群友
										sendGroupNotiMemerIds('deleteGroupNoti', doc, doc.memberIds);
									};
								});
							};
						});

					};
				}
			}
			else {
				response.send(client, data.taskId, err, null, 'deleteGroup');
			}
			
		});
	});

	client.on('addGroupMembers', function (data) {
		var groupId = data.groupId;
		var userId = data.userId;
		var memberIds = data.memberIds;

		for (var i = memberIds.length - 1; i >= 0; i--) {
			var userId = memberIds[i];
			userDB.query(userId, function (err, doc) {
				if (doc) {
					doc.groupIds.remove(groupId);
					doc.groupIds.push(groupId);
					userDB.update(doc, function	(err, doc) {});
				};
			});
		};

		console.log('addGroupMembers: ' + memberIds);
		dbManager.query(groupId, function (err, doc) {
			if (doc) {

				// 去重
				var oldMembers = [];
				var addMembers = [];
				var newMembers = doc.memberIds;
				for (var i = memberIds.length - 1; i >= 0; i--) {
					var newID = memberIds[i]; 
					var have = false;
					for (var j = doc.memberIds.length - 1; j >= 0; j--) {
						oldMembers.push(doc.memberIds[j]);
						if (doc.memberIds[j] == newID) {
							have = true;
							break;
						};
					};

					if (have == false) {
						
						newMembers.push(newID);
						addMembers.push(newID);
					};
				};

				dbManager.update(doc, function (err, doc) {
					response.send(client, data.taskId, err, null, 'addGroupMembers');

					if (err == null) {
						// 通知群友
						sendGroupNotiMemerIds('groupMembersAddNoti', {
								"groupId" : groupId, 
								"memberIds" : addMembers,
								"userId" : userId
							}, doc.memberIds);
					};
				});
			}
			else { 
				response.send(client, data.taskId, err, null, 'addGroupMembers');
			}
		}); 
	});

	client.on('kickGroupMembers', function (data) {
		kickGroupMembers(data);
	});

	function kickGroupMembers(data) {
		var groupId = data.groupId;
		var userId = data.userId;
		var memberIds = data.memberIds;

		for (var i = memberIds.length - 1; i >= 0; i--) {
			var userId = memberIds[i];
			userDB.query(userId, function (err, doc) {
				if (doc) {
					doc.groupIds.remove(groupId);
					userDB.update(doc, function	(err, doc) {});
				};
			});
		};

		console.log('kickGroupMembers: ' + memberIds);
		dbManager.query(groupId, function (err, doc) {
			if (doc) {
				for (var i = memberIds.length - 1; i >= 0; i--) {
					doc.memberIds.remove(memberIds[i]);
				}

				dbManager.update(doc, function (err, doc) {
					response.send(client, data.taskId, err, null, 'kickGroupMembers');

					if (err == null) {
						// 发送给群成员通知
						sendGroupNotiMemerIds('groupMembersDelNoti', {
								"groupId" : groupId, 
								"memberIds" : memberIds,
								"userId" : userId
							}, doc.memberIds);
						// 发送给被踢的人通知
						sendGroupNotiMemerIds('groupMembersDelNoti', {
								"groupId" : groupId, 
								"memberIds" : memberIds,
								"userId" : userId
							}, memberIds);
					}
				});
			}
			else { 
				response.send(client, data.taskId, err, null, 'kickGroupMembers');
			}
		});
	}
}

module.exports = GroupService;