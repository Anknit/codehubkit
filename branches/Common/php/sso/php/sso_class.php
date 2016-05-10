<?php
/*
 * 1. Mandatory: Include db manager config and db files before this file
 * 2. Mandatory: Include sso_config file before includeing this file
 */
require_once __DIR__.'/sso_definitions.php';
require_once __DIR__.'/encryption.php';
require_once __DIR__.'./../../MailMgr.php';
require_once __DIR__.'./../../ErrorHandling.php';
require_once __DIR__.'./../../commonfunctions.php';

class _sso{
	public  $sso_init_status	=	false;
	public  $sso_init_error	=	'';
	
	private $sso_mail_setting	=	array();
	private $sso_db_handle		=	'';
	
	private $sso_signup_form_link		=	'';
	private $sso_signup_mail_subject	=	'';
	
	private $sso_reset_form_link		=	'';
	private $sso_reset_mail_subject	=	'';
	
	private $sso_c_encryption_key	=	'';
	/*	Constructor
	

    /**
     * Provides an interface for initializing configuration and get DB handle if required.
	 
     * @param array	$sso_config The parameters as defined in sso config. In case no config is passed, the respective config will be picked from sso module config file.
     * @return object sso an instance of sso class
     * @access public
	/*
		
	*/
	public function _sso($sso_config	=	''){
		$checkConfigIsArray	=	is_array($sso_config);
		if(!$checkConfigIsArray){
			if(is_callable('get_SsoConfig')){
				$sso_config	=	get_SsoConfig();
			}
			else {
				require_once 'sso_config.php';
			}
		}
		
		if(!is_array($sso_config)){
			$this->sso_init_status	=	false;
			$this->sso_init_error	=	'No config found';
			return false;
		}
		else{
			if(!isset($sso_config['sso_database_setting'])){
				$this->sso_init_status	=	false;
				$this->sso_init_error	=	'database config not available';
			}
			else{
				if(!function_exists('DBMgr_Handle')){
					$this->sso_init_status	=	false;
					$this->sso_init_error	=	'database manager not available';
				}
				else {
					$this->sso_init_status	=	true;
					$sso_db_handle	=	DBMgr_Handle($sso_config['sso_database_setting']);
					$this->sso_db_handle	=	$sso_db_handle;

					unset($sso_config['sso_database_setting']);

					foreach($sso_config as $key=> $value){
						$this->$key	=	$value;
					}
				}
			}
		}
	}

	private function validateEmail($email	=	''){
		$output	=	false;
		if($email != NULL && $email != '' && check_email($email)){
			$output	=	true;
		}
		return $output;	
	}
	
	private function validatePassword($password	=	''){
		$output	=	false;
		if($password != NULL && $password != '' && check_password($password)){
			$output	=	true;
		}
		return $output;	
	}

	private function sso_get_sanitize_config($config){
		if(!isset($this->$config) || $this->$config == '' || $this->$config == NULL){
			return false;
		}
		else{
			return $this->$config;
		}
	}

	private function sso_get_mail_body($mail_arguments, $mail_body_file_path){
		$mail_html	=	'';
		ob_start();
		require_once $mail_body_file_path;
		$mail_html = ob_get_contents();
		ob_clean();
		
		return $mail_html;
	}
	
