var vidPlayerObject 				=  {};
var content_json					=	"";
var checked_content					=	"";
var checked_index					=	"";
var review_videoid					=	"";
var newSegInfo						=	"";
var temp_length						=	0;
var length							=	0;
var temp_id_row						=	0;
var duration						=	0;
var moderator_change_data			=	"";
var modal_error						=	"";
var moderator_change_data_warning	=	"";
var is_mod_change_meta				=	0; //false
var tempcuration_data				=	[];
var rejection_topic					=	{};
var accept_topic					=	[];
var accept_meta						=	[];
var rejection_meta					=	{};
var data							=	{};
data.subCategories					=	[];
data.categories					=	[];

curation_handle	=	new curate_libs();
$(window).load(function(){
	progressChange(100);
});
$(function()
{
    l_ch = true;
    progressChange(75);
    
    UI_createModal('#move_category_container','','','','',false);
    UI_createModal('#delete_content_container','','','','',false);
    UI_createModal('#delete_category_container','','','','',false);
    UI_createModal('#delete_language_container','','','','',false);
    UI_createModal('#filter_container','','','','',false);
    
    make_category_dropdown();
    
	make_language_dropdown();
	
	$(".review_select_category_for_move").removeAttr('category-value').children('button').html('Choose category <span class="caret"></span>');
	$('.category-drop-down-curation').on('click','li[data-catId] a',setCurationVideoCategory);
    
	UI_createTabs("#review_tabs",tab_switch_handle);
	
	/*UI_bindFunction('#filter_button',filter_grid,'click');
	UI_bindFunction('#final_filter_button',final_filter_grid,'click');*/
	
	UI_bindFunction('#delete_category_button',delete_category,'click');
	UI_bindFunction('#review_final_delete_category_button',final_delete_category,'click');
	
	UI_bindFunction('#delete_content_button',delete_content,'click');
	UI_bindFunction('#review_final_delete_content_button',final_delete_content,'click');
	
	UI_bindFunction('#delete_language_button',delete_language,'click');
	UI_bindFunction('#review_final_delete_language_button',final_delete_language,'click');
	
	UI_bindFunction('#review_final_move_category_button',final_move_category,'click');
	UI_bindFunction('#move_category_button',move_the_category_of_content,'click');
    
	UI_bindFunction('.content-link-select-type',changeCurationLinksInputLayout,'change');
	$("#moderator_final_approve").on('click',final_approval);

	UI_bindFunction('#headContributeButton','gotoCuration','click');
	$(".curationTablebody").on('click','.editRow .curationCell:nth-child(2) span',function(){$(this).html((vidPlayerObject.GetCurrentPTS()).toFixed(1));save	=	0;});
	$(".curationTablebody").on('click','.editRow .curationCell:nth-child(3) span',function(){$(this).html((vidPlayerObject.GetCurrentPTS()).toFixed(1));save	=	0;});
	for(var key in categoryObject)
	{
		if(categoryObject[key]['status']	==	"1")
		{
			option_cat	=	'<option value='+key+' data-label="'+categoryObject[key]['catId']+'"></option>';
			$("#moderator_category").append(option_cat);
			$("#moderator_category option:last-child").text(categoryObject[key]['catName']);
		}
	}
	//$("#moderator_category").append("<option value='other_category' data-label='other'>other</option>");
	
	for(var key in languageObject)
	{
		if(languageObject[key]['status']	==	"1")
		{
			option_cat	=	"<option value="+key+" data-label=''></option>";
			$("#moderator_language").append(option_cat);
			$("#moderator_language").find("option:last-child").attr("data-label",languageObject[key]['language']);
			$("#moderator_language").find("option:last-child").text(languageObject[key]['language']);
		}
	}
	$("#moderator_language").append("<option value='other_language' data-label='other'>other</option>");
	
	$('.curationTablebody').on('click','.editRow .curationCell:nth-child(5)',function(event)
	{
		$('.editRow').removeClass('editRow');
		$('.curationTablebody').find('[contenteditable="true"]').attr('contenteditable',false);
		event.stopImmediatePropagation();
	});
	$('.curationTablebody').on('click','.editRow .curationCell:nth-child(4)',function(event)
	{
		moderator_change_data	=	curation_handle.save_topics();
		$($("#curateScrollContainer .curationTablebody .curationRow")[temp_id_row]).addClass('playActive');
		vidPlayerObject.Play();
		$('.editRow').removeClass('editRow');
		$('.curationTablebody').find('[contenteditable="true"]').attr('contenteditable',false);
		//correct_the_timings(event);
		event.stopImmediatePropagation();
	});
	
	$('.curationTablebody').on('click','.curationCell:nth-child(5)',function()
	{
		var start_time	=	$(this).prev().prev().prev().text();
		var end_time	=	$(this).prev().prev().text()	;
		
		newSegInfo		=	curation_handle.CreateSegment(0)[0];
		length			=	newSegInfo.segmentList.length;
		content_json	=	curation_handle.CreateSegment(0)[1];
		
		temp_id_row		=	Number($(this).parent().attr("id_row"))-1;	
		$("#curateScrollContainer .curationTablebody .curationRow").removeClass('playActive');
		$($("#curateScrollContainer .curationTablebody .curationRow")[temp_id_row]).addClass('playActive');
		vidPlayerObject.LoadNewVideoSegment(newSegInfo.videoID, 'handle_segmentwise');
		vidPlayerObject.PlaySegmentwise(start_time,end_time);
	});
	
	$('.curationTablebody').on('click','.curationCell:nth-child(6)',function(event)
	{
		$('.editRow').removeClass('editRow');
		$(event.target).closest('.curationRow').remove();
		rows	=	$("#curateScrollContainer .curationTablebody .curationRow").length;
		for	($i=0;$i<rows;$i++)
		{
	  		$($("#curateScrollContainer .curationTablebody .curationRow")[$i]).attr('id_row',$i+1);
		}
		save	=	0;
		moderator_change_data	=	curation_handle.save_topics();
	});
	
	$("#moderator_category").on('change',function()
	{
		if($("#moderator_category option:selected").val()	==	'other_category')
		{
			$("#moderator_other_category").closest(".form-group").removeClass("reviewer_hide_div");
		}
	});
	
	if(typeofuser	==	2)
	{
		$('.curationTablebody').on('click','.curationCell:nth-child(4)',function()
		{
			$("#curateScrollContainer .curationTablebody .curationRow").removeClass('playActive');
			vidPlayerObject.Pause();
			$('.editRow').removeClass('editRow');
			var curationRow	=	$(this).closest('.curationRow');
			curationRow.addClass('editRow');
			$('.curationTablebody').find('[contenteditable="true"]').attr('contenteditable',false);
			curationRow.find('span:lt(4)').attr('contenteditable',true);
		});
	}
	
	$('#iframe_collapse_button').on('click',function(){
		handle_iframe_div();
	});
    
    $('#active-jobs-grid').on('show.bs.collapse', function () {
        $('#review_tabs_and_player').collapse('hide');
        $('#iframe_div_for_curation').collapse('hide');
    });
    $('#review_tabs_and_player').on('show.bs.collapse', function () {
        $('#iframe_div_for_curation').collapse('hide');
        $('#active-jobs-grid').collapse('hide');
    });
    $('#iframe_div_for_curation').on('show.bs.collapse', function () {
        $('#review_tabs_and_player').collapse('hide');
        $('#active-jobs-grid').collapse('hide');
    });
    
	build_parent_category(categoryObject);
});

