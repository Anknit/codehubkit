/*
Project Name       	: 	Pulsar - Content Verification System
File Or Class Name 	: 	functions.js
Description			: 	different types of function like creation of objects
Copyright          	:	Copyright © 2009 - 2014 Venera Technologies.
*/

//===========================================================================================//
//=================== COMMON FUNCTION USER IN EVERY PAGE ====================================//
//===========================================================================================//

var gl_el; //global element

//===========================================================================================//
//===================  FUNCTION : TO CHECK EMPTY STRING======================================//
//===========================================================================================//

function isEmpty(s)
{
	  s=trim(s);
	  return ((s == null) || (s.length == 0))
}

//==========================================================================================//
//===================  FUNCTION : TO REMOVE WHITE SPACE  ===================================// 
//==========================================================================================//

function trim(b)
{
	var i = 0;
	while(b.charAt(i) == " ")
	{
		i++;
	}
	
	b=b.substring(i,b.length);
	len=b.length-1;
	
	while(b.charAt(len)==" ")
	{
		len--;
	}
	
	b=b.substring(0,len+1);
	return b;
}

//==========================================================================================//
//===================  FUNCTION : TO SET CURSOR FOCUS ON THE FIELD =========================//
//==========================================================================================//

function setFocus(el)
{
	if(el != "undefined"){
		document.getElementById(el).focus();
		setAlertStyle(el);
	}else if(typeof gl_el != "undefined"){
		gl_el.focus();	
	}
	return true;	
 }

//==========================================================================================//
//===================  FUNCTION : TO SET ALERT STYLE =======================================//
//==========================================================================================//

function setAlertStyle(el)
{
	document.getElementById(el).style.border = '2px solid';
	document.getElementById(el).style.borderColor = '#7680BB';
}

//==========================================================================================//
//===================  FUNCTION : TO UNSET ALERT STYLE =====================================//
//==========================================================================================//

function unsetAlertStyle(el)
{	
	document.getElementById(el).style.border = '1px solid';
	document.getElementById(el).style.borderColor = '';
}

//==========================================================================================//
//===================  FUNCTION : TO ADD EVENT FUNCTION ====================================// 
//==========================================================================================//

function addEvent( obj, type, fn )
{
   if ( obj.attachEvent ) {
     obj['e'+type+fn] = fn;
     obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
     obj.attachEvent( 'on'+type, obj[type+fn] );
   } else
     obj.addEventListener( type, fn, false );
}
 
//==========================================================================================// 
//===================  FUNCTION : BUTTON MOUSE OVER ========================================// 
//==========================================================================================//

function goLite(FRM,BTN)
{
	 
}

function goDim(FRM,BTN)
{
	 
}

function ShowPressed(FRM,ID)
{
	document.getElementById(ID).style.backgroundImage = "url(../../Common/images/buttonbg-down.png)";
}

function UnPressed(FRM,ID)
{
	document.getElementById(ID).style.backgroundImage = "url(../../Common/images/buttonbg-up.png)";
}

function ShowPressed2(FRM,ID)
{
	document.getElementById(ID).style.backgroundImage = "url(../../Common/images/buttonbg-down2.png)";
}

function UnPressed2(FRM,ID)
{
	document.getElementById(ID).style.backgroundImage = "url(../../Common/images/buttonbg-up2.png)";
}

//==========================================================================================// 
//===================  FUNCTION : TO REMOVE WHITE SPACE ====================================//
//==========================================================================================//
  
function trimThis(b)
{
	var i=0;
	while(b.charAt(i)==" "){
		i++;
	}
	
	b=b.substring(i,b.length);
	len=b.length-1;
	
	while(b.charAt(len)==" "){
		len--;
	}
	b=b.substring(0,len+1);
	return b;
}
	
//==========================================================================================// 
//===================  FUNCTION : TO CHECK THE CORRECT TEMPLATE NAME =======================// 
//==========================================================================================//
  
