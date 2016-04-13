<?php 
require_once __DIR__.'./../definitions.php';

class _recommend
{
	public  $recommend_init_status	=	false;
	public  $recommend_init_error	=	'';
	
	public function _recommend($recommend_config	=	'')
	{
		global $Module;
		if(isset($Module['recommend'])	&&	$Module['recommend']	==	true)
		{
			$this->recommend_init_status	=	true;
		}
		else
		{
			$this->recommend_init_status	=	false;
		}
	}
	
	public function recommend($recom_data)
	{
		$output	=	array(
				'status'=>	true
		);
		$catid	=	$recom_data['catId'];
		$category_breadcrumb	=	$recom_data['category_breadcrumb'];
        
        require_once __DIR__ . '/../../Common/php/recaptcha/src/autoload.php';
        $recaptcha = new \ReCaptcha\ReCaptcha(recaptcha_secret);    
        $resp = $recaptcha->verify($recom_data['captcha'], $_SERVER['REMOTE_ADDR']);
        if (!$resp->isSuccess()){
			$output	=	array(
					'status'=>	false,
					'error'	=>	'recommend_error4'
			);
        }
/*

        
        
		if($recom_data['captcha']	!=	$recom_data['sess_captcha_code'])
		{
			$output	=	array(
					'status'=>	false,
					'error'	=>	'recommend_error4'
			);
		}
		
*/
		else if(!isset($recom_data['videoSource'],$recom_data['videoId'],$recom_data['recommendDesc'],$recom_data['catId'],$recom_data['title']))
		{
			$output	=	array(
					'status'=>	false,
					'error'	=>	'recommend_error3'
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
							'error'	=>	'recommend_error1'//insert failed
					);
				}
		}
		return $output;
	}
}
?>