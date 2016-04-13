(function () {
    var curationListController  =   function ($scope, $routeParams, $http, $rootScope, serviceListPagination, serviceBreadCrumbs) {
        $('body').scrollTop(0);
        $('#sidebar').css('display','none');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','none');
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        var breadCrumbInput =   [];
        $scope.searchRows   =   50;
        mainAppVars.searchInputText =   'learning';
        $scope.urlParams    =   encodeURIComponent($routeParams.searchParams || "search=learning");
        mainAppObject.setVariablesFromParams(urlparams);
        angular.element('#head').scope().searchInputText  =   decodeURIComponent(mainAppVars.searchInputText);
        var searchObject    =   new mainApp.searchModule();
        searchObject.searchKeyword();
        breadCrumbInput.push({name:mainAppVars.searchInputText ,link:'search/search='+mainAppVars.searchInputText});
        if(mainAppVars.searchStart > 0){
            var pageIndex = Math.ceil(mainAppVars.searchStart/mainAppVars.searchRows)+1;
            breadCrumbInput.push({name:'Page #'+pageIndex ,link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&start='+mainAppVars.searchStart});
        }
        mainAppVars.playerReady =   false;
        mainAppVars.videoSourceId   =   'qw';
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


        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
        $scope.openContentInfo  =   function(event){
            openContentInfo(event);
        };
        $scope.DummyArray   =   function(n){
            return new Array(n);
        }
        $scope.$watch(function(){return $rootScope.contentList},
            function(newValue, oldValue) {
                $scope.Pagination   =   {};
                if(typeof(newValue) == "object" && newValue != oldValue){
                    $scope.Pagination   =   serviceListPagination.createPagination(newValue);
                }
            }
        );
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
        $scope.saveVideoToCuration  =   function(event){
            curation_handle.videoID = $(event.target).attr('data-videoid');
            UI_openModal('#save-to-curation');
        };
        $scope.watchVideoCurate =   function(event){
            $('body').animate({'scrollTop':0},1000);
            mainAppVars.videoSourceId = $(event.target).attr('data-videoid');
            $scope.playVideo();
        };
    };
    curationListController.$inject  =   ['$scope', '$routeParams', '$http', '$rootScope', 'serviceListPagination', 'serviceBreadCrumbs'];
    angular.module('wt').controller('curationListController', curationListController);
}());