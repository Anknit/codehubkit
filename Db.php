<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
function get_DbConfig(){
	$config = array (							
				'host'		=>	'localhost',
				'port'		=>	'3306',
				'username'	=>	'root',
				'password'	=>	'',
				'database'	=>	'book'
			);
	return $config;
}
require_once __DIR__.'./Common/php/OperateDBv1/DbMgrInterface.php';
?>