function GroupUserDBManager() {
	var GroupUserModel = require('../model/GroupUserModel');

	this.add = function (data, callback) {
		var model = new GroupUserModel({
			userId : data.userId,
			membersId : data.membersId,
		});

		model.save(function (err, doc) {
			callback(err, doc);
		});
	}

	this.query = function (userId, callback) {
		
		GroupUserModel.findOne({"userId" : userId}, function (err, doc) {

			if (doc) {
				callback(err, doc);
			}
			else {
				this.add({"userId" : userId}, function (err, doc) {
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
				this.add(data, function (err, doc) {
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

module.exports = GroupDBManager;