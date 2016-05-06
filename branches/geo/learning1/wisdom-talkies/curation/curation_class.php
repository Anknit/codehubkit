<?php
/*
 * 1. Mandatory: Include db manager config and db files before this file
 * 2. Mandatory: Include curation_config file before includeing this file
 */
require_once __DIR__.'./../definitions.php';

class _curation
{
	public  $curation_init_status	=	false;
	public  $curation_init_error	=	'';
	
	private function curation_version($number1,$number2)
	{
		if(!$number1)
		{
			$number1	=	"0.0";
		}
		if(!$number2)
		{
			$number2	=	"0.0";
		}
		$number1		=	(string)$number1;
		$number2		=	(string)$number2;
		$integer_part	=	(int)explode(".",$number1)[0]+(int)explode(".",$number2)[0];
		$decimal_part	=	(int)explode(".",$number1)[1]+(int)explode(".",$number2)[1];
		return (string)$integer_part.".".(string)$decimal_part;
	}
	
	public function _curation($curation_config	=	'')
	{
		global $Module;
		if(	(isset($Module['curation'])	&&	$Module['curation']	==	true)	||	(isset($Module['recommend'])	&&	$Module['recommend']	==	true))
		{
			$this->curation_init_status	=	true;
		}
		else
		{
			$this->curation_init_status	=	false;
		}
	}
	
