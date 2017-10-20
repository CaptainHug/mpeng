// globals
players = {};


function Players()
{
	// constructor
}


// static functions
Players.addPlayer = function(clientId, player)
{
	players[clientId] = player;
}


Players.removePlayer = function(clientId)
{
	console.log("Removing player: " + clientId);
	
	delete players[clientId];
	players[clientId] = null;
}


Players.getPlayer = function(clientId)
{
	return players[clientId];
}


Players.getPlayers = function()
{
	return players;
}


module.exports = Players;
