/*//setfbconfig('386632408213192','v2.3');
setfbconfig('464257530407346','v2.3');
var fbLoginResponseInfo = '';
var loginFacebook	=	function(){
	if(checkfbLoginState()){
		fbuserinfo('0,1');
	}
};*/

function fb_login_onclick(){
	
	function statusChangeCallback(response) {
	    console.log('statusChangeCallback');
	    console.log(response);
	    if (response.status === 'connected') {
	      testAPI(event);
	    } else if (response.status === 'not_authorized') {
	       document.getElementById('status').innerHTML = 'Please log ' +
	        'into this app.';
	    } else {
	      document.getElementById('status').innerHTML = 'Please log ' +
	        'into Facebook.';
	    }
	  }
	
	function checkLoginState() {
	    FB.getLoginStatus(function(response) {
	      statusChangeCallback(response);
	    });
	  }
	
	function testAPI(event) {
		console.log('Welcome!  Fetching your information.... ');
	    FB.api('/me', function(response) {
	      console.log('Successful login for: ' + response.name);
	      document.getElementById('status').innerHTML =
	        'Thanks for logging in, ' + response.name + '!';
	    });
	  }
}