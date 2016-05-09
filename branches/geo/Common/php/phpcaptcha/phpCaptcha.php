<?php
class phptextClass{
	public  $captcha_init_status	=	false;
	public  $captcha_init_error	=	'';
	private	$captcha_font_file	=	'./../../css/fonts/monofont.ttf';	//http link to font file
	
	public function phptextClass($captcha_config){
		$checkConfigIsArray	=	is_array($captcha_config);
		if(!$checkConfigIsArray){
			if(is_callable('get_CaptchaConfig')){
				$captcha_config	=	get_CaptchaConfig();
			}
			else {
				require_once 'captcha_config.php';
			}
		}
		
		if(!is_array($captcha_config)){
			$this->captcha_init_error	=	'Path to font file not found';
		}
		else{
			$this->captcha_init_status	=	true;
			$this->captcha_init_error	=	'';
			$this->captcha_font_file	=	$captcha_config['captcha_font_file'];
		}
	}
	
	public function phpcaptcha($textColor,$backgroundColor,$imgWidth,$imgHeight,$noiceLines=0,$noiceDots=0,$noiceColor='#aaa')
	{	
		/* Settings */
		$text=$this->random();
		$textColor=$this->hexToRGB($textColor);	
		$fontSize = $imgHeight * 0.75;
		
		$im = imagecreatetruecolor($imgWidth, $imgHeight);	
		$textColor = imagecolorallocate($im, $textColor['r'],$textColor['g'],$textColor['b']);			
		
		$backgroundColor = $this->hexToRGB($backgroundColor);
		$backgroundColor = imagecolorallocate($im, $backgroundColor['r'],$backgroundColor['g'],$backgroundColor['b']);
				
		/* generating lines randomly in background of image */
		if($noiceLines>0){
		$noiceColor=$this->hexToRGB($noiceColor);	
		$noiceColor = imagecolorallocate($im, $noiceColor['r'],$noiceColor['g'],$noiceColor['b']);
		for( $i=0; $i<$noiceLines; $i++ ) {				
			imageline($im, mt_rand(0,$imgWidth), mt_rand(0,$imgHeight),
			mt_rand(0,$imgWidth), mt_rand(0,$imgHeight), $noiceColor);
		}}				
				
		if($noiceDots>0){/* generating the dots randomly in background */
		for( $i=0; $i<$noiceDots; $i++ ) {
			imagefilledellipse($im, mt_rand(0,$imgWidth),
			mt_rand(0,$imgHeight), 1, 1, $noiceColor);
		}}		
		
		imagefill($im,0,0,$backgroundColor);	
		list($x, $y) = $this->ImageTTFCenter($im, $text, $this->captcha_font_file, $fontSize);	
		imagettftext($im, $fontSize, 0, $x, $y, $textColor, $this->captcha_font_file, $text);		

		imagejpeg($im,NULL,90);/* Showing image */
		header('Content-Type: image/jpeg');/* defining the image type to be shown in browser widow */
		imagedestroy($im);/* Destroying image instance */
		session_manager_set(array(
			'captcha_code'	=>	$text,
		));
	}
		/*for random string*/
	protected function random($characters=6,$letters = '23456789bcdfghjkmnpqrstvwxyz'){
		$str='';
		for ($i=0; $i<$characters; $i++) { 
			$str .= substr($letters, mt_rand(0, strlen($letters)-1), 1);
		}
		return $str;
	}	
	
	/*function to convert hex value to rgb array*/
	protected function hexToRGB($colour)
	{
        if ( $colour[0] == '#' ) {
			$colour = substr( $colour, 1 );
        }
        if ( strlen( $colour ) == 6 ) {
			list( $r, $g, $b ) = array( $colour[0] . $colour[1], $colour[2] . $colour[3], $colour[4] . $colour[5] );
        } elseif ( strlen( $colour ) == 3 ) {
			list( $r, $g, $b ) = array( $colour[0] . $colour[0], $colour[1] . $colour[1], $colour[2] . $colour[2] );
        } else {
			return false;
        }
        $r = hexdec( $r );
        $g = hexdec( $g );
        $b = hexdec( $b );
        return array( 'r' => $r, 'g' => $g, 'b' => $b );
	}
		
		
	/*function to get center position on image*/
	protected function ImageTTFCenter($image, $text, $font, $size, $angle = 8) 
	{
		$xi = imagesx($image);
		$yi = imagesy($image);
		$box = imagettfbbox($size, $angle, $font, $text);
		$xr = abs(max($box[2], $box[4]))+5;
		$yr = abs(max($box[5], $box[7]));
		$x = intval(($xi - $xr) / 2);
		$y = intval(($yi + $yr) / 2);
		return array($x, $y);	
	}

}
?>