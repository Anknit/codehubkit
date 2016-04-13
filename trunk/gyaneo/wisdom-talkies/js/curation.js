var content_json		=	"";
var duration			=	0;
var length				=	0;
var temp_length			=	0;
var id_row				=	1;
var currentCurationVidId=	"";
var temp_id_row			=	0;
var save				=	0;
var is_row_edited		=	0;
var is_row_null			=	0;
var is_row_nan			=	0;
var source_of_the_video	=	"";
var is_video_published	=	false;
var vid_flag			=	false;
var video_load_flag		=	false;
var is_published_click	=	false;
var item_value			=	"";

curation_handle	=	new curate_libs();
$(function(){
    UI_createModal('#save-to-curation','','','',resetMyCurationListMsg);
    var catData	=	data.categories;
    UI_createJsonUL('#add-to-curation-category',{'html':catData});
    UI_createDropdown('#add-to-curation-category','',false);
    var subMenuObj = data.subCategories;
    for(var key in subMenuObj){
        var dropDownArray   =   $('#add-to-curation-category');
        dropDownArray.each(function(){
            var menuItem = $(this).find('ul.dropdown-menu li[data-catid="'+key+'"]');
            menuItem.find('a').addClass("dropdown-toggle").attr("data-toggle","dropdown");
            menuItem.addClass('dropdown-submenu').append('<div class="subMenuExpand visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-down"></div><div class="subMenuCollapse hiddenElem visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-up"></span></div><ul class="dropdown-menu"></ul>');
            for(var i=0;i<subMenuObj[key].length;i++){
                menuItem.find('ul.dropdown-menu').append('<li data-catId="'+subMenuObj[key][i]['attr']['data-catid']+'" data-vidId="'+subMenuObj[key][i]['attr']['data-vidId']+'"><a href="'+subMenuObj[key][i]['link']+'">'+subMenuObj[key][i]['label']+'</a></li>');
            }
        });
    }
    $('#add-to-curation-category').on('click','li[data-catId] a',setCurationVideoCategory);
    UI_bindFunction('#addToMyCuration',addToMyCurationList,'click');
});

function build_breadcrumb_of_category(category_id)
{
	$("#breadcrumbs_of_category").html("");
	var temp_category	=	category_id;
	if(typeof(mainAppVars.catNameObject[$("#curationcategorydropdown").attr("category-value")])	==	"undefined"	&&	IsValueNull(category_id))
	{
  		$("#breadcrumbs_of_category").append("<li></li>");
  		$("#breadcrumbs_of_category li:last-child").text($("#curate_other_category").val());
	}
	else
	{
	    while(true)
	    {
	    	$("#breadcrumbs_of_category").prepend("<li></li>");
	    	$("#breadcrumbs_of_category").find("li:first-child").text(mainAppVars.catNameObject[temp_category]);
	    	temp_category	=	parentCatObj[temp_category];
	    	if(typeof(temp_category)	==	"undefined")
	    	{
	    		$("#breadcrumbs_of_category").append("<li></li>");
	      		$("#breadcrumbs_of_category li:last-child").text($("#curate_other_category").val());
	    		break;
	    	}
	    }
	}
}

function setCurationVideoCategory(event){
	var currentCat  =   $(event.currentTarget).closest('[data-catid]').attr('data-catid');
	build_breadcrumb_of_category(currentCat);
    var dropDownElem    =    $(event.currentTarget).closest('.category-drop-down-curation');
    dropDownElem.attr('category-value',currentCat);
    dropDownElem.children('button')[0].innerHTML  =   mainAppVars.catNameObject[currentCat]+'<span class="caret"></span>';
    event.preventDefault();
}