	/* function recommend($recom_data)
	{
		$output	=	array(
				'status'=>	true
		);
		$catid	=	$recom_data['catId'];
		$category_breadcrumb	=	$recom_data['category_breadcrumb'];
		if($recom_data['captcha']	!=	$recom_data['sess_captcha_code'])
		{
			$output	=	array(
					'status'=>	false,
					'error'	=>	'curation_error4'
			);
		}
		
		else if(!isset($recom_data['videoSource'],$recom_data['videoId'],$recom_data['recommendDesc'],$recom_data['catId'],$recom_data['title']))
		{
			$output	=	array(
					'status'=>	false,
					'error'	=>	'curation_error3'
			);
		}
		else
		{
			if($recom_data['catId']	==	0)
			{
				$query_cat	=    array(
						'Fields'=>	'catId',
						'Table'	=>	'categoryinfo',
						'clause'=>	"catName='". $recom_data['newCatName']."'"
				);
				$data_cat	=    DB_Read($query_cat);
		
				if($data_cat)
				{
					$catid	=	$data_cat[0]['catId'];
				}
				else
				{
					$insert_cat 	=   array(
							'Table'	=>	'categoryinfo',
							'Fields'=>	array(
									'status'		=>	CATS_UNVERIFIED,
									'catName'		=>	$recom_data['newCatName'],
									'creationTime'	=>	date('Y-m-d H:i:s',time()),
									'parentCat'		=>	'0'
							)
					);
					$data_cat_insert=	DB_Insert($insert_cat);
					
					$update_cat 	=   array(
							'Table'	=>	'categoryinfo',
							'Fields'=>	array(
									'anchorVideoId'	=>	$data_cat_insert
							),
							'clause'=>	"catId='".$data_cat_insert."'"
					);
					DB_Update($update_cat);
					
					$catid			=	$data_cat_insert;
				}
			}
				$d_data    =    array(
						'Table'	=>	'tempcuration',
						'Fields'=>	array(
								'sourcename'			=>	$recom_data['videoSource'],
								'videoid'				=>	$recom_data['videoId'],
								'description'			=>	$recom_data['recommendDesc'],
								'category'				=>	$catid,
								'curationstatus'		=>	CS_RECOMMEND,
								'category_breadcrumb'	=>	$category_breadcrumb,
								'modifieddate'			=>	date("Y-m-d H:i:s",time()),
								'title'					=>	$recom_data['title']
						)
				);
				if(!DB_Insert($d_data))
				{
					$output	=	array(
							'status'=>	false,
							'error'	=>	'curation_error1'//insert failed
					);
				}
		}
		return $output;
	}
	 */
	public function curation_add_to_list($list_data)
	{
		$output	=	array(
				'status'=>	true
		);
		
		$curatedby			=	$list_data['userid'];
		$curatorName		=	$list_data['username'];
		$videoID			=	$list_data['videoID'];
		$category			=	$list_data['category'];
		
		if($curatedby == NULL	||	!isset($videoID,$category)	||	$videoID	==	null	||	$category	==	null)
		{
			$output['status']	=	false;
			$output['error']	=	'curation_error1';
			$output['error_description']	=	'userid received through session is null at line no. '.__LINE__.' in file '.__FILE__;
		}
		
		else
		{
			$d_tempcuration     =    array(
					'Fields'=>	'*',
					'Table'	=>	'tempcuration',
					'clause'=>	"videoid='$videoID'&& curatedby='$curatedby'"
			);
			$read_tempcuration    =    DB_Read($d_tempcuration);

			if($read_tempcuration)
			{
				$output	=	array(
						'status'=>	false,
						'error'	=>	'curation_error5'	//already is in list
				);
			}
		
			else
			{
				$url				=	"https://www.googleapis.com/youtube/v3/videos?key=".sso_gc_server_key."&id=".$videoID."&part=statistics%2Csnippet%2CcontentDetails";
				$homepage			=	json_decode(file_get_contents($url),true);
                $numofytviews       =   0;
                $numofytlikes       =   0;
                if(isset($homepage['items'][0]['statistics']['viewCount'])){
                    $numofytviews		=	$homepage['items'][0]['statistics']['viewCount'];
                }
                if(isset($homepage['items'][0]['statistics']['likeCount'])){
                    $numofytlikes		=	$homepage['items'][0]['statistics']['likeCount'];
                }
				$source_url			=	"https://www.youtube.com/watch?v=";
				$source_thumbnail	=	$homepage['items'][0]["snippet"]['thumbnails']["default"]["url"];
				$endTimeDefault     =   $this->convertYoutubeTimeToSeconde($homepage['items'][0]['contentDetails']['duration']);   
				$topicInfo			=	json_encode(array("topic_info"=>array(array("topic"=>$homepage['items'][0]['snippet']['title'],"start_time"=>"0","end_time"=>$endTimeDefault))));
				$topicforcrawl		=	$homepage['items'][0]['snippet']['title'];
				$is_topic_null		=	true;
				$title				=	$homepage['items'][0]['snippet']['title'];
				$description		=	$homepage['items'][0]['snippet']['description'];
				$language			=	"1";
				$keywords			=	implode(",",$homepage['items'][0]['snippet']['tags']);
				$agegroup			=	"4";
				$itemused			=	"";
				
				$d_data    =    array(
						'Table'	=>	'tempcuration',
						'Fields'=>	array(
								'url'			=>	$source_url,
								'tnurl'			=>	$source_thumbnail,
								'sourcename'	=>	'yt',
								'videoid'		=>	$videoID,
								'topicinfo'		=>	$topicInfo,
								'title'			=>	$title,
								'description'	=>	$description,
								'curatedby'		=>	$curatedby,
								'curatorName'   =>  $curatorName,
								'category'		=>	$category,
								'language'		=>	$language,
								'keywords'		=>	$keywords,
								'itemused'		=>	$itemused,
								'agegroup'		=>	$agegroup,
								'curationstatus'=>	CS_INCOMPLETE,
								'topicforcrawl'	=>	$topicforcrawl,
								'numofytviews'	=>	$numofytviews,
								'numofytlikes'	=>	$numofytlikes,
								'numofviews'	=>	$numofytviews,
								'numoflikes'	=>	$numofytlikes,
								'modifieddate'	=>	date("Y-m-d H:i:s",time()),
								'istopicnull'	=>	$is_topic_null
						)
				);
				if(!DB_Insert($d_data))
				{
					$output	=	array(
							'status'=>	false,
							'error'	=>	'curation_error1'	//insert failed
					);
				}
			}
		}
		return $output;
	}
    public function convertYoutubeTimeToSeconde($ytFormatStr){
        $date			=	new DateTime('1970-01-01');
        $date->add(new DateInterval($ytFormatStr));
        $str_time		=	$date->format('H:i:s');
        $str_time		=	preg_replace("/^([\d]{1,2})\:([\d]{2})$/", "00:$1:$2", $str_time);
        sscanf($str_time, "%d:%d:%d", $hours, $minutes, $seconds);
        $time_seconds	= $hours * 3600 + $minutes * 60 + $seconds;
        return $time_seconds;
    }
    
