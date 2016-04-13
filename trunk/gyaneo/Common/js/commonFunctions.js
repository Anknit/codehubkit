/*
Project Name       	: 	COMMON JS API
File Or Class Name 	: 	commonFunction.js
Description			: 	Common function used in every files
Copyright          	:	Copyright  2009 - 2014 Venera Technologies.
*/

function IsValueNull(Value)
{
	if(Value	==	"" || Value	==	null || Value	==	undefined)
		return true;
	else
		return false;	
}

function SubmitFormFileViaAjax(File, postToUrl, callBack)
{
	var formData = new FormData();
	loadImage();
	formData.append('file', File);
	
	var xmlHttp	=	createBrowserObject(); 	
	xmlHttp.open("POST", postToUrl);
	xmlHttp.send(formData);
	
	xmlHttp.onreadystatechange=function()
	{	    
		deloadImage();
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			callBack(xmlHttp.responseText);
		}
	}
}	

//============================================================================================//
//==================================ON MOUSE OVER SHOW HIGHLIGHT EVEN ROW ====================//
//============================================================================================//

function showEvenColor(id)
{	
	showeven = document.getElementById(id);
	showeven.style.background = "#F4F4F4";
	showeven = null;
}

//==========================================================================================// 
//=========================== FUNCTION : EMAIL VALIDATION ==================================//
//==========================================================================================//

function emailcheck(str)
{
	 if (/^[a-zA-Z0-9]{1}[a-zA-Z0-9\._+-]*@[a-zA-Z0-9]{1}[a-zA-Z0-9\._+-]*\.[a-zA-Z]{2,6}$/.test(str))
	 {
		 return (true);
	 }
	 else
	 {
		return false;
	 }
}

//============================================================================================//
//================================= ON MOUSE OVER SHOW HIGHLIGHT ODD ROW =====================//
//============================================================================================//

function showOddColor(id)
{
	showodd = document.getElementById(id);
	showodd.style.background = "#FFFFFF";
	showodd = null;
}
 
//============================================================================================//
//====================================== MEMORY LEAK SOLUTION ================================//
//============================================================================================//

function memoryLeakSolution(d)
{
 	var a = d.attributes, i, l, n;
	if (a) {
		l = a.length;
		for (i = 0; i < l; i += 1) {
			n = a[i].name;
			if (typeof d[n] === 'function') {
			
				d[n] = null;
			
			}
		}
	}
	a = d.childNodes;
	if (a) {
		l = a.length;
		for (i = 0; i < l; i += 1) {
			memoryLeakSolution(d.childNodes[i]);
		}
	}	
}

//============================================================================================//
//============================= RETURN TRUE IF INTERNET EXPLORER =============================//
//============================================================================================//

var IE 				= false;
var Netscape 		= false;
var errorMessages	= "";

function getObject(a)
{
	  if(document.getElementById && document.getElementById(a))
	  {
		return document.getElementById(a)
	  }
	  else if(document.all&&document.all(a))
	  {
		return document.all(a)
	  }
	  else if(document.layers&&document.layers[a])
	  {
		return document.layers[a]
	  }
	  else
	  {
		return false
	  }
}

//================================================================================================//
//================== FUNCTION TO OPEN POPUP DIV ACCODING TO POSITION =============================//
//================================================================================================//

function getAnchorPosition(anchorname)
{
	// This function will return an Object with x and y properties
	var useWindow=false;
	var coordinates=new Object();
	var x=0,y=0;
	// Browser capability sniffing
	var use_gebi=false, use_css=false, use_layers=false;
	if (document.getElementById) { use_gebi=true; }
	else if (document.all) { use_css=true; }
	else if (document.layers) { use_layers=true; }
	// Logic to find position
 	if (use_gebi && document.all) {
		x=AnchorPosition_getPageOffsetLeft(document.all[anchorname]);
		y=AnchorPosition_getPageOffsetTop(document.all[anchorname]);
		}
	else if (use_gebi) {
		var o=document.getElementById(anchorname);
		x=AnchorPosition_getPageOffsetLeft(o);
		y=AnchorPosition_getPageOffsetTop(o);
		}
 	else if (use_css) {
		x=AnchorPosition_getPageOffsetLeft(document.all[anchorname]);
		y=AnchorPosition_getPageOffsetTop(document.all[anchorname]);
		}
	else if (use_layers) {
		var found=0;
		for (var i=0; i<document.anchors.length; i++) {
			if (document.anchors[i].name==anchorname) { found=1; break; }
			}
		if (found==0) {
			coordinates.x=0; coordinates.y=0; return coordinates;
			}
		x=document.anchors[i].x;
		y=document.anchors[i].y;
		}
	else {
		coordinates.x=0; coordinates.y=0; return coordinates;
		}
	coordinates.x=x;
	coordinates.y=y;
	return coordinates;
}

//================================================================================================//
//================================= FUNCTION TO GET ANCHOR POSITION ==============================//
//================================================================================================//

