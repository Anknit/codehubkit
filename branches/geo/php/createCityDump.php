<?php
require_once __DIR__.'./../require.php';
require_once __DIR__.'./../../Common/php/commonfunctions.php';
require_once __DIR__.'/contentSearchClass.php';
require_once __DIR__.'/appRequestClass.php';
require_once __DIR__.'/im.php';

$category_object	=	array(
		'Fields'=>	'cityId,cityName,status',
		'Table'	=>	'city'
);
$city_data	=	DB_Read($category_object,'ASSOC','cityId');

file_put_contents(__DIR__."/cityDump.php", json_encode($city_data));
?>