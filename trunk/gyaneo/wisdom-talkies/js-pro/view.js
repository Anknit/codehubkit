function getViewData(){getBookMarksData()}
var showActiveUserVideoAction=function(a){a=$(a.target).closest(".actionItem");$(".activeActionItem").removeClass("activeActionItem");a.addClass("activeActionItem");$(".actionDataContainer").css("display","none");a=a.attr("actDiv");$("."+a).css("display","block")},renderViewData=function(){progressChange(40);$("#bookmarks-title").val(contentObj[data.videoID].string);data.bookMarkTopicsData.status&&0<Object.keys(data.bookMarkTopicsData).length&&BookmarkDataRequestCallback(JSON.stringify({status:!0,data:[data.bookMarkTopicsData.data[data.videoID]]}));
""==vidPlayerObject&&(vidPlayerObject=new CreatePlayerWidget("YT","YTPlayerDiv","100%","100%",!0,!0));progressChange(50);var a="";topicArr[data.videoID]&&(a=JSON.parse(topicArr[data.videoID]));$(".indexSwitch").css("display","none");if(!IsValueNull(a)&&0<a.topic_info.length){$(".playListContainer").removeClass("playListContainer");data.playBookmark?($("#viewbookmarks").addClass("playListContainer"),$("#viewbookmarks").css("display","block")):($("#viewtopics").addClass("playListContainer"),$("#viewtopics").css("display",
"block"));var b='<div class="arrup"></div><ul>',c;for(c in a.topic_info)b+="<li data-topic-index="+c+'><div class="topic-name">'+a.topic_info[c].topic+'</div><div class="topic-start-time">'+getTimeFormatStr(a.topic_info[c].start_time)+"</div></li>";b+='</ul><div class="arrdown"></div>';$(".topiclist-container").html(b)}else $(".recommendPage").css("display","none"),data.playBookmark?($("#viewbookmarks").addClass("playListContainer"),$("#viewbookmarks").css("display","block")):$("#recommPage_1").css({display:"block"}),
$("#recommendation-input-form .has-error").removeClass("has-error"),$("#recommPageError span").html(""),$("#recommendation-input-form").trigger("reset"),$('#recommendcategoryInput option[value="0"]').prop("selected",!0),$("#recommendContainer").css("display","block"),$("#otherCategoryInput").closest(".form-group").css("display","block");data.bookMarkTopicsArr&&0<data.bookMarkTopicsArr.length&&$(".indexSwitch.index-bookmarks").css("display","block");progressChange(70);!IsValueNull(data.playBookmark)&&
data.playBookmark||renderViewListOnDataReady();progressChange(80);playVideoOnplayerReady();progressChange(100)},renderViewListOnDataReady=function(){var a=data.list,b=a.documents;b||data.searchFlag||!data.list.ytList.list||data.filters||(youtubeListFlag||(data.list.documents=[]),a=data.list,b=a.documents);if(b&&b.length<resultRows&&!data.searchFlag&&data.list.ytList.list&&!data.filters){var c=0;0<a.start-a.numFound&&(c=a.start-a.numFound);a=Math.min(resultRows,data.list.ytList.list.documents.length-
c)-b.length;for(b=0;b<a;b++)data.list.documents.push(data.list.ytList.list.documents[c]),c++}data.list.documents?(newListObject.ready||(newListObject=new _ListWidget_.createList(data.list)),tempStr=newListObject.generateViewPageList(),$(".suggestionlist-container").html(tempStr),$(".activeVideo").removeClass("activeVideo"),c=$(".suggestionlist-container").find('[data-vidid="'+data.videoID+'"]').closest(".row").clone(!0),0==$(".lastplayedlist-container").find('[data-vidid="'+data.videoID+'"]').length&&
($(".lastplayedlist-container").prepend(c),$(".lastplayedlist-container").find('[data-vidid="'+data.videoID+'"]').closest(".row").addClass("activeVideo").wrap("<div class='row'><div class='col-md-12'></div></div>"),$("#content-title strong").html(contentObj[data.videoID].string),$("#content-views").html(contentObj[data.videoID].numofviews),$("#content-shared-by").html(contentObj[data.videoID].uploadedby),$("#content-likes-count").html(contentObj[data.videoID].numoflikes)),$(".lastplayedlist-container").find('[data-vidid="'+
data.videoID+'"]').closest(".row").addClass("activeVideo"),putListInLocalStorage(data.videoID,$(".lastplayedlist-container").find('[data-vidid="'+data.videoID+'"]').closest(".row").html())):setTimeout(function(){renderViewListOnDataReady()},500)},getListFromLocalStorage=function(){var a=window.localStorage.getItem("data_recent_list");return a=IsValueNull(a)?{}:JSON.parse(a)},putListInLocalStorage=function(a,b){var c=window.localStorage,d=c.getItem("data_recent_list"),d=IsValueNull(d)?{}:JSON.parse(d);
d[a]=b;c.setItem("data_recent_list",JSON.stringify(d))},playVideoOnplayerReady=function(){UI_unBlockInterface();playerReady&&!IsValueNull(data.videoID)?"Youtube"==getVideoSourceType(contentObj[data.videoID].url)&&data.videoID?data.playBookmark?(playContentThroughBookmark(),data.playBookmark=!1):IsValueNull(topicArr[data.videoID])||0==JSON.parse(topicArr[data.videoID]).topic_info.length?vidPlayerObject.LoadNewVideoByID(contentObj[data.videoID].videoid):CreateSegment(contentObj[data.videoID].videoid):
CreateSegment("yjJA2Qrp3Vk"):setTimeout(function(){playVideoOnplayerReady()},500)},playVideo=function(a,b){UI_blockInterface();data.bookMarkTopicsData=[];data.bookMarkTopicsArr=[];progressChange(10);$("body").animate({scrollTop:0},300);$(".contentSpecificVisible").css("display","none");var c=window.location.search.replace("?","").split("&");c.splice(0,1);"view"!=page?DisplayPage("view"):c.splice(-3,3);progressChange(30);data.videoID=$(a.target).closest("[data-vidId]").attr("data-vidId");getViewData();
renderViewData();urlParamStr=c.join("&");b?urlParamStr="category="+data.lastSearchCat:$(a.currentTarget).hasClass("bookmark-play")&&(urlParamStr="bookmark="+$(a.currentTarget).closest("[data-bookmark-id]").attr("data-bookmark-id"));urlStr="getData=view";urlParamStr="&"+urlParamStr+"&videoId="+data.videoID+"&contentsrc="+getVideoSourceType(contentObj[data.videoID].url)+"&sourcevidid="+contentObj[data.videoID].videoid;data.modify=!0;setHistoryData();a.preventDefault();toggleSmallScreenControls("",!1)};
function sSegmentInfo(){sSegmentInfo.prototype.videoID=0;sSegmentInfo.prototype.segmentList=0}function CreateSegment(a){var b=JSON.parse(topicArr[data.videoID]),c=b.topic_info.length;newSegInfo=new sSegmentInfo;newSegInfo.videoID=a;newSegInfo.segmentList=[];for(i=0;i<c;i++)a=new sVideoSegment,a.startTime=b.topic_info[i].start_time,a.endTime=b.topic_info[i].end_time,a.topicText=b.topic_info[i].topic,newSegInfo.segmentList.push(a);playSegments()}
function playSegments(){vidPlayerObject.LoadVideoWithSegmentList(newSegInfo.videoID,newSegInfo.segmentList,"HandleSegmentEnd");$(".playListContainer li").eq(0).addClass("active")}function HandleSegmentEnd(a){$(".playListContainer li.active").removeClass("active");$(".playListContainer li").eq(a).addClass("active")}
var playVideoSegment=function(a){a=a.target.hasAttribute("data-topic-index")?$(a.target).attr("data-topic-index"):$(a.target).closest("[data-topic-index]").attr("data-topic-index");vidPlayerObject.PlaySegmentIndex(a)},getTimeFormatStr=function(a){var b=Math.floor(parseInt(a)%60),c=Math.floor(parseInt(a)/60);a=Math.floor(parseInt(a)/3600);return(10>a?"0"+a:a)+":"+(10>c?"0"+c:c)+":"+(10>b?"0"+b:b)},showVideoRecommendInput=function(){$(".recommendPage").css("display","none");$("#recommPage_2").css({display:"block"});
sendCaptchaRequest("#recomCaptcha")},submitContentRecommendation=function(){var a=!0;$("#recommendation-input-form .has-error").removeClass("has-error");$("#recommendation-input-form").find("input,textarea,select").each(function(){if(IsValueNull(this.value)){if("otherCategoryInput"==this.id&&0!=$("#recommendcategoryInput").val())return!0;$(this).focus();a=!1;$(this).hasClass("captchaInput")?showRecommendationErrorMsg(RecommendErrorMsg[1],this):showRecommendationErrorMsg(RecommendErrorMsg[0],this);
return!1}});if(a){var b="",c=$("#recommendation-input-form select").val();0==c&&(b=$("#otherCategoryInput").val());var d=$("#recommendDescription").val(),e=$("#recomCaptchaText").val();UI_blockInterface();(new CommonUtils.remoteCallClass).syncGetRequest("./"+dataRequestURL+"?request=recommend&data[videoId]="+vidPlayerObject.videoID+"&data[title]="+data.content[data.videoID].string+"&data[videoSource]=yt&data[catId]="+c+"&data[newCatName]="+b+"&data[recommendDesc]="+d+"&data[captcha]="+e,RecommendationRequestCallback)}else return!1},
RecommendationRequestCallback=function(a){a=JSON.parse(a);UI_unBlockInterface();validateAppResponse(a)?(sendCaptchaRequest("#recomCaptcha"),$(".recommendPage").css("display","none"),$("#recommPage_3").css({display:"block"})):showRecommendationErrorMsg(a.error,this)},showRecommendationErrorMsg=function(a,b){$(b).closest(".form-group").addClass("has-error");$("#recommPageError span").html(a)},toggleRecomNewCatInput=function(a){"0"!=$(a.target).val()?$("#otherCategoryInput").closest(".form-group").css("display",
"none"):$("#otherCategoryInput").closest(".form-group").css("display","block")},RecommendErrorMsg="All input fields required to be filled;Please enter correct captcha;You must provide a category for the content;Please enter reason of recommendation;Source is invalid;Oops ! something went wrong. Please try again".split(";"),switchPlayingIndex=function(a){$(".contentSpecificVisible").css("display","none");$(a.currentTarget).hasClass("index-bookmarks")?playContentThroughBookmark():$(a.currentTarget).hasClass("index-topics")&&
renderViewData()};