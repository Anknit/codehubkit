$(document).ready(function(){
	var sso_obj	=	new sso.app(getSignupCompletionUrl());
	UI_createModal('#sign-up-details',null,null,null,null,true,preventClosing);
	
	var length_of_countries	=	countries_json.length;
	for(i=0;i<length_of_countries;i++)
	{
		$("#sign-in-location").append('<option value="'+countries_json[i]['name']+'">'+countries_json[i]['name']+'</option>')
	}
	
	$('#sign-up-text').click(function(event){
		
		var firstname	=	$("#sign-in-firstname").val();
		var password	=	$("#sign-in-password").val();
		var confirm	=	$("#sign-in-confirm-password").val();
		if(firstname	==	"")
			{
				$("#error").html('First name should not be empty');
				$("#sign-in-firstname").focus();
				return;
			}
		if(password	==	"")
			{
				$("#error").html('Password should not be empty');
				$("#sign-in-password").focus();
				return;

			}
		if(confirm	!=	password)
			{
				$("#error").html('Password donot match');
				$("#sign-in-confirm-password").focus();
				return;
			}
				
		var detailForm = $('#sign-up-details form');
		var str=detailForm.attr("action");
		var o_str=str.substring(0,94);
		var r_str=str.substring(94);
		var e_str=encodeURIComponent(r_str);
		var new_url=o_str.concat(e_str);
		detailForm.attr("action",new_url);	
		//detailForm.submit();
		var formInputs	=	detailForm.find('input[data-server]');
		var submitObj = {};
		var oKey,oVal;
		for(var i=0;i<formInputs.length;i++){
			oKey	=	formInputs.eq(i).attr('name');
			oVal	=	formInputs.eq(i).val();
			submitObj[oKey]	=	oVal;
		}
		var temp_location_key	=	$("#sign-in-location").attr("name");
		var temp_location_value	=	$("#sign-in-location").val();
		
		submitObj[temp_location_key]	=	temp_location_value;
		submitObj['username']		=	submitObj['first_name']+' '+submitObj['last_name'];
		delete	submitObj['first_name'];
		delete	submitObj['last_name'];
		sso_obj.signup_verify(submitObj);
	});
});
function onSSOResponse(r)
{
	response	=	JSON.parse(r);
	if(response['status']	==	true)
		{
				window.location.href =  "./";
		}
		
	else if(response['status']	==	false)
		{
			$('#error').html(response["error"]);
		}
}