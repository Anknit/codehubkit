/**
* The JS file contains UI abstraction layer for bootstrap UI elements and their methods.
* @author Ankit Agarwal
* @requires [Bootstrap v3.3.5] {@link http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js}
* @version : 1.0
* 
*/
$(function(){
	if($('[data-toggle="tooltip"]').length !=0){
		$('[data-toggle="tooltip"]').tooltip();
	}
});
var gUIElement = [];

/**
 * function to apply theme to a UI element
 * @function UI_applyTheme
 * @param {string} element	jquery selector eg. #myelement,.myclass etc.
 * @param {string} theme	string value of bootstrap theme eg. 'primary','info','warning' etc.
 * @param {string} classPrefix	string value to add class for a particular bootstrap component eg. adding primary button class to a div	parameter will be 'btn-'
 * */
var UI_applyTheme	=	function(element,theme,classPrefix){
	if($(element).length == 0)
		return false;
	var Elem	=	$(element);
	classStr	=	classPrefix;
	switch (theme) {
	case 'primary':
		classStr	+=	'primary';
		break;
	case 'success':
		classStr	+=	'success';
		break;
	case 'info':
		classStr	+=	'info';
		break;
	case 'warning':
		classStr	+=	'warning';
		break;
	case 'danger':
		classStr	+=	'danger';
		break;
	default:
		classStr	+=	'default';
		break;
	}
	Elem.addClass(classStr);
};

/**
 * function to bind function to a UI element on an event
 * @function UI_bindFunction
 * @param {string} element	jquery selector eg. #myelement,.myclass etc.
 * @param {string|variable} handlerFn	function name to be called on event trigger. Can be string or function variable name eg. 'mycustomFunction' , callMyFunction etc.
 * @param {string} eventType	string value of jquery events eg. 'click','keyup','mouseover' etc.
 * */
var UI_bindFunction	=	function(element,handlerFn,eventType){
	if($(element).length == 0)
		return false;
	Elem	=	$(element);
	if($.isFunction(handlerFn) || (typeof(handlerFn) == 'string' && $.isFunction(window[handlerFn]))){
		Elem.each(function(){
			$(this).on(eventType,function(event){
				if(typeof(handlerFn) == 'string')
					window[handlerFn](event);
				else
					handlerFn(event);
			});
		});
	}
};

/** 
 * function to create a button and attach its onclick handler function
 * @function UI_createButton
 * @param {string} element	jquery selector eg. #myelement,.myclass etc.
 * @param {string} width	width of the button to be created
 * @param {string} height	height of the button to be created
 * @param {string|variable} handlerFn	function name to be called on event trigger. Can be string or function variable name eg. 'mycustomFunction' , callMyFunction etc.
 * @param {string} theme	string value of bootstrap theme to be applied on the element
 * */
var UI_createButton	=	function(element,width,height,handlerFn,theme){
	if($(element).length == 0)
		return false;
	var Elem	=	$(element);
	Elem.each(function(){
		$(this).addClass('btn');
		if(this.hasAttribute('data-button')){
			$(this).text($(this).attr('data-button'));
		}
		if(width == '' || width == null)
			width	=	'auto';
		if(height == '' || height == null)
			height	=	'auto';
		$(this).css({'width':width,'height':height});
		if(handlerFn != '' && handlerFn != null)
			UI_bindFunction($(this),handlerFn,'click');
		UI_applyTheme($(this),theme,'btn-');
	});
};

/** 
 * function to get value of an input element
 * @function UI_getInputValue
 * @param {string} element jquery selector eg. #myelement,.myclass etc.
 * @param {string} valType output format eg. 'string', 'int', 'float' or 'bool'
 * */
var UI_getInputValue	=	function(element,valType){
	if($(element).length == 0)
		return false;
	var Elem	=	$(element);
	var ElemVal;
	switch (valType) {
	case 'string':
		ElemVal	=	Elem.val();
		break;
	case 'int':
		ElemVal	=	parseInt(Elem.val());
		break;
	case 'float':
		ElemVal	=	parseFloat(Elem.val());
		break;
	case 'bool':
		switch(Elem.attr('type')){
		case 'checkbox':
			ElemVal	=	Elem.prop('checked');
			break;
		case 'radio':
			ElemVal	=	Elem.prop('selected');
		default:
			if((Elem.val() == '') || (Elem.val() == null)|| (Elem.val() == undefined)){
				ElemVal	=	false;
			}
			else{
				ElemVal	=	true;
			}
			break;
		}
		break;
	default:
		ElemVal	=	Elem.val();
		break;
	}
};
/** 
 * function to create a modal div from html structure 
 * @function UI_createModal
 * @param {string} element jquery selector of container element of modal window
 * @param {string} mBody plain html string Or it can be a jquery selector of an element present in the DOM whose html can be inserted in the body of modal
 * @param {string} mHead plain html string Or it can be a jquery selector of an element present in the DOM whose html can be inserted in the head of modal
 * @param {string} mFoot plain html string Or it can be a jquery selector of an element present in the DOM whose html can be inserted in the foot of modal
 * @param {string|variable} openhandlerFn function name to be called on open modal event trigger. Can be string or function variable name eg. 'mycustomFunction' , callMyFunction etc.
 * @param {boolean} initState initial state of the modal window to be open on create or not
 * @param {string|variable} closehandlerFn function name to be called on close modal event trigger. Can be string or function variable name eg. 'mycustomFunction' , callMyFunction etc.
 * */
