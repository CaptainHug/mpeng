var config = require('./config.json');
var io = require("socket.io");
var Players = require("./logic/players.js");
var express = require("express");
var path = require("path");

// setup static http server
var app = express();
app.set("port", 3000);
app.use(express.static(path.join(__dirname, "public")));
var server = app.listen(app.get("port"), function() {
	var port = server.address().port;
	console.log("Static http server setup on port " + port);
});

// setup socket server
var socket = io.listen(config.server.port);
socket.configure(function() {
	socket.set("transports", ["websocket", "flashsocket", "htmlfile", "xhr-polling", "jsonp-polling"]);
	socket.set('flash policy port', 843);
	socket.set("log level", 2);
});

socket.sockets.on("connection", function(client) {
	console.log("Client connected: " + client.id);
	
	client.on("message", function(data) {
		console.log("Client message: data = " + JSON.stringify(data));
		
		// TODO: make this more automatic (but safe)
		if(data && data.handler) {
			switch(data.handler) {
				case "lobby":
					require("./messageHandlers/lobby.js")(client, data);
				break;
				
				case "game":
					require("./messageHandlers/game.js")(client, data);
				break;
			}
		}
	});
	
	client.on("disconnect", function(data) {
		console.log("Client disconnected");
		
		// TODO: clear online status in database
		
		// clean up user object
		Players.removePlayer(client.id);
		
		// TODO: move this into the game/room handler code
		// let everyone know that the player has left
		client.broadcast.emit("message", {cmd:"onBroadcastPlayerLeft", params:{playerId:client.id}});
	});
});

console.log("mpeng v" + config.server.version + " started up on port " + config.server.port);
