<?php
/*
 * 1. Mandatory: Include db manager config and db files before this file
 * 2. Mandatory: Include curation_config file before includeing this file
 */
require_once __DIR__.'./../require.php';

class _review_curation
{
	public  $review_curation_init_status	=	false;
	public  $review_curation_init_error	=	'';
	
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
	
	public function _review_curation($review_curation_config	=	'')
	{
		global $Module;
		if(is_login != true	||	$Module['UI_reviewer']	==	false	||	$Module['UI_moderator']	==	false	||	!isset($review_curation_config['usertype'])	||	($review_curation_config['usertype']	!=	UT_MODERATOR	&&	$review_curation_config['usertype']	!=	UT_REVIEWER))
			$this->review_curation_init_status	=	false;
		else
			$this->review_curation_init_status	=	true;
	}
	
	public function review_publish($pub_data)
	{
		$output['status']	=	true;
		
		$id_for_approve	=	$pub_data['id'];
		$approvedby		=	$pub_data['userid'];	//add approved by
	
		$query_read		=    array(
				'Fields'=>	'*',
				'Table'	=>	'tempcuration',
				'clause'=>	"id='$id_for_approve'"
		);
		$read_data		=	DB_Read($query_read);
		$version		=	$this->curation_version($read_data[0]['version'],$pub_data['version']);
	
		if($read_data[0]['curationstatus']	==	CS_APPROVED)
		{
			$output['status']	=	false;
			$output['error']	=	"review_curation_error2"; //already approved
		}
		else if(!is_numeric($id_for_approve)	||	!$approvedby)
		{
			$output['status']	=	false;
			$output['error']	=	"review_curation_error3"; 
		}
		else
		{
			$query_read_contentinfo		=	array(
					'Fields'=>	'*',
					'Table'	=>	'contentinfo',
					'clause'=>	"videoid='".$read_data[0]['videoid']."' && curatedby='".$read_data[0]['curatedby']."'"
			);
			$read_data_contentinfo		=	DB_Read($query_read_contentinfo);
			
			$query_update    =    array(
					'Table'	=>	'tempcuration',
					'Fields'=>	array(
							'curationstatus'	=>	CS_APPROVED,
							'approvedby'		=>	$approvedby,
							'qualityrating'		=>	$pub_data['quality_rate'],
							'metadatarating'	=>	$pub_data['meta_rate'],
							'topicsrating'		=>	$pub_data['topic_rate'],
							'reviewissue'		=>	'',
							'version'			=>	$version
					),
					'clause'=>"id=".$id_for_approve
			);
			
			$d_data_language    =    array(
					'Table'	=>	'language',
					'Fields'=>	array(
							'status'=>LS_VERIFIED
					),
					'clause'=>"id=". $read_data[0]['language']
			);
			
			$d_data_category    =    array(
					'Table'	=>'categoryinfo',
					'Fields'=>array(
							'status'=>CATS_VERIFIED,
                            'anchorVideoId'=>$read_data[0]['category']
					),
					'clause'=>"catId=". $read_data[0]['category']
			);
						
			if($read_data_contentinfo	&&	is_array($read_data_contentinfo))
			{
				$query_update_contentinfo			=    array(
						'Table'	=>	'contentinfo',
						'Fields'=>	array(
								'url'					=>	$read_data[0]['url'],
								'approvedby'			=>	$approvedby,
								'tnurl'					=>	$read_data[0]['tnurl'],
								'videoid'				=>	$read_data[0]['videoid'],
								'topicinfo'				=>	$read_data[0]['topicinfo'],
								'`string`'				=>	$read_data[0]['title'],
								'description'			=>	$read_data[0]['description'],
								'curatedby'				=>	$read_data[0]['curatedby'],
								'curatorName'			=>	$read_data[0]['curatorName'],
								'category'				=>	$read_data[0]['category'],
								'language'				=>	$read_data[0]['language'],
								'keywords'				=>	$read_data[0]['tags'],
								'itemused'				=>	$read_data[0]['itemused'],
								'numoflikes'    		=>  $read_data[0]['numoflikes'],
								'numofviews'    		=>  $read_data[0]['numofviews'],
								'agegroup'				=>	$read_data[0]['agegroup'],
								'topicforcrawl'			=>	$read_data[0]['topicforcrawl'],
								'curationlinks' 		=>  $read_data[0]['curationlinks'],
								'pubdate'				=>	date('Y-m-d H:i:s',time()),
								'originalkeywords'		=>	$read_data[0]['originalkeywords'],/* $read_data[0]['originalkeywords'] */
								'originaldescription'	=>	$read_data[0]['originaldescription'],
								'originaltitle'			=>	$read_data[0]['originaltitle'],
								'category_breadcrumb'	=>	$read_data[0]['category_breadcrumb'],
								'version'				=>	$version,
								'channel_name'			=>	$read_data[0]['channel_name']
						),
						'clause'=>	"id=".$read_data_contentinfo[0]['id']
				);
				$query_insert	=	false;
			}
			
			else
			{
				$query_insert    =    array(
					'Table'=>'contentinfo',
					'Fields'=>array(
							'url'					=>	$read_data[0]['url'],
							'approvedby'			=>	$approvedby,
							'tnurl'					=>	$read_data[0]['tnurl'],
							'videoid'				=>	$read_data[0]['videoid'],
							'topicinfo'				=>	$read_data[0]['topicinfo'],
							'`string`'				=>	$read_data[0]['title'],
							'description'			=>	$read_data[0]['description'],
							'curatedby'				=>	$read_data[0]['curatedby'],
							'curatorName'			=>	$read_data[0]['curatorName'],
							'category'				=>	$read_data[0]['category'],
							'language'				=>	$read_data[0]['language'],
							'keywords'				=>	$read_data[0]['tags'],
							'itemused'				=>	$read_data[0]['itemused'],
							'agegroup'				=>	$read_data[0]['agegroup'],
                            'numoflikes'    		=>  $read_data[0]['numoflikes'],
                            'numofviews'    		=>  $read_data[0]['numofviews'],
							'topicforcrawl'			=>	$read_data[0]['topicforcrawl'],
                            'curationlinks' 		=>  $read_data[0]['curationlinks'],
							'pubdate'				=>	date('Y-m-d H:i:s',time()),
							'originalkeywords'		=>	$read_data[0]['keywords'],
							'originaldescription'	=>	$read_data[0]['originaldescription'],
							'originaltitle'			=>	$read_data[0]['originaltitle'],
							'category_breadcrumb'	=>	$read_data[0]['category_breadcrumb'],
							'version'				=>	$version,
							'channel_name'			=>	$read_data[0]['channel_name']
					)
				);
				$query_update_contentinfo	=	false;
			}
			
			$query_update_recom    =    array(
					'Table'	=>	'tempcuration',
					'Fields'=>	array(
							'curationstatus'	=>	CS_PROCESSED		
					),
					'clause'=>"videoid='".$read_data[0]['videoid']."' && curationstatus='".CS_RECOMMEND."'"
			);
			
			if($query_update_contentinfo)
			{
				if(!(DB_Update($query_update_contentinfo)	&&	DB_Update($query_update)	&&	DB_Update($query_update_recom)	&&	DB_Update($d_data_language)	&&	DB_Update($d_data_category)))
				{
					$output['status']	=	false;
					$output['error']	=	"review_curation_error3";	//An error has occured
				}
				
			}
			else
			{
				if(!(DB_Insert($query_insert)	&&	DB_Update($query_update)	&&	DB_Update($query_update_recom)	&&	DB_Update($d_data_language)	&&	DB_Update($d_data_category)))
				{
					$output['status']	=	false;
					$output['error']	=	"review_curation_error3";	//An error has occured
				}
			}
		 
            include __DIR__.'./../createCategoryStructure.php';
            
		}
		
		return $output;
	}
	
