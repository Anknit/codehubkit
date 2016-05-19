<?php
require_once __DIR__.'./../require.php';
require_once __DIR__.'./../../Common/php/commonfunctions.php';
/* require_once __DIR__.'./../Common/php/openSearchServerAPI.php'; */
/* require_once __DIR__.'/verify_ott.php'; */
require_once __DIR__.'/contentSearchClass.php';
require_once __DIR__.'/appRequestClass.php';
/* require_once __DIR__.'./../user_profile/user_profile.php'; */
require_once __DIR__.'/im.php';

if(isset($_REQUEST['request'])){
	$request_type	=	$_REQUEST['request'];
}

switch($request_type){
	case "add_product":
		if(isset($_REQUEST['data'])){
			$response	=	add_product($_REQUEST['data']);
			if($response['status']){
				echo json_encode(array(
						'status'	=>	$response['status'],
				));
			}
			else{
				echo json_encode(array(
						'status'	=>	$response['status']
				));
			}
			exit();
		}
	case "read_product":
		if(isset($_REQUEST['data'])){
			$response	=	read_product($_REQUEST['data']);
			if($response['status']){
				echo json_encode(array(
						'status'	=>	$response['status'],
						'data'		=>	$response['data']
				));
			}
			else{
				echo json_encode(array('status'=>false));
			}
			exit();
		}
	case "update_product":
		if(isset($_REQUEST['data'])){
			$response	=	update_product($_REQUEST['data']);
			if($response['status']){
				echo json_encode(array(
						'status'	=>	$response['status']
				));
			}
			else{
				echo json_encode(array(
						'status'	=>	$response['status']
				));
			}
			exit();
		}
	case "sso_google_signin":
		if(isset($_REQUEST['data'])){
			$response	=	sso_google_signin($_REQUEST['data']['sso_idtoken']);
			if($response['status']){
				$_SESSION['username']	=	$response['data']['username'];
				$_SESSION['firstname']	=	$response['data']['firstname'];
				$_SESSION['lastname']	=	$response['data']['lastname'];
				$_SESSION['userid']		=	$response['data']['userid'];
				echo json_encode(array(
						'status'	=>	$response['status'],
				));
			}
			else{
				echo json_encode(array(
						'status'	=>	$response['status']
				));
			}
			exit();
		}
	case "read_category_object":
		$output	=	"";
		if(isset($_REQUEST['data'])	&&	$_REQUEST['data']['type']	==	'book'){
			$output	=	json_decode(file_get_contents(__DIR__.'/categoryBookDump.php'));
		}
		elseif(isset($_REQUEST['data'])	&&	$_REQUEST['data']['type']	==	'magazine'){
			$output	=	json_decode(file_get_contents(__DIR__.'/categoryMagazineDump.php'));
		}
		else{
            $output = array();
			$output['book']		=	json_decode(file_get_contents(__DIR__.'/categoryBookDump.php'));
			$output['magazine']	=	json_decode(file_get_contents(__DIR__.'/categoryMagazineDump.php'));
		}
		echo json_encode(array('status'=>true,'data'=>$output));
		break;
	case "read_city_object":
		$output	=	"";
		$output	=	json_decode(file_get_contents(__DIR__.'/cityDump.php'));
		echo json_encode(array('status'=>true,'data'=>$output));
		break;
		
}
?>