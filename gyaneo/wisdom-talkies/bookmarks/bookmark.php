<?php
//module library
require_once __DIR__.'/bookmark_procedural_interface.php';
require_once __DIR__.'/error_strings.php';

//External dependencies
require_once __DIR__.'./../../Common/php/RPU.php';

if(!isset($RPU_MAP)){
	$RPU_MAP	=	array();
}

$RPU_MAP['bookmark_save']			=	array( 'bookmark_save', array()	);
$RPU_MAP['bookmark_read']			=	array( 'bookmark_read', array()	);

if(!isset($APP_CONFIG) || !isset($APP_CONFIG['APP_PROCESS_REQUEST']) || $APP_CONFIG['APP_PROCESS_REQUEST'] != false){

	$bookmark_rpu_config	=	array(
		'config'				=>	'get_BookmarkConfig',
		'error_codes'			=>	$bookmark_error_codes,
		//'callback'				=>	'',
		'send_response_indexes'	=>	array(
			'status', 'error', 'data'
		),
	);
	
	RPU_ProcessRequest($bookmark_rpu_config);
}