	public function sso_signin_verify($email = '',$password = '') {
		$output	=	array(
			'status'	=>	true
		);
		
		if(!$this->validateEmail($email))	{
			$output['status']				=	false;
			$output['error']				=	'sso_message1';
			$output['error_description']	=	'Signin email matching failed '.'at line no. '.__LINE__.' at file '.__FILE__." content: email:".$email;
		}
		elseif(!$this->validatePassword($password))	{
			$output['status']				=	false;
			$output['error']				=	'sso_message2';
			$output['error_description']	=	'Signin password matching failed with regular expression '.'at line no. '.__LINE__.' in file '.__FILE__." content: password:".$password;
		}
		else
		{
			$password	=	md5($password);
		
			$read_input    =    array(
				'Table'		=>	'userinfo',
				'Fields'	=>	'password',
				'clause'	=>	"emailid='$email' AND status=".US_VERIFIED
			);
			$d_data    =    $this->sso_db_handle->Read($read_input, '', '', '');		
	
			if(!is_array($d_data)) {
				$output['status']				=	false;
				$output['error']				=	'sso_message14';
				$output['error_description']	=	'No user found with the credentials - email:'.$email.' , password:'.$password.'at line no. '.__LINE__.' in file '.__FILE__;
			}
			else if(strcmp($d_data[0]['password'],$password)	!==	0)
			{
				$output['status']				=	false;
				$output['error']				=	'sso_message22';
			}
			else{
	
				$ott		=	sha1( uniqid( "",true ) );	
				$ott_update_input	=	array (
					'Table'		=>	'userinfo',
					'Fields'	=>	array(
						'sso_ott'	=>	$ott
					),
					'clause'	=>	"emailid='$email'"
				);
		
				$d_data    =    $this->sso_db_handle->Update($ott_update_input);
				if($d_data    !==	false){
					$output['data']	=	array(
						"ott"		=>	$ott
					);
				}
				else{
					$output['status']				=	false;
					$output['error']				=	'sso_message4';
					$output['error_description']	=	'Database DB_Update failed to update ott for the user email:'.$email;
				}
			}
		}
		
		return $output;
	}

	public function sso_google_signin($token = '') {
		$output	=	array(
			'status'	=>	true
		);
			
		$g_request    =    "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=".$token;
	
		$options = array(
			'http' => array(
				'method'  => "GET",
			),
		);
		$response    =    json_decode(sendExternalRequest($options, $g_request));
		
		if($response	==	NULL || $response	==	"") {
			$output['status']				=	false;
			$output['error']				=	'sso_message5';
			$output['error_description']	=	"sendRequest to google api failed at line no. ".__LINE__." in file ".__FILE__." content: idtoken=".$token;
		}
		else {	
		
			if(isset($response->{'error_description'})) {
				$output['status']				=	false;
				$output['error']				=	'sso_message6';
				$output['error_description']	=	'Login credentials is not obtained from youtube'."at line no. ".__LINE__." at file ".__FILE__." content: id_token:".$token." response:".$response->{'error_description'};
			}
			else if(!isset($response->{'email_verified'})	||	!$response->{'email_verified'})
			{
				$output['status']				=	false;
				$output['error']				=	'sso_message6';
				$output['error_description']	=	'Google Unverified email'."at line no. ".__LINE__." at file ".__FILE__." content: id_token:".$token." response:".$response->{'error_description'};
			}
			else {
				$email	=    $response->{'email'};
				$name	=    $response->{'name'};
				$read_input	=    array(
					'Table'		=>	'userinfo',
					'Fields'	=>	'*',
					'clause'	=>	"emailid='$email'"
				);
				$d_data	=	$this->sso_db_handle->Read($read_input,'','','');
				
				$ott	=	sha1(uniqid("",true));
				
				if(!is_array($d_data)) {	//If user doesnt exists then insert a new verified user.
					$insert_data    =    array(
						'Table'	=>	'userinfo',
						'Fields'=>	array(
							'sso_ott'	=>	$ott,
							'regAuthorityId'=>0,
							'usertype'=>UT_NORMAL,
							'username'=>$name,
							'emailid'=>$email,
							'status'=>US_VERIFIED
						)
					);
					if(!$this->sso_db_handle->Insert($insert_data))	{
						$output['status']				=	false;
						$output['error']				=	'sso_message7';
						$output['error_description']	=	'Database DB_Insert failed at'.__LINE__." in file ".__FILE__." email: ".$email;
					}
					else{
						$output['data']	=	array(
							"ott"		=>	$ott
						);
						$output['data']['data_for_extended_process']	=	array(
							"status"	=>	true,
							"email"		=>	$email
						);
					}
				}
				else {
					$ott_update_input	  =	   array(
						'Table'		=>	'userinfo',
						'Fields'	=>	array(
							'sso_ott'	=>	$ott
						),
						'clause'	=>	"emailid='$email'"
					);
					
					if(!$this->sso_db_handle->Update($ott_update_input))	{
						$output['status']				=	false;
						$output['error']				=	'sso_message4';
						$output['error_description']	=	'Database DB_Update failed to update ott for the user email:'.$email;
					}
					else{
						$output['data']	=	array(
							"ott"		=>	$ott,
						);
						$output['data']['data_for_extended_process']	=	array(
								"status"	=>	false
						);
					}
				}
				
				if(!empty($output['data'])){
					$output['data']['user_login_source']	=	Google;
				}
			}// else error-description
		}// successfull google login api request
		return $output;
	}

