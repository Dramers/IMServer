function GroupUserDBManager() {
	var GroupUserModel = require('../model/GroupUserModel');

	function addUser(data, callback) {
		var model = new GroupUserModel({
			userId : data.userId,
			groupIds : data.groupIds,
		});

		model.save(function (err, doc) {
			callback(err, doc);
		});
	}

	function updateUser (data, callback) {
		GroupUserModel.findOne({"userId" : data.userId}, function (err, doc) {

			if (doc) {
				doc.groupIds = data.groupIds;
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
		updateUser(data, callback);
	}

	this.joinGroup = function (userId, groupId, callback) {

		GroupUserModel.findOne({"userId" : userId}, function (err, doc) {
 
			if (doc) {
				var groupIds = doc.groupIds;
				if (groupIds == null) {
					groupIds = []; 
				}

				groupIds.push(groupId);
				doc.groupIds = groupIds;
				updateUser(doc, callback);
			}
			else {
				callback(err, doc);
			}
			
		});
	}
}

module.exports = GroupUserDBManager;