	function review_reviewer_issue($issue_data)
	{
		/* if($review_curation_config['usertype']	!=	UT_REVIEWER)
		{
			$output	=	array(
					'status'			=>	false,
					'error'				=>	"review_curation_error3",
					'error_description'	=>	'review curation permission violation'.'at line no. '.__LINE__.' at file '.__FILE__." content: usertype:".$review_curation_config['usertype']." user:".$review_curation_config['userid']
			);
		} */
		/* else
		{ */
			$output['status']	=	true;
			$id_for_approve		=	$issue_data['id'];
			$issueby			=	$issue_data['userid'];
			$query_read			=	array(
					'Fields'=>'curationstatus',
					'Table'	=>'tempcuration',
					'clause'=>"id=". $id_for_approve
			);
			$read_data    	=	DB_Read($query_read);
		
			if(!$read_data) /* || $read_data[0]['curationstatus']	==	CS_APPROVED */
			{
				$output['status']	=	false;
				$output['error']	=	"review_curation_error2"; //already approved
			}
			else if(!is_numeric($id_for_approve))
			{
				$output['status']	=	false;
				$output['error']	=	"review_curation_error3";
			}
			else
			{
				$issue_data		=	$issue_data['issue'];
				$query_update	=	"update tempcuration set curationstatus=".CS_PENDING.",reviewedby='$issueby',reviewissue=concat_ws(',',reviewissue,'".$issue_data."') where id=".$id_for_approve;
				$update_status	=	DB_Query($query_update,"result","");
				if(!$update_status)
				{
					$output['status']	=	false;
					$output['error']	=	"review_curation_error3"; //an error has occured
				}
			}
		/* } */
		return $output;
	}
	
