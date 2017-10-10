package network 
{
	import com.pnwrain.flashsocket.FlashSocket;
	import com.pnwrain.flashsocket.events.FlashSocketEvent;
	import flash.events.EventDispatcher;
	import flash.events.IEventDispatcher;
	
	/**
	 * ...
	 * @author jrh
	 */
	public class GameServer extends EventDispatcher 
	{
		// states
		public static const STATE_DISCONNECTED:String = "disconnected";
		public static const STATE_CONNECTING:String = "connecting";
		public static const STATE_CONNECTED:String = "connected";
		
		private var _socket:FlashSocket;
		private var _state:String;
		
		private var _clientId:String;
		
		
		
		public function GameServer() 
		{
			super(null);
			
			_socket = null;
			_state = STATE_DISCONNECTED;
		}
		
		
		// public API
		
		public function connect(host:String, port:int):void
		{
			if (_state != STATE_DISCONNECTED) return;
			if (_socket != null) return;
			
			_state = STATE_CONNECTING;
			
			_socket = new FlashSocket(host + ":" + port);
			_socket.addEventListener(FlashSocketEvent.CONNECT, onConnect);
			_socket.addEventListener(FlashSocketEvent.MESSAGE, onMessage);
			_socket.addEventListener(FlashSocketEvent.IO_ERROR, onError);
			_socket.addEventListener(FlashSocketEvent.SECURITY_ERROR, onError);
			
			// TODO: handle automatic disconnects from server
		}
		
		
		public function disconnect():void
		{
			if (_state != STATE_CONNECTED) return;
			
			if (_socket != null) {
				// disconnect from server
				_socket.emit("disconnect", null);
				
				// remove listeners
				_socket.removeEventListener(FlashSocketEvent.CONNECT, onConnect);
				_socket.removeEventListener(FlashSocketEvent.MESSAGE, onMessage);
				_socket.removeEventListener(FlashSocketEvent.IO_ERROR, onError);
				_socket.removeEventListener(FlashSocketEvent.SECURITY_ERROR, onError);
				
				// clean up socket
				_socket = null;
			}
			
			// change state and notify
			_state = STATE_DISCONNECTED;
			dispatchEvent(new GameServerEvent(GameServerEvent.onConnectionLost));
		}
		
		
		public function sendExtMessage(handler:String, cmd:String, params:Object):void
		{
			if (_state != STATE_CONNECTED) return;
			if (_socket == null) return;
			
			_socket.emit("message", { handler:handler, cmd:cmd, params:params } );
		}
		
		
		// event handlers
		private function onConnect(e:FlashSocketEvent):void 
		{
			if (_state == STATE_CONNECTED) return;
			
			// change state and notify
			_state = STATE_CONNECTED;
			dispatchEvent(new GameServerEvent(GameServerEvent.onConnection));
		}
		
		
		private function onMessage(e:FlashSocketEvent):void 
		{
			if (_state != STATE_CONNECTED) return;
			
			if (e && e.data) {
				dispatchEvent(new GameServerEvent(GameServerEvent.onExtensionResponse, false, false, e.data));
			}
		}
		
		
		private function onError(e:FlashSocketEvent):void 
		{
			trace("GameServer: onError - " + JSON.stringify(e.data));
		}
	}

}