function getYoutubeListData(queryStr){
	UI_blockInterface();
	s_id = null;
	var xhrObj = new CommonUtils.remoteCallClass();
	var dataObj	=	parseQueryStringToObject(queryStr);
	dataObj	['server']	=	'youtube';
	dataObj	['rows']	=	20;
	xhrObj.requestData	=	{'request':'search_data','data':dataObj};
	xhrObj.asyncPostRequest("./"+dataRequestURL,function(response){
		progressChange(70);
		response = JSON.parse(response);
        var validateResponseCheck   =   validateAppResponse(response);
        if(validateResponseCheck){
            youtubeListFlag = true;
            data['list']	=	response.data;
            renderListData();
            progressChange(100);
        }
        else{
            data['list']	=	[];
            renderListData();
            progressChange(100);
        }
	});
}
var curateVideo = function(event){
	$("#curateScrollContainer .curationTablebody").html("");
	sourcevideoID = $(event.target).closest('.list-item-row[data-sourcevidId]').attr('data-sourcevidId');
	$('#list.section').css('display','none');
	$('#curationInformation, #curationTopics').css('display','block');
	LoadVideoforCuration(sourcevideoID,source_of_the_video);
};

function LoadVideoforCuration(id,source)
{
	/*$("#save_curation").html("Save");
	$("#publish_curation").html("Publish");*/
	$('#curation-topic-table').find('tr.inputRow:not(.dummyRow),tr.readOnlyRow:not(.dummyRow)').remove();
	$('#curate_title').val('');
	$('#curate_description').val('');
    $('#curate_original_description').val('');
	$('#curate_keywords').val('');
	$('#curate_tags').val('');
	$('#curate_items').val('');
	$("#items_list ul").html("");
	$("#tags_list ul").html("");
	$("#breadcrumbs_of_category").html("");
    $('.curate-links,.curate-links-other-input').each(function(){$(this).val('');});
	vid_flag	=	false	;
    video_load_flag =	false;
	is_video_published	=	false;
	is_published_click	=	false;
	if(typeof(s_id	!=	"undefined")	&&	s_id)
	{
		var ajax_query	=	'?request=yt_metadata_for_curation&data[id]='+id+'&data[source]=yt&data[s_id]='+s_id;
	}
	else
	{
		var ajax_query	=	'?request=yt_metadata_for_curation&data[id]='+id+'&data[source]=yt';
	}
	$.ajax({
		url:'./'+dataRequestURL+ajax_query,
		type:'GET',
		success:function(response){
			var response		=	JSON.parse(response);
			if(response['status']	==	true	&&	response['data']['metadata']['kind']	==	'youtube#videoListResponse')
			{
				response			=	response['data'];	
				duration			=	curation_handle.ytduration_to_sec(response['metadata']['items'][0]['contentDetails']['duration']);
				source_of_the_video	=	response["metadata"]["source"];
				response 			=	response['metadata']['items'][0]['snippet'];
				$('#curate_title').val(response['title']);
				$('#curate_original_description').val(response['description']);
				$('#curate_age').val('4');
				$("#save_curation").attr("disabled",false);
				$("#publish_curation").attr("disabled",false);
				if(response['tags']	!=null	&&	response['tags']	!=	"")
				{
					$('#curate_keywords').val(response['tags'].join(','));
				}
				if(curationVideoCategory)
				{
                    $("#curationcategorydropdown").attr('category-value',curationVideoCategory).children('button').text(mainAppVars.catNameObject[curationVideoCategory]).append('<span class="caret"></span>');
				}
                else{
                    $("#curationcategorydropdown").removeAttr('category-value').children('button').html('Choose category <span class="caret"></span>');
                }
			}
			else if(response['status']	==	true	&&	response['data']['metadata']['kind']	==	'wt_list_response')
			{
				response			=	response['data'];
				//duration			=	curation_handle.ytduration_to_sec(response['metadata']['items'][0]['contentDetails']['duration']);
				source_of_the_video	=	response["metadata"]["source"];
				$('#curate_title').val(response['metadata'][0]['title']);
				$('#curate_description').val(response['metadata'][0]['description']);
				$('#curate_original_description').val(response['metadata'][0]['originaldescription']);
				$('#curate_keywords').val(response.metadata[0].originalkeywords);
				
				var targetElem	=	"add_item_in_tags";
				addition_of_list_and_tags_items(targetElem,response.metadata[0].keywords);
				/*$('#curate_tags').val(response.metadata[0].keywords);*/
				if(!IsValueNull(mainAppVars.catNameObject[response.metadata[0].category])){
					$("#curationcategorydropdown").attr('category-value',response.metadata[0].category).children('button').text(mainAppVars.catNameObject[response.metadata[0].category]).append('<span class="caret"></span>');;
					if(IsValueNull(response.metadata[0].category_breadcrumb)){
	                    build_breadcrumb_of_category(response.metadata[0].category)
	                }
	                else{
	                    var temp_bread	=	response.metadata[0].category_breadcrumb.split("/");
	                    for(i=0;i<temp_bread.length;i++)
	                    {
	                        if(temp_bread[i])
	                        {
	                            $("#breadcrumbs_of_category").append("<li>"+temp_bread[i]+"</li>");
	                        }
	                    }
	                }
				}
				/*
				build_breadcrumb_of_category(response.metadata[0].category);*/
				//$('#curate_language').val(response.metadata[0].language);
				if(data.languages[response.metadata[0].language].status	==	'2')
				{
					angular.element('#curationInformation').scope().curation_language	=	"other_language";
					angular.element('#curationInformation').scope().curation_other_language	=	data.languages[response.metadata[0].language].language;
				}
				else
				{
					angular.element('#curationInformation').scope().curation_language	=	response.metadata[0].language;
				}
				
				$('#curate_age').val(response.metadata[0].agegroup);
				/*$('#curate_items').val(response.metadata[0].itemused);*/
				
				var targetElem	=	"add_item_in_list";
				addition_of_list_and_tags_items(targetElem,response.metadata[0].itemused);
                if(!IsValueNull(response.metadata[0].curationlinks)){
                    var curationLinks   =   JSON.parse(response.metadata[0].curationlinks);
                    var linksSelectionArr   =   $('.content-link-select-type');
                    for(var i=0;i<curationLinks.length;i++){
                        var linkOption  =   linksSelectionArr.eq(i)
                        var key = Object.keys(curationLinks[i])[0];
                        var linkUrl =   linkOption.parent().next('div').find('.curate-links').val(curationLinks[i][key]);
                        if(linkOption.find("option[value='"+key+"']").length > 0){
                            linkOption.val(key);
                        }
                        else{
                            linkOption.val("other");
                            linkOption.parent().next('div').find('.curate-links-other-input').val(key);
                        }
                    }
                    linksSelectionArr.each(function(){
                        $(this).change();
                    });                
                }
				if(!IsValueNull(response.metadata[0].parentCat)	&&	response.metadata[0].parentCat	!=	'0'){
					$("#curationcategorydropdown").attr('category-value',response.metadata[0].parentCat).children('button').text(mainAppVars.catNameObject[response.metadata[0].parentCat]).append('<span class="caret"></span>');
					$("#curate_other_category").val(response.metadata[0].catName);
				}
				else
				{
					if(!IsValueNull(mainAppVars.catNameObject[response.metadata[0].category])){
						$("#curationcategorydropdown").attr('category-value',response.metadata[0].category).children('button').text(mainAppVars.catNameObject[response.metadata[0].category]).append('<span class="caret"></span>');	
					}
				}
				if(!IsValueNull(s_id))
				{
					$("#save_curation").attr("disabled",false);
					$("#publish_curation").attr("disabled",false);
				}
				else if(response.metadata[0].curationstatus	==	1	||	response.metadata[0].curationstatus	==	3)
				{
					is_video_published	=	true;
					$("#save_curation").attr("disabled",true);
					$("#publish_curation").attr("disabled",true);
				}
				else
				{
					$("#save_curation").attr("disabled",false);
					$("#publish_curation").attr("disabled",false);
				}
					
				content_json	=	JSON.parse(response.metadata[0].topicinfo);
				render_saved_curation();
			}
            $('.add-remove-items').on('click','.remove_list_item',removal_of_list_items);
		}
	});
//	UI_bindFunction(".remove_list_item",removal_of_list_items,'click');
    $("#add_item_in_list").on('click',function(event){
        addition_of_list_and_tags_items("add_item_in_list");
    });
    $("#add_item_in_tags").on('click',function(event){
        addition_of_list_and_tags_items("add_item_in_tags");
    });
/*
	UI_bindFunction("#add_item_in_list",addition_of_list_and_tags_items,'click');
	UI_bindFunction("#add_item_in_tags",addition_of_list_and_tags_items,'click');
*/
	load_video_after_api(id);
}

