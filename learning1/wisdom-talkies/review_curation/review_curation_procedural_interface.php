<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
	
	require_once __DIR__.'/review_curation_class.php';

	require_once __DIR__.'./../../Common/php/commonfunctions.php';
	
	function review_publish($data, $review_curation_config = '') {
		$output					=	array(
				'status'	=>	false
		);
		$review_curation_config	=	config_compliance($review_curation_config);
		$_review_curation		=	getclassObject('_review_curation', $review_curation_config);

		if($_review_curation->review_curation_init_status)
			return $_review_curation->review_publish($data);
		else
			return $output;	
			
	}
	
	function review_reviewer_issue($data, $review_curation_config = ''){
		$output						=	array(
				'status'	=>	false
		);
		$review_curation_config		=	config_compliance($review_curation_config);
		$_review_curation			=	getclassObject('_review_curation', $review_curation_config);
		
		if($_review_curation->review_curation_init_status)
			return $_review_curation->review_reviewer_issue($data);
		else
			return $output;	
			
	}
	
	function review_moderator_issue($data, $review_curation_config = ''){
		$output					=	array(
				'status'	=>	false
		);
		$review_curation_config	=	config_compliance($review_curation_config);
		$_review_curation		=	getclassObject('_review_curation', $review_curation_config);
	
		if($_review_curation->review_curation_init_status)
			return $_review_curation->review_moderator_issue($data);
		else
			return $output;
	}
	
	function review_moderator_reject($data, $review_curation_config = ''){
		$output					=	array(
				'status'	=>	false
		);
		$review_curation_config	=	config_compliance($review_curation_config);
		$_review_curation		=	getclassObject('_review_curation', $review_curation_config);
	
		if($_review_curation->review_curation_init_status)
			return $_review_curation->review_moderator_reject($data);
		else
			return $output;
	}
	function review_category_move($data, $review_curation_config = ''){
		$output					=	array(
				'status'	=>	false
		);
		$review_curation_config	=	config_compliance($review_curation_config);
		$_review_curation		=	getclassObject('_review_curation', $review_curation_config);
	
		if($_review_curation->review_curation_init_status)
			return $_review_curation->review_category_move($data);
		else
			return $output;
	}
	function review_category_delete($data, $review_curation_config = ''){
		$output					=	array(
				'status'	=>	false
		);
		$review_curation_config	=	config_compliance($review_curation_config);
		$_review_curation		=	getclassObject('_review_curation', $review_curation_config);
	
		if($_review_curation->review_curation_init_status)
			return $_review_curation->review_category_delete($data);
		else
			return $output;
	}	
	function review_language_delete($data, $review_curation_config = ''){
		$output					=	array(
				'status'	=>	false
		);
		$review_curation_config	=	config_compliance($review_curation_config);
		$_review_curation		=	getclassObject('_review_curation', $review_curation_config);
	
		if($_review_curation->review_curation_init_status)
			return $_review_curation->review_language_delete($data);
		else
			return $output;
	}
	function review_delete_content($data, $review_curation_config = ''){
		$output					=	array(
				'status'	=>	false
		);
		$review_curation_config	=	config_compliance($review_curation_config);
		$_review_curation		=	getclassObject('_review_curation', $review_curation_config);
	
		if($_review_curation->review_curation_init_status)
			return $_review_curation->review_delete_content($data);
		else
			return $output;
	}
?>