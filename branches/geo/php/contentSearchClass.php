<?php
class ContentSearchClass {
		private $isbn_key/* ,$searchOutput,$youtubeSearchApiKey,$openSearchParam,$youtubePageToken */;
		/* public $searchKeyword,$searchCategory,$limitCount,$startCount,$lastError; */
		
		private function get_isbn_details_http($isbn_number){
			$metaInfoUrl			=	"http://isbndb.com/api/v2/json/".$this->isbn_key."/books?q=".$isbn_number;
			$isbn_metadata 			=	json_decode(file_get_contents($metaInfoUrl),true);
			if(!isset($isbn_metadata)	||	empty($isbn_metadata)) {
				$isbn_metadata		=	false;
			}
			return $isbn_metadata;
		}
		
		private function get_isbn_details_database($isbn_number){
			$metaInfoUrl			=	"http://isbndb.com/api/v2/json/".$this->isbn_key."/books?q=".$isbn_number;
			$isbn_metadata 			=	json_decode(file_get_contents($metaInfoUrl),true);
			return $isbn_metadata;
		}
		
		public function search_isbn_details($isbn){
			$search_output	=	array(
					'status'	=>	true
			);
			$data	=	$this->get_isbn_details_http($isbn);
			if(!empty($data['data'])){
				$search_output['data']	=	$data;			
			}
			else{
				$search_output['status']	=	false;
			}
			return $search_output;
		}
				
		public function __construct(){
			$isbn_config	=	get_IsbnConfig();
			$this->isbn_key	=	$isbn_config['isbn_key'];
			
			/* $this->searchCategory	=	null;
			$this->lastError		=	'';
			$this->openSearchParam	=	array();
			$this->youtubeSearchApiKey	=	sso_gc_server_key;
			$this->openSearchParam['query']['rows']		=	10;
			$this->openSearchParam['query']['start']	=	0;
			$config	=	get_OssConfig();
			$this->openSearchParam['config']['url'] 					=	$config['oss_address'];
			$this->openSearchParam['config']['data']['index'] 			=	$config['oss_index'];
			$this->openSearchParam['config']['data']['autocompletion']	=	$config['oss_auto_name'];
			$this->openSearchParam['config']['data']['field'] 			=	$config['oss_keyword_field'];
			$this->openSearchParam['config']['login'] 					=	$config['oss_user'];
			$this->openSearchParam['config']['key'] 					=	$config['oss_login_key']; */
		}
		
		public function __destruct(){
			$this->isbn_key	=	null;
			/* $this->searchKeyword 	=	null;
			$this->searchCategory	=	null;
			$this->limitCount		=	10;
			$this->startCount		=	0;
			$this->lastError		=	'';
			$this->openSearchParam	=	array(); */
		}
		
        private function getCategoriesForFilter($categoryId){
            $menu_data	=	file_get_contents(__DIR__.'/categoryDump.php');
//        	require __DIR__.'/categoryDump.php';
            $allCatData =   array();
            if(isset($menu_data)){
                $menu_data  =   json_decode($menu_data,true);
                $allCatData =   $menu_data['completeCatStructure'];
            }
            $returnCatStr   =   $categoryId;
            if(isset($allCatData[$categoryId])){
                $returnCatStr   =  $this->iterateCategoryChild($categoryId,$allCatData,$returnCatStr);
            }
            return $returnCatStr;
        }
        
        private function iterateCategoryChild($category,$allCategorydata,$returnCatStr){
            for($j=0;$j<count($allCategorydata[$category]);$j++){
                $returnCatStr .= ','.$allCategorydata[$category][$j]['attr']['data-catid'];
                if(isset($allCategorydata[$allCategorydata[$category][$j]['attr']['data-catid']])){
                    $returnCatStr   .=   $this->iterateCategoryChild($allCategorydata[$category][$j]['attr']['data-catid'],$allCategorydata,'');
                }
            }
            return $returnCatStr;
        }
        