function removal_of_list_items(event){
	var list_selector	=	null;
	var input_selector	=	null;
    var item_value  =   '';
	if($(event.target).closest(".add-remove-items").attr('id')	==	"items_list")
	{
		list_selector	=	$("#items_list");
		input_selector	=	$("#curate_items");
	}
	else if($(event.target).closest(".add-remove-items").attr('id')	==	"tags_list")
	{
		list_selector	=	$("#tags_list");
		input_selector	=	$("#curate_tags");
	}
	$(event.target).closest("li").remove();
    list_selector   =   list_selector.find('li');
	for(i=0;i<list_selector.length;i++)
	{
		
        item_value  +=	list_selector.eq(i).attr('data-value')+",";
	}
	input_selector.attr("data-value",item_value);
};

function addition_of_list_and_tags_items(targetElem,items_string){
	var input_selector	=	null;
	var list_selector	=	null;
	if(targetElem	==	"add_item_in_list")
	{
		list_selector	=	$("#items_list ul");
		input_selector	=	$("#curate_items");
	}
	else if(targetElem	==	"add_item_in_tags")
	{
		list_selector	=	$("#tags_list ul");
		input_selector	=	$("#curate_tags");
	}
	if(!IsValueNull(items_string))
	{
		item_value		=	items_string;
		items_array		=	item_value.split(",");
		items_length	=	items_array.length;
		
		for(i=0;i<items_length;i++)
		{
			if((items_array[i]).trim() != ""){
				list_selector.append('<li data-value=""><div><span class="tag-value"></span><span class="close remove_list_item">x</close></div></li>');
				list_selector.find('li:last-child').attr("data-value",items_array[i]);
				list_selector.find('li:last-child').find('.tag-value').text(items_array[i]);
			}
		}
		input_selector.attr("data-value",item_value);
//		UI_bindFunction(".remove_list_item",removal_of_list_items,'click');
		
	}
	else
	{
		item_value	=	"";
		if(typeof(input_selector.val())	==	"undefined"	||	IsValueNull(input_selector.val()))
		{
			return false;
		}
		list_selector.append('<li data-value=""><div><span class="tag-value"></span><span class="close remove_list_item">x</close></div></li>');
		list_selector.find('li:last-child').attr("data-value",input_selector.val());
		list_selector.find('li:last-child').find('.tag-value').text(input_selector.val());
		for(i=0;i<list_selector.find("li").length;i++)
		{
			item_value	+=	list_selector.find("li").eq(i).attr("data-value")+",";
		}
		input_selector.attr("data-value",item_value);
		input_selector.val('');
//		UI_bindFunction(".remove_list_item",removal_of_list_items,'click');
	}
};

