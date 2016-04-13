$(function(){
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
];