function getAnchorWindowPosition(anchorname)
{
	var coordinates=getAnchorPosition(anchorname);
	var x=0;
	var y=0;
	if (document.getElementById) {
		if (isNaN(window.screenX)) {
			x=coordinates.x-document.body.scrollLeft+window.screenLeft;
			y=coordinates.y-document.body.scrollTop+window.screenTop;
			}
		else {
			x=coordinates.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset;
			y=coordinates.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset;
			}
		}
	else if (document.all) {
		x=coordinates.x-document.body.scrollLeft+window.screenLeft;
		y=coordinates.y-document.body.scrollTop+window.screenTop;
		}
	else if (document.layers) {
		x=coordinates.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset;
		y=coordinates.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset;
		}
	coordinates.x=x;
	coordinates.y=y;
	return coordinates;
}

//================================================================================================//
//===================== FUNCTION FOR IE TO GET POSTION OF AN OBJECT ==============================//
//================================================================================================//

function AnchorPosition_getPageOffsetLeft (el) 
{
	var ol=el.offsetLeft;
	while ((el=el.offsetParent) != null) { ol += el.offsetLeft; }
	return ol;
}

//================================================================================================//
//===================== FUNCTION FOR IE TO GET POSTION OF AN OBJECT ==============================//
//================================================================================================//

function AnchorPosition_getWindowOffsetLeft (el)
{
	return AnchorPosition_getPageOffsetLeft(el)-document.body.scrollLeft;
}

//================================================================================================//
//===================== FUNCTION FOR IE TO GET POSTION OF AN OBJECT ==============================//
//================================================================================================//

function AnchorPosition_getPageOffsetTop (el)
{
	var ot=el.offsetTop;
	while((el=el.offsetParent) != null) { ot += el.offsetTop; }
	return ot;
}

//================================================================================================//
//===================== FUNCTION FOR IE TO GET POSTION OF AN OBJECT ==============================//
//================================================================================================//

function AnchorPosition_getWindowOffsetTop (el)
{
	return AnchorPosition_getPageOffsetTop(el)-document.body.scrollTop;
}

//=========================================================================================//
//========== FUNCTION TO CONVERT SINGLE DIGIT TO TWO DIGIT ===============================//
//=========================================================================================//

function convertToTwoDigit(num)
{
	switch(num)
	{
		case 0:	
		case 1:	
		case 2:	
		case 3:	
		case 4:	
		case 5:	
		case 6:	
		case 7:	
		case 8:	
		case 9:	num = "0"+num.toString();
	}		
	return num ;
}

//================================================================================================//
//======================== FUNCTION TO CHECK ONLY NUMERIC VALUE ==================================//
//================================================================================================//

function checkNum(x)
{
	 
   var s_len=x.value.length ;
   var s_charcode = 0;
     for (var s_i=0;s_i<s_len;s_i++)
     {
		  s_charcode = x.value.charCodeAt(s_i);
		  if(!((s_charcode>=48 && s_charcode<=57)))
		  {
			  Alert("Only numeric values allowed");
			  x.value=0;
			  x.focus();
			 return false;
		   }	   
     }
     return true;
 }

//===============================================================================================//
//==================== FUNCTION TO CHECK ONLY NUMERIC VALUE ON KEY PRESS ========================//
//===============================================================================================//

function numbersonly(e)
{	 
	var unicode=e.charCode? e.charCode : window.event
    if (unicode > 31 && (unicode < 48 || unicode > 57))		
    	return false //disable key press

    unicode = null;
}

function nospaceallowed(e)
{
	var unicode=e.charCode? e.charCode : window.event
	if (unicode == 32)		
		return false; //disable key press

	unicode = null;
}

function NumericOnly(e)
{	 
	var unicode=e.charCode? e.charCode : window.event
    if (unicode > 31 && (unicode < 48 || unicode > 57) && unicode != 46)		
		return false //disable key press
	
    unicode = null;
}

function NoBackSlash(e)
{
	var unicode = e.charCode? e.charCode : window.event;
    if (unicode == 92)		
		return false; //disable key press
			
    unicode = null;
}

function HexadecimalsAndDot(x)
{
   var s_len=x.length ;
   var s_charcode = 0;
     for (var s_i=0;s_i<s_len;s_i++)
     {
		  s_charcode = x.charCodeAt(s_i);
		  if(!( (s_charcode>=97 && s_charcode<=102) || (s_charcode>=65 && s_charcode<=70) || (s_charcode>=48 && s_charcode<=57) ))
		  {
			 return false;
		  }	   
     }
     return true;
}
//===============================================================================================//
//======================= FUNCTION TO CHECK ONLY PERCENTAGE VALUE ==================================//
//===============================================================================================//

