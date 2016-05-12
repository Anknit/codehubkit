<?php
$session_config			=	get_SessionMgrConfig();
$session_manager_name	=	$session_config['sess_mgr_name'];
$session_cookie_life	=	$session_config['session_cookie_life'];
$session_cookie_secure	=	$session_config['session_cookie_secure'];

function set_ini_config($session_manager_name,$session_cookie_life,$session_cookie_secure){
	$output	=	true;

	ini_set('session.gc_probability', 1);	//If session expires then ensure that session is flushed and cleared at all instances
	ini_set('session.gc_divisor', 100);		//If session expires then ensure that session is flushed and cleared at all instances

	ini_set('session.gc_maxlifetime', $session_cookie_life);	//If session expires then ensure that session is flushed and cleared at all instances
	ini_set('session.cookie_secure', $session_cookie_secure);

	return $output;
}

function session_manager_start($session_manager_name,$session_cookie_life,$session_cookie_secure){
		set_ini_config($session_manager_name,$session_cookie_life,$session_cookie_secure);
		session_name($session_manager_name);
		session_set_cookie_params($session_cookie_life, "/");	//Required for browser cookie cleanup
}

function session_manager_close(){
	session_unset();
	session_destroy();
}

session_start();
session_manager_start($session_manager_name,$session_cookie_life,$session_cookie_secure);