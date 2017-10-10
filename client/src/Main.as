package
{
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageQuality;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.utils.setTimeout;
	import network.GameServer;
	import network.GameServerEvent;

	/**
	 * ...
	 * @author jrh
	 */
	[Frame(factoryClass = "Preloader")]
	//[SWF(width="1013", height="665", backgroundColor="#000000", frameRate="30")]
	[SWF(width="1013", height="665", backgroundColor="#000000", frameRate="30")]
	public class Main extends Sprite 
	{
		private var _server:GameServer;
		
		
		public function Main() 
		{
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}

		private function init(e:Event = null):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, init);
			
			// entry point
			stage.scaleMode = StageScaleMode.SHOW_ALL;
			stage.align = StageAlign.TOP_LEFT;
			stage.quality = StageQuality.BEST;
			
			Resource.registerFonts();
			
			graphics.beginFill(0x000000);
			graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			graphics.endFill();
			
			var textfield:TextField = new TextField();
			textfield.embedFonts = true;
			textfield.defaultTextFormat = new TextFormat(Resource.F_BUMBASTIKA, 20, 0xffffff);
			textfield.text = "MPENG";
			textfield.width = 600;
			textfield.height = 600;
			addChild(textfield);
			
			trace("Hello");
			
			_server = new GameServer();
			_server.addEventListener(GameServerEvent.onConnection, onConnection);
			_server.addEventListener(GameServerEvent.onConnectionLost, onConnectionLost);
			_server.addEventListener(GameServerEvent.onExtensionResponse, onExtensionResponse);
			_server.connect(Config.SERVER.host, Config.SERVER.port);
			
			trace("done");
		}
		
		
		private function onConnection(e:GameServerEvent):void
		{
			trace("onConnection");
			
			_server.sendExtMessage("lobby", "signup", { name:"cramwell", password:"ballbags" } );
			
			trace("boom");
		}
		
		
		private function onExtensionResponse(e:GameServerEvent):void
		{
			trace("onExtensionResponse: " + JSON.stringify(e.data));
			
			if (e.data) {
				switch(e.data.cmd) {
					case "loginOK":
						if (e.data.params) {
							trace("login success: " + e.data.params.name);
						}
					break;
				}
			}
		}
		
		
		private function onConnectionLost(e:GameServerEvent):void
		{
			trace("onConnectionLost");
		}
		
	}

}
