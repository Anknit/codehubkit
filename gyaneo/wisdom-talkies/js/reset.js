$(document).ready(function()
{
	var sso_obj	=	new sso.app(getResetCompletionUrl());
	UI_createModal('#reset-password',null,null,null,null,true,preventClosing);
	$('#reset-text').click(function(event)
			{
				var password	=	$("#reset-in-password").val();
				var confirm	=	$("#reset-confirm-password").val();
				
				if(password	==	"")
				{
					$("#error").html('Password should not be empty');
					$("#reset-password").focus();
					return;
				}
				if(confirm	!=	password)
				{
					$("#error").html('Password donot match');
					$("#reset-confirm-password").focus();
					return;
				}
				
				var detailForm = $('#reset-password form');
				var str=detailForm.attr("action");
				var o_str=str.substring(0,94);
				var r_str=str.substring(94);
				var e_str=encodeURIComponent(r_str);
				var new_url=o_str.concat(e_str);
				detailForm.attr("action",new_url);	
				//detailForm.submit();
				sso_obj.reset_verify(password);
			});
});

function onSSOResponse(r)
{
	response	=	JSON.parse(r);
	if(response['status']	==	true) {
		window.location.href =  "./";
	}
	else if(response['status']	==	false) {
		$('#error').html(response["error"]);
	}
}