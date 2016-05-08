angular.module('gyaneo').controller('categoryController',function($scope){
            
    $scope.productCategory = ['Science fiction','Drama','Action and Adventure','Romance','Mystery','Horror','Self help', 'Health Guide',
                             'Travel', 'Children','Religion','Spirituality','History','Math','Anthology',
                              'Poetry', 'Encyclopedias', 'Dictionaries', 'Comics', 'Art', 'Cookbooks', 'Diaries', 'Journals', 'Prayer'
                             ];
});
angular.module('gyaneo').controller('homeSectionController',function($scope){
            
    $scope.latestProducts = ['Item A','Item B','Item C','Item D','Item E','Item F','Item G','Item H','Item I','Item J','Item K','Item L'];
});