var UI_createModal			=	function(element,mBody,mHead,mFoot,openhandlerFn,initState,closehandlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.addClass('modal fade');
	Elem.attr({'role':'dialog','aria-labelledby':'bsUIModal'});
	if(($('body').find($(mHead)).length == 0 )&& (typeof(mHead) == 'string')){
		Elem.append(mHead);
	}
	else if($('body').find($(mHead)).length !=0){
		Elem.append($(mHead)[0].outerHTML);
		$(mHead).remove();
	}
	if(($('body').find($(mBody)).length ==0) && (typeof(mBody) == 'string')){
		Elem.append(mBody);
	}
	else if($('body').find($(mBody)).length !=0){
		Elem.append($(mBody)[0].outerHTML);
		$(mBody).remove();
	}
	if(($('body').find($(mFoot)).length ==0) && (typeof(mFoot) == 'string')){
		Elem.append(mFoot);
	}
	else if($('body').find($(mFoot)).length !=0){
		Elem.append($(mFoot)[0].outerHTML);
		$(mFoot).remove();
	}
	if(Elem.find('.modal-dialog').length == 0){
		Elem.children().wrapAll('<div class="modal-dialog" role="document"></div>');
	}
	var modalDialog		=	Elem.find('.modal-dialog');
	if(Elem.find('.modal-content').length == 0)
		modalDialog.children().wrapAll('<div class="modal-content"></div>');
	var modalContent	=	Elem.find('.modal-content');
	if(Elem.find('.modal-header').length == 0)
		modalContent.children().eq(0).wrap('<div class="modal-header"></div>');
	var modalHeader		=	Elem.find('.modal-header');
	if(Elem.find('.modal-body').length == 0)
		modalContent.children().eq(1).wrap('<div class="modal-body"></div>');
	var modalBody		=	Elem.find('.modal-body');
	if(Elem.find('.modal-footer').length == 0)
		modalContent.children().eq(2).wrap('<div class="modal-footer"></div>');
	var modalFooter		=	Elem.find('.modal-footer');
	modalHeader.prepend('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button>');
	if(openhandlerFn)
		UI_bindFunction(Elem,openhandlerFn,'show.bs.modal');
	if(closehandlerFn)
		UI_bindFunction(Elem,closehandlerFn,'hide.bs.modal');
	if(initState){
		Elem.modal('show');
	}
};

/** 
 * function to bind a ui element to open modal div
 * @function UI_bindModalButton
 * @requires UI_createModal Modal must be created before invoking this function
 * @param {string} buttonElem jquery selector of the UI button element whose click opens the modal window
 * @param {string} modalElem jquery selector of the modal window to be open on button click
 * */
var UI_bindModalButton		=	function(buttonElem,modalElem){
	$(buttonElem).attr({'data-toggle':'modal', 'data-target':modalElem});
};
var UI_openModal			=	function(modalElem){
	$(modalElem).modal('show');
};
var UI_closeModal			=	function(modalElem){
	$(modalElem).modal('hide');
};
var UI_resetModal			=	function(modalElem,resetHandler){
	$(modalElem).find('.modal-header,.modal-body,.modal-footer').html('');
	if(resetHandler)
		$(modalElem).off('show.bs.modal');
};

var UI_createTooltip		=	function(element,toolTip,toolTipPosition,handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		if(this.hasAttribute('title')){
			$(this).attr('data-title',$(this).attr('title'));
		}
		else if(this.hasAttribute(toolTip)){
			$(this).attr('data-title',$(this).attr(toolTip));
		}
		else {
			$(this).attr('data-title',toolTip);
		}
		if(toolTipPosition == '' || toolTipPosition == null || toolTipPosition == undefined)
			toolTipPosition = 'bottom';
		$(this).attr({'data-html':true,'data-toggle':'tooltip','data-placement':toolTipPosition});
	});
	Elem.tooltip();
	if(handlerFn){
		UI_bindFunction(Elem,handlerFn,'show.bs.tooltip');
	}
};
var UI_showTooltip			=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.tooltip('show');
};
var UI_hideTooltip			=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.tooltip('hide');
	
};
var UI_toggleTooltip			=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.tooltip('toggle');
	
};
var UI_destroyTooltip		=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.tooltip('destroy');
	
};

