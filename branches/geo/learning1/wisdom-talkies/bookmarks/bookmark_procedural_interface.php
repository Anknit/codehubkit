<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
	
	require_once __DIR__.'/bookmark_class.php';

	require_once __DIR__.'./../../Common/php/commonfunctions.php';
	
	function bookmark_save($data, $bookmark_config = '') {
		$output	=	array('status'	=>	false);
		$bookmark_config	=	config_compliance($bookmark_config);
		$_bookmark	=	getclassObject('_bookmark', $bookmark_config);

		if($_bookmark->bookmark_init_status)
			return $_bookmark->bookmark_save($data);
		else
			return $output;	
			
	}
	
	function bookmark_read($data, $bookmark_config = '') {
		$output	=	array('status'	=>	false);
		$bookmark_config	=	config_compliance($bookmark_config);
		$_bookmark	=	getclassObject('_bookmark', $bookmark_config);
	
		if($_bookmark->bookmark_init_status)
			return $_bookmark->bookmark_read($data);
		else
			return $output;
			
	}
?>