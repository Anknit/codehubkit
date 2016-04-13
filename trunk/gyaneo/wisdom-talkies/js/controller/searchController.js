(function () {
    var searchController  =   function ($scope, $routeParams, $location, $rootScope, $http, $filter, serviceListPagination, serviceBreadCrumbs) {
        $('body').scrollTop(0);
        mainAppVars.urlmalform  =   false;
        $('#sidebar').css('display','block');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppVars.nochildfilter   =   false;
        mainAppObject.resetVariables();
        mainAppObject.setVariablesFromParams(urlparams);
        if(mainAppVars.urlmalform){
            $location.path('/');
        }
        angular.element('#head').scope().searchInputText  =  decodeURIComponent(mainAppVars.searchInputText);
        $scope.urlParams    =   encodeURIComponent($routeParams.searchParams);
        var breadCrumbInput    =   [];
        $scope.categoryFacets   =   {};
        $scope.BreadCrumbs  =   [];
        $scope.searchRows   =   mainAppVars.searchRows;
        $scope.langFilters  =   data.languages;
        for(var langItem in $scope.langFilters){
            if($scope.langFilters[langItem]['status'] != '1'){
               delete $scope.langFilters[langItem]; 
            }
        }
        $scope.langFilters['0'] = {id:'0',language:'Any Language'};
        $scope.langfilter = mainAppVars.searchLanguage ? mainAppVars.searchLanguage : $scope.langFilters['0'].id;

        $scope.setSearchView    =   function(){
            var locationStr =   '/search';
            if(!IsValueNull(mainAppVars.searchInputText)){
                locationStr += '/search='+mainAppVars.searchInputText;
            }
            if(!IsValueNull(mainAppVars.searchCategory)){
                if(IsValueNull(mainAppVars.searchInputText)){
                    locationStr += '/category='+mainAppVars.searchCategory;
                    if($location.absUrl().indexOf('&catfilter=') != -1){
                        locationStr += '&catfilter=other';
                    }
                }
                else{
                    locationStr += '&catfilter='+mainAppVars.searchCategory;
                    if($location.absUrl().indexOf('&filter=') != -1){
                        locationStr += '&filter=strict';
                    }
                }
            }
            if(mainAppVars.searchStart > 0){
                locationStr += '&start='+mainAppVars.searchStart;
            }
            if(mainAppVars.searchLanguage){
                locationStr += '&langfilter='+mainAppVars.searchLanguage;
            }
            $location.path(locationStr);
        }

        if(mainAppVars.searchType == "category"){
            var searchObject    =   new mainApp.searchModule();
            searchObject.searchCategory();
            breadCrumbInput =   breadCrumbInput.concat($rootScope.setCatBreadCrumb(mainAppVars.searchCategory));
//            breadCrumbInput.push({name:mainAppVars.catBreadcrumb[mainAppVars.searchCategory] ,link:'search/category='+mainAppVars.searchCategory});
        }
        else if(mainAppVars.searchType == "keyword"){
            var searchObject    =   new mainApp.searchModule();
            searchObject.searchKeyword();
//            breadCrumbInput.push({name:mainAppVars.searchInputText ,link:'search/search='+mainAppVars.searchInputText});
        }
        if(mainAppVars.searchLanguage){
//            breadCrumbInput.push({name:'Language: '+$scope.langFilters[mainAppVars.searchLanguage]['language'] ,link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&langfilter='+mainAppVars.searchLanguage});
        }
        if(mainAppVars.searchStart > 0){
            var pageIndex = Math.ceil(mainAppVars.searchStart/mainAppVars.searchRows)+1;
//            breadCrumbInput.push({name:'Page #'+pageIndex ,link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&start='+mainAppVars.searchStart});
        }
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
        $scope.openContentInfo  =   function(event){
            openContentInfo(event);
        };
        $scope.filterListByLanguage	=	function(){
            if(this.langfilter == 0){
                mainAppVars.searchLanguage = false;
            }
            else{
                mainAppVars.searchLanguage  =   this.langfilter;
            }
            mainAppVars.searchStart = 0;
            this.setSearchView();
        };
        $scope.getFacetUrl  =   function(index,key){
            var hrefurl =   '#';
            if(mainAppVars.searchType == "keyword"){
                hrefurl = 'search/search='+mainAppVars.searchInputText;
                if(key != "other"){
                   hrefurl += '%26catfilter='+key; 
                }
                if(key == "other"){
                   hrefurl += '%26catfilter='+mainAppVars.searchCategory; 
                   hrefurl += '%26filter=strict'; 
                }
            }
            else if(mainAppVars.searchType == "category"){
                hrefurl = 'search/category='+key;
                if(key == 'other'){
                    hrefurl = 'search/category='+mainAppVars.searchCategory;
                    hrefurl += '%26catfilter='+key;
                }
            }
            if(mainAppVars.searchLanguage){
                hrefurl += '%26langfilter='+mainAppVars.searchLanguage;
            }
            return hrefurl;
        };
        $scope.filterListByAge		=		function(event){
        };
        $scope.resetListFilters	=	function(event){
        };
        $scope.resetfilterUI	=	function(){
        };
        $scope.DummyArray   =   function(n){
            if(angular.isNumber(n) && parseInt(n) == n)
                return new Array(n);
        }
        $scope.checkTopics =   function(jsonString){
            var topicsDefined    =   false;
            if(!IsValueNull(jsonString)){
                topicsDefined    =   true;
            }
            return topicsDefined;
        };
        $scope.getTopicsArr =   function(jsonString,index){
            return angular.fromJson(jsonString)['topic_info'];
        };
        $scope.$watch(function(){return $rootScope.contentList},
            function(newValue, oldValue) {
                $scope.Pagination   =   {};
                if(typeof(newValue) == "object" && newValue != oldValue){
                    $scope.Pagination   =   serviceListPagination.createPagination(newValue);
                }
            }
        );
    };
    searchController.$inject  =   ['$scope', '$routeParams', '$location','$rootScope', '$http', '$filter', 'serviceListPagination', 'serviceBreadCrumbs'];
    angular.module('wt').controller('searchController', searchController);
}());