	function review_moderator_reject($reject_data)
	{
		/* if($review_curation_config['usertype']	!=	UT_MODERATOR)
		{
			$output	=	array(
					'status'			=>	false,
					'error'				=>	"review_curation_error3",
					'error_description'	=>	'review curation permission violation at line no. '.__LINE__.' at file '.__FILE__.' content: usertype:'.$review_curation_config['usertype'].' user:'.$review_curation_config['userid']
			);
		}
		else
		{ */
			$output['status']	=	true;
			$id_for_reject		=	$reject_data['id'];
			$query_read			=	array(
					'Fields'=>'*',
					'Table'	=>'tempcuration',
					'clause'=>"id=". $id_for_reject
			);
			$read_data    	=	DB_Read($query_read);
		
			if(!$read_data)/* || $read_data[0]['curationstatus']	==	CS_APPROVED */
			{
				$output['status']	=	false;
				$output['error']	=	"review_curation_error2"; 
			}
			else if(!is_numeric($id_for_reject))
			{
				$output['status']	=	false;
				$output['error']	=	"review_curation_error3";
			}
			else
			{
				$reject_data		=	$reject_data['issue'];
				$query_update		=	"update tempcuration set curationstatus=".CS_REJECTED.",qualityrating=0,metadatarating=0,topicsrating=0,reviewissue=concat_ws(',',reviewissue,'".$reject_data."') where id=".$id_for_reject;
				$update_status		=	DB_Query($query_update,"result","");
				$delete_status		=	true;
				
				/* $read_contentinfo	=	array(
						'Fields'=>'*',
						'Table'	=>'contentinfo',
						'clause'=>"videoid='".$read_data[0]['videoid']."' && curatedby='".$read_data[0]['curatedby']."'"
				);
				$contentinfo_data  	=	DB_Read($read_contentinfo);

				if($contentinfo_data)
				{
					$contentinfo_delete	=	array(
						'Table'	=>'contentinfo',
						'clause'=>"videoid='".$read_data[0]['videoid']."' && curatedby='".$read_data[0]['curatedby']."'"
					);
					
					$delete_status	=	DB_Delete($contentinfo_delete);
				}
				else
				{
					$delete_status	=	true;
				}
 */
				if(!$update_status	||	!$delete_status)
				{
					$output['status']	=	false;
					$output['error']	=	"review_curation_error3"; //an error has occured
				}
			}
		/* } */
		return $output;
	}
	
