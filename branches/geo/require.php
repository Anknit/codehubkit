<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php

	require_once __DIR__.'/config.php';
	require_once __DIR__.'./../Common/php/sso/php/sso.php';
	require_once __DIR__.'/definitions.php';

	require_once __DIR__.'./../Common/php/sessionmgr/session_manager.php';
	/*require_once __DIR__.'./Common/php/sessionmgr/session_log.php'; */	

	session_manager_start('get_SessionMgrConfig');
	$sessionData	=	session_manager_get(array('is_login'));
	if($sessionData['status'] !== false){
		$sessionData['data']['is_login'] =	$sessionData['data']['is_login'] === NULL ? false :	$sessionData['data']['is_login'];
		define('is_login', $sessionData['data']['is_login']); //login user
	}
	else{
		define('is_login', false); //login user
	}
	/*
	
	require_once __DIR__.'./Common/php/sso/php/sso.php';
	require_once __DIR__.'/user_permissions.php'; */
//	require_once __DIR__.'';
?>