	public function curation_save($save_data)
	{
		$output	=	array(
				'status'=>	true
		);
		
		$curatedby		=	$save_data['userid'];
		$curatorName	=	$save_data['username'];
		$usertype		=	$save_data['usertype'];
		$videoID		=	$save_data['videoID'];
		if(isset($save_data['s_id'])	&&	is_numeric($save_data['s_id']))
		{
			$s_id		=	$save_data['s_id'];
		}
		else
		{
			$s_id		=	false;
		}
		
		if($curatedby == NULL)
		{
			$output['status']	=	false;
			$output['error']	=	'curation_error1';	
			$output['error_description']	=	'userid received through session is null at line no. '.__LINE__.' in file '.__FILE__;
		}
		elseif(!$videoID)
		{
			$output['status']	=	false;
			$output['error']	=	'curation_error1';
		}
		else if(($save_data['category']	==	'other_category'	&&	$save_data['other_category']	==	null)	||	($save_data['language']	==	'other_language'	&&	$save_data['other_language']	==	null))
		{
			$output	=	array(
					'status'=>	false,
					'error'	=>	'curation_error1'
			);
		}
		else
		{
			if($s_id)
			{
				$d_tempcuration     =    array(
						'Fields'=>	'*',
						'Table'	=>	'tempcuration',
						'clause'=>	"id='$s_id'"
				);
			}
			else
			{
				$d_tempcuration     =	array(
						'Fields'=>	'*',
						'Table'	=>	'tempcuration',
						'clause'=>	"videoid='$videoID'&& curatedby='$curatedby'"
				);
			}
			$read_tempcuration    =    DB_Read($d_tempcuration);
			if(($read_tempcuration[0]['curationstatus']	==	CS_COMPLETE	||	$read_tempcuration[0]['curationstatus']	==	CS_PENDING)	&&	$usertype	!=	UT_MODERATOR)
			{
				$output	=	array(
						'status'=>	false,
						'error'	=>	'curation_error2'	//already published
				);
			}
		
			else
			{
				$topicInfo	=	$save_data['topicInfo'];
		
				$topicforcrawl	=	"";
				$topic_list	=	json_decode($topicInfo,true);
		
				if(!is_array($topic_list))
				{
					$output	=	array(
							'status'			=>	false,
							'error'				=>	'curation_error1',	//invalid json
							'error_description'	=>	"JSON parsing error "."at line no. ".__LINE__." at file ".__FILE__." content: json=".$topicInfo
					);
				}
					
				else
				{
					$length	=	count($topic_list['topic_info']);
					for($i=0;	$i<$length;	$i++)
					{
						if($i+1	!=	$length)
						{
							$topicforcrawl	.=	$topic_list['topic_info'][$i]['topic'].",";
						}
						else
						{
							$topicforcrawl	.=	$topic_list['topic_info'][$i]['topic'];
						}
					}
					$is_topic_null	=	$save_data['is_topic_null'];
					$title			=	$save_data['title'];
					$description	=	$save_data['description'];
					$category		=	$save_data['category'];
					$other_category	=	$save_data['other_category'];
					if($other_category	!=	"")
					{
						$a    =    array(
							'Fields'=>	'catId',
							'Table'	=>	'categoryinfo',
							'clause'=>	"catName='$other_category' and parentCat='$category'"
						);
						$b    =    DB_Read($a);
						
						if($b)
						{
							$category	=	$b[0]['catId'];
						}
						else
						{
							$d_data    =    array(
									'Table'=>'categoryinfo',
									'Fields'=>array(
										'status'		=>	CATS_UNVERIFIED,
										'catName'		=>	$other_category,
										'userId'		=>	$curatedby,
                                        'parentCat'     =>  $category,
										'creationTime'	=>	date('Y-m-d H:i:s',time())
									)
							);
							$category	=	DB_Insert($d_data);
							
							$d_data_update_category    =    array(
									'Table'	=>	'categoryinfo',
									'Fields'=>	array(
											'anchorVideoId'	=>	$category
									),
									'clause'=>	"catId='".$category."'"
									
							);
							DB_Update($d_data_update_category);
						}
					}
								
					$language		=	$save_data['language'];
					$other_language	=	$save_data['other_language'];
					if($language	==	"other_language")
					{
						$a    =    array(
							'Fields'=>	'id',
							'Table'	=>	'language',
							'clause'=>	"language='$other_language'"
						);
						$b    =    DB_Read($a);
					
						if($b)
						{
							$language	=	$b[0]['id'];
						}
						else
						{
							$d_data    =    array(
									'Table'	=>	'language',
									'Fields'=>	array(
										'userId'		=>	$curatedby,
										'creationTime'	=>	date('Y-m-d H:i:s',time()),
										'language'		=>	$other_language,
										'status'		=>	LS_UNVERIFIED)
							);
							$language	=	DB_Insert($d_data);
						}
					}
					$keywords	=	$save_data['keywords'];
					$tags		=	$save_data['tags'];
					$cat_bread	=	$save_data['cat_bread'];
					$itemused	=	$save_data['items'];
					$agegroup	=	$save_data['age'];
					$curationlinks	=	$save_data['links'];
						
					if(is_array($read_tempcuration))
					{
						$d_data    =    array(
								'Table'			=>	'tempcuration',
								'Fields'		=>	array(
										'videoid'				=>	$videoID,
										'topicinfo'				=>	$topicInfo,
										'title'					=>	$title,
										'description'			=>	$description,
										'category'				=>	$category,
										'language'				=>	$language,
										'originalkeywords'		=>	$keywords,
										'keywords'				=>	$tags,
										'itemused'				=>	$itemused,
										'agegroup'				=>	$agegroup,
										'topicforcrawl'			=>	$topicforcrawl,
										'curationstatus'		=>	CS_INCOMPLETE,
										'modifieddate'			=>	date("Y-m-d H:i:s",time()),
										'istopicnull'			=>	$is_topic_null,
                                        'curationlinks' 		=>  $curationlinks,
										'category_breadcrumb'	=>	$cat_bread
								),
								'clause'=>"videoid='$videoID'&& curatedby='$curatedby'"
						);
						if($s_id)
						{
							$d_data['clause']	=	"id='".$s_id."'";
						}
						if(!DB_Update($d_data))
						{
							$output	=	array(
								'status'=>	false,
								'error'	=>	'curation_error1'	//update failed
								);
						}
						else
						{
							$output	=	array(
								'status'	=>	true,
								'data'		=>	'video has been updated successfully'
							);
						}
					}
					else
					{
						$url				=	"https://www.googleapis.com/youtube/v3/videos?key=".sso_gc_server_key."&id=".$videoID."&part=statistics%2Csnippet";
						$homepage			=	json_decode(file_get_contents($url),true);
						$numofytviews		=	$homepage['items'][0]['statistics']['viewCount'];
						$numofytlikes		=	$homepage['items'][0]['statistics']['likeCount'];
						$source_url			=	"https://www.youtube.com/watch?v=";
						$source_thumbnail	=	$homepage['items'][0]["snippet"]['thumbnails']["default"]["url"];
						$channel_id			=	$homepage['items'][0]['snippet']['channelId'];
						
						$channel_name_url	=	"https://www.googleapis.com/youtube/v3/channels?key=".sso_gc_server_key."&id=".$channel_id;
						$channel_name		=	json_decode(file_get_contents($channel_name_url."&part=snippet%2CcontentDetails%2Cstatistics"),true)['items'][0]['snippet']['title'];
						
						$d_data    =    array(
								'Table'	=>	'tempcuration',
								'Fields'=>	array(
										'url'					=>	$source_url,
										'tnurl'					=>	$source_thumbnail,
										'sourcename'			=>	'yt',
										'videoid'				=>	$videoID,
										'topicinfo'				=>	$topicInfo,
										'title'					=>	$title,
										'description'			=>	$description,
										'curatedby'				=>	$curatedby,
                                        'curatorName'   		=>  $curatorName,
										'category'				=>	$category,
										'language'				=>	$language,
										'keywords'				=>	$tags,
										'itemused'				=>	$itemused,
										'agegroup'				=>	$agegroup,
										'curationstatus'		=>	CS_INCOMPLETE,
										'topicforcrawl'			=>	$topicforcrawl,
										'numofytviews'			=>	$numofytviews,
										'numofytlikes'			=>	$numofytlikes,
										'numofviews'			=>	$numofytviews,
										'numoflikes'			=>	$numofytlikes,
										'modifieddate'			=>	date("Y-m-d H:i:s",time()),
										'istopicnull'			=>	$is_topic_null,
										'originaltitle'			=>	$homepage['items'][0]["snippet"]['title'],
										'originaldescription'	=>	$homepage['items'][0]["snippet"]['description'],
                                        'curationlinks'         =>  $curationlinks,
										'originalkeywords'		=>	$keywords,/* implode(",",$homepage['items'][0]["snippet"]['tags']) */
										'category_breadcrumb'	=>	$cat_bread,
										'channel_name'			=>	$channel_name
								)
						);
						if(!DB_Insert($d_data))
						{
							$output	=	array(
									'status'=>	false,
									'error'	=>	'curation_error1'	//insert failed
							);
						}
						else
						{
							$processed_query	=   array(
									'Table'	=>	'tempcuration',
									'Fields'=>	array(
											'curationstatus'=>	CS_PROCESSED,
											'modifieddate'	=>	date("Y-m-d H:i:s",time())
									),
									'clause'=>"videoid='$videoID'&& curationstatus='".CS_PROCESSED."'"
							);
							DB_Update($processed_query);
							$output	=	array(
									'status'	=>	true,
									'response'	=>	'video has been saved successfully'
							);
						}
					}
				}
			}
		}
		
		return $output;
	}
	
