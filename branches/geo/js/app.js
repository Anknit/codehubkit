(function () {
    var app = angular.module('gyaneo',['ngAnimate','ui.bootstrap']);
    app.config(function($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for(name in obj) {
          value = obj[name];
          if(value instanceof Array) {
            for(i=0; i<value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value instanceof Object) {
            for(subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
        };
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    });
    app.factory(
        "transformRequestAsFormPost",
        function() {
            function transformRequest( data, getHeaders ) {
                var headers = getHeaders();
                headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";
                return( serializeData( data ) );
            }
            return( transformRequest );
            function serializeData( data ) {
                if ( ! angular.isObject( data ) ) {
                    return( ( data == null ) ? "" : data.toString() );
                }
                var buffer = [];
                for ( var name in data ) {
                    if ( ! data.hasOwnProperty( name ) ) {
                        continue;
                    }
                    var value = data[ name ];
                    buffer.push(
                        encodeURIComponent( name ) +
                        "=" +
                        encodeURIComponent( ( value == null ) ? "" : value )
                    );
                }
                var source = buffer
                    .join( "&" )
                    .replace( /%20/g, "+" )
                ;
                return( source );
            }
        }
    );
    app.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            return input.split(splitChar)[splitIndex];
        }
    });
    app.filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
              filtered.push(item);
            });
            filtered.sort(function (a, b) {
              return (a[field] > b[field] ? 1 : -1);
            });
            if(reverse) filtered.reverse();
                return filtered;
        };
    });
    
    app.controller('siginmodal', function ($scope, $uibModal, $log) {
        $scope.animationsEnabled = true;
        $scope.items = ['1','2'];
        $scope.open = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'geo/template/signinmodal.html',
                controller: 'signinCtrl',
                size: size,
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        };
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    });

    app.controller('signinCtrl',function($scope, $uibModalInstance){
        sso_obj	=	new sso.app("./"+dataRequestURL);
        $scope.templateLoad = false;
        $scope.$watch("templateLoad",function(oldvalue,newvalue){
            if(newvalue){
                $scope.templateLoaded();
            }
        });
        
        $scope.templateLoaded = function(){
            if(typeof auth2 == "undefined"){
                gapi.load('auth2', function(){
                  // Retrieve the singleton for the GoogleAuth library and set up the client.
                    auth2 = gapi.auth2.init({
                        client_id: '42338840257-9ll1lip2eqc6dg2p00ntl94njnb39d1r.apps.googleusercontent.com',
                        cookiepolicy: 'single_host_origin',
                        // Request scopes in addition to 'profile' and 'email'
                        //scope: 'additional_scope'
                    });
                    attachSignin(document.getElementById('google-signin'));
                });
            }
        };
        
        $scope.sign_in_reset = function(event){
            var re1=/(.+)@(.+)\.(.+)/i;
            var text = document.getElementById('sign-in-email').value;
            document.getElementsByClassName("error")[0].style.display="none";
            if(document.getElementById('sign-in-email').value=="")
            {
                document.getElementById('sign-in-error2').style.display="block";
                document.getElementById('sign-in-error-message').innerHTML="Enter the Email address";
                return;
            }	
            else if(!re1.test(text))
            {
                document.getElementById('sign-in-error-message').innerHTML="Enter valide email id";
                document.getElementById('sign-in-error2').style.display="block";
                return;
            }
            else
            {
                document.getElementById('loadingDiv').style.display = 'inline-block';
                sso_obj.reset(text);
            }
        };
        $scope.sign_in_submit = function (sign,event){
            document.getElementById('sign-in-error-message').innerHTML="";
            document.getElementById('sign-in-error2').style.display="none";
            if(sign==0)
            {
                if(!validations(0))
                {
                    return false;
                }
                var email	=	document.getElementById('sign-in-email').value;
                var pass	=	document.getElementById("sign-in-password").value;

                if(pass	==	null	||	pass	==	"")
                {
                    document.getElementById('sign-in-error-message').innerHTML="Password cannot be blank";
                    document.getElementById('sign-in-error2').style.display="block";
                    return false;
                }
                else if(pass.length	<	6)
                {
                    document.getElementById('sign-in-error-message').innerHTML="Password length must be atleast 6";
                    document.getElementById('sign-in-error2').style.display="block";
                    return false;
                }
                document.getElementById('loadingDiv').style.display ='inline-block';
                sso_obj.signin(email,pass);
            }
            else if(sign==1)
            {
                if(!validations(0))
                {
                    return false;
                }
                var email	=	document.getElementById('sign-in-email').value;
                document.getElementById('loadingDiv').style.display = 'inline-block';
                sso_obj.signup(email);

            }
        };

        $scope.validations = function(msg){
            var re1 = /(.+)@(.+)\.(.+)/i;
            var text = document.getElementById('sign-in-email').value;
            if(!re1.test(text)){
                document.getElementById('sign-in-error-message').innerHTML="Invalid email!";
                document.getElementById('sign-in-error2').style.display="block";
                return 0;
            }
            if(msg	==	1){
                if(document.getElementById('sign-in-password').value != document.getElementById('sign-in-confirm-password').value){
                    document.getElementById('sign-in-error-message').innerHTML="Password do not match!";
                    document.getElementById('sign-in-error2').style.display="block";
                    return 0;
                }
                else if(!document.getElementById('sign-in-nickname').value || document.getElementById('sign-in-nickname').value==""){
                    document.getElementById('sign-in-error-message').innerHTML	=	"Enter nickname";
                    document.getElementById('sign-in-error2').style.display	=	"block";
                    return 0;
                }
            }
            return 1;
        }
    });

})();

function attachSignin(element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function(googleUser) {
          alert("Signed in: " + googleUser.getBasicProfile().getName());
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }