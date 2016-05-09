<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
	
	require_once 'session_manager_class.php';

	require_once __DIR__.'./../commonfunctions.php';
	
	function session_manager_issession_set($session_config = ''){
		$output	=	array('status'	=>	false);
		$session_config	=	config_compliance($session_config);
		$_session_manager	=	getclassObject('_session_manager', $session_config);
		
		if($_session_manager->session_init_status)
			return $_session_manager->session_manager_issession_set();
		else
			return $output;	
			
	}
	
	function session_manager_start($session_config = ''){
		$output	=	array('status'	=>	false);
		$session_config	=	config_compliance($session_config);
		$_session_manager	=	getclassObject('_session_manager', $session_config);
		
		if($_session_manager->session_init_status)
			return $_session_manager->session_manager_start();
		else
			return $output;	
			
	}
	
	function session_manager_close($session_config = ''){
		$output	=	array('status'	=>	false);
		$session_config	=	config_compliance($session_config);
		$_session_manager	=	getclassObject('_session_manager', $session_config);
		
		if($_session_manager->session_init_status)
			return $_session_manager->session_manager_close();
		else
			return $output;	
			
	}
	
	function session_manager_set($data = '', $session_config = ''){
		$output	=	array('status'	=>	false);
		$session_config	=	config_compliance($session_config);
		$_session_manager	=	getclassObject('_session_manager', $session_config);
		
		if($_session_manager->session_init_status)
			return $_session_manager->session_manager_set($data);
		else
			return $output;	
			
	}
	
	function session_manager_get($data = '', $session_config = ''){
		$output	=	array('status'	=>	false);
		$session_config	=	config_compliance($session_config);
		$_session_manager	=	getclassObject('_session_manager', $session_config);
		
		if($_session_manager->session_init_status)
			return $_session_manager->session_manager_get($data);
		else
			return $output;	
			
	}

?>