var UI_createTextBox		=	function(element,inputType,inputLabel,inputPlaceholder){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('form-group');
		if(inputType == '' || inputType == null || inputType == undefined){
			inputType = 'text';
		}
		if(this.hasAttribute(inputLabel)){
			$(this).append('<label for="'+$(this).attr("id")+'">'+$(this).attr(inputLabel)+'</label>');
		}
		else if(this.hasAttribute('data-label')){
			$(this).append('<label for="'+$(this).attr("id")+'">'+$(this).attr('data-label')+'</label>');
		}
		else if(inputLabel != '' && inputLabel != null && inputLabel != undefined){
			$(this).append('<label for="'+$(this).attr("id")+'">'+inputLabel+'</label>');
		}
		if(this.hasAttribute(inputPlaceholder)){
			inputPlaceholder	=	$(this).attr(inputPlaceholder);
		}
		else if(this.hasAttribute('data-placeholder')){
			inputPlaceholder	=	$(this).attr('data-placeholder');
		}
		else if(inputPlaceholder == '' || inputPlaceholder == null || inputPlaceholder == undefined){
			inputPlaceholder	=	'';
		}
		$(this).append('<input type="'+inputType+'" class="form-control" placeholder="'+inputPlaceholder+'" id="'+$(this).attr("id")+'" />');
		$(this).removeAttr('id');
	});
};
var UI_preAddon				=	function(element, addOn, formControl, handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(formControl){
		Elem.each(function(){
			$(this).parent('.form-group').addClass('has-feedback');
			if(addOn.indexOf('glyphicon') != -1){
				$(this).before('<span class="glyphicon '+addOn+' form-control-feedback" aria-hidden="true"></span>');
			}
			else{
				$(this).before('<span class="form-control-feedback" aria-hidden="true">'+addOn+'</span>');
			}
		});
	}
	else{
		Elem.each(function(){
			if(!$(this).parent().hasClass('input-group'))
				$(this).wrap('<div class="input-group"></div>');
			if(addOn.indexOf('glyphicon') != -1){
				$(this).before('<div class="input-group-addon"><span class="glyphicon '+addOn+' " aria-hidden="true"></span></div>');
			}
			else{
				$(this).before('<div class="input-group-addon">'+addOn+'</div>');
			}
			
		});
	}
	if(handlerFn){
		Elem.each(function(){
			UI_bindFunction(Elem.before(),handlerFn,'click');
		});
	}
};
var UI_postAddon			=	function(element, addOn, formControl, handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(formControl){
		Elem.each(function(){
			$(this).parent('.form-group').addClass('has-feedback');
			if(addOn.indexOf('glyphicon') != -1){
				$(this).after('<span class="glyphicon '+addOn+' form-control-feedback" aria-hidden="true"></span>');
			}
			else{
				$(this).after('<span class="form-control-feedback" aria-hidden="true">'+addOn+'</span>');
			}
		});
	}
	else{
		Elem.each(function(){
			if(!$(this).parent().hasClass('input-group'))
				$(this).wrap('<div class="input-group"></div>');
			if(addOn.indexOf('glyphicon') != -1){
				$(this).after('<div class="input-group-addon"><span class="glyphicon '+addOn+' " aria-hidden="true"></span></div>');
			}
			else{
				$(this).after('<div class="input-group-addon">'+addOn+'</div>');
			}
			
		});
	}
	if(handlerFn){
		Elem.each(function(){
			UI_bindFunction(Elem.next(),handlerFn,'click');
		});
	}
};
var UI_createCheckBox		=	function(element,handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('checkbox');
		$(this).append('<label><input type="checkbox" id="'+$(this).attr("id")+'"/>'+$(this).attr("data-label")+'</label>');
		$(this).removeAttr('id');
	});
	if(handlerFn){
		UI_bindFunction(Elem,handlerFn,'change');
	}
};
var UI_createRadioBox		=	function(element,handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('radio');
		$(this).append('<label><input type="radio" name="'+$(this).attr("name")+'" id="'+$(this).attr("id")+'" value="'+$(this).attr("data-value")+'" />'+$(this).attr("data-label")+'</label>');
		if(this.hasAttribute('checked')){
			$(this).find('input[type="radio"]').attr('checked',true);
		}
		$(this).removeAttr('name id value');
	});
	if(handlerFn){
		UI_bindFunction(Elem,handlerFn,'change');
	}
};

