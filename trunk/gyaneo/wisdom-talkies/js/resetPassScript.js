var mainApp =   mainApp || {};

mainApp.historyModule   =   function(){
    this.parseCurrentUrl   =     function(){
        var urlSearchString =   document.location.href.replace(document.baseURI,'');
        var urlParamArr =   {};
        var paramKey,paramValue;
        if(urlSearchString.indexOf('/') != -1){
            var urlParams   =   urlSearchString.split('/');
            urlSearchString =   urlParams[urlParams.length-1];
            var urlParams   =   urlSearchString.split(/[&?]+/);
            for(var i=0;i<urlParams.length;i++){
                if(urlParams[i].indexOf('=') != -1){
                    paramKey    =   urlParams[i].split('=')[0];
                    paramValue    =   urlParams[i].split('=')[1];
                    urlParamArr[paramKey]   =   decodeURIComponent(paramValue);
                }
            }
        }
        return urlParamArr;
    };
    this.addPopStateListener	=	function(){
        window.addEventListener('popstate', function(event){
            mainAppVars.popstate	=	true;
            this.updateContent(event.state);
        });
    };
    this.updateContent   =   function(histState){
        if (histState == null){
            return;
        }
    };
};
var mainApp =   mainApp || {};

mainApp.searchModule    =   function(){
    
    this.searchKeyword          =   function(){
        mainAppVars.searchOssOnly   =   false;
        mainAppVars.searchExtOnly   =   false;
        this.searchObject   =   {getData:'list',search:mainAppVars.searchInputText};
        if(mainAppVars.searchCategory && !IsValueNull(mainAppVars.searchCategory)){
            this.searchObject['catfilter']  =   mainAppVars.searchCategory;
        }
        if(mainAppVars.searchAge){
            mainAppVars.searchOssOnly   =   true;
            this.searchObject['agefilter']  =   mainAppVars.searchAge;
        }
        if(mainAppVars.searchLanguage){
            mainAppVars.searchOssOnly   =   true;
            this.searchObject['langfilter']  =   mainAppVars.searchLanguage;
        }
        if(mainAppVars.searchStart){
            this.searchObject['start']  =   mainAppVars.searchStart;
        }
        if(mainAppVars.currentVideoId != ""){
            this.searchObject['videoid']  =   mainAppVars.videoSourceId;
        }
        if(mainAppVars.nochildfilter){
            this.searchObject['filter']  =   'strict';
        }
        if(contributeFlag){
            mainAppVars.searchExtOnly   =   true;
            this.searchKeywordExt();
        }
        else{
            this.searchKeywordOSS();
            if(mainAppVars.listEXT.length == 0){
                this.searchKeywordExt();
            }
        }
    };  
    this.searchCategory         =   function(){
        mainAppVars.searchOssOnly   =   true;
        mainAppVars.listEXT =   [];
        this.searchObject   =   {getData:'list',category:mainAppVars.searchCategory};
        if(mainAppVars.searchAge){
            this.searchObject['agefilter']  =   mainAppVars.searchAge;
        }
        if(mainAppVars.nochildfilter){
            this.searchObject['catfilter']  =   'other';
        }
        if(mainAppVars.searchLanguage){
            this.searchObject['langfilter']  =   mainAppVars.searchLanguage;
        }
        if(mainAppVars.searchStart){
            this.searchObject['start']  =   mainAppVars.searchStart;
        }
        if(mainAppVars.currentVideoId != ""){
            this.searchObject['videoid']  =   mainAppVars.videoSourceId;
        }
    	var xhrObj = new CommonUtils.remoteCallClass();
        var dataObj =   this.searchObject;
        dataObj	['server']	=	'opensearch';
        xhrObj.requestData	=	{'request':'search_data','data':dataObj};
        xhrObj.asyncGetRequest("./"+dataRequestURL,this.ListRequestCallback);
        UI_blockInterface();
    };
    this.getCurrentVideoData    =   function(){
        if(mainAppVars.currentVideoId){
            var xhrObj  = new CommonUtils.remoteCallClass();
            var dataObj =   {videoid:mainAppVars.currentVideoId};
            dataObj	['server']	=	'opensearch';
            if(mainAppVars.currentVideoId.indexOf('yt-') == 0){
                dataObj	['server']	=	'youtube';
            }
            xhrObj.requestData	=	{'request':'getVideoData','data':dataObj};
            xhrObj.asyncGetRequest("./"+dataRequestURL,this.ListRequestCallback);
            UI_blockInterface();
        }
    };
    this.searchKeywordOSS       =   function(){
    	var xhrObj = new CommonUtils.remoteCallClass();
        var dataObj =   this.searchObject;
        dataObj	['server']	=	'opensearch';
        xhrObj.requestData	=	{'request':'search_data','data':dataObj};
        xhrObj.asyncGetRequest("./"+dataRequestURL,this.ListRequestCallback);
        UI_blockInterface();

    };
    this.searchKeywordExt       =   function(){
        var cat_name	=	"";
        if(!IsValueNull($('#searchBoxCat > button').attr('catfilter')) && $('#searchBoxCat > button').attr('catfilter') != "0"){
            mainAppVars.searchCategory   = $('#searchBoxCat > button').attr('catfilter');
            cat_name		=	mainAppVars.catNameObject[mainAppVars.searchCategory];
        }
        if(IsValueNull($('#head').scope().is_learn_selected)){
            var xhrObj 			=	new CommonUtils.remoteCallClass();
            xhrObj.requestData	=	{'request':'search_data','data':{'server':'youtube','getData':'list','rows':50,'search':(cat_name+" "+mainAppVars.searchInputText).trim()}};
            xhrObj.asyncGetRequest("./"+dataRequestURL,this.KeywordYoutubeCallback);
        }
        else{
            mainAppVars.learningKeywordCount = 0;
            mainAppVars.tempYoutubeDataArr  =   [];
            for(i=0; i<mainAppVars.learn_keywords.length; i++){
                var xhrObj 			=	new CommonUtils.remoteCallClass();
                xhrObj.requestData	=	{'request':'search_data','data':{'server':'youtube','getData':'list','rows':10,'search':(mainAppVars.learn_keywords[i]+" "+mainAppVars.searchInputText+" "+cat_name).trim()}};
                xhrObj.asyncGetRequest("./"+dataRequestURL,this.KeywordYoutubeCallback);
            }
        }
    };
    this.searchAutoComplete     =   function(){
        this.searchObject   =   {getData:'autocomplete',search:mainAppVars.searchInputText};
        var dataObj	=	this.searchObject;
        if(!contributeFlag){
            dataObj['server']   =   'opensearch';
        }
        else{
            dataObj['server']   =   'youtube';
        }
        var xhrObj  = new CommonUtils.remoteCallClass();
        xhrObj.requestData	=	{'request':'search_data','data':dataObj};
        xhrObj.asyncPostRequest('./'+dataRequestURL,this.autoCompleteRequestCallback);
    };
    this.autoCompleteRequestCallback	=	function(response){
        response    =   JSON.parse(response);
        var validateResponseCheck   =   validateAppResponse(response);
        var dataList    =   $('#searchData');
        if(validateResponseCheck){
            var searchJson    =   response.data;
            if(IsValueNull(searchJson))
                return false;
            if(!searchJson['terms']){
                dataList.html('');
                return false;
            }
            for(var i=0;i<searchJson['terms'].length;i++){
                if(dataList.find('option').length <= i){
                    dataList.append('<option></option>');
                }
                dataList.find('option').eq(i).html(searchJson['terms'][i]);
            }
            dataList.find('option:gt('+(i-1)+')').remove();
        }
        else{
            console.log(response);
        }
    };
    this.ListRequestCallback	=	function(response){
        progressChange(70);
        response = JSON.parse(response);
        var validateResponseCheck   =   validateAppResponse(response);
        if(validateResponseCheck){
            response    =   response.data;
            /*
             * testing for removing data whose category is not same as the category of first data
             */
/*
            if(typeof(response.documents)	!=	"undefined")
            {
                var temp_check	=	false;
                var parent_cat	=	false;
                for(i=0;	i<response.documents.length;	i++)
                {
                    if(!temp_check)
                    {
                        if(response.documents[i]['snippets'][2]['fieldName']	!=	"category")
                        {
                            response.documents.splice(i,1);
                            response.numFound--;
                            i--;
                        }
                        else
                        {
                            parent_cat	=	parentCatObj[response.documents[i]['snippets'][2]['values'][0]]
                            if(typeof(parent_cat)	==	"undefined")
                            {
                                parent_cat	=	response.documents[i]['snippets'][2]['values'][0];
                            }
                            temp_check	=	true;
                        }
                    }
                    else
                    {
                        if(response.documents[i]['snippets'][2]['fieldName']	!=	"category"	||	(parentCatObj[response.documents[i]['snippets'][2]['values'][0]]	!=	parent_cat	&&	typeof(parentCatObj[response.documents[i]['snippets'][2]['values'][0]])	!=	"undefined")	||	(typeof(parentCatObj[response.documents[i]['snippets'][2]['values'][0]])	==	"undefined"	&&	response.documents[i]['snippets'][2]['values'][0]	!=	parent_cat))
                        {
                            response.documents.splice(i,1);
                            response.numFound--;
                            i--;        			
                        }	
                    }
                }
            }
*/
            var listClassObject =   new mainApp.listModule();
            listClassObject.createListOSS(response);
        }
        else{
            console.log(response);
        }
    };
    this.KeywordYoutubeCallback	=	function(response){
        response 					= JSON.parse(response);
        var validateResponseCheck   =   validateAppResponse(response);
        if(validateResponseCheck	&&	IsValueNull($('#head').scope().is_learn_selected)){
            mainAppVars.tempYoutubeDataArr	=	response.data;
            var listClassObject =   new mainApp.listModule();
            listClassObject.createListExt(mainAppVars.tempYoutubeDataArr);
            mainAppVars.learningKeywordCount = 0;
            mainAppVars.tempYoutubeDataArr = [];
        }
        else if(validateResponseCheck	&&	!IsValueNull($('#head').scope().is_learn_selected))
        {
            if(IsValueNull(mainAppVars.tempYoutubeDataArr.documents)){
                mainAppVars.tempYoutubeDataArr = response.data;
            }
            else{
                mainAppVars.tempYoutubeDataArr.documents 		=	mainAppVars.tempYoutubeDataArr.documents.concat(response.data.documents);
                mainAppVars.tempYoutubeDataArr.videoIdListStr	+=	','+response.data.videoIdListStr;
            }
            
            mainAppVars.learningKeywordCount++;
            if(mainAppVars.learningKeywordCount == 3){
                var temp_docs								=	mainAppVars.tempYoutubeDataArr['documents'];
                var temp_docs_length						=	temp_docs.length;
                var temp_data   =   [];
                if(!IsValueNull(mainAppVars.tempYoutubeDataArr['videoIdListStr'])){
                    temp_data								=	distinctVal(mainAppVars.tempYoutubeDataArr['videoIdListStr'].split(","));
                }
                mainAppVars.tempYoutubeDataArr['videoIdListStr']	    =	temp_data.toString();
                var temp_data_length						=	temp_data.length;
                var temp_checking							=	[];

                if(temp_data_length	!=	temp_docs_length){
                    for(i=0; i<temp_docs_length; i++){
                        if($.inArray(temp_docs[i]['snippets'][7]['values'][0],temp_checking) === -1){
                            temp_checking.push(temp_docs[i]['snippets'][7]['values'][0]);
                        }
                        else{
                            mainAppVars.tempYoutubeDataArr['documents'].splice(i,1);
                            i--;
                            temp_docs_length--;
                        }
                    }
                }
                mainAppVars.tempYoutubeDataArr.numFound =   temp_data_length;
                var listClassObject =   new mainApp.listModule();
                listClassObject.createListExt(mainAppVars.tempYoutubeDataArr);
                mainAppVars.learningKeywordCount = 0;
                mainAppVars.tempYoutubeDataArr = [];
            }
        }
        else{
            console.log(response);
        }
    };
};
var setSearchCategory	=	function(event){
	var catId	=	$(event.target).closest('li').attr('data-catid');
	data.searchCategory	=	0;
	if(catId){
		data.searchCategory	=	catId;
	}
	$('#searchBoxCat button').attr('catfilter',data.searchCategory).html($(event.target).closest('li').text()+"<span class='caret'></span>");
	event.preventDefault();
};
var autocompleteTimeout =   '';
var getKeywordMatch	=	function(event){
    var eventTarget =   $(event.currentTarget);
    if(event.keyCode<41 && event.keyCode>37){
        return true;
    }
    else if(eventTarget.hasClass('input-group-addon') || event.keyCode == 13){
        mainAppVars.searchInputText =   encodeURIComponent($('#headsearchinput').val().trim()); 
        mainAppVars.searchStart =   0;
        mainAppVars.searchAge =   false;
        mainAppVars.searchLanguage =   false;
        mainAppVars.searchCategory   = false;
        if(!IsValueNull($('#searchBoxCat > button').attr('catfilter'))){
           mainAppVars.searchCategory   = $('#searchBoxCat > button').attr('catfilter');
        }
    }
    else{
        mainAppVars.searchInputText =   encodeURIComponent($('#headsearchinput').val().trim());
    }

    if(mainAppVars.searchInputText == ""){
        $('#searchData').html('');
        return false;
    }
    else{
        if(event.type == "keyup" && event.keyCode != 13){
            if(!IsValueNull(autocompleteTimeout)){
                clearTimeout(autocompleteTimeout);
            }
            autocompleteTimeout =   setTimeout(function(){
                var searchObject    =   new mainApp.searchModule();
                searchObject.searchAutoComplete();
            },200);
        }
        else{
            mainAppVars.listEXT = [];
            $('#headsearchinput').blur();
            $('#headsearch').scope().setSearchView();
        }
    }
};
function login()
{
	$("#sign-in-container").css('display','block');
}