function  load_video_after_api(id)
{
	if(mainAppVars.playerReady)
	{
        if(vid_flag	==	false	&&	video_load_flag	==	false)
		{
			vidPlayerObject.LoadNewVideoByID(id, 0);
			vidPlayerObject.Play();
			currentCurationVidId 	=	id;
			video_load_flag			=	true;
			setTimeout(function()
			{
				load_video_after_api(id);
			},1500);
		}
		else if(vidPlayerObject.playerHandle.getDuration())
		{
			vid_flag	=	true;
			duration	=	vidPlayerObject.playerHandle.getDuration().toFixed(1);
		}
		
		else
		{
			setTimeout(function()
			{
				load_video_after_api(id);
			},1500);
		}
	}
	else
	{
		setTimeout(function()
		{
			load_video_after_api(id);
		},1500);
	}
}

function handle_segmentwise()
{
	vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[0].endTime,duration);
	vidPlayerObject.Pause();
	$(".playActive").removeClass('playActive');
}
	  
function unload()
{
	if(save	==	0)
	{
		return "Video has not been saved...";
	}
}
	  
function playSegments(num)
{
    if($("#curation-topic-table tr.inputRow:not(.dummyRow)").length > 0){
        UI_alert('Please save your topics first');
        return false;
    }
	temp_length			=	0;
	temp_id_row			=	0;
	if(num	==	0)
	{
		newSegInfo		=	curation_handle.CreateSegment(0,'',true)[0];
		length			=	newSegInfo.segmentList.length;
		content_json	=	curation_handle.CreateSegment(1,'',true)[1];
	}
	else
	{
		newSegInfo		=	curation_handle.CreateSegment(1,'',true)[0];
		length			=	newSegInfo.segmentList.length;
		content_json	=	curation_handle.CreateSegment(1,'',true)[1];
	}

	vidPlayerObject.LoadNewVideoSegment(newSegInfo.videoID, 'HandleSegmentEnd');
	
	$(".playActive").removeClass('playActive');
    $("#curation-topic-table tr.readOnlyRow:not(.dummyRow)").eq(temp_id_row).addClass('playActive');
	
	if(newSegInfo.segmentList[temp_length].startTime	==	""	||	newSegInfo.segmentList[temp_length].endTime	==	"")
	{
		newSegInfo.segmentList[temp_length].startTime	=	0;
		newSegInfo.segmentList[temp_length].endTime		=	duration;
	}
	vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[temp_length].startTime,newSegInfo.segmentList[temp_length].endTime);
}

