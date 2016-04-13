<?php 
require_once __DIR__.'./../require.php';
require_once __DIR__.'./../../Common/php/commonfunctions.php';
require_once __DIR__.'./../../Common/php/openSearchServerAPI.php';
require_once __DIR__.'/verify_ott.php';
require_once __DIR__.'/contentSearchClass.php';
require_once __DIR__.'/appRequestClass.php';
require_once __DIR__.'./../bookmarks/bookmark.php';
require_once __DIR__.'./../curation/curation.php';
require_once __DIR__.'./../recommend/recommend.php';
require_once __DIR__.'./../review_curation/review_curation.php';
require_once __DIR__.'./../user_profile/user_profile.php';

$d_tempcuration     =	array(
		'Fields'=>	'*',
		'Table'	=>	'tempcuration',
);

$read_tempcuration    =    DB_Read($d_tempcuration);
for($i=0;$i<count($read_tempcuration);$i++)
{
	$metaInfoUrl	=	"https://www.googleapis.com/youtube/v3/videos?key=".sso_gc_server_key."&id=".$read_tempcuration[$i]['videoid'];
	$videoMetadata	=	json_decode(file_get_contents($metaInfoUrl."&part=snippet%2CcontentDetails%2Cstatistics"),true);
	$channel_id	=	$videoMetadata['items'][0]['snippet']['channelId'];
	
	$metaInfoUrl1	=	"https://www.googleapis.com/youtube/v3/channels?key=".sso_gc_server_key."&id=".$channel_id;
	$videoMetadata1	=	json_decode(file_get_contents($metaInfoUrl1."&part=snippet%2CcontentDetails%2Cstatistics"),true);
	$channle_name	=	$videoMetadata1['items'][0]['snippet']['title'];
	
	$update_channel 	=   array(
			'Table'	=>	'tempcuration',
			'Fields'=>	array(
					'channel_name'	=>	$channle_name
			),
			'clause'=>	"videoid='".$read_tempcuration[$i]['videoid']."'"
	);
	DB_Update($update_channel);
	
	$update_cat 	=   array(
			'Table'	=>	'contentinfo',
			'Fields'=>	array(
					'channel_name'	=>	$channle_name
			),
			'clause'=>	"videoid='".$read_tempcuration[$i]['videoid']."'"
	);
	DB_Update($update_cat);
}