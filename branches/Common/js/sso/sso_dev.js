var sso	=	sso||{};

/*
setfbconfig('464257530407346','v2.3');
var fbLoginResponseInfo = '';
var loginFacebook	=	function(){
	if(checkfbLoginState()){
		fbuserinfo('0,1');
	}
};
*/

sso.app	=	function(url)
{
	this.u	=	url;
	ssoUrl = url;
	
	onSignIn	=	function(googleUser)
	{
		if(ssoUrl == null || ssoUrl == "")
		{
			console.log('SSO object not initialised');
			return false;
		}
		if(l_ch	==	1)
		{
			return false;
		}
		var id_token	=	googleUser.getAuthResponse().id_token;
		var user_image	=	googleUser.getBasicProfile().getImageUrl();
		
		$.ajax({url:ssoUrl,
			type: 'POST',
			data:{"request":"sso_google_signin","data":{"sso_idtoken": id_token } },
			async:true,
			success:function(data)
			{
				onSSOResponse(data);
			}
		});
	};
};