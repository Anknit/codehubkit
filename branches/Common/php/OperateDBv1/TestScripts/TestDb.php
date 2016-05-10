<?php
require_once '../DbMgrInterface.php';
function get_DbConfig(){
	$config	=	array();
	$config['dbType']		=	'mssql';
	$config['server']	=	'LENOVOWIH\SQLEXPRESS';
	$config['Port']			=	'1433';
	$config['userName']		=	'sa';
	$config['passWord']		=	'admin123';
	$config['DatabaseName']	=	'ddb';
	return $config;	
}

//Move this test to test file
if(isset($_GET['test'])) {
	if($_GET['test'] == 1)	//Read operation
	{
		
		$ReadTestArray	=	array(
			'Fields'=> 'Username, Password, UserType',
			'Table'=> 'userinfo',
			'clause'=> 'Username = "ppu14"',
			'order'	=> 'UserID DESC'
		);
		$Result	=	DB_Read($ReadTestArray, 'aSsOc', 'AS_JSON');
	}
	if($_GET['test'] == 2)	//Insert operation
	{
		$ReadTestArray	=	array(
			'Table'=> 'userinfo',
			'Fields'=> array('id'=> '1',
							 'username'=> 'vagabond',
							 'upassword'=> md5('superadmin')
							 )
		);
		$Result	=	DB_Insert($ReadTestArray);
	}
	if($_GET['test'] == 3)	//Update operation
	{
		$ReadTestArray	=	array(
			'Table'=> 'userinfo',
			'Fields'=> array('City'=> 'No....ida',
							 'RegisteredOn'=> 'now()'
							 ),
			'clause'=> 'UserID = 1 AND UserType = 1'
		);
		$Result	=	DB_Update($ReadTestArray);
	}
	if($_GET['test'] == 4)	//Delete operation
	{
		$ReadTestArray	=	array(
			'Table'=> 'userinfo',
			'clause'=> ' id = 1'
		);
		$Result	=	DB_>Delete($ReadTestArray);
	}
	
	if($_GET['test'] == 5) {
		$ExportDBArray = array(
				'DUMP_FILE_NAME' => 'dump.sql',
				'TABLE_LIST' => array(
						'Table1' => 'userinfo',
						'Table2' => 'usageinfo'
				)
		); // optional argument

		$ReadTestArray = array();
		$Result = DB_ExportTable($ExportDBArray);
	}
	
	if($_GET['test'] == 6) {

		$ImportDBArray = array(
				'COMPLETE_PATH' => __DIR__ . "\\database_dump.sql"
		);
		$Result = DB_ImportTable($ImportDBArray);
	}
	

	if($_GET['test'] == 7) {
		$multipleFieldsArray = array(
						'TABLE_NAME' => 'userinfo',
						'ID_LIST' => false ,
						'FIELD_DETAILS' => array(
													array('Username' => 'bjam123','Password' =>md5('password123'), 'UserType' => 1),
													array('Username' => 'ppu12', 'Password' => md5('password1234'), 'UserType' => 2),
													array('Username' => 'ppu13', 'Password' => md5('password12345'), 'UserType' => 3),
													array('Username' => 'ppu14', 'Password' => md5('password123456'), 'UserType' => 4)
												)
				);
		$Result = DB_InsertMultipleRows($multipleFieldsArray);
	}
	
	if($_GET['test'] == 8) {
		$multipleFieldsArray = array(
			'table' => 'userinfo',
			'condition_value' => 'UserType',
			'value' => array(
					'1' => array('Username' => 'abc', 'Password' => 'password'),
					'2' => array('Username' => 'abc1', 'Password' => 'password1')
			)		
		);
	}
	
	
	if($_GET['test'] == 9) {
		try {
			$dbh = new PDO("mysql:host=localhost;dbname=demodatabase", 'root', '');	
			$count = $dbh->exec("INSERT INTO userinfo (Username, Password) VALUES ('kiwi', 'troy')");
			echo $count;
			echo 'Connected to database';
		}catch(PDOException $e) {
			echo $e->getMessage();
		}
	}
	
	echo var_dump($Result);
}
?>