		private function setSearchParams($paramArr,$type){
			$searchFunction	=	'';
			if(isset($paramArr['start'])){
				$this->openSearchParam['query']['start']	=	$paramArr['start'];
			}
			if(isset($paramArr['rows'])){
				$this->openSearchParam['query']['rows']	=	$paramArr['rows'];
			}
			if(isset($paramArr['catfilter'])){
                if(isset($paramArr['filter']) && $paramArr['filter'] == 'strict'){
                    $this->openSearchParam['query']['catfilter'] = $paramArr['catfilter'];
                }
                else{
                    $this->openSearchParam['query']['catfilter'] = $this->getCategoriesForFilter($paramArr['catfilter']);
                }
			}
			if(isset($paramArr['langfilter'])){
				$this->openSearchParam['query']['langfilter'] = $paramArr['langfilter'];
			}
			if(isset($paramArr['agefilter'])){
				$this->openSearchParam['query']['agefilter'] = $paramArr['agefilter'];
			}
			if(isset($paramArr['category'])){
				$this->searchCategory	=	$paramArr['category'];
				$searchFunction	=	'categoryData';
			}
			if(isset($paramArr['search'])){
				$this->searchKeyword	=	rawurldecode($paramArr['search']);
				$searchFunction	=	'keywordsearch';
			}
			if(isset($_SESSION['previousStart']) && $_SESSION['searchString'] == $this->searchKeyword){
				if($_SESSION['previousStart'] < $this->openSearchParam['query']['start'] && isset($_SESSION['nextPageToken'])){
					$this->youtubePageToken	=	$_SESSION['nextPageToken'];
				}
				else if($_SESSION['previousStart'] < $this->openSearchParam['query']['start'] && isset($_SESSION['prevPageToken'])){
					$this->youtubePageToken	=	$_SESSION['prevPageToken'];
				}
			}
			if($type == 'autocomplete'){
				$searchFunction	=	'autocomplete';
				$this->openSearchParam['config']['type']	=	$type;
			}
			else{
				$this->openSearchParam['config']['type']	=	'keywordSearch';
			}
			return $searchFunction;
		}
		
		public function processSearchRequest($requestVars,$requestServer,$searchType){
			$responseOutput		=	'';
			$requestedOperation	=	$this->setSearchParams($requestVars,$searchType);
            $currentVideoContent    =   array();
			if($requestServer == 'opensearch'){
                if(isset($requestVars['videoid'])){
                    $currentVideoContent    =   DB_Query('Select * from contentinfo where videoid="'.$requestVars['videoid'].'"');
                    if($currentVideoContent){
                        $currentVideoContent[0]['topicinfo'] =  json_decode($currentVideoContent[0]['topicinfo'],true)['topic_info'];
                    }
                    else{
                        $currentVideoContent    =   array();
                    }
                }
				$responseOutput	=	$this->searchOpenSearchServer($requestedOperation);
			}
			elseif ($requestServer == 'youtube'){
                if(isset($requestVars['videoid'])){
                }
				$responseOutput	=	$this->searchYoutubeServer($requestedOperation);
			}
			elseif ($requestServer == 'database'){
				
			}
            if(isset($requestVars['videoid']) && count($currentVideoContent)){
                $responseOutput  =   json_decode($responseOutput,true);
                $responseOutput['currentVideoData'] =   $currentVideoContent[0];
                $responseOutput =   json_encode($responseOutput);
            }
			return $responseOutput;
		}
		
		public function searchOpenSearchServer($type='keywordsearch'){
			$openSearchOutput	=	array();
			if($type == 'keywordsearch'){
				$this->openSearchKeywordData();
			}
			elseif ($type == 'autocomplete'){
				$this->openSearchAutocomplete();
			}
			elseif($type == 'categoryData'){
				$this->openSearchCategoryData();
			}
			$openSearchOutput	=	getSearchResult($this->openSearchParam['query'],$this->openSearchParam['config']);
			return $openSearchOutput;
		}

