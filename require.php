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
	$definitions	=	new __definitions_class();
	$definitions->definitions_for_php();
	require_once __DIR__.'/adminMethods.php';
	require_once __DIR__.'./../Common/php/sessionmgr/session_manager.php';
?>