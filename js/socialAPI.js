var	fb_api_appid = '1648955058690150';
var fb_api_ver = 'v2.5';
var fbLoginResponseInfo = '';
var loginFacebook	=	function(){
	if(checkfbLoginState()){
		fbuserinfo('0,1');
	}
};