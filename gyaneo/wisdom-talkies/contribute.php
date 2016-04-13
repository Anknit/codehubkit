<?php 
require_once __DIR__.'/require.php';
global $Module;

if(!is_login	||	!isset($Module['curation'])	||	$Module['curation']	!=	true)
{
	header('location:./');
}

if(isset($_REQUEST['category']) && !isset($_REQUEST['videoId']))
{
	unset($_REQUEST['category']);
}

$contribute = 1;
$playVideoCuration	=	0;
$playVideoCategory	=	0;
require_once __DIR__.'/php/header.php';
require_once __DIR__.'/php/curationBody.php';
require_once __DIR__.'/php/curationScripts.php';
require_once __DIR__.'/php/footer.php';
require_once __DIR__.'/sign-in.php';
require_once __DIR__.'/php/appdata.php';

if(isset($_REQUEST['videoId']))
{
	$playVideoCuration	=	true;
}
if(isset($_REQUEST['category']))
{
	$playVideoCategory	=	$_REQUEST['category'];
}
$s_id	=	0;
if(isset($_REQUEST['s_id'])	&&	is_numeric($_REQUEST['s_id']))
{
	$s_id = $_REQUEST['s_id'];
}
?>
<script>
	var contributeFlag			= 	<?php echo $contribute; ?>;
	var youtubeListFlag 		= 	true;
	var moveToCuration			=	<?php echo $playVideoCuration; ?>;
	var curationVideoCategory	=	<?php echo $playVideoCategory; ?>;
	var s_id					=	<?php echo $s_id;?>; //source id of the video from reviewwer page to curate page
</script>