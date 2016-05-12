(function () {
    var productEditCtrl  =   function ($scope, $location, $http, $rootScope) {
        $scope.ErrObj   =   {};
        $scope.inventory = [];
        $rootScope.pageTitle = 'Edit product | Gyaneo';

        var request =    $http({
            method: "post",
            url: "geo/php/appdata.php",
            data: {
                request:'read_product',
                data:{id:''}
            }
        });
        request.success(
            function(response){
                if(response.status){
                    $scope.inventory = response.data;
                }
        });
    };
    productEditCtrl.$inject  =   ['$scope', '$location','$http', '$rootScope'];
    angular.module('gyaneo').controller('productEditCtrl', productEditCtrl);
}());