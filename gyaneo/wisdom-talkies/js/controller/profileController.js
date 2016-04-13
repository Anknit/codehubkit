(function () {
    var profileController  =   function ($scope, $routeParams, $location, $http, $rootScope, serviceBreadCrumbs) {
        if(!l_ch){
            $location.path('/');
        }
        $('.section').css('display','none');
        $('body').scrollTop(0);
        $('#sidebar').css('display','none');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        $scope.profileData  =   [];
        $scope.loginType    =   'GOOGLE';
        $scope.BreadCrumbs  =   [];
        var breadCrumbInput =   [];
        var data    =   {},config={},successCallback = function (response) {
            response = response.data;
            if(response.status){
                $scope.profileData    =   response.data;
                $scope.loginType    =   $scope.profileData.loginType;
                $scope.locationCountry['name']  =   $scope.profileData.location;
            }
            else{
                console.log(response);
            }
        }, errorCallback = function (response) {
            console.log(response);
        };

        $http.get("./"+dataRequestURL+"?request=user_profile_read", data).then(successCallback, errorCallback);    

        $scope.editProfileInformation          =   function(event){
            var data    =   {},config={},country_jsonSuccessCallback = function (response) {
                    $scope.countriesJson    =   response.data;
             }, country_jsonErrorCallback = function (response) {
                 console.log(response);
             };

            $http.get("./"+dataRequestURL+"?request=country_json", data).then(country_jsonSuccessCallback, country_jsonErrorCallback);

            $('.profileUpdateMessageBox').text('');
            $('.editOption').addClass('hidden');
            $('.actionButton').removeClass('hidden');
            var profileInfoContainer    =   $('#generalInfoUpdate');
            var inputFields =   profileInfoContainer.find('input,select');
            profileInfoContainer.find('.display-entry').addClass('hidden');
            inputFields.each(function(){
                $(this).removeClass('hidden').val($(this).next('.display-entry').text());
            });
        };

        breadCrumbInput.push({name:'My Profile','link':''});
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
        $scope.locationCountry  =   {};

        $scope.saveProfileInformation          =   function(event){
            var userProfileForm =   $('#generalInfoUpdate');
            var remoteCallObj   =   new CommonUtils.remoteCallClass();
            if(userProfileForm.hasClass('hidden')){
                userProfileForm =   $('#passwordUpdateForm');
                var current_pass    =   userProfileForm.find('#current-password').val();
                var new_pass        =   userProfileForm.find('#new-password').val();
                var confirm_pass    =   userProfileForm.find('#confirm-password').val();
                if(current_pass	==	""){
                    $('.profileUpdateMessageBox').text('Current password cannot be blank').addClass('bg-danger');
                    return false;
                }
                if(new_pass	==	""){
                    $('.profileUpdateMessageBox').text('New password cannot be blank').addClass('bg-danger');
                    return false;
                }
                if(new_pass != confirm_pass){
                    $('.profileUpdateMessageBox').text('New password and confirm password do not match').addClass('bg-danger');
                    return false;
                }
                remoteCallObj.requestData   =   {'request':'user_profile_save','data':{'current_password':current_pass,'password':new_pass}};
                remoteCallObj.syncPostRequest('./'+dataRequestURL, this.profileInfoSaveRequestCallback);
            }
            else{
                userProfileForm.find('#sign-in-firstname').val(userProfileForm.find('#sign-in-firstname').val().trim());
                userProfileForm.find('#sign-in-lastname').val(userProfileForm.find('#sign-in-lastname').val().trim());
                if(IsValueNull(userProfileForm.find('#sign-in-firstname').val())){
                    $('.profileUpdateMessageBox').text('First name cannot be blank').addClass('bg-danger');
                    return false;
                }
                var user_username    =   userProfileForm.find('#sign-in-firstname').val()+' '+userProfileForm.find('#sign-in-lastname').val();
/*
                var user_age    =   userProfileForm.find('#sign-in-age').val();
                var user_phone    =   userProfileForm.find('#sign-in-phone').val();
*/
                var user_location   =   $scope.locationCountry.name;
                remoteCallObj.requestData   =   {'request':'user_profile_save','data':{'username':user_username,/*'age':user_age,*/'location':user_location/*,'phone':user_phone*/}};
                remoteCallObj.syncPostRequest('./'+dataRequestURL,this.profileInfoSaveRequestCallback);
            }
        };

        $scope.profileInfoSaveRequestCallback  =   function(response){
            response    =   JSON.parse(response);
            $('.profileUpdateMessageBox').removeClass('bg-success,bg-danger');
            var validateResponseCheck   =   validateAppResponse(response);
            var userProfileForm =   $('#generalInfoUpdate');
            if(validateResponseCheck){
                if(userProfileForm.hasClass('hidden')){
                    $('.profileUpdateMessageBox').text('Password updated successfully').addClass('bg-success');
                }
                else{
                    $('#userNameArea').attr('title',$('#sign-in-firstname').val()+' '+$('#sign-in-lastname').val()).text('Hi, '+$('#sign-in-firstname').val());
                    $('.user_name').text($('#sign-in-firstname').val()+' '+$('#sign-in-lastname').val());
                    $('.profileUpdateMessageBox').text('Profile updated successfully').addClass('bg-success');
                }
                $('.editOption').removeClass('hidden');
                $('.actionButton').addClass('hidden');
                if(userProfileForm.hasClass('hidden')){
                    userProfileForm.removeClass('hidden')
                    userProfileForm =   $('#passwordUpdateForm');
                    userProfileForm.addClass('hidden')
                    userProfileForm.find('input').each(function(){
                        this.value = '';
                    });
                }
                else{
                    var inputFields =   userProfileForm.find('input');
                    userProfileForm.find('.display-entry').removeClass('hidden');
                    inputFields.each(function(){
                        $(this).next('.display-entry').text($(this).val());
                        $(this).addClass('hidden').val('');
                        userProfileForm.find('select').addClass('hidden');
                    });
                    var locationText    =   $('.profile-location.display-entry').text($scope.locationCountry.name);
                }
            }
            else{
                if(IsValueNull(response.error))
                    response.error  =   'Profile not updated';
                $('.profileUpdateMessageBox').text(response.error).addClass('bg-danger');
            }
        };

        $scope.cancelEditProfileInformation    =   function(event){
            $('#generalInfoUpdate').removeClass('hidden');
            $('#passwordUpdateForm').addClass('hidden');
            $('.actionButton').addClass('hidden');
            $('.editOption').removeClass('hidden');
            $('.profileUpdateMessageBox').text('').removeClass('bg-success,bg-danger');
            var profileInfoContainer    =   $('#generalInfoUpdate');
            var inputFields =   profileInfoContainer.find('input');
            profileInfoContainer.find('.display-entry').removeClass('hidden');
            inputFields.each(function(){
                $(this).addClass('hidden').val('');
            });
            profileInfoContainer.find('select').addClass('hidden');
        };

        $scope.closeProfile =   function(){
            window.history.back();
        };

        $scope.changePasswordInformation   =   function(event){
            $('.profileUpdateMessageBox').text('');
            $('.editOption').addClass('hidden');
            $('.actionButton').removeClass('hidden');
            $('#generalInfoUpdate').addClass('hidden');
            var profileInfoContainer    =   $('#passwordUpdateForm').removeClass('hidden');
            var inputFields =   profileInfoContainer.find('input');
            inputFields.each(function(){$(this).val('');});
        };

    };
    profileController.$inject  =   ['$scope', '$routeParams', '$location', '$http', '$rootScope', 'serviceBreadCrumbs'];
    angular.module('wt').controller('profileController', profileController);
}());