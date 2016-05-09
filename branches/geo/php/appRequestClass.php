<?php
	class MainAppRequest {
		private $searchQuery,$searchCategory,$catSearchFlag,$topicArrObj,$contentObj,$lastSearchedCat,$videoId;
		private $requiredArr,$topicsArrCurVid,$listArr,$filterFlag,$listFilter,$catfilter,$languagefilter;
		private $agefilter,$catDataArr,$subCatDataArr,$languageData,$completeCatDataArr;
		private $searchDataType,$bookMarksData,$start,$rows,$contributeFlag;
		public $page, $pageData, $urlStr,$urlParamStr,$loggedInUser,$HomePageVideosDataArr,$HomePageVideosData;
		public function __construct(){
			$this->searchQuery		=	'';
			$this->searchCategory 	= 	0;
			$this->catSearchFlag	=	false;
			$this->topicArrObj		=	array();
			$this->contentObj		=	array();
			$this->lastSearchedCat 	= 	'';
			$this->page 			= 	'home';
			$this->videoId			=	'';
			$this->pageData			=	array();
			$this->requiredArr		=	array();
			$this->topicsArrCurVid 	= 	true;
			$this->listArr			= 	array('list' => array('ytList'=>array()));
			$this->filterFlag 		= 	array('filters' => false);
			$this->listFilter		=	array('category'=>false,'language'=>false,'age'=>false);
			$this->catfilter		=	false;
			$this->languagefilter	=	false;
			$this->agefilter		=	false;
			$this->loggedInUser		=	false;
			$this->urlStr			=	'';
			$this->urlParamStr		=	'';
			$this->start			=	0;
			$this->rows		        =	10;
			$this->catDataArr 		= 	array();
			$this->subCatDataArr 	     = 	array();
			$this->completeCatDataArr 	 = 	array();
			$this->HomePageVideosData    = 	array();	
			$this->HomePageVideosDataArr = 	array();	
			$this->searchDataType	=	false;
			$this->contentObj	    =	array();
            $this->bookMarksData    =   array();
           	$this->contributeFlag	=	false;
            $this->languageData =   array();
		}
		
		public function __destruct(){
			
		}
		
		public function processAppRequest(){
			$this->setAppParams();
			$this->setCategoryData();
			$this->setLanguageData();
//			$this->setHomePageData();
//			$this->fetchListData();
			$this->formatAppData();
		}
		
		private function setAppParams(){
            if(isset($_GET['page']) && $_GET['page'] == "profile" && !is_login){
                unset ($_GET['page']);
            }
			if(isset($_GET['page'])){
				$this->page 		= $_GET['page'];
				$this->urlStr 		= 'page='.$this->page;
				unset($_GET['page']);
				foreach($_GET as $qterm => $qval ){
					$this->urlParamStr	.=	'&'.$qterm.'='.$qval;
				}
				$_GET['page']	=	$this->page;
			}
			if(is_login){
				$this->loggedInUser = true;
			}
            if(isset($_GET['start'])){
                $this->start    =   $_GET['start'];
            }
            if(isset($_GET['rows'])){
                $this->rows     =   $_GET['rows'];
            }
			if(isset($_GET['catfilter'])){
				$this->listFilter['category']	=	$_GET['catfilter'];
				$this->filterFlag['filters']	=	true;
			}
			if(isset($_GET['langfilter'])){
				$this->listFilter['language']	=	$_GET['langfilter'];
				$this->filterFlag['filters']	=	true;
			}
			if(isset($_GET['agefilter'])){
				$this->listFilter['age']	=	$_GET['agefilter'];
				$this->filterFlag['filters']	=	true;
			}
			if(isset($_GET['category'])){
				$this->searchDataType	=	'category';
				$this->searchCategory	=	$_GET['category'];
				$this->lastSearchedCat  =   $this->searchCategory;
			}
			if(isset($_GET['search'])){
				$this->searchDataType	=	'keyword';
				$this->searchQuery 	=	$_GET['search'];
			}
			if(isset($_GET['request']) && $_GET['request'] == 'curate' && is_login){
            	$this->contributeFlag	=	true;
				$this->searchDataType	=	'curation';
				if($this->searchQuery == ''){
					$_GET['search']	=	'';
				}
			}
		}
		
		private function setCategoryData(){
//			if(!$this->contributeFlag){
                $menu_data	=	file_get_contents(__DIR__.'/categoryDump.php');
                if(isset($menu_data)){
                    $menu_data  =   json_decode($menu_data,true);
                    $this->catDataArr           =   $menu_data['main'];
                    $this->subCatDataArr        =   $menu_data['structure'];
                    $this->completeCatDataArr   =   $menu_data['completeCatStructure'];
                }
/*
				$categoryData	=	DB_Query("Select * from categoryinfo where status=".CATS_VERIFIED,"ASSOC","");
				if($categoryData != 0) {
					foreach($categoryData as $key => $value){
						if($value['parentCat'] == 0){
							array_push($this->catDataArr, array('label' => $value['catName'],'link'=>'#','attr'=>array('data-catid'=>$value['catId'],'data-vidId'=>$value['anchorVideoId'])));
						}
						else{
							$this->subCatDataArr[$value['parentCat']][] = array('label' => $value['catName'],'link'=>'#','attr'=>array('data-catid'=>$value['catId'],'data-vidId'=>$value['anchorVideoId']));
						}
					}
				}
*/
/* 			}
            else{
				$categoryData	=	DB_Query("Select * from categoryinfo where status=".CATS_VERIFIED,"ASSOC","");
				if($categoryData != 0) {
					foreach($categoryData as $key => $value){
						if($value['parentCat'] == 0){
							array_push($this->catDataArr, array('label' => $value['catName'],'link'=>'search/category='.$value['catId'],'attr'=>array('data-catid'=>$value['catId'],'data-vidId'=>$value['anchorVideoId'])));
						}
						else{
							$this->subCatDataArr[$value['parentCat']][] = array('label' => $value['catName'],'link'=>'search/category='.$value['catId'],'attr'=>array('data-catid'=>$value['catId'],'data-vidId'=>$value['anchorVideoId']));
						}
					}
                    $this->completeCatDataArr   =   $this->subCatDataArr;
				}
            }
 */		}
		
		private function setLanguageData(){
            $this->languageData	=	DB_Query("Select * from language where status!=".LS_DELETED,"ASSOC","","id");
		}
		
		public function setHomePageData(){
			if(!$this->contributeFlag){
/*
 				$this->HomePageVideosDataArr = DB_Query("select * from (select *, @num := if(@category = category, @num + 1, 1) as row_number, @category := category as dummy from contentinfo CROSS JOIN (SELECT @num:=0, @category:='') as C order by category, numofviews desc )as x right join categoryinfo on x.category = categoryinfo.catId right join userinfo on x.curatedby = userinfo.userid where categoryinfo.parentCat=0 and categoryinfo.status = ".CATS_VERIFIED." and x.row_number <= 1 LIMIT 12","ASSOC","");
*/
 				$this->HomePageVideosDataArr = DB_Query("select * from contentinfo as x right join categoryinfo on x.id = categoryinfo.anchorVideoId right join userinfo on x.curatedby = userinfo.userid where categoryinfo.summary='wt-home' and categoryinfo.status = ".CATS_VERIFIED." LIMIT 12","ASSOC","");
				if(is_array($this->HomePageVideosDataArr) && count($this->HomePageVideosDataArr) > 0){
					foreach($this->HomePageVideosDataArr as $key => $value){
						array_push($this->HomePageVideosData, array('label' => $value['catName'],'link'=>'#','tnurl'=>str_replace('default','mqdefault',$value['tnurl']),'title'=>$value['string'],'desc'=>$value['description'],'shared'=>$value['username'],'url'=>$value['url'],'videoid'=>$value['videoid'],'attr'=>array('data-catid'=>$value['catId'],'data-vidId'=>$value['id'])));
					}
				}
			}
		}
		
		private function fetchListData(){
			$searchClassObject	=	new ContentSearchClass();
			switch($this->searchDataType){
				case 'category':
					$this->catSearchFlag = true;
					$responseData	=	$searchClassObject->processSearchRequest($_GET,'opensearch','list');
					$this->listArr		=	array('list'=>json_decode($responseData,true));
					break;
				case 'keyword':
					$responseData	=	$searchClassObject->processSearchRequest($_GET,'opensearch','list');
					$searchServerResults	=	json_decode($responseData,true);
					$reqRows		= 0;
					if(isset($_GET['rows']))
						$reqRows		=	$_GET['rows'];
					$_GET['rows']		=	50;
					$responseData		=	$searchClassObject->processSearchRequest($_GET,'youtube','list');
					$ytListArr			=	array('ytList' => array('list'=>json_decode($responseData,true)));
					$searchServerResults=	array_merge($searchServerResults,$ytListArr);
					$this->listArr		=	array('list'=>$searchServerResults);
					break;
				case 'curation':
					$responseData	=	json_encode(array('documents' => array()));
					if(!isset($_GET['videoId'])){
						$_GET['rows']	=	20;
						$responseData	=	$searchClassObject->processSearchRequest($_GET,'youtube','list');
					}
                    $responseData   =   json_decode($responseData,true);
					$this->listArr	=	array('list'=>$responseData);
					break;
				default:
					break;
			}
		}
		
		private function formatAppData(){
            if($_REQUEST['request'] != 'curate'){
                if(isset($_GET['page']) && $this->page != 'profile'){
                    $tempObj = json_decode(json_encode($this->listArr['list']),true);
                    $documentArray = array();
                    if(isset($tempObj['documents'])){
                        $documentArray = $tempObj['documents'];
                    }
                    if(isset($this->listArr['list']['ytList']) && isset($this->listArr['list']['ytList']['list'])){
                        $ycounter = $this->start;
                        foreach($this->listArr['list']['ytList']['list']['documents'] as $ykey => $yvalue){
                            array_push($documentArray,$yvalue);
                            $ycounter++;
                            if($ycounter == $this->start+$this->rows){
                                break;
                            }
                        }
/*
                        for($y=$this->start;$y<$this->start+$this->rows;$y++){
                            array_push($documentArray,$this->listArr['list']['ytList']['list']['documents'][$y]);
                        }
*/
                    }
                    for($i=0;$i<count($documentArray);$i++){
                        array_push($this->requiredArr,array());
                        for($j=0;$j<count($documentArray[$i]['snippets']);$j++){
                            if(isset($documentArray[$i]['snippets'][$j]['values'])){
                                $this->requiredArr[$i][$documentArray[$i]['snippets'][$j]['fieldName']] = $documentArray[$i]['snippets'][$j]['values'][0];
                            }
                            else{
                                $this->requiredArr[$i][$documentArray[$i]['snippets'][$j]['fieldName']] = '';
                            }
                        }
                    }
                    if($_GET['page']=='view'){
                        if(isset($_GET['videoId'])){
                            $this->videoId = $_GET['videoId'];
                            $this->topicsArrCurVid = false;
                            if(is_login){
                                $requestObject  =   array('videoid'=>$this->videoId,'userid'=>$_SESSION['uid']);
                                $readUserBookmark     =   bookmark_read($requestObject);
                                if($readUserBookmark){
                                    $this->bookMarksData    =   $readUserBookmark;
                                }
                            }
                        }
                    }
                }
                else{
                    $this->requiredArr = $this->HomePageVideosDataArr;
                }
                if(is_array($this->requiredArr) && count($this->requiredArr)>0){
                    foreach($this->requiredArr as $key=>$value){
                        if(!$this->topicsArrCurVid && $value['id'] == $this->videoId){
                            $this->topicsArrCurVid = true;
                        }
                        $this->topicArrObj[$value['id']] = $value['topicinfo'];
                        $this->contentObj[$value['id']]	=	$value;
                    }
                }
                if(!$this->topicsArrCurVid){
                    $curVidData = DB_Query("Select * from contentinfo where id = ".$this->videoId,"ASSOC","");
                    $this->contentObj[$this->videoId] = $curVidData[0];
                    $this->topicArrObj[$this->videoId] = $this->contentObj[$this->videoId]['topicinfo'];
                }
            }
            else{
            	if(isset($_GET['videoId'])){
            		$this->videoId = $_GET['videoId'];
            	}
            }
			$this->prepareOutputAppData();
		}
		
		private function prepareOutputAppData(){
			$catArr			=	array('categories' => $this->catDataArr);
			$langArr		=	array('languages'	=>	$this->languageData);
			$subCatArr		=	array('subCategories' => $this->subCatDataArr);
			$allCatArr		=	array('allStructureCategories' => $this->completeCatDataArr);
            
			$this->pageData	=	array_merge($this->pageData,$catArr);
			$this->pageData	=	array_merge($this->pageData,$langArr);
			$this->pageData	=	array_merge($this->pageData,$subCatArr);
			$this->pageData	=	array_merge($this->pageData,$allCatArr);
			$this->pageData	=	json_encode($this->pageData);
		}
	}
?>