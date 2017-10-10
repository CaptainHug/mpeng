package 
{
	import flash.text.Font;
	/**
	 * ...
	 * @author jrh
	 */
	public class Resource 
	{
		
		public function Resource() 
		{
			
		}
		
		
		// fonts
		[Embed(source = '/embed_assets/font/DejaVuSans.ttf', fontName='DejaVu', fontWeight='normal', mimeType='application/x-font', embedAsCFF='false', unicodeRange='U+0000-U+052f,U+1e00-U+22ff')]
		public static const FONT_DEJAVU:Class;
		[Embed(source = '/embed_assets/font/BUMBASTIKA.TTF', fontName='Bumbastika', fontWeight='normal', mimeType='application/x-font', embedAsCFF='false', unicodeRange='U+0000-U+052f,U+1e00-U+22ff')]
		public static const FONT_BUMBASTIKA:Class;
		
		
		public static function registerFonts():void
		{
			// Register fonts
			Font.registerFont(FONT_DEJAVU);
			Font.registerFont(FONT_BUMBASTIKA);
		}
		
		
		public static const F_DEJAVU:String = "DejaVu";
		public static const F_BUMBASTIKA:String = "Bumbastika";
	}

}