function CheckPercentage(obj)
{	
	if(obj.value != '')
	{	
		reg=/^\d+$/;	
		if(obj.value > 100)
		{
			Alert("Digits range should be 0 to 100");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}		
		if (! reg.test(obj.value))
		{
			Alert("Please input digits only");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
	}	
}

//===============================================================================================//
//======================= FUNCTION TO CHECK ONLY NUMERIC VALUE ==================================//
//===============================================================================================//

function check(obj)
{	
	if(obj.value != '')
	{	
		reg=/^\d+$/;	
		if(obj.value > 2147483647)
		{
			Alert("Digits range should be 0 to 2147483647");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}		
		if (! reg.test(obj.value))
		{
			Alert("Please input digits only");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
	}	
}

function CheckNumeric(obj)
{	
	if(obj.value != '')
	{	
		reg=/^\d*\.{0,1}\d+$/;
		if(obj.value > 2147483647)
		{
			Alert("Digits range should be 0 to 2147483647");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}		
		if (! reg.test(obj.value))
		{
			Alert("Please input numeric values only\nIf you are using a decimal value then a number is required after the decimal");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
	}	
}

//===============================================================================================//
//============================ FUNCTION TO CHECK FOR BIG INTEGER ================================//
//===============================================================================================//

function checkForBigInt(obj)
{	
	if(obj.value != '')
	{	
		reg=/^\d+$/;		
		if(obj.value > 9223372036854775807)
		{
			Alert("Digits range should be 0 to 9223372036854775807");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
		
		if (!reg.test(obj.value))
		{
			Alert("Please input digits only");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
	}	
}

//================================================================================================//
//=================== FUNCTION TO CHECK ONLY NUMERIC VALUE ON RIGHT CLICK ========================//
//================================================================================================//

function whichButton(e)
{
	if (e.button == 2)//RIGHT CLICK
	{		
		Alert("Sorry, this functionality is disabled");
		return false;
	}
}

//================================================================================================//
//======================== FUNCTION TO CHECK ONLY NUMERIC VALUE ON CTRL KEY PRESS ================//
//================================================================================================//

function noCTRL(e)
{
	var code = (document.all) ? event.keyCode:e.which;
	var msg = "Sorry, this functionality is disabled.";
	if (parseInt(code)==17) //CTRL KEY
	{
		Alert(msg);
		window.event.returnValue = false;
	}
} 

//==============================================================================================//
//======================== FUNCTION TO CHECK NUMERIC AND DECIMAL VALUE  ========================//
//==============================================================================================//

function isNumberAndDecimal(frameRate,obj) 
{
	if(isNaN(frameRate))
	{
		var sText  		=  "";
	}
	else
	{
		if(typeof(frameRate) == 'string')
		{
			var sText  		=  document.getElementById(frameRate).value;	
		}
		else if(typeof(frameRate) == 'number')
		{
			var sText  		=  String(frameRate);
		}
	}
	
	var ValidChars 	= "0123456789.";
	var IsNumber   	= true;
	var Char;
	var dotCnt = 0;
	for (i = 0; i < sText.length && IsNumber == true; i++)
	{
		Char = sText.charAt(i);
		if (Char==".") dotCnt = dotCnt +1;
			if (ValidChars.indexOf(Char) == -1 || dotCnt>1)
			{
				Alert("Please enter numeric or decimal digits");
				ContinueJsExecution = function (){
					obj.focus();
					obj.select();
					obj = null;
				};
				IsNumber = false;
			}
	}
	
	sText 	= null;
	Char  	= null;
	dotCnt 	= null;
	
	return IsNumber;
}

function isNumber(num) 
{
	var ValidChars 	= "0123456789.";
	var IsNumber   	= true;
	var Char;
	for (i = 0; i < num.length && IsNumber == true; i++)
	{
		Char = num.charAt(i);
		if (ValidChars.indexOf(Char) == -1)
			IsNumber = false;
	}
	
	return IsNumber;
}

//For display aspect ratio
function isNumberAndDecimalForAspectRatio(frameRate,obj) 
{
	var sText  		=  document.getElementById(frameRate).value;	
	var ValidChars 	= "0123456789.:";
	var IsNumber   	= true;
	var Char;
	var dotCnt = 0;
	for (i = 0; i < sText.length && IsNumber == true; i++)
	{
		Char = sText.charAt(i);
		if (Char=="." || Char==":") dotCnt = dotCnt +1;
			if (ValidChars.indexOf(Char) == -1 || dotCnt>1)
			{
				Alert("Please enter numeric or decimal digits or in form of ratio");
				ContinueJsExecution = function (){
					obj.focus();
					obj.select();
					obj = null;
				};
				IsNumber = false;
			}		 
	}
	
	sText 	= null;
	Char  	= null;
	dotCnt 	= null;
	
	return IsNumber;
}

//==============================================================================================//
//======================== FUNCTION TO CHECK MAX REPORTING ERROR LIMIT =========================//
//==============================================================================================//

function isMaxReprtingError(maxerr, minerr, obj)
{
	var sText  		=  document.getElementById("maxErrorSet").value;	
	var ValidChars 	= "0123456789.";
	var IsNumber	= true;
	var Char;
	var dotCnt = 0;
	for (i = 0; i < sText.length && IsNumber == true; i++)
	{
		Char = sText.charAt(i);
		if (Char==".") dotCnt = dotCnt +1;
			if (ValidChars.indexOf(Char) == -1 || dotCnt>1)
			{
				Alert("Please enter numeric or decimal digits");
				ContinueJsExecution = function (){
					obj.focus();
					obj.select();
					obj = null;
				};
				IsNumber = false;
			}
	}

	if(sText==0 || sText > maxerr)
	{
		Alert("Please enter digits between " + minerr + " to "+ maxerr);
		ContinueJsExecution = function (){
			obj.focus();
			obj.select();
			obj = null;
		};
		IsNumber = false;
	}
	
	return IsNumber;
}

//==============================================================================================//
//================== FUNCTION TO ALLOW ONLY CHARACTERS AND DIGITS ON KEYPRESS  =================//
//==============================================================================================//
function ValidateAlphaDigits(evt)
{
	var keyCode = (evt.which) ? evt.which : evt.keyCode
	if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32)
	{
		if(keyCode > 47 && keyCode < 58)// if it is a number than allow it
		{
			return true;
		}
		return false;
	}
	else
	{
		return true;
	}
}

//======================================================================================================================//
//========= FUNCTIONS TO SET BITS FOR DIFFERENT CHECKS OR HTML ELEMENTS AND STORE THE VALUE IN HOLDER ELEMENT===========//
//======================================================================================================================//
function SetBitValues(Association, ValueHolder)
{
	var SelectedChecks = new Array();
	var SetThisBit;
	$('td').find('input[association="'+Association+'"]:checkbox:checked, select[association="'+Association+'"]').each(function(index, element) {
		if($(this).prop("tagName")	==	"INPUT")
		{
			SetThisBit = $(this).attr( "dbit" );
		}
		else if($(this).prop("tagName")	==	"SELECT")
		{
			SetThisBit = $(this).find(":selected").attr( "dbit" );
		}
		
		if(SetThisBit != null && SetThisBit != 0 && SetThisBit != "" && SetThisBit != undefined)
			SelectedChecks.push(SetThisBit);
    });
	
	if(SelectedChecks.length > 0)
	{
		var selectedGroupsInBits = setBitsForDecimalsInArray(SelectedChecks);
		Element(ValueHolder).value = selectedGroupsInBits;
	}
	else
	{
		Element(ValueHolder).value = 0;
	}
	return ;
}


//======================================================================================================================//
//======= FUNCTIONS TO Store last active tab in cookie and reload the page. The input is jqx selector for the tab=======//
//======================================================================================================================//
function refreshdata(tabToBeDisplay){
	var date = new Date();
	date.setTime(date.getTime()+(6*1000));
	var expires = "; expires="+date.toGMTString();
	document.cookie = "tab="+tabToBeDisplay+expires;
	location.reload();
}

function extractCookie(name){
	var cookieName	=	false;
	var cookieArray	=	document.cookie.split(';');
	for(i=0;i<cookieArray.length;i++){
		if(cookieArray[i].indexOf(name+'=') != -1){
			cookieName	=	decodeURIComponent(cookieArray[i].split('=')[1]);
			break;
		}
	}
	return cookieName;
}


//======================================================================================================================//
//================= FUNCTIONS TO SHOW/HIDE DIV/ROWS OR OTHER ENTITIES DEPENDING ON THE CONDITION=========================//
//======================================================================================================================//

function ShowHideHTMLentity(Criteria, Condition, EntityToActUpon, SpecificValue)
{
	//Criteria specifies whether style.display has to be block or table-row for displaying
	//Condition specifies whether Num(1 for displaying the html entity) or checkbox.checked or combobox value == specefic value, has to be used for displaying/hiding.
	//EntityToActUpon specifies what html element has to be hidden or displayed, it may be a string of multiple entities(comma separated)
	//SpecificValue is used in case of dropdown box, where for a specefic value only the html element is to be acted upon,
	var ArrayofHtmlEntitiesToBeActedUpon = EntityToActUpon.split(',');
	
	for (var i=0; i < ArrayofHtmlEntitiesToBeActedUpon.length; i++)
	{
		// Either Action "1" (display) or checkbox being checked or selectboxvalue == specefic value
		if(Condition == 1 || (typeof Condition == 'string') && (document.getElementById(Condition).checked || parseInt(document.getElementById(Condition).value) == SpecificValue))
		{
			switch(Criteria)
			{
				case 1: //	When there are multiple div/html entities which are to be displayed or hidden, then for condition = 1 the entities are displayed else hidden
					document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.display = 'block';
				break;	
				case 2: //	When there are multiple rows entities which are to be displayed or hidden, then for condition = 1 the entities are displayed else hidden
					document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.display = 'table-row';
				break;	
				case 3: //	When there are multiple rows entities which are to be displayed or hidden, then for condition = 1 the entities are displayed else hidden
					document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.visibility = 'visible';
				break;	
			}
		}
		else if(Criteria	==	3)
			document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.visibility = 'hidden';
		else
			document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.display = 'none';
	}
}

function EnableDisableEntity(Condition, EntityToActUpon, SpecificValue)
{
	//Condition specifies whether Num or checkbox.checked or combobox value == specefic value, has to be used to enable/disable. If checkbox is on then entity is enabled
	//EntityToActUpon specifies what html element has to be enabled or disabled, it may be a string of multiple entities(comma separated)
	//SpecificValue is used in case of dropdown box, where for a specefic value only the html element is to be acted upon,
	var ArrayofHtmlEntitiesToBeActedUpon = EntityToActUpon.split(',');
	
	if(typeof SpecificValue == 'string')
	{
		SpecificValueArray = SpecificValue.split(',');	//If specific values are also multiple, then set a flag for conditionalvalue == any of the specific value
	}
	var ComboBox_Condition = false;
	if(typeof Condition == 'string')
	{
		var ElementValue = parseInt(document.getElementById(Condition).value);
		
		if(typeof SpecificValue == 'string')
		{
			for(var j= 0; j<SpecificValueArray.length; j++)
			{
				if(ElementValue == parseInt(SpecificValueArray[j]))
				{
					ComboBox_Condition = true;
					break;	//If elements value is found in any of the specific values than condition is met and thus break out of the loop
				}
			}
		}
		else
		{
			if(ElementValue == SpecificValue)
			{
				ComboBox_Condition = true;
			}
		}
	}


	for (var i=0; i < ArrayofHtmlEntitiesToBeActedUpon.length; i++)
	{
		// Either Action "1" (enable) or checkbox being checked or selectboxvalue == specefic value will enable
		if(Condition == 1 || (typeof Condition == 'string') && (document.getElementById(Condition).checked || ComboBox_Condition))
			document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).disabled = false;
		else
			document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).disabled = true;
	}
}

//================================================================================================================//
//===================== THIS FUNCTION RETURNS THE ELEMENT BY ID. MADE FOR CONVENIENCE ============================//
//================================================================================================================//
function Element(Id_Name)
{
	return document.getElementById(Id_Name);
}

//================================================================================================================//
//====================================== COMPARE DATES AND RETURN FALSE IF FIRST DATE IS BIGGER ==================//
//================================================================================================================//
function CompareDates(Date1, Date2)
{
	var ARRAY1 = Date1.split("-");
	var ARRAY2 = Date2.split("-");

	//Compare Year
	if(parseInt(ARRAY1[0]) > parseInt(ARRAY2[0]))
	{
		return false;
	}
	else if(parseInt(ARRAY1[0]) < parseInt(ARRAY2[0]))
	{
		return true;
	}
	else if(parseInt(ARRAY1[0]) == parseInt(ARRAY2[0]))
	{	
		//CompareMonth
		if(parseInt(ARRAY1[1]) > parseInt(ARRAY2[1]))
		{
			return false;
		}
		else if(parseInt(ARRAY1[1]) < parseInt(ARRAY2[1]))
		{
			return true;
		}
		else if(parseInt(ARRAY1[1]) == parseInt(ARRAY2[1]))
		{
			//CVompareDate
			if(parseInt(ARRAY1[2]) > parseInt(ARRAY2[2]))
			{
				return false;
			}
			else if(parseInt(ARRAY1[2]) < parseInt(ARRAY2[2]))
			{
				return true;
			}
			else if(parseInt(ARRAY1[2]) == parseInt(ARRAY2[2]))
			{
				return true;
			}
		}
	}
}

//==============================================================================================//
//======================= FUNCTION TO DELAY SCRIPT EXECUTION LIKE SLEEP=========================//
//==============================================================================================//
function Sleep(TimeDuartion)
{
	var date = new Date();
	var EntryTime = date.getSeconds();
	var ReturnTime = EntryTime+TimeDuartion;
	for(EntryTime; EntryTime < ReturnTime; )
	{
		var date = new Date();
		EntryTime = date.getSeconds();
	}
	return;
}

//==============================================================================================//
//============= FUNCTION TO LOCATE POP-UP DIV AT CENTRE OF PAGE FOR ALERT MESSAGES==============//
//==============================================================================================//

function ShowDivAtPageCenter(point,obj)
{	
	var showHideSourceDiv = document.getElementById(obj); 
	myobject = showHideSourceDiv;
	showHideSourceDiv.style.top = point.y + "px";
	showHideSourceDiv.style.left = point.x + "px";	
	showHideSourceDiv.style.display = "block";	
}

function ShowAlert(Message)
{
	var InnerHtmlString = "";
	$("#AlertMessageDiv").fadeIn("slow");
	InnerHtmlString = '<p style="margin-top:6px">'+Message+'</p>' ;
	Element('AlertMessage').innerHTML = InnerHtmlString;
	$("#AlertMessage").fadeIn("slow");
	ShowDivAtPageCenter(window.center({width:400,height:300}), 'AlertMessageDiv');
}
/*======================================================================================/
//==============================GRID RELATED FUNCTIONS BUT GENERALIZED==================/
//=====================================================================================*/

function CalculateGridWidth(CorrespondingDivId)
{
	return ($('#'+CorrespondingDivId).closest('table').width() - 5);
}

function CalculatePageSize(DivId, Page)
{
	var ReductionMargin	=	75, HeightAvailableForTable	;
	switch(Page)
	{
		case 1: //Verification Active job
		break;
		case 2: //Verification Processed job
			ReductionMargin	=	130;
		break;
		case 3:	//Templates
			ReductionMargin	=	100;
		break;
	}
	
	if(DivId	==	'TemplateListDiv' || DivId	==	'SmartTemplateListDiv' || DivId	==	'AdaptiveTemplateListDiv')
		HeightAvailableForTable	=	$('#TemplateListDiv').height() - ReductionMargin ;
	else
	{
		HeightAvailableForTable	=	GetAllowableHeightWithoutScroll(document.getElementById(DivId)) - ReductionMargin ;
		if(HeightAvailableForTable	<=	0)
		{
			HeightAvailableForTable	=	550;
		}
	}
	return 	HeightAvailableForTable;
}

function GetMinAppropriateHeightForTableResizing(ObjectHeight)
{
	var HeightToBeSet	=	ObjectHeight > 500 ? ObjectHeight : 500;
	return HeightToBeSet;
}


/*=======================================================*/
//=======FUNCTION TO SET THE PROPERTIES OF OBJECTS=======
/*======================================================*/

//This function would recieve the ids of elements and set various parameters
//The argument acceptable would be object e.g. {A, B, C}where each element would be like=> A= {ElementSelector(e.g. '#id'), propertyname[], value[]}	// The length of property array and length array should be equal
function SetHeaderProperties(ObjectsArray)
{
	var i,j, ObjectElement, ElementSelector, Element, PropertiesNameArray	=	new Array(), PropertiesValueArray	=	new Array();
	if(ObjectsArray	!= null && ObjectsArray != undefined)
	{
		for(i = 0; i< ObjectsArray.length; i++)
		{
			ObjectElement			=	ObjectsArray[i];
			ElementSelector			=	ObjectElement[0];	//If string then it is selector else it would be elementitself
			PropertiesNameArray		=	ObjectElement[1];
			PropertiesValueArray	=	ObjectElement[2];
			if(typeof(ElementSelector) != 'object' && typeof(ElementSelector) == 'string')
			{
				Element	=	$(ElementSelector);
			}
			else
			{
				Element	=	ElementSelector;
			}
			
			for(j = 0; j< PropertiesNameArray.length; j++)
			{
				Element.css(PropertiesNameArray[j], PropertiesValueArray[j]);
			}
		}
	}
}



/*=======================================================*/
//===========FUNCTION TO SHOW THE LOADING EFFECT==========
/*======================================================*/
	
function loadImage()
{
	//document.getElementById('LayOutDiv').style.display = "block";
	//showCenter('<div id="fade"><img src="../../Common/images/aloader.gif"></div>');
	//document.getElementById('LayOutDiv').innerHTML = '<img src="../../Common/images/aloader.gif">'; 
	var LoadingImage	=	document.getElementById('LoadingImage');
	if(!IsValueNull(LoadingImage)){
		LoadingImage.style.display = "block";
		showCenter('LoadingImage');
	}
	LayOutDiv	=	document.getElementById('LayOutDiv');
	if(!IsValueNull(LayOutDiv))
		LayOutDiv.style.display = "block";
	setTimeout(deloadImage, 15000);
}

/*=======================================================*/
//======FUNCTION TO VALIDATE MINUTES AND SECONDS==========
/*======================================================*/
function isMinuteOrSecond(obj)
{
   if(obj.value ==	""	|| obj.value<60)
   {
     return true;	   
   }
   else
	{  
	   obj.value	=	"59";
	   return false;
	}   
}  
/*=======================================================*/
//===========FUNCTION TO HIDE THE LOADING EFFECT==========
/*======================================================*/
	
function deloadImage()
{
	//document.getElementById('LayOutDiv').innerHTML = ''; 
	LoadingImage= document.getElementById('LoadingImage');
	if(!IsValueNull(LoadingImage))
		LoadingImage.style.display = "none";
	LayOutDiv	=	document.getElementById('LayOutDiv');
	if(!IsValueNull(LayOutDiv))
		LayOutDiv.style.display = "none";
}
	
	
function HideMessageDiv(DivToHide)
{
	var HideThis = Element(DivToHide);
	HideThis.style.display = 'none';
}

function AutoHideAlertDivAfterInterval(Interval)	// This function makes the messages appearing above template type tabs, disappear after specified time interval
{
	var int=self.setTimeout(function(){$("#AlertMessageDiv").fadeOut("slow");},Interval);
}

function ShowCenter(point,obj)
{
	if(typeof obj != 'object')	
		var showHideSourceDiv = document.getElementById(obj);
	else
		var showHideSourceDiv	=	obj;
		
	myobject = showHideSourceDiv;
	showHideSourceDiv.style.top = point.y + "px";
	showHideSourceDiv.style.left = point.x + "px";	
	showHideSourceDiv.style.display = "block";	
}
//==============================================================================================//
//==== FUNCTION TO SHOW HYPHENS AS USED IN DISPLAYING TITLE IN DROP DOWN TEMPLATES LIST ========//
//==============================================================================================//
function showBar(num)
{
	var mystr = "";
	var str = "--";
	for(var i=0; i<num; i++)
	{
		mystr += str;
	}
	return mystr ;
}

//==============================================================================================//
//========================= CREATE BROWSE OBJECT FOR AJAX =======================//
//==============================================================================================//
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
 

//============================================================================================//
//========================================= BASE64 ENCODE PHP.JS =============================//
//============================================================================================//
function base64_encode(data) {
  //  discuss at: http://phpjs.org/functions/base64_encode/
  // original by: Tyler Akins (http://rumkin.com)
  // improved by: Bayron Guevara
  // improved by: Thunder.m
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Rafał Kukawski (http://kukawski.pl)
  // bugfixed by: Pellentesque Malesuada
  //   example 1: base64_encode('Kevin van Zonneveld');
  //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
  //   example 2: base64_encode('a');
  //   returns 2: 'YQ=='

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

//============================================================================================//
//========================================= BASE64 DECODE PHP.JS =============================//
//============================================================================================//

function base64_decode(data) {
  //  discuss at: http://phpjs.org/functions/base64_decode/
  // original by: Tyler Akins (http://rumkin.com)
  // improved by: Thunder.m
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Aman Gupta
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Onno Marsman
  // bugfixed by: Pellentesque Malesuada
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
  //   returns 1: 'Kevin van Zonneveld'
  //   example 2: base64_decode('YQ===');
  //   returns 2: 'a'

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    dec = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  data += '';

  do { // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;

    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);

  dec = tmp_arr.join('');

  return dec.replace(/\0+$/, '');
}

//============================================================================================//
//========================================= SEND AJAX REQUEST ================================//
//============================================================================================//
/*
mandatory 	object. It should have various properties as described below. Some are madatory and other optional
mandatory	object.actionScriptURL	=	relative path(relative to doc root of server) of page , which is to be called
						It can also be urlwith query string along
optional	object.sendMethod		=	POST/GET. Default value is post
optional	object.callType			=	ASYNC/SYNC. Default value is ASYNC
optional	object.additionalData	=	AnyData to be sent like formdata or else
optional	object.callBack			=	Any function to be called back wid response from server. If function as an object is being passed then that function must have an argument provisioning
*/
function send_remoteCall(object)
{
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
			if(xmlHttp.readyState	==	4 && xmlHttp.status	==	200)
			callBack(xmlHttp.responseText);
		}; 
	}
	xmlHttp.open(sendMethod,object.actionScriptURL,callType);
	if(additionalData != null && additionalData != undefined ){
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", additionalData.length);
		xmlHttp.setRequestHeader("Connection", "close");
	}
	xmlHttp.send(additionalData); 
}

	/********************************************************************************/
			//FUNCTION CORRESPONDING TO THAT OF PHP IN JAVASCRIPT//
	/********************************************************************************/
function json_decode (str_json)
{
  // From: http://phpjs.org/functions
  // +      original by: Public Domain (http://www.json.org/json2.js)
  // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      improved by: T.J. Leahy
  // +      improved by: Michael White
  // *        example 1: json_decode('[ 1 ]');
  // *        returns 1: true

  /*
    http://www.JSON.org/json2.js
    2008-11-19
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
  */

  var json = this.window.JSON;
  if (typeof json === 'object' && typeof json.parse === 'function') {
    try {
      return json.parse(str_json);
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        throw new Error('Unexpected error type in json_decode()');
      }
      this.php_js = this.php_js || {};
      this.php_js.last_error_json = 4; // usable by json_last_error()
      return null;
    }
  }

  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var j;
  var text = str_json;

  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.
  cx.lastIndex = 0;
  if (cx.test(text)) {
    text = text.replace(cx, function (a) {
      return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    });
  }

  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.
  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
  if ((/^[\],:{}\s]*$/).
  test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
  replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
  replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.
    j = eval('(' + text + ')');

    return j;
  }

  this.php_js = this.php_js || {};
  this.php_js.last_error_json = 4; // usable by json_last_error()
  return null;
}

