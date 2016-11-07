function GroupService(client) {

	var groupDB = require('./groupDB');
	var dbManager = new groupDB();

	var Response = require('./Response');
	var response = new Response();

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
			response.send(client, data.taskId, err, doc, 'createGroup');
		});

		// 通知其他人
	});

	client.on('queryGroups', function (data) {
		
	});

	client.on('updateGroupInfo', function (data) {
		
	});

	client.on('deleteGroup', function (data) {
		
	});
}

module.exports = GroupService;