function handle_iframe_div(event,type)
{
	if($("#iframe_div_for_curation").attr('aria-expanded'))
	{
		RefreshGrid("ActiveJobs");
	    pauseIframeVideo();
	}
}

function make_category_dropdown()
{
	data.categories	=	[];
	data.subCategories	=	[];
	Object.keys(categoryObject).forEach(function (key){
    	if(categoryObject[key]['parentCat'] == 0){
    		var temp_data_cat	=	{'label':categoryObject[key]['catName'],'link':'#','attr':{'data-catid':categoryObject[key]['catId'],'data-vidId':categoryObject[key]['anchorVideoId']}};
    		data.categories.push(temp_data_cat);
		}
		else{
			temp_data_subcat	=	{'label':categoryObject[key]['catName'],'link':'#','attr':{'data-catid':categoryObject[key]['catId'],'data-vidId':categoryObject[key]['anchorVideoId']}};
			if( typeof data.subCategories[categoryObject[key]['parentCat']] != "object"){
				data.subCategories[categoryObject[key]['parentCat']]	=	[];
			}
			data.subCategories[categoryObject[key]['parentCat']].push(temp_data_subcat)	;
		}
	});

    var catData	=	data.categories;
    $(".review_select_category_for_move").each(function(){
		$(this).html("");
		UI_createJsonUL(this,{'html':catData});
		UI_createDropdown(this,'',false);
	    var subMenuObj = data.subCategories;
		for(var key in subMenuObj){
	        var dropDownArray   =   $(this);
	        dropDownArray.each(function(){
	            var menuItem = $(this).find('ul.dropdown-menu li[data-catid="'+key+'"]');
	            menuItem.find('a').addClass("dropdown-toggle").attr("data-toggle","dropdown");
	            menuItem.addClass('dropdown-submenu').append('<div class="subMenuExpand visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-down"></div><div class="subMenuCollapse hiddenElem visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-up"></span></div><ul class="dropdown-menu"></ul>');
	            for(var i=0;i<subMenuObj[key].length;i++){
	                menuItem.find('ul.dropdown-menu').append('<li data-catId="'+subMenuObj[key][i]['attr']['data-catid']+'" data-vidId="'+subMenuObj[key][i]['attr']['data-vidId']+'"><a></a></li>');
	                menuItem.find('ul.dropdown-menu li:last-child a').text(subMenuObj[key][i]['label']).attr('href',subMenuObj[key][i]['link']);
	            }
	        });
		}
		$(this).removeAttr('category-value').children('button').html('Choose category <span class="caret"></span>');
	});
}
function make_language_dropdown()
{
	$('#dropdown_for_delete_language select').html("");
	Object.keys(languageObject).forEach(function (key){
		$('#dropdown_for_delete_language select').append($('<option>', {
		    value: languageObject[key]['id'],
		    text: languageObject[key]['language']
		}));
	});
}

function delete_category()
{
	UI_bindModalButton('#delete_category_button','#delete_category_container');
	$("#review_final_delete_category_button").html('Delete');
	$(".review_select_category_for_move").removeAttr('category-value').children('button').html('Choose category <span class="caret"></span>');
	$(".move_category_error").html("");
}

function final_delete_category()
{
	$(".move_category_error").html("");
	if(typeof($("#dropdown_for_delete").attr("category-value"))	==	"undefined")
	{
		$(".move_category_error").html("Please select a category");
	}
	else
	{
		var type	=	"delete";		
		var data	=	{'data':{'category':$("#dropdown_for_delete").attr("category-value")}};
		
		$("#review_final_delete_category_button").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Deleting');
		final_approval(event,type,data);
	}
}
function delete_content()
{
	if($('input[name="review_select_checkbox"]:checked').length==0)
	{
		event.stopImmediatePropagation();
		return false;		
	}
	else
	{
		UI_bindModalButton('#delete_content_button','#delete_content_container');
		$("#review_final_delete_content_button").html('Delete');
		$(".delete_content_error").html("");
		$("#list_of_selected_video").html("");
		
		$("#number_of_content_selected").html(" "+$('input[name="review_select_checkbox"]:checked').length+" ");
		if($('input[name="review_select_checkbox"]:checked').length	>	1){
			$("#plural_or_singular").html("s");
		}
		for(i=0;i<$('input[name="review_select_checkbox"]:checked').length;i++){
			var temp_id	=	$('input[name="review_select_checkbox"]:checked').eq(i).attr('id');
			$("#list_of_selected_video").append("<li></li>");
			$("#list_of_selected_video").find("li:last-child").text(tempcuration_data[temp_id]['title']);
		}
		
	}
}

