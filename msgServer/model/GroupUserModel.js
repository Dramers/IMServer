var Schema = require('mongoose').Schema;
var mySchema = Schema({
	userId : Number,
	groupIds : [String]
});

module.exports = db.model('GroupUserModel', mySchema);