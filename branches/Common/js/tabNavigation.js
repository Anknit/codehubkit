/*
Project Name       	: 	Pulsar - Content Verification System
File Or Class Name 	: 	tabNavigation.js
Description			: 	Tab based navigation
Copyright          	:	Copyright © 2009 - 2014 Venera Technologies.
*/

//==================================================================================================//
//========================== FUNCTION TO DISPLAY TAB BASED NAVIGATION IN TEMPLATE ==================//
//==================================================================================================//

function ManageTabPanelDisplay()
{
	var idlist = new Array('tab1focus','tab2focus','tab3focus','tab1ready','tab2ready','tab3ready','content1','content2','content3');

	// No other customizations are necessary.
	if(arguments.length < 1) { return; }
	for(var i = 0; i < idlist.length; i++) {
	   var block = false;
	   for(var ii = 0; ii < arguments.length; ii++) {
		  if(idlist[i] == arguments[ii]) {
			 block = true;
			 break;
			 }
		  }
	   if(block) { document.getElementById(idlist[i]).style.display = "block"; }
	   else { document.getElementById(idlist[i]).style.display = "none"; }
	   }
}