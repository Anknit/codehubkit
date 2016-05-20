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
	}
	else
	{
		if(isset($response->{'error_description'})) {
			$output['status']				=	false;
		}
		else if(!isset($response->{'email_verified'})	||	!$response->{'email_verified'})
		{
			$output['status']				=	false;
		}
		else
		{
			$email		=	$response->{'email'};
			$name		=	explode(" ",$response->{'name'});
			$picture	=	false;
			if(isset($response->{'picture'})){
				$picture	=	$response->{'picture'};
			}
			
			$read_input	=    array(
					'Table'		=>	'userinfo',
					'Fields'	=>	'*',
					'clause'	=>	"username='$email'"
			);
			$d_data	=	DB_Read($read_input);

			if(!is_array($d_data))//If user doesnt exists then insert a new verified user.
			{
				$insert_data    =    array(
						'Table'	=>	'userinfo',
						'Fields'=>	array(
								'firstname'	=>	$name[0],
								'lastname'	=>	$name[1],
								'username'	=>	$email,
								'status'	=>	US_VERIFIED,
								'user_type'	=>	UT_BUYER
						)
				);
				if($picture){
					$insert_data['Fields']['image']	=	$picture;
				}
				if(!DB_Insert($insert_data)){
					$output['status']				=	false;
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
							'username'	=>	$d_data[0]['username'],
							'image'		=>	$d_data[0]['image'],
							'user_type'	=>	$d_data[0]['user_type']
					);
				}
			}
			else{
				/*
				 * update image of user
				 */
				$update_object	=	array(
						'Table'		=>	'userinfo',
						'Fields'	=>	array(
								'image'	=>	$picture
						),
						'clause'	=>	"username='".$email."'"
				);
				$update_status	=	DB_Update($update_object);
				
				$output['data']		=	array(
						'userid'	=>	$d_data[0]['userid'],
						'firstname'	=>	$d_data[0]['firstname'],
						'lastname'	=>	$d_data[0]['lastname'],
						'username'	=>	$d_data[0]['username'],
						'image'		=>	$d_data[0]['image'],
						'user_type'	=>	$d_data[0]['user_type']
				);
			}
		}// else error-description
	}// successfull google login api request
	return $output;
}
