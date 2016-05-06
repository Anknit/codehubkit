<?php
/*
 * @return session id
* 2.Mandatory: Include db config and db file before includeing this file
* 3.Mandatory: INclude sso config file  before including this file
*/

class _session_manager {
	public $session_init_status	=	false;
	public $session_init_error	=	'';	
	
	private $session_manager_name	=	'';
	private $session_cookie_life	=	0;	//In seconds. Currently it counts to 1 year approx
	private	$session_cookie_secure	=	false;

	public function _session_manager($session_config	=	'')
	{
		//find right session config
		if(is_array($session_config))
		{

		}
		else if(is_callable('get_SessionMgrConfig'))
		{
			$session_config	=	get_SessionMgrConfig();
		}
		else {
			require_once 'session_manager_config.php';
		}
		
		$this->session_init_status	=	true;
		
		if(isset($session_config['sess_mgr_name']))
			$this->session_manager_name	=	$session_config['sess_mgr_name'];
			
		if(isset($session_config['session_cookie_life']))
			$this->session_cookie_life	=	$session_config['session_cookie_life'];
			
		if(isset($session_config['session_cookie_secure']))
			$this->session_cookie_secure	=	$session_config['session_cookie_secure'];
	}
	
	private function set_ini_config(){
		$output	=	true;

		ini_set('session.gc_probability', 1);	//If session expires then ensure that session is flushed and cleared at all instances
		ini_set('session.gc_divisor', 100);		//If session expires then ensure that session is flushed and cleared at all instances

		ini_set('session.gc_maxlifetime', $this->session_cookie_life);	//If session expires then ensure that session is flushed and cleared at all instances
		ini_set('session.cookie_secure', $this->session_cookie_secure);
		
		return $output;
	}
	
	public function session_manager_issession_set(){
		$output	=	true;
		
		$session_status	=	session_status();
		switch($session_status){
			case PHP_SESSION_ACTIVE :
			
			break;
			default:
				$output	=	false;
		}
		
		return $output;
	}
	
	public function session_manager_start()
	{
		$output	=	array(
			'status'	=>	true
		);

		if(!$this->session_manager_issession_set()) {
			$this->set_ini_config();
			session_name($this->session_manager_name);
			session_set_cookie_params($this->session_cookie_life, "/");	//Required for browser cookie cleanup
		}

		session_start();
		
		return $output;
	}

	public function session_manager_close()
	{
		$output	=	array(
			'status'	=>	true
		);
	
		session_unset();
		session_destroy();
		
		return $output;
	}

	public function session_manager_set($data)
	{
		$output	=	array(
			'status'	=>	true
		);

		if(!$this->session_manager_issession_set()) {
			$this->session_manager_start();
		}

		foreach( $data as $key=>$var )
		{
			$_SESSION[$key] = $var;
		}
		
		return $output;
	}
	
	public function session_manager_get($data)
	{
		$output	=	array(
			'status'	=>	true
		);


		if(!$this->session_manager_issession_set()) {
			$this->session_manager_start();
		}

		if(!isset($_SESSION))
		{
			$output['status']	=	false;
		}
		else{ 
			$result	=	array();
			for($i=0;	$i< count($data);	$i++)
			{
				if(isset($_SESSION[$data[$i]]))
				{
					$result[$data[$i]]	=	$_SESSION[$data[$i]];
				}
				else
				{
					$result[$data[$i]]	=	NULL;
				}
				
			}
			
			if($i > 0){
				$output['data']	=	$result;
			}
		}
		
		return $output;
	}
}