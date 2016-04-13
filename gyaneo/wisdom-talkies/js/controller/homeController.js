(function () {
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
}());