var Schema = require('mongoose').Schema;
var mySchema = Schema({
	userId : Number,
	labelName: String, // 为回执的标签信息，如: 消息为message，消息状态为messageStatus..
	content: String, // 内容 为json字符串, 若不能解析则直接返回字符串
});

var OfflineMsgModel = db.model('OfflineMsgModel', mySchema);

function OfflineMsgModelDB() {

	this.add = function (labelName, userId, content, callback) {
		var jsonStr = content.toJSONString();
		var contentStr = content;

		if (jsonStr) {
			contentStr = jsonStr;
		};

		var model = new OfflineMsgModel({
			labelName : labelName,
			userId : userId,
			content : contentStr,
		});

		model.save(function (err, doc) {

			console.log('Offline Msm Model Save\nlabelName: ' + labelName +'\nuserId: ' + userId + '\ncontent: ' + contentStr + '\nerr: ' + err);

			if (callback) {
				callback(err, doc);
			};
			
		});
	}

	this.delete = function (userId, callback) {
		OfflineMsgModel.remove({"userId" : userId}, callback);
	}

	this.query = function (userId, callback) {
		OfflineMsgModel.fine({"userId" : userId}, function (err, docs) {

			if (err == null && docs != null) {
				for (var i = docs.length - 1; i >= 0; i--) {
					var offlineMsg = docs[i];
					var obj = JSON.parse(offlineMsg.content);
					if (obj) {
						offlineMsg.content = obj;
					}
				}
			};

			callback(err, docs);
		});
	}
}

module.exports = OfflineMsgModelDB;