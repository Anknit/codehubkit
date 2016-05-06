<?php
//module library
require_once __DIR__.'/review_curation_procedural_interface.php';
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
$RPU_MAP['review_moderator_issue']		=	array(	'review_moderator_issue', 	array()	);
$RPU_MAP['review_reviewer_issue']		=	array(	'review_reviewer_issue', 	array()	);
$RPU_MAP['review_publish']				=	array(	'review_publish', 			array()	);
$RPU_MAP['review_moderator_reject']		=	array(	'review_moderator_reject',	array()	);
$RPU_MAP['review_category_move']		=	array(	'review_category_move',		array()	);
$RPU_MAP['review_category_delete']		=	array(	'review_category_delete',	array()	);
$RPU_MAP['review_language_delete']		=	array(	'review_language_delete',	array()	);
$RPU_MAP['review_delete_content']		=	array(	'review_delete_content',	array()	);

if($APP_CONFIG['APP_PROCESS_REQUEST'] != false)
{
	$review_curation_rpu_config	=	array(
		'config'				=>	'get_ReviewCurationConfig',
		'error_codes'			=>	$review_curation_error_codes,
		'send_response_indexes'	=>	array(
			'status', 'error', 'data'
		),
	);
	
	RPU_ProcessRequest($review_curation_rpu_config);
}