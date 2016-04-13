(function () {
    var viewController  =   function ($scope, $routeParams, $location, $rootScope, $http, $filter, serviceListPagination, serviceBreadCrumbs) {
        $('body').scrollTop(0);
        $('#sidebar').css('display','none');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        mainAppVars.urlmalform  =   false;
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppVars.currentBookmarkId   =   false;
        mainAppObject.setVariablesFromParams(urlparams);
        if(mainAppVars.urlmalform){
            $location.path('/');
        }
        $scope.urlParams    =   encodeURIComponent($routeParams.viewParams);
        $scope.loginUser    =   mainAppVars.loginUser;
        $scope.searchRows   =   mainAppVars.searchRows;
        if(typeof($rootScope.listLimitStart) == "undefined"){
            $rootScope.listLimitStart   =   0;
        }
        angular.element('#head').scope().searchInputText  =   decodeURIComponent(mainAppVars.searchInputText);
        mainAppVars.playerReady =   false;
        $scope.playerVideoId    =   mainAppVars.videoSourceId;
        $scope.$on('youtube.player.ready', function ($event, player) {
            vidPlayerObject  =   CreatePlayerWidget($scope.vidPlayerObject, 'YT', 'ytplayerdiv', '100%', '100%', true,true);
            mainAppVars.playerReady = true;
        });

        $scope.$on('youtube.player.buffering', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.queued', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.ended', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.playing', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
            $scope.currentVideoTime =   vidPlayerObject.playerHandle.H.currentTime;
        });
        $scope.$on('youtube.player.paused', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.error', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerError(dataObj);
            console.log(dataObj);
        });


        $scope.mainCatObject    =   mainCatArray;
        $scope.recommendCat =   1;
        $scope.$watch(
            function(){
                return $rootScope.contentList;
            },
            function(oldValue,newValue){
                var getListData =   false;
                if(typeof(newValue) == "undefined" || (mainAppVars.currentVideoId.indexOf('yt-') !=0 && typeof(newValue.documents['wt-'+mainAppVars.currentVideoId]) == "undefined" && typeof(newValue.currentVideoData) == "undefined")){
                    getListData =   true;
                }
                else if(oldValue == newValue){
                    $scope.currentVideoObject   =   $rootScope.contentList.documents['wt-'+mainAppVars.currentVideoId] || newValue.currentVideoData;
                }
                else{
                      $scope.currentVideoObject   =   $rootScope.contentList.currentVideoData || $rootScope.contentList.documents['wt-'+mainAppVars.currentVideoId];
                        if(typeof($scope.currentVideoObject) == "undefined"){
                            $scope.getCurrentVideoData();
                        }
                }
                if(!getListData && typeof($scope.currentVideoObject) == "undefined"){
                    $location.path('/');
                }
                var breadCrumbInput    =   [];
                $scope.BreadCrumbs  =   [];
                if(mainAppVars.searchType == "category"){
                    if(getListData){
                        var searchObject    =   new mainApp.searchModule();
                        searchObject.searchCategory();
                    }
                    else{
                        breadCrumbInput =   breadCrumbInput.concat($rootScope.setCatBreadCrumb($scope.currentVideoObject.category));
//                        breadCrumbInput.push({name:mainAppVars.catBreadcrumb[mainAppVars.searchCategory] ,link:'search/category='+mainAppVars.searchCategory});
                    }
                }
                else if(mainAppVars.searchType == "keyword"){
                    if(getListData){
                        var searchObject    =   new mainApp.searchModule();
                        searchObject.searchKeyword();
                    }
                    else{
                        if(!IsValueNull($scope.currentVideoObject.category)){
                            breadCrumbInput =   breadCrumbInput.concat($rootScope.setCatBreadCrumb($scope.currentVideoObject.category));
//                            breadCrumbInput.push({name:mainAppVars.catBreadcrumb[$scope.currentVideoObject.category] ,link:'search/category='+$scope.currentVideoObject.category});
                        }
                    }
                }
                else if(mainAppVars.searchType  == "bookmarks"){
                    if(getListData){
                        var bookmarkObject      =  new mainApp.bookmarkModule();
                        bookmarkObject.readBookmarkByUser(mainAppVars.searchStart,mainAppVars.searchRows);
                    }
                    else{
//                        breadCrumbInput.push({name:'All Bookmarks' ,link:'bookmark/all'});
                    }
                }

                if(!getListData){
                    var viewClassObject =   new mainApp.viewModule();
                    viewClassObject.getVideoBookmarksData();

                    if(mainAppVars.searchStart > 0){
                        var pageIndex = Math.ceil(mainAppVars.searchStart/mainAppVars.searchRows)+1;
//                        breadCrumbInput.push({name:'Page #'+pageIndex ,link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&start='+mainAppVars.searchStart});
                    }
                    if(!IsValueNull(mainAppVars.currentVideoId)){
                        if(breadCrumbInput.length > 0 && typeof(breadCrumbInput[breadCrumbInput.length-1]['link']) != "undefined"){
                            breadCrumbInput.push({name:$scope.currentVideoObject['string'],link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&videoId='+mainAppVars.currentVideoId+'&contetsrc='+mainAppVars.videoSource+'&sourcevidid='+mainAppVars.videoSourceId});
                        }
                        else{
                            breadCrumbInput.push({name:$scope.currentVideoObject['string'],link:'#'});
                        }
                    }

                    if(mainAppVars.currentBookmarkId){
                        $scope.playusing    =   'bookmarks';
                    }
                    else if($scope.currentVideoObject.topicinfo.length > 0){
                        $scope.playusing    =   'topics';
                    }
                    else{
                        $scope.playusing    =   'normal';
                    }

                    $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
                    $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
                    $scope.playVideo();
                }
            }
        );
        var popoverTimeOut;
        $scope.showPopover  =   function(event){
            $(event.target).popover('show');
        };
        $scope.getCurrentVideoData =   function(){
            var xhrObj = new CommonUtils.remoteCallClass();
            xhrObj.requestData  =   {request:'currentVideoData',data:{videoId:mainAppVars.currentVideoId}};
            xhrObj.syncGetRequest('./'+dataRequestURL,this.CurrentVideoDataCallback);
        };
        $scope.CurrentVideoDataCallback =   function(response){
            response    =   JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                response    =   response.data;
                $scope.currentVideoObject   =   response;
            }
        };
        $scope.hidePopover  =   function(event){
            var eventTarget =   $(event.target);
            eventTarget.popover('hide');
        };


        $scope.playVideo    =   function(){
            if(mainAppVars.playerReady){
                $rootScope.recentContentList    =   $rootScope.recentContentList || {};
                var viewClassObject =   new mainApp.viewModule();
                switch($scope.playusing){
                    case 'normal':
                        vidPlayerObject.LoadNewVideoByID(mainAppVars.videoSourceId);
                        break;
                    case 'topics':
                        viewClassObject.CreateSegment($scope.currentVideoObject.topicinfo);
                        break;
                    case 'bookmarks':
                        viewClassObject.CreateSegment($scope.currentVideoObject.bookmarkTopics);
                        break;
                    default:
                        break;
                }
                if($('.suggestionlist-container .list-item-row.active').length > 0){
                    $('.suggestionlist-container .list-item-row.active')[0].scrollIntoView();
                }
                $rootScope.recentContentList[mainAppVars.currentVideoId]  =   $scope.currentVideoObject;
                $rootScope.recentContentList[mainAppVars.currentVideoId]['timestamp']  =   new Date().getTime();
                $rootScope.recentContentList[mainAppVars.currentVideoId]['recentPlayUrl']  =   'view/'+$scope.urlParams.split('%26videoId')[0]+'&videoId='+$scope.currentVideoObject.id+'&contentsrc=Youtube&sourcevidid='+$scope.currentVideoObject.videoid;
            }
            else{
                setTimeout(function(){
                    $scope.playVideo();
                },500);
            }
        };
        $scope.showActiveUserVideoAction	=	function(event){
            var currentAction = $(event.target).closest('.actionItem');
            $('.actionDataContainer').css('display','none');
            if(currentAction.hasClass('activeActionItem')){
                $('.activeActionItem').removeClass('activeActionItem');
                return true;
            }
            $('.activeActionItem').removeClass('activeActionItem');
            currentAction.addClass('activeActionItem');
            var contentDivClass = currentAction.attr('actDiv');
            $('.'+contentDivClass).css('display','block');
            if(contentDivClass == 'bookmarkBox'){
                $scope.bookmarkShown();
            }
        };
        $scope.showVideoRecommendInput = function(){
            $('.recommendPage').css('display','none');
            $('#recommPage_2').css({'display':'block'});
            if(mainAppVars.recaptcha){
                loadRecaptcha();
            }
//          sendCaptchaRequest('#recomCaptcha');
        };
        $scope.build_category_breadcrumb	=	function(category_id,suggested_category){
            var temp_category	=	category_id;
            var temp_bread		=	[];	
            if(typeof(mainAppVars.catNameObject[category_id])	==	"undefined"	||	IsValueNull(category_id))
            {
                temp_bread.push(suggested_category);
            }
            else
            {
                while(true)
                {
                    temp_bread.unshift(mainAppVars.catNameObject[temp_category]);
                    temp_category	=	parentCatObj[temp_category];
                    if(typeof(temp_category)	==	"undefined")
                    {
                        temp_bread.push(suggested_category);
                        break;
                    }
                }
            }
            return temp_bread.join("/");
        }
        $scope.bookmarkShown    =   function(){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.pauseVideo();
            }
            if($scope.currentVideoObject.bookmarkTopics.length == 0 && $('#video-bookmark-table').find('tr.inputRow:not(.dummyRow)').length == 0){
                var topicClassObj   =   new topicClass.handler();
                topicClassObj.addTopicInputRow('','top','video-bookmark-table');
            }
        }
        $scope.submitContentRecommendation	=	function(){
            var recomFormValid = true;
            $('#recommendation-input-form .has-error').removeClass('has-error');
            $('#recommendation-input-form').find('input,select').each(function(){
                if(IsValueNull(this.value)){
                    if(this.id == 'otherCategoryInput' && $('#recommendcategoryInput').val() != 0){
                        return true;
                    }
                    $(this).focus();
                    recomFormValid = false;
                    $scope.showRecommendationErrorMsg(RecommendErrorMsg[0],this);
                    return false;
                }
            });
            if(!recomFormValid){
                return false;
            }
            else{
                var recommCat	=	$('#recommendation-input-form select').val();
                if(recommCat == 0){
                    newRecomCat = $('#otherCategoryInput').val();
                    var cat_bread	=	this.build_category_breadcrumb("",newRecomCat)
                }
                else{
                    var newRecomCat = '';
                    var cat_bread	=	this.build_category_breadcrumb(recommCat,newRecomCat)
                }

                var recomReason	=	$('#recommendDescription').val();
                var captchaText	=	grecaptcha.getResponse(reCaptchaWidget);

                UI_blockInterface();
                var xhrObj = new CommonUtils.remoteCallClass();
                xhrObj.requestData  =   {request:'recommend',data:{videoId:$scope.playerVideoId,title:$scope.currentVideoObject.string,videoSource:'yt',catId:recommCat,newCatName:newRecomCat,category_breadcrumb:cat_bread,recommendDesc:recomReason,captcha:captchaText}};
                xhrObj.syncPostRequest('./'+dataRequestURL,this.RecommendationRequestCallback);
            }
        };
        $scope.RecommendationRequestCallback	=	function(response){
            response    =   JSON.parse(response);
            UI_unBlockInterface();
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                response    =   response.data;
                if(grecaptcha){
                    grecaptcha.reset(reCaptchaWidget);
                }
//              sendCaptchaRequest('#recomCaptcha');
                $('.recommendPage').css('display','none');
                $('#recommPage_3').css({'display':'block'});
            }
            else{
                $scope.showRecommendationErrorMsg(response.error,this);
                if(grecaptcha){
                    grecaptcha.reset(reCaptchaWidget);
                }
//              sendCaptchaRequest('#recomCaptcha');
            }
        };
        $scope.showRecommendationErrorMsg	=	function(msg,elem){
            $(elem).closest('.form-group').addClass('has-error');
            $('#recommPageError span').html(msg);
        };
        $scope.saveBookmarkData =   function(event){
            saveBookmarkData(event);
        }
        $scope.playContentThroughBookmark   =   function(event){
            $scope.playusing    =   'bookmarks';
            $scope.playVideo();
        }
        $scope.playContentThroughTopics   =   function(event){
            $scope.playusing    =   'topics';
            $scope.playVideo();
        }
        $scope.playContentNormal    =   function(event){
            $scope.playusing    =   'normal';
            if( typeof newSegInfo != "undefined"){
                newSegInfo['segmentList'] = [];
                vidPlayerObject.SegmentList =   0;
            }
            $scope.playVideo();
        };
        $scope.playVideoSegment =   function(event){
            if(event.target.hasAttribute('data-topic-index'))
                var nodeID	=	$(event.target).attr('data-topic-index');
            else{
                var nodeID	=	$(event.target).closest('[data-topic-index]').attr('data-topic-index');
            }
            vidPlayerObject.PlaySegmentIndex(nodeID); 
        };
        $scope.addNewTopicRow  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.pauseVideo();
            }
            addNewTopicRow(event);
        };
        $scope.cancelTopicAdd  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.playVideo();
            }
            cancelTopicAdd(event);
        };
        $scope.saveTopicRow  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.playVideo();
            }
            saveTopicRow(event);
        };
        $scope.editTopicRow  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.pauseVideo();
            }
            editTopicRow(event);
        };
        $scope.removeTopicRow  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.playVideo();
            }
            removeTopicRow(event);
        };
        $scope.bindcurrentPTSTimeInput  =   function(event){
            bindcurrentPTSTimeInput(event);
        };
        $scope.$on('$viewContentLoaded', function() {
            (function(d, s, id) {
                FB = null;
                var js, fjs = d.getElementsByTagName(s)[0];
                //if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&version=v2.5&appId=572940442863669";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        });
    };
    viewController.$inject  =   ['$scope', '$routeParams', '$location', '$rootScope', '$http', '$filter', 'serviceListPagination', 'serviceBreadCrumbs'];
    angular.module('wt').controller('viewController', viewController);
}());