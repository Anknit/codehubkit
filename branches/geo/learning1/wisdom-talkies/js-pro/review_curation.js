var vidPlayerObject=new CreatePlayerWidget("YT","YTPlayerDiv","100%","100%",!0,!0),content_json="",checked_content="",checked_index="",playerReady=!1,review_videoid="",newSegInfo="",temp_length=0,length=0,temp_id_row=0,duration=0,moderator_change_data="",modal_error="",moderator_change_data_warning="",is_mod_change_meta=0,tempcuration_data=[],rejection_topic={},accept_topic=[],accept_meta=[],rejection_meta={};function OnYTPlayerReady(){playerReady=!0}curation_handle=new curate_libs;$(window).load(function(){progressChange(100)});
$(function(){progressChange(75);UI_createTabs("#review_tabs",tab_switch_handle);$("#moderator_final_approve").on("click",final_approval);$(".curationTablebody").on("click",".editRow .curationCell:nth-child(2) span",function(){$(this).html(vidPlayerObject.GetCurrentPTS().toFixed(1));save=0});$(".curationTablebody").on("click",".editRow .curationCell:nth-child(3) span",function(){$(this).html(vidPlayerObject.GetCurrentPTS().toFixed(1));save=0});for(var a in categoryObject)"1"==categoryObject[a].status&&
(option_cat="<option value="+a+" data-label='"+categoryObject[a].catName+"'>"+categoryObject[a].catName+"</option>",$("#moderator_category").append(option_cat));$("#moderator_category").append("<option value='other_category' data-label='other'>other</option>");for(a in languageObject)"1"==languageObject[a].status&&(option_cat="<option value="+a+" data-label='"+languageObject[a].language+"'>"+languageObject[a].language+"</option>",$("#moderator_language").append(option_cat));$("#moderator_language").append("<option value='other_language' data-label='other'>other</option>");
$(".curationTablebody").on("click",".editRow .curationCell:nth-child(5)",function(a){$(".editRow").removeClass("editRow");$(".curationTablebody").find('[contenteditable="true"]').attr("contenteditable",!1);a.stopImmediatePropagation()});$(".curationTablebody").on("click",".editRow .curationCell:nth-child(4)",function(a){moderator_change_data=curation_handle.save_topics();$($("#curateScrollContainer .curationTablebody .curationRow")[temp_id_row]).addClass("playActive");vidPlayerObject.Play();$(".editRow").removeClass("editRow");
$(".curationTablebody").find('[contenteditable="true"]').attr("contenteditable",!1);a.stopImmediatePropagation()});$(".curationTablebody").on("click",".curationCell:nth-child(5)",function(){var a=$(this).prev().prev().prev().text(),c=$(this).prev().prev().text();newSegInfo=curation_handle.CreateSegment(0)[0];length=newSegInfo.segmentList.length;content_json=curation_handle.CreateSegment(0)[1];temp_id_row=Number($(this).parent().attr("id_row"))-1;$("#curateScrollContainer .curationTablebody .curationRow").removeClass("playActive");
$($("#curateScrollContainer .curationTablebody .curationRow")[temp_id_row]).addClass("playActive");vidPlayerObject.LoadNewVideoSegment(newSegInfo.videoID,"handle_segmentwise");vidPlayerObject.PlaySegmentwise(a,c)});if(2==typeofuser)$(".curationTablebody").on("click",".curationCell:nth-child(4)",function(){$("#curateScrollContainer .curationTablebody .curationRow").removeClass("playActive");vidPlayerObject.Pause();$(".editRow").removeClass("editRow");var a=$(this).closest(".curationRow");a.addClass("editRow");
$(".curationTablebody").find('[contenteditable="true"]').attr("contenteditable",!1);a.find("span:lt(4)").attr("contenteditable",!0)})});function radio_changed(a){moderator_change_data=content_json="";is_mod_change_meta=0}
function show_meta_modal(a){$(".mod_input").on("change",function(){is_mod_change_meta=1});$("#moderator_title").val(tempcuration_data[checked_index].title);$("#moderator_category").find("option[data-label='"+tempcuration_data[checked_index].category+"']").prop("selected",!0);$("#moderator_language").find("option[data-label='"+tempcuration_data[checked_index].language+"']").prop("selected",!0);""==tempcuration_data[checked_index].other_category?$("#moderator_other_category").closest(".form-group").addClass("reviewer_hide_div"):
($("#moderator_other_category").closest(".form-group").removeClass("reviewer_hide_div"),$("#moderator_other_category").val(tempcuration_data[checked_index].other_category));$("#moderator_description").val(tempcuration_data[checked_index].description);$("#moderator_keywords").val(tempcuration_data[checked_index].keywords);""==tempcuration_data[checked_index].other_language?$("#moderator_other_language").closest(".form-group").addClass("reviewer_hide_div"):($("#moderator_other_language").closest(".form-group").removeClass("reviewer_hide_div"),
$("#moderator_other_language").val(tempcuration_data[checked_index].other_language));1==tempcuration_data[checked_index].agegroup?$("#moderator_age").find("option[value='1']").attr("selected",!0):2==tempcuration_data[checked_index].agegroup?$("#moderator_age").find("option[value='2']").attr("selected",!0):3==tempcuration_data[checked_index].agegroup?$("#moderator_age").find("option[value='3']").attr("selected",!0):4==tempcuration_data[checked_index].agegroup&&$("#moderator_age").find("option[value='4']").attr("selected",
!0);$("#moderator_items").val(tempcuration_data[checked_index].itemused)}
function final_issue(a){if(0==$(".decision_input").length)return a.preventDefault(),!1;for(i=0;i<$(".decision_input").length;i++)if(""==$($(".decision_input")[i]).val())return a.preventDefault(),!1;var b={};for(i=0;i<$(".decision_input").length;i++)b[$($(".decision_label")[i]).text()]=$($(".decision_input")[i]).val();$("#review_issue_final").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Waiting');curation_handle.id=tempcuration_data[checked_index].id;curation_handle.issue=
JSON.stringify(b);curation_handle.ajax_url="./"+dataRequestURL;2==typeofuser?curation_handle.save_curation(a,5):curation_handle.save_curation(a,2)}
function final_approval(){2!=typeofuser||""==moderator_change_data&&1!=is_mod_change_meta?($("#review_approve_final").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Waiting'),curation_handle.id=tempcuration_data[checked_index].id,curation_handle.ajax_url="./"+dataRequestURL,curation_handle.save_curation(event,4)):($("#review_approve_final").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Waiting'),""==moderator_change_data&&
(moderator_change_data=JSON.stringify(content_json)),curation_handle.topic_info=moderator_change_data,curation_handle.language=$("#moderator_language").val(),curation_handle.other_language=$("#moderator_other_language").val(),curation_handle.category=$("#moderator_category").val(),curation_handle.other_category=$("#moderator_other_category").val(),curation_handle.title=$("#moderator_title").val(),curation_handle.description=$("#moderator_description").val(),curation_handle.age=$("#moderator_age").val(),
curation_handle.keywords=$("#moderator_keywords").val(),curation_handle.items=$("#moderator_items").val(),curation_handle.id=tempcuration_data[checked_index].id,curation_handle.ajax_url="./"+dataRequestURL,curation_handle.save_curation(event,3))}
function on_ajax_response(a,b){"review_issue_final"==a.target.id?1==b.status?(RefreshGrid("ActiveJobs"),$("#review_issue_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Issue')):$("#review_issue_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Issue'):"review_approve_final"==a.target.id&&(3==typeofuser?1==b.status?(RefreshGrid("ActiveJobs"),$("#review_approve_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Approve')):
0==b.status&&$("#review_approve_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Approve'):2==typeofuser&&(1==b.status?(RefreshGrid("ActiveJobs"),$("#review_approve_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Approve')):$("#review_approve_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Approve')))}
function review_play(a){if(0==playerReady)return!1;$(".compulsory_mod_check input").removeAttr("checked");rejection_topic=[];moderator_change_data="";temp_id_row=length=temp_length=0;$(".accepted").removeClass("accepted");$(".rejected").removeClass("rejected");checked_index=a.target.id;review_videoid=tempcuration_data[checked_index].videoid;content_json=JSON.parse(tempcuration_data[checked_index].topicinfo);checked_content=tempcuration_data[checked_index];temp_duration=content_json.topic_info.length;
0<temp_duration&&(duration=content_json.topic_info[temp_duration-1].end_time);$("#curate_title").html(checked_content.title);$("#curate_category").html(checked_content.category);$("#curate_description").html(checked_content.description);$("#curate_language").html(checked_content.language);$("#curate_age").html(checked_content.agegroup);$("#curateScrollContainer .curationTablebody").children().remove();length||append_topic_info();for(i=0;i<content_json.topic_info.length;i++)curation_handle.add_new_topic(content_json.topic_info[i].topic,
content_json.topic_info[i].start_time,content_json.topic_info[i].end_time,append_topic_info);newSegInfo=curation_handle.CreateSegment(0,review_videoid)[0];length=newSegInfo.segmentList.length;content_json=curation_handle.CreateSegment(0,review_videoid)[1];vidPlayerObject.LoadNewVideoSegment(newSegInfo.videoID,"HandleSegmentEnd");$($("#curateScrollContainer .curationTablebody .curationRow")[temp_id_row]).addClass("playActive");0<length?vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[temp_length].startTime,
newSegInfo.segmentList[temp_length].endTime):vidPlayerObject.PlaySegmentwise(0,1);show_meta_modal(a);initialize_reviewer_array();UI_showTab("review_topics_tab")}function initialize_reviewer_array(){rejection_topic={};rejection_meta={};for(i=0;i<$(".curationRow").length;i++)rejection_topic[$(".curationRow").attr("id_row")]="";var a=$(".form-horizontal .form-group").not(".reviewer_hide_div").find(".control-label").not(".decision_label");for(i=0;i<a.length;i++)rejection_meta[a.eq(i).text()]=""}
function reviewer_decision(a){$("#final_review_decision").html("");var b=a="";for(key in rejection_topic)"reject"==rejection_topic[key]&&(a='<div class="form-group"><label class="control-label col-md-3 decision_label">Topic:'+key+'</label><div class="col-md-7"><input id="" type="text" class="form-control decision_input" name="" placeholder="Please provide the reason for your rejection"></div></div>',$("#final_review_decision").append(a),a="<button id='review_approve_final' class='btn btn-default' disabled type='button'>Approve</button>",
b="<button id='review_issue_final' class='btn btn-default' type='button'>Reject</button>");for(key in rejection_meta)"reject"==rejection_meta[key]&&(a='<div class="form-group"><label class="control-label col-md-3 decision_label">Meta data:'+key+'</label><div class="col-md-7"><input id="" type="text" class="form-control decision_input" name="" placeholder="Please provide the reason for your rejection"></div></div>',$("#final_review_decision").append(a),a="<button id='review_approve_final' class='btn btn-default' disabled type='button'>Approve</button>",
b="<button id='review_issue_final' class='btn btn-default' type='button'>Reject</button>");""==a&&""==b&&(a="<button id='review_approve_final' class='btn btn-default' type='button'>Approve</button>",b="<button id='review_issue_final' class='btn btn-default' disabled  type='button'>Reject</button>");$("#final_review_decision").append(a);$("#final_review_decision").append(b);UI_bindFunction("#review_approve_final",final_approval,"click");UI_bindFunction("#review_issue_final",final_issue,"click")}
function tab_switch_handle(a){if("Decision"==a.target.text){for(key in rejection_topic)if(""==rejection_topic[key]){a.preventDefault();return}for(key in rejection_meta)if(""==rejection_meta[key]){a.preventDefault();return}reviewer_decision(a)}}function reviewer_reject_topic(a){$(a.currentTarget).closest(".curationRow").addClass("rejected").removeClass("accepted");rejection_topic[$(a.target).closest(".curationRow").attr("id_row")]="reject";a.stopImmediatePropagation()}
function reviewer_accept_topic(a){$(a.currentTarget).closest(".curationRow").removeClass("rejected").addClass("accepted");rejection_topic[$(a.target).closest(".curationRow").attr("id_row")]="accept";a.stopImmediatePropagation()}function reviewer_accept_metadata(a){$(a.currentTarget).closest(".form-group").find("label").removeClass("rejected").addClass("accepted");rejection_meta[$($(a.target).closest(".form-group").children()[0]).text()]="accept";a.stopImmediatePropagation()}
function reviewer_reject_metadata(a){$(a.currentTarget).closest(".form-group").find("label").addClass("rejected").removeClass("accepted");rejection_meta[$($(a.target).closest(".form-group").children()[0]).text()]="reject";a.stopImmediatePropagation()}
function append_topic_info(){$(".curationTablebody .curationRow:last-child").append($("<div class='curationCell'><div class='btn btn-success decision-btn'><div class='accept_topic badge'><span class='glyphicon glyphicon-ok'></span></div></div></div><div class='curationCell'><div class='btn btn-danger decision-btn'><div class='reject_topic badge'><span class='glyphicon glyphicon-remove'></span></div></div></div>"));$(".curationTablebody .curationRow").removeClass("editRow");$(".curationTablebody").find('[contenteditable="true"]').attr("contenteditable",
!1);UI_bindFunction(".reject_topic",reviewer_reject_topic,"click");UI_bindFunction(".accept_topic",reviewer_accept_topic,"click");UI_bindFunction(".accept_metadata",reviewer_accept_metadata,"click");UI_bindFunction(".reject_metadata",reviewer_reject_metadata,"click")}function handle_segmentwise(){vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[0].endTime,duration);vidPlayerObject.Pause();$("#curateScrollContainer .curationTablebody .curationRow").removeClass("playActive")}
function HandleSegmentEnd(){if(!length)return vidPlayerObject.Pause(),!1;if(temp_length+2>length)return vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[temp_length].endTime,duration),vidPlayerObject.Pause(),!1;temp_length++;temp_id_row++;$("#curateScrollContainer .curationTablebody .curationRow").removeClass("playActive");$($("#curateScrollContainer .curationTablebody .curationRow")[temp_id_row]).addClass("playActive");vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[temp_length].startTime,
newSegInfo.segmentList[temp_length].endTime)}var curateContentReview=function(a){location.href="./?page=list&request=curate&videoId="+tempcuration_data[a.target.id].videoid+"&category="+tempcuration_data[a.target.id].category_id};