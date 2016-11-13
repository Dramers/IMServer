function GroupDBManager() {
	var GroupModel = require('../model/GroupModel');
	var uuid = require('node-uuid');  

	this.add = function (data, callback) {
		var uuidStr = uuid.v4();
		var date = new Date();
		console.log("create new group groupId is: " + uuidStr);
		console.log("date: " + date + " " + data.creator + "time: " + date.getTime()/1000);

		var model = new GroupModel({
			groupId: uuid.v4(),
			groupName: data.groupName,
			groupHeadImage: data.groupHeadImage,
			creator: data.creator,
			memberIds: data.memberIds,
			updateDate: date.getTime()/1000, 
			createDate: date.getTime()/1000,
		});

		model.save(function (err, doc) {
			callback(err, doc);
		});
	}

	this.query = function (groupId, callback) {
		GroupModel.findOne({"groupId" : groupId}, function (err, doc) {
			callback(err, doc);
		});
	}

	this.update = function (data, callback) {
		var date = new Date();
		data.updateDate = date.getTime()/1000;
		data.save(callback);
	}

	this.deleteGroup = function (groupId, callback) {
		GroupModel.remove({"groupId" : groupId}, callback);
	}
}

module.exports = GroupDBManager;