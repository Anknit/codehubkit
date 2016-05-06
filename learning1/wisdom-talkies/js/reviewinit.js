(function () {
    var app = angular.module('wt', ['ngRoute','youtube-embed']);
    app.config(function($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
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
            return mainAppVars.catNameObject[categoryId];
        }
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
}());
