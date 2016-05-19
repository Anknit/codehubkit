(function () {
    var searchCtrl  =   function ($scope, $location, $http, $rootScope) {
        $scope.ErrObj   =   {};
        $rootScope.cities = [{cityId:0,cityName:'All cities',status:1}];
        $rootScope.selectedCity = $rootScope.cities[0];
        $rootScope.categories = [{catId:0,catName:'All categories',status:1}];
        $rootScope.selectedCategory = $rootScope.categories[0];
        var cityRequest =    $http({
            method: "get",
            url: "geo/php/appdata.php?request=read_city_object",
            data: {}
        });
        cityRequest.success(
            function(response){
                if(response.status){
                    $rootScope.cities = $rootScope.cities.concat(response.data);
                }
        });
         var categoryRequest =    $http({
            method: "get",
            url: "geo/php/appdata.php?request=read_category_object&data[type]=book",
            data: {}
        });
        categoryRequest.success(
            function(response){
                if(response.status){
                    $rootScope.categories = $rootScope.categories.concat(response.data);
                }
        });
    };
    searchCtrl.$inject  =   ['$scope', '$location','$http', '$rootScope'];
    angular.module('gyaneo').controller('searchCtrl', searchCtrl);
}());