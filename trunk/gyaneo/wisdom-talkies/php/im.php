<?php
require_once __DIR__.'./../require.php';
require_once __DIR__.'./../../Common/php/commonfunctions.php';
require_once __DIR__.'./../../Common/php/openSearchServerAPI.php';
require_once __DIR__.'/verify_ott.php';
require_once __DIR__.'/contentSearchClass.php';
require_once __DIR__.'/appRequestClass.php';
require_once __DIR__.'./../user_profile/user_profile.php';
	
function insert_product($product){
	$insert_data	  =   array(
			'Table'	=>	'inventory',
			'Fields'=>	$product
	);
	if(!DB_Insert($insert_data)){
		return false;
	}
	else{
		return true;
	}
}

function update_product($product,$row_id_to_update){
	$update_data	  =   array(
			'Table'	=>	'inventory',
			'Fields'=>	$product,
			'clause'=>	"id=".$row_id_to_update." && owner=".$_SESSION['userid']
	);
	if(!DB_Update($update_data)){
		return false;
	}
	else{
		return true;
	}
}

function read_product($id_of_product_to_read){
	if($id_of_product_to_read	!=	null	&&	$id_of_product_to_read	!=	''	&&	is_int($id_of_product_to_read)){
		$read_object	= array(
				'Table'	=>	'inventory',
				'Fields'=>	'*',
				'clause'=>	"id=".$id_of_product_to_read." && owner='".$_SESSION['userid']."'"
		);
		$read_data	=	DB_Read($read_object);
	}
	else{
		$read_object	= array(
				'Table'	=>	'inventory',
				'Fields'=>	'*',
				'clause'=>	"owner='".$_SESSION['userid']."'"
		);
		$read_data	=	DB_Read($read_object);
	}
	if(!$read_data){
		return false;
	}
	else{
		return $read_data;
	}
	
}

