var fbPermissionArr	=	["public_profile", "user_friends", "email", "user_about_me", "user_actions.books", "user_actions.fitness", "user_actions.music", "user_actions.news", "user_actions.video", "user_actions:{app_namespace}", "user_activities", "user_birthday", "user_education_history", "user_events", "user_games_activity", "user_groups", "user_hometown", "user_interests", "user_likes", "user_location", "user_managed_groups", "user_photos", "user_posts", "user_relationships", "user_relationship_details", "user_religion_politics", "user_status", "user_tagged_places", "user_videos", "user_website", "user_work_history", "read_custom_friendlists", "read_insights", "read_mailbox", "read_page_mailboxes", "read_stream", "manage_notifications", "manage_pages", "publish_pages", "publish_actions", "rsvp_event"];
var setfbconfig	= function(appid,ver){
	window.fbAsyncInit(appid,ver);
};
window.fbAsyncInit = function(appid,ver) {
    FB.init({
    	appId      : appid,
        cookie     : true,
    	xfbml      : true,
    	version    : ver
    });
};

function checkfbLoginState() {
	var loginstate	=	false;
	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			loginstate	=	true;
	    } 
	    else if (response.status === 'not_authorized') {
	    	alert('Please log into this app');
	    }
	    else {
	    	alert('Please log into this app');
	    }
	});
	return loginstate;
}
function fbuserinfo(permissionSet) {
	if(permissionSet == '' || permissionSet == null){
		permissionSet = '0,1';
	}
	var scopeStr	=	'';
	var permissions	=	permissionSet.split(',');
	for(var per=0; per<permissions.length;per++){
		if(per>0){
			scopeStr	+=	', ';
		}
		scopeStr	+=	fbPermissionArr[parseInt(permissions[per])];
	}
    FB.api('/me/permissions', function(response) {
    	fbLoginResponseInfo	=	response;
    },{scope:scopeStr,auth:'rerequest'});
}
