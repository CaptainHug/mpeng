var messageHandler_game = function(client, data)
{
	console.log("messageHandler_game");
	
	client.emit("message", {cmd:"fromGame", params:{}});
	
	if(data && data.cmd) {
		switch(data.cmd) {
			case "joinRoom":
				
			break;
			
			case "move":
				
			break;
			
			case "chat":
				
			break;
		}
	}
}


module.exports = messageHandler_game;
