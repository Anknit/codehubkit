(function () {
    var inventoryHomeCtrl  =   function ($scope, $location, $http, $rootScope) {
        $scope.myProducts = [{productId:1,title:'Test Book Title',views:5,imageLink:'http://lorempixel.com/200/100'}];
        $scope.deleteInventoryProduct = function(event,index){
            var isbnNum = $scope.addProductIsbn;
            var error = 0;
            if(angular.isNumber(isbnNum)){
                if(isbnNum.length == 10 || isbnNum.length == 13 ){
                    var request =    $http({
                        method: "get",
                        url: "geo/php/appdata.php?request=read_isbn_details&data[isbn]="+isbnNum,
                        data: {}
                    });
                    request.success(
                        function(response){
                            if(response.status){
                                alert('ISBN fetched successfully');
                            }
                    });
                    request.error(
                        function(error){
                            console.log(error);
                        }
                    );
                }
                else{
                    error = 2;
                }
            }
            else{
                error = 1;
            }
        };
    };
    inventoryHomeCtrl.$inject  =   ['$scope', '$location','$http', '$rootScope'];
    angular.module('gyaneo').controller('inventoryHomeCtrl', inventoryHomeCtrl);
}());