/*
Project Name       	: 	Pulsar - Content Verification System
File Or Class Name 	: 	login.js
Description			: 	validation when user is on login page
Copyright          	:	Copyright © 2009 - 2014 Venera Technologies.
*/

//==================================================================================================//
//=========================== FUNCTION : TO CHECK FOR LOGIN DETAILS ================================//
//==================================================================================================//

function validate()
{
	getObject("error").innerHTML = "";

	if(isEmpty(getObject('userID').value))
	{
		getObject("error").innerHTML = "";
		Alert(MessagesSettings[61]);
		setFocus('userID');
		return false;
	}
	else
	{ 
		unsetAlertStyle('userID');
	}
	
	if(isEmpty(getObject('password').value))
	{
		getObject("error").innerHTML = "";
		Alert(MessagesSettings[10]);
		setFocus('password');
		return false;
	}
	else
	{ 
		unsetAlertStyle('password');
	}
	
	var pass_side	= getObject('password').value;
    var encpass		= "B3c59856Us"+pass_side+"Y12ZTlmK09";
	getObject('password').value = encpass;
	
	pass_side = null;
	encpass	  = null;
	return true;
}