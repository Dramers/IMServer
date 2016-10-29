var Schema = require('mongoose').Schema;
var mySchema = Schema({
	userId : Number,
	name : String,
	username : String,
	password : String,
	buddyIds : [Number],
	groupIds : [String]
});

module.exports = db.model('UserModel', mySchema);