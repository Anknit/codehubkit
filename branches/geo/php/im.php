<?php
function add_product($data){
	$output	=	array(
			'status'	=>	true
	);
	if(!isset($data['price'],$data['paperback'],$data['publisher'],$data['language'],$data['isbn_10'],
			$data['isbn_13'],$data['dimension'],$data['title'],$data['description'],$data['copyright_date'],
			$data['adult_content'],$data['author'],$data['edition'],$data['condition'],$data['refundable'],
			$data['image1'],$data['image2'],$data['image3'],$data['image4'],$data['image5'],
			$data['quantity'],$data['product'],$data['unit'])){
		$output['status']	=	false;
	}

	else{
		$quantity		=	$data['quantity'];
		$product		=	$data['product'];
		$unit			=	$data['unit'];
		$owner			=	$_SESSION['userid'];
		$price			=	$data['price'];
		$paperback		=	htmlspecialchars($data['paperback']);
		$publisher		=	htmlspecialchars($data['publisher']);
		$language		=	$data['language'];
		$isbn_10		=	htmlspecialchars($data['isbn_10']);
		$isbn_13		=	htmlspecialchars($data['isbn_13']);
		$dimension		=	htmlspecialchars($data['dimension']);
		$title			=	htmlspecialchars($data['title']);
		$description	=	htmlspecialchars($data['description']);
		$category1		=	$data['category1'];
		$category2		=	$data['category2'];
		$category3		=	$data['category3'];
		$category4		=	$data['category4'];
		$category5		=	$data['category5'];
		$category6		=	$data['category6'];
		$category7		=	$data['category7'];
		$category8		=	$data['category8'];
		$category9		=	$data['category9'];
		$category10		=	$data['category10'];
		$copyright_date	=	$data['copyright_date'];
		$date			=	now();
		$adult_content	=	$data['adult_content'];
		$author			=	htmlspecialchars($data['author']);
		$edition		=	htmlspecialchars($data['edition']);
		$condition		=	$data['condition'];
		$refundable		=	$data['refundable'];
		$status			=	P_STATUS_AVAILABLE;
		$image1			=	$data['image1'];
		$image2			=	$data['image2'];
		$image3			=	$data['image3'];
		$image4			=	$data['image4'];
		$image5			=	$data['image5'];
	}

	if($output['status']){
		if($product	==	P_BOOK){
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

		if(!insert_product($add_product_details)){
			$output['status']	=	false;
		}
	}

	if($output['status']){
		return array(
				'status'	=>	true,
		);
	}
	else{
		return array(
				'status'	=>	false,
		);
	}
}
/*
 * update_produict
 */
	/* $output	=	array(
			'status'	=>	true
	);
if(!isset($data['price'],$data['paperback'],
			$data['publisher'],$data['language'],$data['isbn_10'],$data['isbn_13'],
			$data['dimension'],$data['title'],$data['description'],
			$data['copyright_date'],$data['adult_content'],$data['author'],$data['edition'],
			$data['condition'],$data['refundable'],$data['image1'],
			$data['image2'],$data['image3'],$data['image4'],
			$data['image5'],$data['quantity'],$data['product'],$data['unit'])){
		$output['status']	=	false;
	}

	else{
		$quantity		=	$data['quantity'];
		$product		=	$data['product'];
		$unit			=	$data['unit'];
		$owner			=	$_SESSION['userid'];
		$price			=	$data['price'];
		$paperback		=	htmlspecialchars($data['paperback']);
		$publisher		=	htmlspecialchars($data['publisher']);
		$language		=	$data['language'];
		$isbn_10		=	htmlspecialchars($data['isbn_10']);
		$isbn_13		=	htmlspecialchars($data['isbn_13']);
		$dimension		=	htmlspecialchars($data['dimension']);
		$title			=	htmlspecialchars($data['title']);
		$description	=	htmlspecialchars($data['description']);
		$category1		=	$data['category1'];
		$category2		=	$data['category2'];
		$category3		=	$data['category3'];
		$category4		=	$data['category4'];
		$category5		=	$data['category5'];
		$category6		=	$data['category6'];
		$category7		=	$data['category7'];
		$category8		=	$data['category8'];
		$category9		=	$data['category9'];
		$category10		=	$data['category10'];
		$copyright_date	=	$data['copyright_date'];
		$date			=	now();
		$adult_content	=	$data['adult_content'];
		$author			=	htmlspecialchars($data['author']);
		$edition		=	htmlspecialchars($data['edition']);
		$condition		=	$data['condition'];
		$refundable		=	$data['refundable'];
		$status			=	P_STATUS_AVAILABLE;
		$image1			=	$data['image1'];
		$image2			=	$data['image2'];
		$image3			=	$data['image3'];
		$image4			=	$data['image4'];
		$image5			=	$data['image5'];
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
if($_REQUEST['request']	==	"read_product"){
	$output	=	array();
	$data	=	read_product($data['id']);
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

elseif($_REQUEST['request']	==	"update_product"){
	$output	=	array(
			'status'	=>	true
	);
	if(!isset($data['id'],$data['price'],$data['paperback'],
			$data['publisher'],$data['language'],$data['isbn_10'],$data['isbn_13'],
			$data['dimension'],$data['title'],$data['description'],
			$data['copyright_date'],$data['adult_content'],$data['author'],$data['edition'],
			$data['condition'],$data['refundable'],$data['status'],
			$data['image1'],$data['image2'],$data['image3'],
			$data['image4'],$data['image5'],$data['quantity'],
			$data['product'],$data['unit'])){
		$output['status']	=	false;
	}
	
	else{
		$id				=	$data['id'];
		$quantity		=	$data['quantity'];
		$product		=	$data['product'];
		$unit			=	$data['unit'];
		$owner			=	$_SESSION['userid'];
		$price			=	$data['price'];
		$paperback		=	htmlspecialchars($data['paperback']);
		$publisher		=	htmlspecialchars($data['publisher']);
		$language		=	$data['language'];
		$isbn_10		=	htmlspecialchars($data['isbn_10']);
		$isbn_13		=	htmlspecialchars($data['isbn_13']);
		$dimension		=	htmlspecialchars($data['dimension']);
		$title			=	htmlspecialchars($data['title']);
		$description	=	htmlspecialchars($data['description']);
		$category1		=	$data['category1'];
		$category2		=	$data['category2'];
		$category3		=	$data['category3'];
		$category4		=	$data['category4'];
		$category5		=	$data['category5'];
		$category6		=	$data['category6'];
		$category7		=	$data['category7'];
		$category8		=	$data['category8'];
		$category9		=	$data['category9'];
		$category10		=	$data['category10'];
		$copyright_date	=	$data['copyright_date'];
		$date			=	now();
		$adult_content	=	$data['adult_content'];
		$author			=	htmlspecialchars($data['author']);
		$edition		=	htmlspecialchars($data['edition']);
		$condition		=	$data['condition'];
		$refundable		=	$data['refundable'];
		$status			=	$data['status'];
		$image1			=	$data['image1'];
		$image2			=	$data['image2'];
		$image3			=	$data['image3'];
		$image4			=	$data['image4'];
		$image5			=	$data['image5'];
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
} */
?>