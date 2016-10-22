var io = require('socket.io')();
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('server.config', 'utf-8'));

var ConnectionManager = require('./module/connectionManager');
var connectionManager = new ConnectionManager(Number(config["maxClientCount"]))

io.on('connection', function (client) {
	connectionManager.receiveClient(client);
});

io.listen(Number(config["serverPort"]));
console.log('listening on ' + Number(config["serverPort"]));