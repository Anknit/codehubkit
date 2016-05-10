<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* Description: Name is self explanatory
*/
function EventLogging($message) {
	if(isset($_SESSION['SETUP_ROOT'])){
		$filename	=	$_SESSION['SETUP_ROOT'].'/temp/Events.txt';
	}
	else if(function_exists('getSetupRoot')){
		$filename	=	getSetupRoot().'temp/Events.txt';
	}
	
	else {
		$filename	=	__DIR__.'./../../temp/Events.txt';
	}
	
	if(!file_exists($filename))
		file_put_contents($filename, "\n");
		
	file_put_contents($filename, date("M-j-Y/H:i:s")." -- ".$_SERVER['REMOTE_ADDR'].' -- Event: '.$message."\r\n" , FILE_APPEND);
}
?>