var resetSignUpOption	=	function(){
	$('#sign-in-container input').val('');
	sign_in();
};
var mainAppVars =   {};

mainAppVars.goToCategorySelection   =   false;
mainAppVars.searchCategory          =   false;
mainAppVars.searchLanguage          =   false;
mainAppVars.searchAge               =   false;
mainAppVars.searchInputText         =   '';
mainAppVars.paginationLimitIndex    =   10;
mainAppVars.searchStart     =   0;
mainAppVars.searchRows      =   10;
mainAppVars.videoSource     =   '';
mainAppVars.videoSourceId   =   '';
mainAppVars.searchType      =   '';
mainAppVars.requestVariable =   false;
mainAppVars.currentVideoId  =   false;
mainAppVars.catNameObject   =   {};
mainAppVars.categoryJSON    =   [];
mainAppVars.loginUser   =   false;
mainAppVars.currentView =   'home';
mainAppVars.lastView    =   '';
mainAppVars.listOSS     =   [];
mainAppVars.listEXT     =   [];
mainAppVars.learn_keywords	=	['learn','lessons','tips'];
mainAppVars.learningKeywordCount = 0;
mainAppVars.searchOssOnly       =   false;
mainAppVars.searchExtOnly       =   false;
mainAppVars.getCurentVideoData  = false;
mainAppVars.redirectUrlIndex    =   0;
var mainApp =   mainApp || {};
mainAppVars.nochildfilter   =   false;
mainAppVars.urlmalform  =   false;
mainAppVars.recaptcha   =   false;

