// function to create a jqx window
/*Arguments => object :   id of this object is mandatory and the id will be of a DIV
 * 							This DIV must content two child Div
 * 							1. Header Div for Window Title
 * 							2. Content Div for the content of the window
 * 			=> object.Bindings : jquery function to be binded with the content in the window(if any)  
 * 			=> object.Position : 'center' , 'left' , 'right' , 'top' (multiple values are allowed)
 * 
*/
function createWindow(object){
	var Height = 400, Width	= 550, Position	=	'center', Bindings	=	function(){}, Heading	= "Venera Technologies";
	if(IsValueNull(object.id))
		return false;
	else{
		if(!IsValueNull(object.Heading))
			Heading	=	object.Heading;
		if(object.ok != "")
			var okbuttonID = object.ok;
		if(object.cancel != "")
			var cancelbuttonID = object.cancel;
		if(!IsValueNull(object.WindowHeight))
			Height	=	object.WindowHeight;
		if(!IsValueNull(object.WindowWidth))
			Width	=	object.WindowWidth;
			
		var ContentDiv	= $(object.id).wrap('<div class="windowContentDiv">').parent('div');
		var HeaderDiv	= $(ContentDiv).before('<div class="windowHeaderDiv">'+Heading+'</div>').prev('div');
		var OuterDiv	= $('<div>');
		$(OuterDiv).append(HeaderDiv);
		$(OuterDiv).append(ContentDiv);
		
		if(!IsValueNull(object.Height))
			Height		=	object.Height;
		if(!IsValueNull(object.Width))
			Width		=	object.Width;
		if(!IsValueNull(object.Position))
			Position	=	object.Position;
		if(!IsValueNull(object.Bindings))
			Bindings	=	object.Bindings;
			
		$(OuterDiv).jqxWindow({
		    height: Height,
		    width: Width,
		    theme: JQXTHEME,
		    position: Position,
		    autoOpen: false,
		    isModal: true,
		    modalOpacity:0.1,
		    initContent : Bindings,
		    resizable: false,
		    draggable: false,
		    okButton: $('#'+okbuttonID)
		});
	    var cancelButton	=	'#'+cancelbuttonID;
		$(OuterDiv).jqxWindow('open');
		$(cancelButton).on('click', function (event) { 
			$(OuterDiv).jqxWindow('close');
		}); 
/*		$(OuterDiv).on('close', function (event) { 
			refreshdata(object.tab); 
		});
*/	}
}

var SetJqxDropDownItemsByValuesList	=	function (ElemSelector, CommaSeparatedItemValues) {
	var TurnCheckOnListValues	=	CommaSeparatedItemValues.split(',');
	for(var i = 0; i< TurnCheckOnListValues.length; i++) {
		if(TurnCheckOnListValues[i] != "" && TurnCheckOnListValues[i] != undefined && TurnCheckOnListValues[i] != null)
		//Get item by value
		var Item	=	$(ElemSelector).jqxDropDownList('getItemByValue', TurnCheckOnListValues[i]);
		if(Item != null && Item != undefined) {
			//Look for its index
			var Index	=	Item.index;
			//Checkitem by its index
			$(ElemSelector).jqxDropDownList('checkIndex', Index);
			if($(Item.originalItem.originalItem).attr('Disable')) {
				$(ElemSelector).jqxDropDownList('disableAt', Index);
			}
		}
	}
	
	TurnCheckOnListValues	=	null;
	Item	=	null;
	Index	=	null;
};