function stripslashes (str) {
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Ates Goral (http://magnetiq.com)
  // +      fixed by: Mick@el
  // +   improved by: marrtins
  // +   bugfixed by: Onno Marsman
  // +   improved by: rezna
  // +   input by: Rick Waldron
  // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +   input by: Brant Messenger (http://www.brantmessenger.com/)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: stripslashes('Kevin\'s code');
  // *     returns 1: "Kevin's code"
  // *     example 2: stripslashes('Kevin\\\'s code');
  // *     returns 2: "Kevin\'s code"
  return (str + '').replace(/\\(.?)/g, function (s, n1) {
    switch (n1) {
    case '\\':
      return '\\';
    case '0':
      return '\u0000';
    case '':
      return '';
    default:
      return n1;
    }
  });
}

function wordwrap( str, width, brk, cut ) {
 
    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;
 
    if (!str) { return str; }
 
    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
 
    return str.match( RegExp(regex, 'g') ).join( brk );
 
}
//==============================================================================================//
//=================== FUNCTION TO SEARCH AN ELEMENT IF PRESENT IN ARRAY LIKE PHP ===============//
//==============================================================================================//
function in_array(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] === needle) return true;
    }
    return false;
}

//==============================================================================================//
//==== FUNCTION TO SEARCH A CASE-INSENSITIVE STRING ELEMENT IF PRESENT IN ARRAY LIKE PHP ======//
//==============================================================================================//
function stringIn_array(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
		if(needle != undefined && haystack[i] != undefined)
	        if(haystack[i].toLowerCase() == needle.toLowerCase()) return true;
    }
    return false;
}

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
//==============================================================================================//
//=================== FUNCTION TO SET BITS OF AN ARRAY HAVING SELECTIONS IN DECIMAL NUMBER======//
//==============================================================================================//
function setBitsForDecimalsInArray(arrayWithDecimalsOnly) {	//e.g. array[1,2] will return 00000011, array[1,2,3] will return 00000111, and so on
	var ResultInBits = 0;
	for(var i = 0; i < arrayWithDecimalsOnly.length; i++) {
        ResultInBits |= Math.pow(2,(arrayWithDecimalsOnly[i] - 1)).toString();
    }
    return ResultInBits;
}

