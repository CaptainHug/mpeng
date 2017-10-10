var Players = require("../logic/players.js");
var Player = require("../logic/player.js");


var messageHandler_lobby = function(client, data)
{
	console.log("messageHandler_lobby");
	
	if(data && data.cmd) {
		switch(data.cmd) {
			case "signup":
				onSignup(client, data);
			break;
			
			case "login":
				onLogin(client, data);
			break;
		}
	}
}

module.exports = messageHandler_lobby;


function onSignup(client, data)
{
	// get username / password from data
	var username = data.params.name;
	var password = data.params.password;
	
	// TODO: validate username / password
	
	// TODO: check username unique
	
	// TODO: create database account
	
	// log user in (notify user)
	onLogin(client, data);
}


function onLogin(client, data)
{
	// get username / password from data
	var username = data.params.name;
	var password = data.params.password;
	
	// TODO: validate username / password
	
	// TODO: set online status & last login in database
	
	// log user in
	var player = new Player();
	player.name = username;
	Players.addPlayer(client.id, player);
	
	// debug list of all the players
	var allPlayers = Players.getPlayers();
	for(var k in allPlayers) {
		if(allPlayers[k]) {
			console.log("allPlayers["+k+"] = " + allPlayers[k].name);
		}
	}
	
	// notify user
	// TODO: send back any useful account information to the client
	client.emit("message", {cmd:"loginOK", params:{name:username}});
}