function HandleSegmentEnd()
{
	if(temp_length+1==length)
	{
		$(".playActive").removeClass('playActive');
		vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[temp_length].endTime,duration);
		vidPlayerObject.Pause();
	}
	else
	{
		temp_length++;
		temp_id_row++;
		$(".playActive").removeClass('playActive');
		$("#curation-topic-table tr.readOnlyRow:not(.dummyRow)").eq(temp_id_row).addClass('playActive');
		vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[temp_length].startTime,newSegInfo.segmentList[temp_length].endTime);
	}
}

function publish(event)
{
    if($("#curation-topic-table tr.inputRow:not(.dummyRow)").length > 0){
        UI_alert('Please save your topics first');
        return false;
    }

	if(is_video_published	||	!mainAppVars.playerReady)
	{
		return false;
	}

    var categoryVal =   $('#curationcategorydropdown').attr('category-value')
    if(IsValueNull(categoryVal)){
        UI_alert('Please select a category');
        return false;
    }
    if(IsValueNull($('#curate_description').val())){
        UI_alert('Please provide a summary for this content');
        return false;
    }
	
	vidPlayerObject.Pause();
    var linksJsonObject =   [];
    var linksSelectionArr   =   $('.content-link-select-type');
    for(var k=0;k<linksSelectionArr.length;k++){
        linksJsonObject[k] = {};
        var linkOption  =   linksSelectionArr.eq(k).val();
        var linkUrl =   linksSelectionArr.eq(k).parent().next('div').find('.curate-links').val();
        if(linkOption != "other"){
            linksJsonObject[k][linksSelectionArr.eq(k).val()]  =   linkUrl;
        }
        else{
            var linkSource =   linksSelectionArr.eq(k).parent().next('div').find('.curate-links-other-input').val();
            linksJsonObject[k][linkSource]  =   linkUrl;
        }
    }
    var topicDataRows    =   $('#curation-topic-table tbody tr.readOnlyRow:not(.dummyRow)');
    curationTopicsArr =   [];
    var is_topic_null_flag	=	0;
    if(topicDataRows.length == 0){
    	is_topic_null_flag	=	1;
        curationTopicsArr.push({'topic':$('#curate_title').val(),'start_time':0,'end_time':duration});
    }
    else{
        var topicText,startTime,endTime;
        for(var i=0;i<topicDataRows.length;i++){
            topicText   =   topicDataRows.eq(i).find('.topic-text').attr('data-topic-val');
            startTime   =   topicDataRows.eq(i).find('.topic-start').attr('data-time-val');
            endTime     =   topicDataRows.eq(i).find('.topic-end').attr('data-time-val');
            curationTopicsArr.push({'topic':topicText,'start_time':startTime,'end_time':endTime});
        }
    }
    content_json    =   JSON.stringify({'topic_info':curationTopicsArr});
    	
	curation_handle.title		=	$("#curate_title").val();
	curation_handle.description	=	$("#curate_description").val();
    
	other_category_value			=	categoryVal;

	curation_handle.other_category	=	$("#curate_other_category").val();
		  
	curation_handle.category		=	other_category_value;
	other_language_value			=	angular.element('#curationInformation').scope().curation_language;
	if(other_language_value			==	"other_language")
	{
		curation_handle.other_language	=	$("#curate_other_language").val();
	}
	else
	{
		curation_handle.other_language	=	"";
	}
		  
	curation_handle.language			=	angular.element('#curationInformation').scope().curation_language;
	curation_handle.age					=	$("#curate_age").val();
	curation_handle.keywords			=	$("#curate_keywords").val();
	curation_handle.tags				=	$("#curate_tags").attr("data-value");
	curation_handle.items				=	$("#curate_items").attr("data-value");//$("#curate_items").val();
    curation_handle.links           	=   JSON.stringify(linksJsonObject);
	
	curation_handle.ajax_url			=	"./"+dataRequestURL;
	curation_handle.source				=	source_of_the_video;
	curation_handle.is_topic_null		=	is_topic_null_flag;
	curation_handle.topic_info			=	content_json;
	curation_handle.category_breadcrumb	=	"";
	
	for(i=0;i<$("#breadcrumbs_of_category li").length;i++)
	{
		curation_handle.category_breadcrumb	+=	$("#breadcrumbs_of_category li:nth-child("+(i+1)+")").html();
		if(i	!=	$("#breadcrumbs_of_category li").length-1)
		{
			curation_handle.category_breadcrumb	+=	"/";
		}
	}
		
    UI_blockInterface();
	if(!curation_handle.save_curation(event,0))
	{
		UI_unBlockInterface();
		UI_alert("Some metadata is empty");
		return false;
	}
	else
	{
		return true;
	}
}

