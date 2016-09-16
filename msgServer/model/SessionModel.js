var Schema = require('mongoose').Schema;
var mySchema = Schema({
	sessionId : Number,
	type : Number,
	title : String,
	lastMsgId : Number,
	lastMsgPlaceholder : String,
	headURLStr : String,
});

module.exports = db.model('SessionModel', mySchema);