var sso	=	sso||{};

sso.app	=	function(url)
{
	this.u	=	url;
	ssoUrl = url;
	this.reset	=	function(e)
	{
		if(this.u == null || this.u == "")
		{
			console.log('SSO object not initialised');
			return false;
		}
		var type = 'reset';
		$.ajax({url:this.u,
			type: 'POST',
			data:{"request":"sso_initiate_reset","data":{"sso_email":e} },
			async:true,
			
			success:function(data)
			{
				onSSOResponse(data, type);
			}
		});
	}
	
	this.signin	=	function(e,p)
	{
		if(this.u == null || this.u == "")
		{
			console.log('SSO object not initialised');
			return false;
		}
		$.ajax({url:this.u,
			type: 'POST',
			data:{"request":"sso_signin_verify","data":{"sso_email":e, "sso_password":p} },
			async:true,
			
			success:function(data)
			{
				onSSOResponse(data);
			}
		});
	}

	this.signup	=	function(e)
	{
		if(this.u == null || this.u == "")
		{
			console.log('SSO object not initialised');
			return false;
		}
		var type = 'signup';
		$.ajax({url:this.u,
			type: 'POST',
			data:{"request":"sso_initiate_signup","data":{"sso_email":e} },
			async:true,
			
			success:function(data)
			{
				onSSOResponse(data, type);
			}
		});
	}
	
	this.signup_verify	=	function(m)
	{
		if(this.u == null || this.u == "")
		{
			console.log('SSO object not initialised');
			return false;
		}
		$.ajax({url:this.u,
			type: 'POST',
			data:{"data":{"sso_user_info":JSON.stringify(m)} },
			async:true,
			success:function(data)
			{
				onSSOResponse(data);
			}
		});
	}

	this.reset_verify	=	function(p)
	{
		if(this.u == null || this.u == "")
		{
			console.log('SSO object not initialised');
			return false;
		}
		$.ajax({url:this.u,
			type: 'POST',
			data:{"data":{"sso_password":p} },
			async:true,
			success:function(data)
			{
				onSSOResponse(data);
			}
		});
	}
	
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