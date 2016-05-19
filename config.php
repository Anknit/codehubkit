<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php

require_once __DIR__.'/Db.php';	//This is required for get_DbConfig function

/* require_once __DIR__.'/adminMethods.php'; */

define('DEVELOPMENT', true);	//If DEVELOPMENT is true then error, event, performance logging, will be enabled and secure cookie will be disbled

$APP_CONFIG['APP_PROCESS_REQUEST']		=	false;
$APP_CONFIG['APP_ERROR_CODES']			=	array();
$APP_CONFIG['RPU_ERROR_LOGGING']		=	DEVELOPMENT;
$APP_CONFIG['RPU_EVENT_LOGGING']		=	DEVELOPMENT;
$APP_CONFIG['RPU_PERFORMANCE_LOGGING']	=	DEVELOPMENT;

function get_MailConfig(){
	$config	=	array(
			'smtpHostName'	=>	'ssl://smtp-relay.gmail.com',
			'smtpPort'		=>	'465',
			'smtpUsername'	=>	'support@wisdomtalkies.com',
			'smtpPassword'	=>	'VeneraTechnologies123',
			'sender'		=>	'support@wisdomtalkies.com' 
	);	

	return $config;
}

function get_SessionMgrConfig(){
	$secure	=	!DEVELOPMENT;

    $config	=	array(
		'sess_mgr_name'			=>	'dummy',
		'session_cookie_life'	=>	30*24*60*60,
		'session_cookie_secure'	=>	$secure,	//false for development
	);
	
	return $config;
}

function get_SsoConfig(){

	$sso_http_root	=	getHttpRoot();
	
	$config	=	array(
		'sso_signup_form_link'		=>	$sso_http_root.'?request=sso_signup_page',														//The link for sign up form. This will be referred in email sent to user for sign up verification.
		'sso_signup_mail_subject'	=>	'Account activation at WisdomTalkies',						// refers to mail subject for verificaiton link in signup process.
		'sso_reset_form_link'		=>	$sso_http_root.'?request=sso_reset_page', 													//The link for reset password form. This will be referred in email sent to user for change password
		'sso_reset_mail_subject'	=>	'Your password reset request at WisdomTalkies',						//refers to mail subject for reseting the password
		'wt_welcome_mail_subject'	=>	'Welcome to WisdomTalkies!', //refers to mail subject for post account activation
		'sso_c_encryption_key'		=>	'09334c83bf0d34e2029f7a477cb767f4ed437c175f165e9a752a392744bf30d3',	//Encryption key for encrypting reset, signup verification links
		'sso_mail_setting'			=>	get_MailConfig(),	//an array to be consumed by send_mail
		'sso_database_setting'		=>	get_DbConfig()		//an array to be consumed by Db-Mgr_getHandle
	);
	return $config;
}

function get_OssConfig()
{
	return array(
		'oss_address'		=>	'http://localhost:9090',
		'oss_index'			=>	'new_ankit',
		'oss_crawler'		=>	'ankit_crawl',
		'oss_auto_name'		=>	'autocompletion',
		'oss_keyword_field'	=>	'ankit_query',
		'oss_user'			=>	'wisdom_talkies',
		'oss_login_key'		=>	'471e05980e54936c084031bd45373d85'
	);
}

function get_IsbnConfig(){
	return array(
			'isbn_key'		=>	"RSKRJTRM"
	);
}

define('sso_gwt_browser_key', '42338840257-9ll1lip2eqc6dg2p00ntl94njnb39d1r.apps.googleusercontent.com');//g=google, wt=wisdomtalkies:  Browser keys (google+) for wisdom talkies client
define('sso_gc_server_key', 'AIzaSyAD2JZzGFW3-umHb_USE0pUdkl88OxUQO0');	//Server keys (google+) for wisdom talkies server side 

define('projectFolderName', 'geo');
define('commonFolderName', 'Common');
define('commonCSSFolderName', 'Common/css');
define('commonJSFolderName', 'Common/js');
define('projectCSSFolderName', 'geo/css');
define('projectJSFolderName', 'geo/js');
define('version', 	'11');
define('copyright', '2016 Wisdom Talkies');
define('description_of_wisdomtalkies','WisdomTalkies is all about preserving this Wisdom and making the world happier and smarter');
define('title_of_wisdomtalkies','WisdomTalkies');
define('keywords_of_wisdomtalkies','video,share,bookmark');
?>