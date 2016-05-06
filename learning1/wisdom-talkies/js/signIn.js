window.onload   =   function()
{
	sso_obj	=	new sso.app("./"+dataRequestURL);
	$('#reset_password').click(sign_in_reset);
	$("#sign-in-password").keyup(function (e)
		{
			if (e.keyCode == 13) 
			{
				sign_in_submit(0);
			}	
		});
};

function signUptext()
{
	$("#sign-in-container .modal-content").fadeOut(100,function()
	{
		$("#sign-in-container .modal-content").fadeIn();
		$(".error").css("display","none");
		$(".sign-up-show").css("display","inline-block");
		$(".sign-up-hide").css("display","none");
	});
}

function sign_in()
{
	$("#sign-in-container .modal-content").fadeOut(100,function()
	{
		$("#sign-in-container .modal-content").fadeIn();
		$(".error").css("display","none");
		$(".sign-up-show").css("display","none");
		$(".sign-up-hide").css("display","inline-block");
		$(".sign-in-forget-password").css("display","block");
	});
}

function sign_in_submit(sign,event)
{
	$('#sign-in-error-message')[0].innerHTML="";
	$('#sign-in-error2')[0].style.display="none";
	if(sign==0)
	{
		if(!validations(0))
		{
			return false;
		}
		var email	=	$('#sign-in-email').val();
		var pass	=	$("#sign-in-password").val();
		
		if(pass	==	null	||	pass	==	"")
		{
			$('#sign-in-error-message')[0].innerHTML="Password cannot be blank";
			$('#sign-in-error2')[0].style.display="block";
			return false;
		}
		else if(pass.length	<	6)
		{
			$('#sign-in-error-message')[0].innerHTML="Password length must be atleast 6";
			$('#sign-in-error2')[0].style.display="block";
			return false;
		}
		$('#loadingDiv').css('display','inline-block');
		sso_obj.signin(email,pass);
	}
	else if(sign==1)
	{
		if(!validations(0))
		{
			return false;
		}
		var email	=	$('#sign-in-email').val();
		$('#loadingDiv').css('display','inline-block');
		sso_obj.signup(email);
			
	}
}
function sign_in_reset()
{
	var re1=/(.+)@(.+)\.(.+)/i;
	var text=$('#sign-in-email').val();
	document.getElementsByClassName("error")[0].style.display="none";
	if($('#sign-in-email').val()=="")
	{
		$('#sign-in-error2')[0].style.display="block";
		$('#sign-in-error-message')[0].innerHTML="Enter the Email address";
		return;
	}	
	else if(!re1.test(text))
	{
		$('#sign-in-error-message')[0].innerHTML="Enter valide email id";
		$('#sign-in-error2')[0].style.display="block";
		return;
	}
	else
	{
		$('#loadingDiv').css('display','inline-block');
		sso_obj.reset(text);
	}
}
function validations(msg)
{
	
	var re1=/(.+)@(.+)\.(.+)/i;
	var text=$('#sign-in-email').val();
	if(!re1.test(text))
	{
		$('#sign-in-error-message')[0].innerHTML="Invalid email!";
		$('#sign-in-error2')[0].style.display="block";
		return 0;
	}
	if(msg	==	1)
		{
			if($('#sign-in-password').val()!=$('#sign-in-confirm-password').val())
			{
				$('#sign-in-error-message')[0].innerHTML="Password do not match!";
				$('#sign-in-error2')[0].style.display="block";
				return 0;
			}
			else if(!$('#sign-in-nickname').val() || $('#sign-in-nickname').val()=="")
			{
				$('#sign-in-error-message')[0].innerHTML	=	"Enter nickname";
				$('#sign-in-error2')[0].style.display	=	"block";
				return 0;
			}
		}
	return 1;
}
function onSSOResponse(r , type)
{
	response	=	JSON.parse(r);
	if(response['status']	==	true)
		{
			if( type	==	"signup")
			{
				$('#sign-in-error-message').html("Verification link has been sent to your mail!");
				$('#sign-in-error2')[0].style.display="block";
				$('#loadingDiv').css('display','none');
			}
			else if(type	==	"reset")
			{
				$('#sign-in-error-message').html("Reset password link has been sent to your mail!");
				$('#sign-in-error2')[0].style.display="block";
				$('#loadingDiv').css('display','none');
			}
			else
			{
				if(mainAppVars.redirectUrlIndex != 0)
				{
					location.href = getLocationUrl(mainAppVars.redirectUrlIndex);
				}
				else
				{
					location.reload(); 
				}
			}
		}
	else if(response['status']	==	false)
		{
			$('#sign-in-error-message').html(response["error"]);
			$('#sign-in-error2')[0].style.display="block";
			$('#loadingDiv').css('display','none');
		}
}