mainApp.Variables    =   function(){
    this.setVariable    =   function(varsObject){
        for(var key in varsObject){
            if((varsObject[key] == '' && key != 'all') || mainAppVars.urlmalform){
                mainAppVars.urlmalform = true;
                break;
            }
            switch(key){
                case 'page':
                    mainAppVars.currentView =   varsObject[key];
                    break;
                case 'search':
                    mainAppVars.searchInputText =   varsObject[key];
                    mainAppVars.searchType  =   'keyword';
                    break;
                case 'start':
                    mainAppVars.searchStart =   parseInt(varsObject[key]);
                    if(mainAppVars.searchStart < 0){
                        mainAppVars.urlmalform  =   true;
                    }
                    break;
                case 'rows':
                    mainAppVars.searchRows =   parseInt(varsObject[key]);
                    if(mainAppVars.searchRows < 0){
                        mainAppVars.urlmalform  =   true;
                    }
                    break;
                case 'bookmark':
                    mainAppVars.searchType  =   'bookmarks';
                    break;
                case 'videoId':
                    mainAppVars.currentVideoId =   varsObject[key];
                    break;
                case 'contentsrc':
                    mainAppVars.videoSource =   varsObject[key];
                    break;
                case 'sourcevidid':
                    mainAppVars.videoSourceId =   varsObject[key];
                    break;
                case 'request':
                    mainAppVars.requestVariable =   varsObject[key];
                    break;
                case 'category':
                    mainAppVars.searchCategory =   varsObject[key];
                    mainAppVars.searchType  =   'category';
                    break;
                case 'catfilter':
                    if(varsObject[key] != "other"){
                        mainAppVars.searchCategory =   varsObject[key];
                    }
                    else{
                        mainAppVars.nochildfilter   =   true;
                    }
                    break;
                case 'filter':
                    mainAppVars.nochildfilter   =   true;
                    break;
                case 'langfilter':
                    mainAppVars.searchLanguage =   varsObject[key];
                    break;
                case 'agefilter':
                    mainAppVars.searchAge =   varsObject[key];
                    break;
                case 'bookmarkSearch':
                    mainAppVars.searchBookmark =   varsObject[key];
                    break;
                case 'bookmarkId':
                    mainAppVars.searchType          =   'bookmarks';
                    mainAppVars.currentBookmarkId   =   varsObject[key];
                default:
                    key =   varsObject[key];
                    break;
            }
        }
    };
    this.unsetVariable    =   function(){};
    this.destroyVariable    =   function(){};
}
var mainApp =   mainApp || {};

