<?php
/*
* Author: Aditya
* date: 05-Nov-2014
* Description: This defines some common functions required only by admin
*
*/

function DB_Backup($backupFilePath = ''){
	
	if($backupFilePath == '') { 
		//$newlyCreatedFilename = date("Y-m-d_H-i-s").".sql";
		$newlyCreatedFilename = "DbBackup.sql";
		$setupRoot		=	getSetupRoot();
		$sqlPathInfo	=	$setupRoot."/temp/";
		$backupFilePath	=	$sqlPathInfo.$newlyCreatedFilename;
	}
	$dbConfig	=	get_DbConfig();

	$query = "mysqldump -h ".$dbConfig['host']." --port=".$dbConfig['port']." --user=".$dbConfig['username']." --password=".$dbConfig['password']." --databases ".$dbConfig['database']." > ".$backupFilePath;

	exec($query);
	
	if(file_exists($backupFilePath))
		return array(
			'status'	=> true,
			'data'		=> array(
				'fileName'	=>	basename($backupFilePath),
				'filePath'	=>	$backupFilePath
			)
		);	
	else {
		return array(
			'status'	=> false,
			'error'		=> 'Mysql Dump file not created',
			'error_description'	=>	$backupFilePath.' does not exist after mysql dump . Error on line number- '.__LINE__.', in file '.__FILE__
		);	
	}
}

function getSetupRoot(){
	$setupRootDir	=	str_replace(projectFolderName,"",__DIR__); 
	return $setupRootDir;
}

function getHttpRoot(){
	$sso_http_root			=	"http".(!empty($_SERVER['HTTPS'])?"s":"")."://".$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].'/'.str_replace($_SERVER['DOCUMENT_ROOT'], "", str_replace("\\", "/", getSetupRoot()));	
	return $sso_http_root;
}
?>
