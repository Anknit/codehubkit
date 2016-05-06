<?php 
require_once __DIR__.'/require.php';

if(is_login != true	||	($_SESSION['usertype']	!=	UT_MODERATOR	&&	$_SESSION['usertype']	!=	UT_REVIEWER))
{
	header('location:./');
	exit();
}

require_once __DIR__.'/php/header.php';
?>
<link rel="stylesheet" href="./Common/css/ui.jqgrid.css" />
<link rel="stylesheet" href="./Common/css/jqueryUI/themes/jquery-ui.css" />
<div id="main" class="container-fluid">
	<div id="contentPANE" style="position:relative;height:100%;width:100%;max-height:80%">
            <table class="table table-bordered convertTojqGrid ui-grid-Font clgrid" id="FeedbackTable" url='./<?php echo projectFolderName; ?>/php/feedback_review_data.php'
                colNames="Title,Description,Status,Reported By,Modified On,Action" colModel='feedbackcolmodel'
                sortBy ='modifieddate' gridComplete='feedbackDetailsFormatterFunction' gridWidth="0.999" gridHeight="0.90"> 
            </table>
            <div id="gridpager_FeedbackTable"></div>		
    </div>	
</div>
<?php
    require_once __DIR__.'/php/feedbackScripts.php';
    require_once __DIR__.'/php/footer.php';
?>
<script>
	var youtubeListFlag = true;
    var l_ch = true;
    var data=   {};
    data.categories = []; 
    data.languages = []; 
/*
	var categoryObject	=	JSON.parse('<?php echo json_encode($d_data_category);?>');
	var languageObject	=	JSON.parse('<?php echo json_encode($d_data_language);?>');
*/
	var typeofuser		=	<?php echo $_SESSION['usertype']; ?>
</script>