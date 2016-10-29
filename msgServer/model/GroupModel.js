var Schema = require('mongoose').Schema;
var mySchema = Schema({
	groupId : String,
	groupName : String,
	creatorId : Number,
	groupHeadImage : String,
	memberIds : [Number],
	updateDate : Date,
	createDate : Date
});

module.exports = db.model('GroupModel', mySchema);