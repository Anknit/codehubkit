<?php
require_once __DIR__.'./../require.php';
require_once __DIR__.'./../../Common/php/commonfunctions.php';
require_once __DIR__.'./../../Common/php/openSearchServerAPI.php';
require_once __DIR__.'/verify_ott.php';
require_once __DIR__.'/contentSearchClass.php';
require_once __DIR__.'/appRequestClass.php';
require_once __DIR__.'./../bookmarks/bookmark.php';
require_once __DIR__.'./../curation/curation.php';
require_once __DIR__.'./../recommend/recommend.php';
require_once __DIR__.'./../review_curation/review_curation.php';
require_once __DIR__.'./../user_profile/user_profile.php';
	
function verify_ott_on_sso_response($rpu_response){
	if ($rpu_response['status']	==	true)	{
		ott_verification($rpu_response['data']);
	}
	
	return;
}

function send_welcome_mail_after_signup()
{
	//sending welcome mail to user after signup
	if($GLOBALS['rpu_response']['data']['data_for_extended_process']['status'])
	{
		$email			=	$GLOBALS['rpu_response']['data']['data_for_extended_process']['email'];
		$mail_config	=	$GLOBALS['rpu_config']['config']['sso_mail_setting'];
		$mail_subject	=	$GLOBALS['rpu_config']['config']['wt_welcome_mail_subject'];
			
		$mail_html	=	'';
		ob_start();
		require_once __DIR__."./../../Common/php/sso/mail_templates/welcome-mail.php";
		$mail_html = ob_get_contents();
		ob_clean();
			
		if(!send_Email($email, $mail_subject, $mail_html, '','', $mail_config))
		{
			$output['status']				=	false;
			$output['error_description']	=	'Failed to send welcome signup email to the user '.$email.' , at line no. '.__LINE__.' in file '.__FILE__;
		}
	}
}

function start_oss_crawl_autocomplete($output){
	$rpu_response	=	empty($output['rpu_response']) ? array('status' => false) : $output['rpu_response'];
	if ($rpu_response['status']	==	true)	{
		$config	=	get_OssConfig();
		oss_crawl_request($config['oss_address'],$config['oss_index'],$config['oss_crawler']);
		oss_autocomplete_build_request($config['oss_address'],$config['oss_index'],$config['oss_auto_name']);
	}
	
	return;
}

function start_oss_delete_query($output){
	$rpu_response	=	empty($output['rpu_response']) ? array('status' => false) : $output['rpu_response'];
	if ($rpu_response['status']	==	true)	{
		$config	=	get_OssConfig();
		oss_delete_request($config['oss_address'],$config['oss_index'],$output['rpu_response']['data']['id']);
	}

	return;
}

if(isset($_REQUEST['request'])	&&	$_REQUEST['request']	==	'client_error')
{
	require_once __DIR__.'/browsers_error.php';
	log_browser_error($_REQUEST['data']['msg'],$_REQUEST['data']['url'],$_REQUEST['data']['line'],$_REQUEST['data']['col']);
	exit();
}