mainApp.mainModule    =   function(){
    this.setVariablesFromParams    =   function(urlParamObj){
        if(Object.keys(urlParamObj).length > 0){
            var appVariableObject   =   new mainApp.Variables();
            appVariableObject.setVariable(urlParamObj);
        }
    };
    this.resetVariables =   function(){
        mainAppVars.goToCategorySelection   =   false;
        mainAppVars.searchCategory          =   false;
        mainAppVars.searchLanguage          =   false;
        mainAppVars.searchAge               =   false;
        mainAppVars.searchInputText         =   '';
        mainAppVars.paginationLimitIndex    =   10;
        mainAppVars.searchStart     =   0;
        mainAppVars.searchRows      =   10;
        mainAppVars.videoSource     =   '';
        mainAppVars.videoSourceId   =   '';
        mainAppVars.searchType      =   '';
        mainAppVars.requestVariable =   false;
        mainAppVars.currentVideoId  =   false;
        mainAppVars.currentView =   'home';
        mainAppVars.lastView    =   '';
        mainAppVars.listOSS     =   [];
/*
        mainAppVars.listEXT     =   [];
*/
    };
    this.renderStaticData	=	function(){
        $('#head').scope().setCategoryData();
        $('body').tooltip({
            selector: '[data-toggle="tooltip"]'
        });
        
        $(window).scroll(function(){
            var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(bodyScrollTop > 35){
                $('#head').addClass('scroll-active');
            }
            else{
                $('#head').removeClass('scroll-active');
            }
        });
        $('body').on('keypress','input[type="number"]',numbersonly);
        UI_createModal('#alert-box-container');
        UI_createModal('#feedback-form');
        var bindingArr   =   [
/*
            ['#categorydropdown > ul .showMoreCat',showAllCat,'click'],
            ['#categorydropdown',hideAllCat,'mouseleave'],
*/
            ['#searchBoxCat ul.dropdown-menu a',setSearchCategory,'click'],
            ['#categorydropdown li[data-catId] .subMenuExpand',showSubCategory,'click'],
            ['#categorydropdown li[data-catId] .subMenuCollapse',hideSubCategory,'click'],
            ['.sign-in-button',showSignInOption,'click']
        ];
        this.bindElements(bindingArr);
    };
    this.bindElements    =   function(elemArr){
        for(var i=0; i<elemArr.length;i++){
            UI_bindFunction(elemArr[i][0],elemArr[i][1],elemArr[i][2]);
        }
    };
};$(function(){
    var mainAppObject       =   new mainApp.mainModule();
    mainAppObject.renderStaticData();
    mainAppVars.loginUser   =   l_ch;
	progressChange(100);
});

var onRecaptchaCallback = function() {
    mainAppVars.recaptcha   =   true;
};

var reCaptchaWidget;
var loadRecaptcha   =   function(){
    reCaptchaWidget =   grecaptcha.render('recommendgrecaptcha', {
      'sitekey' : '6Lfh_xsTAAAAAFmiYtuXsXnEv3PS58yxSquSgp0F'
    });
}