function final_delete_content()
{
	$(".delete_content_error").html("");
	var type	=	"review_delete_content";		
	var data	=	{'data':{'id':{}}};
	for(i=0;i<$('input[name="review_select_checkbox"]:checked').length;i++){
		var temp_id	=	$('input[name="review_select_checkbox"]:checked').eq(i).attr('id');
		data['data']['id'][i]	=	temp_id;
	}
	$("#review_final_delete_content_button").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Deleting');
	final_approval(event,type,data);
}

function delete_language()
{
	UI_bindModalButton('#delete_language_button','#delete_language_container');
	$("#review_final_delete_language_button").html('Delete');
	$(".delete_language_error").html("");
}

function final_delete_language()
{
	$(".delete_language_error").html("");
	var type	=	"review_delete_language";		
	var data	=	{'data':{'language':$("#dropdown_for_delete_language select").val()}};
	
	$("#review_final_delete_language_button").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Deleting');
	final_approval(event,type,data);
}

function filter_grid()
{
	UI_bindModalButton('#filter_button','#filter_container');
	Object.keys(languageObject).forEach(function (key){
		$("#language_filter_options").append("<input type='checkbox' value class='language_options'></div>");
		$("#language_filter_options input:last-child").val(languageObject[key]['language']);
	});
	$("#final_filter_button").html('Filter');
}

function final_filter_grid()
{
	var gridID,from,to;
	var buttonID = $(event.target).attr('id');
	
	
	if(buttonID == 'show-qc-status-button') {
		gridID = $('#QCStatus');
		from = $('#qc-from-date').val();
		to = $('#qc-to-date').val();
	} else if(buttonID == 'show-packstatus-button') {
		gridID = $('#PackStatus');
		from = $('#packaging-from-date').val();
		to = $('#packaging-to-date').val();
	}	
	
	if(from!= "" && to!= "") {
		//Date Object received from Date.parse() returns IST (GMT : +0530)
		var fromTS = Date.parse(from).getTime()/1000; // Unix TimeStamp
		var toTS = Date.parse(to).getTime()/1000; // Unix TimeStamp
		// Send Ajax to fetch data
		gridID.setGridParam({
	        url:gridID.attr('url'),
	        postData: {'from':fromTS,'to':toTS},
	    }).trigger("reloadGrid");
	}
}

function final_move_category()
{
	if(typeof($("#dropdown_for_move").attr("category-value"))	==	"undefined")
	{
		$(".move_category_error").html("Please select a category");
	}
	else
	{
		var type	=	"move";		
		var data	=	{'data':{'id':{}}};
		for(i=0;i<$('input[name="review_select_checkbox"]:checked').length;i++){
			var temp_id	=	$('input[name="review_select_checkbox"]:checked').eq(i).attr('id');
			data['data']['id'][i]	=	temp_id;
		}
		data['data']['category']			=	$("#dropdown_for_move").attr("category-value");
		data['data']['category_breadcrumb']	=	build_breadcrumb_of_category($("#dropdown_for_move").attr("category-value"));
		
		$("#review_final_move_category_button").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Moving');
		final_approval(event,type,data);
	}
}

function move_the_category_of_content(event)
{
	if($('input[name="review_select_checkbox"]:checked').length==0)
	{
		event.stopImmediatePropagation();
		return false;		
	}
	else
	{
		var is_non_approved_video_move	=	false;
		$('#review_final_move_category_button').prop('disabled', false);
		UI_bindModalButton('#move_category_button','#move_category_container');
		$("#review_number_of_video_selected").html(" "+$('input[name="review_select_checkbox"]:checked').length+" ");
		$("#review_list_of_selected_video").html("");
		$("#review_final_move_category_button").html('Move');
		$(".move_category_error").html("");
		$(".review_select_category_for_move").removeAttr('category-value').children('button').html('Choose category <span class="caret"></span>');
		
		for(i=0;i<$('input[name="review_select_checkbox"]:checked').length;i++){
			var temp_id	=	$('input[name="review_select_checkbox"]:checked').eq(i).attr('id');
			if(!is_non_approved_video_move	&&	tempcuration_data[temp_id]['curationstatus']	!=	'4')
			{
				is_non_approved_video_move	=	true;
				$(".move_category_error").html("Non-Approved video cannot be moved!");
				$('#review_final_move_category_button').prop('disabled', true);
			}
			$("#review_list_of_selected_video").append("<li></li>");
			$("#review_list_of_selected_video").find("li:last-child").text(tempcuration_data[temp_id]['title']);
		}
		if($('input[name="review_select_checkbox"]:checked').length	>	1){
			$("#review_is_plural_or_singular").html("s");
		}
	}
}

function radio_changed(event)
{
	content_json			=	"";
	moderator_change_data	=	"";
	is_mod_change_meta		=	0;
	
}

function setCurationVideoCategory(event){
	var currentCat  =   $(event.currentTarget).closest('[data-catid]').attr('data-catid');
	/*build_breadcrumb_of_category(currentCat);*/
    var dropDownElem    =    $(event.currentTarget).closest('.category-drop-down-curation');
    dropDownElem.attr('category-value',currentCat);
    dropDownElem.children('button')[0].innerHTML  =   '<span class="caret"></span>';
    dropDownElem.children('button')[0].innerTEXT +=	categoryObject[currentCat]['catName'];
    event.preventDefault();
}

