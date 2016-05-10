<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
require_once __DIR__.'/DbMgrInterface.php';

class _db_utility{
	
	private $db_config	=	array();
	private	$db_handle	=	false;
	private static $dbinfo_table_name	=	'dbinfo';
	public	$db_utility_init_status	=	false;
	public	$db_utility_init_error	=	'';
	
	private static $progressFilenameSuffix	=	'_filepointer';
	private static $errorFilenameSuffix		=	'_error';
	private $progressFilename	=	'_filepointer';
	private $errorFilename	=	'_error';
	
	private	$max_memory_load	=	1024000;	//bytes
	private	$deadline			=	0;
	private	$maxRuntime			=	150;

	private static $DB_Install_mandatory_params	=	array(
		'version', 'path'
	);
	
	private static $DB_Update_mandatory_params	=	array(
		'version', 'path', 'backuppath'
	);
	
	public function __construct($config){
		$this->deadline	=	time()+$this->maxRuntime;
		set_time_limit($this->maxRuntime);
		
		if(!empty($config['db_config'])){
			$this->db_config	=	$config['db_config'];
			
			$DbMgrHandle	=	DBMgr_Handle($config['db_config']);
			if($DbMgrHandle->DBMgr_init_status === false){
				$this->db_utility_init_error	=	'Host connection error: '.$DbMgrHandle->DBMgr_init_error;
			}
			else{
				$this->db_handle				=	$DbMgrHandle;
				$this->db_utility_init_status	=	true;
			}
		}
		else{
		}
	}
	
	private function check_dbinfoTable(){
		$output	=	array('status'	=>	false);
		$Tables	=	$this->db_handle->DB_Tables();
		if(count($Tables) > 0 && in_array(_db_utility::$dbinfo_table_name, $Tables) ){
			$output['status']	=	true;
		}
		else{
			$output['error']	=	_db_utility::$dbinfo_table_name.' table absent in database';
		}
		
		return $output;
	}
	
	private function import_sql_dump($filename){
		$output	=	array(
			'status'	=>	false
		);

		$this->progressFilename	=	$filename._db_utility::$progressFilenameSuffix;
		$this->errorFilename	=	$filename._db_utility::$errorFilenameSuffix;
		
		if(!file_exists($filename)) {
			$output['error']	=	'File '.$filename.' doesn\'t exist';
		}
		else {
			$file_handle	=	fopen($filename, 'r');
			if(!$file_handle){
				$output['error']	=	'failed to open file:'.$filename;
			}
			else{
				// check for previous error
				if( file_exists($this->errorFilename) ){
					$output['error']	=	'previous error: '.file_get_contents($this->errorFilename);
				}
				// go to previous file position
				$filePosition = 0;
				if( file_exists($this->progressFilename) ){
					$filePosition = file_get_contents($this->progressFilename);
					fseek($file_handle, $filePosition);
				}
				
				$queryCount = 0;
				$query = '';
				while( $this->deadline > time() AND ($line = fgets($file_handle, $this->max_memory_load)) ){
					if(substr($line,0,2)=='--' OR trim($line) == '' ){
						continue;
					}
				
					$query .= $line;
					if( substr(trim($query),-1) == ';' ) {
						if( !$this->db_handle->Query($query) ){
							$output['error']	=	'Error performing query '.$query.' :---- '.$this->db_handle->get_dbError();
							file_put_contents($this->errorFilename, $output['error']."\n");
							exit;
						}
						$query = '';
						file_put_contents($this->progressFilename, ftell($file_handle)); // save the current file position for 
						$queryCount++;
					}
				}
				
				if( feof($file_handle) ){
					$output['status']	=	true;
					if( file_exists($this->progressFilename) )
						unlink($this->progressFilename);
					if( file_exists($this->errorFilename) )
						unlink($this->errorFilename);
				}else{
					$output['error']	= ftell($file_handle).'/'.filesize($filename).' '.(round(ftell($file_handle)/filesize($filename), 2)*100).'%'."\n";
					$output['error']	.=	 '          ---           '.$queryCount.' queries processed!';
				}
			}
		}
		
		return $output;
	}
	
