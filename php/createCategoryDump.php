<?php
require_once __DIR__.'./../require.php';
require_once __DIR__.'./../../Common/php/commonfunctions.php';
require_once __DIR__.'/contentSearchClass.php';
require_once __DIR__.'/appRequestClass.php';
require_once __DIR__.'/im.php';

$category_object	=	array(
		'Fields'=>	'catId,catName,status',
		'Table'	=>	'category_book',
		'clause'=>	'productType='.P_BOOK
);
$category_data	=	DB_Read($category_object,'ASSOC','catId');

file_put_contents(__DIR__."/categoryBookDump.php", json_encode($category_data));

$category_object	=	array(
		'Fields'=>	'catId,catName,status',
		'Table'	=>	'category_book',
		'clause'=>	'productType='.P_MAGAZINE
);
$category_data	=	DB_Read($category_object,'ASSOC','catId');

file_put_contents(__DIR__."/categoryMagazineDump.php", json_encode($category_data));
?>