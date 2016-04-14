(function () {
    var productAddCtrl  =   function ($scope, $location, $http, $rootScope) {
        $scope.isbnType =   'isbn_10';
        $scope.ErrObj   =   {};
        $rootScope.pageTitle = 'Add product | Geo';
        $scope.validateInput    =   funcction(){
            var response    =   true;
            return response;
        };
        $scope.showInputError    =   funcction(){
            
        };
        $scope.addProduct   =   function(){
            if($scope.validateInput()){
                
            }
            else{
                $scope.showInputError($scope.ErrObj);
            }
        };
        $scope.cancelAddProduct =   function(){
            var userConfirm =   true;
            userConfirm =   window.confirm('Do you wish not to add this product');
            if(userConfirm){
                window.location.reload();
            }
        };
    };
    productAddCtrl.$inject  =   ['$scope', '$location','$http', '$rootScope'];
    angular.module('geo').controller('productAddCtrl', productAddCtrl);
}());