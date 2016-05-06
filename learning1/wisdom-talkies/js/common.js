var toggleDropdown	=	function(element,control,event){
	if(control==1){
		if(!$(element).hasClass('open'))
			$(element).find('ul.dropdown-menu').dropdown('toggle');
	}
	else{
		if($(element).hasClass('open'))
			$(element).find('ul.dropdown-menu').dropdown('toggle');
	}
};
var CheckImgErr =function(image){
	if((image.naturalHeight == 90 && image.naturalWidth == 120 )|| (image.naturalHeight == 0 && image.naturalWidth == 0 )){
		image.src="./"+projectFolderName+"/image/defImage.png";
	}
	return true;
};

function distinctVal(arr){
    var newArray = [];
    for(var i=0, j=arr.length; i<j; i++){
        if(newArray.indexOf(arr[i]) == -1)
              newArray.push(arr[i]);  
    }
    return newArray;
}

function createBrowserObject()
{
	if(xmlHttp)
		delete xmlHttp;
		
	var xmlHttp;
	try
	{
		xmlHttp=new XMLHttpRequest();	// Firefox, Opera 8.0+, Safari		
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); // Internet Explorer 					
		} 
		catch (e)
		{ 
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{ 
				Alert(JavascriptNotWorking); 
			}
		}
	}
	 
	return xmlHttp;
}
var animationLoading ;
var sendAjax = function(object){
	var callType = true, sendMethod	=	'POST', additionalData	=	null, callBack	=	'';
	if(IsValueNull(object.actionScriptURL))
		return false;
		
	if(IsValueNull(object.sendMethod))
		sendMethod	=	'POST';

	if(!IsValueNull(object.callType) && object.callType	==	'SYNC')	
		callType	=	false;
		
	additionalData	=	object.additionalData;
	
	var xmlHttp	=	createBrowserObject();
	if(!IsValueNull(object.callBack) )
	{
		callBack	=	object.callBack; 
		xmlHttp.onreadystatechange	=	function(){
			if(xmlHttp.readyState	==	4 && xmlHttp.status	==	200){
				callBack(xmlHttp.responseText);
			}
		}; 
	}
	xmlHttp.open(sendMethod,object.actionScriptURL,callType);
	xmlHttp.send(additionalData);
};
function IsValueNull(Value)
{
	if(Value	==	"" || Value	==	null || Value	==	undefined)
		return true;
	else
		return false;	
}
var showSubCategory = function(event){
	$(event.currentTarget).closest('ul').find('.subMenuExpand').removeClass('hiddenElem');
	$(event.currentTarget).closest('ul').find('.subMenuCollapse').addClass('hiddenElem');
	$(event.currentTarget).closest('li').find('.subMenuExpand').addClass('hiddenElem');
	$(event.currentTarget).closest('li').find('.subMenuCollapse').removeClass('hiddenElem');
	$(event.currentTarget).closest('ul').find('ul.dropdown-menu').css('display','none');
	$(event.currentTarget).closest('li').find('ul.dropdown-menu').css('display','block');
	event.preventDefault();
	event.stopPropagation();
	return false;
};
var hideSubCategory = function(event){
	$(event.currentTarget).closest('ul').find('.subMenuExpand').removeClass('hiddenElem');
	$(event.currentTarget).closest('ul').find('.subMenuCollapse').addClass('hiddenElem');
	$(event.currentTarget).closest('li').find('.subMenuExpand').removeClass('hiddenElem');
	$(event.currentTarget).closest('li').find('.subMenuCollapse').addClass('hiddenElem');
	$(event.currentTarget).closest('ul').find('ul.dropdown-menu').css('display','none');
	$(event.currentTarget).closest('li').find('ul.dropdown-menu').css('display','none');
	event.preventDefault();
	event.stopPropagation();
	return false;
};
var blockSetFlag = 0;
var UI_blockInterface = function(){
	$('#block_ui_overlay').css('display','block');
	blockSetFlag = setTimeout(function(){
		$('#block_ui_overlay').css('display','none');
	},40*1000);
};
var UI_unBlockInterface = function(){
	$('#block_ui_overlay').css('display','none');
};
var sendCaptchaRequest = function(imgElem){
	refreshCaptcha(imgElem);
};
function refreshCaptcha(imgElem){
	var elem = '[alt="captcha"]';
	if(!IsValueNull(imgElem)){
		elem	=	imgElem;
	}
	var img = $(imgElem)[0];
	img.src = img.src.substring(0,img.src.lastIndexOf("?"))+"?captcha=true&rand="+Math.random()*1000;
}

var parseQueryStringToObject	=	function(queryStr){
	var a=queryStr.split('&');
	var b = {};
	for(var i=0;i<a.length;i++){
	    var c = a[i].split('=');
	    b[c[0]]=decodeURIComponent(c[1]);
	}
	return b;
};
function numbersonly(e)
{	 
	var unicode=e.charCode? e.charCode : window.event
    if (unicode > 31 && unicode != 46 && (unicode < 48 || unicode > 57))		
    	return false //disable key press
    unicode = null;
}
function check(obj)
{	
/*
	if(obj.value != '')
	{	
		reg=/^\d+$/;	
		if(obj.value > 2147483647)
		{
			UI_alert("Digits range should be 0 to 2147483647");
            obj.focus();
            obj = null;
		}		
		if (! reg.test(obj.value))
		{
			UI_alert("Please input digits only");
            obj.focus();
            obj = null;
		}
	}	
*/
}
function secondsToTimeStr(seconds){
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
var validateAppResponse =   function(responseObj){
    var outputvalidate  =   false;
    if(responseObj.status){
        outputvalidate  =   true;
    }
    return outputvalidate;
};

//==============================================================================================//
//========================= FUNCTION TO ADD SLASHES TO A STRING LIKE PHP =======================//
//==============================================================================================//
function addslashes(string) {
  return string.replace(/\\/g, '\\\\').
      replace(/\u0008/g, '\\b').
      replace(/\t/g, '\\t').
      replace(/\n/g, '\\n').
      replace(/\f/g, '\\f').
      replace(/\r/g, '\\r').
      replace(/'/g, '\\\'').
      replace(/"/g, '\\"');
}

function removeslashes(string) {
	  return string.replace(/\\\\/g, '\\').
	      replace(/\\b/g, '\u0008').
	      replace(/\\t/g, '\t').
	      replace(/\\n/g, '\n').
	      replace(/\\f/g, '\f').
	      replace(/\\r/g, '\r').
	      replace(/\\\'/g, '\'').
	      replace(/\\"/g, '"');
}
function encodeHtmlEntities(rawStr){
    var encodedStr  =   '';
    if(typeof(rawStr) != "undefined"){
        encodedStr = rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
           return '&#'+i.charCodeAt(0)+';';
        });    
    }
    return encodedStr;
}