function build_parent_category(category_object)
{
	var subCatData = category_object;
    parentCatObj    =   {};
	for(var key in subCatData){
		if(subCatData[key]['parentCat']	!=	"0")
		{
			parentCatObj[key]  =   subCatData[key]['parentCat'];
		}
	}
	
}

function on_review_checkbox_change(event)
{
	if($(".review_checkboxes").is(":checked"))
	{
		$("#move_category_button").prop("disabled",false);
	}
	else
	{
		$("#move_category_button").prop("disabled",true);
	}
}

function show_meta_modal(event)
{
	$("#moderator_title").val(tempcuration_data[checked_index]['title']);
	$("#moderator_original_description").val(tempcuration_data[checked_index]['originaldescription']);
	$("#moderator_category").find('option[data-label="'+tempcuration_data[checked_index]['category_id']+'"]').prop("selected",true);
	$("#moderator_language").find("option[data-label='"+tempcuration_data[checked_index]['language_id']+"']").prop("selected",true);
	
	if(tempcuration_data[checked_index]["other_category"]	==	"")
	{
		/*$("#moderator_other_category").closest(".form-group").addClass("reviewer_hide_div");*/
		$("#moderator_other_category").closest(".form-group").removeClass("reviewer_hide_div");
		$("#moderator_other_category").val("");
	}
	else
	{
		$("#moderator_other_category").closest(".form-group").removeClass("reviewer_hide_div");
		$("#moderator_other_category").val(tempcuration_data[checked_index]["other_category"]);
	}
	
	$("#moderator_description").val(tempcuration_data[checked_index]['description']);
	
	$("#moderator_keywords").val(tempcuration_data[checked_index]['originalkeywords']);
	$("#moderator_tags").val(tempcuration_data[checked_index]['keywords']);
	
	if(tempcuration_data[checked_index]["other_language"]	==	"")
	{
		/*$("#moderator_other_language").closest(".form-group").addClass("reviewer_hide_div");*/
	}
	else
	{
		$("#moderator_other_language").closest(".form-group").removeClass("reviewer_hide_div");
		$("#moderator_other_language").val(tempcuration_data[checked_index]['other_language']);
	}
	
	if(tempcuration_data[checked_index]['agegroup']	==	1)
	{
		$("#moderator_age").find("option[value='1']").attr("selected",true);
	}
	else if(tempcuration_data[checked_index]['agegroup']	==	2)
	{
		$("#moderator_age").find("option[value='2']").attr("selected",true);
	}
	else if(tempcuration_data[checked_index]['agegroup']	==	3)
	{
		$("#moderator_age").find("option[value='3']").attr("selected",true);
	}
	else if(tempcuration_data[checked_index]['agegroup']	==	4)
	{
		$("#moderator_age").find("option[value='4']").attr("selected",true);
	}
	
	$("#moderator_items").val(tempcuration_data[checked_index]['itemused']);
    var curationLinks   =   tempcuration_data[checked_index]['curationlinks'];
    if(!IsValueNull(curationLinks)){
        curationLinks   =   JSON.parse(curationLinks);
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
        /*linksSelectionArr.each(function(){
            $(this).change();
        });*/                
    }
    $(".mod_input").on("change",function(){is_mod_change_meta	=	1;});    
}

function final_issue(event)
{
	for(x in rejection_meta)
	{
		if(rejection_meta[x]	==	"reject")
		{
			var is_meta_have_reject		=	true;
			break;
		}
	}
	for(x in rejection_topic)
	{
		if(rejection_topic[x]	==	"reject")
		{
			var is_topic_have_reject	=	true;
		}
	}
	if(typeof(is_meta_have_reject)	==	"undefined"	&&	typeof(is_topic_have_reject)	==	"undefined")
	{
		curation_handle.id			=	tempcuration_data[checked_index]['id'];
		var temp_issue_array	=	{};
		if($('#full_content_rejection').val()	==	"")
		{
			temp_issue_array['issue']	=	"Data is inappropriate";
		}
		else
		{
			temp_issue_array['issue']	=	$('#full_content_rejection').val();
		}
		
		curation_handle.issue		=	JSON.stringify(temp_issue_array);
		curation_handle.ajax_url	=	'./'+dataRequestURL;
		if(typeofuser	==	2)
		{
			curation_handle.save_curation(event,5);
		}
		else
		{
			curation_handle.save_curation(event,2);
		}
	}
	else if($(".decision_input").length	==	0)
	{
		event.preventDefault();
		return false;
	}
	else
	{
		for(i=0;i<$(".decision_input").length;i++)
		{
			if($($(".decision_input")[i]).val()	==	"")
			{
				event.preventDefault();
				UI_alert("Please fill out all reason for rejection");
				return false;
			}
		}
		var temp_issue_array	=	{};
		for(i=0;i<$(".decision_input").length;i++)
		{
			temp_issue_array[$($(".decision_label")[i]).text()]	=	$($(".decision_input")[i]).val();	
		}
		$("#review_issue_final").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Waiting');
		curation_handle.id			=	tempcuration_data[checked_index]['id'];
		curation_handle.issue		=	JSON.stringify(temp_issue_array);
		curation_handle.ajax_url	=	'./'+dataRequestURL;
		if(typeofuser	==	2)
		{
			curation_handle.save_curation(event,5);
		}
		else
		{
			curation_handle.save_curation(event,2);
		}
	}
}
/*
 * final_approval; type defines the type of request type="move" means move the videos to specific categories
 * data means the data associated with the type
 * Used by final_move_category
 */
