<?php
//module library
require_once __DIR__.'/sso_procedural_interface.php';
require_once __DIR__.'/error_strings.php';

//External dependencies
require_once __DIR__.'./../../RPU.php';

if(!isset($RPU_MAP)){
	$RPU_MAP	=	array();
}

/*
 * 1.it checks the signin of user 
 * 2. @param email (through POST)
 * 3. @param password (through POST)
 * 4. 
*/
$RPU_MAP['sso_signin_verify']	=	array( 'sso_signin_verify', array('sso_email','sso_password')	);
$RPU_MAP['sso_google_signin']	=	array( 'sso_google_signin', array('sso_idtoken')	);
/*
 * 1. It check and sends the verification mail  to the email id for signup
 * 2. @param email (through POST)
 */
$RPU_MAP['sso_initiate_signup']	=	array( 'sso_initiate_signup', array('sso_email')	);
/*
 * 1. It check and sends the reset mail  to the email id for reset
 * 2. @param email (through POST)
 */
$RPU_MAP['sso_initiate_reset']	=	array( 'sso_initiate_reset', array('sso_email')	);
/*
 * 1. It verifies the link for reseting password
 * 2. @param reset_pass (through GET)
 */
$RPU_MAP['sso_reset_pass']		=	array( 'sso_reset_pass', array('pass','sso_password')	);
/*
 * 1. It verifies the link for signup
 * 2. @param sign_up_pass (through GET)
 */
$RPU_MAP['sso_signuppass']		=	array( 'sso_signuppass', array('pass','sso_user_info')	);

if(!isset($APP_CONFIG) || !isset($APP_CONFIG['APP_PROCESS_REQUEST']) || $APP_CONFIG['APP_PROCESS_REQUEST'] != false){

	$sso_rpu_config	=	array(
		'config'				=>	'get_SsoConfig',
		'error_codes'			=>	$sso_error_codes,
		//'callback'				=>	'',
		'send_response_indexes'	=>	array(
			'status', 'error', 'data'
		),
	);
	
	RPU_ProcessRequest($sso_rpu_config);
}