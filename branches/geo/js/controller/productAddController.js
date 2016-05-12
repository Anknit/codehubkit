(function () {
    var productAddCtrl  =   function ($scope, $location, $http, $rootScope) {
        $scope.ErrObj   =   {};
        $rootScope.pageTitle = 'Add product | Geo';

        $scope.isbnType =   'isbn_10';
        $scope.pro_language='English';
        $scope.pro_type = '';
        $scope.pro_quant = '';
        $scope.pro_price = '';
        $scope.pro_publisher = '';
        $scope.pro_name = '';
        $scope.pro_desc = '';
        $scope.pro_copyright = '';
        $scope.pro_author = '';
        $scope.pro_edition = '';
        $scope.pro_condition = '';
        $scope.pro_adult_clause = '';
        $scope.pro_refund_clause = '';
        $scope.pro_isbn_10 = '';
        $scope.pro_isbn_13 = '';
        $scope.pro_paperback = '';
        $scope.pro_dimension_len = '';
        $scope.pro_dimension_width = '';
        $scope.pro_category = '';
        $scope.pro_image = '';

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
                    copyright_date:$scope.pro_copyright,
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
                    image:$scope.pro_image,
                    category1:"",
                    	category2:"",
                    		category3:"",
                    			category4:"",
                    				category5:"",
                    					category6:"",
                    						category7:"",
                    							category8:"",
                    								category9:"",
                    									category10:""
                };
                var request =    $http({
                    method: "post",
                    url: "geo/php/appdata.php",
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