<?php
require_once __DIR__.'/require.php';
require_once __DIR__.'./../Common/php/ErrorHandling.php';
require_once __DIR__.'./../Common/php/commonfunctions.php';

if(is_login || !isset($_REQUEST['request']) || $_REQUEST['request'] != 'sso_reset_page'){
	header("Location:". getHttpRoot());	
	exit();
}

$reset	=	$_REQUEST['data']['pass'];

if(!check_cipher($reset))	//see validations.php
{
	header("Location:". getHttpRoot().projectFolderName."/error.php?err=4");
	ErrorLogging("RESET cipher matching failed with regular expression "."at line no. ".__LINE__." at file ".__FILE__." content: cipher=".$reset);
	exit();
}
else
{
	EventLogging("WARNING RESET cipher matching allowed with regular expression "."at line no. ".__LINE__." at file ".__FILE__." content: cipher=".$reset);
}

$reset	=	getHttpRoot().projectFolderName."/php/appdata.php?request=sso_reset_pass&data[pass]=".rawurlencode($reset);

require_once __DIR__.'/php/header.php';
require_once __DIR__.'/php/reset_body.php';
require_once __DIR__.'/php/resetPassScripts.php';
require_once __DIR__.'/php/footer.php';
require_once __DIR__.'/php/appdata.php';
?>
<script>
	function getResetCompletionUrl(){
		return '<?php echo $reset;?>';
	}
</script>
<script>
	var contributeFlag = <?php echo 0; ?>;
	var youtubeListFlag = false;
</script>