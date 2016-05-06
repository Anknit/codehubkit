<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* Description: This defines cron tasks that are required to be automated
*
*/

require_once __DIR__.'./../Db.php';
require_once __DIR__.'./../adminMethods.php';
require_once __DIR__.'./../wt_config.php';

require_once __DIR__.'./../../Common/php/ErrorHandling.php';

//Database backup
$db_backup_output	=	DB_Backup('');
if($db_backup_output['status'] === false) {
	ErrorLogging($db_backup_output['error_description']);
}
?>