		private function openSearchKeywordData(){
			$this->openSearchParam['config']['data']['word']	=	$this->searchKeyword;
			$this->openSearchParam['query']['data']				=	$this->searchKeyword;
		}
		
		private function openSearchAutocomplete(){
			$this->openSearchParam['config']['data']['word']	=	rawurlencode($this->searchKeyword);
		}
		private function openSearchCategoryData(){
            if(!isset($this->openSearchParam['query']['catfilter'])){
                $this->openSearchParam['query']['catfilter'] = $this->getCategoriesForFilter($this->searchCategory);
            }
            elseif($this->openSearchParam['query']['catfilter'] == 'other'){
                $this->openSearchParam['query']['catfilter']    =   $this->searchCategory;
            }
			$this->searchKeyword	=	'';
			$this->openSearchParam['config']['data']['word']	=	$this->searchKeyword;
			$this->openSearchParam['query']['data']				=	$this->searchKeyword;
		}
		
		public function searchYoutubeServer($type='keywordsearch'){
			$responseData	=	array();
			if($type == 'keywordsearch'){
				$responseData   =   $this->youtubekeywordsearch($this->openSearchParam['query']['rows']);
                $responseData   =	 $this->formatYoutubeResultAsOpenSearchResults($responseData);
                $responseData   =   json_decode($responseData,true);
                $getVideosStatisticsData	=	$this->getYoutubeVIdeosStatistics($responseData['videoIdListStr']);
                for($item=0;$item<count($responseData['documents']);$item++){
                    $ytViews    =   0;
                    $ytLikes    =   0;
                    $ytComments    =   0;
                    $ytDislikes =   0;
                    if(isset($getVideosStatisticsData['items'][$item]['statistics']['viewCount'])){
                        $ytViews    =   $getVideosStatisticsData['items'][$item]['statistics']['viewCount'];
                    }
                    if(isset($getVideosStatisticsData['items'][$item]['statistics']['likeCount'])){
                        $ytLikes    =   $getVideosStatisticsData['items'][$item]['statistics']['likeCount'];
                    }
                    if(isset($getVideosStatisticsData['items'][$item]['statistics']['commentCount'])){
                        $ytComments    =   $getVideosStatisticsData['items'][$item]['statistics']['commentCount'];
                    }
                    if(isset($getVideosStatisticsData['items'][$item]['statistics']['dislikeCount'])){
                        $ytDislikes    =   $getVideosStatisticsData['items'][$item]['statistics']['dislikeCount'];
                    }
                    array_push($responseData['documents'][$item]['snippets'],array('fieldName'=>'ytViews','values'=>array($ytViews)));
                    array_push($responseData['documents'][$item]['snippets'],array('fieldName'=>'ytLikes','values'=>array($ytLikes)));
                    array_push($responseData['documents'][$item]['snippets'],array('fieldName'=>'ytComments','values'=>array($ytComments)));
                    array_push($responseData['documents'][$item]['snippets'],array('fieldName'=>'ytDislikes','values'=>array($ytDislikes)));
                }
                $responseData   =   json_encode($responseData);
			}
			elseif($type == 'autocomplete'){
				$responseData	=	$this->youtubeautocompletesearch();
			}
			return $responseData;
		}
		
