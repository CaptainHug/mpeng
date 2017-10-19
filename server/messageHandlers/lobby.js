var db = require('../lib/database.js');
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
	if(data && data.params) {
		// get username / password from data
		var username = data.params.name;
		var password = data.params.password;
		
		// TODO: validate username / password
		
		// check username unique
		var query = "select userid from User where name=?";
		db.query(query, [username], function(err, result) {
			if(err) {
				console.log("lobby:onSignup - error: " + err);
				client.emit("message", {cmd:"onSignupError", params:{reason:"error"}});
				return;
			}
			else if(result && result.length > 0) {
				console.log("lobby:onSignup - username exists");
				client.emit("message", {cmd:"onSignupError", params:{reason:"exists"}});
				return;
			}
			else {
				// create database account
				query = "insert into User (name, password, created, lastlogin) values (?, md5(?), now(), now())";
				db.query(query, [username, password], function(err, result) {
					if(err) {
						console.log("lobby:onSignup - insert error: " + err);
						client.emit("message", {cmd:"onSignupError", params:{reason:"error"}});
						return;
					}
					
					if(result) {
						var userId = result.insertId;
						client.emit("message", {cmd:"onSignupOK", params:{userId:userId, name:username}});
						return;
					}
				});
			}
		});
	}
}


function onLogin(client, data)
{
	// get username / password from data
	var username = data.params.name;
	var password = data.params.password;
	
	// TODO: validate username / password
	
	// check if user exists with name/password combination
	var query = "select userid from User where name=? and password=md5(?) limit 1";
	db.query(query, [username, password], function(err, result) {
		if(result && result.length > 0) {
			
			var userId = result[0]["userid"];
			
			// set lastlogin in database
			query = "update User set lastlogin=now() where userId=?";
			db.query(query, [userId], function(err, result) {});
			
			// log user in
			var player = new Player();
			// TODO: store player db userid
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
			client.emit("message", {cmd:"onLoginOK", params:{userId:userId, name:username}});
			
		}
		else {
			// login error
			console.log("lobby:onLogin - login error");
			client.emit("message", {cmd:"onLoginError", params:{reason:"error"}});
			return;
		}
	});
}
