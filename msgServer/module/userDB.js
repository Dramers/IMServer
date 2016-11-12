function GroupUserDBManager() {
	var GroupUserModel = require('../model/GroupUserModel');

	function addUser(data, callback) {
		var model = new GroupUserModel({
			userId : data.userId,
			membersId : data.membersId,
		});

		model.save(function (err, doc) {
			callback(err, doc);
		});
	}

	this.add = function (data, callback) {
		addUser(data, callback)
	}

	this.query = function (userId, callback) {
		
		GroupUserModel.findOne({"userId" : userId}, function (err, doc) {

			if (doc) {
				callback(err, doc);
			}
			else {
				addUser({"userId" : userId}, function (err, doc) {
					callback(err, doc);
				});
			}
			
		});
	}

	this.update = function (data, callback) {
		GroupUserModel.findOne({"userId" : userId}, function (err, doc) {

			if (doc) {
				doc.membersId = data.membersId;
				doc.save(function (err, doc) {
					callback(err, doc);
				});
			}
			else {
				addUser(data, function (err, doc) {
					callback(err, doc);
				});
			}
			
		});
	}

	this.joinGroup = function (userId, groupId, callback) {
		this.query(userId, function (err, doc) {
			var groupIds = doc.groupIds;
			if (groupIds) {
				groupIds.push(groupId);
			}
			else {
				groupIds = [];
			}

			groupIds.push(groupId);
			doc.groupIds = groupIds;
			this.update(doc, callback);
		});
	}
}

module.exports = GroupUserDBManager;