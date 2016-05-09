<?php
/*
 * Author: Vaibhav
* date: 05-Feb-2016
* Description: This defines Permissions specific to a user
*
*/

// Create user specific permissions for various modules
require_once __DIR__."/permission_sets.php";
$Module['curation']		=	false;
$Module['profile']		=	false;
$Module['bookmark']		=	false;
$Module['UI_reviewer']	=	false;
$Module['UI_moderator']	=	false;
$Module['recommend']	=	false;
$Module['UI_admin']		=	false;

if(isset($_SESSION['usertype']))
{
	if(in_array($_SESSION['usertype'], $user_allowed_to_curate))
	{
		$Module['curation']		=	true;
	}
	if(in_array($_SESSION['usertype'], $user_allowed_to_review))
	{
		$Module['UI_reviewer']		=	true;
	}
	if(in_array($_SESSION['usertype'], $user_allowed_to_moderate))
	{
		$Module['UI_moderator']		=	true;
	}
	if(in_array($_SESSION['usertype'], $user_allowed_to_profile_change))
	{
		$Module['profile']		=	true;
	}
	if(in_array($_SESSION['usertype'], $user_allowed_to_recommend))
	{
		$Module['recommend']		=	true;
	}
	if(in_array($_SESSION['usertype'], $user_allowed_to_bookmark))
	{
		$Module['bookmark']		=	true;
	}
}
else
{
	$Module['recommend']		=	true;
}