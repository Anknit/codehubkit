<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
	
	require_once 'sso_class.php';

	require_once __DIR__.'./../../commonfunctions.php';
	
	function sso_signin_verify($email = '', $password = '', $sso_config = ''){
		$output	=	array('status'	=>	false);
		$sso_config	=	config_compliance($sso_config);
		$__sso	=	getclassObject('_sso', $sso_config);
		
		if($__sso->sso_init_status)
			return $__sso->sso_signin_verify($email, $password);
		else
			return $output;	
			
	}
	
	function sso_google_signin($sso_idtoken = '', $sso_config = ''){
		$output	=	array('status'	=>	false);
		$sso_config	=	config_compliance($sso_config);
		$__sso	=	getclassObject('_sso', $sso_config);
		
		if($__sso->sso_init_status)
			return $__sso->sso_google_signin($sso_idtoken);
		else
			return $output;	
			
	}
	
	function sso_initiate_signup($email = '', $sso_config = ''){
		$output	=	array('status'	=>	false);
		$sso_config	=	config_compliance($sso_config);
		$__sso	=	getclassObject('_sso', $sso_config);
		
		if($__sso->sso_init_status)
			return $__sso->sso_initiate_signup($email);
		else
			return $output;	
			
	}
	
	function sso_initiate_reset($email = '', $sso_config = ''){
		$output	=	array('status'	=>	false);
		$sso_config	=	config_compliance($sso_config);
		$__sso	=	getclassObject('_sso', $sso_config);
		
		if($__sso->sso_init_status)
			return $__sso->sso_initiate_reset($email);
		else
			return $output;	
			
	}
	
	function sso_reset_pass($pass = '', $sso_pass = '', $sso_config = ''){
		$output	=	array('status'	=>	false);
		$sso_config	=	config_compliance($sso_config);
		$__sso	=	getclassObject('_sso', $sso_config);
		
		if($__sso->sso_init_status)
			return $__sso->sso_reset_pass($pass, $sso_pass);
		else
			return $output;	
			
	}
	
	function sso_signuppass($pass = '', $sso_user_info = '', $sso_config = ''){
		$output	=	array('status'	=>	false);
		$sso_config	=	config_compliance($sso_config);
		$__sso	=	getclassObject('_sso', $sso_config);
		
		if($__sso->sso_init_status)
			return $__sso->sso_signuppass($pass, $sso_user_info);
		else
			return $output;	
			
	}

?>