function final_publish(event)
{
    if($("#curation-topic-table tr.inputRow:not(.dummyRow)").length > 0){
        UI_alert('Please save your topics first');
        return false;
    }
	if(is_video_published)
	{
		return false;
	}
	if(save	==	0)
	{
		is_published_click	=	true;
        angular.element("#save_curation").scope().saveOnPublish();
	}
	else
	{
		curation_handle.ajax_url	=	"./"+dataRequestURL;
		UI_blockInterface();
		curation_handle.save_curation(event,1);
	}
}

function on_ajax_response(event,data)
{
    UI_unBlockInterface();
	if(event.target.id	==	"save_curation")
	{
		if(data['status']	==	false)
		{
			UI_alert(data['error']);
		}
		else if(data['status']	==	true)
		{
            UI_alert('Video curation saved successfully');
			save	=	1;
			if(is_published_click)
			{
				$("#publish_curation").trigger('click');
			}
		}
	}
	else if(event.target.id	==	"publish_curation")
	{
		if(data['status']	==	false)
		{
			UI_alert(data['error']);
		}
		else if(data['status']	==	true)
		{
            UI_alert('Video submitted for final review');
			is_video_published	=	true;
			$("#save_curation").attr("disabled",true);
			$("#publish_curation").attr("disabled",true);
		}		
	}
	else if(event.currentTarget.id	==	"addToMyCuration")
	{
        $('#curationListAddMsgBox').removeClass('hide alert-danger alert-success').html('');
		if(data['status']	==	false)
		{
			$('#curationListAddMsgBox').text(data['error']).addClass('alert-danger');
		}
		else if(data['status']	==	true)
		{
            $('#curationListAddMsgBox').html('Video successfully added in your curation list').addClass('alert-success');
		}		
	}
}
function add_new_topic()
{
	curation_handle.add_new_topic();
}

var curateVideoFromVideoId	=	function(videoID){
	$("#curateScrollContainer .curationTablebody").html("");
	sourcevideoID = videoID;
	$('#list.section').css('display','none');
	$('#curationInformation, #curationTopics').css('display','block');
	LoadVideoforCuration(sourcevideoID,source_of_the_video);
};
var render_saved_curation    =   function()
{
    var topicClassObject    =   new topicClass.handler();
    topicClassObject.renderTopics('curation-topic-table',content_json.topic_info);
};
var resetMyCurationListMsg    =   function(event){
    $('#curationListAddMsgBox').addClass('hide').html('');
};
var addToMyCurationList =   function(event){
    var selectedCategory    =   $('#add-to-curation-category').attr('category-value');
    if(IsValueNull(selectedCategory) || selectedCategory =="0"){
        alert('Please choose a category');
        return false;
    }
    curation_handle.ajax_url    =   "./"+dataRequestURL;
    curation_handle.category=selectedCategory;
    curation_handle.save_curation(event,6);
};