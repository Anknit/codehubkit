/** 
* @namespace _ListWidget_
*/
var _ListWidget_ = _ListWidget_ || {};

/**
 * createList class under _ListWidget_ namespace to implement methods for creating list
 * @class _ListWidget_.createList
 * @param {array} listArr Array to be used for creating list
 */

_ListWidget_.createList = function(listArr){

	/**
	 * @member {array} ListDataArr
	 * @description This member is used to store the list array for class methods
	 * @access private 
	 */	
	var ListDataArr = listArr.documents || [];
	var facetsArr	=	listArr.facets || [];
	var requiredDataArr = [];
	var categoryFilterArr = [];
	var sourceFilterArr = [];
	var ageFilterArr = [];
	var languageFilterArr = [];
	this.ready = true;

	/**
	 * @method
	 * @description This constructor function initialise the list array of the object
	 */

	this.init = function(){
		for(var i=0;i<facetsArr.length;i++){
			var facetName = facetsArr[i]['fieldName'];
			switch (facetName){
			case "category":
				categoryFilterArr = facetsArr[i]['terms'];
				break;
			case "agegroup":
				ageFilterArr = facetsArr[i]['terms'];
				break;
			case "language":
				languageFilterArr = facetsArr[i]['terms'];
				break;
			case "url":
				sourceFilterArr = facetsArr[i]['terms'];
				break;
			default:
				break;
			}
		}
	}();

	this.generateListPageList	=	function(containerSelector){
		var tempHtmlStr = '';
		for(var i=0;i<ListDataArr.length;i++){
			requiredDataArr[i] = [];
			var fieldValues = ListDataArr[i]['snippets'];
			for(var j=0;j<fieldValues.length;j++){
				var name = fieldValues[j].fieldName;
				var value = fieldValues[j].values;
				if(name && value){
					requiredDataArr[i][name] = value[0];
				}
			}
			contentObj[requiredDataArr[i]['id']] = requiredDataArr[i];
			topicArr[requiredDataArr[i]['id']] = requiredDataArr[i]['topicinfo'];
			var Uncurate = false;
			if(JSON.parse(requiredDataArr[i]['topicinfo']).topic_info.length == 0 ){
				Uncurate = true;
			}
			tempHtmlStr += '<div class="row"><div class="col-md-12">';
				tempHtmlStr += '<div class="row list-item-row" data-vidId="'+requiredDataArr[i]["id"]+'" data-vidSource="'+getVideoSourceType(requiredDataArr[i]["url"])+'" data-sourcevidId="'+requiredDataArr[i]["videoid"]+'">';
					tempHtmlStr += '<div class="col-md-3 col-sm-12 tn_col" ><div class="row">';
					if(Uncurate){
						tempHtmlStr += '<div class="col-md-12 overlay-info text-center" data-curate="'+requiredDataArr[i]["curetedby"]+'" data-cat="'+getVideoSourceType(requiredDataArr[i]["url"])+'">';
					}
					else{
						tempHtmlStr += '<div class="col-md-12 overlay-info text-center" data-curate="'+requiredDataArr[i]["curetedby"]+'" data-cat="'+getVideoCategoryName(requiredDataArr[i]["category"])+'">';
					}
							tempHtmlStr += '<img class="list_tn" onload="CheckImgErr(this);" src="'+requiredDataArr[i]["tnurl"].replace('default','mqdefault')+'"/>';
							tempHtmlStr += '<span class="play-icon"></span>';
						tempHtmlStr += '</div></div><div class="row">';
						tempHtmlStr += '<div class="list_credits col-md-12">';
							tempHtmlStr += '<span>'+requiredDataArr[i]["numqa"]+' questions</span>';
							tempHtmlStr += '<span>'+requiredDataArr[i]["numcomments"]+' comments</span>';
						tempHtmlStr += '</div></div>';
					tempHtmlStr += '</div>';
					tempHtmlStr += '<div class="col-md-9 col-sm-12 toggle-container"><div class="row">';
						tempHtmlStr += '<div class="col-md-12 list_title">'+requiredDataArr[i]["string"]+'</div>';
						tempHtmlStr += '</div><div class="row"><div class="col-md-12 content_credits"><small>';
						if(!Uncurate){
							tempHtmlStr += '<span>Curator: '+requiredDataArr[i]['curatorname']+'</span>';
							tempHtmlStr += '<strong>Content Score: <b>'+ListDataArr[i]['score']+'</b></strong>';
							tempHtmlStr += '<span>'+requiredDataArr[i]['pubDate']+' , '+requiredDataArr[i]['numofviews']+' views</span>';
                        }
						tempHtmlStr += '</small></div></div>';
						tempHtmlStr += '<div class="content-data content-toggle row">';
						if(Uncurate){
							tempHtmlStr += '<div class="col-md-12 col-sm-12 content-desccription">';
						}
						else{
							tempHtmlStr += '<div class="col-md-6 col-sm-12 content-desccription">';
						}
								tempHtmlStr += '<p>'+requiredDataArr[i]['description']+'</p>';
							tempHtmlStr += '</div>';
							if(!Uncurate){
								tempHtmlStr += '<div class="col-md-6 col-sm-12 content-topics"><div class="hidden-sm hidden-xs">';
									tempHtmlStr += '<div class="text-left">Topics</div>';
									tempHtmlStr += '<ol class="content-topic-list">';
										var topicArrJson	=	JSON.parse(requiredDataArr[i]['topicinfo'])['topic_info'];
										for(var k=0;k<topicArrJson.length;k++){
											tempHtmlStr += '<li>';
											tempHtmlStr += '<span>'+secondsToTimeStr(topicArrJson[k]['start_time'])+'</span>';
											tempHtmlStr += '<span>'+topicArrJson[k]['topic']+'</span>';
											tempHtmlStr += '</li>';
										}
									tempHtmlStr += '</ol>';
								tempHtmlStr += '</div></div>';
							}
						tempHtmlStr += '</div>';
					tempHtmlStr += '</div>';
					tempHtmlStr += '<div class="col-md-9 col-md-offset-3 col-sm-12 col-sm-offset-0 toggle-button"><div class="media-toggle-link closed">More...</div><div class="media-toggle-link open">Back</div></div>';
				tempHtmlStr += '</div>';
			tempHtmlStr += '</div></div>';
			$(containerSelector).append(tempHtmlStr);
			tempHtmlStr = '';
		}
	};

	this.generateViewPageList	=	function(){
		var tempHtmlStr = '';
		var arrayPresent = false;
		if(requiredDataArr.length > 0){
			arrayPresent = true;
		}		
		for(var i=0;i<ListDataArr.length;i++){
			if(!arrayPresent){
				requiredDataArr[i] = [];
				var fieldValues = ListDataArr[i]['snippets'];
				for(var j=0;j<fieldValues.length;j++){
					var name = fieldValues[j].fieldName;
					var value = fieldValues[j].values;
					if(name && value){
						requiredDataArr[i][name] = value[0];
					}
				}
				contentObj[requiredDataArr[i]['id']] = requiredDataArr[i];
				topicArr[requiredDataArr[i]['id']] = requiredDataArr[i]['topicinfo'];
			}
			var Uncurate = false;
			if(JSON.parse(requiredDataArr[i]['topicinfo']).topic_info.length == 0 ){
				Uncurate = true;
			}
			tempHtmlStr += '<div class="row">';
				tempHtmlStr += '<div class="col-md-12">';
					tempHtmlStr += '<div class="row list-item-row" data-vidId="'+requiredDataArr[i]["id"]+'" data-vidSource="'+getVideoSourceType(requiredDataArr[i]["url"])+'" data-sourcevidId="'+requiredDataArr[i]["videoid"]+'">';
						tempHtmlStr += '<div class="col-md-12">';
							tempHtmlStr += '<div class="row">';
								tempHtmlStr += '<div class="col-md-12 list_title">'+requiredDataArr[i]["string"]+'</div>';
							tempHtmlStr += '</div>';
						tempHtmlStr += '</div>';
						tempHtmlStr += '<div class="col-md-12">';
							tempHtmlStr += '<div class="row">';
								tempHtmlStr += '<div class="col-md-6 col-sm-12" >';
									tempHtmlStr += '<img onload="CheckImgErr(this);" class="tn_suggestion" src="'+requiredDataArr[i]["tnurl"].replace('default','mqdefault')+'"/>';
									tempHtmlStr += '<span class="play-icon"></span>';
								tempHtmlStr += '</div>';
								tempHtmlStr += '<div class="list_credits col-md-6 col-sm-12 ">';
								if(Uncurate){
									tempHtmlStr += '<div class="suggestion_item_credits">';
										tempHtmlStr += '<span><strong>Recommend for curation</strong></span>';
									tempHtmlStr += '</div>';
								}
								else{
									tempHtmlStr += '<div class="suggestion_item_credits">';
										tempHtmlStr += '<span><strong>'+getVideoCategoryName(requiredDataArr[i]['category'])+'</strong></span>';
										tempHtmlStr += '<span>Curator: '+requiredDataArr[i]['curatorname']+'</span>';
										tempHtmlStr += '<span><small>'+requiredDataArr[i]["numofviews"]+' views</small></span>';
/*
										tempHtmlStr += '<span><small>'+requiredDataArr[i]["numqa"]+' questions & answers</small></span>';
*/
									tempHtmlStr += '</div>';
								}
								tempHtmlStr += '</div>';
							tempHtmlStr += '</div>';
						tempHtmlStr += '</div>';
					tempHtmlStr += '</div>';
				tempHtmlStr += '</div>';
			tempHtmlStr += '</div>';
		}
		return tempHtmlStr;
	};
	
	this.generateYoutubeList	=	function(containerSelector){
		var tempHtmlStr = '';
		for(var i=0;i<ListDataArr.length;i++){
			requiredDataArr[i] = [];
			var fieldValues = ListDataArr[i]['snippets'];
			for(var j=0;j<fieldValues.length;j++){
				var name = fieldValues[j].fieldName;
				var value = fieldValues[j].values;
				if(name && value){
					requiredDataArr[i][name] = value[0];
				}
			}
			tempHtmlStr += '<div class="row"><div class="col-md-12">';
				tempHtmlStr += '<div class="row list-item-row" data-sourcevidId="'+requiredDataArr[i]["videoid"]+'"><div class="col-md-12"><div class="row">';
					tempHtmlStr += '<div class="col-md-3 col-sm-12 tn_col" ><div class="row">';
						tempHtmlStr += '<div class="col-md-12 overlay-info text-center">';
							tempHtmlStr += '<img onload="CheckImgErr(this);" class="list_tn" src="'+requiredDataArr[i]["tnurl"].replace('default','mqdefault')+'"/>';
							tempHtmlStr += '<span class="play-icon"></span>';
						tempHtmlStr += '</div></div><div class="row">';
						tempHtmlStr += '<div class="list_credits col-md-12">';
						tempHtmlStr += '</div></div>';
					tempHtmlStr += '</div>';
					tempHtmlStr += '<div class="col-md-9 col-sm-12 toggle-container"><div class="row">';
						tempHtmlStr += '<div class="col-md-12 list_title">'+requiredDataArr[i]["string"]+'</div>';
						tempHtmlStr += '</div><div class="row"><div class="col-md-12 content_credits"><small>';
/*							tempHtmlStr += '<span>Shared by '+requiredDataArr[i]['uploadedby']+'</span>';
							tempHtmlStr += '<span>'+requiredDataArr[i]['pubDate']+' , '+requiredDataArr[i]['numofviews']+' views</span>';
*/						tempHtmlStr += '</small></div></div>';
						tempHtmlStr += '<div class="content-data content-toggle row">';
							tempHtmlStr += '<div class="col-md-12 col-sm-12 content-desccription">';
								tempHtmlStr += '<p>'+requiredDataArr[i]['description']+'</p>';
							tempHtmlStr += '</div>';
						tempHtmlStr += '</div>';
					tempHtmlStr += '</div></div><div class="row">';
					tempHtmlStr += '<div class="col-md-3 col-sm-12 text-center toggle-button"><div class="media-toggle-link watch pull-left">Watch</div><div class="media-toggle-link curate" style="float:none;">Curate</div><div class="media-toggle-link saveToCurationList pull-right">Save</div></div>';
					tempHtmlStr += '<div class="col-md-9 col-sm-12 text-right pull-right" style="padding-top:2px"><span title="Views Count" style="margin-right:10px"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;'+parseInt(requiredDataArr[i]['ytViews']).toLocaleString()+'&nbsp;</span><span><span title="Likes Count"  style="margin-right:10px" class="text-success"><span class="glyphicon glyphicon-thumbs-up"></span>&nbsp;'+parseInt(requiredDataArr[i]['ytLikes']).toLocaleString()+'&nbsp;</span><span title="Dislikes Count" class="text-danger"><span class="glyphicon glyphicon-thumbs-down"></span>&nbsp;'+parseInt(requiredDataArr[i]['ytDislikes']).toLocaleString()+'</span></span></div>';
				tempHtmlStr += '</div></div>';
			tempHtmlStr += '</div></div>';
			$(containerSelector).append(tempHtmlStr);
			tempHtmlStr = '';
		}
	};
	
	this.createCategoryFilter	=	function(){
		var catfilteritem=$('#cat-filter-container .catfilteritem.dummyEntry');
		$('#cat-filter-container .catfilteritem').not('.dummyEntry').remove();
        var catFilterKeyMappedObj   =   {};
		for(var i=0;i<categoryFilterArr.length;i++){
            if(mainCatArray.indexOf(categoryFilterArr[i]['term']) == -1 && !data.listFilter.category && !data.searchFlag){
                if(mainCatArray.indexOf(parentCatObj[categoryFilterArr[i]['term']]) == -1 ){
                    var tempCatParent   =   parentCatObj[categoryFilterArr[i]['term']];
                    if(IsValueNull(catFilterKeyMappedObj[parentCatObj[tempCatParent]])){
                        catFilterKeyMappedObj[parentCatObj[tempCatParent]]   =   0;
                    }
                    catFilterKeyMappedObj[parentCatObj[tempCatParent]]   += categoryFilterArr[i]['count'];
                }
                else{
                    if(IsValueNull(catFilterKeyMappedObj[parentCatObj[categoryFilterArr[i]['term']]])){
                        catFilterKeyMappedObj[parentCatObj[categoryFilterArr[i]['term']]]   =   0;
                    }
                    catFilterKeyMappedObj[parentCatObj[categoryFilterArr[i]['term']]]   += categoryFilterArr[i]['count'];
                }
            }
            else{
                if(IsValueNull(catFilterKeyMappedObj[categoryFilterArr[i]['term']])){
                    catFilterKeyMappedObj[categoryFilterArr[i]['term']] =   0;
                }
                catFilterKeyMappedObj[categoryFilterArr[i]['term']]   += categoryFilterArr[i]['count'];
            }
        }
        for(var key in catFilterKeyMappedObj){
            if(catFilterKeyMappedObj[key]>0){
                var newCat = catfilteritem.clone();
                newCat.removeClass('dummyEntry').attr('data-catfilter',key);
                var targetId = newCat.find('.maincat').attr('href');
                newCat.find('.maincat').attr('href',targetId + key);
                newCat.find(targetId).attr('id',targetId + key);
                newCat.find('.maincat').html(getVideoCategoryName(key) + '<span class="badge">'+catFilterKeyMappedObj[key]+'</span>');
                newCat.find('.collapse').removeClass('collapse').removeClass('in').addClass('collapse');
                $('#cat-filter-container').append(newCat);
            }
        }   
//		$(".collapse").collapse({toggle:false});
	};
	
	this.createSourceFilter	=	function(){
		
	};
	
	this.createGeneralFilter	=	function(){
		
	};
    
    this.generateBookmarksList  =   function(containerSelector){
        var itemRow   =   '';
        var topicsStr   =   '';
        var topicsJson;
        $(containerSelector).find('.list-item-row:not(.dummyRow)').remove();
        var itemrowDummy =    $(containerSelector).find('.dummyRow');
        for(var key in ListDataArr){
            itemRow     =   itemrowDummy.clone(true);
            itemRow.removeClass('dummyRow');
            itemRow.attr({'data-bookmark-id':ListDataArr[key]['bookmarkid'],'data-vidid':ListDataArr[key]['videoid']});
            itemRow.find('.bookmark-title').html(ListDataArr[key]['title']);
            itemRow.find('.bookmark-item-ptr').html(ListDataArr[key]['metadata']);
            itemRow.find('.bookmark-item-date').html(ListDataArr[key]['modifieddate']);
            itemRow.find('.bookmark-item-image').attr('src','https://i.ytimg.com/vi/'+ListDataArr[key]['sourcevideoid']+'/mqdefault.jpg');
            topicsJson  =   JSON.parse(ListDataArr[key]['topicinfo'])['topic_info'];
            for(var key1 in topicsJson){
                topicsStr   +=  '<li>';
                topicsStr   +=      '<span class=""bookmark-Start-Time>'+secondsToTimeStr(topicsJson[key1]['start_time'])+'</span>';
                topicsStr   +=      '<span class=""bookmark-Topic-Text>'+topicsJson[key1]['topic']+'</span>';
                topicsStr   +=  '</li>';
            }
            itemRow.find('.bookmark-item-topics').html(topicsStr);
            topicsStr   =   '';
            $(containerSelector).append(itemRow);
        }
    };
};