if($_REQUEST['request']	==	"read_product"){
	$output	=	array();
	$data	=	read_product($_REQUEST['data']['id']);
	if($data){
		$output['status']	=	true;
		$output['data']		=	$data;
		echo $output;
		die();
	}
	else{
		$output['status']	=	false;
		echo $output;
		die();
	}
}
elseif($_REQUEST['request']	==	"add_product"){
	$output	=	array(
			'status'	=>	true
	);
	if(!isset($_REQUEST['data']['price'],$_REQUEST['data']['paperback'],
		$_REQUEST['data']['publisher'],$_REQUEST['data']['language'],$_REQUEST['data']['isbn_10'],$_REQUEST['data']['isbn_13'],
		$_REQUEST['data']['dimension'],$_REQUEST['data']['title'],$_REQUEST['data']['description'],
		$_REQUEST['data']['copyright_date'],$_REQUEST['data']['adult_content'],$_REQUEST['data']['author'],$_REQUEST['data']['edition'],
		$_REQUEST['data']['condition'],$_REQUEST['data']['refundable'],$_REQUEST['data']['image1'],
		$_REQUEST['data']['image2'],$_REQUEST['data']['image3'],$_REQUEST['data']['image4'],
		$_REQUEST['data']['image5'],$_REQUEST['data']['quantity'],$_REQUEST['data']['product'],$_REQUEST['data']['unit'])){
		$output['status']	=	false;
	}
	
	else{
		$quantity		=	$_REQUEST['data']['quantity'];
		$product		=	$_REQUEST['data']['product'];
		$unit			=	$_REQUEST['data']['unit'];
		$owner			=	$_SESSION['userid'];
		$price			=	$_REQUEST['data']['price'];
		$paperback		=	htmlspecialchars($_REQUEST['data']['paperback']);
		$publisher		=	htmlspecialchars($_REQUEST['data']['publisher']);
		$language		=	$_REQUEST['data']['language'];
		$isbn_10		=	htmlspecialchars($_REQUEST['data']['isbn_10']);
		$isbn_13		=	htmlspecialchars($_REQUEST['data']['isbn_13']);
		$dimension		=	htmlspecialchars($_REQUEST['data']['dimension']);
		$title			=	htmlspecialchars($_REQUEST['data']['title']);
		$description	=	htmlspecialchars($_REQUEST['data']['description']);
		$category1		=	$_REQUEST['data']['category1'];
		$category2		=	$_REQUEST['data']['category2'];
		$category3		=	$_REQUEST['data']['category3'];
		$category4		=	$_REQUEST['data']['category4'];
		$category5		=	$_REQUEST['data']['category5'];
		$category6		=	$_REQUEST['data']['category6'];
		$category7		=	$_REQUEST['data']['category7'];
		$category8		=	$_REQUEST['data']['category8'];
		$category9		=	$_REQUEST['data']['category9'];
		$category10		=	$_REQUEST['data']['category10'];
		$copyright_date	=	$_REQUEST['data']['copyright_date'];
		$date			=	now();
		$adult_content	=	$_REQUEST['data']['adult_content'];
		$author			=	htmlspecialchars($_REQUEST['data']['author']);
		$edition		=	htmlspecialchars($_REQUEST['data']['edition']);
		$condition		=	$_REQUEST['data']['condition'];
		$refundable		=	$_REQUEST['data']['refundable'];
		$status			=	P_STATUS_AVAILABLE;
		$image1			=	$_REQUEST['data']['image1'];
		$image2			=	$_REQUEST['data']['image2'];
		$image3			=	$_REQUEST['data']['image3'];
		$image4			=	$_REQUEST['data']['image4'];
		$image5			=	$_REQUEST['data']['image5'];
	}
	
	if($output['status']){
		if($product	==	P_BOOK)
		{
			$category_object	=	array(
					'Fields'=>	'catId',
					'Table'	=>	'category_book'
			);
			$category_data	=	DB_Read($category_object,'ASSOC','catId');
		}
		elseif($product	==	P_MAGAZINE)
		{
			$category_object	=	array(
					'Fields'=>	'magId',
					'Table'	=>	'category_magazine'
			);
			$category_data	=	DB_Read($category_object,'ASSOC','magId');
		}		
		if($output['status']	&&	!is_int($quantity)){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($product)	||	!in_array($product,$PRODUCT_TYPE))){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($unit)	||	!in_array($unit,$UNIT_TYPE))){
			$output['status']	=	false;
		}
		if($output['status']	&&	!is_numeric($price)){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($category1)	||	!is_int($category2)	||	!is_int($category3))){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($category4)	||	!is_int($category5)	||	!is_int($category6))){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($category7)	||	!is_int($category8)	||	!is_int($category9))){
			$output['status']	=	false;
		}
		if($output['status']	&&	!is_int($category10)){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category1])	&&	$category1	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category2])	&&	$category2	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category3])	&&	$category3	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category4])	&&	$category4	!=	NULL){
			$output['status']	=	false;
		}
		
		if($output['status']	&&	!isset($category_object[$category5])	&&	$category5	!=	NULL){
			$output['status']	=	false;
		}
		
		if($output['status']	&&	!isset($category_object[$category6])	&&	$category6	!=	NULL){
			$output['status']	=	false;
		}
		
		if($output['status']	&&	!isset($category_object[$category7])	&&	$category7	!=	NULL){
			$output['status']	=	false;
		}
		
		if($output['status']	&&	!isset($category_object[$category8])	&&	$category8	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category9])	&&	$category9	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category10])	&&	$category10	!=	NULL){
			$output['status']	=	false;
		}	
		if($output['status']	&&	(!is_bool($adult_content)	||	!is_bool($refundable))){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($condition)	||	$condition	> 5)){
			$output['status']	=	false;
		}
				
		$add_product_details	=	array(
				'quantity'		=>	$quantity,
				'product'		=>	$product,
				'unit'			=>	$unit,
				'owner'			=>	$owner,
				'price'			=>	$price,
				'paperback'		=>	$paperback,
				'publisher'		=>	$publisher,
				'language'		=>	$language,
				'isbn_10'		=>	$isbn_10,
				'isbn_13'		=>	$isbn_13,
				'dimension'		=>	$dimension,
				'title'			=>	$title,
				'description'	=>	$description,
				'category1'		=>	$category1,
				'category2'		=>	$category2,
				'category3'		=>	$category3,
				'category4'		=>	$category4,
				'category5'		=>	$category5,
				'category6'		=>	$category6,
				'category7'		=>	$category7,
				'category8'		=>	$category8,
				'category9'		=>	$category9,
				'category10'	=>	$category10,
				'copyright_date'=>	$copyright_date,
				'date'			=>	$date,
				'adult_content'	=>	$adult_content,
				'author'		=>	$author,
				'edition'		=>	$edition,
				'condition'		=>	$condition,
				'refundable'	=>	$refundable,
				'status'		=>	$status,
				'image1'		=>	$image1,
				'image2'		=>	$image2,
				'image3'		=>	$image3,
				'image4'		=>	$image4,
				'image5'		=>	$image5
		);
		
		if(!insert_product($add_product_details))
		{
			$output['status']	=	false;
		}
	}
	
	if($output['status'])
	{
		echo true;
	}
	else
	{
		echo false;
	}
}
elseif($_REQUEST['request']	==	"update_product"){
	$output	=	array(
			'status'	=>	true
	);
	if(!isset($_REQUEST['data']['id'],$_REQUEST['data']['price'],$_REQUEST['data']['paperback'],
			$_REQUEST['data']['publisher'],$_REQUEST['data']['language'],$_REQUEST['data']['isbn_10'],$_REQUEST['data']['isbn_13'],
			$_REQUEST['data']['dimension'],$_REQUEST['data']['title'],$_REQUEST['data']['description'],
			$_REQUEST['data']['copyright_date'],$_REQUEST['data']['adult_content'],$_REQUEST['data']['author'],$_REQUEST['data']['edition'],
			$_REQUEST['data']['condition'],$_REQUEST['data']['refundable'],$_REQUEST['data']['status'],
			$_REQUEST['data']['image1'],$_REQUEST['data']['image2'],$_REQUEST['data']['image3'],
			$_REQUEST['data']['image4'],$_REQUEST['data']['image5'],$_REQUEST['data']['quantity'],
			$_REQUEST['data']['product'],$_REQUEST['data']['unit'])){
		$output['status']	=	false;
	}
	
	else{
		$id				=	$_REQUEST['data']['id'];
		$quantity		=	$_REQUEST['data']['quantity'];
		$product		=	$_REQUEST['data']['product'];
		$unit			=	$_REQUEST['data']['unit'];
		$owner			=	$_SESSION['userid'];
		$price			=	$_REQUEST['data']['price'];
		$paperback		=	htmlspecialchars($_REQUEST['data']['paperback']);
		$publisher		=	htmlspecialchars($_REQUEST['data']['publisher']);
		$language		=	$_REQUEST['data']['language'];
		$isbn_10		=	htmlspecialchars($_REQUEST['data']['isbn_10']);
		$isbn_13		=	htmlspecialchars($_REQUEST['data']['isbn_13']);
		$dimension		=	htmlspecialchars($_REQUEST['data']['dimension']);
		$title			=	htmlspecialchars($_REQUEST['data']['title']);
		$description	=	htmlspecialchars($_REQUEST['data']['description']);
		$category1		=	$_REQUEST['data']['category1'];
		$category2		=	$_REQUEST['data']['category2'];
		$category3		=	$_REQUEST['data']['category3'];
		$category4		=	$_REQUEST['data']['category4'];
		$category5		=	$_REQUEST['data']['category5'];
		$category6		=	$_REQUEST['data']['category6'];
		$category7		=	$_REQUEST['data']['category7'];
		$category8		=	$_REQUEST['data']['category8'];
		$category9		=	$_REQUEST['data']['category9'];
		$category10		=	$_REQUEST['data']['category10'];
		$copyright_date	=	$_REQUEST['data']['copyright_date'];
		$date			=	now();
		$adult_content	=	$_REQUEST['data']['adult_content'];
		$author			=	htmlspecialchars($_REQUEST['data']['author']);
		$edition		=	htmlspecialchars($_REQUEST['data']['edition']);
		$condition		=	$_REQUEST['data']['condition'];
		$refundable		=	$_REQUEST['data']['refundable'];
		$status			=	$_REQUEST['data']['status'];
		$image1			=	$_REQUEST['data']['image1'];
		$image2			=	$_REQUEST['data']['image2'];
		$image3			=	$_REQUEST['data']['image3'];
		$image4			=	$_REQUEST['data']['image4'];
		$image5			=	$_REQUEST['data']['image5'];
	}
	
	if($output['status']){
		if($product	==	P_BOOK){
			$category_object	=	array(
					'Fields'=>	'catId',
					'Table'	=>	'category_book'
			);
			$category_data	=	DB_Read($category_object,'ASSOC','catId');
		}
		elseif($product	==	P_MAGAZINE){
			$category_object	=	array(
					'Fields'=>	'magId',
					'Table'	=>	'category_magazine'
			);
			$category_data	=	DB_Read($category_object,'ASSOC','magId');
		}
		
		if($output['status']	&&	!is_int($id)){
			$output['status']	=	false;
		}
		if($output['status']	&&	!is_int($quantity)){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($product)	||	!in_array($product,$PRODUCT_TYPE))){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($unit)	||	!in_array($unit,$UNIT_TYPE))){
			$output['status']	=	false;
		}
		if($output['status']	&&	!is_numeric($price)){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($category1)	||	!is_int($category2)	||	!is_int($category3))){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($category4)	||	!is_int($category5)	||	!is_int($category6))){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($category7)	||	!is_int($category8)	||	!is_int($category9))){
			$output['status']	=	false;
		}
		if($output['status']	&&	!is_int($category10)){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category1])	&&	$category1	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category2])	&&	$category2	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category3])	&&	$category3	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category4])	&&	$category4	!=	NULL){
			$output['status']	=	false;
		}
		
		if($output['status']	&&	!isset($category_object[$category5])	&&	$category5	!=	NULL){
			$output['status']	=	false;
		}
		
		if($output['status']	&&	!isset($category_object[$category6])	&&	$category6	!=	NULL){
			$output['status']	=	false;
		}
		
		if($output['status']	&&	!isset($category_object[$category7])	&&	$category7	!=	NULL){
			$output['status']	=	false;
		}
		
		if($output['status']	&&	!isset($category_object[$category8])	&&	$category8	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category9])	&&	$category9	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	!isset($category_object[$category10])	&&	$category10	!=	NULL){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_bool($adult_content)	||	!is_bool($refundable))){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($condition)	||	$condition	> 5)){
			$output['status']	=	false;
		}
		if($output['status']	&&	(!is_int($status)	||	!in_array($status,$PRODUCT_STATUS))){
			$output['status']	=	false;
		}
	
		$update_product_details	=	array(
				'quantity'		=>	$quantity,
				'product'		=>	$product,
				'unit'			=>	$unit,
				'owner'			=>	$owner,
				'price'			=>	$price,
				'paperback'		=>	$paperback,
				'publisher'		=>	$publisher,
				'language'		=>	$language,
				'isbn_10'		=>	$isbn_10,
				'isbn_13'		=>	$isbn_13,
				'dimension'		=>	$dimension,
				'title'			=>	$title,
				'description'	=>	$description,
				'category1'		=>	$category1,
				'category2'		=>	$category2,
				'category3'		=>	$category3,
				'category4'		=>	$category4,
				'category5'		=>	$category5,
				'category6'		=>	$category6,
				'category7'		=>	$category7,
				'category8'		=>	$category8,
				'category9'		=>	$category9,
				'category10'	=>	$category10,
				'copyright_date'=>	$copyright_date,
				'date'			=>	$date,
				'adult_content'	=>	$adult_content,
				'author'		=>	$author,
				'edition'		=>	$edition,
				'condition'		=>	$condition,
				'refundable'	=>	$refundable,
				'status'		=>	$status,
				'image1'		=>	$image1,
				'image2'		=>	$image2,
				'image3'		=>	$image3,
				'image4'		=>	$image4,
				'image5'		=>	$image5
		);
	
		if(!update_product($update_product_details,$id))
		{
			$output['status']	=	false;
		}
	}
	
	if($output['status'])
	{
		echo true;
	}
	else
	{
		echo false;
	}
}
?>