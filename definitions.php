<?php
/*
 * sendto sendto_server:1,sendto client:2,sendto both:3
 */
class __definitions_class
{
	private $definitions_json;
	public function __construct()
	{
		$this->definitions_json	=	json_encode(array(
			array("key"=>"P_BOOK","value"=>"1","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"P_MAGAZINE","value"=>"2","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"PRODUCT_TYPE","value"=>array("P_BOOK","P_MAGAZINE"),"sendto_server"=>true,"sendto_client"=>false),
				
			array("key"=>"UNIT_NOS","value"=>"1","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"UNIT_WEIGHT","value"=>"2","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"UNIT_TYPE","value"=>array("UNIT_NOS","UNIT_WEIGHT"),"sendto_server"=>true,"sendto_client"=>false),
				
			array("key"=>"LAN_EN","value"=>"1","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"LAN_HINDI","value"=>"2","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"CAT_BOOK_VERIFIED","value"=>"1","sendto_server"=>true,"sendto_client"=>false),
			array("key"=>"CAT_BOOK_UNVERIFIED","value"=>"2","sendto_server"=>true,"sendto_client"=>false),
			array("key"=>"CAT_MAGAZINE_VERIFIED","value"=>"1","sendto_server"=>true,"sendto_client"=>false),
			array("key"=>"CAT_MAGAZINE_UNVERIFIED","value"=>"2","sendto_server"=>true,"sendto_client"=>false),
			array("key"=>"REQUEST_ADD_PRODUCT","value"=>"1","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"REQUEST_UPDATE_PRODUCT","value"=>"2","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"P_STATUS_BOOKED","value"=>"1","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"P_STATUS_SOLD","value"=>"2","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"P_STATUS_DELETED","value"=>"3","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"P_STATUS_AVAILABLE","value"=>"4","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"P_STATUS_INCOMPLETE","value"=>"5","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"P_STATUS_ONHOLD","value"=>"6","sendto_server"=>true,"sendto_client"=>true),
			array("key"=>"recaptcha_secret","value"=>"6Lfh_xsTAAAAAAEKsTeP0fX1yoGc5h7cEElXn8kl","sendto_server"=>true,"sendto_client"=>false),
		));
	}
	
	public function definitions_for_php()
	{
		$definition	=	json_decode($this->definitions_json,true);
		for($i=0;$i<count($definition);$i++)
		{
			if(!is_array($definition[$i]['value'])	&&	$definition[$i]['sendto_server']){
				define($definition[$i]['key'],$definition[$i]['value']);
			}
			elseif($definition[$i]['sendto_server']){
				define($definition[$i]['key'],json_encode($definition[$i]['value']));
			}
		}
	}
	
	public function definitions_for_js()
	{
		$definition	=	json_decode($this->definitions_json,true);
		$definitions_for_client	=	array();
		for($i=0;$i<count($definition);$i++)
		{
			if($definition[$i]['sendto_client']){
				array_push($definitions_for_client,$definition[$i]);
			}
		}
		return json_encode($definitions_for_client);
	}
	
}

/* //PRODUCT TYPE DEFINITIONS(PRODUCT): P_ prefix
define('P_BOOK', 1);
define('P_MAGAZINE', 2);
define('PRODUCT_TYPE',json_encode(array(P_BOOK,P_MAGAZINE)));

//UNIT TYPE OF PRODUCT(UNIT):UNIT_prefix
define('UNIT_NOS', 1);
define('UNIT_WEIGHT', 2);
define('UNIT_TYPE',json_encode(array(UNIT_NOS,UNIT_WEIGHT)));

//LANGUAGE OF PRODUCT():LAN_prefix
define('LAN_EN', 1);
define('LAN_HINDI', 2);

//CATEGORY OF BOOK():CAT_BOOK_prefix
define('CAT_BOOK_VERIFIED', 1);
define('CAT_BOOK_UNVERIFIED', 2);

//CATEGORY OF MAGAZINE():CAT_MAGAZINE_prefix
define('CAT_MAGAZINE_VERIFIED', 1);
define('CAT_MAGAZINE_UNVERIFIED', 2);


//REQUEST TYPE:REQUEST_prefix
define('REQUEST_ADD_PRODUCT', 1);
define('REQUEST_UPDATE_PRODUCT', 2);

//STATUS OF PRODUCT():P_STATUS_prefix
define('P_STATUS_BOOKED', 1);
define('P_STATUS_SOLD', 2);
define('P_STATUS_DELETED', 3);
define('P_STATUS_AVAILABLE', 4);
define('P_STATUS_INCOMPLETE', 5);//product is saved in incomplete state to modify later
define('P_STATUS_ONHOLD', 6);

// google recaptcha secret key
define('recaptcha_secret','6Lfh_xsTAAAAAAEKsTeP0fX1yoGc5h7cEElXn8kl');
 */