	public function sso_initiate_signup($email = '') {
		$output	=	array(
			'status'	=>	true
		);
		
		if(!$this->validateEmail($email))	{
			$output['status']				=	false;
			$output['error']				=	'sso_message1';
			$output['error_description']	=	'Signup email matching failed '.'at line no. '.__LINE__.' at file '.__FILE__." content: email:".$email;
			//	$output['event_description']		=	'WARNING SIGNUP matching allowed with regular expression '."at line no. ".__LINE__." at file ".__FILE__." content: email=".$email
		}
		else {
				
			$read_input    =    array(
				'Table'		=>	'userinfo',
				'Fields'	=>	'userid,username,status',
				'clause'	=>	"emailid='$email'"
			);
			$d_data    =    $this->sso_db_handle->Read($read_input,'','','');		
			
			if( is_array($d_data) && $d_data[0]['status']== US_VERIFIED )
			{
				$output['status']				=	false;
				$output['error']				=	'sso_message8';
				$output['error_description']	=	'User '.$email.' already exists and is a verified user, line no. '.__LINE__.' in file '.__FILE__;
			}
			else
			{
				if(is_array($d_data)&&$d_data[0]['status'] == US_UNVERIFIED ) { // send the verify link again to the users email address
					$read_input  =   array(
						'Table'	=>	'verify_link',
						'Fields'=>	'id',
						'clause'=>	"emailid='$email'"
					);
					$d_data	=   $this->sso_db_handle->Read($read_input,'','','');
					if(!is_array($d_data)) {	//If verify link id is not found in database for the users email address
						$output['status']				=	false;
						$output['error']				=	'sso_message10';
						$output['error_description']	=	'verify link not found in databse for the user\'s email address: '.$email.' at Line no. '.__LINE__.' in file '.__FILE__;
					}
					else {
						$cipher	=	inner_encrypt($email , $d_data[0]['id']);
						$update_data	=	array(
							'Table'		=>	'verify_link',
							'Fields'	=>	array(
								'verify_key'	=>	$cipher[1]
							),
							'clause'	=>	"emailid='$email'"
						);
					}
				}
				else 
				{
					$insert_data    =    array(
						'Table'	=>	'userinfo',
						'Fields'=>	array(
							'emailid'	=>	$email,
							'status'	=>	US_UNVERIFIED,
							'usertype'	=>	UT_NORMAL
						)
					);
					if(!$this->sso_db_handle->Insert($insert_data))	{	//insert failed
						$output['status']				=	false;
						$output['error']				=	'sso_message7';
						$output['error_description']	=	'Database DB_Insert failed at'.__LINE__." in file ".__FILE__." for user email: ".$email;
					}
					else{
						$insert_data    =    array(
							'Table'	=>	'verify_link',
							'Fields'=>	array(
								'emailid'	=>	$email
							)
						);
						$d_id	=	$this->sso_db_handle->Insert($insert_data);
						if($d_id == false) {	//If verify link id is not generated
							$output['status']				=	false;
							$output['error']				=	'sso_message10';
							$output['error_description']	=	'verify link could not be inserted in databse for the user\'s email address: '.$email.' at Line no. '.__LINE__.' in file '.__FILE__;
						}
						else {
							$cipher	=	inner_encrypt($email,$d_id);
							$update_data	=	array(
								'Table'	=>	'verify_link',
								'Fields'=>	array(
									'verify_key'=>$cipher[1]
								),
								'clause'=>"id='$d_id'"
							);
						}
					}
				}
				
				if(!$this->sso_db_handle->Update($update_data)) {	//update failed
					$output['status']				=	false;
					$output['error']				=	'sso_message10';
					$output['error_description']	=	'verify link key could not be inserted in databse for clause '.$update_data['clause'].' at Line no. '.__LINE__.' in file '.__FILE__;
				}
				else {
					$cipher    =    outer_encrypt($cipher[0], $this->sso_get_sanitize_config('sso_c_encryption_key'));
					if(!$cipher) {
						$output['status']				=	false;
						$output['error']				=	'sso_message10';
						$output['error_description']	=	'verify link key could not be inserted in databse for clause '.$update_data['clause'].' at Line no. '.__LINE__.' in file '.__FILE__;
					}
					else {
			
						$mail_config	=	$this->sso_get_sanitize_config('sso_mail_setting');
						$mail_subject	=	$this->sso_get_sanitize_config('sso_signup_mail_subject');
						$mail_form_link	=	$this->sso_get_sanitize_config('sso_signup_form_link');
						if(!$mail_config){
							$output['status']				=	false;
							$output['error']				=	'sso_message10';
							$output['error_description']	=	'email configuration not available in sso config at line no. '.__LINE__.' in file '.__FILE__;
						}
						elseif(!$mail_subject){
							$output['status']				=	false;
							$output['error']				=	'sso_message10';
							$output['error_description']	=	'sso signup email subject not available in sso config at line no. '.__LINE__.' in file '.__FILE__;
						}
						elseif(!$mail_form_link){
							$output['status']				=	false;
							$output['error']				=	'sso_message10';
							$output['error_description']	=	'signup form link not available at line no. in sso config'.__LINE__.' in file '.__FILE__;
						}
						else { //all config parameters available
							$mail_form_link   		.=	'&data[pass]='.rawurlencode($cipher);
							$mail_arguments	=	array();
							$mail_arguments['mail_form_link']	=	$mail_form_link;
							
							$mail_html	=	$this->sso_get_mail_body($mail_arguments, __DIR__."./../mail_templates/sign-up-mail.php");
							
							if(!send_Email($email, $mail_subject, $mail_html, '','', $mail_config))
							{
								$output['status']				=	false;
								$output['error']				=	'sso_message10';
								$output['error_description']	=	'Failed to send signup email to the user '.$email.' , at line no. '.__LINE__.' in file '.__FILE__;
							}
						}
					}
				}
			}//else if user is verified
		}//validate email
			
		return $output;
	}
	