var getLocationUrl = function(index){
	if(index == 0 || index == '' || index == null)
		return true;
	var redirectUrlStr = '';
	switch(index){
	case 1:
		redirectUrlStr = './?page=list&request=curate';
		break;
	default:
		redirectUrlStr = './';
		break;
	}
	return redirectUrlStr;
};
var preventClosing = function(event){
	window.location.href = './';
	return false;
};
var showAllCat= function(event){
//	$('#categorydropdown >ul>li.showLessCat').css('display','list-item');
	$('#categorydropdown >ul>li.hiddenElem').removeClass('hiddenElem');
	$('#categorydropdown >ul>li.showMoreCat').css('display','none');
	event.preventDefault();
	event.stopPropagation();
	return false;
};
var hideAllCat= function(event){
//	$('#categorydropdown >ul>li.showLessCat').css('display','none');
	$('#categorydropdown >ul').children('li:nth-child(n+7):not(.showMoreCat)').addClass('hiddenElem');
	$('#categorydropdown >ul>li.showMoreCat').css('display','list-item');
	event.preventDefault();
	event.stopPropagation();
	return false;
};
var createSubmenu = function(){
	var subMenuObj = data.subCategories;
	for(var key in subMenuObj){
		var menuItem = $('#categorydropdown ul.dropdown-menu li[data-catid="'+key+'"]');
		menuItem.find('a').addClass("dropdown-toggle").attr("data-toggle","dropdown");
		menuItem.addClass('dropdown-submenu').append('<div class="subMenuExpand visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-down"></div><div class="subMenuCollapse hiddenElem visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-up"></span></div><ul class="dropdown-menu"></ul>');
		for(var i=0;i<subMenuObj[key].length;i++){
			menuItem.find('ul.dropdown-menu').append('<li data-catId="'+subMenuObj[key][i]['attr']['data-catid']+'" data-vidId="'+subMenuObj[key][i]['attr']['data-vidId']+'"><a href="'+subMenuObj[key][i]['link']+'">'+subMenuObj[key][i]['label']+'</a></li>');
		}
	}
};
var unloadCurrentVideo = function(){
		mainAppVars.currentVideoId = '';
};
var showSignInOption    =   function(){
	UI_openModal('#sign-in-container');
};
var RecommendErrorMsg   =   [
    'Please specify a category for this video',
];/**
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
};var toggleDropdown	=	function(element,control,event){
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
/** 
* @namespace CommonUtils
*/
var CommonUtils = CommonUtils || {};

/**
 * remoteCallClass class under CommonUtils namespace to implement methods for remote calls
 * @class CommonUtils.remoteCallClass
 * 
 */

