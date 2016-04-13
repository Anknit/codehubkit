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
