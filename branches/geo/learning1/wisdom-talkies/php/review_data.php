<?php
require_once __DIR__.'./../require.php';

require_once __DIR__.'./../../Common/php/MailMgr.php';
require_once __DIR__.'./../../Common/php/ErrorHandling.php';

if(isset($_REQUEST['request']['data'])	&&	$_REQUEST['request']['data']	==	"language_object")
{
	$language_object	=	make_language_object();
	echo $language_object;
}
else if(isset($_REQUEST['request']['data'])	&&	$_REQUEST['request']['data']	==	"category_object")
{
	$category_object	=	make_category_object();
	echo $category_object;
}
else 
{
	$data	=	$_GET['data'];
	getActiveJobInfo();
}

function make_language_object()
{
	$query_language    	=    array('Fields'=>'*','Table'=>'language','clause'=>'status!='.LS_DELETED);
	$d_data_language    =    DB_Read($query_language,'ASSOC','','id');
	return json_encode($d_data_language);
}	

function make_category_object()
{
	$query_category    	=    array('Fields'=>'*','Table'=>'categoryinfo','clause'=>'status!='.CATS_DELETED);
	$d_data_category    =    DB_Read($query_category,'ASSOC','','catId');
	return json_encode($d_data_category);
}

function getTotalRecords($clause, $table){
	$query	=	"Select Count(*) AS TotalRecordsAvailable FROM ".$table;
	if($clause != '')
		$query	.=	" WHERE ".$clause;

	$TotalRecordsResult	=	DB_Query($query,'ASSOC', '');
	$recordCount = $TotalRecordsResult[0]['TotalRecordsAvailable'];
	return $recordCount;
}

function getActiveJobInfo() {
	$limit	=	$_GET['rows'];
	if($_SESSION['usertype']	==	UT_REVIEWER)
	{
		$clause	=	'curationstatus in ("'.CS_COMPLETE.'","'.CS_RECOMMEND.'")';
	}
	else{
		$clause	=	'curationstatus not in ("'.CS_PROCESSED.'")';
	}
    if(isset($_GET['_search']) && $_GET['_search'] == 'true'){
        if(isset($_GET['title'])){
            if($clause != ''){
                $clause .= 'and ';
            }
            $clause .= 'title like "%'.$_GET['title'].'%"';
        }
        if(isset($_GET['category_breadcrumb'])){
            if($clause != ''){
                $clause .= 'and ';
            }
            $clause .= 'category_breadcrumb like "%'.$_GET['category_breadcrumb'].'%"';
        }
        if(isset($_GET['emailid'])){
            if($clause != ''){
                $clause .= 'and ';
            }
            $clause .= 'emailid like "%'.$_GET['emailid'].'%"';
        }
    }
	if($limit != -1)
	{
		$page	=	$_GET['page'];
		$start = $limit*$page - $limit;
		$recordCount  =	getTotalRecords($clause, 'tempcuration');
		$orderClause  =   	$_GET['sidx']." ".$_GET['sord']." LIMIT $start , $limit";
		$total_pages  = ceil($recordCount/$limit);
	}
	else
	{
		$page	=	1;
		$total_pages = 1;
	}
	
	$movienexDataClause	=	array();
	$movienexDataClause['clause'] = '';
	$queryStr = "Select tempcuration.*,userinfo.emailid from tempcuration left join userinfo on tempcuration.curatedby = userinfo.userid";
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
/*
    for($i=0;$i<count($jTableResult['rows']);$i++){
		foreach($jTableResult['rows'][$i] as $key => $value ){
			$jTableResult['rows'][$i][$key] = utf8_decode($value);
		}
	}
*/
	echo json_encode($jTableResult);
}
?>