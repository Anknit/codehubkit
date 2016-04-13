<?php
require_once __DIR__.'./../require.php';
require_once __DIR__.'./../../Common/php/commonfunctions.php';
require_once __DIR__.'./../../Common/php/openSearchServerAPI.php';
require_once __DIR__.'/verify_ott.php';
require_once __DIR__.'/contentSearchClass.php';
require_once __DIR__.'/appRequestClass.php';
require_once __DIR__.'./../bookmarks/bookmark.php';
require_once __DIR__.'./../curation/curation.php';
require_once __DIR__.'./../review_curation/review_curation.php';
require_once __DIR__.'./../user_profile/user_profile.php';

$d_tempcuration     =	array(
		'Fields'=>	'*',
		'Table'	=>	'tempcuration',
		'clause'=>	"curationstatus='4'"
);

$read_tempcuration    =    DB_Read($d_tempcuration);
$read_content	=	[];
$j=0;
for($i=0;$i<count($read_tempcuration);$i++)
{
	$d_content     =	array(
			'Fields'=>	'*',
			'Table'	=>	'contentinfo',
			'clause'=>	"videoid='".$read_tempcuration[$i]['videoid']."' && curatedby='".$read_tempcuration[$i]['curatedby']."'"
	);
	$read_content[$i]	=	DB_Read($d_content);
}

for($i=0;$i<count($read_content);$i++)
{
	$d_data_update    =    array(
			'Table'			=>	'tempcuration',
			'Fields'		=>	array(
					'topicinfo'				=>	$read_content[$i][0]['topicinfo'],
					'title'					=>	$read_content[$i][0]['string'],
					'description'			=>	$read_content[$i][0]['description'],
					'category'				=>	$read_content[$i][0]['category'],
					'language'				=>	$read_content[$i][0]['language'],
					'originalkeywords'		=>	$read_content[$i][0]['originalkeywords'],
					'keywords'				=>	$read_content[$i][0]['keywords'],
					'itemused'				=>	$read_content[$i][0]['itemused'],
					'agegroup'				=>	$read_content[$i][0]['agegroup'],
					'topicforcrawl'			=>	$read_content[$i][0]['topicforcrawl'],
					'category_breadcrumb'	=>	$read_content[$i][0]['category_breadcrumb'],
			),
			'clause'=>"videoid='".$read_content[$i][0]['videoid']."' && curatedby='".$read_content[$i][0]['curatedby']."'"
	);
	DB_Update($d_data_update);
}
?>
