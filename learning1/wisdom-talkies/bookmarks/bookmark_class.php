<?php
	class _bookmark
	{
		public  $bookmark_init_status	=	false;
		public  $bookmark_init_error	=	'';
	
		
		public function __construct($bookmark_config)
		{
			global $Module;
			if($Module['bookmark']	==	true)
			{
				$this->bookmark_init_status	=	true;
			}
			else
			{
				$this->bookmark_init_status	=	false;
			}
		}
		
		public function __destruct()
		{
		}
		
		public function bookmark_read($read_content)
		{
			$output['status']	=	true;
			if(isset($read_content['videoid']) && isset($read_content['userid']))
			{
				if($read_content['videoid']	==	'*' )
				{
					$start_index	=	0;
					$num			=	10;
					if(isset($read_content['start_index']))
					{
						$start_index	=	$read_content['start_index'];
					}	
					if(isset($read_content['num']))
					{
						$num	=	$read_content['num'];
					}
					$read_query_for_total_num_of_bookmark	=	DB_Read(array(
							'Table'	=>	'bookmark',
							'Fields'=>	'bookmarkid',
							'clause'=>	"userid='".$read_content['userid']."'"
					),'ASSOC','');
					$total_bookmark	=	count($read_query_for_total_num_of_bookmark);
					$read_query	=	array(
							'Table'	=>	'bookmark',
							'Fields'=>	'*',
							'clause'=>	"userid='".$read_content['userid']."'",
                            'order' =>  'modifieddate desc limit '.$start_index.','.$num
					);
				}
				else
				{
					$read_query_for_total_num_of_bookmark	=	DB_Read(array(
							'Table'	=>	'bookmark',
							'Fields'=>	'*',
							'clause'=>	"userid='".$read_content['userid']."'"
					),'ASSOC','');
					$total_bookmark	=	count($read_query_for_total_num_of_bookmark);
					
					$read_query	=	array(
							'Table'	=>	'bookmark',
							'Fields'=>	'*',
							'clause'=>	"userid='".$read_content['userid']."' && videoid='".$read_content['videoid']."'"
					);
				}
                $read_data	=	 DB_Read($read_query,'ASSOC','','videoid');
                if(!is_array($read_data))
                {
                    $output['status']	=	false;
                }
				else{
					$output['data']['documents']	=	$read_data;
					$output['data']['numFound']	=	$total_bookmark;
				}
			}
			else
			{
				$output['status']	=	false;
			}
			return $output;
		}
		
		public function bookmark_save($bookmark_content)
		{
			$output['status']	=	true;
			$read_data	=	$this->bookmark_read(array(
					'videoid'	=>	$bookmark_content['videoid'],
					'userid'	=>	$bookmark_content['userid'],
			));
			if($read_data['status'])
			{
				if(!isset($bookmark_content['topicinfo'],$bookmark_content['title'],$bookmark_content['metadata'])	
							||	($bookmark_content['topicinfo'])	==	null)
				{
					$output['status']	=	false;	
				}
				else
				{
					$update_data	=	array(
							'Table'	=>	'bookmark',
							'Fields'=>	array(
									'topicinfo'	=>	$bookmark_content['topicinfo'],
									'title'		=>	$bookmark_content['title'],
									'modifieddate' =>	'now()',
									'metadata'	=>	$bookmark_content['metadata']
							),
							'clause'=>	"userid='".$bookmark_content['userid']."' && videoid='".$bookmark_content['videoid']."'"
					);
					if(!DB_Update($update_data))
					{
						$output['status']	=	false;
					}
				}
			}
			else
			{		
				if(!isset($bookmark_content['topicinfo'],$bookmark_content['title'],$bookmark_content['metadata'],$bookmark_content['userid'],$bookmark_content['videoid'])
						||	($bookmark_content['topicinfo']&&$bookmark_content['userid']&&$bookmark_content['videoid'])	==	null)
				{
					$output['status']	=	false;
				}	
				else
				{
					$d_data    =    array(
							'Table'	=>	'bookmark',
							'Fields'=>	array(
									'userid'            =>	$bookmark_content['userid'],
									'videoid'           =>	$bookmark_content['videoid'],
									'sourcevideoid'     =>	$bookmark_content['sourcevideoid'],
									'topicinfo'	        =>	$bookmark_content['topicinfo'],
									'title'             =>	$bookmark_content['title'],
									'modifieddate'      =>	'now()',
									'metadata'          =>	$bookmark_content['metadata']
							)
					);
					if(!DB_Insert($d_data))
					{
						$output['status']	=	false;
					}
				}
			}
			return $output;
		}
	}