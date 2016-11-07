function Response() {

	this.send = function (client, taskId, err, doc, emitName) {
		if (err) {
			this.sendError(client, taskId, err, emitName);
		}
		else {
			this.sendRes(client, taskId, doc, emitName);
		}
	};

	this.sendError = function (client, taskId, result, emitName) {
		// body...
		res = {'code': 1, 'taskId': taskId, 'result': result};
		client.emit(emitName, res);
	};

	this.sendRes = function (client, taskId, result, emitName) {
		res = {'code': 0, 'taskId': taskId, 'result': result};
		client.emit(emitName, res);
	};
}

module.exports = Response;