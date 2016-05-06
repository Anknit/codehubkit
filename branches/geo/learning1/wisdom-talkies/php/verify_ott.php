<?php
require_once __DIR__.'./../require.php';

function ott_verification($data)
{
	if(!empty($data['ott']))
		$t	=	$data['ott'];
	
		
	if($t	!=	""	||	$t	==	true){
		$ott	=	$t;
		$ott_query    =    array(
			'Fields'	=>	'*',
			'Table'		=>	'userinfo',
			'clause'	=>	"sso_ott='$ott'"
		);
		$d_data    =    DB_Read($ott_query);
	
		if(is_array($d_data)	&&	count($d_data)	==	1)	{
			
			if(!empty($data['user_login_source']))
				$login_source	=	$data['user_login_source'];
			else	
				$login_source	=	NULL;
				
			$s_data    =    array(
				'uid'		=>	$d_data[0]['userid'],
				'usertype'	=>	$d_data[0]['usertype'],
				'is_login'	=>	true,
				'username'	=>	$d_data[0]['username'],
				'emailid'	=>	$d_data[0]['emailid'],
				'user_login_source'	=>	$login_source
			);
			
			
			session_manager_set($s_data, '');
			$remove_ott    =    array(
				'Table'	=>	'userinfo',
				'Fields'=>	array(
					'sso_ott'	=>	""
				),
				'clause'=>	"sso_ott='$ott'"
			);
			DB_Update($remove_ott);
			return true;
		}
		return false;
	}
	return false;
}
?>