var UI_openBlockingDiv	=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.modal('show');
};
var UI_closeBlockingDiv	=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.modal('hide');
};

var UI_setInputValue		=	function(element,value,inputType){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(inputType == "checkbox" || inputType == "radio"){
		Elem.prop('checked',value);
	}
	else{
		Elem.val(value);
	}
};

var UI_createTable			=	function(element,tableData,tableStyle){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('table-responsive');
		$(this).append('<table class="table" id="'+$(this).attr("id")+'"><thead></thead><tbody></tbody></table>');
		var theadElem	=	$(this).find('thead');
		var tbodyElem	=	$(this).find('tbody');
		var rowLength	=	tableData.length;
		var colLength	=	tableData[0].length;
		var rowData;
		var rowElem;
		for(var i=0;i<rowLength;i++){
			rowData	=	tableData[i];
			if(i>0){
				tbodyElem.append('<tr></tr>');
				rowElem	=	tbodyElem.find('tr:last-child');
				for(var j=0;j<colLength;j++){
					rowElem.append('<td>'+rowData[j]+'</td>');
				}
			}
			else{
				theadElem.append('<tr></tr>');
				rowElem	=	theadElem.find('tr');
				for(var j=0;j<colLength;j++){
					rowElem.append('<th>'+rowData[j]+'</th>');
				}
			}
		}
		if(tableStyle != '' && tableStyle != null || tableStyle != undefined){
			$(this).find('.table').addClass(tableStyle);
		}
	});
};

var UI_createTabs			=	function(element,handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('tab-content');
		var tabsArr	=	$(this).children();
		if(tabsArr.length>0){
			var ulElem	=	$('<ul class="nav nav-tabs" role="tablist"></ul>');
			$(this).before(ulElem);
			tabsArr.each(function(){
				$(this).attr('role','tabpanel').addClass('tab-pane');
				ulElem.append('<li role="presentation"><a class="'+$(this).attr('class')+'" href="#'+$(this).attr("id")+'" aria-controls="'+$(this).attr("id")+'" role="tab" data-toggle="tab">'+$(this).attr("data-label")+'</a></li>');
			});
			ulElem.find('li:first-child').addClass('active');
			tabsArr.eq(0).addClass('active');
		}
	});
	if(handlerFn){
		UI_bindFunction(Elem.prev('[role="tablist"]').find('[data-toggle="tab"]'),handlerFn,'show.bs.tab');
	}
};

var UI_showTab				=	function(element){
	if($('[href="#'+element+'"]').length == 0)
		return false;
//	var Elem =	$(element);
	$('[href="#'+element+'"]').tab('show');
};

var UI_createNavBar			=	function(element,jsonDataObj,theme){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(jsonDataObj){
		UI_createJsonUL(element,jsonDataObj);
	}
	Elem.addClass('collapse navbar-collapse');
	Elem.children('ul').addClass('nav navbar-nav');
	Elem.wrap('<nav class="navbar"><div class="container-fluid"></div></nav>');
	Elem.before('<div class="navbar-header">' +
			'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#'+Elem.attr("id")+'"' +  
			'aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar">' +
			'</span><span class="icon-bar"></span><span class="icon-bar"></span></button>' +
			'<a class="navbar-brand" href="#">MAS</a></div>');
	var menuElem	=	Elem.find('ul.nav.navbar-nav > li');
	menuElem.each(function(){
		if($(this).find('ul').length > 0){
			$(this).addClass('dropdown');
			$(this).children('a').addClass('dropdown-toggle').attr({'data-toggle':'dropdown','role':'button','aria-haspopup':true}).append('<span class="caret"></span>');
			$(this).children('ul').addClass('dropdown-menu');
		}
	});
	UI_applyTheme('nav.navbar',theme,'navbar-fixed-top navbar-')
};
var UI_createJsonUL			=	function(element,jsonDataObj){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	var ulElem		=	$('<ul></ul>');
	Elem.append(ulElem);
	if(jsonDataObj['attr']){
		ulElem.attr(jsonDataObj['attr']);
	}
	if(jsonDataObj['class']){
		ulElem.addClass(jsonDataObj['class']);
	}
	var liDataArr	=	jsonDataObj['html'];
	for(var i=0;i<liDataArr.length;i++){
		ulElem.append('<li><a></a></li>');
		ulElem.find('li:last-child').find('a').attr('href',liDataArr[i]["link"]).text(liDataArr[i]["label"]);
		if(liDataArr[i]['attr']){
			ulElem.find('li').eq(i).attr(liDataArr[i]['attr']);
		}
		if(liDataArr[i]['css']){
			ulElem.find('li').eq(i).attr(liDataArr[i]['css']);
		}
		if(liDataArr[i]['class']){
			ulElem.find('li').eq(i).addClass(liDataArr[i]['class']);
		}
		if(liDataArr[i]['dropdowndata']){
			ulElem.find('li').eq(i).append('<ul></ul>');
			var dropDownUl	=	ulElem.find('li').eq(i).children('ul');
			var dropdowndata	=	liDataArr[i]['dropdowndata'];
			for(var j=0;j<dropdowndata.length;j++){
				dropDownUl.append('<li><a></a></li>');
				dropDownUl.find('li:last-child').find('a').attr('href',dropdowndata[j]["link"]).text(dropdowndata[j]["label"]);
				if(dropdowndata[j]['attr']){
					dropDownUl.find('li').eq(j).attr(dropdowndata[j]['attr']);
				}
				if(dropdowndata[j]['css']){
					dropDownUl.find('li').eq(j).attr(dropdowndata[j]['css']);
				}
				if(dropdowndata[j]['class']){
					dropDownUl.find('li').eq(j).addClass(dropdowndata[j]['class']);
				}
			}
		}
	}
};