CommonUtils.remoteCallClass = function(){
	var remoteCallObj;
	var status;
	var error;
	var lastMethod;
	var lastCallType;
	var lastRequestData;
	var lastUrl;
	var lastCallback;
	this.requestMethod 	=	'POST';
	this.callType		=	true;
	this.requestData	=	{};
	this.user			=	'';
	this.password		=	'';
	
	var init	=	function createBrowserObject(){
		try
		{
			remoteCallObj=new XMLHttpRequest();	// Firefox, Opera 8.0+, Safari		
		}
		catch (e)
		{
			try
			{
				remoteCallObj=new ActiveXObject("Msxml2.XMLHTTP"); // Internet Explorer 					
			} 
			catch (e)
			{ 
				try
				{
					remoteCallObj=new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e)
				{ 
					UI_alert('Enable javascript'); 
				}
			}
		}
	};
	
	this.syncGetRequest	=	function(url,callback){
		this.requestMethod 	= 'GET';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncGetRequest	=	function(url,callback){
		this.requestMethod 	= 'GET';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncPostRequest	=	function(url,callback){
		this.requestMethod 	= 'POST';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncPostRequest	=	function(url,callback){
		this.requestMethod 	= 'POST';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncPutRequest	=	function(url,callback){
		this.requestMethod 	= 'PUT';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncPutRequest	=	function(url,callback){
		this.requestMethod 	= 'PUT';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncDeleteRequest	=	function(url,callback){
		this.requestMethod 	= 'DELETE';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncDeleteRequest	=	function(url,callback){
		this.requestMethod 	= 'DELETE';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncConnectRequest	=	function(url,callback){
		this.requestMethod 	= 'CONNECT';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncConnectRequest	=	function(url,callback){
		this.requestMethod 	= 'CONNECT';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncHeadRequest	=	function(url,callback){
		this.requestMethod 	= 'HEAD';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncHeadRequest	=	function(url,callback){
		this.requestMethod 	= 'HEAD';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncOptionsRequest	=	function(url,callback){
		this.requestMethod 	= 'OPTIONS';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncOptionsRequest	=	function(url,callback){
		this.requestMethod 	= 'OPTIONS';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncTraceRequest	=	function(url,callback){
		this.requestMethod 	= 'TRACE';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncTraceRequest	=	function(url,callback){
		this.requestMethod 	= 'TRACE';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.customRequest	=	function(url,callback,method,type,data){
		this.requestMethod 	= method;
		this.callType		= type;
		this.requestData	= data;
		return makeRequest(url,callback,this);
	};
	
	this.retryLastRequest	=	function(){
		this.requestMethod	=	lastMethod;
		this.callType		=	lastCallType;
		this.requestData	=	lastRequestData;
		makeRequest(lastUrl,lastCallback,this);
	};
	
	this.getLastRequestStatus	=	function(){
		return status;
	};

	this.getLastErrorMessage	=	function(){
		return error;
	};
	var setCallError	=	function(callback){
		console.log(error);
		if(!(callback == '' || callback == null || typeof(callback) == "undefined")){
			callback(error);
		}
		return error;
	};
	
	var makeRequest	=	function(url,callback,classObj){
		lastMethod		=	classObj.requestMethod;
		lastCallType	=	classObj.callType;
		lastRequestData	=	classObj.requestData;
		lastUrl 		= 	url;
		lastCallback	=	callback;
		error = '';
		status = 'PRISTINE';
		if(url == '' || url == null || typeof(url) == "undefined"){
			error = 'No target defined for the request';
			status	=	'ERROR';
			return requestCallback();
		}
		init();
        if(classObj.requestMethod == "GET" && Object.keys(classObj.requestData).length > 0){
            url +=  '?'+formatRequestData(classObj.requestData);
        }
		remoteCallObj.onreadystatechange	=	function(){
			if(remoteCallObj.readyState	==	1){
				status	=	'SENT';
			}
			else if(remoteCallObj.readyState	==	4 && remoteCallObj.status	==	200){
				status	=	'RESPONSE';
				requestCallback(remoteCallObj.response,lastCallback);
			}
		}; 
		remoteCallObj.open(classObj.requestMethod,url,classObj.callType,classObj.user,classObj.password);
		remoteCallObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		remoteCallObj.send(formatRequestData(classObj.requestData));
		classObj.requestMethod 	= '';
		classObj.callType		= '';
		classObj.requestData	=	{};
	};
	
	var formatRequestData	=	function(reqObject){
		var outputStr	=	'';
		for(var key in reqObject){
			if(outputStr != ''){
				outputStr += '&';
			}
			if(typeof(reqObject[key]) == "object"){
				outputStr	+=	formatRequestDataObject(reqObject[key],key,'');
			}
			else{
				outputStr	+=	key;
				outputStr	+=	'=';
				outputStr	+=	encodeURIComponent(reqObject[key]);
			}
		}
		return outputStr;
	};
	
	var formatRequestDataObject	=	function(levelObj,levelKey,prevObjStr){
		var outputStr	='';
		for(var key in levelObj){
			if(outputStr != ''){
				outputStr += '&';
			}
			if(typeof(levelObj[key]) == "object"){
				if(prevObjStr == ''){
					var levelObjStr	=	levelKey;
				}
				else{
					var levelObjStr	=	prevObjStr+'['+levelKey+']';
				}
				outputStr += formatRequestDataObject(levelObj[key],key,levelObjStr);
			}
			else{
				if(prevObjStr	!=	''){
					outputStr	+=	prevObjStr;
					outputStr	+=	'['+levelKey+']';
					outputStr	+=	'['+key+']';
				}
				else{
					outputStr	+=	levelKey+'['+key+']';
				}
				outputStr	+=	'=';
				outputStr	+=	encodeURIComponent(levelObj[key]);
			}
		}
		return outputStr;
	};
	
	var requestCallback	=	function(reponse,callback){
		if(status == "ERROR"){
			return setCallError(callback);
		}
		else if(status == "RESPONSE"){
			if(callback == '' || callback == null || typeof(callback) == "undefined"){
				return reponse;
			}
			else{
				return callback(reponse);
			}
		}
		else if(status == "PRISTINE"){
			error = 'Request not sent by app';
			return setCallError(callback);
		}
		else if(status == "SENT"){
			error = 'Response not received by app';
			return setCallError(callback);
		}
		else{
			error = 'Unknown error in sending request'
			return setCallError(callback);
		}
	};
};(function () {
    var homeController  =   function ($scope, $routeParams, $location, $http, $rootScope) {
        $scope.categoryItems    =   [];
        $('body').scrollTop(0);
        $('#sidebar').css('display','block');
        $('#moto').css('display','block');
        $('#navPathArea').css('display','none');
        mainAppVars.urlmalform  =   false;
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        mainAppVars.searchInputText =   '';
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppObject.setVariablesFromParams(urlparams);
        if(mainAppVars.urlmalform){
            $location.path('/');
        }
        $rootScope.l_ch =   l_ch;
        angular.element('#head').scope().searchInputText  =   mainAppVars.searchInputText;
        if(typeof $rootScope.contentList != "undefined")
            delete $rootScope.contentList;
        var data    =   {},config={},successCallback = function (response) {
            response = response.data;
            if(response.status){
                $scope.categoryItems    =   response.data;
                angular.element('#aboutWT').removeClass('hide');
            }
            else{
                console.log(response);
            }
        }, errorCallback = function (response) {
            console.log(response);
        };
        $http.get("./"+dataRequestURL+"?request=getHomeVidData", data).then(successCallback, errorCallback);    

        $scope.goToMainContent  =   function(){
            $('body').animate({'scrollTop':0},1000);
        };

    };
    homeController.$inject  =   ['$scope', '$routeParams', '$location', '$http', '$rootScope'];
    angular.module('wt').controller('homeController', homeController);
}());(function () {
    var headerController  =   function ($scope, $route, $routeParams, $location, $http, serviceBreadCrumbs, $rootScope) {
        $scope.setSearchView    =   function(){
            var locationStr =   '/search';
            if(!IsValueNull(mainAppVars.searchInputText)){
                locationStr += '/search='+ mainAppVars.searchInputText;
            }
            if(!IsValueNull(mainAppVars.searchCategory) && mainAppVars.searchCategory && mainAppVars.searchCategory != "0"){
                locationStr += '&catfilter='+mainAppVars.searchCategory;
            }
            if(locationStr == $location.$$path){
                $route.reload();
            }
            else{
                $location.path(locationStr);
            }
            $scope.$apply();
        }
        $rootScope.setCatBreadCrumb =   function(category){
            var temp_category   =   category;
            var temp_arr = [];
            while(true){
                temp_arr.push({name:mainAppVars.catNameObject[temp_category],link:'search/category='+temp_category});
                temp_category	=	parentCatObj[temp_category];
                if(typeof(temp_category)	==	"undefined"){
                    break;
                }
            }
            return temp_arr.reverse();
        };
        $scope.showFeedbackModal    =   function(){
            this.resetFeedbackInputs();
            $('#feedback-request-alert').html('It will be great to receive your valuable feedback/suggestion');
            UI_openModal('#feedback-form');
        };
        $scope.resetFeedbackInputs =   function(){
            $('#feedback-title').val('');
            $('#feedback-description').val('');
        };

        $scope.logoutUser	=	function(){
            if(typeof(gapi)	==	"undefined")
            {
                console.log("Unable to download gapi");
                return false;
            }
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
            });
            var xhrObj = new CommonUtils.remoteCallClass();
            xhrObj.requestData  =   {'request':'logout'};
            xhrObj.asyncPostRequest('./'+dataRequestURL,this.userLogoutRequestCallback);
        };
        $scope.userLogoutRequestCallback	=	function(response){
            response    =   JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                    location.reload();
            }
            else{
                UI_alert('Error in logout');
            }
        };
        $scope.getKeywordMatch  =   function(event){
            getKeywordMatch(event);
        };
        $scope.$on('breadCrumbData',function(event,data){
            $scope.BreadCrumbs = data;
        });
        $scope.gotoCuration = function(){
            if(!l_ch){
                mainAppVars.redirectUrlIndex = 1;
                UI_openModal('#sign-in-container');
            }
            else{
                location.href = './?page=list&request=curate';
            }
        };
        $scope.gotoabout    =   function(){
            $('body').animate({'scrollTop':($('#aboutWT')[0].offsetTop - 50)},1000);
        };
        $scope.gotoHome = function(){
            location.href = './';
            return true;
        };
        $scope.toggleSmallScreenControls = function(button,showOpt){
            if(showOpt){
                $('#headlogo').css('display','none');
                $('.smallScreenComponent').css('opacity',0);
                if(button == "search"){
                    $('#headsearch').css('opacity','0').removeClass('hidden-xs').animate({'opacity':'1'},300);
                }
                else if(button == "menu"){
                    $('#headbutton,#headcategory').css('opacity','0').removeClass('hidden-xs').animate({'opacity':'1'},300);
                }
            }
            else{
                $('#headlogo').css('display','block');
                $('.smallScreenComponent').css('opacity',1);
                $('#headsearch,#headcategory,#headbutton').animate({'opacity':'1'},300).addClass('hidden-xs').css('opacity','0');
            }
        };
        $scope.setCategoryData  =   function(){
            var catData	=	data.categories;
            UI_createJsonUL('#categorydropdown',{'html':catData});
            UI_createDropdown('#categorydropdown');
/*
            $('#categorydropdown > ul').children('li:nth-child(n+7)').addClass('hiddenElem');
            $('#categorydropdown > ul').append('<li class="showMoreCat"><a href="#">Show more</a></li>');
*/
//            createSubmenu();
            $('#categorydropdown > button').removeClass('btn-default').addClass('btn-link');
            UI_postAddon('#headsearchinput','glyphicon-search',false,'getKeywordMatch');
            if(!youtubeListFlag){
                UI_preAddon('#headsearchinput','<div id="searchBoxCat" data-label="All Categories"></div>');
            }
            catData.splice(0,0,{'link':'#','label':'All Categories'});
            UI_createJsonUL('#searchBoxCat',{'html':catData});
            catData.splice(0,1);
            UI_createDropdown('#searchBoxCat');
            UI_createModal('#sign-in-container','','','','resetSignUpOption',false);
            UI_bindModalButton('#headLoginButton','#sign-in-container');
            mainCatArray    =   [];
            for(var key in catData){
                mainCatArray.push(catData[key]['attr']['data-catid']);
                mainAppVars.catNameObject[catData[key]['attr']['data-catid']] = catData[key]['label'];
                $('#recommendcategoryInput').append('<option value="'+catData[key]['attr']['data-catid']+'">'+catData[key]['label']+'</option>');
            };
            var subCatData = data.allStructureCategories;
            parentCatObj    =   {};
            for(var key in subCatData){
                for(var i=0;i<subCatData[key].length;i++){
                parentCatObj[subCatData[key][i]['attr']['data-catid']]  =   key;
                    mainAppVars.catNameObject[subCatData[key][i]['attr']['data-catid']] = subCatData[key][i]['label'];
                }
            };
            mainAppVars.catBreadcrumb   =   {};
            for(var key in mainAppVars.catNameObject){
                var temp_category   =   key;
                var temp_str = '';
                while(true){
                    temp_str = mainAppVars.catNameObject[temp_category] + ' / ' + temp_str;
                    temp_category	=	parentCatObj[temp_category];
                    if(typeof(temp_category)	==	"undefined"){
                        mainAppVars.catBreadcrumb[key]  =   temp_str.replace(/\/([^\/]*)$/,'$1');;
                        break;
                    }
                }
            }

        };
        $scope.BreadCrumbs  =   serviceBreadCrumbs.pathObject;
        $scope.$watch(
            function(){serviceBreadCrumbs.pathObject},
            function(newValue, oldValue){
                $scope.BreadCrumbs  =   serviceBreadCrumbs.pathObject;
            }
        );
    };
    headerController.$inject  =   ['$scope', '$route', '$routeParams', '$location', '$http', 'serviceBreadCrumbs', '$rootScope'];
    angular.module('wt').controller('headerController', headerController);
}());(function () {
    var footerController  =   function ($scope, $location, $routeParams, $http, $rootScope, serviceBreadCrumbs) {
        $('.section').css('display','none');
        $('body').scrollTop(0);
        $('#sidebar').css('display','none');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        $scope.BreadCrumbs  =   [];
        var breadCrumbInput =   [];
        var breacrumbStr    =   ''
        switch($location.$$path.split('/')[1]){
            case 'aboutUs':
                breacrumbStr    =   'About us'
                break;
            case 'termsOfService':
                breacrumbStr    =   'Terms of Service'
                break;
            case 'privacy':
                breacrumbStr    =   'Privacy statements'
                break;
            case 'legalNotice':
                breacrumbStr    =   'Legal Notices & Trademarks'
                break;
            default:
                break;
        }
        breadCrumbInput.push({name:breacrumbStr,'link':''});
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);

        $scope.submitfeedback  =   function(){
            var feedbackTitle   =   $('#feedback-title').val();
            var feedbackDesc   =   $('#feedback-description').val();
            if(IsValueNull(feedbackTitle) || IsValueNull(feedbackDesc)){
                $('#feedback-request-alert').html('Fill all inputs');
                return false;
            }
            var xhrObj = new CommonUtils.remoteCallClass();
            xhrObj.requestData	=	{'request':'submit_feedback','data':{'title':feedbackTitle,'desc':feedbackDesc}};
            xhrObj.asyncPostRequest("./"+dataRequestURL,this.FeedbackRequestCallback);
            UI_blockInterface();
        };
        $scope.FeedbackRequestCallback =   function(response){
            UI_unBlockInterface();
            response = JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                $('#feedback-request-alert').html('Feedback submitted successfully');
                $('footer').scope().resetFeedbackInputs();
            }
            else{
                $('#feedback-request-alert').html('Error in feedback submission');
            }
        };
    };
    footerController.$inject  =   ['$scope','$location', '$routeParams', '$http', '$rootScope', 'serviceBreadCrumbs'];
    angular.module('wt').controller('footerController', footerController);
}());var sso=sso||{};sso.app=function(s){this.u=s,ssoUrl=s,this.reset=function(s){if(null==this.u||""==this.u)return console.log("SSO object not initialised"),!1;var t="reset";$.ajax({url:this.u,type:"POST",data:{request:"sso_initiate_reset",data:{sso_email:s}},async:!0,success:function(s){onSSOResponse(s,t)}})},this.signin=function(s,t){return null==this.u||""==this.u?(console.log("SSO object not initialised"),!1):void $.ajax({url:this.u,type:"POST",data:{request:"sso_signin_verify",data:{sso_email:s,sso_password:t}},async:!0,success:function(s){onSSOResponse(s)}})},this.signup=function(s){if(null==this.u||""==this.u)return console.log("SSO object not initialised"),!1;var t="signup";$.ajax({url:this.u,type:"POST",data:{request:"sso_initiate_signup",data:{sso_email:s}},async:!0,success:function(s){onSSOResponse(s,t)}})},this.signup_verify=function(s){return null==this.u||""==this.u?(console.log("SSO object not initialised"),!1):void $.ajax({url:this.u,type:"POST",data:{data:{sso_user_info:JSON.stringify(s)}},async:!0,success:function(s){onSSOResponse(s)}})},this.reset_verify=function(s){return null==this.u||""==this.u?(console.log("SSO object not initialised"),!1):void $.ajax({url:this.u,type:"POST",data:{data:{sso_password:s}},async:!0,success:function(s){onSSOResponse(s)}})},onSignIn=function(s){if(null==ssoUrl||""==ssoUrl)return console.log("SSO object not initialised"),!1;if(1==l_ch)return!1;var t=s.getAuthResponse().id_token;s.getBasicProfile().getImageUrl();$.ajax({url:ssoUrl,type:"POST",data:{request:"sso_google_signin",data:{sso_idtoken:t}},async:!0,success:function(s){onSSOResponse(s)}})}};$(document).ready(function()
{
	var sso_obj	=	new sso.app(getResetCompletionUrl());
	UI_createModal('#reset-password',null,null,null,null,true,preventClosing);
	$('#reset-text').click(function(event)
			{
				var password	=	$("#reset-in-password").val();
				var confirm	=	$("#reset-confirm-password").val();
				
				if(password	==	"")
				{
					$("#error").html('Password should not be empty');
					$("#reset-password").focus();
					return;
				}
				if(confirm	!=	password)
				{
					$("#error").html('Password donot match');
					$("#reset-confirm-password").focus();
					return;
				}
				
				var detailForm = $('#reset-password form');
				var str=detailForm.attr("action");
				var o_str=str.substring(0,94);
				var r_str=str.substring(94);
				var e_str=encodeURIComponent(r_str);
				var new_url=o_str.concat(e_str);
				detailForm.attr("action",new_url);	
				//detailForm.submit();
				sso_obj.reset_verify(password);
			});
});

function onSSOResponse(r)
{
	response	=	JSON.parse(r);
	if(response['status']	==	true) {
		window.location.href =  "./";
	}
	else if(response['status']	==	false) {
		$('#error').html(response["error"]);
	}
}