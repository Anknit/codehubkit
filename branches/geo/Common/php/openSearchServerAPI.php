<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php

require_once 'commonfunctions.php';

	
/**		
	NAME: ****************	GET JSON REQUEST DATA FOR KEYWORD SEARCH	********************

*	Description: Generates the json required for keyword searching.

*	return	: JSON FOR KEYWORD SEARCh REQUEST. DEFAULT VALUES FOR STARTOFFSET AND RESULTROWS is 0 and 10 respectively
*/
function getSearchDataEncoded($queryParams){
	$startOffset	=	0;
	$resultRows		=	10;
	if(isset($queryParams['startOffset'])){
		$startOffset	=	$queryParams['startOffset'];
	}
	if(isset($queryParams['resultRows'])){
		$resultRows	=	$queryParams['resultRows'];
	}
	$categoryFilterString 	=	"category:[* TO *]";
	$languageFilterString 	=	"language:[* TO *]";
	$ageFilterString		=	"agegroup:[* TO *]";
	if(isset($queryParams['catfilter']) && $queryParams['catfilter'] != ""){ // comma separated list of cat ids including sub categories
        $categoryIdsArr =   explode(',',$queryParams['catfilter']);
        $categoryFilterString = '';
        for($i=0;$i<count($categoryIdsArr);$i++){
            if($categoryFilterString != ''){
                $categoryFilterString .= ' ';
            }
            $categoryFilterString .= 'category:'.$categoryIdsArr[$i];  
        }
	}
	if(isset($queryParams['langfilter']) && $queryParams['langfilter'] != ""){
		$languageFilterString = "language:[".$queryParams['langfilter']." TO ".$queryParams['langfilter']."]";
	}
	if(isset($queryParams['agefilter']) && $queryParams['agefilter'] != ""){
		$ageFilterArr	=	explode(',',$queryParams['agefilter']);
		if(count($ageFilterArr) > 0){
			$ageFilterString = '';
		}
		for($i=0;$i<count($ageFilterArr);$i++){
			$ageFilterString	.=	" agegroup:".$ageFilterArr[$i];
		}
	}
	$queryData		=	array(
		'query'		=>	$queryParams['searchKeyword'],
		'start'		=>	$startOffset,
		'rows'		=>	$resultRows,
		'filters' 	=>	array(
							array(
								"type"=>"QueryFilter",
								"query"=> $categoryFilterString
							),
							array(
								"type"=>"QueryFilter",
								"query"=> $languageFilterString
							),
							array(
								"type"=>"QueryFilter",
								"query"=> $ageFilterString
							)
						)
	);
		
	return json_encode($queryData);
}
	

/**
	***********************	FETCH SEARCH RESULTS FROM OPEN SEARCH	**********************
*/
function getSearchResult($params = '', $urlData = ''){
	$data	=	NULL;
	$output	=	NULL;
	$url	=	getUrlforOpenSearchServerRequest($urlData);
	$catfilter = '';
	$langfilter = '';
	$agefilter	=	'';
	if(isset($params['catfilter'])){
		$catfilter = $params['catfilter'];
	}
	if(isset($params['langfilter'])){
		$langfilter = $params['langfilter'];
	}
	if(isset($params['agefilter'])){
		$agefilter = $params['agefilter'];
	}
	switch($urlData['type']){
		case 'autocomplete' :
			$data = array(
				'http' => array(
					'method'  => "GET",
					'header'  => "Accept: application/json"
				),
			);
		break;
		case 'keywordSearch':
			$data = array(
				'http' => array(
					'method'  => "POST",
					'content' => getSearchDataEncoded(array('searchKeyword' => $params['data'],'startOffset' => $params['start'],'resultRows' => $params['rows'],'catfilter'=>$catfilter,'langfilter'=>$langfilter,'agefilter'=>$agefilter)),
					'header'  => "Content-type: application/json\r\n" .
								 "Accept: application/json"
				)
			);
		break;
	}
	
	if($data != NULL && $url != NULL)
		$output	=	sendExternalRequest($data, $url);

	return $output;
}
//addtress=oss address
//index is oss index name\
//crawler is crawler name
//autocompletrion is oss autocompletion name

/*
 * this function will start the crawler of oss
 *
**		

	NAME: ****************	GET OPENSERACHSERVER REQUEST URL	******************


*	Description: Generates the url to be used for different opensearchserver operations.
*	@param	Mandatory. Associative array with following keys and their value.
		
		host: Mandatory. This defines the host name/IP address of open search server.
		port: Mandatory. This defines the port of open search server. Default is considered to be 9090.
		type : Mandatory. autocomplete/keywordSearch. This defines the operation that will be done on opensearch server using this url.
		data : This will be request/url specific parameters which will be used to create a url. This will be an assoc array.
		
		** data defined for different types	**
		
		type: autocomplete
		data: array{
			'index'				=>	'INDEX NAME TO SEARCH',
			'autocompletion'	=>	'AUTOCOMPLETION ITEM NAME',
			'word'				=>	'WORD TO SEARCH FOR'
		}


		type: keywordSearch
		data: array{
			'index'	=>	'INDEX NAME TO SEARCH',
			'field'	=>	'SEARCH FIELD NAME'
		}
	
	
*	return	: String/NULL. If the url is formed successfully then string will be returned.
*/
    
