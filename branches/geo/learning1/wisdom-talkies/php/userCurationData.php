<?php
    require_once __DIR__.'./../require.php';
    if(isset($_REQUEST['request']) && $_REQUEST['request'] == 'curation_read'){
        $session_data	=	session_manager_get(array('uid'));
        curation_read($session_data['data']); 
    }
    function getTotalRecords($clause, $table){
        $query	=	"Select Count(*) AS TotalRecordsAvailable FROM ".$table;
        if($clause != '')
            $query	.=	" WHERE ".$clause;

        $TotalRecordsResult	=	DB_Query($query,'ASSOC', '');
        $recordCount = $TotalRecordsResult[0]['TotalRecordsAvailable'];
        return $recordCount;
    }

	function curation_read($read_data)
	{
        $limit	=	$_GET['rows'];
		$readby	=	$read_data['uid'];
        $clause	=	"curatedby='$readby'";
        if($limit != -1)
        {
            $page	=	$_GET['page'];
            $start = $limit*$page - $limit;
            $recordCount	=	getTotalRecords($clause, 'tempcuration');
            $orderClause	=	$_GET['sidx']." ".$_GET['sord']." LIMIT $start , $limit";
            $total_pages = ceil($recordCount/$limit);
        }
        else
        {
            $page	=	1;
            $total_pages = 1;
        }

		$output	=	array(
				'status'=>	true
		);
	
		if($readby == NULL)
		{
			$output['status']	=	false;
			$output['error']	=	'curation_error1';
			$output['error_description']	=	'userid received through session is null at line no. '.__LINE__.' in file '.__FILE__;
		}
		
		else
		{
			$read_query     =    array(
					'Fields'=>	'*',
					'Table'	=>	'tempcuration',
					'clause'=>	"curatedby='$readby'",
                    'order' =>  $orderClause
			);
			$read_tempcuration    =    DB_Read($read_query);
			$output	=	array(
				'data'	=>	$read_tempcuration	
			);
		}

        $jTableResult = array();
        $jTableResult['total'] 		= $total_pages;
        $jTableResult['page'] 		= $page;
        $jTableResult['records']	= $recordCount;
        if(isset($read_tempcuration)	&&	$read_tempcuration)
        {
        	$jTableResult['rows'] 	 	= $read_tempcuration;
        }
        else
        {
        	$jTableResult['rows'] 	 	= array();
        }
        echo json_encode($jTableResult);
	}
?>