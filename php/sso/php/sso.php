<?php
require_once __DIR__."/sso_definitions.php";
function sso_google_signin($token = ''){
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
		/* $output['error']				=	'sso_message5';
		$output['error_description']	=	"sendRequest to google api failed at line no. ".__LINE__." in file ".__FILE__." content: idtoken=".$token; */
	}
	else {

		if(isset($response->{'error_description'})) {
			$output['status']				=	false;
			/* $output['error']				=	'sso_message6';
			$output['error_description']	=	'Login credentials is not obtained from youtube'."at line no. ".__LINE__." at file ".__FILE__." content: id_token:".$token." response:".$response->{'error_description'}; */
		}
		else if(!isset($response->{'email_verified'})	||	!$response->{'email_verified'})
		{
			$output['status']				=	false;
			/* $output['error']				=	'sso_message6';
			$output['error_description']	=	'Google Unverified email'."at line no. ".__LINE__." at file ".__FILE__." content: id_token:".$token." response:".$response->{'error_description'}; */
		}
		else {
			$email	=	$response->{'email'};
			$name	=	explode(" ",$response->{'name'});
			
			$read_input	=    array(
					'Table'		=>	'userinfo',
					'Fields'	=>	'*',
					'clause'	=>	"username='$email'"
			);
			$d_data	=	DB_Read($read_input);

			if(!is_array($d_data)) {	//If user doesnt exists then insert a new verified user.
				$insert_data    =    array(
						'Table'	=>	'userinfo',
						'Fields'=>	array(
								'firstname'	=>	$name[0],
								'lastname'	=>	$name[1],
								'username'	=>	$email,
								'status'	=>	US_VERIFIED
						)
				);
				if(!DB_Insert($insert_data))	{
					$output['status']				=	false;
					/* $output['error']				=	'sso_message7';
					$output['error_description']	=	'Database DB_Insert failed at'.__LINE__." in file ".__FILE__." email: ".$email; */
				}
				else{
					$read_input	=    array(
							'Table'		=>	'userinfo',
							'Fields'	=>	'*',
							'clause'	=>	"username='$email'"
					);
					$d_data	=	DB_Read($read_input);
					
					$output['data']		=	array(
							'userid'	=>	$d_data[0]['userid'],
							'firstname'	=>	$d_data[0]['firstname'],
							'lastname'	=>	$d_data[0]['lastname'],
							'username'	=>	$d_data[0]['username']
					);
				}
			}
			else{
				$output['data']		=	array(
						'userid'	=>	$d_data[0]['userid'],
						'firstname'	=>	$d_data[0]['firstname'],
						'lastname'	=>	$d_data[0]['lastname'],
						'username'	=>	$d_data[0]['username']
				);
			}
		}// else error-description
	}// successfull google login api request
	return $output;
}
