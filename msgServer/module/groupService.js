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
		
	});

	client.on('deleteGroup', function (data) {
		
	});
}

module.exports = GroupService;