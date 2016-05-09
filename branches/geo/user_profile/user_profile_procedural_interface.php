<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
	
	require_once __DIR__.'/user_profile_class.php';

	require_once __DIR__.'./../../Common/php/commonfunctions.php';
	
	function user_profile_read($data, $user_profile_config = '') {
		$output	=	array('status'	=>	false);
		$user_profile_config	=	config_compliance($user_profile_config);
		$_user_profile	=	getclassObject('_user_profile', $user_profile_config);

		if($_user_profile->user_profile_init_status)
			return $_user_profile->user_profile_read($data);
		else
			return $output;	
			
	}
	
	function user_profile_save($data, $user_profile_config = ''){
		$output	=	array('status'	=>	false);
		$user_profile_config	=	config_compliance($user_profile_config);
		$_user_profile	=	getclassObject('_user_profile', $user_profile_config);
		
		if($_user_profile->user_profile_init_status)
			return $_user_profile->user_profile_save($data);
		else
			return $output;	
			
	}
?>