	/*
		@params data :(array)
		List of	mandatory keys:-
			version (mandatory) - defines the version to be installed
			path	(mandatory) - defines the directory path where sql files are stored
			database(optional)  - defines the database name if database has to be created. The existing databse would be dropped
	*/
	public function db_utility_install($data){
		$output	=	array('status'	=>	false);

		$validate_params	=	_db_utility::check_mandatory_params($data, _db_utility::$DB_Install_mandatory_params);
		if($validate_params['status']	===	true){
			//Create or continue without database
			if(!empty($data['database'])) {
				$this->db_handle->Query('DROP DATABASE IF EXISTS `'.$data['database'].'`', '', '');
				$this->db_handle->Query('CREATE DATABASE `'.$data['database'].'`', '', '');
				$this->db_handle->Query('USE `'.$data['database'].'`', '', '');
			}
			
			if(!empty($data['version'])) {
				$complete_schema_file_path	=	$data['path'].'/'.$data['version'].'.schema.sql';
				$complete_data_file_path	=	$data['path'].'/'.$data['version'].'.data.sql';
				
				$schema_import	=	$this->import_sql_dump($complete_schema_file_path);
				if($schema_import['status']	===	true) {
					$data_import	=	$this->import_sql_dump($complete_data_file_path);
					if($data_import['status']	===	true) {
						$output['status']	=	true;
					}
					else{
						$output	=	$data_import;
					}
				}
				else{
					$output	=	$schema_import;
				}
			}
			else{
				$output['error']	=	'Invalid value for param- version : '.$data['version'];
			}	
				
		}
		else{
			$output['error']	=	'Missing arguments. Recieved: '.json_encode($data).',  Mandatory params: '.json_encode(_db_utility::$DB_Install_mandatory_params);
		}
		
		return $output;
	}
	
	/*
		@params data :(array)
		List of	mandatory keys:-
			version 			(mandatory) - defines the version to be installed
			path				(mandatory) - defines the directory path where sql files are stored
			backuppath			(mandatory) - defines the directory path where sql backup files can be stored
			revert_in_failure	(optional)	- boolean. When set to true, in case of any failure the last action would be to revert back to old database which is backed up in initial stage
			database			(optional)  - defines the database name to which backup has to be reverted in case of failure. Thus it is mandatory when revert_in_failure option is set to true
	*/
	public function db_utility_update($data){
		$output	=	array('status'	=>	false);
		$validate_params	=	_db_utility::check_mandatory_params($data, _db_utility::$DB_Update_mandatory_params);
		if($validate_params['status']	===	true){

			//First step is to validate dependencies
			$validate	=	$this->check_dbinfoTable();
			if($validate['status']	===	true){
				//Backup database
				$export_database	=	$data['backuppath'].'/'.time().'.sql';
				$this->db_handle->Export(array(
					'DUMP_FILE_PATH' => $export_database
				));
				
				if(file_exists($export_database)) {
					//read current version from db info
					$version = $this->db_handle->Read(array(
						'Table'	=>	_db_utility::$dbinfo_table_name,
						'Fields'=>	'version',
					));
					
					if(is_array($version) && is_array($version[0])){
						$version	=	intval($version[0]['version']);
					}

					//start importing alter schema and data files immediate greater than current version 
					for($i = $version+1; $i <= intval($data['version']); $i++ ){
						$alter_schema_file	=	$data['path'].'/'.$i.'.alter.sql';
						$alter_data_file	=	$data['path'].'/'.$i.'.data.sql';

						$schema_import	=	$this->import_sql_dump($alter_schema_file);
						if($schema_import['status']	===	true) {
							$data_import	=	$this->import_sql_dump($alter_data_file);
							if($data_import['status']	===	true) {
								$output['status']		=	true;
							}
							else{
								$output['error_file'][]	=	$alter_data_file;
								$output['error'][]		=	$data_import['error'];
							}
						}
						else{
							$output['error_file'][]	=	$alter_schema_file;
							$output['error'][]		=	$schema_import['error'];
						}
						
					}
					
					if($data['revert_in_failure'] === true && $output['status'] === false){
						$this->db_handle->Query('DROP DATABASE IF EXISTS `'.$data['database'].'`', '', '');
						$this->db_handle->Query('CREATE DATABASE `'.$data['database'].'`', '', '');
						$this->db_handle->Query('USE `'.$data['database'].'`', '', '');
						
						//import back the old database
						$this->import_sql_dump($export_database);
					}
					
					//delete the exported database
					unlink($export_database);
				}
				else{
					$output['error']	=	'Database export failed : Failed writing file - '.$export_database;
				}
			}
			else{
				$output	=	$validate;
			}
		}
		
		return $output;
	}
	
	/**
	 * Name: 		check_mandatory_params
	 * Description: Validates the data recieved against manadatory keys. For a request there shall be mandatory params which if not present the request should fail.
	 * @param array data 		: Associative array. data as recieved in request
	 * @param array mand_params : Indexed array. Keys as defined in class member variable for that request
	 * @return array Associative Array
	 *	'status'	=>	true/false
	 */
	private static function check_mandatory_params($data, $mand_params = array()){
		$output	=	array('status'	=>	false);
		if( count(array_diff($mand_params,array_keys($data))) == 0) {
			$output['status']	=	true;
		}
			
		return $output;
	}
	
};
?>
