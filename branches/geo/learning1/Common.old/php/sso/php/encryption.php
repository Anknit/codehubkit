<?php
/*
 * 1. encrypts the text==>mail with random generated key
 * 2. @param: mail for encrypting and id of the user in database to hide in the encrypted key
 * 3. @return: cipher text with the key used to encrypt the text
 */
function inner_encrypt($mail,$id) {
	$str = '';
	for ( $i = 0; $i != 32; ++$i )
	{
		$str	=	$str.chr ( mt_rand(0, 255) );
	}
	$key    =    bin2hex ( $str );
	$inner_key    =    pack ( 'H*', $key );
	$plain    =    $mail;
	$iv_size    =    mcrypt_get_iv_size ( MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC );
	$iv    =    mcrypt_create_iv ( $iv_size, MCRYPT_RAND );
	$cipher     =     mcrypt_encrypt ( MCRYPT_RIJNDAEL_128, $inner_key,$plain, MCRYPT_MODE_CBC, $iv);
	$cipher     =     $iv . $cipher;
	$cipher    =    base64_encode ( $cipher );
	$cipher    =    $cipher. "#req=". $id;	//#req is appended to encrypted text and is equal to the id of the inner key in the database table
	$cipher    =    array( $cipher, $key );
	return $cipher;

}

/*
 * 1. encrypts the text with the predefined key
 * 2. @param: text to encrypt
 * 3. @return: cipher of the text
 */
function outer_encrypt($mail, $sso_c_encryption_key = false){
	$cipher    =    $mail;
	if(!$sso_c_encryption_key)
	{
		return false;
	}
	$outer_key    =    pack('H*',$sso_c_encryption_key);
	$iv_size     =     mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
	$iv     =     mcrypt_create_iv($iv_size, MCRYPT_RAND);
	$cipher     =     mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $outer_key,$cipher, MCRYPT_MODE_CBC, $iv);
	$cipher 	=	 $iv . $cipher;
	$cipher    =    base64_encode($cipher);
	return $cipher;
}
/*============================================END OF Encryption===============================================*/

/*============================================DEcryption=======================================================
 * 1. Cipher text is first open with outer key and then with inner key
 */
/* 
 * 1. decrypts the cipher with the predefined key
 * 2. @param: cipher text
 * 3. @return: new cipher text which is locked with inner key and the id which is hide inside it
 */

function outer_decrypt($cipher, $sso_c_encryption_key = false) {
	$cipher    =    base64_decode($cipher);
	$iv_size     =     mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
	$iv    =    substr($cipher,0,$iv_size);
	$cipher    =    substr($cipher,$iv_size);
	if(!$sso_c_encryption_key)
	{
		return false;
	}
	$outer_key    =    pack('H*',$sso_c_encryption_key);
	$cipher    =    mcrypt_decrypt(MCRYPT_RIJNDAEL_128,$outer_key,$cipher,MCRYPT_MODE_CBC,$iv);
	$pos    =    strpos($cipher,'#');
	$n_cipher	=	substr($cipher,0,$pos);
	$id		=	substr($cipher,$pos+5);
	$id    =    trim($id,"\0..\32");
	$cipher    =    array($n_cipher,$id);
	return $cipher;
}

/*
 * 1. decrypts the cipher with the inner key
 * 2. @param: cipher text and the inner key used to encrypt it
 * 3. @return: plain text ==>mail id
 */
function inner_decrypt($n_cipher,$inner_key)
{
	$inner_key     =     pack('H*', $inner_key);
	$n_cipher    =    base64_decode($n_cipher);
	$iv_size     =     mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
	$iv    =    substr($n_cipher,0,$iv_size);
	$n_cipher    =    substr($n_cipher,$iv_size);
	
	$text    =    mcrypt_decrypt(MCRYPT_RIJNDAEL_128,$inner_key,$n_cipher,MCRYPT_MODE_CBC,$iv);
	$text    =    trim($text,"\0..\32");
	return $text;
	
}
/*=======================================END OF DEcryption=============================================*/