	function review_moderator_issue($issue_data)
	{
		/* if($review_curation_config['usertype']	!=	UT_MODERATOR)
		{
			$output	=	array(
					'status'			=>	false,
					'error'				=>	"review_curation_error3",
					'error_description'	=>	'review curation permission violation'.'at line no. '.__LINE__.' at file '.__FILE__." content: usertype:".$review_curation_config['usertype']." user:".$review_curation_config['userid']
			);
		}
		else
		{ */
			$output['status']	=	true;
			if(	is_numeric($issue_data['id'])	)
			{
				$id_for_approve_change_data	=	$issue_data['id'];
				$query_read					=	array(
						'Fields'=>	'*',
						'Table'	=>	'tempcuration',
						'clause'=>	"id=". $id_for_approve_change_data
				);
				$read_data					=	DB_Read($query_read);
				
				$query_read_contentinfo		=	array(
						'Fields'=>	'*',
						'Table'	=>	'contentinfo',
						'clause'=>	"videoid='".$read_data[0]['videoid']."' && curatedby='".$read_data[0]['curatedby']."'"
				);
				$read_data_contentinfo		=	DB_Read($query_read_contentinfo);				
		
				if($read_data	&&	$read_data[0]['curationstatus']	==	CS_APPROVED)
				{
					$output['status']	=	false; // already approved
					$output['error']	=	"review_curation_error2";
				}
				else
				{
					$changed_language		=	$issue_data['language'];
					$changed_other_language	=	$issue_data['other_language'];
					$changed_category		=	$issue_data['category'];
					$changed_other_category	=	$issue_data['other_category'];
					
					if(($changed_language	==	"other_language"	&&	$changed_other_language	==	"")	||	($changed_category	==	"other_category"	&&	$changed_other_category	==	""))
					{
						$output['status']	=	false;
						$output['error']	=	"review_curation_error4";	//other/suggested language and/or suggested catef=gry is not passed when language and/or categoryis "other"
					}
					else
					{
						if($changed_language	==	"other_language"	&&	$changed_other_language	!=	"")
						{
							$query_language	=    array('Fields'=>'*','Table'=>'language','clause'=>"language='". $changed_other_language."'");
							$read_language	=    DB_Read($query_language);
							if(!$read_language)
							{
								$d_data_language    =    array(
										'Table'	=>	'language',
										'Fields'=>	array(
												'language'		=>	$changed_other_language,
												'userId'		=>	$issue_data['userid'],
												'creationTime'	=>	date('Y-m-d H:i:s',time()),
												'status'		=>	LS_VERIFIED
										)
								);
								$changed_language	=	DB_Insert($d_data_language);
							}
							
							else 
							{
								if(isset($read_language)	&&	is_array($read_language)	&&	$read_language[0]['status']	!=	LS_VERIFIED)
								{
									//update
									$d_data_language    =    array( 
											'Table'	=>	'language',
											'Fields'=>	array(
													'status'=>LS_VERIFIED
											),
											'clause'=>"id=".$read_language[0]['id']);
									DB_Update($d_data_language);
									$changed_language	=	$read_language[0]['id'];
								}
							}
						}
						
						if($changed_other_category)
						{
							$query_category	=	array('Fields'=>'*','Table'=>'categoryinfo',"clause"=>"catName='". $changed_other_category."'");
							$read_category	=   DB_Read($query_category);
							if(!$read_category)
							{
								$d_data_category    =    array(
										'Table'	=>	'categoryinfo',
										'Fields'=>	array(
												'catName'		=>	$changed_other_category,
												'userId'		=>	$issue_data['userid'],
												'creationTime'	=>	date('Y-m-d H:i:s',time()),
												'status'		=>	CATS_VERIFIED,
												'parentCat'		=>	$changed_category
										)
								);
								$changed_category	=	DB_Insert($d_data_category);
								
								$d_data_update_category    =    array(
										'Table'	=>	'categoryinfo',
										'Fields'=>	array(
												'anchorVideoId'		=>	$changed_category
										),
										'clause'	=>	"catId='".$changed_category."'"
								);
									
								DB_Update($d_data_update_category);
							}
							
							else
							{
								if(isset($read_category)	&&	is_array($read_category)	&&	$read_category[0]['status']	!=	CATS_VERIFIED)
								{
									//update
									$d_data_category    =    array(
											'Table'	=>	'categoryinfo',
											'Fields'=>	array(
													'status'		=>	CATS_VERIFIED,
													'anchorVideoId'	=>	$read_category[0]['catId']
											),
											'clause'=>"catId=". $read_category[0]['catId']
									);
									DB_Update($d_data_category);
									$changed_category	=	$read_category[0]['catId'];
								}
							}
						}
										
						$changed_content_json	=	json_decode($issue_data['content_json'],true);
						$changed_title			=	$issue_data['title'];
						$changed_description	=	$issue_data['description'];
				
						$changed_age			=	$issue_data['age'];
						$changed_keywords		=	$issue_data['keywords'];
						$changed_tags			=	$issue_data['tags'];
						$cat_bread				=	$issue_data['cat_bread'];
						$changed_items			=	$issue_data['items'];
						
						$version				=	$this->curation_version($read_data[0]['version'],$issue_data['version']);
						$topic_for_crawl		=	"";
						$length_topics			=	count($changed_content_json['topic_info']);
						$approvedby				=	$issue_data['userid'];
						for($i=0;	$i<$length_topics;	$i++)
						{
							if($i+1	!=	$length_topics)
							{
								$topic_for_crawl	.=	$changed_content_json['topic_info'][$i]['topic'].",";
							}
							else
							{
								$topic_for_crawl	.=	$changed_content_json['topic_info'][$i]['topic'];
							}
						}
						 	
						$query_update			=    array(
								'Table'	=>	'tempcuration',
								'Fields'=>	array(
										'curationstatus'		=>	CS_APPROVED,
										'title'					=>	$changed_title,
										'description'			=>	$changed_description,
										'category'				=>	$changed_category,
										'language'				=>	$changed_language,
										'keywords'				=>	$changed_tags,
										'itemused'				=>	$changed_items,
										'agegroup'				=>	$changed_age,
										'topicforcrawl'			=>	$topic_for_crawl,
										'curationlinks' 		=>  $issue_data['links'],
										'publisheddate'			=>	date('Y-m-d H:i:s',time()),
										'originalkeywords'		=>	$changed_keywords,
										'category_breadcrumb'	=>	$cat_bread,
										'approvedby'			=>	$issue_data['userid'],
										'qualityrating'			=>	$issue_data['quality_rate'],
										'metadatarating'		=>	$issue_data['meta_rate'],
										'topicsrating'			=>	$issue_data['topic_rate'],
										'reviewissue'			=>	'',
										'version'				=>	$version
								),
								'clause'=>"id=".$id_for_approve_change_data
						);
						
						if($read_data_contentinfo	&&	is_array($read_data_contentinfo))
						{
							$query_update_contentinfo			=    array(
									'Table'	=>	'contentinfo',
									'Fields'=>	array(
											'url'					=>	$read_data[0]['url'],
											'approvedby'			=>	$issue_data['userid'],
											'tnurl'					=>	$read_data[0]['tnurl'],
											'videoid'				=>	$read_data[0]['videoid'],
											'topicinfo'				=>	json_encode($changed_content_json),
											'`string`'				=>	$changed_title,
											'description'			=>	$changed_description,
											'curatedby'				=>	$read_data[0]['curatedby'],
											'curatorName'			=>	$read_data[0]['curatorName'],
											'category'				=>	$changed_category,
											'language'				=>	$changed_language,
											'keywords'				=>	$changed_tags,
											'itemused'				=>	$changed_items,
											'numoflikes'    		=>  $read_data[0]['numoflikes'],
											'numofviews'    		=>  $read_data[0]['numofviews'],
											'agegroup'				=>	$changed_age,
											'topicforcrawl'			=>	$topic_for_crawl,
											'curationlinks' 		=>  $issue_data['links'],
											'pubDate'				=>	date('Y-m-d H:i:s',time()),
											'originalkeywords'		=>	$changed_keywords,/* $read_data[0]['originalkeywords'] */
											'originaldescription'	=>	$read_data[0]['originaldescription'],
											'originaltitle'			=>	$read_data[0]['originaltitle'],
											'category_breadcrumb'	=>	$cat_bread,
											'version'				=>	$version,
											'channel_name'			=>	$read_data[0]['channel_name']
									),
									'clause'=>	"id=".$read_data_contentinfo[0]['id']
							);
							$query_insert	=	false;
						}
						
						else
						{
							$query_insert			=    array(
									'Table'	=>'contentinfo',
									'Fields'=>array(
											'url'					=>	$read_data[0]['url'],
											'approvedby'			=>	$issue_data['userid'],
											'tnurl'					=>	$read_data[0]['tnurl'],
											'videoid'				=>	$read_data[0]['videoid'],
											'topicinfo'				=>	json_encode($changed_content_json),
											'`string`'				=>	$changed_title,
											'description'			=>	$changed_description,
											'curatedby'				=>	$read_data[0]['curatedby'],
											'curatorName'			=>	$read_data[0]['curatorName'],
											'category'				=>	$changed_category,
											'language'				=>	$changed_language,
											'keywords'				=>	$changed_tags,
											'itemused'				=>	$changed_items,
	                                        'numoflikes'    		=>  $read_data[0]['numoflikes'],
	                                        'numofviews'    		=>  $read_data[0]['numofviews'],
											'agegroup'				=>	$changed_age,
											'topicforcrawl'			=>	$topic_for_crawl,
	                                        'curationlinks' 		=>  $issue_data['links'],
											'pubdate'				=>	date('Y-m-d H:i:s',time()),
											'originalkeywords'		=>	$changed_keywords,/* $read_data[0]['originalkeywords'] */
											'originaldescription'	=>	$read_data[0]['originaldescription'],
											'originaltitle'			=>	$read_data[0]['originaltitle'],
											'category_breadcrumb'	=>	$cat_bread,
											'version'				=>	$version,
											'channel_name'			=>	$read_data[0]['channel_name']
									)
							);
							$query_update_contentinfo	=	false;
						}
												
						$query_update_recom    =    array(
								'Table'	=>	'tempcuration',
								'Fields'=>	array(
										'curationstatus'=>CS_PROCESSED
								),
								'clause'=>"videoid='".$read_data[0]['videoid']."' && curationstatus='".CS_RECOMMEND."'"
						);
						if($query_update_contentinfo)
						{
							if(!DB_Update($query_update_contentinfo)	||	!DB_Update($query_update)	||	!DB_Update($query_update_recom))
							{
								$output['status']	=	false;
								$outuput['error']	=	"review_curation_error3";//an error has occured
							}
						}
						else
						{
							if(!DB_Insert($query_insert)	||	!DB_Update($query_update)	||	!DB_Update($query_update_recom))
							{
								$output['status']	=	false;
								$outuput['error']	=	"review_curation_error3";//an error has occured
							}	
						}
					}
				}
			}
			else
			{
				$output['status']	=	false;
				$output['error']	=	"review_curation_error4";//an error has occured
			}
			include __DIR__.'./../createCategoryStructure.php';
		/* } */
		return $output;
	}
	