function RefreshHtmlPortionsFromUrl(jqSelector, url){
	if(!IsValueNull(jqSelector) && !IsValueNull(url)) {
		
		$(jqSelector).load(document.URL +  jqSelector);
	}
}

String.prototype.wordWrap = function(m, b, c){
	var i, j, l, s, r;
	if(m < 1)
		return this;
	for(i = -1, l = (r = this.split("\n")).length; ++i < l; r[i] += s)
		for(s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : ""))
			j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length
			|| c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
	return r.join("\n");
};
//==============================================================================================//
//=================== FUNCTION TO DISALLOW  MORE THAN ONE SPACES BETWEEN NAMES==================//
//==============================================================================================//
function disallowSpacesBetweenNames(entry){
	var entry = entry.split(' ');
	var entryname = '' ;
	for(i=0;i<entry.length;i++)
	{
	   if(entry[i]!=''){
		   entryname += entry[i];
		   entryname += ' ';        
	   }
	}
	entryname = entryname.trim();
	return entryname;
}

function stopRKey(evt) { 
  var evt = (evt) ? evt : ((event) ? event : null); 
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
  if ((evt.keyCode == 13) && (node.type=="text"))  {return false;} 
} 

function convertClickToDoubleClick(src){
	$(src).dblclick();
}

