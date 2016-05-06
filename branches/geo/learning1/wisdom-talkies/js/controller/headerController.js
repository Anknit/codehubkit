(function () {
    var headerController  =   function ($scope, $route, $routeParams, $location, $http, serviceBreadCrumbs, $rootScope) {
        $scope.setSearchView    =   function(){
            var locationStr =   '/search';
            if(!IsValueNull(mainAppVars.searchInputText)){
                locationStr += '/search='+ mainAppVars.searchInputText;
            }
            if(!IsValueNull(mainAppVars.searchCategory) && mainAppVars.searchCategory && mainAppVars.searchCategory != "0"){
                locationStr += '&catfilter='+mainAppVars.searchCategory;
            }
            if(locationStr == $location.$$path){
                $route.reload();
            }
            else{
                $location.path(locationStr);
            }
            $scope.$apply();
        }
        $rootScope.setCatBreadCrumb =   function(category){
            var temp_category   =   category;
            var temp_arr = [];
            while(true){
                temp_arr.push({name:mainAppVars.catNameObject[temp_category],link:'search/category='+temp_category});
                temp_category	=	parentCatObj[temp_category];
                if(typeof(temp_category)	==	"undefined"){
                    break;
                }
            }
            return temp_arr.reverse();
        };
        $scope.showFeedbackModal    =   function(){
            this.resetFeedbackInputs();
            $('#feedback-request-alert').html('It will be great to receive your valuable feedback/suggestion');
            UI_openModal('#feedback-form');
        };
        $scope.resetFeedbackInputs =   function(){
            $('#feedback-title').val('');
            $('#feedback-description').val('');
        };

        $scope.logoutUser	=	function(){
            if(typeof(gapi)	==	"undefined")
            {
                console.log("Unable to download gapi");
                return false;
            }
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
            });
            var xhrObj = new CommonUtils.remoteCallClass();
            xhrObj.requestData  =   {'request':'logout'};
            xhrObj.asyncPostRequest('./'+dataRequestURL,this.userLogoutRequestCallback);
        };
        $scope.userLogoutRequestCallback	=	function(response){
            response    =   JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                    location.reload();
            }
            else{
                UI_alert('Error in logout');
            }
        };
        $scope.getKeywordMatch  =   function(event){
            getKeywordMatch(event);
        };
        $scope.$on('breadCrumbData',function(event,data){
            $scope.BreadCrumbs = data;
        });
        $scope.gotoCuration = function(){
            if(!l_ch){
                mainAppVars.redirectUrlIndex = 1;
                UI_openModal('#sign-in-container');
            }
            else{
                location.href = './?page=list&request=curate';
            }
        };
        $scope.gotoabout    =   function(){
            $('body').animate({'scrollTop':($('#aboutWT')[0].offsetTop - 50)},1000);
        };
        $scope.gotoHome = function(){
            location.href = './';
            return true;
        };
        $scope.toggleSmallScreenControls = function(button,showOpt){
            if(showOpt){
                $('#headlogo').css('display','none');
                $('.smallScreenComponent').css('opacity',0);
                if(button == "search"){
                    $('#headsearch').css('opacity','0').removeClass('hidden-xs').animate({'opacity':'1'},300);
                }
                else if(button == "menu"){
                    $('#headbutton,#headcategory').css('opacity','0').removeClass('hidden-xs').animate({'opacity':'1'},300);
                }
            }
            else{
                $('#headlogo').css('display','block');
                $('.smallScreenComponent').css('opacity',1);
                $('#headsearch,#headcategory,#headbutton').animate({'opacity':'1'},300).addClass('hidden-xs').css('opacity','0');
            }
        };
        $scope.setCategoryData  =   function(){
            var catData	=	data.categories;
            UI_createJsonUL('#categorydropdown',{'html':catData});
            UI_createDropdown('#categorydropdown');
/*
            $('#categorydropdown > ul').children('li:nth-child(n+7)').addClass('hiddenElem');
            $('#categorydropdown > ul').append('<li class="showMoreCat"><a href="#">Show more</a></li>');
*/
//            createSubmenu();
            $('#categorydropdown > button').removeClass('btn-default').addClass('btn-link');
            UI_postAddon('#headsearchinput','glyphicon-search',false,'getKeywordMatch');
            if(!youtubeListFlag){
                UI_preAddon('#headsearchinput','<div id="searchBoxCat" data-label="All Categories"></div>');
            }
            catData.splice(0,0,{'link':'#','label':'All Categories'});
            UI_createJsonUL('#searchBoxCat',{'html':catData});
            catData.splice(0,1);
            UI_createDropdown('#searchBoxCat');
            UI_createModal('#sign-in-container','','','','resetSignUpOption',false);
            UI_bindModalButton('#headLoginButton','#sign-in-container');
            mainCatArray    =   [];
            for(var key in catData){
                mainCatArray.push(catData[key]['attr']['data-catid']);
                mainAppVars.catNameObject[catData[key]['attr']['data-catid']] = catData[key]['label'];
                $('#recommendcategoryInput').append('<option value="'+catData[key]['attr']['data-catid']+'">'+catData[key]['label']+'</option>');
            };
            var subCatData = data.allStructureCategories;
            parentCatObj    =   {};
            for(var key in subCatData){
                for(var i=0;i<subCatData[key].length;i++){
                parentCatObj[subCatData[key][i]['attr']['data-catid']]  =   key;
                    mainAppVars.catNameObject[subCatData[key][i]['attr']['data-catid']] = subCatData[key][i]['label'];
                }
            };
            mainAppVars.catBreadcrumb   =   {};
            for(var key in mainAppVars.catNameObject){
                var temp_category   =   key;
                var temp_str = '';
                while(true){
                    temp_str = mainAppVars.catNameObject[temp_category] + ' / ' + temp_str;
                    temp_category	=	parentCatObj[temp_category];
                    if(typeof(temp_category)	==	"undefined"){
                        mainAppVars.catBreadcrumb[key]  =   temp_str.replace(/\/([^\/]*)$/,'$1');;
                        break;
                    }
                }
            }

        };
        $scope.BreadCrumbs  =   serviceBreadCrumbs.pathObject;
        $scope.$watch(
            function(){serviceBreadCrumbs.pathObject},
            function(newValue, oldValue){
                $scope.BreadCrumbs  =   serviceBreadCrumbs.pathObject;
            }
        );
    };
    headerController.$inject  =   ['$scope', '$route', '$routeParams', '$location', '$http', 'serviceBreadCrumbs', '$rootScope'];
    angular.module('wt').controller('headerController', headerController);
}());