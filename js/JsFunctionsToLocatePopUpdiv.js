/*
Project Name       	: 	Pulsar - Content Verification System
File Or Class Name 	: 	
Description			: 	
Copyright          	:	Copyright  2009 - 2014 Venera Technologies.
*/

window.size = function()
{
	var w = 0;
	var h = 0;
	//IE
	if(!window.innerWidth)
	{
		//strict mode
		if(!(document.documentElement.clientWidth == 0))
		{
			w = document.documentElement.clientWidth;
			h = document.documentElement.clientHeight;
		}
		//quirks mode
		else
		{
			w = document.body.clientWidth;
			h = document.body.clientHeight;
		}
	}
	//w3c
	else
	{
		w = window.innerWidth;
		h = window.innerHeight;
	}
	return {width:w,height:h};
}
window.center = function()
{
	var hWnd = (arguments[0] != null) ? arguments[0] : {width:0,height:0};
	var _x = 0;
	var _y = 0;
	var offsetX = 0;
	var offsetY = 0;
	//IE
	if(!window.pageYOffset)
	{
		//strict mode
		if(!(document.documentElement.scrollTop == 0))
		{
			offsetY = document.documentElement.scrollTop;
			offsetX = document.documentElement.scrollLeft;
		}
		//quirks mode
		else
		{
			offsetY = document.body.scrollTop;
			offsetX = document.body.scrollLeft;
		}
	}
	//w3c
	else
	{
		offsetX = window.pageXOffset;
		offsetY = window.pageYOffset;
	}
	_x = ((this.size().width-hWnd.width)/2)+offsetX;
	_y = ((this.size().height-hWnd.height)/2)+offsetY;
	return{x:_x,y:_y};
}

var savedTarget=null; // The target layer (effectively vidPane)
var orgCursor=null;   // The original Cursor (mouse) Style so we can restore it
var dragOK=false;     // True if we're allowed to move the element under mouse
var dragXoffset=0;    // How much we've moved the element on the horozontal
var dragYoffset=0;

var myobject = "";
function filedSetFocus(myobject)
{	 
	myobject.focus();
}

function showCenter(obj)
{	
	if(typeof obj != "object")	
		var divObject = document.getElementById(obj); 
	else
		var divObject = obj; 

	myobject = divObject;

	divObject.style.top = window.screen.height/2 - 50 + 'px';
	divObject.style.left = window.screen.width/2 - 100 + 'px';	
	divObject.style.display = "block";	
}

function moveHandler(e)
{
  	if (e == null) 
  	  	e = window.event;
	  	 
  	if (e.button<=1&&dragOK)
  	{
 		savedTarget.style.left=e.clientX-dragXoffset+'px';
 		savedTarget.style.top=e.clientY-dragYoffset+'px';
 		return false;
  	}
}

function cleanup(e) 
{
	document.onmousemove=null;
	document.onmouseup=null;
	savedTarget.style.cursor=orgCursor;
	dragOK=false;
}

function dragHandler(e)
{  
  	var htype='-moz-grabbing';
  	if (e == null) 
  	{ 
  	  	e = window.event; 
  	  	htype='move';
	} 

  	var target = e.target != null ? e.target : e.srcElement;
  	orgCursor=target.style.cursor;
  	
  	if (target.className=="browseFrame" || target.className=="vidFrame") 
  	{
	 	savedTarget=target;       
	 	target.style.cursor=htype;
	 	dragOK=true;
	 	dragXoffset=e.clientX-parseInt(myobject.style.left);
	 	dragYoffset=e.clientY-parseInt(myobject.style.top);
	 	document.onmousemove=moveHandler;
	 	document.onmouseup=cleanup;
	 	return false;
  	}
}
document.onmousedown=dragHandler;