	public function sso_initiate_reset($email	=	'') {
		$output	=	array(
			'status'	=>	true
		);
		
		if(!$this->validateEmail($email))	{
			$output['status']				=	false;
			$output['error']				=	'sso_message1';
			$output['error_description']	=	'reset email matching failed '.'at line no. '.__LINE__.' at file '.__FILE__." content: email:".$email;
		}
		else {
			//	$output['event_description']		=	'WARNING RESET matching allowed '."at line no. ".__LINE__." at file ".__FILE__." content: email=".$email
			$read_input		=    array(
				'Table'	=>	'userinfo',
				'Fields'=>	'userid,username,status',
				'clause'=>	"emailid='$email'"
			);
			$d_data		=	$this->sso_db_handle->Read($read_input,'','','');
			
			if( !is_array($d_data) ) {
				$output['status']				=	false;
				$output['error']				=	'sso_message14';
				$output['error_description']	=	'No user found with the credentials - email: '.$email.'at line no. '.__LINE__.' in file '.__FILE__;
			}
			else {
				if($d_data[0]['status']	==	US_UNVERIFIED)	{
					//send verification link email
					$sendverificationLink	=	$this->sso_initiate_signup($email);
					$output['status']				=	false; //$sendverificationLink['status'];
					$output['error']				=	'sso_message21';	   //$sendverificationLink['error'];
					$output['error_description']	=	'';	   //$sendverificationLink['error_description'];
				}
				else {
					$read_input    =    array(
						'Table'=>	'reset_link',
						'Fields'=>	'id',
						'clause'=>	"emailid='$email'"
					);
					$d_data    =    $this->sso_db_handle->Read($read_input,'','','');
					
					$update_data	=	false;
					if(is_array($d_data)){
						$cipher    =    inner_encrypt($email,$d_data[0]['id']);	//update
						$update_data    =    array(
							'Table'	=>	'reset_link',
							'Fields'=>	array(
								'reset_key'	=>	$cipher[1]
							),
							'clause'	=>	"emailid='$email'"
						);
					}
					else
					{
						$insert_data	=	array(
							'Table'		=>	'reset_link',
							'Fields'	=>	array(
								'emailid'	=>	$email
							)
						);
						$d_id     =     $this->sso_db_handle->Insert($insert_data);
						if($d_id == false) {	//If verify link id is not generated
							$output['status']				=	false;
							$output['error']				=	'sso_message11';
							$output['error_description']	=	'reset password link could not be inserted in databse for the user\'s email address: '.$email.' at Line no. '.__LINE__.' in file '.__FILE__;
						}
						else {
							$cipher	=	inner_encrypt($email,$d_id);
							$update_data	=	array(
								'Table'	=>	'reset_link',
								'Fields'=>	array(
									'reset_key'=>$cipher[1]
								),
								'clause'=>"id='$d_id'"
							);
						}
					}
					
					if($update_data === false || !$this->sso_db_handle->Update($update_data)){
						$output['status']				=	false;
						$output['error']				=	'sso_message11';
						$output['error_description']	=	'reset password link key could not be updated in databse for clause '.$update_data['clause'].' at Line no. '.__LINE__.' in file '.__FILE__;
					}
					else{
						$cipher    =    outer_encrypt($cipher[0], $this->sso_get_sanitize_config('sso_c_encryption_key'));
						if(!$cipher) {
							$output['status']				=	false;
							$output['error']				=	'sso_message11';
							$output['error_description']	=	"Unable to find sso_c_encryption_key from config"."at line no. ".__LINE__." in file ".__FILE__;
						}
						else{
			
							$mail_config	=	$this->sso_get_sanitize_config('sso_mail_setting');
							$mail_subject	=	$this->sso_get_sanitize_config('sso_reset_mail_subject');
							$mail_form_link	=	$this->sso_get_sanitize_config('sso_reset_form_link');
							if(!$mail_config){
								$output['status']				=	false;
								$output['error']				=	'sso_message11';
								$output['error_description']	=	'email configuration not available in sso config at line no. '.__LINE__.' in file '.__FILE__;
							}
							elseif(!$mail_subject){
								$output['status']				=	false;
								$output['error']				=	'sso_message11';
								$output['error_description']	=	'sso reset password email subject not available in sso config at line no. '.__LINE__.' in file '.__FILE__;
							}
							elseif(!$mail_form_link){
								$output['status']				=	false;
								$output['error']				=	'sso_message11';
								$output['error_description']	=	'reset password form link not available at line no. in sso config'.__LINE__.' in file '.__FILE__;
							}
							else { //all config parameters available
								$mail_form_link   		.=	'&data[pass]='.rawurlencode($cipher);
								$mail_arguments	=	array();
								$mail_arguments['mail_form_link']	=	$mail_form_link;
								
								$mail_html	=	$this->sso_get_mail_body($mail_arguments, __DIR__."./../mail_templates/reset-mail.php");
								
								global $mailError;
								if(!send_Email($email, $mail_subject, $mail_html, '','', $mail_config))	{
									$output['status']				=	false;
									$output['error']				=	'sso_message11';
									$output['error_description']	=	'email sending failed during reset password '."at line no. ".__LINE__." at file ".__FILE__." content: email:".$email;
								}
							}
						}// send mail validations
					}
				}//for unverified user send verification email link
			}// if user exists in database
		}// if email address is valid
		
		return $output;
	}

