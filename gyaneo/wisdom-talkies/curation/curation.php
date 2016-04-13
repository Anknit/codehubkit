<?php
//module library
require_once __DIR__.'/curation_procedural_interface.php';
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
$RPU_MAP['curation_save']		=	array( 'curation_save', 		array()	);
$RPU_MAP['curation_read']		=	array( 'curation_read', 		array()	);
$RPU_MAP['curation_final_save']	=	array( 'curation_final_save', 	array()	);
/* $RPU_MAP['recommend']			=	array( 'recommend', 			array()	); */
$RPU_MAP['curation_add_to_list']=	array( 'curation_add_to_list', 	array()	);
$RPU_MAP['curation_delete']		=	array( 'curation_delete', 		array()	);

if($APP_CONFIG['APP_PROCESS_REQUEST'] != false)
{
	$curation_rpu_config	=	array(
		'config'				=>	'get_CurationConfig',
		'error_codes'			=>	$curation_error_codes,
		'send_response_indexes'	=>	array(
			'status', 'error', 'data'
		),
	);
	
	RPU_ProcessRequest($curation_rpu_config);
}