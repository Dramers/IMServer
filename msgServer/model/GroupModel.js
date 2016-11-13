var Schema = require('mongoose').Schema;
var mySchema = Schema({
	groupId : String,
	groupName : String,
	creator : Number,
	groupHeadImage : String,
	memberIds : [Number],
	updateDate : Number,
	createDate : Number
});

module.exports = db.model('GroupModel', mySchema);