<?php
require_once __DIR__.'/require.php';
require_once __DIR__.'./../Common/php/ErrorHandling.php';
require_once __DIR__.'./../Common/php/commonfunctions.php';

if(is_login || !isset($_REQUEST['request']) || $_REQUEST['request'] != 'sso_signup_page'){
	header("Location:". getHttpRoot());	
	exit();
}

$sign_up_pass	=	$_REQUEST['data']['pass'];

if(!check_cipher($sign_up_pass))	//see validations.php
{
	ErrorLogging("SIGNUP cipher matching failed with regular expression "."at line no. ".__LINE__." at file ".__FILE__." content: cipher=".$sign_up_pass);
	header("Location:". getHttpRoot().projectFolderName."/error.php?err=4");
	exit();
}
else
{
	EventLogging("WARNING Signup cipher matching allowed with regular expression "."at line no. ".__LINE__." at file ".__FILE__." content: cipher=".$sign_up_pass);
}

$sign_up_pass	= getHttpRoot().projectFolderName."/php/appdata.php?request=sso_signuppass&data[pass]=".rawurlencode($sign_up_pass);

require_once __DIR__.'/php/header.php';
require_once __DIR__.'/php/sign-up_body.php';
require_once __DIR__.'/php/signUpScripts.php';
require_once __DIR__.'/php/footer.php';
require_once __DIR__.'/php/appdata.php';
?>
<script>
	function getSignupCompletionUrl(){
		return '<?php echo $sign_up_pass;?>';
	}
</script>
<script>
	var contributeFlag = <?php echo 0; ?>;
	var youtubeListFlag = false;
	var countries_json	=	<?php echo file_get_contents(__DIR__."/js/countries.json");?>;
</script>