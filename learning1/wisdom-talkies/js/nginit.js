(function () {
    file_version =  file_version || Math.random();
    var app = angular.module('wt', ['ngRoute','youtube-embed']);
    app.config(function ($routeProvider,$locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeController',
                templateUrl: 'wisdom-talkies/template/home.html?ver='+file_version
            })
            .when('/search/:searchParams', {
                controller: 'searchController',
                templateUrl: 'wisdom-talkies/template/list.html?ver='+file_version
            })
            .when('/view/:viewParams', {
                controller: 'viewController',
                templateUrl: 'wisdom-talkies/template/view.html?ver='+file_version
            })
            .when('/aboutUs',{
                controller: 'footerController',
                templateUrl: 'wisdom-talkies/template/aboutUs.html?ver='+file_version
            })
            .when('/termsOfService', {
                controller: 'footerController',
                templateUrl: 'wisdom-talkies/template/termsOfService.html?ver='+file_version
            })
            .when('/privacy', {
                controller: 'footerController',
                templateUrl: 'wisdom-talkies/template/privacy.html?ver='+file_version
            })
            .when('/legalNotice', {
                controller: 'footerController',
                templateUrl: 'wisdom-talkies/template/legalNotice.html?ver='+file_version
            })
            .when('/profile', {
                controller: 'profileController',
                templateUrl: 'wisdom-talkies/template/profile.html?ver='+file_version
            })
            .when('/bookmark/:searchParams', {
                controller: 'bookmarkController',
                templateUrl: 'wisdom-talkies/template/bookmark.html?ver='+file_version
            })
            .when('/curations',{
                controller: 'myCurationController',
                templateUrl: 'wisdom-talkies/template/savedCuration.html?ver='+file_version
            })
            .otherwise({ redirectTo: '/'});
        $locationProvider.html5Mode(true);
    });
    app.config(function($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        /**
        * The workhorse; converts an object to x-www-form-urlencoded serialization.
        * @param {Object} obj
        * @return {String}
        */ 
        var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
          value = obj[name];

          if(value instanceof Array) {
            for(i=0; i<value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value instanceof Object) {
            for(subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    });
    app.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            return input.split(splitChar)[splitIndex];
        }
    });
    app.filter('secondsToDateTime', function() {
        return function(seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        }
    });
    app.filter('categoryName', function() {
        return function(categoryId) {
            var categoryName    =   'other';
            if(typeof(mainAppVars.catNameObject[categoryId]) != "undefined"){
                categoryName    =   mainAppVars.catNameObject[categoryId];
            }
            return categoryName;
        }
    });
/*
    app.directive('tooltip', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                $(element).hover(function(){
                    // on mouseenter
                    $(element).tooltip('show');
                }, function(){
                    // on mouseleave
                    $(element).tooltip('hide');
                });
            }
        };
    });
*/
    app.filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
              filtered.push(item);
            });
            filtered.sort(function (a, b) {
              return (a[field] > b[field] ? 1 : -1);
            });
            if(reverse) filtered.reverse();
                return filtered;
        };
});
    app.filter('videoSource', function() {
        return function(videoUrlStr) {
            if( videoUrlStr && videoUrlStr.indexOf("www.youtube.com") != -1){
                restStr = 'Youtube';
            }
            else{
                restStr = 'Default';
            }
            return restStr;
        }
    });
    app.factory('serviceListPagination',function(){
        var listPaginationInstance  =   {};
        listPaginationInstance.createPagination =   function(listPageData){
            if(IsValueNull(listPageData.numFound)){
                return {uniquePage:0,curentPage:0,pageStart:0,pageEnd:0};
            }
    		var uniquePages     =   Math.ceil(listPageData.numFound/listPageData.rows);
            var currentPage	=	Math.ceil((listPageData.start+1)/listPageData.rows);
            var displayPaginationIndexLeft  = 1;
            var displayPaginationIndexRight = 1;
            if(uniquePages > 1){
                var displayPaginationIndexRight = Math.max(uniquePages,uniquePages+currentPage -mainAppVars.paginationLimitIndex-1);
                var displayPaginationIndexLeft = Math.max(currentPage-(mainAppVars.paginationLimitIndex/2),1);
            }
            mainAppVars.searchStart = listPageData.start;
            return {pageStart:displayPaginationIndexLeft,pageEnd:displayPaginationIndexRight,uniquePage:uniquePages,currentPage:currentPage};
        };
        listPaginationInstance.resetPagination  =   function(){
            return {uniquePage:0,curentPage:0,pageStart:0,pageEnd:0};
        };
        listPaginationInstance.showNextPage     =   function(){
            
        };
        listPaginationInstance.showPrevPage     =   function(){
            
        };
        return listPaginationInstance;
    });
    app.factory('serviceBreadCrumbs',function(){
        var breadCrumbsInstance =   {};
        breadCrumbsInstance.pathObject  =   [{name:'Home',link:'./'}];
        breadCrumbsInstance.appendBreadCrumb    =   function(inputArr){
            this.setDefaultBreadCrumb();
            for(var i=0; i<inputArr.length;i++){
                this.pathObject.push(inputArr[i]);
            }
            return this.pathObject;
        };
        breadCrumbsInstance.removeBreadCrumb    =   function(numofindex){
            this.pathObject.splice(-1, numofindex);
            return this.pathObject;
        };
        breadCrumbsInstance.setDefaultBreadCrumb    =   function(){
            this.pathObject  =   [{name:'Home',link:'./'}];
        };
        return breadCrumbsInstance;
    });
})();