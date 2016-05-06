<?php
require_once __DIR__.'./../require.php';

$read_data	=	DB_Read(array(
		'Table'=>'tempcuration',
		'Fields'=>'*'
),'ASSOC','');

for($i=0;$i<count($read_data);$i++)
{
	$metaInfoUrl			=	"https://www.googleapis.com/youtube/v3/videos?key=".sso_gc_server_key."&id=".$read_data[$i]['videoid'];
	$videoMetadata 			=	json_decode(file_get_contents($metaInfoUrl."&part=snippet%2CcontentDetails%2Cstatistics"),true); 

	$original_description	=	$videoMetadata['items'][0]['snippet']['description'];
	$original_title			=	$videoMetadata['items'][0]['snippet']['title'];
	$original_keyword		=	implode(",",$videoMetadata['items'][0]['snippet']['tags']);
	$videoID	=	$read_data[$i]['videoid'];
	
	$status	=	DB_Update(array(
			'Table'=>'tempcuration',
			'Fields'=>array(
					'originaldescription'=>$original_description,
					'originalkeywords'=>$original_keyword,
					'originaltitle'=>$original_title
			),
			'clause'=>"videoid='$videoID'"
	));
}

$read_data	=	DB_Read(array(
		'Table'=>'contentinfo',
		'Fields'=>'*'
),'ASSOC','');

for($i=0;$i<count($read_data);$i++)
{
	$metaInfoUrl			=	"https://www.googleapis.com/youtube/v3/videos?key=".sso_gc_server_key."&id=".$read_data[$i]['videoid'];
	$videoMetadata 			=	json_decode(file_get_contents($metaInfoUrl."&part=snippet%2CcontentDetails%2Cstatistics"),true);

	$original_description	=	$videoMetadata['items'][0]['snippet']['description'];
	$original_keyword		=	implode(",",$videoMetadata['items'][0]['snippet']['tags']);
	$videoID	=	$read_data[$i]['videoid'];

	$status	=	DB_Update(array(
			'Table'=>'contentinfo',
			'Fields'=>array(
					'originaldescription'=>$original_description,
					'originalkeywords'=>$original_keyword
			),
			'clause'=>"videoid='$videoID'"
	));
}
?>