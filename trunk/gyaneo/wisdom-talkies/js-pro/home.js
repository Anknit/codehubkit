var getHomeData=function(){},renderHomeData=function(){vidPlayerObject.playerHandle&&vidPlayerObject.currentVideoID&&(vidPlayerObject.UnloadVideo(),data.videoID="");var a=data.homeVid,c=$("#categories").html(""),d="",e="",f="";c.append('<div class="row"></div>');for(var c=c.children(".row"),b=0;b<a.length;b++)e='<div class="col-sm-4 col-md-3 col-xs-6 categorySection"><div class="categoryDesc col-md-12 text-center" data-catId="'+a[b].attr["data-catid"]+'" data-vidId="'+a[b].attr["data-vidId"]+'">'+
a[b].label+"</div>",d='<div class="cat-thumb-item"><div class="thumbnail cat-thumbnail" data-vidId="'+a[b].attr["data-vidId"]+'" data-catid="'+a[b].attr["data-catid"]+'"><div class="cat-thumb" data-catname="'+a[b].label+'" data-shared="Shared: '+a[b].shared+'" href="'+a[b].link+'"><span class="play-icon"></span><img onload="CheckImgErr(this);" onerror="CheckImgErr(this);" src="'+a[b].tnurl+'" alt=""/></div><div class="caption"><div title="'+a[b].title+'" class="cat-thumb-title">'+a[b].title+'</div><div class="shared">By '+
a[b].shared+"</div></div></div></div>",f="</div>",c.append(e+d+f);UI_createTooltip(".cat-thumb-title");setBreadCrumb();toggleSmallScreenControls("",!1)},categoryThumbnailAction=function(a){showCategoryVideos(a,!0);playVideo(a,!0)};