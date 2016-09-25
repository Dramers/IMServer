var Schema = require('mongoose').Schema;
var mySchema = Schema({
	fromUserId : Number,
	toUserId : Number,
	contentStr : String,
	serverReceiveDate : Date,
	msgId : String,
	msgContentType : Number,
	sessionId : String,
	state : Number  // 1为服务器已收 2为对方已收 3为对方已读
});

module.exports = db.model('offlineMsgModel', mySchema);