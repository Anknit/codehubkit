/*
Project Name       	: 	Pulsar - Content Verification System
File Or Class Name 	: 	dropDownMoveColor.js
Description			: 	Move the color name from main list to another temporary list.
Copyright          	:	Copyright © 2009 - 2014 Venera Technologies.
*/

//======================================================================================================//
//================== UTILITY FUNCTION TO DETERMINE IF A SELECT OBJECT HAS AN OPTION ARRAY ==============//
//======================================================================================================//

function hasOptions(obj) 
{
	if (obj!=null && obj.options!=null) { return true; }
	return false;
}

//======================================================================================================//
//============================== FUNCTION : AVOIDE DUPLICATION  ========================================//
//======================================================================================================//

function selectUnselectMatchingOptions(obj,regex,which,only)
{
	if (window.RegExp) {
		if (which == "select") {
			var selected1=true;
			var selected2=false;
			}
		else if (which == "unselect") {
			var selected1=false;
			var selected2=true;
			}
		else {
			return;
			}
		var re = new RegExp(regex);
		if (!hasOptions(obj)) { return; }
		for (var i=0; i<obj.options.length; i++) {
			if (re.test(obj.options[i].text)) {
				obj.options[i].selected = selected1;
				}
			else {
				if (only == true) {
					obj.options[i].selected = selected2;
					}
				}
			}
		}
}

//======================================================================================================//
//========================= FUNCTION : TO SELECT ALL OPTIONS  ==========================================//
//======================================================================================================//

function selectMatchingOptions(obj,regex)
{
	selectUnselectMatchingOptions(obj,regex,"select",false);
}

//======================================================================================================//
//================= FUNCTION : TO SELECT ALL OPTIONS THAT MATCH THE REGULAR EXPRESSION =================//
//======================================================================================================//

function selectOnlyMatchingOptions(obj,regex)
{
	selectUnselectMatchingOptions(obj,regex,"select",true);
}

//======================================================================================================//
//================= FUNCTION : TO UNSELECT ALL OPTIONS THAT MATCH THE REGULAR EXPRESSION ===============//
//======================================================================================================//

function unSelectMatchingOptions(obj,regex)
{
	selectUnselectMatchingOptions(obj,regex,"unselect",false);
}

//======================================================================================================//
//================= FUNCTION : COPY OPTIONS BETWEEN SELECT BOXES INSTEAD OF MOVING ITEMS ===============//
//======================================================================================================//

function copySelectedOptions(from,to)
{
	var options = new Object();
	if (hasOptions(to)) {
		for (var i=0; i<to.options.length; i++) {
			options[to.options[i].value] = to.options[i].text;
			}
		}
	if (!hasOptions(from)) { return; }
	for (var i=0; i<from.options.length; i++) {
		var o = from.options[i];
		if (o.selected) {
			if (options[o.value] == null || options[o.value] == "undefined" || options[o.value]!=o.text) {
				if (!hasOptions(to)) { var index = 0; } else { var index=to.options.length; }
				to.options[index] = new Option( o.text, o.value, false, false);
				}
			}
		}
	if ((arguments.length<3) || (arguments[2]==true)) {
		sortSelect(to);
		}
	from.selectedIndex = -1;
	to.selectedIndex = -1;
}

//======================================================================================================//
//================= FUNCTION : REMOVE ALL SELECTED OPTION FROM A LIST  =================================//
//======================================================================================================//

function removeSelectedOptions(from)
{ 
	if (!hasOptions(from)) { return; }
	if (from.type=="select-one") {
		from.options[from.selectedIndex] = null;
		}
	else {
		for (var i=(from.options.length-1); i>=0; i--) { 
			var o=from.options[i]; 
			if (o.selected) { 
				from.options[i] = null; 
				} 
			}
		}
	from.selectedIndex = -1; 
} 

//======================================================================================================//
//================= FUNCTION : REMOVE ALL SELECTED OPTION FROM A LIST  =================================//
//======================================================================================================//
	
function removeSelectedOptionsFromOther(from1,from2,id)
{ 
	
} 

//======================================================================================================//
//================================= FUNCTION : ADD OPTION IN THE LIST  =================================//
//======================================================================================================//

function addOption(obj,text,value,selected)
{
	if (obj!=null && obj.options!=null) 
	{
		obj.options[obj.options.length] = new Option(text, value, false, selected);
	}
}