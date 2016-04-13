(function () {
    var reviewController  =   function ($scope, $routeParams, $rootScope, $http, $filter, serviceListPagination, serviceBreadCrumbs) {
        $('body').scrollTop(0);
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        $scope.loginUser    =   mainAppVars.loginUser;
        mainAppVars.playerReady =   false;
        $scope.playerVideoId    =   're';
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
        $scope.$on('youtube.player.ended', function ($event, player, dataObj, event) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.playing', function ($event, player, dataObj, event) {
            vidPlayerObject.onPlayerStateChange(dataObj);
            $scope.currentVideoTime =   vidPlayerObject.playerHandle.H.currentTime;
        });
        $scope.$on('youtube.player.paused', function ($event, player, dataObj, event) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });

        $scope.playVideo    =   function(){
            if(mainAppVars.playerReady){
                $rootScope.recentContentList    =   $rootScope.recentContentList || {};
                var viewClassObject =   new mainApp.viewModule();
                switch($scope.playusing){
                    case 'normal':
                        vidPlayerObject.LoadNewVideoByID(mainAppVars.videoSourceId);
                        $rootScope.recentContentList[mainAppVars.currentVideoId]  =   $scope.currentVideoObject;
                        break;
                    case 'topics':
                        viewClassObject.CreateSegment($scope.currentVideoObject.topicinfo);
                        $rootScope.recentContentList[mainAppVars.currentVideoId]  =   $scope.currentVideoObject;
                        break;
                    case 'bookmarks':
                        viewClassObject.CreateSegment($scope.currentVideoObject.bookmarkTopics);
                        $rootScope.recentContentList[mainAppVars.currentVideoId]  =   $scope.currentVideoObject;
                        break;
                    default:
                        break;
                }
            }
            else{
                setTimeout(function(){
                    $scope.playVideo();
                },500);
            }
        };
        $scope.playContentThroughTopics   =   function(event){
            $scope.playusing    =   'topics';
            $scope.playVideo();
        }
        $scope.playVideoSegment =   function(event){
            if(event.target.hasAttribute('data-topic-index'))
                var nodeID	=	$(event.target).attr('data-topic-index');
            else{
                var nodeID	=	$(event.target).closest('[data-topic-index]').attr('data-topic-index');
            }
            vidPlayerObject.PlaySegmentIndex(nodeID); 
        };
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
    };
    reviewController.$inject  =   ['$scope', '$routeParams', '$rootScope', '$http', '$filter', 'serviceListPagination', 'serviceBreadCrumbs'];
    angular.module('wt').controller('reviewController', reviewController);
}());