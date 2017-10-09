var config = require('./config.json');
var logger = require('winston');
var express = require("express");
var http = require("http");
var socketIo = require("socket.io");

// Setup logger
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.level = 'debug';

logger.info('mpeng starting up');

// setup server
var app = express();
var server = http.createServer(app);
var io = socketIo(server);

io.on("connection", function(client) {
	logger.info("Client connected");
	
	client.on("signup", function(data) {
		logger.info("Client signup: data = " + data);
	});
	
	client.on("login", function(data) {
		logger.info("Client login: data = " + data);
	});
	
	client.on("disconnect", function(data) {
		logger.info("Client disconnected");
	});
});

server.listen(config.server.port);
