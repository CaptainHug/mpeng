package network 
{
	import flash.events.Event;
	
	/**
	 * ...
	 * @author jrh
	 */
	public class GameServerEvent extends Event
	{
		// events
		public static const onConnection:String = "onConnection";
		public static const onConnectionLost:String = "onConnectionLost";
		public static const onExtensionResponse:String = "onExtensionResponse";
		
		
		public var data:Object;
		
		
		public function GameServerEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false, data:Object=null) 
		{
			super(type, bubbles, cancelable);
			
			this.data = data;
		}
		
	}

}
