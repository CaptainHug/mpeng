var Players = require("../logic/players.js");
var Player = require("../logic/player.js");


var messageHandler_game = function(client, data)
{
	console.log("messageHandler_game");
	
	if(data && data.cmd) {
		switch(data.cmd) {
			case "joinRoom":
				onJoinRoom(client, data);
			break;
			
			case "move":
				onMove(client, data);
			break;
			
			case "chat":
				onChat(client, data);
			break;
		}
	}
}

module.exports = messageHandler_game;


function onJoinRoom(client, data)
{
	var player = Players.getPlayer(client.id);
	if(player) {
		// TODO: store room id into player object
		
		// reset player data for room
		player.x = 0;
		player.y = 0;
		
		// let player know that they have successfully entered the room
		client.emit("message", {cmd:"onJoinRoom", params:{player:JSON.stringify(player)}});
		
		// let everyone know that a player has entered the room
		client.broadcast.emit("message", {cmd:"onBroadcastJoinRoom", params:{playerId:client.id, player:JSON.stringify(player)}});
	}
}


function onMove(client, data)
{
	var player = Players.getPlayer(client.id);
	if(player) {
		// TODO: validate
		// set new player position
		player.x = data.params.posX;
		player.y = data.params.posY;
		
		// let everyone know that a player has moved
		client.broadcast.emit("message", {cmd:"onBroadcastMove", params:{playerId:client.id, posX:player.x, posY:player.y}});
	}
}


function onChat(client, data)
{
	var player = Players.getPlayer(client.id);
	if(player) {
		// TODO: validate / filter chat text
		var message = data.params.message;
		
		// let everyone know that a player has chatted
		client.broadcast.emit("message", {cmd:"onBroadcastChat", params:{playerId:client.id, message:message}});
	}
}