	public function sso_reset_pass($cipher = '', $password = '') {
		
		$output	=	array(
			'status'	=>	true
		);
		
		$cipher    =   rawurldecode($cipher);
		
		if(!check_cipher($cipher))	{
			$output['status']				=	false;
			$output['error']				=	'sso_message12';
			$output['error_description']	=	'reset cipher matching check_cipher failed '.'at line no. '.__LINE__.' at file '.__FILE__." content: cipher:".$cipher;
		}
		else {
			//	$output['event_description']		=	"WARNING RESET matching allowed with regular expression "."at line no. ".__LINE__." at file ".__FILE__." content: cipher=".$cipher
			$text    =    outer_decrypt($cipher, $this->sso_get_sanitize_config('sso_c_encryption_key'));
			if(!$text) {
				$output['status']				=	false;
				$output['error']				=	'sso_message12';
				$output['error_description']	=	'reset cipher matching outer_decrypt failed '.'at line no. '.__LINE__.' at file '.__FILE__." content: cipher:".$cipher;
			}
			else{
				$read_input    =    array(
					'Fields'	=>	'emailid,reset_key',
					'Table'		=>	'reset_link',
					'clause'	=>	"id=".$text[1]
				);
				$d_data    =    $this->sso_db_handle->Read($read_input,'','','');
				if(!is_array($d_data)){
					$output['status']				=	false;
					$output['error']				=	'sso_message13';
					$output['error_description']	=	'Link has expired or the request is fake '.'at line no. '.__LINE__.' at file '.__FILE__." content: cipher:".$cipher;
				}
				else{
					$inner_key    =    $d_data[0]['reset_key'];
					$email    =    inner_decrypt($text[0],$inner_key);
					
					$read_input	=	array(
						'Table'		=>	'userinfo',
						'Fields'	=>	'userid,username,status',
						'clause'	=>	"emailid='$email'"
					);
					$d_data	=	$this->sso_db_handle->Read($read_input,'','','');
					$check_array	=	is_array($d_data);
					if(!$check_array) {
						$output['status']				=	false;
						$output['error']				=	'sso_message14';
						$output['error_description']	=	'No user found with the credentials - email:'.$email.', inner_decrypt failed at line no. '.__LINE__.' at file '.__FILE__." content: cipher=".$cipher." inner_key:".$inner_key;
					}
					else if($check_array && $d_data[0]['status']	==	US_UNVERIFIED) {	
						$output['status']				=	false;
						$output['error']				=	'sso_message15';
						$output['error_description']	=	'Unverified users cannot reset password - email:'.$email;
					}
					else if($check_array && $d_data[0]['status']	==	US_VERIFIED)
					{
						$ott	=	sha1(uniqid("",true));
						$password	=	md5($password);
						$update_data    =    array(
							'Table'	=>	'userinfo',
							'Fields'=>	array(
								'sso_ott'	=>	$ott,
								'password'	=>	$password
							),
							'clause'=>	"emailid='$email'"
						);
						if(!$this->sso_db_handle->Update($update_data)) {
							$output['status']				=	false;
							$output['error']				=	'sso_message16';
							$output['error_description']	=	'Database DB_Update failed to update ott and password for the user email:'.$text.' content: ott-'.$ott.' password -'.$password.' at line no. '.__LINE__.' at file '.__FILE__;
						}
						else {
							$delete_data	=	"DELETE FROM reset_link WHERE emailid='$email'";
							$d_id     		=     $this->sso_db_handle->Query($delete_data,"result","", '');
						}
					} 
		
				}
			}
		
		} //close validate cipher
		
		return $output;
	}
	
