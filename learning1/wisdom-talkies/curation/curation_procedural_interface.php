<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
	
	require_once __DIR__.'/curation_class.php';

	require_once __DIR__.'./../../Common/php/commonfunctions.php';
	
	function curation_save($data, $curation_config = '') {
		$output				=	array('status'	=>	false);
		$curation_config	=	config_compliance($curation_config);
		$_curation			=	getclassObject('_curation', $curation_config);

		if($_curation->curation_init_status)
			return $_curation->curation_save($data);
		else
			return $output;
	}
	
	function curation_final_save($data, $curation_config = ''){
		$output				=	array('status'	=>	false);
		$curation_config	=	config_compliance($curation_config);
		$_curation			=	getclassObject('_curation', $curation_config);
		
		if($_curation->curation_init_status)
			return $_curation->curation_final_save($data);
		else
			return $output;		
	}
	
	function curation_read($data, $curation_config = ''){
		$output				=	array('status'	=>	false);
		$curation_config	=	config_compliance($curation_config);
		$_curation			=	getclassObject('_curation', $curation_config);
	
		if($_curation->curation_init_status)
			return $_curation->curation_read($data);
		else
			return $output;
	}
	
	/* function recommend($data, $curation_config = ''){
		$output				=	array('status'	=>	false);
		$curation_config	=	config_compliance($curation_config);
		$_curation			=	getclassObject('_curation', $curation_config);
	
		if($_curation->curation_init_status)
			return $_curation->recommend($data);
		else
			return $output;		
	} */
	
	function curation_add_to_list($data, $curation_config = ''){
		$output				=	array('status'	=>	false);
		$curation_config	=	config_compliance($curation_config);
		$_curation			=	getclassObject('_curation', $curation_config);
	
		if($_curation->curation_init_status)
			return $_curation->curation_add_to_list($data);
		else
			return $output;
	}
	
	function curation_delete($data, $curation_config = ''){
		$output				=	array('status'	=>	false);
		$curation_config	=	config_compliance($curation_config);
		$_curation			=	getclassObject('_curation', $curation_config);
	
		if($_curation->curation_init_status)
			return $_curation->curation_delete($data);
		else
			return $output;
	}
?>