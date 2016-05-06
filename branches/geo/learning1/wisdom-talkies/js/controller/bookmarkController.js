(function () {
    var bookmarkController  =   function ($scope, $routeParams, $location, $http, $rootScope, serviceBreadCrumbs) {
        if(!l_ch){
            $location.path('/');
        }
        $('.section').css('display','none');
        $('body').scrollTop(0);
        $('#sidebar').css('display','block');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');

        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppVars.searchStart =   0;
        $scope.BreadCrumbs  =   [];
        var breadCrumbInput =   [];
        mainAppObject.setVariablesFromParams(urlparams);
        $scope.urlParams    =   encodeURIComponent($routeParams.searchParams);
        $scope.searchStart   =   mainAppVars.searchStart;
        $rootScope.listLimitStart    =   0;
        $scope.searchRows   =   mainAppVars.searchRows;   
        $scope.openContentInfo  =   function(event){
            openContentInfo(event);
        };
        $rootScope.contentList   =   {documents:{},numFound:0};
        $scope.getBookmarkdata      =  function(start,rows){
            var bookmarkObject      =   new mainApp.bookmarkModule();
            bookmarkObject.readBookmarkByUser(start,rows);
        };
        breadCrumbInput.push({name:'All Bookmarks','link':''});
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
        $scope.getTopicsJSON    =   function(option,index){
            option.bookmarkTopics   =   JSON.parse(option.topicinfo)['topic_info'];
        };
        $scope.getBookmarkdata(mainAppVars.searchStart,mainAppVars.searchRows);
        $scope.getItemCount =   function(objectVar){
            if(typeof objectVar == "object"){
                $scope.objectLength =   Object.keys(objectVar).length;
                $scope.$apply();
            }
        };
    };
    bookmarkController.$inject  =   ['$scope', '$routeParams', '$location','$http', '$rootScope', 'serviceBreadCrumbs'];
    angular.module('wt').controller('bookmarkController', bookmarkController);
}());