var UI_createDropdown		=	function(element,jsonDataObj,dropupFlag){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(jsonDataObj){
		UI_createJsonUL(element,jsonDataObj);
	}
	Elem.addClass("btn-group");
    if(dropupFlag){
	   Elem.addClass("dropup");
    }
	Elem.prepend('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+Elem.attr("data-label")+'<span class="caret"></span></button>');
	Elem.find('ul').addClass("dropdown-menu");
};

var UI_createGrid			=	function(){
	
};
var UI_refreshGrid			=	function(){
	
};


var UI_destroyModal			=	function(){
	
};
var UI_setTooltip			=	function(){
	
};
var UI_createTextArea		=	function(){
	
};
var UI_createSelectBox		=	function(){
	
};
var UI_resetInputValue		=	function(){
	
};
var UI_createCustomScroll	=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element).addClass('scrolltargetElement');
	if(!Elem.parent().hasClass('ui_scroll_custom')){
		Elem.wrap('<div class="ui_scroll_custom"></div>');
		var scrollContainer = $(element).closest('.ui_scroll_custom');
		scrollContainer.append('<div class="scrollbar"><div class="scroller"></div></div>');
	}
	else{
		var scrollContainer = $(element).closest('.ui_scroll_custom');
	}
	Elem.css({'margin-right':'-30px','padding-right':'30px','overflow':'auto','-webkit-user-select':'none','-moz-user-select':'none','-ms-user-select':'none','user-select':'none'});
	var scrollElem	 = scrollContainer.find('.scroller'); 
	var scrollBar	 = scrollContainer.find('.scrollbar');
	scrollBar.on('click',function(event){
		var scrollerHeight = $(this).find('.scroller').css('height');
		var tarElem = $(this).closest('.ui_scroll_custom').find('.scrolltargetElement');
		tarElem.animate({'scrollTop':((event.offsetY-(parseInt(scrollerHeight)/2))*tarElem[0].scrollHeight/tarElem[0].clientHeight)});
	});
	scrollElem.css('height',Elem[0].clientHeight*Elem[0].clientHeight/Elem[0].scrollHeight+'px');
	scrollElem.css('top',Elem[0].scrollTop*Elem[0].clientHeight/Elem[0].scrollHeight+'px');
	Elem.on('scroll',function(){
		Elem.closest('.ui_scroll_custom').find('.scroller').css('top',Elem[0].scrollTop*Elem[0].clientHeight/Elem[0].scrollHeight+'px');
	});
};
var UI_alert    =   function(message){
    if($('#alert-box-container').length == 0){
        $('footer').append('<div id="alert-box-container" data-keyboard=false data-backdrop="static"><div></div><div></div><div></div></div>');
        UI_createModal('#alert-box-container');
    }
    var alertContainer  =   $('#alert-box-container');
    alertContainer.find('.modal-header > div:last-child').html('<div class="alert alert-warning" role="alert"><a href="#" class="alert-link">'+message+'</a></div>');
    alertContainer.find('.modal-footer > div:last-child').html('<button class="btn btn-primary btn-small" onclick="UI_closeModal(\'#alert-box-container\')">OK</button>');
    UI_openModal('#alert-box-container');
//    alert(message);
};