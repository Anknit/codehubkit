<?php
/*
	$categoryArr = 	DB_Read(array('Table'=>'categoryinfo','Fields'=>'catId,catName'),'ASSOC','','catId');
	$languageArr = 	DB_Read(array('Table'=>'language','Fields'=>'id,language'),'ASSOC','','id');
*/
?>
<!--
<script>
	var curationOptions = <?php /*echo json_encode(array('categories'=>$categoryArr,'languages'=>$languageArr));*/ ?>;
</script>-->
<script type='text/javascript' src='./<?php echo projectJSFolderName; ?>/curationinit.js?v=<?php echo version;?>' ></script>
<script type='text/javascript' src="./<?php echo projectJSFolderName; ?>/controller/headerController.js" ></script>
<script type='text/javascript' src="./<?php echo projectJSFolderName; ?>/controller/footerController.js" ></script>
<script type='text/javascript' src="./<?php echo projectJSFolderName; ?>/controller/curationListController.js" ></script>
<script type='text/javascript' src="./<?php echo projectJSFolderName; ?>/controller/curationController.js" ></script>
<script type='text/javascript' src='./<?php echo projectJSFolderName; ?>/curation_lib.js?v=<?php echo version; ?>' ></script>
<script type='text/javascript' src='./<?php echo projectJSFolderName; ?>/curation.js?v=<?php echo version; ?>' ></script>