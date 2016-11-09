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

	client.on('createGroup', function (data) {
		// console.log(.)
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

		});

		// 通知其他人
	});

	client.on('queryGroups', function (data) {
		userDB.query(data.userId, function (err, groupUserModel) {
			var groupIds = groupUserModel.groupIds;

			if (groupIds.length == 0) {
				return response.send(client, data.taskId, null, [], 'createGroup');
			}

			var groups = [];
			var count = 0;
			for (groupId in groupIds) {
				dbManager.query(groupId, function (err, doc) {
					count++;
					if (doc) {
						groups.push(doc);
					}

					if (count == groupIds.length) {
						response.send(client, data.taskId, null, groups, 'queryGroups');
					}
				});
			}
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
					response.send(client, data.taskId, err, doc, 'updateGroupInfo');
				});
			}
			else {
				response.send(client, data.taskId, err, doc, 'updateGroupInfo');
			}
		});
	});

	client.on('deleteGroup', function (data) {
		var groupId = data.groupId;
		var userId = data.userId;

		dbManager.deleteGroup(groupId, function (err, doc) {
			response.send(client, data.taskId, err, doc, 'deleteGroup');
		});
	});

	client.on('addGroupMembers', function (data) {
		var groupId = data.groupId;
		var userId = data.userId;
		var memberIds = data.memberIds;

		dbManager.query(groupId, function (err, doc) {
			if (doc) {
				doc.memberIds = memberIds;

				dbManager.update(doc, function (err, doc) {
					response.send(client, data.taskId, err, null, 'addGroupMembers');
				});
			}
			else { 
				response.send(client, data.taskId, err, null, 'addGroupMembers');
			}
		}); 
	});

	client.on('kickGroupMembers', function (data) {
		var groupId = data.groupId;
		var userId = data.userId;
		var memberIds = data.memberIds;

		dbManager.query(groupId, function (err, doc) {
			if (doc) {

				for (memberId in memberIds) {
					doc.memberIds.remove(memberId);
				}

				dbManager.update(doc, function (err, doc) {
					response.send(client, data.taskId, err, null, 'kickGroupMembers');
				});
			}
			else { 
				response.send(client, data.taskId, err, null, 'kickGroupMembers');
			}
		});
	});
}

module.exports = GroupService;