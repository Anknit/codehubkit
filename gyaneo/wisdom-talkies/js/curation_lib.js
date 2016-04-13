var curate_libs	=	function()
{
	this.title					=	null; 
	this.description			=	null;
	this.category				=	null;
	this.other_category			=	null;
	this.other_language			=	null;
	this.language				=	null;
	this.keywords				=	null;
	this.age					=	null;
	this.items					=	null;
	this.topic_info				=	null;	
	this.source					=	null;
	this.ajax_url				=	null;
	this.id						=	null;
	this.issue					=	null;
	this.is_topic_null			=	null;
	this.videoID				=	null;
	this.quality_rate			=	null;
	this.meta_rate				=	null;
	this.topic_rate				=	null;
    this.links      		    =   null;
    this.tags					=	null;
    this.category_breadcrumb	=	null;
    this.version				=	null;
    this.data					=	null;

	this.ytduration_to_sec	=	function(youtube_duration)
	{
		var duration	=	youtube_duration.replace('PT','');
		var timeArr = duration.split('H');
		var hr,mm,ss;
		if(timeArr.length<2)
		{
			hr = 0;
		}
		else
		{
			hr = parseInt(timeArr[0]);
			timeArr.splice(0,1);
		}
		timeArr = timeArr[0];
		timeArr = timeArr.split('M');
		if(timeArr.length<2)
		{
			mm = 0;
		}
		else
		{
			mm = parseInt(timeArr[0]);
			timeArr.splice(0,1);
		}
		timeArr = timeArr[0];
		timeArr = timeArr.split('S');
		if(timeArr.length<2)
		{
			ss = 0;
		}
		else
		{
			ss = parseInt(timeArr[0]);
		}
		return (((hr*60)+mm)*60)+ss;
	};
	
	this.save_curation	=	function(event,save)	//save meaning 0=save,1=publish or status complete in db,2=issue by reviewer
													//3=approved by moderator with data changed	
	{
		if(save	==	0)
		{
			if((this.ajax_url&&this.source&&this.topic_info&&this.title
					&&this.category&&this.description&&this.language
					&&this.age&&this.keywords&&this.items&&this.tags
					&&this.other_language&&this.other_category&&this.links
					&&this.category_breadcrumb&&vidPlayerObject.videoID)	==	null)
			{
				return false;
			}
			
			if((this.category	==	'other_category'	&&	this.other_category	==	"")	||	(this.language	==	'other_language'	&&	this.other_language	==	''))
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=curation_save";
			var ajax_data	=	{"data":{
					'source':this.source,
					'videoID':vidPlayerObject.videoID,
					'topicInfo':this.topic_info,
					'title':this.title,
					'category':this.category,
					'description':this.description,
					'language':this.language,
					'age':this.age,
					'keywords':this.keywords,
					'items':this.items,
					'other_language':this.other_language,
					'other_category':this.other_category,
					'is_topic_null':this.is_topic_null,
					's_id':s_id,
                    'links':this.links,
                    'tags':this.tags,
                    'cat_bread':this.category_breadcrumb
			}};
		}
		else if(save	==	3)
		{
			if(	(this.ajax_url&&this.topic_info&&this.title
					&&this.category&&this.description&&this.language
					&&this.age&&this.keywords&&this.items
					&&this.links&&this.other_language&&this.tags&&this.quality_rate
					&&this.category_breadcrumb&&this.meta_rate&&this.topic_rate
					&&this.other_category&&this.version&&this.id)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=review_moderator_issue";
			var ajax_data	=	{"data":{
				'id':this.id,
				'content_json':this.topic_info,
				'title':this.title,
				'category':this.category,
				'description':this.description,
				'language':this.language,
				'age':this.age,
				'keywords':this.keywords,
				'items':this.items,
				'other_language':this.other_language,
				'other_category':this.other_category,
				'quality_rate':this.quality_rate,
				'meta_rate':this.meta_rate,
				'topic_rate':this.topic_rate,
                'links':this.links,
                'tags':this.tags,
                'cat_bread':this.category_breadcrumb,
                'version':this.version
                
			}};
		}
			
		else if(save	==	1)
		{
			if(	(this.ajax_url&&vidPlayerObject.videoID)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=curation_final_save";
			var ajax_data	=	{"data":{
				'videoID':vidPlayerObject.videoID,
				's_id':s_id
			}};
		}
		else if(save	==	2)
		{
			if(	(this.ajax_url&&this.issue&&this.id)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=review_reviewer_issue";
			var ajax_data	=	{"data":{
					'id':this.id,
					'issue':this.issue
			}};
		}
		else if(save	==	5)
		{
			if(	(this.ajax_url&&this.issue&&this.id)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=review_moderator_reject";
			var ajax_data	=	{"data":{
					'id':this.id,
					'issue':this.issue
			}};
		}
		else if(save	==	4)
		{
			if(	(this.ajax_url&&this.id&&this.version&&this.quality_rate&&this.meta_rate&&this.topic_rate)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=review_publish";
			var ajax_data	=	{"data":{
					'id':this.id,
					'quality_rate':this.quality_rate,
					'meta_rate':this.meta_rate,
					'topic_rate':this.topic_rate,
					'version':this.version
			}};
		}
		else if(save	==	6)
		{
			if(	(this.ajax_url&&this.videoID&&this.category)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=curation_add_to_list";
			var ajax_data	=	{"data":{
					'videoID':this.videoID,
					'category':this.category
			}};
		}
		else if(save	==	7)
		{
			if(	(this.ajax_url&&this.data)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=review_category_move";
			var ajax_data	=	this.data;
		}
		else if(save	==	8)
		{
			if(	(this.ajax_url&&this.data)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=review_category_delete";
			var ajax_data	=	this.data;
		}
		else if(save	==	9)
		{
			if(	(this.ajax_url&&this.data)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=review_language_delete";
			var ajax_data	=	this.data;
		}
		else if(save	==	10)
		{
			if(	(this.ajax_url&&this.data)	==	null)
			{
				return false;
			}
			var ajax_url	=	this.ajax_url+"?request=review_delete_content";
			var ajax_data	=	this.data;
		}
		
		$.ajax({
			url:ajax_url,
			type: 'POST',
			data:ajax_data,
			async:true
		})		
		.done(function(data){
			data	=	JSON.parse(data);
			on_ajax_response(event,data);
		});
		return true;
	}
	
	this.add_new_topic	=	function(topic,start,end,callback){
		if(!mainAppVars.playerReady)
		{
			return;
		}
		
		var temp_row	=	$(".editRow").attr("id_row");
		var temp_total_row	=	$("[id_row]").length;
		if(	temp_row	!=	undefined	)
		{
			this.correct_the_timings(0,temp_row,temp_total_row);
		}
		$("#curateScrollContainer .curationTablebody .curationRow").removeClass('playActive');
		var curationRow		=	$("<div class='curationRow'>");
		var curationCell	=	$("<div class='curationCell'></div>");
		curationRow.append($("<div class='curationCell'><span></span></div>"));//span is replaced by textarea
		curationRow.find("span:last-child").text($(topic!=null)?topic:"");
		curationRow.append($("<div class='curationCell start_time'><span time_value="+((start!=null)?start:"")+" >"+((start!=null)?start:"")+"</span></div>"));
		curationRow.append($("<div class='curationCell end_time'><span time_value="+((end!=null)?end:"")+" >"+((end!=null)?end:"")+"</span></div>"));
		
		curationRow.append(curationCell.clone().attr('data-content', '&#9998;'));
		curationRow.append($("<div class='curationCell'><span></span></div>"));
		curationRow.append($("<div class='curationCell'><span></span></div>"));
		
		curationRow.append($("</div>"));
		
		$("#curateScrollContainer .curationTablebody").append(curationRow);
		
		rows	=	$("#curateScrollContainer .curationTablebody .curationRow").length;
		for	($i=0;$i<rows;$i++)
		{
			$($("#curateScrollContainer .curationTablebody .curationRow")[$i]).attr('id_row',$i+1);
		}
		 
		vidPlayerObject.Pause();
		$('.curationTablebody .curationRow').removeClass('editRow');
		$(".curationTablebody .curationRow:last-child").addClass('editRow');
		$('.curationTablebody').find('[contenteditable="true"]').attr('contenteditable',false);
		$(".curationTablebody .curationRow:last-child span:lt(4)").attr('contenteditable',true);
		(callback!=null) ? callback() : "";
	}
	this.correct_the_timings	=	function(event,current_row,total_rows){
		response	=	{};
		if(	event	==	0)
		{
			temp_id	=	current_row;
			temp_total_id	=	total_rows;
		}
		
		else
		{
			temp_id	=	$(event.target).parent().attr("id_row");
			temp_total_id	=	$total_child	=	$(event.target).parent().parent().children().last().attr("id_row");
		}
		raw_temp_starttime	=	$("[id_row='"+temp_id+"']").find('.start_time span').attr("time_value");
		raw_temp_endtime	=	$("[id_row='"+temp_id+"']").find('.end_time span').attr("time_value");
		if(raw_temp_endtime	==	""	||	raw_temp_starttime	==	"")
		{
			response.is_row_null	=	1;
		}
		num_temp_endtime	=	Number(raw_temp_endtime);
		num_temp_starttime	=	Number(raw_temp_starttime);
	
		if(	isNaN(num_temp_endtime)	||	isNaN(num_temp_starttime)	)
		{
			response.is_row_nan	=	1;
		}
		if(num_temp_starttime	==	num_temp_endtime	&&	raw_temp_starttime	!= "")
		{
			num_temp_endtime		=	(parseFloat(num_temp_endtime)	+	0.1).toFixed(1);
			$("[id_row='"+temp_id+"']").find('.end_time span').text(this.time_format(num_temp_endtime));
			$("[id_row='"+temp_id+"']").find('.end_time span').attr('time_value',num_temp_endtime)
			response.is_row_edited	=	1; //row edited
		}
	
		else if(num_temp_starttime	>	num_temp_endtime	&&	raw_temp_starttime	!=	""	&&	raw_temp_endtime	!=	"")
		{
			num_temp_endtime		=	(parseFloat(num_temp_starttime)	+	0.1).toFixed(1);
			$("[id_row='"+temp_id+"']").find('.end_time span').text(this.time_format(num_temp_endtime));
			$("[id_row='"+temp_id+"']").find('.end_time span').attr('time_value',num_temp_endtime)
			response.is_row_edited	=	1; //row edited
		}
	
		if(temp_id	!=	temp_total_id)
		{
			if(temp_id	==	1)	//click on first row and availble row is suppose 3 > 1
			{
				num_temp_endtime			=	Number($("[id_row=1]").find(".end_time span").attr('time_value'));//Number($(event.target).parent().find('.end_time').text());
				num_temp_another_starttime	=	Number($("[id_row=2]").find(".start_time span").attr('time_value'));//Number($(event.target).parent().next().find('.start_time').text());
				raw_temp_endtime			=	$("[id_row=1]").find(".end_time span").attr('time_value');
				raw_temp_another_starttime	=	$("[id_row=2]").find(".start_time span").attr('time_value');
			
				if(num_temp_endtime   >   num_temp_another_starttime && raw_temp_another_starttime	!= ""	&&	raw_temp_endtime	!= "")
				{
					num_temp_starttime		=		(parseFloat(num_temp_endtime) + 0.1).toFixed(1);
					$("[id_row=2]").find('.start_time span').text(this.time_format(num_temp_starttime));
					$("[id_row=2]").find('.start_time span').attr('time_value',num_temp_starttime)
				}
		
				else if(num_temp_endtime	==	num_temp_another_starttime	&& raw_temp_another_starttime	!= "")
				{
					num_temp_starttime		=	Number($("[id_row=1]").find('.end_time span').attr('time_value'));
					num_temp_starttime		=	Number((parseFloat(num_temp_starttime) + 0.1).toFixed(1));
					$("[id_row=2]").find('.start_time span').text(this.time_format(num_temp_starttime));
					$("[id_row=2]").find('.start_time span').attr('time_value',num_temp_starttime)
				}
				return response;
			}
	
			else		//click on row other than 1 
			{
				raw_temp_endtime			=	$("[id_row='"+temp_id+"']").find('.end_time span').attr('time_value');
				raw_temp_another_endtime	=	$("[id_row='"+(temp_id-1)+"']").find('.end_time span').attr('time_value');
				raw_temp_starttime			=	$("[id_row='"+temp_id+"']").find('.start_time span').attr('time_value');
				raw_temp_another_starttime	=	$("[id_row='"+(Number(temp_id)+1)+"']").find('.start_time span').attr('time_value');
				
				num_temp_endtime			=	Number(raw_temp_endtime);
				num_temp_another_endtime	=	Number(raw_temp_another_endtime);
				num_temp_starttime			=	Number(raw_temp_starttime);
				num_temp_another_starttime	=	Number(raw_temp_another_starttime);
		
				if(num_temp_endtime   >   num_temp_another_starttime	&& raw_temp_another_starttime	!= ""	&&	raw_temp_endtime	!= "")
				{
					num_temp_endtime		=	Number((parseFloat(num_temp_endtime) + 0.1).toFixed(1));
					$("[id_row='"+(Number(temp_id)+1)+"']").find('.start_time span').text(this.time_format(num_temp_endtime));
					$("[id_row='"+(Number(temp_id)+1)+"']").find('.start_time span').attr('time_value',num_temp_endtime)
				}
				else if(num_temp_endtime	==	num_temp_another_starttime	&& raw_temp_another_starttime	!= ""	&&	raw_temp_endtime	!= "")
				{
					num_temp_endtime		=	Number($("[id_row='"+temp_id+"']").find('.end_time span').attr('time_value'));
					num_temp_endtime		=	Number((parseFloat(num_temp_endtime) + 0.1).toFixed(1));
					$("[id_row='"+(Number(temp_id)+1)+"']").find('.start_time span').text(this.time_format(num_temp_endtime));
					$("[id_row='"+(Number(temp_id)+1)+"']").find('.start_time span').attr('time_value',num_temp_endtime)
				}
		
				if(num_temp_starttime	<	num_temp_another_endtime	&& raw_temp_another_endtime	!= ""	&&	raw_temp_starttime	!= "")
				{
					num_temp_another_endtime	=		Number((parseFloat(num_temp_starttime) - 0.1).toFixed(1));
					$("[id_row='"+(temp_id-1)+"']").find('.end_time span').text(this.time_format(num_temp_another_endtime));
					$("[id_row='"+(temp_id-1)+"']").find('.end_time span').attr('time_value',num_temp_another_endtime);
				}
				else if(num_temp_starttime	==	num_temp_another_endtime	&& raw_temp_another_endtime	!= ""	&&	raw_temp_starttime	!= "")
				{
					num_temp_starttime		=	Number($("[id_row='"+temp_id+"']").find('.start_time span').attr('time_value'));
					num_temp_starttime		=	Number((parseFloat(num_temp_starttime) - 0.1).toFixed(1));
					$("[id_row='"+(temp_id-1)+"']").find('.end_time span').text(this.time_format(num_temp_starttime));
					$("[id_row='"+(temp_id-1)+"']").find('.end_time span').attr('time_value',num_temp_starttime);
				}
				return response;
			}
		}
	
		else if(temp_id	==	temp_total_id)	//clicked row and no. of row are same
		{
			if(temp_id	!=	1) //last row is clicked
			{
				raw_temp_starttime	=	$("[id_row='"+temp_id+"']").find('.start_time span').attr('time_value');
				raw_temp_endtime	=	$("[id_row='"+(temp_id-1)+"']").find(".end_time span").attr('time_value');
	
				num_temp_starttime	=	Number(raw_temp_starttime);
				num_temp_endtime	=	Number(raw_temp_endtime);
				raw_temp_time		=	Number($("[id_row='"+temp_id+"']").find('.end_time span').attr('time_value'));
	
	
				if(raw_temp_time	==	"")
				{
					$("[id_row='"+temp_id+"']").find('.end_time span').text(this.time_format(duration));
					$("[id_row='"+temp_id+"']").find('.end_time span').attr('time_value',duration);
				}
	
				if(num_temp_starttime	<	num_temp_endtime	&& raw_temp_endtime	!= ""	&&	raw_temp_starttime	!= "")
				{
					num_temp_endtime	=		Number((parseFloat(num_temp_starttime) - 0.1).toFixed(1));
					$("[id_row='"+(temp_id-1)+"']").find('.end_time span').text(this.time_format(num_temp_endtime));		
					$("[id_row='"+(temp_id-1)+"']").find('.end_time span').attr('time_value',num_temp_endtime);
				}
				else if(num_temp_starttime	==	num_temp_endtime	&& raw_temp_endtime	!= "")
				{
					num_temp_starttime	=	Number($("[id_row='"+temp_id+"']").find('.start_time span').attr('time_value'));
					num_temp_starttime	=	Number((parseFloat(num_temp_starttime) - 0.1).toFixed(1));
					$("[id_row='"+(temp_id-1)+"']").find('.end_time span').text(this.time_format(num_temp_starttime));
					$("[id_row='"+(temp_id-1)+"']").find('.end_time span').attr('time_value',num_temp_starttime);
				}
				return response;
	
			}
			else if(temp_id	==	1)	//first row is clicked
			{
				raw_temp_starttime		=	$("[id_row='"+temp_id+"']").find('.start_time span').attr('time_value');
				raw_temp_endtime		=	$("[id_row='"+temp_id+"']").find(".end_time span").attr('time_value');
				if(raw_temp_endtime	=="")
				{
					$("[id_row='"+temp_id+"']").find('.end_time span').text(this.time_format(duration));
					$("[id_row='"+temp_id+"']").find('.end_time span').attr('time_value',duration);
				}
				if(raw_temp_starttime	==	"")
				{
					$("[id_row='"+temp_id+"']").find('.start_time span').text("0:0");
					$("[id_row='"+temp_id+"']").find('.start_time span').attr('time_value',0)
				}
				return response;
			}
		}
	}
	this.encode_json_data	=	function(string)
	{
		var data_json	=	string;
		data_json		=	data_json.replace(/<div>/g,"\\\\n");
		data_json		=	data_json.replace(/<\/div>/g,"\\\\n");
		data_json		=	data_json.replace(/\\/g,"\\\\");
		data_json		=	data_json.replace(/\"/g,"\\\"");
		return data_json; 
	}
	this.save_topics	=	function()
	{
		var topic	=	{};
		topic['topic_info']	=	[];
		topic['topic_info'][0]	=	{"topic":$('#curate_title').val(),"start_time":0,"end_time":duration};
		var number_of_topics=$(".curationTablebody .curationRow").length; 
		for (i=1;i<=number_of_topics;i++)
		{
	  		var index		=	$(".curationTablebody .curationRow:nth-child("+i+")");
	  		topic['topic_info'][i-1]				=	{};
	  		topic['topic_info'][i-1]["topic"]		=	this.encode_json_data($(index.children().children()[0]).html());
	  		topic['topic_info'][i-1]['start_time']	=	$(index.children().children()[1]).attr('time_value');
	  		topic['topic_info'][i-1]['end_time']	=	$(index.children().children()[2]).attr('time_value');
	     }  
		return JSON.stringify(topic);
	}
	sSegmentInfo	=	function()
	{
		sSegmentInfo.prototype.videoID = 0;		  
		sSegmentInfo.prototype.segmentList = 0;
	} 
	
	this.CreateSegment	=	function(num,videoid,curationPlay)		//num =1 means play segment wise;here playsegments will not call
	{
        var saved_topic;
        if(curationPlay){
            var topicDataRows    =   $('#curation-topic-table tbody tr.readOnlyRow:not(.dummyRow)');
            curationTopicsArr =   [];
            if(topicDataRows.length == 0){
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
            saved_topic         =   JSON.stringify({'topic_info':curationTopicsArr});
            
        }
        else{
            saved_topic			=	this.save_topics();
        }
	  	segmentdetails			=	JSON.parse(saved_topic);
	  	length					=	segmentdetails.topic_info.length;	
	  	var newSegInfo 			=	new sSegmentInfo();
	  	if(videoid)
	  	{
	  		newSegInfo.videoID 	=	videoid;
	  	}
	  	else if(typeof(currentCurationVidId)	!=	'undefined')
	  	{
	  		newSegInfo.videoID	=	currentCurationVidId;	
	  	}
	  	else
	  	{
	  		newSegInfo.videoID	=	vidPlayerObject.videoID;
	  	}
	  	newSegInfo.segmentList	=	[]; 
	  	 
  		if(num	==	0)
		{
			for(i=0;i<length;i++)
			{
				var topicInfo 		= new sVideoSegment();	   
				topicInfo.startTime = segmentdetails.topic_info[i].start_time;
				topicInfo.endTime	=	segmentdetails.topic_info[i].end_time;
				topicInfo.topicText = segmentdetails.topic_info[i].topic; 
				newSegInfo.segmentList.push(topicInfo); 	   
			}
			return Array(newSegInfo,saved_topic);
		}
  		else
		{
			var topicInfo 		= new sVideoSegment();	   
			topicInfo.startTime = segmentdetails.topic_info[num].start_time;
			topicInfo.endTime	=	segmentdetails.topic_info[num].end_time;
			topicInfo.topicText = segmentdetails.topic_info[num].topic; 
			newSegInfo.segmentList.push(topicInfo);
			return Array(newSegInfo,saved_topic);
		}
	}
	
	this.time_format	=	function(seconds)
	{
		if(!seconds)
		{
			var d	=	Number(vidPlayerObject.GetCurrentPTS().toFixed(1));
		}
		else
		{
			var d	=	Number(seconds);
		}
		var h	=	Math.floor(d / 3600);
		var	m	=	Math.floor(d % 3600 / 60);
		var s	=	Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
	}
}
var changeCurationLinksInputLayout  =   function(event){
    var eventTarget =   $(event.target);
    var otherInputContainer =  eventTarget.parent().next('div').find('.other_link_container'); 
    var urlInputContainer =  eventTarget.parent().next('div').find('.link_url_container'); 
    if(eventTarget.val() == "other"){
        otherInputContainer.removeClass('hide');
        urlInputContainer.addClass('other_curate_link_input_url');
    }
    else{
        otherInputContainer.addClass('hide');
        urlInputContainer.removeClass('other_curate_link_input_url');
    }
};