	function review_category_move($move_data)
	{
		/* if($review_curation_config['usertype']	!=	UT_MODERATOR)
			{
			$output	=	array(
			'status'			=>	false,
			'error'				=>	"review_curation_error3",
			'error_description'	=>	'review curation permission violation at line no. '.__LINE__.' at file '.__FILE__.' content: usertype:'.$review_curation_config['usertype'].' user:'.$review_curation_config['userid']
			);
			}
			else
			{ */
		$output['status']	=	true;
		$ids_for_move		=	$move_data['id'];
		$category_to_move	=	$move_data['category'];
		$category_breadcrumb	=	$move_data['category_breadcrumb'];
		
		$ids_string_for_move	=	implode(",",$ids_for_move);
		$query_read			=	array(
				'Fields'=>'*',
				'Table'	=>'tempcuration',
				'clause'=>"id in(".$ids_string_for_move.")"
		);
		$read_data    	=	DB_Read($query_read);
		
		if(!$read_data)/* || $read_data[0]['curationstatus']	==	CS_APPROVED */
		{
			$output['status']	=	false;
			$output['error']	=	"review_curation_error2";
		}
		else
		{
			for($i=0;$i<count($read_data);$i++)
			{
				if($read_data[$i]['curationstatus']	!=	CS_APPROVED)
				{
					$output['status']	=	false;
					$output['error']	=	"review_curation_error2";
				}
			}
			
			if($output['status'])
			{
				for($i=0;$i<count($read_data);$i++)
				{
					$query_update_contentinfo			=    array(
							'Table'	=>	'contentinfo',
							'Fields'=>	array(
									'category'				=>	$category_to_move,
									'category_breadcrumb'	=>	$category_breadcrumb
							),
							'clause'=>	"videoid='".$read_data[$i]['videoid']."' && curatedby='".$read_data[$i]['curatedby']."'"
					);
					DB_Update($query_update_contentinfo);
					
					$query_update_tempcuration			=    array(
							'Table'	=>	'tempcuration',
							'Fields'=>	array(
									'category'				=>	$category_to_move,
									'category_breadcrumb'	=>	$category_breadcrumb
							),
							'clause'=>	"videoid='".$read_data[$i]['videoid']."' && curatedby='".$read_data[$i]['curatedby']."'"
					);
					DB_Update($query_update_tempcuration);
					

					$d_data_update_category    =    array(
							'Table'	=>	'categoryinfo',
							'Fields'=>	array(
									'status'		=>	CATS_VERIFIED
							),
							'clause'	=>	"catId='".$category_to_move."'"
					);
						
					DB_Update($d_data_update_category);
				}
			}
		}
		return $output;
	}
	function review_category_delete($delete_data)
	{
		/* if($review_curation_config['usertype']	!=	UT_MODERATOR)
		 {
		 $output	=	array(
		 'status'			=>	false,
		 'error'				=>	"review_curation_error3",
		 'error_description'	=>	'review curation permission violation at line no. '.__LINE__.' at file '.__FILE__.' content: usertype:'.$review_curation_config['usertype'].' user:'.$review_curation_config['userid']
		 );
		 }
		 else
		 { */
		$dependency						=	false;
		$output['status']				=	true;
		$original_category_to_delete	=	$delete_data['category'];
		$category_to_delete				=	$delete_data['category'];
		
		$temp_categories_to_delete		=	[];
		array_push($temp_categories_to_delete,$category_to_delete);
		
		while (true)
		{
			$query_read_temp			=	array(
					'Fields'=>'*',
					'Table'	=>'contentinfo',
					'clause'=>"category in (".$category_to_delete.") && contentstatus='".CONS_APPROVED."'"
			);
			$read_data_temp    	=	DB_Read($query_read_temp);
		
			$query_read_contentinfo			=	array(
					'Fields'=>'*',
					'Table'	=>'tempcuration',
					'clause'=>"category='".$category_to_delete."' && curationstatus='".CS_APPROVED."'"
			);
			$read_data_contentinfo    	=	DB_Read($query_read_contentinfo);
			
			if(!$dependency	&&	!$read_data_temp	&&	!$read_data_contentinfo)
			{
				$query_read_category		=	array(
						'Fields'=>'*',
						'Table'	=>'categoryinfo',
						'clause'=>"parentCat in (".$category_to_delete.")"
				);
				$read_data_category		   	=	DB_Read($query_read_category,'ASSOC','','catId');
				
				if($read_data_category)
				{
					$temp_array_key	=	[];	
					foreach($read_data_category as $key => $value)
					{
						array_push($temp_array_key,$key);
						array_push($temp_categories_to_delete,$key);
					}
					$category_to_delete			=	implode(",",$temp_array_key);
				}
				else
				{
					break;
				}	
			}
			else
			{
				$dependency	=	true;
				break;
			}
		}
		
		if(!$dependency)
		{
			$temp_categories_to_delete			=	implode(",",$temp_categories_to_delete);
			$query_update_contentinfo			=    array(
					'Table'	=>	'categoryinfo',
					'Fields'=>	array(
							'status'			=>	CATS_DELETED
					),
					'clause'=>	"catId in(".$temp_categories_to_delete.")"
			);
			DB_Update($query_update_contentinfo);
			include __DIR__.'./../createCategoryStructure.php';
		}
		
		else
		{
			$output['status']	=	false;
			$output['error']	=	"review_curation_error2";
		}	
		return $output;
	}
	function review_delete_content($delete_data)
	{
		/* if($review_curation_config['usertype']	!=	UT_MODERATOR)
		 {
		 $output	=	array(
		 'status'			=>	false,
		 'error'				=>	"review_curation_error3",
		 'error_description'	=>	'review curation permission violation at line no. '.__LINE__.' at file '.__FILE__.' content: usertype:'.$review_curation_config['usertype'].' user:'.$review_curation_config['userid']
		 );
		 }
		 else
		 { */
		$output['status']				=	true;
		$output['data']					=	$delete_data;
		$content_to_delete				=	$delete_data['id'];
		$ids_string_for_delete			=	implode(",",$content_to_delete);
		$temp_array_of_ids_in_contentinfo	=	[];
			
		$query_read_temp			=	array(
					'Fields'=>'*',
					'Table'	=>'tempcuration',
					'clause'=>"id in (".$ids_string_for_delete.")"
			);
		$read_data_temp    	=	DB_Read($query_read_temp);
		
		$query_update_tempcuration			=    array(
				'Table'	=>	'tempcuration',
				'Fields'=>	array(
						'curationstatus'			=>	CS_DELETED
				),
				'clause'=>	"id in(".$ids_string_for_delete.")"
		);
		DB_Update($query_update_tempcuration);
	
		for($i=0;$i<count($read_data_temp);$i++)
		{
			$query_update_contentinfo		=    array(
				'Table'	=>	'contentinfo',
				'Fields'=>	array(
						'contentstatus'			=>	CONS_DELETED
				),
				'clause'=>	"videoid='".$read_data_temp[$i]['videoid']."' && curatedby='".$read_data_temp[$i]['curatedby']."'"
			);
			DB_Update($query_update_contentinfo);
			
			$query_read_content			=	array(
					'Fields'=>'*',
					'Table'	=>'contentinfo',
					'clause'=>	"videoid='".$read_data_temp[$i]['videoid']."' && curatedby='".$read_data_temp[$i]['curatedby']."'"
			);
			$read_data_content    	=	DB_Read($query_read_content);
			array_push($temp_array_of_ids_in_contentinfo,$read_data_content[0]['id']);
		}
		$output['data']['id']	=	$temp_array_of_ids_in_contentinfo;
		
		return $output;
	}
	
