var errorModel = {

}

module.exports = function(errorCode, message) {
	var error = new Error(message);
	error.code = errorCode;
	error.msg = message;
	return error;
};