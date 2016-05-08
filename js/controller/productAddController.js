(function () {
    var productAddCtrl  =   function ($scope, $location, $http, $rootScope) {
        $scope.isbnType =   'isbn_10';
        $scope.ErrObj   =   {};
        $rootScope.pageTitle = 'Add product | Geo';
        $scope.pro_language='English';
        $scope.validateInput    =   function(){
            var response    =   true;
            return response;
        };
        $scope.showInputError    =   function(){
            
        };
        $scope.addProduct   =   function(){
            if($scope.validateInput()){
                var postObject  =   {
                    product:$scope.pro_type,
                    quantity:$scope.pro_quant,
                    price:$scope.pro_price,
                    publisher:$scope.pro_publisher,
                    language:$scope.pro_language,
                    title:$scope.pro_name,
                    description:$scope.pro_desc,
                    Copyright_date:$scope.pro_copyright,
                    author:$scope.pro_author,
                    edition:$scope.pro_edition,
                    condition:$scope.pro_condition,
                    adult_content:$scope.pro_adult_clause,
                    refundable:$scope.pro_refund_clause,
                    unit:'nos',
                    isbn_10:$scope.pro_isbn_10,
                    isbn_13:$scope.pro_isbn_13,
                    paperback:$scope.pro_paperback,
                    dimension:$scope.pro_dimension_len+' x '+$scope.pro_dimension_width,
                    category:$scope.pro_category,
                    image:$scope.pro_image
                };
                var request =    $http({
                    method: "post",
                    url: "php/appdata.php",
                    data: {
                        request:'add_product',
                        data:postObject
                    }
                });
                request.success(
                    function(response){
                        if(response.status){
                            alert('Your product has been saved successfully');
                        }
                });
                
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
    angular.module('gyaneo').controller('productAddCtrl', productAddCtrl);
}());