function final_approval(event,type,data)
{	
	if(type	==	"move")
	{
		curation_handle.ajax_url	=	'./'+dataRequestURL;
		curation_handle.data		=	data;
		curation_handle.save_curation(event,7);
	}
	else if(type	==	"delete")
	{
		curation_handle.ajax_url	=	'./'+dataRequestURL;
		curation_handle.data		=	data;
		curation_handle.save_curation(event,8);
	}
	else if(type	==	"review_delete_language")
	{
		curation_handle.ajax_url	=	'./'+dataRequestURL;
		curation_handle.data		=	data;
		curation_handle.save_curation(event,9);
	}
	else if(type	==	"review_delete_content")
	{
		curation_handle.ajax_url	=	'./'+dataRequestURL;
		curation_handle.data		=	data;
		curation_handle.save_curation(event,10);
	}
	else
	{
		if(typeofuser	==	2	&&	(moderator_change_data	!=	""	||	is_mod_change_meta	==	1)	)
		{
			$("#review_approve_final").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Waiting');
			if(moderator_change_data	==	"")
			{
				moderator_change_data	=	content_json;
			}
	        var linksJsonObject =   [];
	        var linksSelectionArr   =   $('.content-link-select-type');
	        for(var k=0;k<linksSelectionArr.length;k++){
	            linksJsonObject[k]  ={};
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
	
			curation_handle.topic_info			=	moderator_change_data;
			curation_handle.language			=	$("#moderator_language").val();
			curation_handle.other_language		=	$("#moderator_other_language").val();
			curation_handle.category			=	$("#moderator_category").val();
			curation_handle.other_category		=	$("#moderator_other_category").val();
			var temp_category					=	curation_handle.category;
			var temp_category_breadcrumb	=	[];
			while(true)
		    {
				temp_category_breadcrumb.unshift(categoryObject[temp_category]['catName']);
		    	temp_category	=	parentCatObj[temp_category];
		    	if(typeof(temp_category)	==	"undefined")
		    	{
		    		if(curation_handle.other_category)
		    		{
		    			temp_category_breadcrumb.push(curation_handle.other_category);
		    			break;
		    		}
		    		else
		    		{
		    			break;
		    		}
		    	}
		    }
			
			curation_handle.category_breadcrumb	=	temp_category_breadcrumb.join("/");
			
			curation_handle.title			=	$("#moderator_title").val();
			curation_handle.description		=	$("#moderator_description").val();
			curation_handle.age				=	$("#moderator_age").val();
			curation_handle.keywords		=	$("#moderator_keywords").val();
			curation_handle.tags			=	$("#moderator_tags").val();
			curation_handle.items			=	$("#moderator_items").val();
			
			curation_handle.id				=	tempcuration_data[checked_index]['id'];
			curation_handle.ajax_url		=	'./'+dataRequestURL;
			curation_handle.quality_rate	=	$("#content_quality_rating").val();
			curation_handle.meta_rate		=	$("#content_metadata_rating").val();
			curation_handle.topic_rate		=	$("#content_topics_rating").val();
			var temp_version	=	"0.0";
			if($("#global_version_checkbox").is(":checked")	&&	$("#local_version_checkbox").is(":checked"))
			{
				temp_version	=	"1.1";
			}
			else if($("#global_version_checkbox").is(":checked"))
			{
				temp_version	=	"1.0";
			}
			else if($("#local_version_checkbox").is(":checked"))
			{
				temp_version	=	"0.1";
			}
			curation_handle.version			=	temp_version;
	        curation_handle.links           =   JSON.stringify(linksJsonObject);
			curation_handle.save_curation(event,3);
		}
		else
		{
			if(tempcuration_data[checked_index]	==	undefined)
			{
				return false;
			}
			$("#review_approve_final").html('<img src="./'+projectFolderName+'/image/review_loading.gif" style="width:25%"></span>Waiting');
			curation_handle.id			=	tempcuration_data[checked_index]['id'];
			curation_handle.quality_rate	=	$("#content_quality_rating").val();
			curation_handle.meta_rate		=	$("#content_metadata_rating").val();
			curation_handle.topic_rate		=	$("#content_topics_rating").val();
			var temp_version	=	"0.0";
			if($("#global_version_checkbox").is(":checked")	&&	$("#local_version_checkbox").is(":checked"))
			{
				temp_version	=	"1.1";
			}
			else if($("#global_version_checkbox").is(":checked"))
			{
				temp_version	=	"1.0";
			}
			else if($("#local_version_checkbox").is(":checked"))
			{
				temp_version	=	"0.1";
			}
			curation_handle.version			=	temp_version;
			curation_handle.ajax_url		=	'./'+dataRequestURL;
			curation_handle.save_curation(event,4);
		}
	}
}

function on_ajax_response(event,response)
{
	if(event.target.id	==	"review_issue_final")
	{
		if(response['status']	==	true)
		{
			RefreshGrid("ActiveJobs");
			$("#review_issue_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Reject');
		}
		else //if(response	==	0)
		{
			$("#review_issue_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Reject');
		}
	}
	else if(event.target.id	==	"review_final_move_category_button")
	{
		if(response['status']	==	true)
		{
			RefreshGrid("ActiveJobs");
			$("#review_final_move_category_button").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Move');
		}
		else
		{
			$("#review_final_move_category_button").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Move');
		}
	}
	else if(event.target.id	==	"review_final_delete_category_button")
	{
		if(response['status']	==	true)
		{
			RefreshGrid("ActiveJobs");
			$.ajax({
				url:"https://wisdomtalkies.com/wisdom-talkies/php/review_data.php?request[data]=category_object",
				type: 'GET',
				async:false
			})		
			.done(function(data){
				categoryObject	=	JSON.parse(data);
				make_category_dropdown();
			});
			$("#review_final_delete_category_button").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Delete');
		}
		else
		{
			$(".move_category_error").html("There is some dependency of this category!");
			$("#review_final_delete_category_button").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Delete');
		}
	}
	else if(event.target.id	==	"review_final_delete_content_button")
	{
		if(response['status']	==	true)
		{
			RefreshGrid("ActiveJobs");
			$("#review_final_delete_content_button").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Delete');
		}
		else
		{
			$(".delete_content_error").html("An error has occured");
			$("#review_final_delete_content_button").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Delete');
		}
	}
	else if(event.target.id	==	"review_final_delete_language_button")
	{
		if(response['status']	==	true)
		{
			$.ajax({
				url:"https://wisdomtalkies.com/wisdom-talkies/php/review_data.php?request[data]=language_object",
				type: 'GET',
				async:false
			})		
			.done(function(data){
				languageObject	=	JSON.parse(data);
				make_language_dropdown();
			});
			$("#review_final_delete_language_button").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Delete');
		}
		else
		{
			$(".delete_language_error").html("There is some dependency of this language!");
			$("#review_final_delete_language_button").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Delete');
		}
	}
	
	else if(event.target.id	==	"review_approve_final")
	{
		if(typeofuser	==	3)
		{
			if(response['status']	==	true)
			{
				RefreshGrid("ActiveJobs");
				$.ajax({
					url:"https://wisdomtalkies.com/wisdom-talkies/php/review_data.php?request[data]=category_object",
					type: 'GET',
					async:false
				})		
				.done(function(data){
					categoryObject	=	JSON.parse(data);
					make_category_dropdown();
				});
				$("#review_approve_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Approve');				
			}
			else if(response['status']	==	false)
			{
				$("#review_approve_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Approve');
			}
		}
		else if(typeofuser	==	2)
		{
			if(response['status']	==	true)
			{
				RefreshGrid("ActiveJobs");
				$.ajax({
					url:"https://wisdomtalkies.com/wisdom-talkies/php/review_data.php?request[data]=category_object",
					type: 'GET',
					async:false
				})		
				.done(function(data){
					categoryObject	=	JSON.parse(data);
					make_category_dropdown();
				});
				$("#review_approve_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10004;</span>Approve');
			}
			else
			{
				$("#review_approve_final").html('<span style="font-family: Arial Unicode MS, Lucida Grande">&#10008;</span>Approve');
			}
		}
	}
}

function handle_review_interface_collapse()
{
	if($("#review_tabs_and_player").attr('aria-expanded')	!=	"true"){
		$('#review_interface_collapse_button').click();
	}
	
	if($("#iframe_div_for_curation").attr('aria-expanded')	==	"true"){
		$('#iframe_collapse_button').click();
	}
}

function handle_iframe_collapse()
{
	if($("#iframe_div_for_curation").attr('aria-expanded')	!=	"true"){
		$('#iframe_collapse_button').click();
	}
	
	if($("#review_tabs_and_player").attr('aria-expanded')	==	"true"){
		$('#review_interface_collapse_button').click();
	}
}

function review_play(event){
	if(mainAppVars.playerReady	==	false)
	{
		return false;
	}
	
	handle_review_interface_collapse();
	
	$(".compulsory_mod_check input").removeAttr('checked');
	rejection_topic				=	[];
	moderator_change_data		=	"";
	temp_length					=	0;
	length						=	0;
	temp_id_row					=	0;
	
	$('.accepted').removeClass('accepted');
	$('.rejected').removeClass('rejected');
    
	checked_index	=	event.target.id;
	review_videoid	=	tempcuration_data[checked_index]['videoid'];
	content_json	=	JSON.parse(tempcuration_data[checked_index]['topicinfo']);
	$("#moderator_original_description").val(tempcuration_data[checked_index]['originaldescription']).closest('.form-group').find('label').addClass('accepted');
	
	checked_content	=	tempcuration_data[checked_index];
	temp_duration	=	content_json['topic_info'].length;
	if(temp_duration	>	0)
	{
		duration		=	content_json['topic_info'][temp_duration-1]['end_time'];
	}
	$('#curate_title').val(checked_content['title']);
	$('#curate_category').val(checked_content['category']);
	$('#curate_description').val(checked_content['description']);
	$('#curate_language').val(checked_content['language']);
	$('#curate_age').val(checked_content['agegroup']);
	
	$("#curateScrollContainer .curationTablebody").children().remove();
	
	if(!length)
	{
		append_topic_info();	
	}
	
	for(i=0;	i<content_json['topic_info'].length;	i++)
	{
		curation_handle.add_new_topic(content_json["topic_info"][i]["topic"],content_json["topic_info"][i]["start_time"],content_json["topic_info"][i]["end_time"],append_topic_info);
	}
	
	newSegInfo		=	curation_handle.CreateSegment(0,review_videoid)[0];
	length			=	newSegInfo.segmentList.length;
	content_json	=	curation_handle.CreateSegment(0,review_videoid)[1];
	
	vidPlayerObject.LoadNewVideoSegment(newSegInfo.videoID, 'HandleSegmentEnd');
	$($("#curateScrollContainer .curationTablebody .curationRow")[temp_id_row]).addClass('playActive');
	if(length	>	0)
	{
		vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[temp_length].startTime,newSegInfo.segmentList[temp_length].endTime);
	}
	else
	{
		vidPlayerObject.PlaySegmentwise(0,1);
	}
	show_meta_modal(event);
	initialize_reviewer_array();
	UI_showTab("review_topics_tab");

	if(typeofuser	==	2	&&	tempcuration_data[checked_index]['curationstatus']	!=	'4')
	{
		$(".accept_topic").each(function(){
			$(this).click();
		});
		$(".accept_metadata").each(function(){
			$(this).click();
		});
		try{
			var temp_issue_for_reject	=	JSON.parse(tempcuration_data[checked_index]['reviewissue']);
			if(temp_issue_for_reject)
			{
				/*var temp_issue_keys		=	Object.keys(temp_issue_for_reject);*/
				for(key in temp_issue_for_reject)
				{
					if(key == 'issue')
					{
						$(".reject_topic").each(function(){
							$(this).click();
						});
						$(".reject_metadata").each(function(){
							$(this).click();
						});
					}
					else
					{
						if(key.split(":")[0]	==	"Meta data")
						{
							$('[label_name="'+key.split(":")[1]+'"]').closest(".form-group").find(".reject_metadata").click();
						}
						else
						{
							$('[id_row="'+key.split(":")[1]+'"]').find(".reject_topic").click();
						}
					}
				}
			}
		}
		catch(err){
			
		}
	}
	$('#moderator_original_description').closest('.form-group').find('.accept_metadata').click();
	/*$('#moderator_other_language').closest('.form-group').find('.accept_metadata').click();*/
}

function initialize_reviewer_array()
{
	rejection_topic	=	{};
	rejection_meta	=	{};

	for(i=0	;	i<$(".curationRow").length;	i++)
	{
		rejection_topic[$(".curationRow").attr("id_row")]	=	"";
	}
	var metaArr	=	$(".form-horizontal .form-group").not('.reviewer_hide_div,.not_compulsory_for_review').find(".control-label").not('.decision_label,.not_compulsory_for_review');
	for(i=0	;	i<metaArr.length;	i++)
	{
		rejection_meta[metaArr.eq(i).text()]	=	"";
        
	}
}

function reviewer_decision(event)
{
	$("#final_review_decision").html("");
	var accept_button	=	"";
	var reject_button	=	"";
	for(key in rejection_topic)
	{
		if(rejection_topic[key]	==	"reject")
		{
			var decision_content	=	'<div class="form-group"><label class="control-label col-md-3 decision_label">Topic:'+key+'</label><div class="col-md-7"><input id="" type="text" class="form-control decision_input" name="" placeholder="Please provide the reason for your rejection"></div></div>';
			$("#final_review_decision").append(decision_content);
			accept_button			=	"<button id='review_approve_final' class='btn btn-default' disabled type='button'>Approve</button>";
			reject_button			=	"<button id='review_issue_final' class='btn btn-default' type='button'>Reject</button>";
			
		}
	}
	for(key in rejection_meta)
	{
		if(rejection_meta[key]	==	"reject")
		{
			var decision_content	=	'<div class="form-group"><label class="control-label col-md-3 decision_label">Meta data:'+key+'</label><div class="col-md-7"><input id="" type="text" class="form-control decision_input" name="" placeholder="Please provide the reason for your rejection"></div></div>';
			$("#final_review_decision").append(decision_content);
			accept_button			=	"<button id='review_approve_final' class='btn btn-default' disabled type='button'>Approve</button>";
			reject_button			=	"<button id='review_issue_final' class='btn btn-default' type='button'>Reject</button>";
			
		}
	}
	
	if(accept_button	==	""	&&	reject_button	==	"")
	{
		accept_button			=	"<button id='review_approve_final' class='btn btn-default' type='button'>Approve</button>";
		reject_button			=	"<button id='review_issue_final' class='btn btn-default' disabled type='button'>Reject</button>";
		var decision_content	=	'<div class="form-group"><div class="text-left col-md-5 decision_label not_compulsory_for_review"><div id="not_compulsory_checkbox" data-label="Reject this content"></div></div><div class="col-md-7"><input id="full_content_rejection" type="text" class="form-control decision_input not_compulsory_for_review invisible" name="" placeholder="Please provide the reason for your rejection"></div></div>';
        decision_content        +=  '<div class="row">';
        decision_content        +=  '<div class="col-md-12 ratingOptionRow">';
        decision_content        +=  '<p>';
        decision_content        +=  '<strong>Rate curation</strong>';
        decision_content        +=  '</p>';
        decision_content        +=  '<div class="col-md-4">';
        decision_content        +=  '<label>Content Quality</label>';
        decision_content        +=  '<input class="form-control" value="1" id="content_quality_rating" type="number" min="1" max="10" step="1">';
        decision_content        +=  '</div>';
        decision_content        +=  '<div class="col-md-4">';
        decision_content        +=  '<label>Metadata</label>';
        decision_content        +=  '<input class="form-control" value="1" id="content_metadata_rating" type="number" min="1" max="10" step="1">';
        decision_content        +=  '</div>';
        decision_content        +=  '<div class="col-md-4">';
        decision_content        +=  '<label>Topics</label>';
        decision_content        +=  '<input class="form-control" value="1" id="content_topics_rating" type="number" min="1" max="10" step="1">';
        decision_content        +=  '</div></div><div class="col-md-12"><p></p></div></div>';
        decision_content        +=  '<div class="form-group"><div class="text-left col-md-5 decision_label not_compulsory_for_review"><div id="global_version_checkbox" data-label="Global Version"></div></div></div>';
        decision_content        +=  '<div class="form-group"><div class="text-left col-md-5 decision_label not_compulsory_for_review"><div id="local_version_checkbox" data-label="Local Version"></div></div></div>';
        $("#final_review_decision").append(decision_content);
	}
	$("#final_review_decision").append(accept_button);
	$("#final_review_decision").append(reject_button);
	
	UI_createCheckBox("#not_compulsory_checkbox",not_compulsory_checkbox_click);
	UI_createCheckBox("#global_version_checkbox");
	UI_createCheckBox("#local_version_checkbox");
	UI_bindFunction('#review_approve_final',final_approval,'click');
	UI_bindFunction('#review_issue_final',final_issue,'click');
}

function not_compulsory_checkbox_click(event)
{
    if(event.target.checked){
    	$('#global_version_checkbox').closest(".form-group").addClass('hide');
    	$('#local_version_checkbox').closest(".form-group").addClass('hide');
        $('.ratingOptionRow').addClass('hide');
        $('#review_approve_final').attr('disabled',true);
        $('#review_issue_final').attr('disabled',false);
        $('#full_content_rejection').removeClass('invisible');
    }
    else{
    	$('#global_version_checkbox').closest(".form-group").removeClass('hide');
    	$('#local_version_checkbox').closest(".form-group").removeClass('hide');
        $('.ratingOptionRow').removeClass('hide');
        $('#review_approve_final').attr('disabled',false);
        $('#full_content_rejection').addClass('invisible');
        $('#review_issue_final').attr('disabled',true);
    }
}

function tab_switch_handle(event)
{
	if(event.target.text	==	"Decision")
	{
		for(key in rejection_topic)
		{
			if(rejection_topic[key]	==	"")
			{
				event.preventDefault();
				return;
			}
		}
		for(key in rejection_meta)
		{
			if(rejection_meta[key]	==	"")
			{
				event.preventDefault();
				return;
			}
		}
		reviewer_decision(event);
		return;
	}
	return;
}

function build_breadcrumb_of_category(category_id)
{
	var temp_category	=	category_id;
	var temp_breadcrumb	=	[];
	while(true)
	{
		temp_breadcrumb.unshift(categoryObject[temp_category]['catName']);
    	temp_category	=	parentCatObj[temp_category];
    	if(typeof(temp_category)	==	"undefined")
    	{
    		break;
    	}
	 }
	return temp_breadcrumb.join("/")
}

function reviewer_reject_topic(event)
{
	$(event.currentTarget).closest('.curationRow').addClass('rejected').removeClass('accepted');
	rejection_topic[$(event.target).closest(".curationRow").attr("id_row")]	=	"reject";
	event.stopImmediatePropagation();
	return;
}

function reviewer_accept_topic(event)
{
	$(event.currentTarget).closest('.curationRow').removeClass('rejected').addClass('accepted');
	rejection_topic[$(event.target).closest(".curationRow").attr("id_row")]	=	"accept";
	event.stopImmediatePropagation();
	return;
}
function reviewer_accept_metadata(event)
{
	$(event.currentTarget).closest('.form-group').find('label').removeClass('rejected').addClass('accepted');
	rejection_meta[$($(event.target).closest(".form-group").children()[0]).text()]	=	"accept";
	event.stopImmediatePropagation();
	return;
}
function reviewer_reject_metadata(event)
{
	/*if(typeofuser	==	2)
	{
		return;
	}*/
	$(event.currentTarget).closest('.form-group').find('label').addClass('rejected').removeClass('accepted');
	rejection_meta[$($(event.target).closest(".form-group").children()[0]).text()]	=	"reject";
	event.stopImmediatePropagation();
	return;
}

function append_topic_info()	//used to add reject and accept button in topicrows
{
	$(".curationTablebody .curationRow:last-child").append($("<div class='curationCell'><div class='btn btn-success decision-btn'><div class='accept_topic badge'><span class='glyphicon glyphicon-ok'></span></div></div></div><div class='curationCell'><div class='btn btn-danger decision-btn'><div class='reject_topic badge'><span class='glyphicon glyphicon-remove'></span></div></div></div>"));
	$('.curationTablebody .curationRow').removeClass('editRow');
	$('.curationTablebody').find('[contenteditable="true"]').attr('contenteditable',false);
	UI_bindFunction('.reject_topic',reviewer_reject_topic,'click');
	UI_bindFunction('.accept_topic',reviewer_accept_topic,'click');
	UI_bindFunction('.accept_metadata',reviewer_accept_metadata,'click');
	UI_bindFunction('.reject_metadata',reviewer_reject_metadata,'click');
}

function handle_segmentwise()
{
	vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[0].endTime,duration);
	vidPlayerObject.Pause();
	$("#curateScrollContainer .curationTablebody .curationRow").removeClass('playActive');
}

function HandleSegmentEnd()
{
	if(!length)
	{
		vidPlayerObject.Pause();
		return false;
	}
	if(temp_length+2	>	length)
	{
		vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[temp_length].endTime,duration);
		vidPlayerObject.Pause();
		return false;
	}
	temp_length++;
	temp_id_row++;
	$("#curateScrollContainer .curationTablebody .curationRow").removeClass('playActive');
	$($("#curateScrollContainer .curationTablebody .curationRow")[temp_id_row]).addClass('playActive');
	vidPlayerObject.PlaySegmentwise(newSegInfo.segmentList[temp_length].startTime,newSegInfo.segmentList[temp_length].endTime);
}

var load_curation_in_iframe	=	function(event,src){
	$("#iframe_div_for_curation").empty();
	var iframe	=	document.createElement('iframe');
	iframe.src	=	src;
	iframe.id	=	"iframe_for_curation";
	$("#iframe_div_for_curation").append(iframe);
}

var curateContentReview	=	function(event){
	src	=	'curate/videoId='+tempcuration_data[event.target.id]['videoid']+'?page=list&request=curate&category='+tempcuration_data[event.target.id]['category_id'];
	load_curation_in_iframe(event,src);
	handle_iframe_collapse();
};

var recurate_content	=	function(event){
	src	=	'curate/videoId='+tempcuration_data[$(event.target).attr('data-contentid')]['videoid']+'/?page=list&request=curate&category='+tempcuration_data[$(event.target).attr('data-contentid')]['category_id']+'&s_id='+tempcuration_data[$(event.target).attr('data-contentid')]['id'];
	load_curation_in_iframe(event,src);
	handle_iframe_collapse();
};
var pauseIframeVideo    =   function(){
    var frame = document.getElementById('iframe_for_curation');
    if(frame)
    {
    	frame.contentWindow.postMessage('stopCurationVideo','*');
    }
};