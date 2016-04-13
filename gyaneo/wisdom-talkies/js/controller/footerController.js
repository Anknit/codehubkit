(function () {
    var footerController  =   function ($scope, $location, $routeParams, $http, $rootScope, serviceBreadCrumbs) {
        $('.section').css('display','none');
        $('body').scrollTop(0);
        $('#sidebar').css('display','none');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        $scope.BreadCrumbs  =   [];
        var breadCrumbInput =   [];
        var breacrumbStr    =   ''
        switch($location.$$path.split('/')[1]){
            case 'aboutUs':
                breacrumbStr    =   'About us'
                break;
            case 'termsOfService':
                breacrumbStr    =   'Terms of Service'
                break;
            case 'privacy':
                breacrumbStr    =   'Privacy statements'
                break;
            case 'legalNotice':
                breacrumbStr    =   'Legal Notices & Trademarks'
                break;
            default:
                break;
        }
        breadCrumbInput.push({name:breacrumbStr,'link':''});
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);

        $scope.submitfeedback  =   function(){
            var feedbackTitle   =   $('#feedback-title').val();
            var feedbackDesc   =   $('#feedback-description').val();
            if(IsValueNull(feedbackTitle) || IsValueNull(feedbackDesc)){
                $('#feedback-request-alert').html('Fill all inputs');
                return false;
            }
            var xhrObj = new CommonUtils.remoteCallClass();
            xhrObj.requestData	=	{'request':'submit_feedback','data':{'title':feedbackTitle,'desc':feedbackDesc}};
            xhrObj.asyncPostRequest("./"+dataRequestURL,this.FeedbackRequestCallback);
            UI_blockInterface();
        };
        $scope.FeedbackRequestCallback =   function(response){
            UI_unBlockInterface();
            response = JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                $('#feedback-request-alert').html('Feedback submitted successfully');
                $('footer').scope().resetFeedbackInputs();
            }
            else{
                $('#feedback-request-alert').html('Error in feedback submission');
            }
        };
    };
    footerController.$inject  =   ['$scope','$location', '$routeParams', '$http', '$rootScope', 'serviceBreadCrumbs'];
    angular.module('wt').controller('footerController', footerController);
}());