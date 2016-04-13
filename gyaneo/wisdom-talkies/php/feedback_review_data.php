<?php
require_once __DIR__.'./../require.php';

require_once __DIR__.'./../../Common/php/ErrorHandling.php';

returnfeedbackdata();

function getTotalRecords($clause, $table){
	$query	=	"Select Count(*) AS TotalRecordsAvailable FROM ".$table;
	if($clause != '')
		$query	.=	" WHERE ".$clause;
		
	$TotalRecordsResult	=	DB_Query($query,'ASSOC', '');
	$recordCount = $TotalRecordsResult[0]['TotalRecordsAvailable'];
	return $recordCount;
}

function returnfeedbackdata() {
	$limit	=	$_GET['rows'];
    $clause =   '';
	if($limit != -1)
	{
		$page	=	$_GET['page'];
		$start = $limit*$page - $limit;
		$recordCount	=	getTotalRecords($clause, 'feedbackissues');
		$orderClause	=	$_GET['sidx']." ".$_GET['sord']." LIMIT $start , $limit";
		$total_pages = ceil($recordCount/$limit);
	}
	else
	{
		$page	=	1;
		$total_pages = 1;
	}
	
	$queryStr = "Select * from feedbackissues";
	if($clause != ''){
		$queryStr .=	" where ".$clause;
	}
	
	if($orderClause != ''){
		$queryStr .=	" order by ".$orderClause;
	}

	$data	=	DB_Query($queryStr);
	//Return result to jTable
	$jTableResult = array();
	$jTableResult['total'] 		= $total_pages;
	$jTableResult['page'] 		= $page;
	$jTableResult['records']	= $recordCount;
	$jTableResult['rows'] 	 	= $data;
	echo json_encode($jTableResult);
}
?>