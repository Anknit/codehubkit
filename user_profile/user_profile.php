<?php
//module library
require_once __DIR__.'/user_profile_procedural_interface.php';
require_once __DIR__.'/error_strings.php';

//External dependencies
require_once __DIR__.'./../../Common/php/RPU.php';

if(!isset($RPU_MAP))
{
	$RPU_MAP	=	array();
}

/*
 * 1.it checks the signin of user 
 * 2. @param email (through POST)
 * 3. @param password (through POST)
 * 4. 
*/
$RPU_MAP['user_profile_read']	=	array( 'user_profile_read', 	array()	);
$RPU_MAP['user_profile_save']	=	array( 'user_profile_save', 	array()	);

if($APP_CONFIG['APP_PROCESS_REQUEST'] != false)
{
	$user_profile_rpu_config	=	array(
		'config'				=>	'get_User_profileConfig',
		'error_codes'			=>	$user_profile_error_codes,
		'send_response_indexes'	=>	array(
			'status', 'error', 'data'
		),
	);
	
	RPU_ProcessRequest($user_profile_rpu_config);
}