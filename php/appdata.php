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
			echo json_encode(array('status'=>true,'data'=>array()));
			exit();
		}
}
?>