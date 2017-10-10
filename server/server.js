var config = require('./config.json');
var logger = require('winston');
var io = require("socket.io");

// Setup logger
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.level = 'debug';

// setup server
var socket = io.listen(config.server.port);
socket.configure(function() {
	socket.set("transports", ["flashsocket", "htmlfile", "xhr-polling", "jsonp-polling"]);
	socket.set('flash policy port', 843);
	socket.set("log level", 2);
});

socket.sockets.on("connection", function(client) {
	logger.info("Client connected: " + client.id);
	
	client.on("message", function(data) {
		logger.info("Client message: data = " + JSON.stringify(data));
		
		client.emit("custom", {ball:"bag"});
	});
	
	client.on("disconnect", function(data) {
		logger.info("Client disconnected");
	});
});

logger.info("mpeng v" + config.server.version + " started up");