		public function check_tempcuration_for_already_curate_video($data)
		{
			$output	=	array(
					'status'	=>	true
			);
			if(!is_login)
			{
				$output	=	array(
						'status'	=>	false	//not login user
				);
			}
				
			else if(!isset($data['id'],$data['source'])	)
			{
				$output	=	array(
						'status'	=>	false	//not login user
				);
			}
			else
			{
				$session_data	=	session_manager_get(array('usertype'));
				if(isset($data['s_id'])	&&	is_numeric($data['s_id'])	&&	$session_data['data']['usertype']	==	UT_MODERATOR)
				{
					$query_data	=    array(
							'Fields'=>	'title,originaldescription,curationlinks,category,language,description,topicinfo,sourcename,keywords,curationstatus,itemused,agegroup,originalkeywords,category_breadcrumb',
							'Table'	=>	'tempcuration',
							'clause'=>	"id='".$data['s_id']."'" /////session iss yo be removed
					);
				}
				else
				{
					$query_data	=    array(
							'Fields'=>	'title,originaldescription,curationlinks,category,language,description,topicinfo,sourcename,keywords,curationstatus,itemused,agegroup,originalkeywords,category_breadcrumb',
							'Table'	=>	'tempcuration',
							'clause'=>	"curatedby='".$_SESSION['uid']."' && videoid='".$data['id']."'" /////session iss yo be removed
					);
				}
				$data_tempcuration	=    DB_Read($query_data);
				if($data_tempcuration)
				{
					$query_category	=    array(
							'Fields'=>	'parentCat,catName,status,catId',
							'Table'	=>	'categoryinfo',
							'clause'=>	"catId='".$data_tempcuration[0]['category']."' || status='".CATS_UNVERIFIED."'");
					
					$data_parentcat	=    DB_Read($query_category);
					
					$videoMetadata 	=	$data_tempcuration;
					$temp_count		=	0;
					for($i=0;	$i<count($data_parentcat);	$i++)
					{
						if($data_parentcat[$i]['catId']	==	$data_tempcuration[0]['category'])
						{
							if($data_parentcat[$i]['status']	==	CATS_UNVERIFIED)
							{
								$videoMetadata[0]['parentCat']	=	$data_parentcat[$i]['parentCat'];
								$videoMetadata[0]['catName']	=	$data_parentcat[$i]['catName'];
							}
							else
							{
								$videoMetadata[0]['parentCat']	=	'';
								$videoMetadata[0]['catName']	=	'';
							}
						}
						else
						{
							$videoMetadata['unverified_category'][$temp_count++]	=	$data_parentcat[$i]['catName'];
						}
					}
					$videoMetadata['kind']		=	'wt_list_response';
					$videoMetadata["source"]	=	$data_tempcuration[0]['sourcename'];
					$response 					= 	array('metadata'=>$videoMetadata);
					$output	=	array(
							'status'=>	true,
							'data'	=>	$response
					);
				}
				else
				{
					$output	=	 $this->yt_metadata_for_curation($data);
				}
			}
			return $output;
		}
		
		public function yt_metadata_for_curation($data)
		{
			$output	=	array(
					'status'	=>	true
			);
			if(!is_login)
			{
				$output	=	array(
						'status'	=>	false	//not login user
				);
			}
			
			else if(	!isset($data['id'],$data['source'])	)
			{
				$output	=	array(
						'status'	=>	false	//not login user
				);
			}
			else
			{
				$id		=	$data['id'];
				$source	=	$data['source'];
				$query_category	=    array(
						'Fields'=>	'parentCat,catName,status,catId',
						'Table'	=>	'categoryinfo',
						'clause'=>	"status='".CATS_UNVERIFIED."'"
				);
				$data_parentcat	=    DB_Read($query_category);
				
				if($source	==	"yt")
				{
					$metaInfoUrl			=	"https://www.googleapis.com/youtube/v3/videos?key=".sso_gc_server_key."&id=".$id;
					$videoMetadata 			=	json_decode(file_get_contents($metaInfoUrl."&part=snippet%2CcontentDetails%2Cstatistics"),true);
					$videoMetadata["source"]=	"yt";
					
					for($i=0;	$i<count($data_parentcat);	$i++)
					{
						$videoMetadata[$i]['unverified_category']= $data_parentcat[$i]['catName'];
					}
										
					$response 				= 	array(
							'metadata'=>$videoMetadata
					);
					$output	=	array(
							'status'=>	true,	//not login user
							'data'	=>	$response
					);
				}
				else
				{
					$output	=	array(
							'status'	=>	false	//not login user
					);
				}
			}
			return $output;
		}
		