function isCharsInTemplate (s, bag)
{
	var i;
	// Search through string's characters one by one.
	// If character is in bag, append to returnString.
	if(s.length==0)
	{
		return false;
	}

	for (i = 0; i < s.length; i++)
	{
		// Check that current character isn't whitespace.
		var c = s.charAt(i);
		if (bag.indexOf(c) == -1) return false;
	}
	return true;
 }

//==========================================================================================// 
//===================  FUNCTION : CHECK CORRECT TEMPLATE NAME ==============================//
//==========================================================================================//
 
 function isTemplateName(s)
 {
	s=trimThis(s);
	return isCharsInTemplate(s, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_ ");
 }


 
 function isTemplateName2(s)
 {
	s=trimThis(s);
	return isCharsInTemplate(s, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ");
 }

 function characterChecking(s)
 {
	s=trimThis(s);
	return isCharsInTemplate(s, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~@#$%^()[]{}_-+=");
 }
 
//==========================================================================================// 
//===================  FUNCTION : USED IN ALERT SETTINGS/Not in use ========================//
//==========================================================================================//
 
function enableDisableCheckBox(id,id2)
{
	if(document.getElementById(id2).checked == true)
	{
		document.getElementById(id).disabled = false;	
	}
	
	if(document.getElementById(id2).checked == false)
	{
		document.getElementById(id).checked  = false;
		document.getElementById(id).disabled = true;					
	}		
}

//==========================================================================================// 
//=========================== FUNCTION : EMAIL VALIDATION IN PREFERENCES ===================//
//==========================================================================================//

function emailcheck2(str,numberId)
{	
	if (/^[a-zA-Z0-9]{1}[a-zA-Z0-9\._+-]*@[a-zA-Z0-9]{1}[a-zA-Z0-9\._+-]*\.[a-zA-Z]{2,6}$/.test(str))
	{
	 	return (true);
	}
	else
	{
		AlertMessageArrVar.length = 0;
		AlertMessageArrVar[0] = str;
		
		if(numberId == 1)
		{
			Alert(MessagesSettings[121].getMessages(AlertMessageArrVar));
			return false;
		}
		else if(numberId == 2)
		{
			Alert(MessagesSettings[122].getMessages(AlertMessageArrVar));
			return false;
		}
		else
		{
			Alert(MessagesSettings[123].getMessages(AlertMessageArrVar));
			return false;
		}
	}
}

// Function for adding event handlers for onload event
function addLoadEvent(func) 
{
	var oldonload = window.onload;
	if (typeof window.onload != 'function') 
	{
		window.onload = func;
	} 
	else 
	{
	    window.onload = function()
	    {
	    	if (oldonload) 
	    	{
	    		oldonload();
	    	}
	    	func();
	    };
	}
}

function getPixelsFromTop(obj)
{
	objFromTop = obj.offsetTop;
	while(obj.offsetParent!=null) 
	{
		objParent = obj.offsetParent;
		objFromTop += objParent.offsetTop;
		obj = objParent;
	}
	
	return objFromTop;
}

// Calculate the allowed height of the supplied object so that the browser doesn't need scrolling
// The object should be div type with vertical scrolling enabled
// Height is calculated based on fixed areas such as header and footer
function GetAllowableHeightWithoutScroll(obj)
{
    var getHeaderRes = document.getElementById("getHeaderRes");
	var footerDiv = document.getElementById("FooterStyle");
    var PageBlock = document.getElementById("PageBlock");
    if (PageBlock == null)
    	return 0;
    
    var pageBlockBottom = getPixelsFromTop(PageBlock) + PageBlock.offsetHeight;
    var objTop = getPixelsFromTop(obj);
    var divBottom = objTop + obj.offsetHeight;
    var segmentHeight = pageBlockBottom - divBottom;
    var topHeight = objTop-getPixelsFromTop(getHeaderRes); 
	var divContentHeight = vHeight - topHeight - (segmentHeight + footerDiv.offsetHeight);
    
	return divContentHeight;
}