if(isset($_REQUEST['request']) && $_REQUEST['request'] == 'currentVideoData'){
    $videoid    =   $_REQUEST['data']['videoId'];
    if(strpos($videoid,'yt-') === 0){
        $sourcevideoid  =   str_replace('yt-','',$videoid);
        $metaInfoUrl			=	"https://www.googleapis.com/youtube/v3/videos?key=".sso_gc_server_key."&id=".$sourcevideoid;
        $videoYtMetadata 			=	json_decode(file_get_contents($metaInfoUrl."&part=snippet%2CcontentDetails%2Cstatistics"),true);
        $value  =       $videoYtMetadata['items'][0]['snippet'];
        $videoMetaData  =   array();
        $snippetArr =   array();
        foreach($value as $fieldname => $fieldValues){
            if($fieldname == 'publishedAt'){
                $fieldname = 'pubDate';
            }
            else if($fieldname	==	"title")
                    {
                        $fieldname	=	"string";
                    }
                else if($fieldname	==	"thumbnails")
                {
                    $fieldname	=	"tnurl";
                    $fieldValues	=	$fieldValues['default']['url'];
                }
            $snippetArr[$fieldname] =   $fieldValues;
        }
        if(isset($videoYtMetadata['items'][0]['id']['videoId'])){
            $snippetArr['videoid']=$sourcevideoid;
        }				
        $snippetArr['url']="https://www.youtube.com/?watch=";
        $snippetArr['id'] = "yt-".$sourcevideoid;
        $snippetArr['topicinfo'] = array();
        $videoMetaData[0]   =   $snippetArr;
    }
    else{
        $videoMetaData  =   DB_Query('Select tnurl,`string`,description from contentinfo where id ='.$videoid,'ASSOC','');
        $videoMetaData[0]['tnurl']  =   str_replace('default','hqdefault',$videoMetaData[0]['tnurl']);
    }
    echo json_encode(array('status'=>true,'data'=>$videoMetaData[0]));
    exit();
}
if(isset($_GET['captcha'])){
	require_once __DIR__.'./../../Common/php/phpcaptcha/phpCaptcha.php';
	$phptextObj = new phptextClass(array('captcha_font_file'	=>	getSetupRoot().'Common/css/fonts/monofont.ttf'));	
	if($phptextObj->captcha_init_status) {
		$phptextObj->phpcaptcha('#000000','#ffffff',120,40,3,250);
	}
	exit();
}
if(isset($_REQUEST['request']) && $_REQUEST['request'] == 'search_data'){
	$searchClassObject	=	new ContentSearchClass();
	$responseData	=	$searchClassObject->processSearchRequest($_REQUEST['data'],$_REQUEST['data']['server'],$_REQUEST['data']['getData']);
	if($responseData){
		$responseData	=	array('status'=>true,'data'=>json_decode($responseData,true));
	}
	else{
		$responseData	=	array('status'=>false);
	}
	$responseData	=	json_encode($responseData);
	echo $responseData;
	die();
}

else if(isset($_REQUEST['request']) && $_REQUEST['request'] == 'getHomeVidData'){
	$appClassObject	=	new MainAppRequest();
	$appClassObject->setHomePageData();
    $responseData	=	$appClassObject->HomePageVideosData;
	if($responseData){
		$responseData	=	array('status'=>true,'data'=>$responseData);
	}
	else{
		$responseData	=	array('status'=>false);
	}
	$responseData	=	json_encode($responseData);
	echo $responseData;
	die();
}

else if(isset($_REQUEST['request']) && $_REQUEST['request'] == 'yt_metadata_for_curation')
{
	$searchClassObject	=	new ContentSearchClass();
	$responseData		=	$searchClassObject->check_tempcuration_for_already_curate_video($_REQUEST['data']);
	echo json_encode($responseData);
	die();
}

else if(isset($_REQUEST['request']) && $_REQUEST['request'] == 'country_json')
{
	echo file_get_contents(__DIR__.'./../js/countries.json');
	die();
}


else if(isset($_REQUEST['request']) && $_REQUEST['request'] == 'submit_feedback'){
	$session_data	=	session_manager_get(array('username', 'uid'));
    $responseData   =   DB_Insert(
        array(
            'Table'=>'feedbackissues',
            'Fields'=>array(
                'feedbacktitle'=>$_REQUEST['data']['title'],
                'feedbackdescription'=>$_REQUEST['data']['desc'],
                'feedbackstatus'=>FB_REPORTED,
                'reportedby'=>$session_data['data']['username'],
                'reporteddate'=>date("Y-m-d H:i:s",time()),
                'modifieddate'=>date("Y-m-d H:i:s",time())
            )
        ));
	if($responseData){
		$responseData	=	array('status'=>true);
	}
	else{
		$responseData	=	array('status'=>false);
	}
	echo json_encode($responseData);
	die();
}

