(function () {
    var myCurationController  =   function ($scope, $routeParams, $location, $http, $rootScope, serviceBreadCrumbs) {
        if(!l_ch){
            $location.path('/');
        }
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        $scope.BreadCrumbs  =   [];
        var breadCrumbInput =   [];
        breadCrumbInput.push({name:'My Curations','link':''});
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);

        var extScripts  =   [
            {identifier:'jquery-ui',script:'./Common/js/jqueryUI/jquery-ui.custom.js'},
            {identifier:'grid-locale',script:'./Common/js/grid.locale-en.js'},
            {identifier:'jqgrid',script:'./Common/js/jquery.jqGrid.min.js'},
            {identifier:'grid-related',script:'./Common/js/GridRelated.js'},
            {identifier:'common-functions',script:'./Common/js/commonFunctions.js'},
            {identifier:'curation-grid',script:'./wisdom-talkies/js/myCurationGridData.js'},
            {identifier:'render-grid',script:'./Common/js/renderGrid.js'},
            {identifier:'create-jqgrid',script:'./wisdom-talkies/js/createjqgrid.js'}
        ];
        for(var i=0;i< extScripts.length;i++){
            if($('[data-identifier="'+extScripts[i]['identifier']+'"]').length > 0){
                ResizeCurationGrid=0;
                RenderJQGrids();
                break;
            }
            else{
                var elem    =   document.createElement('script');
                elem.setAttribute('data-identifier',extScripts[i]['identifier']);
//                elem.setAttribute('async',true);
                elem.setAttribute('type','text/javascript');
                elem.async= false;
                elem.setAttribute('src',extScripts[i]['script']);
                document.body.appendChild(elem);
            }
        }
        $scope.sendCurationDeleteRequest    =   function(event){
            if(IsValueNull(deletionContent)){
                return false;
            }
            UI_blockInterface();
            var remoteCallObj 			=   new CommonUtils.remoteCallClass();
            remoteCallObj.requestData   =   {'request':'curation_delete','data':{'videoID':deletionContent}}
            remoteCallObj.asyncPostRequest('./'+dataRequestURL,$scope.curationDeleteRequestCallback);
        };
        $scope.curationDeleteRequestCallback   =   function(response){
            UI_unBlockInterface();
            response    =   JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            $('#delete-curation-message').removeClass('hide');
            if(validateResponseCheck){
                $('#delete-curation-message').html('Content deleted successfully');
                $('#CurationListTable').trigger('reloadGrid');
            }
            else{
                $('#delete-curation-message').html(response.data.code);
            }
            deletionContent =   '';
            $('#delete-curation').find('.hide-toggle').addClass('hide');
        };
        $scope.cancelCurationDelete =   function(event){
            UI_closeModal('#delete-curation');
        }
    };
    myCurationController.$inject  =   ['$scope', '$routeParams', '$location', '$http', '$rootScope', 'serviceBreadCrumbs'];
    angular.module('wt').controller('myCurationController', myCurationController);
}());