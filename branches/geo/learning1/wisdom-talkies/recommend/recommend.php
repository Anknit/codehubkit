<?php 
require_once __DIR__.'/recommend_procedural_interface.php';
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
$RPU_MAP['recommend']		=	array( 'recommend', 		array()	);

if($APP_CONFIG['APP_PROCESS_REQUEST'] != false)
{
	$recommend_rpu_config	=	array(
			'config'				=>	'get_CurationConfig',
			'error_codes'			=>	$recommend_error_codes,
			'send_response_indexes'	=>	array(
					'status', 'error', 'data'
			),
	);

	RPU_ProcessRequest($recommend_rpu_config);
}