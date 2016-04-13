<?php
/*
 * Author: Vaibhav
* date: 05-Feb-2016
* Description: This defines variables for various permission sets
*
*/
require_once  __DIR__.'/definitions.php';

//Permissions for backend
$PRODUCT_TYPE	=	array(P_BOOK,P_MAGAZINE);
$UNIT_TYPE		=	array(UNIT_NOS,UNIT_WEIGHT);
$PRODUCT_STATUS	=	array(P_STATUS_BOOKED,P_STATUS_DELETED,P_STATUS_SOLD,P_STATUS_ONHOLD,P_STATUS_AVAILABLE);
?>