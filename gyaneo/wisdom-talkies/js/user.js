function login()
{
	$("#sign-in-container").css('display','block');
}

var resetSignUpOption	=	function(){
	$('#sign-in-container input').val('');
	sign_in();
};
