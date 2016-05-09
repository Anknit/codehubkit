<?php
//module library
require_once __DIR__.'/session_manager_procedural_interface.php';
require_once __DIR__.'/error_strings.php';

//External dependencies
require_once __DIR__.'./../RPU.php';

if(!isset($RPU_MAP)){
	$RPU_MAP	=	array();
}

/*
 * 1.it checks the signin of user 
 * 2. @param email (through POST)
 * 3. @param password (through POST)
 * 4. 
*/
$RPU_MAP['session_manager_issession_set']	=	array( 'session_manager_issession_set', array()	);
$RPU_MAP['session_manager_start']			=	array( 'session_manager_start', 		array()	);
$RPU_MAP['session_manager_close']			=	array( 'session_manager_close', 		array()	);
$RPU_MAP['session_manager_set']				=	array( 'session_manager_set',			array()	);

if(!isset($APP_CONFIG) || !isset($APP_CONFIG['APP_PROCESS_REQUEST']) || $APP_CONFIG['APP_PROCESS_REQUEST'] != false){

	$session_manager_rpu_config	=	array(
		'config'				=>	'get_SessionMgrConfig',
		'error_codes'			=>	$session_manager_error_codes,
		'send_response_indexes'	=>	array(
			'status', 'data'
		),
	);
	
	RPU_ProcessRequest($session_manager_rpu_config);
}