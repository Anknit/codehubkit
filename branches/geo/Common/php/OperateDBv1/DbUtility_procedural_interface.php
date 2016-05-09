<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
	
	require_once __DIR__.'/DbUtility_class.php';
	
	function db_utility_install($data, $db_utility_config = '') {
		$output			=	array('status'	=>	false);
		$_db_utility	=	new _db_utility($db_utility_config);

		if($_db_utility->db_utility_init_status)
			$output	= $_db_utility->db_utility_install($data);
		else {
			$output['error']	=	$_db_utility->db_utility_init_error;	
		}
		
		return $output;
	}
	
	function db_utility_update($data, $db_utility_config = ''){
		$output			=	array('status'	=>	false);
		$_db_utility	=	new _db_utility($db_utility_config);

		if($_db_utility->db_utility_init_status)
			$output	= $_db_utility->db_utility_update($data);
		else {
			$output['error']	=	$_db_utility->db_utility_init_error;	
		}
		
		return $output;
			
	}
	?>