	public function sso_signuppass($cipher = '', $user_info = '') {
	
		$output	=	array(
			'status'	=>	true
		);
		
		$cipher    =   rawurldecode($cipher);
		
		if(!check_cipher($cipher))	{
			$output['status']				=	false;
			$output['error']				=	'sso_message12';
			$output['error_description']	=	'signup cipher matching check_cipher failed '.'at line no. '.__LINE__.' at file '.__FILE__." content: cipher:".$cipher;
		}
		else {
			//	$output['event_description']		=	"WARNING RESET matching allowed with regular expression "."at line no. ".__LINE__." at file ".__FILE__." content: cipher=".$cipher
			$text    =    outer_decrypt($cipher, $this->sso_get_sanitize_config('sso_c_encryption_key'));
			if(!$text) {
				$output['status']				=	false;
				$output['error']				=	'sso_message12';
				$output['error_description']	=	'reset cipher matching outer_decrypt failed '.'at line no. '.__LINE__.' at file '.__FILE__." content: cipher:".$cipher;
			}
			else{
				$read_input    =    array(
					'Fields'	=>	'emailid,verify_key',
					'Table'		=>	'verify_link',
					'clause'	=>	"id=".$text[1]
				);
				$d_data    =    $this->sso_db_handle->Read($read_input,'','','');
				if(!is_array($d_data)){
					$output['status']				=	false;
					$output['error']				=	'sso_message17';
					$output['error_description']	=	'Link has expired or the request is fake '.'at line no. '.__LINE__.' at file '.__FILE__." content: cipher:".$cipher;
				}
				else{
					$inner_key    =    $d_data[0]['verify_key'];
					$email    =    inner_decrypt($text[0],$inner_key);
					
					$read_input	=	array(
						'Table'		=>	'userinfo',
						'Fields'	=>	'userid,username,status',
						'clause'	=>	"emailid='$email'"
					);
					$d_data	=	$this->sso_db_handle->Read($read_input,'','','');
					$check_array	=	is_array($d_data);
					if(!$check_array) {
						$output['status']				=	false;
						$output['error']				=	'sso_message14';
						$output['error_description']	=	'No user found with the credentials - email:'.$email.', inner_decrypt failed at line no. '.__LINE__.' at file '.__FILE__." content: cipher=".$cipher." inner_key:".$inner_key;
					}
					else if($check_array && $d_data[0]['status']	==	US_VERIFIED) {	
						$output['status']				=	false;
						$output['error']				=	'sso_message18';
						$output['error_description']	=	'Already a verified user - email:'.$email.' at line no. '.__LINE__.' at file '.__FILE__;
					}
					else if($check_array && $d_data[0]['status']	==	US_UNVERIFIED)
					{
						$user_meta_info	=	json_decode($user_info,true);
						$password		=	$user_meta_info['password'];
						$username		=	$user_meta_info['username'];
						if($username	==	"" ||	$password	==	""	||	strlen($password) < 6)	{
							$output['status']				=	false;
							$output['error']				=	'sso_message19';
							$output['error_description']	=	"first name or password received is null or length of passsword is < 6 "."at line no. ".__LINE__." at file ".__FILE__." Content: first_name".$first_name."password".$password;
						}
						$password	=	md5($password);
						$update_data    =    array(
							'Table'	=>'userinfo',
							'Fields'=>array(
								'regAuthorityId'	=>	0,
								'status'			=>	US_VERIFIED,
								'password'			=>	$password
							),
							'clause'	=>	"emailid='$email'"
						);
			
						foreach($user_meta_info	as $key	=>	$value)	{
							if($key	!=	"password")
							{
								$update_data['Fields'][$key]	=	$value;
							}
						}
								
						if(!$this->sso_db_handle->Update($update_data)) {
							$output['status']				=	false;
							$output['error']				=	'sso_message20';
							$output['error_description']	=	'Database DB_Update failed to update user details for the user email:'.$email.' at line no. '.__LINE__.' at file '.__FILE__;
						}
						else {
							$ott	=	sha1(uniqid("",true));
							$update_ott_data    =    array(
								'Table'	=>	'userinfo',
								'Fields'=>	array(
									'sso_ott'	=>	$ott
								),
								'clause'=>	"emailid='$email'"
							);
							if(!$this->sso_db_handle->Update($update_ott_data)) {
								$output['status']				=	false;
								$output['error']				=	'sso_message20';
								$output['error_description']	=	'Database DB_Update failed to update user ott for the user email:'.$email.' ott - '.$ott.', at line no. '.__LINE__.' at file '.__FILE__;
							}
							else {
								$delete_data	=	"DELETE FROM verify_link WHERE emailid='$email'";
								$d_id     		=     $this->sso_db_handle->Query($delete_data,"result","", '');
								if($d_id    !==	false){
									$output['data']	=	array(
										"ott"		=>	$ott
									);
									$output['data']['data_for_extended_process']	=	array(
										"status"	=>	true,
										"email"		=>	$email	
									);
								}
							}
						}//else update user details in database
					} //complete signup process only for unverified users
				}// if signup verify cipher is found in database
			}//if outer_decrupt cipher doesn't fail
		} //close validate sanitized cipher
		
		return $output;
	}
		
}; // close class