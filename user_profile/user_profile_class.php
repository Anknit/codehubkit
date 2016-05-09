<?php
/*
 * 1. Mandatory: Include db manager config and db files before this file
 * 2. Mandatory: Include user_profile_config file before includeing this file
 */
require_once __DIR__.'./../definitions.php';

class _user_profile
{
	public  $user_profile_init_status	=	false;
	public  $user_profile_init_error	=	'';
	
	public function _user_profile($user_profile_config	=	'')
	{
		global $Module;
		if($Module['profile']	==	true)
		{
			$this->user_profile_init_status	=	true;
		}
		else
		{
			$this->user_profile_init_status	=	false;
		}
	}	
	
	/*
		if data[userid] is not set then return logged in users email id
	*/
	public function user_profile_read($data)
	{
		$output	=	array(
			'status'	=>	true,
		);
		
		if(isset($data['user_id']))
			$user_id	=	$data['user_id'];
		else{
			$session_data	=	session_manager_get(array('uid'));
			if(isset($session_data['data'])){
				$user_id	=	$session_data['data']['uid'];
			}
		}	
		
		if(empty($user_id)){
			$output['status']				=	false;
			$output['error']				=	'user_profile_error1';
			$output['error_description']	=	'Invalid request. No userId was found in arguments or from session. At Line No. '.__LINE__.' in file '.__FILE__;
		}
		else{
			$user_data 	= DB_Read(array(
				'Table'=>'userinfo',
				'Fields'=>'username,emailid,location',
				'clause'=> 'userid = '.$user_id
			),'ASSOC','');
				
			if(is_array($user_data) && count($user_data)>0){
				$response   			=   $user_data[0];
				$usernameArr			=   explode(' ', $response['username'], 2);
				$response['firstName']  =   $usernameArr[0];
				$response['lastName']	=   $usernameArr[1];
				unset($response['username']);
				$output['data']			=	$response;
			}
			else{
				$output['status']				=	false;
				$output['error']				=	'user_profile_error1';
				$output['error_description']	=	'DB_Read failed to get user profile. At Line No. '.__LINE__.' in file '.__FILE__;
			}
		}
		
		return $output;
	}
	
	/*
		if data[userid] is not set then save logged in users profile.
		If user id is found in session or is sent by app that means user already exists. since uid is auto generated. so always update the database and no inserts
	*/
	public function user_profile_save($data)
	{
		$output	=	array(
			'status'	=>	true,
		);
		
		if(isset($data['user_id']))
			$user_id	=	$data['user_id'];
		else{
			$session_data	=	session_manager_get(array('uid'));
			if(isset($session_data['data'])){
				$user_id	=	$session_data['data']['uid'];
			}
		}	
		
		if(empty($user_id)){
			$output['status']				=	false;
			$output['error']				=	'user_profile_error2';
			$output['error_description']	=	'Invalid request. No userId was found in arguments or from session. So user_profile could not be saved. Recieved data: '.json_encode($data).' At Line No. '.__LINE__.' in file '.__FILE__;
		}
		else{
			if(!is_array($data) || count($data) < 1){
				$output['status']				=	false;
				$output['error']				=	'user_profile_error3';
				$output['error_description']	=	'No data was recieved to save user profile. Recieved data: '.json_encode($data).' At Line No. '.__LINE__.' in file '.__FILE__;
			}
			else{
				$Fields	=	array();
				
				$continue_after_change_Password = true;
				//With this api, the password can only be saved if current_password is set and is validated	
				if(!empty($data['current_password'])) {	//if its true then user wants to change the password. If validating current pass fails then return error
					//validate if the password is correct
				
					$user_data 	= DB_Read(array(
						'Table'=>	'userinfo',
						'Fields'=>	'password',
						'clause'=>	'userid = '.$user_id
					),'ASSOC','');
					
					if(is_array($user_data) && count($user_data)>0){
						if($user_data[0]['password']	==	md5($data['current_password'])){
							if(!empty($data['password']) && check_password($data['password'])){
								$Fields['password']	=	md5($data['password']);
							}
							else{
								$continue_after_change_Password	=	false;
								$output['status']				=	false;
								$output['error']				=	'user_profile_error5';
								$output['error_description']	=	'No new valid password was sent hence password cannot be changed. Recieved data: current-password:- '.$data['current_password'].' , new password:- '.$data['password'].' . At Line No. '.__LINE__.' in file '.__FILE__;
							}
						}
						else{
							$continue_after_change_Password	=	false;
							$output['status']				=	false;
							$output['error']				=	'user_profile_error4';
							$output['error_description']	=	'Password provided by user is incorrect hence password cannot be changed. Recieved data: current-password:- '.$data['current_password'].' , new password:- '.$data['password'].' . At Line No. '.__LINE__.' in file '.__FILE__;
						}
					}
				}
				
				if($continue_after_change_Password) {
					$updateUsernameInsession	=	false;
					if(!empty($data['username'])) {
						$Fields['username']	=	$data['username'];
						$updateUsernameInsession	=	$Fields['username'];
					}
					if(!empty($data['age']))
						$Fields['age']	=	$data['age'];
					if(!empty($data['location']))
						$Fields['location']	=	$data['location'];
					if(!empty($data['phone']))
						$Fields['phone']	=	$data['phone'];
					if(!empty($data['user_image']))
						$Fields['user_image']	=	$data['user_image'];
						
						
					//check if change password has also been sent then validate the current password and then update the new password
					//Read current password for userid sent above. If password matches then save the new one into field array else skip
					if(count($Fields) < 1) {
						$output['status']				=	false;
						$output['error']				=	'user_profile_error6';
						$output['error_description']	=	'No user profile information was recieved. Recieved data: '.json_encode($data).' At Line No. '.__LINE__.' in file '.__FILE__;
					}
					else{
						$user_data 	= DB_Update(array(
							'Table'=>'userinfo',
							'Fields'=>$Fields,
							'clause'=> 'userid = '.$user_id
						),'ASSOC','');
							
						if(!$user_data){
							$output['status']				=	false;
							$output['error']				=	'user_profile_error2';
							$output['error_description']	=	'DB_Update failed to save user profile. Recieved data: '.json_encode($data).' At Line No. '.__LINE__.' in file '.__FILE__;
						}
						else if($updateUsernameInsession !== false){
							$updateUsernameInsession	=	array(
								'username'	=>	$updateUsernameInsession
							);
							session_manager_set($updateUsernameInsession);
						}
					}
				}//if continue_after_change_Password
			}
		}
		
		return $output;
	}

}; // close class