	function review_language_delete($delete_data)
	{
		/* if($review_curation_config['usertype']	!=	UT_MODERATOR)
		 {
		 $output	=	array(
		 'status'			=>	false,
		 'error'				=>	"review_curation_error3",
		 'error_description'	=>	'review curation permission violation at line no. '.__LINE__.' at file '.__FILE__.' content: usertype:'.$review_curation_config['usertype'].' user:'.$review_curation_config['userid']
		 );
		 }
		 else
		 { */
		$output['status']	=	true;
		$language_to_delete	=	$delete_data['language'];
	
		$query_read_temp			=	array(
				'Fields'=>'*',
				'Table'	=>'tempcuration',
				'clause'=>"language='".$language_to_delete."'"
		);
		$read_data_temp    	=	DB_Read($query_read_temp);
	
		$query_read_contentinfo			=	array(
				'Fields'=>'*',
				'Table'	=>'contentinfo',
				'clause'=>"language='".$language_to_delete."'"
		);
		$read_data_contentinfo    	=	DB_Read($query_read_contentinfo);
				
		if(!$read_data_temp	&&	!$read_data_contentinfo)
		{
			$query_update_language	=	array(
					'Table'	=>	'language',
					'Fields'=>	array(
							'status'	=>	LS_DELETED
					),
					'clause'=>"id='".$language_to_delete."'"
			);
			$update_data_language	   	=	DB_Update($query_update_language);
		}
		else
		{
			$output['status']	=	false;
			$output['error']	=	"review_curation_error2";
		}
		return $output;
	}
};