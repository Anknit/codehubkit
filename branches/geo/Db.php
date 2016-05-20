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
				'host'		=>	'192.168.0.215',
				'port'		=>	'3306',
				'username'	=>	'root',
				'password'	=>	'',
				'database'	=>	'book1'
			);
	return $config;
}
require_once __DIR__.'./../Common/php/OperateDBv1/DbMgrInterface.php';
?>