$(function(){
	$('form').keypress(stopRKey);
});

/* CUSTOM JQUERY API TO UPDATE HTML ELEMENTS ON UPDATE OF DATA OBJECT
 * Requires a json object as argument
 * Binded html elements must have the custom attributes set
 * For more details read the spec of this API 
 * */
var venera_update_data	=	function(DataObjectToBind){
	if(DataObjectToBind != '' && DataObjectToBind != null && DataObjectToBind != undefined){
		$.fn.dataChange = function(){
		    var prev;
		    if ( arguments.length > 0 ){
		        prev = window["$"]["fn"][this[0].getAttribute('customValueAs')].apply(this, arguments);
		    }
		    var result = window["$"]["fn"][this[0].getAttribute('customValueAs')].apply(this, arguments);
		    if ( arguments.length > 0 && prev != window["$"]["fn"][this[0].getAttribute('customValueAs')].apply(this, arguments) ){
		        $(this).trigger("change");
		    }
		    return result;
		};
		for(key in DataObjectToBind){
			jqObject	=	$('[customValueOf="'+key+'"]');
			jqObject.dataChange(DataObjectToBind[key]);
		}
		$.fn.dataChange = null;
	}
};

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

function IsbrowserIE(){
	output	=	false;
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	var Trident = ua.indexOf("Trident");
	if (msie > 0 || Trident > 0){
		output = true;
	}
	return output;
}

$(function(){
    if(window.Alert == undefined || window.alert == null){
        Alert = function(msg){
            alert(msg);
        };
    }
});

