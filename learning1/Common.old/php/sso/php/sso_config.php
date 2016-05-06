<?php
/*


*/
 
$sso_http_root			=	"http".(!empty($_SERVER['HTTPS'])?"s":"")."://".$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].'/'.str_replace($_SERVER['DOCUMENT_ROOT'], "", str_replace("\\", "/", __DIR__."./../../../../"));	

/*
	If only limited functionalities are used then limited configuration can be passed.
	The initialization would not return error for config unless a method using the missing config is invoked.
*/
$sso_config	=	array(
	'sso_signup_form_link'		=>	$sso_http_root.'?request=sso_signup_page',														//The link for sign up form. This will be referred in email sent to user for sign up verification.
	'sso_signup_mail_subject'	=>	'Verification link from Wisdom Talkies !!!',						// refers to mail subject for verificaiton link in signup process.
	'sso_reset_form_link'		=>	$sso_http_root.'?request=sso_reset_page', 													//The link for reset password form. This will be referred in email sent to user for change password
	'sso_reset_mail_subject'	=>	'Reset password link from Widom Talkies !!!',						//refers to mail subject for reseting the password
	'sso_c_encryption_key'		=>	"09334c83bf0d34e2029f7a477cb767f4ed437c175f165e9a752a392744bf30d3",	//Encryption key for encrypting reset, signup verification links
	'sso_mail_setting'	=>	array(
	
		'smtpHostName'	=>	'mail.veneratech.com',
		'smtpPort'		=>	'25',
		'smtpUsername'	=>	'vaibhav.singhal@veneratech.com',
		'smtpPassword'	=>	'vasi12*',
		'sender'		=>	'',
	
	),
	'sso_database_setting'	=>	array(	// The database must have a table 'userinfo', 'reset_link', 'verify_link'
	
		'source'	=> '',
		'host'		=>	'localhost',
		'port'		=>	'3306',
		'username'	=>	'root',
		'password'	=>	'',
		'database'	=>	'corona'
	
	),
);