elseif(isset($_REQUEST['request']) && $_REQUEST['request'] == 'logout'){
	$response		=	false;
	log_session_close_data();
	$response 		= session_manager_close();
	echo json_encode($response);
	exit();
}
elseif(isset($_REQUEST['request']) && $_REQUEST['request'] == 'userProfile'){
	$response	=	array();
	$response 	= DB_Read(array(
                        'Table'=>'userinfo',
                        'Fields'=>'username,age,location,phone',
                        'clause'=> 'userid = '.$_SESSION['uid']
                    ),'ASSOC','');
    if(is_array($response) && count($response)>0){
        $response				=   $response[0];
        $usernameArr			=   explode(' ',$response['username'],2);
        $response['firstName']  =   $usernameArr[0];
        $response['lastName']  	=   $usernameArr[1];
        $session_data	=	session_manager_get(array('user_login_source'));
        $response['loginType']  =   $session_data['data']['user_login_source'];
        unset($response['username']);
        $response 				=   json_encode(array('status'=>true,'data'=>$response));
    }
    else{
        $response   =   json_encode(array('status'=>false));
    }
    echo $response;
	exit();
}
$checkRequest	=	isset($_REQUEST['request']);
$rpu_config		=	false;
$rpu_response	=	'';

if($checkRequest &&  $_REQUEST['request'] !== 'home' &&  $_REQUEST['request'] != 'curate'	&&	$_REQUEST['request'] !=	'sso_signup_page') {
	$rpu_config	=	array(
		'config'				=>	array(),
		'error_codes'			=>	array(),
		'data_array'			=>	false,		//setting this to true will make rpu to send $_REQUEST[data] as it is to module method
		'data_array_add'		=>	array(),	//assoc aarray to be merged into module method argument. This will be used only if data_array is true
		'send_response_indexes'	=>	array('status', 'error', 'data'), //only these keys will be returned from 
//		'extended_processing'	=>	callbackfunc;
//		'extended_processing_with_rpu_config'	=>	true;
	);
	switch($_REQUEST['request']){
		case 'home':
		break;
	
		case 'sso_google_signin':
			$rpu_config['callback']				=	'verify_ott_on_sso_response';
			$rpu_config['extended_processing']	=	'send_welcome_mail_after_signup';
			$rpu_config['config']				=	get_SsoConfig();
			$rpu_config['error_codes']			=	$sso_error_codes;
		break;
		case 'sso_signuppass':
			$rpu_config['callback']				=	'verify_ott_on_sso_response';
			$rpu_config['extended_processing']	=	'send_welcome_mail_after_signup';
			$rpu_config['config']				=	get_SsoConfig();
			$rpu_config['error_codes']			=	$sso_error_codes;
		break;
		case 'sso_signin_verify':
			$rpu_config['callback']				=	'verify_ott_on_sso_response';
		case 'sso_initiate_signup':
		case 'sso_initiate_reset':
		case 'sso_reset_pass':
			$rpu_config['config']				=	get_SsoConfig();
			$rpu_config['error_codes']			=	$sso_error_codes;
			
		break;

		case 'bookmark_save':
			$session_data	=	session_manager_get(array('uid'));
//			$rpu_config['config']				=	get_BookmarkConfig();
			$rpu_config['error_codes']			=	$bookmark_error_codes;
			$rpu_config['data_array']			=	true;
			$rpu_config['data_array_add']		=	array('userid'	=>	$session_data['data']['uid']);//assoc aarray to be added in module method argument. This will be used only if data_array is true
		break;
		case 'bookmark_read':
			$session_data	=	session_manager_get(array('uid'));
//			$rpu_config['config']				=	get_BookmarkConfig();
			$rpu_config['error_codes']			=	$bookmark_error_codes;
			$rpu_config['data_array']			=	true;
			$rpu_config['data_array_add']		=	array('userid'	=>	$session_data['data']['uid']);//assoc aarray to be added in module method argument. This will be used only if data_array is true
		break;

		case 'recommend':
			$session_data					=	session_manager_get(array('captcha_code'));
			$rpu_config['error_codes']		=	$recommend_error_codes;
			$rpu_config['data_array']		=	true;
			$rpu_config['data_array_add']	=	array('sess_captcha_code'	=>	$session_data['data']['captcha_code']);
			session_manager_set(
				array(
					'captcha_code'	=>	''
				)
			);
		break;
		case 'curation_add_to_list':
		case 'curation_save':
		case 'curation_delete':
		case 'curation_read':
		case 'curation_final_save':
//			$rpu_config['config']			=	get_CurationConfig();
			$session_data					=	session_manager_get(array('uid','username','usertype'));
			$rpu_config['error_codes']		=	$curation_error_codes;
			$rpu_config['data_array']		=	true;
			$rpu_config['data_array_add']	=	array(
					'userid'	=>	$session_data['data']['uid'],
					'username'	=>	$session_data['data']['username'],
					'usertype'	=>	$session_data['data']['usertype']
			);//assoc aarray to be added in module method argument. This will be used only if data_array is true
		break;
		
		case 'review_delete_content':
			$rpu_config['extended_processing']	=	'start_oss_delete_query';
			$session_data						=	session_manager_get(array('uid', 'usertype'));
			$rpu_config['config']['usertype']	=	$session_data['data']['usertype'];
			$rpu_config['error_codes']			=	$review_curation_error_codes;
			$rpu_config['data_array']			=	true;
			$rpu_config['data_array_add']		=	array(
					'userid'	=>	$session_data['data']['uid'],
					'usertype'	=>	$session_data['data']['usertype']
			);
		break;
		
		case 'review_category_delete':
			$session_data						=	session_manager_get(array('uid', 'usertype'));
			$rpu_config['config']['usertype']	=	$session_data['data']['usertype'];
			$rpu_config['error_codes']			=	$review_curation_error_codes;
			$rpu_config['data_array']			=	true;
			$rpu_config['data_array_add']		=	array(
					'userid'	=>	$session_data['data']['uid'],
					'usertype'	=>	$session_data['data']['usertype']
			);
			break;
		case 'review_category_move':
		case 'review_publish':
		case 'review_moderator_issue':
			$rpu_config['extended_processing']	=	'start_oss_crawl_autocomplete';
		case 'review_language_delete':
		case 'review_reviewer_issue':
		case 'review_moderator_reject':
			$session_data						=	session_manager_get(array('uid', 'usertype'));
			$rpu_config['config']['usertype']	=	$session_data['data']['usertype'];
			$rpu_config['error_codes']			=	$review_curation_error_codes;
			$rpu_config['data_array']			=	true;
			$rpu_config['data_array_add']		=	array(
				'userid'	=>	$session_data['data']['uid'],
				'usertype'	=>	$session_data['data']['usertype']
			);
		break;
		
		case 'user_profile_read':
		case 'user_profile_save':
//			$rpu_config['config']				=	get_User_profileConfig();
			$rpu_config['data_array']			=	true;
			$rpu_config['error_codes']			=	$user_profile_error_codes;
		break;	
	}
}
if($rpu_config !== false) {
	$rpu_response	=	RPU_ProcessRequest($rpu_config);
	
	$send_output	=	json_encode($rpu_response);
	
	if(isset($rpu_config['extended_processing'])){
		$callback	=	$rpu_config['extended_processing'];
		$arguments	=	array('rpu_response'	=>	$rpu_response);
		if(isset($rpu_config['extended_processing_with_rpu_config']) && $rpu_config['extended_processing_with_rpu_config'])
			$arguments['rpu_config']	=	$rpu_config;
		
		RPU_CloseConnection_SendOutput($send_output);

		RPU_ExtendedProcessing($callback, $arguments);
	}
	else{
		echo $send_output;
	}
	
	if(!isset($page_load))
		exit();
}

if(isset($page_load)) {
	$appClassObject	=	new MainAppRequest();
	$appClassObject->processAppRequest();
?>
<script>
var page	=	'<?php echo $appClassObject->page;?>';
var l_ch	=	'<?php echo $appClassObject->loggedInUser;?>'; 
var data	=	<?php echo $appClassObject->pageData;?>;
var ytList 	= 	{};
var topicArr = data.topics || {};
var contentObj = data.content || {};
var urlStr = '<?php echo $appClassObject->urlStr;?>';
var urlParamStr = '<?php echo $appClassObject->urlParamStr;?>';
data['modify']  =   true;
progressChange(70);
</script>
<?php
}
?>