	public function curation_final_save($pub_data)
	{
		$curatedby	=	$pub_data['userid'];
		$videoID	=	$pub_data['videoID'];
		if(isset($pub_data['s_id'])	&&	is_numeric($pub_data['s_id']))
		{
			$s_id		=	$pub_data['s_id'];
		}
		else
		{
			$s_id		=	false;
		}
		if(!$videoID	||	!$curatedby)
		{
			$output	=	array(
					'status'=>	false,
					'error'	=>	'curation_error3'
			);
		}
		else 
		{
			if($s_id)
			{
				$read_query_for_version    =    array(
						'Fields'=>	'version',
						'Table'	=>	'tempcuration',
						'clause'=>	"id='$s_id'"
				);
			}
			else
			{
				$read_query_for_version    =    array(
						'Fields'=>	'version',
						'Table'	=>	'tempcuration',
						'clause'=>	"videoid='$videoID'&& curatedby='$curatedby'"
				);
			}
			
			$d_data_version    =    DB_Read($read_query_for_version);
			
			if($d_data_version[0]['version']	==	null	||	$d_data_version[0]['version']	==	"")
			{
				$version	=	"1.0";
			}
			else
			{
				$version	=	$this->curation_version($d_data_version[0]['version'],"0.1");
			}
			$d_data		=   array(
					'Table'	=>	'tempcuration',
					'Fields'=>	array(
							'curationstatus'=>	CS_COMPLETE,
							'publisheddate'	=>	date("Y-m-d H:i:s",time()),
							'version'		=>	$version
					),
					'clause'=>"videoid='$videoID'&& curatedby='$curatedby'"
			);
			if($s_id	&&	($_SESSION['usertype']	==	UT_MODERATOR	||$_SESSION['usertype']	==	UT_REVIEWER))
			{
				$d_data['clause']	=	"id='".$s_id."'";
			}
			if(!DB_Update($d_data))
			{
				$output	=	array(
						'status'=>	false,
						'error'	=>	'curation_error1'	//update failed
				);
			}
			else
			{
				$output	=	array(
						'status'	=>	true,
						'response'	=>	'video has been saved for final review'
				);
			}
		}
		return $output;
	}  
	
	public function curation_delete($delete_data)
	{
		$curatedby	=	$delete_data['userid'];
		$videoID	=	$delete_data['videoID'];
		if(!$videoID	||	!$curatedby)
		{
			$output	=	array(
					'status'=>	false,
					'error'	=>	'curation_error3'
			);
		}
		else
		{
			$delete_response   =   DB_Query("Delete from tempcuration where videoid ='$videoID' && curatedby='$curatedby' && curationstatus='".CS_INCOMPLETE."'");
			if(!$delete_response)
			{
				$output	=	array(
						'status'=>	false,
						'error'	=>	'curation_error1'	//delete failed
				);
			}
			else
			{
				$output	=	array(
						'status'	=>	true,
						'response'	=>	'video has been deleted successfully'
				);
			}
		}
		return $output;
	}	
}; // close class