		private function youtubekeywordsearch($maxCount){
			if(!isset($maxCount)){
				$maxCount	=	50;
			}
			$url	=	"https://www.googleapis.com/youtube/v3/search?part=id%2Csnippet&q=".rawurlencode($this->searchKeyword)."&type=video&maxResults=".$maxCount."&key=".$this->youtubeSearchApiKey;
			if(isset($this->youtubePageToken)){
				$url	.=	'&pageToken='.$this->youtubePageToken;
			}
			$youtubeServerOutput	=	file_get_contents($url);
			$rawYoutubeData	=	json_decode($youtubeServerOutput,true);
			
			//new catVidData
//			$rawYoutubeData	=	$this->youtube_search_result_filter($rawYoutubeData,$this->openSearchParam['query']['rows']);
			
			if(isset($_SESSION['nextPageToken'])){
				$_SESSION['prevPageToken'] = $_SESSION['nextPageToken'];
			}
			if(isset($rawYoutubeData['nextPageToken']))
				$_SESSION['nextPageToken']	= $rawYoutubeData['nextPageToken'];
			$_SESSION['searchString'] = $this->searchKeyword;
			if(isset($this->searchKeyword))
				$_SESSION['previousStart'] = $this->openSearchParam['query']['start'];
			else
				$_SESSION['previousStart'] = 0;	
				
			return $rawYoutubeData;
		}
		
		private function youtubeautocompletesearch(){
			$url		=	"http://suggestqueries.google.com/complete/search?q=".rawurlencode($this->searchKeyword)."&client=firefox";
			$homepage	=	file_get_contents($url);
			$homepage	=	json_decode($homepage);
			if(count($homepage[1])	!=	0)
			{
				return json_encode(array(
						'terms'=>$homepage[1]	
				));
			}
		}
		
		public function formatYoutubeResultAsOpenSearchResults($rawYoutubeData){
			$outputJsonFormat = array();
			$videoIdArr	=	array();
			if(count($rawYoutubeData)>0){
				$totalResultsFound	=	$rawYoutubeData['pageInfo']['totalResults'];
				$rawYoutubeData = $rawYoutubeData['items'];
				foreach($rawYoutubeData as $key=>$value){
					$snippetArr = array();
					$value1 = $value;
					$value = $value['snippet'];
					foreach($value as $fieldname => $fieldValues){
						if($fieldname == 'publishedAt'){
							$fieldname = 'pubDate';
						}
						else if($fieldname	==	"title")
								{
									$fieldname	=	"string";
								}
							else if($fieldname	==	"thumbnails")
							{
								$fieldname	=	"tnurl";
								$fieldValues	=	$fieldValues['default']['url'];
							}
						array_push($snippetArr,array('fieldName'=>$fieldname,'values'=>array($fieldValues)));
					}
					if(isset($value1['id']['videoId'])){
						array_push($videoIdArr,$value1['id']['videoId']);
						array_push($snippetArr,array('fieldName'=>'videoid','values'=>array($value1['id']['videoId'])));
					}				
					array_push($snippetArr,array('fieldName'=>'url','values'=>array("https://www.youtube.com/?watch=")));
					array_push($snippetArr,array('fieldName'=>'id','values'=>array("yt-".$value1['id']['videoId'])));
					array_push($snippetArr,array('fieldName'=>'topicinfo','values'=>array(json_encode(array('topic_info'=>array())))));
					array_push($outputJsonFormat,array('snippets'=>$snippetArr));
				}
			}
			return json_encode(array('documents'=>$outputJsonFormat,'videoIdListStr'=> implode(',',$videoIdArr),'numFound'=>min($totalResultsFound,50),'rows'=>$this->openSearchParam['query']['rows'],'start'=>$this->openSearchParam['query']['start']));
		}
		private function youtube_search_result_filter($search_result,$numRows){
			$temp_count	=	0;
			$videoid_array	=	array();
			$final_result	=	array();
			$final_json		=	array();
			$length_you_result	=	count($search_result['items']);
			for($i=0;	$i<$length_you_result;	$i++)
			{
				$videoid_array[$i]	=	$search_result['items'][$i]['id']['videoId'];
			}
			$query    =    array('Fields'=>'videoid','Table'=>'contentinfo');
			$d_data_org    =    DB_Read($query);
			
			// d_data_org is assos array to level 2 so convert it tio simple array
			$temp_d_data_org	=	array();
			for($i=0;	$i<count($d_data_org);	$i++)
			{
				$value_array	=	$d_data_org[$i]['videoid'];	
				array_push($temp_d_data_org,$value_array);
			}
			$d_data_org	=	$temp_d_data_org;
			//------------------------------------------
			for($i=0;	$i<$length_you_result;	$i++)
			{
				if($temp_count	==	$numRows)
				{
					break;
				}
				$curr_videoid	=	$videoid_array[$i];
				//in_array($curr_videoid,$d_data_org)
				if(!in_array($curr_videoid,$d_data_org))
				{
					$final_result[$temp_count++]	=	$i;	//list of indexes to be shown
				}
			}
			/* if all vieos are curated then what should be the search criteria
			 * default: it returns the 10 search restult instead of the presencce in the curated set
			 */
			
			if($temp_count	!=	$numRows) 
			{
				if($length_you_result	<=	10)
				{
					$final_json	=	$search_result;
				}
				else
				{
					for($i=10;	$i<$length_you_result;	$i++)
					{
						unset($search_result['items'][$i]);
					}
				}
				$final_json	=	$search_result;
			}	
			else
			{
				$final_json		=	array();
				$final_json['kind']				=	$search_result['kind'];
				$final_json['etag']				=	$search_result['etag'];
				if(isset($search_result['nextPageToken']))
				{
					$final_json['nextPageToken']	=	$search_result['nextPageToken'];
				}
				
				for($i=0;	$i<$numRows;	$i++)
				{
					$final_json['items'][$i]	=	$search_result['items'][$final_result[$i]];
				}
				
			}
			$final_json['total']			=	$search_result['pageInfo']['totalResults'];
			
			return $final_json;	
		}
		
