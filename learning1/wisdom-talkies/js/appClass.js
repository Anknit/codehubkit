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
};