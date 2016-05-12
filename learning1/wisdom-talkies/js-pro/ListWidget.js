var _ListWidget_=_ListWidget_||{};
_ListWidget_.createList=function(n){var h=n.documents||[],m=n.facets||[],d=[],l=[];this.ready=!0;this.init=function(){for(var c=0;c<m.length;c++)switch(m[c].fieldName){case "category":l=m[c].terms}}();this.generateListPageList=function(c){for(var a="",b=0;b<h.length;b++){d[b]=[];for(var e=h[b].snippets,f=0;f<e.length;f++){var g=e[f].fieldName,k=e[f].values;g&&k&&(d[b][g]=k[0])}contentObj[d[b].id]=d[b];topicArr[d[b].id]=d[b].topicinfo;e=!1;0==JSON.parse(d[b].topicinfo).topic_info.length&&(e=!0);a+=
'<div class="row"><div class="col-md-12">';a+='<div class="row list-item-row" data-vidId="'+d[b].id+'" data-vidSource="'+getVideoSourceType(d[b].url)+'" data-sourcevidId="'+d[b].videoid+'">';a+='<div class="col-md-3 col-sm-12 tn_col" ><div class="row">';a=e?a+('<div class="col-md-12 overlay-info text-center" data-curate="'+d[b].curetedby+'" data-cat="'+getVideoSourceType(d[b].url)+'">'):a+('<div class="col-md-12 overlay-info text-center" data-curate="'+d[b].curetedby+'" data-cat="'+getVideoCategoryName(d[b].category)+
'">');a+='<img class="list_tn" onload="CheckImgErr(this);" src="'+d[b].tnurl.replace("default","mqdefault")+'"/>';a+='<span class="play-icon"></span>';a+='</div></div><div class="row">';a+='<div class="list_credits col-md-12">';a+="<span>"+d[b].numqa+" questions</span>";a+="<span>"+d[b].numcomments+" comments</span>";a+="</div></div>";a+="</div>";a+='<div class="col-md-9 col-sm-12 toggle-container"><div class="row">';a+='<div class="col-md-12 list_title">'+d[b].string+"</div>";a+='</div><div class="row"><div class="col-md-12 content_credits"><small>';
a+="<span>Shared by "+d[b].uploadedby+"</span>";a+="<span>"+d[b].pubDate+" , "+d[b].numofviews+" views</span>";a+="</small></div></div>";a+='<div class="content-data content-toggle row">';a=e?a+'<div class="col-md-12 col-sm-12 content-desccription">':a+'<div class="col-md-6 col-sm-12 content-desccription">';a+="<p>"+d[b].description+"</p>";a+="</div>";if(!e){a+='<div class="col-md-6 col-sm-12 content-topics"><div class="hidden-sm hidden-xs">';a+='<div class="text-left">Topics</div>';a+='<ol class="content-topic-list">';
e=JSON.parse(d[b].topicinfo).topic_info;for(f=0;f<e.length;f++)a+="<li>",a+="<span>"+secondsToTimeStr(e[f].start_time)+"</span>",a+="<span>"+e[f].topic+"</span>",a+="</li>";a+="</ol>";a+="</div></div>"}a+="</div>";a+="</div>";a+='<div class="col-md-9 col-md-offset-3 col-sm-12 col-sm-offset-0 toggle-button"><div class="media-toggle-link closed">More...</div><div class="media-toggle-link open">Back</div></div>';a+="</div>";a+="</div></div>";$(c).append(a);a=""}};this.generateViewPageList=function(){var c=
"",a=!1;0<d.length&&(a=!0);for(var b=0;b<h.length;b++){if(!a){d[b]=[];for(var e=h[b].snippets,f=0;f<e.length;f++){var g=e[f].fieldName,k=e[f].values;g&&k&&(d[b][g]=k[0])}contentObj[d[b].id]=d[b];topicArr[d[b].id]=d[b].topicinfo}e=!1;0==JSON.parse(d[b].topicinfo).topic_info.length&&(e=!0);c+='<div class="row">';c+='<div class="col-md-12">';c+='<div class="row list-item-row" data-vidId="'+d[b].id+'" data-vidSource="'+getVideoSourceType(d[b].url)+'" data-sourcevidId="'+d[b].videoid+'">';c+='<div class="col-md-12">';
c+='<div class="row">';c+='<div class="col-md-12 list_title">'+d[b].string+"</div>";c+="</div>";c+="</div>";c+='<div class="col-md-12">';c+='<div class="row">';c+='<div class="col-md-6 col-sm-12" >';c+='<img onload="CheckImgErr(this);" class="tn_suggestion" src="'+d[b].tnurl.replace("default","mqdefault")+'"/>';c+='<span class="play-icon"></span>';c+="</div>";c+='<div class="list_credits col-md-6 col-sm-12 ">';e?(c+='<div class="suggestion_item_credits">',c+="<span><strong>Recommend for curation</strong></span>"):
(c+='<div class="suggestion_item_credits">',c+="<span><strong>"+getVideoCategoryName(d[b].category)+"</strong></span>",c+="<span>Shared: "+d[b].curetedby+"</span>",c+="<span><small>"+d[b].numofviews+" views</small></span>",c+="<span><small>"+d[b].numqa+" questions & answers</small></span>");c+="</div>";c+="</div>";c+="</div>";c+="</div>";c+="</div>";c+="</div>";c+="</div>"}return c};this.generateYoutubeList=function(c){for(var a="",b=0;b<h.length;b++){d[b]=[];for(var e=h[b].snippets,f=0;f<e.length;f++){var g=
e[f].fieldName,k=e[f].values;g&&k&&(d[b][g]=k[0])}a+='<div class="row"><div class="col-md-12">';a+='<div class="row list-item-row" data-sourcevidId="'+d[b].videoid+'">';a+='<div class="col-md-3 col-sm-12 tn_col" ><div class="row">';a+='<div class="col-md-12 overlay-info text-center">';a+='<img onload="CheckImgErr(this);" class="list_tn" src="'+d[b].tnurl.replace("default","mqdefault")+'"/>';a+='<span class="play-icon"></span>';a+='</div></div><div class="row">';a+='<div class="list_credits col-md-12">';
a+="</div></div>";a+="</div>";a+='<div class="col-md-9 col-sm-12 toggle-container"><div class="row">';a+='<div class="col-md-12 list_title">'+d[b].string+"</div>";a+='</div><div class="row"><div class="col-md-12 content_credits"><small>';a+="</small></div></div>";a+='<div class="content-data content-toggle row">';a+='<div class="col-md-12 col-sm-12 content-desccription">';a+="<p>"+d[b].description+"</p>";a+="</div>";a+="</div>";a+="</div>";a+='<div class="col-md-9 col-md-offset-3 col-sm-12 col-sm-offset-0 text-center toggle-button"><div class="media-toggle-link watch">Watch</div><div class="media-toggle-link curate">Curate</div></div>';
a+="</div>";a+="</div></div>";$(c).append(a);a=""}};this.createCategoryFilter=function(){var c=$("#cat-filter-container .catfilteritem.dummyEntry");$("#cat-filter-container .catfilteritem").not(".dummyEntry").remove();for(var a=0;a<l.length;a++)if(0<l[a].count){var b=c.clone();b.removeClass("dummyEntry").attr("data-catfilter",l[a].term);var d=b.find(".maincat").attr("href");b.find(".maincat").attr("href",d+l[a].term);b.find(d).attr("id",d+l[a].term);b.find(".maincat").html(getVideoCategoryName(l[a].term)+
'<span class="badge">'+l[a].count+"</span>");b.find(".collapse").removeClass("collapse").removeClass("in").addClass("collapse");$("#cat-filter-container").append(b)}};this.createSourceFilter=function(){};this.createGeneralFilter=function(){};this.generateBookmarksList=function(c){var a="",b="",d;$(c).find(".list-item-row:not(.dummyRow)").remove();var f=$(c).find(".dummyRow"),g;for(g in h){a=f.clone(!0);a.removeClass("dummyRow");a.attr({"data-bookmark-id":h[g].bookmarkid,"data-vidid":h[g].videoid});
a.find(".bookmark-title").html(h[g].title);a.find(".bookmark-item-ptr").html(h[g].metadata);a.find(".bookmark-item-date").html(h[g].modifieddate);a.find(".bookmark-item-image").attr("src","https://i.ytimg.com/vi/"+h[g].sourcevideoid+"/mqdefault.jpg");d=JSON.parse(h[g].topicinfo).topic_info;for(var k in d)b+="<li>",b+='<span class=""bookmark-Start-Time>'+secondsToTimeStr(d[k].start_time)+"</span>",b+='<span class=""bookmark-Topic-Text>'+d[k].topic+"</span>",b+="</li>";a.find(".bookmark-item-topics").html(b);
b="";$(c).append(a)}}};