function onSSOResponse(r , type)
{
	response	=	JSON.parse(r);
	if(response['status']	==	true)
		{
			if( type	==	"signup")
			{
				$('#sign-in-error-message').html("Verification link has been sent to your email!");
				$('#sign-in-error2')[0].style.display="block";
				$('#loadingDiv').css('display','none');
			}
			else if(type	==	"reset")
			{
				$('#sign-in-error-message').html("Reset password link has been sent to your email!");
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