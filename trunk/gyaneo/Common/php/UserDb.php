<?php
if(isset($_GET['Update']) && $_GET['Update']	==	1) {
	require 'OperateDB/DbMgrInterface.php';
	$result	=	$perform_Database_Operation->connection->query($_GET['Query']);
	if($result)
		echo 1;
	else {
		include_once 'ErrorHandling.php';
		$DB_OperationError	=	mysqli_error($perform_Database_Operation->connection);
		ErrorLogging('query: --'.$_GET['Query'].' -- '.'Error: --'.$DB_OperationError);
		echo 2;
	}
		
	die();	
}
?>
<form name="dbDetails">
	Enter database name<font color="red">*</font>: <input width="800"  type="text" name="Databasename" placeholder="enter exact name of database"/>
    <br />
    <br />
	Enter tables name:		 <input width="800"  type="text" name="tableNames" placeholder="comma separated table names" title="all tables will be shown if left empty"/>
    <br />
	<input  type="submit" name="showdb" value="Show database data"/>
</form>    
<script src="../js/jquery.js"></script>
<script src="../js/commonFunctions.js"></script>
<script>
function saveRowValues(src, rowUniqueColumn, rowIndexValue, Tablename){
	var closestRowParentRow	=	$(src).closest('tr');
	var InputsFromTheRow	=	closestRowParentRow.find('input[type="text"]');
	var InputValue	=	'', DbFieldName	=	'';
	var Query	=	'';
	for(var i = 0; i< InputsFromTheRow.length; i++){
		InputValue	=	InputsFromTheRow[i].value;
		DbFieldName	=	InputsFromTheRow[i].id;
		
		if(InputValue.indexOf("\'") != -1) {
			InputValue	=	addslashes(InputValue);
		}
		
		if(Query	!=	'')
			Query	+=	', ';
			
		Query	+=	DbFieldName+' = "'+InputValue+'"';
	}
	Query	=	'UPDATE '+Tablename+' SET '+Query+' WHERE '+rowUniqueColumn+' = '+rowIndexValue;
	
	var sendUpdateQuery	=	new Object();
	sendUpdateQuery.actionScriptURL	=	'<?php echo basename(__FILE__);?>?Update=1&Query='+Query;
	sendUpdateQuery.callBack	=	function (Response){
		if(Response	==	1)
			alert('Updated successfully');
		else
			alert('Failed to update');
	};
	send_remoteCall(sendUpdateQuery);
}
</script>
<?php

if(isset($_GET['showdb'])) {
	require 'OperateDB/DbMgrInterface.php';
	?>
	<html>
    <body>
    <?php
	
	if($_GET['tableNames'] != ''){
		$Tables	=	explode(',', $_GET['tableNames']);
	}
	else {
		$TablesNameQuery	=	"SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' AND TABLE_SCHEMA='".trim($_GET['Databasename'])."'";
		$tableNames			=	DB_Query($TablesNameQuery, 'NUM_ARR');
		for($i = 0; $i< count($tableNames); $i++){
			$Tables[]	=	$tableNames[$i][0];
		}
	}
	
	/*var_dump($Tables);
	$Tables	=	array('accountcredit_info', 'licenseinfo', 'payment_info', 'session_info', 'systemsettings', 'usageinfo', 'userinfo', 'usersubscriptioninfo', 'voucherinfotable');
	var_dump($Tables);
	*/
	function CreateHeadingRow($heading){
		$html	=	'';
		$html	.=	"<tr>";
		for($j = 0; $j < count($heading); $j++)
		{
			$html	.=	"<td style='border: 1px solid #E1E1E1'><b>".$heading[$j]."</b></td>";
		}
		$html	.=	"</tr>";
		echo $html;
		unset($html);
		unset($heading);
	}
	
	$html	=	'';
	for($i = 0; $i< count($Tables); $i++)
	{
		
		$result	=	DB_Read(array(
						'Table'	=>	trim($Tables[$i]),
						'Fields'	=>	'*'
					), 'ASSOC');	
		if($result)
		{
			?>
            <table id='<?php echo $Tables[$i]; ?>' style='border: 1px solid #E1E1E1'>
			<caption style='color: red'><b><?php echo $Tables[$i]; ?></b></caption>
            <?php
			$heading	=	"";
			$headingFlush	=	false;
			$htmlRows	=	"";
			for($k = 0; $k< count($result); $k++)
			{
				$htmlRows	.=	"<tr>";
				$columnIndex	=	0;
				$RowUniqueValue	=	NULL;
				foreach($result[$k] as $key=>$value)
				{
					if($k == 0)
					{
						$heading[]	=	$key;
					}
					else if($k == 1 && !$headingFlush){
						//print the heading row, and clear the variable heading
						$headingFlush	=	true;
						CreateHeadingRow($heading);
					}
					if($columnIndex	==	0) {
						$RowUniqueValue	=	$value;
						$RowUniqueColumn=	$key;
					}
					
					$htmlRows	.=	"<td style='border: 1px solid #E1E1E1'><input type='text' id='".$key."' value='".$value."' /></td>";
						
					$columnIndex++;
				}
				
				$htmlRows	.=	"<td style='border: 1px solid #E1E1E1'><input type='button' onclick='saveRowValues(this, \"".$RowUniqueColumn."\", \"".$RowUniqueValue."\", \"".$Tables[$i]."\");' value='save' /></td>";
				$htmlRows	.=	"</tr>";
				if($k > 0) {
					echo $htmlRows;
					$htmlRows	=	'';
				}
			}
			?>
            </table>
            <?php
		}
	}
?>
	</body></html>
<?php 
}
?> 