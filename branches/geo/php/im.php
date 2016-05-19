<?php
class inventory_management_class
{
	function add_product($data)
	{
		$output	=	array(
				'status'	=>	true
		);
		if(!isset($data['price'],$data['isbn'],$data['condition'],$data['refundable'],
				$data['image'],$data['quantity'],$data['product'],$data['unit'],
				$data['status'])){
			$output['status']	=	false;
		}
	
		else
		{
			$search_class	=	new ContentSearchClass();
			$search_result	=	$search_class->search_isbn_details($data['isbn']);
			
			if($search_result['status'])
			{
				$secure_id		=	bin2hex(openssl_random_pseudo_bytes(16));
				$quantity		=	$data['quantity'];
				$product		=	$data['product'];
				$unit			=	$data['unit'];
				$owner			=	$_SESSION['userid'];
				$price			=	$data['price'];
				$publisher		=	$search_result['data']['data'][0]['publisher_name'];
				$language		=	$search_result['data']['data'][0]['language'];
				$isbn_10		=	$search_result['data']['data'][0]['isbn10'];
				$isbn_13		=	$search_result['data']['data'][0]['isbn13'];
				$title			=	$search_result['data']['data'][0]['title'];
				$description	=	$search_result['data']['data'][0]['summary'];
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
				$date			=	date("Y-m-d H:i:s");
				$adult_content	=	"0";
				$author			=	$search_result['data']['data'][0]['author_data'][0]['name'];
				$edition		=	$search_result['data']['data'][0]['edition_info'];
				$condition		=	$data['condition'];
				$refundable		=	$data['refundable'];
				
				if($data['status']	==	P_STATUS_AVAILABLE){
					$available_status	=	$quantity;
					$total_status		=	$quantity;
					$booked_status		=	false;
					$sold_status		=	false;
					$incomplete_status	=	false;
					$onhold_status		=	false;
				}
				else if($data['status']	==	P_STATUS_INCOMPLETE){
					$available_status	=	false;
					$total_status		=	false;
					$booked_status		=	false;
					$sold_status		=	false;
					$incomplete_status	=	$quantity;
					$onhold_status		=	false;
					
				}
										
				$image			=	$data['image'];
			}
			else
			{
				$output['status']	=	false;
			}	
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
			if(	!is_int($quantity)		||	!is_int($product)			||	!in_array($product,json_decode(PRODUCT_TYPE))	
			||	!is_int($unit)			||	!in_array($unit,json_decode(UNIT_TYPE))	||	!is_numeric($price)
			||	!is_int($category1)		||	!is_int($category2)			||	!is_int($category3)	
			||	!is_int($category4)		||	!is_int($category5)			||	!is_int($category6)
			||	!is_int($category7)		||	!is_int($category8)			||	!is_int($category9)
			||	!is_bool($refundable)	||	!is_int($condition)			||	$condition	> 5
			||	!is_int($category10)
			||	(!isset($category_object[$category1])	&&	$category1	!=	NULL)
			||	(!isset($category_object[$category2])	&&	$category2	!=	NULL)
			||	(!isset($category_object[$category3])	&&	$category3	!=	NULL)
			||	(!isset($category_object[$category4])	&&	$category4	!=	NULL)
			||	(!isset($category_object[$category5])	&&	$category5	!=	NULL)
			||	(!isset($category_object[$category6])	&&	$category6	!=	NULL)
			||	(!isset($category_object[$category7])	&&	$category7	!=	NULL)
			||	(!isset($category_object[$category8])	&&	$category8	!=	NULL)
			||	(!isset($category_object[$category9])	&&	$category9	!=	NULL)
			||	(!isset($category_object[$category10])	&&	$category10	!=	NULL))
			{
				$output['status']	=	false;
			}
			
			$add_product_details	=	array(
					'product'			=>	$product,
					'unit'				=>	$unit,
					'owner'				=>	$owner,
					'price'				=>	$price,
					'publisher'			=>	$publisher,
					'language'			=>	$language,
					'isbn_10'			=>	$isbn_10,
					'isbn_13'			=>	$isbn_13,
					'title'				=>	$title,
					'description'		=>	$description,
					'category1'			=>	$category1,
					'category2'			=>	$category2,
					'category3'			=>	$category3,
					'category4'			=>	$category4,
					'category5'			=>	$category5,
					'category6'			=>	$category6,
					'category7'			=>	$category7,
					'category8'			=>	$category8,
					'category9'			=>	$category9,
					'category10'		=>	$category10,
					'date'				=>	$date,
					'adult_content'		=>	$adult_content,
					'author'			=>	$author,
					'edition'			=>	$edition,
					'condition'			=>	$condition,
					'refundable'		=>	$refundable,
					'status'			=>	$status,
					'image1'			=>	$image,
					'available_status'	=>	$available_status,
					'total_status'		=>	$total_status,
					'booked_status'		=>	$booked_status,
					'sold_status'		=>	$sold_status,
					'incomplete_status'	=>	$incomplete_status,
					'onhold_status'		=>	$onhold_status,
					'secure_id'			=>	$secure_id
			);
	
			$insert_data	  =   array(
					'Table'	=>	'inventory',
					'Fields'=>	$add_product_details
			);
			if(!DB_Insert($insert_data)){
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
	
	function read_product($data)
	{
		$output	=	array(
				'status'	=>	true
		);
		$id_of_product_to_read	=	'';
		if(isset($data['id'])){
			$id_of_product_to_read	=	$data['id'];
		}
		if(isset($data['start'])	&&	$data['start']	!=	""	&&	is_int($data['start'])){
			$start	=	$data['start'];
		}
		else{
			$start	=	"0";
		}
	
		if(isset($data['count'])	&&	$data['count']	!=	""	&&	is_int($data['count'])){
			$count	=	$data['count'];
		}
		else{
			$count	=	"10";
		}
	
		if($id_of_product_to_read	!=	null	&&	$id_of_product_to_read	!=	''	&&	is_int($id_of_product_to_read)){
			$read_object	= array(
					'Table'	=>	'inventory',
					'Fields'=>	'*',
					'clause'=>	"id=".$id_of_product_to_read."  && owner='".$_SESSION['userid']."'" 
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
			$output['status']	=	false;
		}
		else{
			$output['status']	=	true;
			$output['data']		=	$read_data;
			return $output;
			die();
		}
	}
	
	function update_product($data)
	{
		$output	=	array(
				'status'	=>	true
		);
		$read_product_response	=	$this->read_product($data['id']);
		if(!isset($data['id'],$data['price'],$data['isbn'],$data['condition'],$data['refundable'],$data['status'],
				$data['image'],$data['quantity'],$data['product'],$data['unit']))
		{
			$output['status']	=	false;
		}
	
		else
		{
			$id				=	$data['id'];
			$quantity		=	$data['quantity'];
			$product		=	$data['product'];
			$unit			=	$data['unit'];
			$owner			=	$_SESSION['userid'];
			$price			=	$data['price'];
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
			$date			=	date("Y-m-d H:i:s");
			$adult_content	=	"0";
			$condition		=	$data['condition'];
			$refundable		=	$data['refundable'];
			$image			=	$data['image'];
			if($data['status']	==	P_STATUS_AVAILABLE){
				if($read_product_response[0]['onhold_status']	>=	$quantity)
				{	
					$available_status	=	$quantity;
					$total_status		=	'total_status';
					$booked_status		=	'booked_status';
					$sold_status		=	'sold_status';
					$incomplete_status	=	'incomplete_status';
					$onhold_status		=	'onhold_status-'.$quantity;
				}
				else
				{
					$output['status']	=	false;
				}
			}
			else if($data['status']	==	P_STATUS_DELETED){
				if($read_product_response[0]['available_status']	>=	$quantity)
				{
					$available_status	=	'available_status-'.$quantity;
					$total_status		=	'total_status-'.$quantity;
					$booked_status		=	'booked_status';
					$sold_status		=	'sold_status';
					$incomplete_status	=	'incomplete_status';
					$onhold_status		=	'onhold_status';
				}
				else
				{
					$output['status']	=	false;
				}
					
			}
			else if($data['status']	==	P_STATUS_ONHOLD){
				if($read_product_response[0]['available_status']	>=	$quantity)
				{
					$available_status	=	'available_status-'.$quantity;
					$total_status		=	'total_status';
					$booked_status		=	'booked_status';
					$sold_status		=	'sold_statusse';
					$incomplete_status	=	'incomplete_status';
					$onhold_status		=	'onhold_status';
				}
				else
				{
					$output['status']	=	false;
				}
					
			}
		}
	
		if($output['status'])
		{
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
			
			if(	!is_int($quantity)		||	!is_int($product)						||	!in_array($product,json_decode(PRODUCT_TYPE))						
			||	!is_int($unit)			||	!in_array($unit,json_decode(UNIT_TYPE))	||	!is_numeric($price)
			||	!is_int($category1)		||	!is_int($category2)						||	!is_int($category3)
			||	!is_int($category4)		||	!is_int($category5)						||	!is_int($category6)
			||	!is_int($category7)		||	!is_int($category8)						||	!is_int($category9)
			||	!is_bool($refundable)	||	!is_int($condition)						||	$condition	> 5
			||	!is_int($category10)	||	!is_int($id)
			||	(!isset($category_object[$category1])	&&	$category1	!=	NULL)
			||	(!isset($category_object[$category2])	&&	$category2	!=	NULL)
			||	(!isset($category_object[$category3])	&&	$category3	!=	NULL)
			||	(!isset($category_object[$category4])	&&	$category4	!=	NULL)
			||	(!isset($category_object[$category5])	&&	$category5	!=	NULL)
			||	(!isset($category_object[$category6])	&&	$category6	!=	NULL)
			||	(!isset($category_object[$category7])	&&	$category7	!=	NULL)
			||	(!isset($category_object[$category8])	&&	$category8	!=	NULL)
			||	(!isset($category_object[$category9])	&&	$category9	!=	NULL)
			||	(!isset($category_object[$category10])	&&	$category10	!=	NULL))
			{
				$output['status']	=	false;
			}
			
			$update_product_details	=	'update inventory set product='.$product.'unit='.$unit.'price="'.$price.
			'" category1='.$category1.'category2='.$category2.'category3='.$category3.
			'category4='.$category4.'category5='.$category5.'category6='.$category6.'category7='.$category7.
			'category8='.$category8.'category9='.$category9.'category10='.$category10.'date='.$date.
			'adult_content='.$adult_content.'image1='.$image.'available_status='.$available_status.
			'total_status'.$total_status.'booked_status='.$booked_status.'sold_status='.$sold_status.
			'incomplete_status='.$incomplete_status.'onhold_status='.$onhold_status.' where id='.$id.' && owner='.$owner;
			
			if(!DB_QUERY($update_product_details)){
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
}
?>