function getUrlforOpenSearchServerRequest($param){
	$url	=	'';
	$url	.=	$param['url'];
	$url	.=	'/services/rest';
	
	switch($param['type']){
		case 'autocomplete':
			$url	.=	'/index/'.$param['data']['index'].'/autocompletion/'.$param['data']['autocompletion'].'?prefix='.$param['data']['word'];
			if(isset($param['login']) && isset($param['key'])){
				$url	.=	'&login='.$param['login'].'&key='.$param['key'];
			}
			break;
		case 'keywordSearch':
			$url	.=	'/index/'.$param['data']['index'].'/search/field/'.$param['data']['field'];
			if(isset($param['login']) && isset($param['key'])){
				$url	.=	'?login='.$param['login'].'&key='.$param['key'];
			}
			break;
		case 'suggestions_of_category':
			$url	.=	'/index/'.$param['data']['index'].'/search/field/'.$param['data']['field'];
			if(isset($param['login']) && isset($param['key'])){
				$url	.=	'?login='.$param['login'].'&key='.$param['key'];
			}
			break;
        case 'database_crawl':
			$url	.=	'/index/'.$param['data']['index'].'/crawler/database/'.$param['data']['crawler_name']."/run";
			if(isset($param['login']) && isset($param['key'])){
				$url	.=	'/?login='.$param['login'].'&key='.$param['key'];
			}
			break;
        case 'autocomplete_build':
			$url	.=	'/index/'.$param['data']['index'].'/autocompletion/'.$param['data']['crawler_name'];
			if(isset($param['login']) && isset($param['key'])){
				$url	.=	'/?login='.$param['login'].'&key='.$param['key'];
			}
			break;
		case 'delete_documents':
			$ids_string_to_delete	=	implode("/",$param['data']['documents']);
			$url	.=	'/index/'.$param['data']['index'].'/document/id/'.$ids_string_to_delete;
			if(isset($param['login']) && isset($param['key'])){
				$url	.=	'/?login='.$param['login'].'&key='.$param['key'];
			}
			break;
		default:
			$url	= NULL;
	}
	return $url;
}

function oss_crawl_request($address,$index,$crawler)
{
	$oss_address	=	$address;
	$oss_index	    =	$index;
	$oss_crawler	=	$crawler;
    $config         =   get_OssConfig();
    $param  =   array(
        'url'   =>  $config['oss_address'],
        'type'  =>  'database_crawl',
        'data'  =>  array(
            'index'         =>  $config['oss_index'],
            'crawler_name'  =>  $config['oss_crawler']  
        ),
        'login' =>  $config['oss_user'],
        'key'   =>  $config['oss_login_key']
    );

	$oss_url	=	getUrlforOpenSearchServerRequest($param);
        //$oss_address."/services/rest/index/".$oss_index."/crawler/database/".$oss_crawler."/run";
	$oss_headers = array(
			'http'=>array(
					'method'=>"PUT",
					'header'=>"Content-Type: application/json\r\n"
			)
	);

	$context = stream_context_create($oss_headers);
	$file = file_get_contents($oss_url, false, $context);
	if(json_decode($file,true)['successful']	==	true)
		return true;
	else
		return false;
}

/*
 * this function will build the autocompletion index of oss
 */
function oss_autocomplete_build_request($address,$index,$autocompletion)
{
	$oss_address               =	$address;
	$oss_index                 =	$index;
	$oss_autocompletion_name   =	$autocompletion;
    $config         =   get_OssConfig();
    $param  =   array(
        'url'   =>  $config['oss_address'],
        'type'  =>  'autocomplete_build',
        'data'  =>  array(
            'index'         =>  $config['oss_index'],
            'crawler_name'  =>  $config['oss_auto_name']
        ),
        'login' =>  $config['oss_user'],
        'key'   =>  $config['oss_login_key']
    );

	$oss_url	=	getUrlforOpenSearchServerRequest($param);

//	$oss_url	=	$oss_address."/services/rest/index/".$oss_index."/autocompletion/".$oss_autocompletion_name;

	$oss_headers = array(
			'http'=>array(
					'method'=>"PUT",
					'header'=>"Content-Type: application/json\r\n"
			)
	);

	$context = stream_context_create($oss_headers);
	$file = file_get_contents($oss_url, false, $context);
	if(json_decode($file,true)['successful']	==	true)
		return true;
	else
		return false;
}
function oss_delete_request($address,$index,$array_of_ids_to_delete)
{
	$oss_address    =	$address;
	$oss_index      =	$index;
	$ids_to_delete	=	$array_of_ids_to_delete;
	$config			=   get_OssConfig();
	$param  =   array(
			'url'   =>  $config['oss_address'],
			'type'  =>  'delete_documents',
			'data'  =>  array(
					'index'         =>  $config['oss_index'],
					'crawler_name'  =>  $config['oss_auto_name'],
					'documents'		=>	$ids_to_delete
			),
			'login' =>  $config['oss_user'],
			'key'   =>  $config['oss_login_key']
	);

	$oss_url	=	getUrlforOpenSearchServerRequest($param);

	//	$oss_url	=	$oss_address."/services/rest/index/".$oss_index."/autocompletion/".$oss_autocompletion_name;

	$oss_headers = array(
			'http'=>array(
					'method'=>"DELETE",
					'header'=>"Content-Type: application/json\r\n"
			)
	);

	$context = stream_context_create($oss_headers);
	$file = file_get_contents($oss_url, false, $context);
	if(json_decode($file,true)['successful']	==	true)
		return true;
	else
		return false;
}
?>