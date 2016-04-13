(function () {
    var curationController  =   function ($scope, $routeParams, $http, $rootScope, $timeout) {
        $('body').scrollTop(0);
        $('#moto').css('display','none');
        $('#navPathArea').css('display','none');
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        mainAppVars.searchInputText =   '';
        mainAppVars.playerReady	=	false;
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppObject.setVariablesFromParams(urlparams);
        $scope.urlParams    =   encodeURIComponent($routeParams.curateParams);
        angular.element('#head').scope().searchInputText  =   decodeURIComponent(mainAppVars.searchInputText);
        $scope.initFunction =   function(){
            var catData	=	data.categories;
            UI_createJsonUL('#curationcategorydropdown',{'html':catData});
            UI_createDropdown('#curationcategorydropdown','',false);
            var subMenuObj = data.subCategories;
            for(var key in subMenuObj){
                var dropDownArray   =   $('#curationcategorydropdown');
                dropDownArray.each(function(){
                    var menuItem = $(this).find('ul.dropdown-menu li[data-catid="'+key+'"]');
                    menuItem.find('a').addClass("dropdown-toggle").attr("data-toggle","dropdown");
                    menuItem.addClass('dropdown-submenu').append('<div class="subMenuExpand visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-down"></div><div class="subMenuCollapse hiddenElem visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-up"></span></div><ul class="dropdown-menu"></ul>');
                    for(var i=0;i<subMenuObj[key].length;i++){
                        menuItem.find('ul.dropdown-menu').append('<li data-catId="'+subMenuObj[key][i]['attr']['data-catid']+'" data-vidId="'+subMenuObj[key][i]['attr']['data-vidId']+'"><a href="'+subMenuObj[key][i]['link']+'">'+subMenuObj[key][i]['label']+'</a></li>');
                    }
                });
            }
            $('#curationcategorydropdown').on('click','li[data-catId] a',setCurationVideoCategory);
            var temp_is_lang	=	false;
            data.languages['other_language']    =   {id:'other_language',language:'other'};
            $scope.langObject   =   data.languages;
            $scope.curation_language = $scope.langObject['1'].id;
            $('.category-drop-down-curation').on('click','li[data-catId] a',setCurationVideoCategory);
            $("#curate_other_category").change(function(){
                build_breadcrumb_of_category($("#curationcategorydropdown").attr("category-value"));
            });
        };
        $scope.playerVideoId    =   mainAppVars.currentVideoId;
        $scope.$on('youtube.player.ready', function ($event, player) {
            vidPlayerObject  =   CreatePlayerWidget($scope.vidPlayerObject, 'YT', 'ytplayerdiv', '100%', '100%', true,true);
            mainAppVars.playerReady = true;
            vidPlayerObject.videoID =   $scope.playerVideoId;
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
            vidPlayerObject.onPlayerError(dataObj);
        });


        $scope.DummyArray   =   function(n){
            return new Array(n);
        }
        $scope.playVideo    =   function(){
            if(mainAppVars.playerReady){
                var viewClassObject =   new mainApp.viewModule();
                vidPlayerObject.LoadNewVideoByID(mainAppVars.videoSourceId);
            }
            else{
                setTimeout(function(){
                    $scope.playVideo();
                },500);
            }
        };
        $scope.socialPlatforms      =   [{name:"website",value:"Website"},
                                        {name:"facebook",value:"Facebook"},
                                        {name:"twitter",value:"Twitter"},
                                        {name:"googleplus",value:"Google"},
                                        {name:"linkedin",value:"Linkedin"},
                                        {name:"blogger",value:"Blogger"},
                                        {name:"quora",value:"Quora"},
                                        {name:"instagram",value:"Instagram"},
                                        {name:"souncloud",value:"Soundcloud"},
                                        {name:"pinterest",value:"Pinterest"},
                                        {name:"tumblr",value:"Tumblr"},
                                        {name:"stumbleupon",value:"StumbleUpon"},
                                        {name:"reddit",value:"Reddit"},
                                        {name:"email",value:"Email"},
                                        {name:"other",value:"Other"}];

        $scope.curationLinksInput   =   [{modelval:'model1',label:'Link #1',id:'content-link-type-1',otherPlatformid:'content-link-other-input-1',socialPlatforms:$scope.socialPlatforms},{modelval:'model2',label:'Link #2',id:'content-link-type-2',otherPlatformid:'content-link-other-input-2',socialPlatforms:$scope.socialPlatforms},{modelval:'model3',label:'Link #3',id:'content-link-type-3',otherPlatformid:'content-link-other-input-3',socialPlatforms:$scope.socialPlatforms},{modelval:'model4',label:'Link #4',id:'content-link-type-4',otherPlatformid:'content-link-other-input-4',socialPlatforms:$scope.socialPlatforms}];
        LoadVideoforCuration(mainAppVars.currentVideoId,'yt');
        $scope.initFunction();
        $scope.playCurationTopic    =   function(event){
            var start_time	=	$(event.currentTarget).closest('tr').find('.topic-start').attr('data-time-val');
            var end_time	=	$(event.currentTarget).closest('tr').find('.topic-end').attr('data-time-val');
            var numRow      = $(event.currentTarget).closest('tr').prevAll('tr.readOnlyRow:not(.dummyRow)').length;
            newSegInfo		=	curation_handle.CreateSegment(numRow,'',true)[0];
            length			=	newSegInfo.segmentList.length;
            content_json	=	curation_handle.CreateSegment(numRow,'',true)[1];
            $(".playActive").removeClass('playActive');
            $(event.currentTarget).closest('tr').addClass('playActive');
            vidPlayerObject.LoadNewVideoSegment(newSegInfo.videoID, 'handle_segmentwise');
            vidPlayerObject.PlaySegmentwise(start_time,end_time);
        }
        $scope.addNewTopicRow  =   function(event){
            addNewTopicRow(event);
        };
        $scope.cancelTopicAdd  =   function(event){
            cancelTopicAdd(event);
        };
        $scope.saveTopicRow  =   function(event){
            saveTopicRow(event);
        };
        $scope.editTopicRow  =   function(event){
            editTopicRow(event);
        };
        $scope.removeTopicRow  =   function(event){
            removeTopicRow(event);
        };
        $scope.bindcurrentPTSTimeInput  =   function(event){
            bindcurrentPTSTimeInput(event);
        };
        $scope.publish  =   function(event){
            publish(event);
        };
        $scope.final_publish  =   function(event){
            final_publish(event);
        };
        $scope.playSegments  =   function(args){
            playSegments(args);
        };
        $scope.saveOnPublish    =   function(){
            $timeout(function() {
                angular.element('#save_curation').triggerHandler('click');
            }, 100);
        };
    };
    curationController.$inject  =   ['$scope', '$routeParams', '$http', '$rootScope', '$timeout'];
    angular.module('wt').controller('curationController', curationController);
}());