		private function getCategoryVideos(){
			$catId = $_GET['category'];
			$orderClause = 'numofviews DESC ';
			$limitStart = 0;
			$numRows = 10;
			if(isset($_GET['start'])){
				$limitStart = $_GET['start'];
			}
			if(isset($_GET['rows'])){
				$numRows = $_GET['rows'];
			}
			$limitClause = 'Limit '.$limitStart.', '.$numRows;
			$catVidData = DB_Read(array(
				'Table' => 'contentinfo',
				'Fields' => '*',
				'clause' => 'category = '.$catId,
				'order' => $orderClause.$limitClause
			),'ASSOC','');
			$totalResult	=	DB_Query("Select count(*) as total from contentinfo where category = ".$catId);
			$totalResult	= $totalResult[0]['total'];
			$outputJsonFormat = false;
			if(count($catVidData)>0 && $catVidData[0] !=""){
				$outputJsonFormat = array();
				foreach($catVidData as $key=>$value){
					$snippetArr = array();
					foreach($value as $fieldname => $fieldValues){
						array_push($snippetArr,array('fieldName'=>$fieldname,'values'=>array(str_replace('\'','\\\'',$fieldValues))));
					}
					array_push($outputJsonFormat,array('snippets'=>$snippetArr));
				}
			}
			return array('documents'=>$outputJsonFormat,'numFound'=>$totalResult,'rows'=>$numRows,'start'=>$limitStart);
		}
		
		public function searchDatabaseServer(){
			return ;
		}
		
		public function getYoutubeVIdeosStatistics($commaSeparatedYtIdList){
			$metaInfoUrl			=	"https://www.googleapis.com/youtube/v3/videos?key=".sso_gc_server_key."&id=".$commaSeparatedYtIdList;
			$videoMetadata 			=	json_decode(file_get_contents($metaInfoUrl."&part=statistics"),true);
			return $videoMetadata;
		}
	}
?>