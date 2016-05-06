<?php
require_once __DIR__.'./../require.php';
require_once __DIR__.'./../../Common/php/commonfunctions.php';
require_once __DIR__.'./../../Common/php/openSearchServerAPI.php';
require_once __DIR__.'/verify_ott.php';
require_once __DIR__.'/contentSearchClass.php';
require_once __DIR__.'/appRequestClass.php';
require_once __DIR__.'./../user_profile/user_profile.php';

$request	=	$_REQUEST['request'];
$data		=	$_REQUEST['data'];

switch($request){
	case "book_product":
		$output	=	array();
		$data	=	read_product($_REQUEST['data']['id']);
		if($data){
			$output['status']	=	true;
			$output['data']		=	$data;
			echo $output;
			die();
		}
		else{
			$output['status']	=	false;
			echo $output;
			die();
		}
	
	case "delete_product":
		$output	=	array();
		$data	=	read_product($_REQUEST['data']['id']);
		if($data){
			$output['status']	=	true;
			$output['data']		=	$data;
			echo $output;
			die();
		}
		else{
			$output['status']	=	false;
			echo $output;
			die();
		}
	case "hold_product":
		$output	=	array();
		$data	=	read_product($_REQUEST['data']['id']);
		if($data){
			$output['status']	=	true;
			$output['data']		=	$data;
			echo $output;
			die();
		}
		else{
			$output['status']	=	false;
			echo $output;
			die();
		}
	
?>