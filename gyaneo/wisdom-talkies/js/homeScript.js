var topicClass  =   {} || topicClass;

var endTimeInterval;
var currentVideoInterval;
topicClass.handler  =   function(){
    this.addTopicInputRow =   function(event,position,tableId){
        var topicsTableBody  =   $('#'+tableId+' tbody');
        if(topicsTableBody.find('tr.inputRow').length > 1){
            UI_alert('Please complete this topic first');
            return false;
        }
        var topicInputRow   =   topicsTableBody.find('tr.inputRow.dummyRow').clone(true);
        if (position == "top") {
            if(tableId == 'video-bookmark-table'){
                topicInputRow.appendTo(topicsTableBody).css('display','table-row');
            }
            else{
                topicInputRow.prependTo(topicsTableBody).css('display','table-row');
            }
        }
        else{
            var targetRowInitiator   =   $(event.target).closest('tr');
            topicInputRow.insertAfter(targetRowInitiator).css('display','table-row');
        }
        topicInputRow.find('textarea').focus();
        if(topicInputRow.find('.current-video-time .topic-start').length){
            this.setCurrentVideoTime(topicInputRow);
        }
        if(topicInputRow.nextAll('tr.readOnlyRow:not(.dummyRow)').length > 0){
            var nextTopicStart  =   parseFloat(topicInputRow.nextAll('tr.readOnlyRow:not(.dummyRow)').eq(0).find('.topic-start').attr('data-time-val'));
            topicInputRow.find('input.topic-end-time').val(nextTopicStart-0.1);
        }
        else{
            if(!IsValueNull(vidPlayerObject.playerHandle.getDuration())){
                topicInputRow.find('input.topic-end-time').val(parseFloat(vidPlayerObject.playerHandle.getDuration()).toFixed(1));
            }
            else{
                endTimeInterval = setInterval(function(){
                    if(vidPlayerObject.playerHandle.getDuration() > 0){
                        clearInterval(endTimeInterval);
                    }
                    topicInputRow.find('input.topic-end-time').val(parseFloat(vidPlayerObject.playerHandle.getDuration()).toFixed(1));
                },500);
            }
        }
    };
    this.setCurrentVideoTime    =   function(topicInputRow){
        if(!topicInputRow){
            clearInterval(currentVideoInterval);
            return true;
        }
        var currentVideoTime    =   parseFloat(vidPlayerObject.playerHandle.getCurrentTime()).toFixed(1) || 0;
        topicInputRow.find('input.topic-start-time').val(currentVideoTime);
        topicInputRow.find('.current-video-time .topic-start').text(secondsToTimeStr(currentVideoTime));
        currentVideoInterval    =   setTimeout(function(){topicClassObject    =   topicClassObject || new topicClass.handler(); topicClassObject.setCurrentVideoTime(topicInputRow);},500);
    };
    this.editTopicsRow    =   function(event,currentTopicRow,tableId){
        var topicsTableBody  =   $('#'+tableId+' tbody');
        if(topicsTableBody.find('tr.inputRow').length > 1){
            UI_alert('Please complete this topic first');
            return false;
        }
        currentTopicRow.addClass('edit-state-disabled');
        var topicInputRow   =   topicsTableBody.find('tr.inputRow.dummyRow').clone(true);
        topicInputRow.removeClass('dummyRow').addClass('topic-edit-row').find('textarea','input').each(function(){
            this.value  =   '';
        });
        topicInputRow.insertAfter(currentTopicRow).css('display','table-row');
        topicInputRow.find('.topic-text-input').val(currentTopicRow.find('.topic-text').attr('data-topic-val')).focus();
        topicInputRow.find('.topic-start-time').val(currentTopicRow.find('.topic-start').attr('data-time-val'));
        topicInputRow.find('.topic-end-time').val(currentTopicRow.find('.topic-end').attr('data-time-val'));
        if(topicInputRow.find('.current-video-time .topic-start').length){
            this.setCurrentVideoTime(topicInputRow);
        }
    };
    this.saveTopicsRow    =   function(event,topicRow,tableId){
        var topicsTableBody  =   $('#'+tableId+' tbody');
        var newTopicRow;
        var validateInput   =    this.validateTopicRowData(event,topicRow,topicsTableBody);
        if(validateInput.status){
            if(topicRow.hasClass('topic-edit-row')){
                newTopicRow      =   topicRow.prev('.readOnlyRow');
                newTopicRow.removeClass('edit-state-disabled');
            }
            else{
                newTopicRow      =   topicsTableBody.find('tr.readOnlyRow.dummyRow').clone(true);
                newTopicRow.removeClass('dummyRow');
            }
            newTopicRow.find('.topic-text').attr('data-topic-val',topicRow.find('.topic-text-input').val()).text(topicRow.find('.topic-text-input').val());
            newTopicRow.find('.topic-start').attr('data-time-val',topicRow.find('.topic-start-time').val()).text(secondsToTimeStr(topicRow.find('.topic-start-time').val()));
            newTopicRow.find('.topic-end').attr('data-time-val',topicRow.find('.topic-end-time').val()).text(secondsToTimeStr(topicRow.find('.topic-end-time').val()));
            newTopicRow.insertBefore(topicRow);
            topicRow.remove();
        }
        else{
            this.showTopicError(validateInput);
        }
    };
    this.validateTopicRowData  =   function(event,dataRowObj,tableBody){
        var returnObj   =   {'status':true};
        var topicText   =   dataRowObj.find('.topic-text-input').val().trim(); 
        var startTime   =   parseFloat(dataRowObj.find('.topic-start-time').val().trim()); 
        var endTime     =   parseFloat(dataRowObj.find('.topic-end-time').val().trim());
        
        var prevTopicRow =   dataRowObj.prevAll('.readOnlyRow:not(.edit-state-disabled)').eq(0);
        var nextTopicRow =   dataRowObj.nextAll('.readOnlyRow:not(.edit-state-disabled)').eq(0);
        
        var prevTopicEnd     =   startTime-0.1;
        var nextTopicStart   =   endTime+0.1;
        
        if(prevTopicRow.length > 0){
            prevTopicEnd   =   parseFloat(prevTopicRow.find('.topic-end').attr('data-time-val'));
        }
        if(nextTopicRow.length > 0){
            nextTopicStart   =   parseFloat(nextTopicRow.find('.topic-start').attr('data-time-val'));
        }

        if(IsValueNull(topicText)){
            returnObj.status        =   false;
            returnObj.errorCode     =   1;
            return returnObj;
        }
        if((IsValueNull(startTime) && startTime != 0) || isNaN(startTime)){
            returnObj.status    =   false;
            returnObj.errorCode     =   2;
            return returnObj;
        }
        if((IsValueNull(endTime) && endTime != 0) || isNaN(endTime)){
            returnObj.status    =   false;
            returnObj.errorCode     =   3;
            return returnObj;
        }
        if(startTime >= endTime){
            returnObj.status    =   false;
            returnObj.errorCode     =   4;
            return returnObj;
        }
        if(startTime <= prevTopicEnd){
            if(startTime-0.1 <= parseFloat(prevTopicRow.find('.topic-start').attr('data-time-val'))){
                returnObj.status    =   false;
                returnObj.errorCode     =   5;
                return returnObj;
            }
            else{
                prevTopicRow.find('.topic-end').attr('data-time-val',parseFloat(startTime)-0.1).text(secondsToTimeStr(startTime-0.1));
            }
    /*
            returnObj.status    =   false;
            returnObj.errorCode     =   5;
            return returnObj;
    */
        }
        if(endTime >= nextTopicStart){
    //        nextTopicRow.find('.topic-start').html(parseFloat(endTime)+0.1);
            returnObj.status    =   false;
            returnObj.errorCode     =   6;
            return returnObj;
        }
        if(endTime > parseFloat(vidPlayerObject.playerHandle.getDuration()).toFixed(1)){
            returnObj.status    =   false;
            returnObj.errorCode     =   7;
            return returnObj;
        }
        if(startTime < 0){
            returnObj.status    =   false;
            returnObj.errorCode     =   8;
            return returnObj;
        }
        else{
            return returnObj;
        }
    };
    this.showTopicError  =   function(errorObj){
        switch (errorObj.errorCode){
            case 1:
                UI_alert('Topic name cannot be left empty');
                break;
            case 2:
                UI_alert('Topic start time cannot be left empty');
                break;
            case 3:
                UI_alert('Topic end time cannot be left empty');
                break;
            case 4:
                UI_alert('Topic start time cannot be greater than topic end time');
                break;
            case 5:
                UI_alert('Topic start time must be greater than the previous topic start time');
                break;
            case 6:
                UI_alert('Topic end time must be less than the next topic start time');
                break;
            case 7:
                UI_alert('Topic end time must be less than the actual video duration');
                break;
            case 8:
                UI_alert('Topic start time cannot be less than 0');
                break;
        }
    };
    this.renderTopics   =   function(tableId,topicsJson){
        var topicsTableBody   =   $('#'+tableId+' tbody');
        topicsTableBody.find('tr.inputRow:not(.dummyRow),tr.readOnlyRow:not(.dummyRow)').remove();
        var readDataRow         =   topicsTableBody.find('tr.readOnlyRow.dummyRow');
        var insertedRow;
        for(var key in topicsJson){
            insertedRow =   readDataRow.clone(true);
            insertedRow.removeClass('dummyRow');
            insertedRow.find('.topic-text').text(topicsJson[key]['topic']).attr('data-topic-val',topicsJson[key]['topic']);
            insertedRow.find('.topic-start').text(secondsToTimeStr(topicsJson[key]['start_time'])).attr('data-time-val',topicsJson[key]['start_time']);
            insertedRow.find('.topic-end').text(secondsToTimeStr(topicsJson[key]['end_time'])).attr('data-time-val',topicsJson[key]['end_time']);
            topicsTableBody.append(insertedRow);
        }
    };
    this.bindShiftTimeInput  =   function(event){
        var targetShiftIcon =   $(event.currentTarget);
        var inputBox    =   targetShiftIcon.closest('td').find('.topics-time-input');
        if(targetShiftIcon.hasClass('left-shift')){
            inputBox.val(parseFloat(inputBox.val())-0.250);
        }
        else{
            inputBox.val(parseFloat(inputBox.val())+0.250);
        }
    };
    this.bindcurrentPTSTimeInput =   function(event){
        $(event.currentTarget).closest('td').find('.topics-time-input').val((vidPlayerObject.GetCurrentPTS()).toFixed(1));
    };
};
var topicClassObject = null;
var addNewTopicRow =   function(event){
    topicClassObject = topicClassObject || new topicClass.handler();
    var eventTarget  =   $(event.currentTarget);
    var position    =   '';
    var currentTopicsTable  =   eventTarget.closest('table').attr('id');
    if(!eventTarget.hasClass('topic-row')){
        position    =   'top';
    }
    topicClassObject.addTopicInputRow(event,position,currentTopicsTable);
};
var cancelTopicAdd   =   function(event){
    topicClassObject = topicClassObject || new topicClass.handler();
    var eventTarget =   $(event.currentTarget);
    var currentTopicRow  =   eventTarget.closest('.inputRow');
    if(currentTopicRow.hasClass('topic-edit-row')){
        currentTopicRow.prev('.edit-state-disabled').removeClass('edit-state-disabled');
    }
    currentTopicRow.remove();
};
var saveTopicRow    =   function (event){
    topicClassObject = topicClassObject || new topicClass.handler();
    var eventTarget =   $(event.currentTarget);
    var currentTopicRow  =   eventTarget.closest('.inputRow');
    var currentTopicsTable  =   eventTarget.closest('table').attr('id');
    topicClassObject.saveTopicsRow(event,currentTopicRow,currentTopicsTable);
};
var editTopicRow    =   function(event){
    topicClassObject = topicClassObject || new topicClass.handler();
    var eventTarget =   $(event.currentTarget);
    var currentTopicRow  =   eventTarget.closest('tr.readOnlyRow');
    var currentTopicsTable  =   eventTarget.closest('table').attr('id');
    topicClassObject.editTopicsRow(event,currentTopicRow,currentTopicsTable);
};
var removeTopicRow    =   function(event){
    var eventTarget =   $(event.currentTarget).closest('.readOnlyRow');
    if(eventTarget.nextAll('.readOnlyRow:not(.dummyRow)').length > 0){
        var nextRowStartTime =   eventTarget.nextAll('.readOnlyRow:not(.dummyRow)').eq(0).find('.topic-start').attr('data-time-val');
        eventTarget.prevAll('.readOnlyRow:not(.dummyRow)').eq(0).find('.topic-end').attr('data-time-val',nextRowStartTime-0.1).text(secondsToTimeStr(nextRowStartTime-0.1));
    }
    else{
        var videoDuration   =   parseFloat(vidPlayerObject.playerHandle.getDuration()).toFixed(1);
        eventTarget.prevAll('.readOnlyRow:not(.dummyRow)').eq(0).find('.topic-end').attr('data-time-val',videoDuration).text(secondsToTimeStr(videoDuration));
    }
    eventTarget.remove();
};
var bindShiftTimeInput = function(event){
    topicClassObject = topicClassObject || new topicClass.handler();
    topicClassObject.bindShiftTimeInput(event);
};
var bindcurrentPTSTimeInput =   function(event){
    topicClassObject = topicClassObject || new topicClass.handler();
    topicClassObject.bindcurrentPTSTimeInput(event);
};var mainApp =   mainApp || {};

mainApp.historyModule   =   function(){
    this.parseCurrentUrl   =     function(){
        var urlSearchString =   document.location.href.replace(document.baseURI,'');
        var urlParamArr =   {};
        var paramKey,paramValue;
        if(urlSearchString.indexOf('/') != -1){
            var urlParams   =   urlSearchString.split('/');
            urlSearchString =   urlParams[urlParams.length-1];
            var urlParams   =   urlSearchString.split(/[&?]+/);
            for(var i=0;i<urlParams.length;i++){
                if(urlParams[i].indexOf('=') != -1){
                    paramKey    =   urlParams[i].split('=')[0];
                    paramValue    =   urlParams[i].split('=')[1];
                    urlParamArr[paramKey]   =   decodeURIComponent(paramValue);
                }
            }
        }
        return urlParamArr;
    };
    this.addPopStateListener	=	function(){
        window.addEventListener('popstate', function(event){
            mainAppVars.popstate	=	true;
            this.updateContent(event.state);
        });
    };
    this.updateContent   =   function(histState){
        if (histState == null){
            return;
        }
    };
};
var mainApp =   mainApp || {};

mainApp.searchModule    =   function(){
    
    this.searchKeyword          =   function(){
        mainAppVars.searchOssOnly   =   false;
        mainAppVars.searchExtOnly   =   false;
        this.searchObject   =   {getData:'list',search:mainAppVars.searchInputText};
        if(mainAppVars.searchCategory && !IsValueNull(mainAppVars.searchCategory)){
            this.searchObject['catfilter']  =   mainAppVars.searchCategory;
        }
        if(mainAppVars.searchAge){
            mainAppVars.searchOssOnly   =   true;
            this.searchObject['agefilter']  =   mainAppVars.searchAge;
        }
        if(mainAppVars.searchLanguage){
            mainAppVars.searchOssOnly   =   true;
            this.searchObject['langfilter']  =   mainAppVars.searchLanguage;
        }
        if(mainAppVars.searchStart){
            this.searchObject['start']  =   mainAppVars.searchStart;
        }
        if(mainAppVars.currentVideoId != ""){
            this.searchObject['videoid']  =   mainAppVars.videoSourceId;
        }
        if(mainAppVars.nochildfilter){
            this.searchObject['filter']  =   'strict';
        }
        if(contributeFlag){
            mainAppVars.searchExtOnly   =   true;
            this.searchKeywordExt();
        }
        else{
            this.searchKeywordOSS();
            if(mainAppVars.listEXT.length == 0){
                this.searchKeywordExt();
            }
        }
    };  
    this.searchCategory         =   function(){
        mainAppVars.searchOssOnly   =   true;
        mainAppVars.listEXT =   [];
        this.searchObject   =   {getData:'list',category:mainAppVars.searchCategory};
        if(mainAppVars.searchAge){
            this.searchObject['agefilter']  =   mainAppVars.searchAge;
        }
        if(mainAppVars.nochildfilter){
            this.searchObject['catfilter']  =   'other';
        }
        if(mainAppVars.searchLanguage){
            this.searchObject['langfilter']  =   mainAppVars.searchLanguage;
        }
        if(mainAppVars.searchStart){
            this.searchObject['start']  =   mainAppVars.searchStart;
        }
        if(mainAppVars.currentVideoId != ""){
            this.searchObject['videoid']  =   mainAppVars.videoSourceId;
        }
    	var xhrObj = new CommonUtils.remoteCallClass();
        var dataObj =   this.searchObject;
        dataObj	['server']	=	'opensearch';
        xhrObj.requestData	=	{'request':'search_data','data':dataObj};
        xhrObj.asyncGetRequest("./"+dataRequestURL,this.ListRequestCallback);
        UI_blockInterface();
    };
    this.getCurrentVideoData    =   function(){
        if(mainAppVars.currentVideoId){
            var xhrObj  = new CommonUtils.remoteCallClass();
            var dataObj =   {videoid:mainAppVars.currentVideoId};
            dataObj	['server']	=	'opensearch';
            if(mainAppVars.currentVideoId.indexOf('yt-') == 0){
                dataObj	['server']	=	'youtube';
            }
            xhrObj.requestData	=	{'request':'getVideoData','data':dataObj};
            xhrObj.asyncGetRequest("./"+dataRequestURL,this.ListRequestCallback);
            UI_blockInterface();
        }
    };
    this.searchKeywordOSS       =   function(){
    	var xhrObj = new CommonUtils.remoteCallClass();
        var dataObj =   this.searchObject;
        dataObj	['server']	=	'opensearch';
        xhrObj.requestData	=	{'request':'search_data','data':dataObj};
        xhrObj.asyncGetRequest("./"+dataRequestURL,this.ListRequestCallback);
        UI_blockInterface();

    };
    this.searchKeywordExt       =   function(){
        var cat_name	=	"";
        if(!IsValueNull($('#searchBoxCat > button').attr('catfilter')) && $('#searchBoxCat > button').attr('catfilter') != "0"){
            mainAppVars.searchCategory   = $('#searchBoxCat > button').attr('catfilter');
            cat_name		=	mainAppVars.catNameObject[mainAppVars.searchCategory];
        }
        if(IsValueNull($('#head').scope().is_learn_selected)){
            var xhrObj 			=	new CommonUtils.remoteCallClass();
            xhrObj.requestData	=	{'request':'search_data','data':{'server':'youtube','getData':'list','rows':50,'search':(cat_name+" "+mainAppVars.searchInputText).trim()}};
            xhrObj.asyncGetRequest("./"+dataRequestURL,this.KeywordYoutubeCallback);
        }
        else{
            mainAppVars.learningKeywordCount = 0;
            mainAppVars.tempYoutubeDataArr  =   [];
            for(i=0; i<mainAppVars.learn_keywords.length; i++){
                var xhrObj 			=	new CommonUtils.remoteCallClass();
                xhrObj.requestData	=	{'request':'search_data','data':{'server':'youtube','getData':'list','rows':10,'search':(mainAppVars.learn_keywords[i]+" "+mainAppVars.searchInputText+" "+cat_name).trim()}};
                xhrObj.asyncGetRequest("./"+dataRequestURL,this.KeywordYoutubeCallback);
            }
        }
    };
    this.searchAutoComplete     =   function(){
        this.searchObject   =   {getData:'autocomplete',search:mainAppVars.searchInputText};
        var dataObj	=	this.searchObject;
        if(!contributeFlag){
            dataObj['server']   =   'opensearch';
        }
        else{
            dataObj['server']   =   'youtube';
        }
        var xhrObj  = new CommonUtils.remoteCallClass();
        xhrObj.requestData	=	{'request':'search_data','data':dataObj};
        xhrObj.asyncPostRequest('./'+dataRequestURL,this.autoCompleteRequestCallback);
    };
    this.autoCompleteRequestCallback	=	function(response){
        response    =   JSON.parse(response);
        var validateResponseCheck   =   validateAppResponse(response);
        var dataList    =   $('#searchData');
        if(validateResponseCheck){
            var searchJson    =   response.data;
            if(IsValueNull(searchJson))
                return false;
            if(!searchJson['terms']){
                dataList.html('');
                return false;
            }
            for(var i=0;i<searchJson['terms'].length;i++){
                if(dataList.find('option').length <= i){
                    dataList.append('<option></option>');
                }
                dataList.find('option').eq(i).html(searchJson['terms'][i]);
            }
            dataList.find('option:gt('+(i-1)+')').remove();
        }
        else{
            console.log(response);
        }
    };
    this.ListRequestCallback	=	function(response){
        progressChange(70);
        response = JSON.parse(response);
        var validateResponseCheck   =   validateAppResponse(response);
        if(validateResponseCheck){
            response    =   response.data;
            /*
             * testing for removing data whose category is not same as the category of first data
             */
/*
            if(typeof(response.documents)	!=	"undefined")
            {
                var temp_check	=	false;
                var parent_cat	=	false;
                for(i=0;	i<response.documents.length;	i++)
                {
                    if(!temp_check)
                    {
                        if(response.documents[i]['snippets'][2]['fieldName']	!=	"category")
                        {
                            response.documents.splice(i,1);
                            response.numFound--;
                            i--;
                        }
                        else
                        {
                            parent_cat	=	parentCatObj[response.documents[i]['snippets'][2]['values'][0]]
                            if(typeof(parent_cat)	==	"undefined")
                            {
                                parent_cat	=	response.documents[i]['snippets'][2]['values'][0];
                            }
                            temp_check	=	true;
                        }
                    }
                    else
                    {
                        if(response.documents[i]['snippets'][2]['fieldName']	!=	"category"	||	(parentCatObj[response.documents[i]['snippets'][2]['values'][0]]	!=	parent_cat	&&	typeof(parentCatObj[response.documents[i]['snippets'][2]['values'][0]])	!=	"undefined")	||	(typeof(parentCatObj[response.documents[i]['snippets'][2]['values'][0]])	==	"undefined"	&&	response.documents[i]['snippets'][2]['values'][0]	!=	parent_cat))
                        {
                            response.documents.splice(i,1);
                            response.numFound--;
                            i--;        			
                        }	
                    }
                }
            }
*/
            var listClassObject =   new mainApp.listModule();
            listClassObject.createListOSS(response);
        }
        else{
            console.log(response);
        }
    };
    this.KeywordYoutubeCallback	=	function(response){
        response 					= JSON.parse(response);
        var validateResponseCheck   =   validateAppResponse(response);
        if(validateResponseCheck	&&	IsValueNull($('#head').scope().is_learn_selected)){
            mainAppVars.tempYoutubeDataArr	=	response.data;
            var listClassObject =   new mainApp.listModule();
            listClassObject.createListExt(mainAppVars.tempYoutubeDataArr);
            mainAppVars.learningKeywordCount = 0;
            mainAppVars.tempYoutubeDataArr = [];
        }
        else if(validateResponseCheck	&&	!IsValueNull($('#head').scope().is_learn_selected))
        {
            if(IsValueNull(mainAppVars.tempYoutubeDataArr.documents)){
                mainAppVars.tempYoutubeDataArr = response.data;
            }
            else{
                mainAppVars.tempYoutubeDataArr.documents 		=	mainAppVars.tempYoutubeDataArr.documents.concat(response.data.documents);
                mainAppVars.tempYoutubeDataArr.videoIdListStr	+=	','+response.data.videoIdListStr;
            }
            
            mainAppVars.learningKeywordCount++;
            if(mainAppVars.learningKeywordCount == 3){
                var temp_docs								=	mainAppVars.tempYoutubeDataArr['documents'];
                var temp_docs_length						=	temp_docs.length;
                var temp_data   =   [];
                if(!IsValueNull(mainAppVars.tempYoutubeDataArr['videoIdListStr'])){
                    temp_data								=	distinctVal(mainAppVars.tempYoutubeDataArr['videoIdListStr'].split(","));
                }
                mainAppVars.tempYoutubeDataArr['videoIdListStr']	    =	temp_data.toString();
                var temp_data_length						=	temp_data.length;
                var temp_checking							=	[];

                if(temp_data_length	!=	temp_docs_length){
                    for(i=0; i<temp_docs_length; i++){
                        if($.inArray(temp_docs[i]['snippets'][7]['values'][0],temp_checking) === -1){
                            temp_checking.push(temp_docs[i]['snippets'][7]['values'][0]);
                        }
                        else{
                            mainAppVars.tempYoutubeDataArr['documents'].splice(i,1);
                            i--;
                            temp_docs_length--;
                        }
                    }
                }
                mainAppVars.tempYoutubeDataArr.numFound =   temp_data_length;
                var listClassObject =   new mainApp.listModule();
                listClassObject.createListExt(mainAppVars.tempYoutubeDataArr);
                mainAppVars.learningKeywordCount = 0;
                mainAppVars.tempYoutubeDataArr = [];
            }
        }
        else{
            console.log(response);
        }
    };
};
var setSearchCategory	=	function(event){
	var catId	=	$(event.target).closest('li').attr('data-catid');
	data.searchCategory	=	0;
	if(catId){
		data.searchCategory	=	catId;
	}
	$('#searchBoxCat button').attr('catfilter',data.searchCategory).html($(event.target).closest('li').text()+"<span class='caret'></span>");
	event.preventDefault();
};
var autocompleteTimeout =   '';
var getKeywordMatch	=	function(event){
    var eventTarget =   $(event.currentTarget);
    if(event.keyCode<41 && event.keyCode>37){
        return true;
    }
    else if(eventTarget.hasClass('input-group-addon') || event.keyCode == 13){
        mainAppVars.searchInputText =   encodeURIComponent($('#headsearchinput').val().trim()); 
        mainAppVars.searchStart =   0;
        mainAppVars.searchAge =   false;
        mainAppVars.searchLanguage =   false;
        mainAppVars.searchCategory   = false;
        if(!IsValueNull($('#searchBoxCat > button').attr('catfilter'))){
           mainAppVars.searchCategory   = $('#searchBoxCat > button').attr('catfilter');
        }
    }
    else{
        mainAppVars.searchInputText =   encodeURIComponent($('#headsearchinput').val().trim());
    }

    if(mainAppVars.searchInputText == ""){
        $('#searchData').html('');
        return false;
    }
    else{
        if(event.type == "keyup" && event.keyCode != 13){
            if(!IsValueNull(autocompleteTimeout)){
                clearTimeout(autocompleteTimeout);
            }
            autocompleteTimeout =   setTimeout(function(){
                var searchObject    =   new mainApp.searchModule();
                searchObject.searchAutoComplete();
            },200);
        }
        else{
            mainAppVars.listEXT = [];
            $('#headsearchinput').blur();
            $('#headsearch').scope().setSearchView();
        }
    }
};
var mainApp =   mainApp || {};

mainApp.listModule  =   function(){
	this.formatListData	=	function(ListDataArr){
		var tempHtmlStr = '';
        var formatListData =   {};
        var requiredDataArr =   [];
		for(var i=0;i<ListDataArr.length;i++){
			requiredDataArr[i] = [];
			var fieldValues = ListDataArr[i]['snippets'];
            requiredDataArr[i]['contentScore']  =   ListDataArr[i]['score'];
			for(var j=0;j<fieldValues.length;j++){
				var name = fieldValues[j].fieldName;
				var value = fieldValues[j].values;
				if(name && value){
                    if(name == 'topicinfo'){
                        requiredDataArr[i][name] = angular.fromJson(value[0])['topic_info'];
                    }
                    else{
                        requiredDataArr[i][name] = value[0];
                    }
				}
			}
            formatListData['wt-'+(requiredDataArr[i]['id'])] = requiredDataArr[i];
		}
        return formatListData;
	};
    this.createList     =   function(){
        var rootScopeVar            =   angular.element($('body')).scope();
            rootScopeVar.listLimitStart    =   0;
            if(mainAppVars.searchOssOnly){
                rootScopeVar.contentList   =  mainAppVars.listOSS;
            }
            else if(mainAppVars.searchExtOnly){
                rootScopeVar.contentList   =  mainAppVars.listEXT;
            }
            else{
                if(typeof (mainAppVars.listOSS.numFound) == "undefined"){
                    mainAppVars.listOSS.numFound    =   0;
                }
                if(mainAppVars.listOSS.numFound == 0 || mainAppVars.listOSS.numFound < mainAppVars.searchStart){
                    rootScopeVar.listLimitStart        = mainAppVars.searchStart - mainAppVars.listOSS.numFound;
                }
                rootScopeVar.contentList           = mainAppVars.listOSS;
                rootScopeVar.contentList.documents = angular.extend({},mainAppVars.listOSS.documents,mainAppVars.listEXT.documents);
                rootScopeVar.contentList.numFound  = mainAppVars.listOSS.numFound + mainAppVars.listEXT.numFound;
            }
            UI_unBlockInterface();
            progressChange(100);
        rootScopeVar.$digest();
    };
    this.destroyList    =   function(){
        mainAppVars.listOSS =   [];
        mainAppVars.listEXT =   [];
    };
    this.createListOSS  =   function(listRawData){
        mainAppVars.listOSS =   listRawData;
        var searchScope =   angular.element('#list').scope();
        if(typeof searchScope != "undefined"){
            searchScope.categoryFacets  =   this.createCategoryFacets(listRawData.facets[0]['terms']);
            if(mainAppVars.searchCategory){
                searchScope.catfilterapply   =   true;
            }
            else{
                searchScope.catfilterapply   =   false;
            }
        }
        if(listRawData.numFound == 0 || listRawData.numFound <= listRawData.start){
            listRawData.documents   =   [];
        }
        mainAppVars.listOSS.documents =   this.formatListData(listRawData.documents);
        if(mainAppVars.searchOssOnly || !mainAppVars.searchOssOnly && Object.keys(mainAppVars.listEXT).length > 0){
            this.createList();
        }
    };
    this.createListExt  =   function(listRawData){
        mainAppVars.listEXT =   listRawData;
        mainAppVars.listEXT.documents =   this.formatListData(listRawData.documents);
        this.createList();
    };

    this.createCategoryFacets    =   function(facetArr){
        var validCategories   =   [];
        var facetObject =   {};
        var parentFacetObject   =   {};
        for(var i=0;i<facetArr.length;i++){
            facetObject[facetArr[i]['term']]    =   facetArr[i]['count'];
        }
        if(IsValueNull(mainAppVars.searchCategory)){
            var contentcount    =   0;
            for(var key in data.subCategories){
                if(mainCatArray.indexOf(key) != -1){
                    contentcount    =   0;
                    if(typeof facetObject[key] == "undefined"){
                    	facetObject[key]	=	0;
                    }
                    parentFacetObject[key]  =   facetObject[key];
                    parentFacetObject[key] += this.getFacetCountForCategory(facetObject,data.subCategories[key],contentcount);
                }
            }
        }
        else{
            var contentcount    =   0;
            parentFacetObject[mainAppVars.searchCategory] = facetObject[mainAppVars.searchCategory];
            if(!IsValueNull(data.subCategories[mainAppVars.searchCategory])){
                var filteredCategory    =   data.subCategories[mainAppVars.searchCategory];
                for(var key in filteredCategory){
                    var childCat    =   filteredCategory[key]['attr']['data-catid'];
                    var childCatContentCount    =   0;
                    if(!IsValueNull(facetObject[childCat])){
                        childCatContentCount    =   facetObject[childCat];
                    }
                    if(!IsValueNull(data.subCategories[childCat])){
                        childCatContentCount    +=  this.getFacetCountForCategory(facetObject,data.subCategories[childCat],contentcount);
                    }
                    parentFacetObject[filteredCategory[key]['attr']['data-catid']]  =   childCatContentCount;
                    parentFacetObject[mainAppVars.searchCategory] += childCatContentCount;
                    parentFacetObject['other']  =    facetObject[mainAppVars.searchCategory];
                }
            }
        }
        for(var key in parentFacetObject){
            if(IsValueNull(parentFacetObject[key])){
                delete parentFacetObject[key];
            }    
        }
        return parentFacetObject;
    };

    this.getFacetCountForCategory   =   function(facetObject,catArr,count){
        for(var k=0;k<catArr.length;k++){
            if(!IsValueNull(data.subCategories[catArr[k]['attr']['data-catid']])){
                count += this.getFacetCountForCategory(facetObject,data.subCategories[catArr[k]['attr']['data-catid']],0);
            }
            if(!IsValueNull(facetObject[catArr[k]['attr']['data-catid']]))
                count += facetObject[catArr[k]['attr']['data-catid']];
        }
        return count;
    }


};
var openContentInfo	=	function(event){ // service
	var cur_content_row = $(event.target).closest('.list-item-row');
	cur_content_row.toggleClass('expand');
	var cur_toggle_div = cur_content_row.find('.content-toggle');
	cur_toggle_div.toggleClass('open');
	var old_toggle_div =  $('.content-data.content-toggle.row.open').not(cur_toggle_div);
	old_toggle_div.closest('.list-item-row').toggleClass('expand');
	old_toggle_div.toggleClass('open').find('.content-topics > div:first-child').toggleClass('hidden-sm').toggleClass('hidden-xs');
	cur_toggle_div.find('.content-topics > div:first-child').toggleClass('hidden-sm').toggleClass('hidden-xs');
};var mainApp =   mainApp || {};

mainApp.viewModule  =   function(){
    this.getVideoBookmarksData  =   function(){
        var bookmarkClassObject =   new mainApp.bookmarkModule();
        bookmarkClassObject.readBookmarkById(mainAppVars.currentVideoId);
    };
    this.CreateSegment  =   function(topicsArr){
        newSegInfo = new this.sSegmentInfo();
        newSegInfo.videoID 	=	mainAppVars.videoSourceId; 
        newSegInfo.segmentList = []; 
        for(i=0;i<topicsArr.length;i++){
            var topicInfo = new sVideoSegment();	   
            topicInfo.startTime = topicsArr[i].start_time;
            topicInfo.endTime	=	topicsArr[i].end_time;
            topicInfo.topicText = topicsArr[i].topic; 
            newSegInfo.segmentList.push(topicInfo); 	   
        }
        this.playSegments();
    };
    this.playSegments   =   function (){
        vidPlayerObject.LoadVideoWithSegmentList(newSegInfo.videoID,newSegInfo.segmentList, 'HandleSegmentEnd');
        $('.playListContainer li').eq(0).addClass('active');
    };
    this.sSegmentInfo   =   function(){
	   this.videoID = 0;		  
	   this.segmentList = 0;
    } 
};

function HandleSegmentEnd(uid){
        $('.playListContainer li.active').removeClass('active');
        $('.playListContainer li').eq(uid).addClass('active');
}
var playVideoSegment	=	function(event){
	if(event.target.hasAttribute('data-topic-index'))
		var nodeID	=	$(event.target).attr('data-topic-index');
	else{
		var nodeID	=	$(event.target).closest('[data-topic-index]').attr('data-topic-index');
	}
    vidPlayerObject.PlaySegmentIndex(nodeID); 
};function login()
{
	$("#sign-in-container").css('display','block');
}

var resetSignUpOption	=	function(){
	$('#sign-in-container input').val('');
	sign_in();
};
var mainAppVars =   {};

mainAppVars.goToCategorySelection   =   false;
mainAppVars.searchCategory          =   false;
mainAppVars.searchLanguage          =   false;
mainAppVars.searchAge               =   false;
mainAppVars.searchInputText         =   '';
mainAppVars.paginationLimitIndex    =   10;
mainAppVars.searchStart     =   0;
mainAppVars.searchRows      =   10;
mainAppVars.videoSource     =   '';
mainAppVars.videoSourceId   =   '';
mainAppVars.searchType      =   '';
mainAppVars.requestVariable =   false;
mainAppVars.currentVideoId  =   false;
mainAppVars.catNameObject   =   {};
mainAppVars.categoryJSON    =   [];
mainAppVars.loginUser   =   false;
mainAppVars.currentView =   'home';
mainAppVars.lastView    =   '';
mainAppVars.listOSS     =   [];
mainAppVars.listEXT     =   [];
mainAppVars.learn_keywords	=	['learn','lessons','tips'];
mainAppVars.learningKeywordCount = 0;
mainAppVars.searchOssOnly       =   false;
mainAppVars.searchExtOnly       =   false;
mainAppVars.getCurentVideoData  = false;
mainAppVars.redirectUrlIndex    =   0;
var mainApp =   mainApp || {};
mainAppVars.nochildfilter   =   false;
mainAppVars.urlmalform  =   false;
mainAppVars.recaptcha   =   false;

mainApp.Variables    =   function(){
    this.setVariable    =   function(varsObject){
        for(var key in varsObject){
            if((varsObject[key] == '' && key != 'all') || mainAppVars.urlmalform){
                mainAppVars.urlmalform = true;
                break;
            }
            switch(key){
                case 'page':
                    mainAppVars.currentView =   varsObject[key];
                    break;
                case 'search':
                    mainAppVars.searchInputText =   varsObject[key];
                    mainAppVars.searchType  =   'keyword';
                    break;
                case 'start':
                    mainAppVars.searchStart =   parseInt(varsObject[key]);
                    if(mainAppVars.searchStart < 0){
                        mainAppVars.urlmalform  =   true;
                    }
                    break;
                case 'rows':
                    mainAppVars.searchRows =   parseInt(varsObject[key]);
                    if(mainAppVars.searchRows < 0){
                        mainAppVars.urlmalform  =   true;
                    }
                    break;
                case 'bookmark':
                    mainAppVars.searchType  =   'bookmarks';
                    break;
                case 'videoId':
                    mainAppVars.currentVideoId =   varsObject[key];
                    break;
                case 'contentsrc':
                    mainAppVars.videoSource =   varsObject[key];
                    break;
                case 'sourcevidid':
                    mainAppVars.videoSourceId =   varsObject[key];
                    break;
                case 'request':
                    mainAppVars.requestVariable =   varsObject[key];
                    break;
                case 'category':
                    mainAppVars.searchCategory =   varsObject[key];
                    mainAppVars.searchType  =   'category';
                    break;
                case 'catfilter':
                    if(varsObject[key] != "other"){
                        mainAppVars.searchCategory =   varsObject[key];
                    }
                    else{
                        mainAppVars.nochildfilter   =   true;
                    }
                    break;
                case 'filter':
                    mainAppVars.nochildfilter   =   true;
                    break;
                case 'langfilter':
                    mainAppVars.searchLanguage =   varsObject[key];
                    break;
                case 'agefilter':
                    mainAppVars.searchAge =   varsObject[key];
                    break;
                case 'bookmarkSearch':
                    mainAppVars.searchBookmark =   varsObject[key];
                    break;
                case 'bookmarkId':
                    mainAppVars.searchType          =   'bookmarks';
                    mainAppVars.currentBookmarkId   =   varsObject[key];
                default:
                    key =   varsObject[key];
                    break;
            }
        }
    };
    this.unsetVariable    =   function(){};
    this.destroyVariable    =   function(){};
}
var mainApp =   mainApp || {};

mainApp.mainModule    =   function(){
    this.setVariablesFromParams    =   function(urlParamObj){
        if(Object.keys(urlParamObj).length > 0){
            var appVariableObject   =   new mainApp.Variables();
            appVariableObject.setVariable(urlParamObj);
        }
    };
    this.resetVariables =   function(){
        mainAppVars.goToCategorySelection   =   false;
        mainAppVars.searchCategory          =   false;
        mainAppVars.searchLanguage          =   false;
        mainAppVars.searchAge               =   false;
        mainAppVars.searchInputText         =   '';
        mainAppVars.paginationLimitIndex    =   10;
        mainAppVars.searchStart     =   0;
        mainAppVars.searchRows      =   10;
        mainAppVars.videoSource     =   '';
        mainAppVars.videoSourceId   =   '';
        mainAppVars.searchType      =   '';
        mainAppVars.requestVariable =   false;
        mainAppVars.currentVideoId  =   false;
        mainAppVars.currentView =   'home';
        mainAppVars.lastView    =   '';
        mainAppVars.listOSS     =   [];
/*
        mainAppVars.listEXT     =   [];
*/
    };
    this.renderStaticData	=	function(){
        $('#head').scope().setCategoryData();
        $('body').tooltip({
            selector: '[data-toggle="tooltip"]'
        });
        
        $(window).scroll(function(){
            var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(bodyScrollTop > 35){
                $('#head').addClass('scroll-active');
            }
            else{
                $('#head').removeClass('scroll-active');
            }
        });
        $('body').on('keypress','input[type="number"]',numbersonly);
        UI_createModal('#alert-box-container');
        UI_createModal('#feedback-form');
        var bindingArr   =   [
/*
            ['#categorydropdown > ul .showMoreCat',showAllCat,'click'],
            ['#categorydropdown',hideAllCat,'mouseleave'],
*/
            ['#searchBoxCat ul.dropdown-menu a',setSearchCategory,'click'],
            ['#categorydropdown li[data-catId] .subMenuExpand',showSubCategory,'click'],
            ['#categorydropdown li[data-catId] .subMenuCollapse',hideSubCategory,'click'],
            ['.sign-in-button',showSignInOption,'click']
        ];
        this.bindElements(bindingArr);
    };
    this.bindElements    =   function(elemArr){
        for(var i=0; i<elemArr.length;i++){
            UI_bindFunction(elemArr[i][0],elemArr[i][1],elemArr[i][2]);
        }
    };
};$(function(){
    var mainAppObject       =   new mainApp.mainModule();
    mainAppObject.renderStaticData();
    mainAppVars.loginUser   =   l_ch;
	progressChange(100);
});

var onRecaptchaCallback = function() {
    mainAppVars.recaptcha   =   true;
};

var reCaptchaWidget;
var loadRecaptcha   =   function(){
    reCaptchaWidget =   grecaptcha.render('recommendgrecaptcha', {
      'sitekey' : '6Lfh_xsTAAAAAFmiYtuXsXnEv3PS58yxSquSgp0F'
    });
}

var getLocationUrl = function(index){
	if(index == 0 || index == '' || index == null)
		return true;
	var redirectUrlStr = '';
	switch(index){
	case 1:
		redirectUrlStr = './?page=list&request=curate';
		break;
	default:
		redirectUrlStr = './';
		break;
	}
	return redirectUrlStr;
};
var preventClosing = function(event){
	window.location.href = './';
	return false;
};
var showAllCat= function(event){
//	$('#categorydropdown >ul>li.showLessCat').css('display','list-item');
	$('#categorydropdown >ul>li.hiddenElem').removeClass('hiddenElem');
	$('#categorydropdown >ul>li.showMoreCat').css('display','none');
	event.preventDefault();
	event.stopPropagation();
	return false;
};
var hideAllCat= function(event){
//	$('#categorydropdown >ul>li.showLessCat').css('display','none');
	$('#categorydropdown >ul').children('li:nth-child(n+7):not(.showMoreCat)').addClass('hiddenElem');
	$('#categorydropdown >ul>li.showMoreCat').css('display','list-item');
	event.preventDefault();
	event.stopPropagation();
	return false;
};
var createSubmenu = function(){
	var subMenuObj = data.subCategories;
	for(var key in subMenuObj){
		var menuItem = $('#categorydropdown ul.dropdown-menu li[data-catid="'+key+'"]');
		menuItem.find('a').addClass("dropdown-toggle").attr("data-toggle","dropdown");
		menuItem.addClass('dropdown-submenu').append('<div class="subMenuExpand visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-down"></div><div class="subMenuCollapse hiddenElem visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-up"></span></div><ul class="dropdown-menu"></ul>');
		for(var i=0;i<subMenuObj[key].length;i++){
			menuItem.find('ul.dropdown-menu').append('<li data-catId="'+subMenuObj[key][i]['attr']['data-catid']+'" data-vidId="'+subMenuObj[key][i]['attr']['data-vidId']+'"><a href="'+subMenuObj[key][i]['link']+'">'+subMenuObj[key][i]['label']+'</a></li>');
		}
	}
};
var unloadCurrentVideo = function(){
		mainAppVars.currentVideoId = '';
};
var showSignInOption    =   function(){
	UI_openModal('#sign-in-container');
};
var RecommendErrorMsg   =   [
    'Please specify a category for this video',
];/**
* The JS file contains UI abstraction layer for bootstrap UI elements and their methods.
* @author Ankit Agarwal
* @requires [Bootstrap v3.3.5] {@link http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js}
* @version : 1.0
* 
*/
$(function(){
	if($('[data-toggle="tooltip"]').length !=0){
		$('[data-toggle="tooltip"]').tooltip();
	}
});
var gUIElement = [];

/**
 * function to apply theme to a UI element
 * @function UI_applyTheme
 * @param {string} element	jquery selector eg. #myelement,.myclass etc.
 * @param {string} theme	string value of bootstrap theme eg. 'primary','info','warning' etc.
 * @param {string} classPrefix	string value to add class for a particular bootstrap component eg. adding primary button class to a div	parameter will be 'btn-'
 * */
var UI_applyTheme	=	function(element,theme,classPrefix){
	if($(element).length == 0)
		return false;
	var Elem	=	$(element);
	classStr	=	classPrefix;
	switch (theme) {
	case 'primary':
		classStr	+=	'primary';
		break;
	case 'success':
		classStr	+=	'success';
		break;
	case 'info':
		classStr	+=	'info';
		break;
	case 'warning':
		classStr	+=	'warning';
		break;
	case 'danger':
		classStr	+=	'danger';
		break;
	default:
		classStr	+=	'default';
		break;
	}
	Elem.addClass(classStr);
};

/**
 * function to bind function to a UI element on an event
 * @function UI_bindFunction
 * @param {string} element	jquery selector eg. #myelement,.myclass etc.
 * @param {string|variable} handlerFn	function name to be called on event trigger. Can be string or function variable name eg. 'mycustomFunction' , callMyFunction etc.
 * @param {string} eventType	string value of jquery events eg. 'click','keyup','mouseover' etc.
 * */
var UI_bindFunction	=	function(element,handlerFn,eventType){
	if($(element).length == 0)
		return false;
	Elem	=	$(element);
	if($.isFunction(handlerFn) || (typeof(handlerFn) == 'string' && $.isFunction(window[handlerFn]))){
		Elem.each(function(){
			$(this).on(eventType,function(event){
				if(typeof(handlerFn) == 'string')
					window[handlerFn](event);
				else
					handlerFn(event);
			});
		});
	}
};

/** 
 * function to create a button and attach its onclick handler function
 * @function UI_createButton
 * @param {string} element	jquery selector eg. #myelement,.myclass etc.
 * @param {string} width	width of the button to be created
 * @param {string} height	height of the button to be created
 * @param {string|variable} handlerFn	function name to be called on event trigger. Can be string or function variable name eg. 'mycustomFunction' , callMyFunction etc.
 * @param {string} theme	string value of bootstrap theme to be applied on the element
 * */
var UI_createButton	=	function(element,width,height,handlerFn,theme){
	if($(element).length == 0)
		return false;
	var Elem	=	$(element);
	Elem.each(function(){
		$(this).addClass('btn');
		if(this.hasAttribute('data-button')){
			$(this).text($(this).attr('data-button'));
		}
		if(width == '' || width == null)
			width	=	'auto';
		if(height == '' || height == null)
			height	=	'auto';
		$(this).css({'width':width,'height':height});
		if(handlerFn != '' && handlerFn != null)
			UI_bindFunction($(this),handlerFn,'click');
		UI_applyTheme($(this),theme,'btn-');
	});
};

/** 
 * function to get value of an input element
 * @function UI_getInputValue
 * @param {string} element jquery selector eg. #myelement,.myclass etc.
 * @param {string} valType output format eg. 'string', 'int', 'float' or 'bool'
 * */
var UI_getInputValue	=	function(element,valType){
	if($(element).length == 0)
		return false;
	var Elem	=	$(element);
	var ElemVal;
	switch (valType) {
	case 'string':
		ElemVal	=	Elem.val();
		break;
	case 'int':
		ElemVal	=	parseInt(Elem.val());
		break;
	case 'float':
		ElemVal	=	parseFloat(Elem.val());
		break;
	case 'bool':
		switch(Elem.attr('type')){
		case 'checkbox':
			ElemVal	=	Elem.prop('checked');
			break;
		case 'radio':
			ElemVal	=	Elem.prop('selected');
		default:
			if((Elem.val() == '') || (Elem.val() == null)|| (Elem.val() == undefined)){
				ElemVal	=	false;
			}
			else{
				ElemVal	=	true;
			}
			break;
		}
		break;
	default:
		ElemVal	=	Elem.val();
		break;
	}
};
/** 
 * function to create a modal div from html structure 
 * @function UI_createModal
 * @param {string} element jquery selector of container element of modal window
 * @param {string} mBody plain html string Or it can be a jquery selector of an element present in the DOM whose html can be inserted in the body of modal
 * @param {string} mHead plain html string Or it can be a jquery selector of an element present in the DOM whose html can be inserted in the head of modal
 * @param {string} mFoot plain html string Or it can be a jquery selector of an element present in the DOM whose html can be inserted in the foot of modal
 * @param {string|variable} openhandlerFn function name to be called on open modal event trigger. Can be string or function variable name eg. 'mycustomFunction' , callMyFunction etc.
 * @param {boolean} initState initial state of the modal window to be open on create or not
 * @param {string|variable} closehandlerFn function name to be called on close modal event trigger. Can be string or function variable name eg. 'mycustomFunction' , callMyFunction etc.
 * */
var UI_createModal			=	function(element,mBody,mHead,mFoot,openhandlerFn,initState,closehandlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.addClass('modal fade');
	Elem.attr({'role':'dialog','aria-labelledby':'bsUIModal'});
	if(($('body').find($(mHead)).length == 0 )&& (typeof(mHead) == 'string')){
		Elem.append(mHead);
	}
	else if($('body').find($(mHead)).length !=0){
		Elem.append($(mHead)[0].outerHTML);
		$(mHead).remove();
	}
	if(($('body').find($(mBody)).length ==0) && (typeof(mBody) == 'string')){
		Elem.append(mBody);
	}
	else if($('body').find($(mBody)).length !=0){
		Elem.append($(mBody)[0].outerHTML);
		$(mBody).remove();
	}
	if(($('body').find($(mFoot)).length ==0) && (typeof(mFoot) == 'string')){
		Elem.append(mFoot);
	}
	else if($('body').find($(mFoot)).length !=0){
		Elem.append($(mFoot)[0].outerHTML);
		$(mFoot).remove();
	}
	if(Elem.find('.modal-dialog').length == 0){
		Elem.children().wrapAll('<div class="modal-dialog" role="document"></div>');
	}
	var modalDialog		=	Elem.find('.modal-dialog');
	if(Elem.find('.modal-content').length == 0)
		modalDialog.children().wrapAll('<div class="modal-content"></div>');
	var modalContent	=	Elem.find('.modal-content');
	if(Elem.find('.modal-header').length == 0)
		modalContent.children().eq(0).wrap('<div class="modal-header"></div>');
	var modalHeader		=	Elem.find('.modal-header');
	if(Elem.find('.modal-body').length == 0)
		modalContent.children().eq(1).wrap('<div class="modal-body"></div>');
	var modalBody		=	Elem.find('.modal-body');
	if(Elem.find('.modal-footer').length == 0)
		modalContent.children().eq(2).wrap('<div class="modal-footer"></div>');
	var modalFooter		=	Elem.find('.modal-footer');
	modalHeader.prepend('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button>');
	if(openhandlerFn)
		UI_bindFunction(Elem,openhandlerFn,'show.bs.modal');
	if(closehandlerFn)
		UI_bindFunction(Elem,closehandlerFn,'hide.bs.modal');
	if(initState){
		Elem.modal('show');
	}
};

/** 
 * function to bind a ui element to open modal div
 * @function UI_bindModalButton
 * @requires UI_createModal Modal must be created before invoking this function
 * @param {string} buttonElem jquery selector of the UI button element whose click opens the modal window
 * @param {string} modalElem jquery selector of the modal window to be open on button click
 * */
var UI_bindModalButton		=	function(buttonElem,modalElem){
	$(buttonElem).attr({'data-toggle':'modal', 'data-target':modalElem});
};
var UI_openModal			=	function(modalElem){
	$(modalElem).modal('show');
};
var UI_closeModal			=	function(modalElem){
	$(modalElem).modal('hide');
};
var UI_resetModal			=	function(modalElem,resetHandler){
	$(modalElem).find('.modal-header,.modal-body,.modal-footer').html('');
	if(resetHandler)
		$(modalElem).off('show.bs.modal');
};

var UI_createTooltip		=	function(element,toolTip,toolTipPosition,handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		if(this.hasAttribute('title')){
			$(this).attr('data-title',$(this).attr('title'));
		}
		else if(this.hasAttribute(toolTip)){
			$(this).attr('data-title',$(this).attr(toolTip));
		}
		else {
			$(this).attr('data-title',toolTip);
		}
		if(toolTipPosition == '' || toolTipPosition == null || toolTipPosition == undefined)
			toolTipPosition = 'bottom';
		$(this).attr({'data-html':true,'data-toggle':'tooltip','data-placement':toolTipPosition});
	});
	Elem.tooltip();
	if(handlerFn){
		UI_bindFunction(Elem,handlerFn,'show.bs.tooltip');
	}
};
var UI_showTooltip			=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.tooltip('show');
};
var UI_hideTooltip			=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.tooltip('hide');
	
};
var UI_toggleTooltip			=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.tooltip('toggle');
	
};
var UI_destroyTooltip		=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.tooltip('destroy');
	
};

var UI_createTextBox		=	function(element,inputType,inputLabel,inputPlaceholder){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('form-group');
		if(inputType == '' || inputType == null || inputType == undefined){
			inputType = 'text';
		}
		if(this.hasAttribute(inputLabel)){
			$(this).append('<label for="'+$(this).attr("id")+'">'+$(this).attr(inputLabel)+'</label>');
		}
		else if(this.hasAttribute('data-label')){
			$(this).append('<label for="'+$(this).attr("id")+'">'+$(this).attr('data-label')+'</label>');
		}
		else if(inputLabel != '' && inputLabel != null && inputLabel != undefined){
			$(this).append('<label for="'+$(this).attr("id")+'">'+inputLabel+'</label>');
		}
		if(this.hasAttribute(inputPlaceholder)){
			inputPlaceholder	=	$(this).attr(inputPlaceholder);
		}
		else if(this.hasAttribute('data-placeholder')){
			inputPlaceholder	=	$(this).attr('data-placeholder');
		}
		else if(inputPlaceholder == '' || inputPlaceholder == null || inputPlaceholder == undefined){
			inputPlaceholder	=	'';
		}
		$(this).append('<input type="'+inputType+'" class="form-control" placeholder="'+inputPlaceholder+'" id="'+$(this).attr("id")+'" />');
		$(this).removeAttr('id');
	});
};
var UI_preAddon				=	function(element, addOn, formControl, handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(formControl){
		Elem.each(function(){
			$(this).parent('.form-group').addClass('has-feedback');
			if(addOn.indexOf('glyphicon') != -1){
				$(this).before('<span class="glyphicon '+addOn+' form-control-feedback" aria-hidden="true"></span>');
			}
			else{
				$(this).before('<span class="form-control-feedback" aria-hidden="true">'+addOn+'</span>');
			}
		});
	}
	else{
		Elem.each(function(){
			if(!$(this).parent().hasClass('input-group'))
				$(this).wrap('<div class="input-group"></div>');
			if(addOn.indexOf('glyphicon') != -1){
				$(this).before('<div class="input-group-addon"><span class="glyphicon '+addOn+' " aria-hidden="true"></span></div>');
			}
			else{
				$(this).before('<div class="input-group-addon">'+addOn+'</div>');
			}
			
		});
	}
	if(handlerFn){
		Elem.each(function(){
			UI_bindFunction(Elem.before(),handlerFn,'click');
		});
	}
};
var UI_postAddon			=	function(element, addOn, formControl, handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(formControl){
		Elem.each(function(){
			$(this).parent('.form-group').addClass('has-feedback');
			if(addOn.indexOf('glyphicon') != -1){
				$(this).after('<span class="glyphicon '+addOn+' form-control-feedback" aria-hidden="true"></span>');
			}
			else{
				$(this).after('<span class="form-control-feedback" aria-hidden="true">'+addOn+'</span>');
			}
		});
	}
	else{
		Elem.each(function(){
			if(!$(this).parent().hasClass('input-group'))
				$(this).wrap('<div class="input-group"></div>');
			if(addOn.indexOf('glyphicon') != -1){
				$(this).after('<div class="input-group-addon"><span class="glyphicon '+addOn+' " aria-hidden="true"></span></div>');
			}
			else{
				$(this).after('<div class="input-group-addon">'+addOn+'</div>');
			}
			
		});
	}
	if(handlerFn){
		Elem.each(function(){
			UI_bindFunction(Elem.next(),handlerFn,'click');
		});
	}
};
var UI_createCheckBox		=	function(element,handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('checkbox');
		$(this).append('<label><input type="checkbox" id="'+$(this).attr("id")+'"/>'+$(this).attr("data-label")+'</label>');
		$(this).removeAttr('id');
	});
	if(handlerFn){
		UI_bindFunction(Elem,handlerFn,'change');
	}
};
var UI_createRadioBox		=	function(element,handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('radio');
		$(this).append('<label><input type="radio" name="'+$(this).attr("name")+'" id="'+$(this).attr("id")+'" value="'+$(this).attr("data-value")+'" />'+$(this).attr("data-label")+'</label>');
		if(this.hasAttribute('checked')){
			$(this).find('input[type="radio"]').attr('checked',true);
		}
		$(this).removeAttr('name id value');
	});
	if(handlerFn){
		UI_bindFunction(Elem,handlerFn,'change');
	}
};

var UI_openBlockingDiv	=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.modal('show');
};
var UI_closeBlockingDiv	=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.modal('hide');
};

var UI_setInputValue		=	function(element,value,inputType){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(inputType == "checkbox" || inputType == "radio"){
		Elem.prop('checked',value);
	}
	else{
		Elem.val(value);
	}
};

var UI_createTable			=	function(element,tableData,tableStyle){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('table-responsive');
		$(this).append('<table class="table" id="'+$(this).attr("id")+'"><thead></thead><tbody></tbody></table>');
		var theadElem	=	$(this).find('thead');
		var tbodyElem	=	$(this).find('tbody');
		var rowLength	=	tableData.length;
		var colLength	=	tableData[0].length;
		var rowData;
		var rowElem;
		for(var i=0;i<rowLength;i++){
			rowData	=	tableData[i];
			if(i>0){
				tbodyElem.append('<tr></tr>');
				rowElem	=	tbodyElem.find('tr:last-child');
				for(var j=0;j<colLength;j++){
					rowElem.append('<td>'+rowData[j]+'</td>');
				}
			}
			else{
				theadElem.append('<tr></tr>');
				rowElem	=	theadElem.find('tr');
				for(var j=0;j<colLength;j++){
					rowElem.append('<th>'+rowData[j]+'</th>');
				}
			}
		}
		if(tableStyle != '' && tableStyle != null || tableStyle != undefined){
			$(this).find('.table').addClass(tableStyle);
		}
	});
};

var UI_createTabs			=	function(element,handlerFn){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	Elem.each(function(){
		$(this).addClass('tab-content');
		var tabsArr	=	$(this).children();
		if(tabsArr.length>0){
			var ulElem	=	$('<ul class="nav nav-tabs" role="tablist"></ul>');
			$(this).before(ulElem);
			tabsArr.each(function(){
				$(this).attr('role','tabpanel').addClass('tab-pane');
				ulElem.append('<li role="presentation"><a class="'+$(this).attr('class')+'" href="#'+$(this).attr("id")+'" aria-controls="'+$(this).attr("id")+'" role="tab" data-toggle="tab">'+$(this).attr("data-label")+'</a></li>');
			});
			ulElem.find('li:first-child').addClass('active');
			tabsArr.eq(0).addClass('active');
		}
	});
	if(handlerFn){
		UI_bindFunction(Elem.prev('[role="tablist"]').find('[data-toggle="tab"]'),handlerFn,'show.bs.tab');
	}
};

var UI_showTab				=	function(element){
	if($('[href="#'+element+'"]').length == 0)
		return false;
//	var Elem =	$(element);
	$('[href="#'+element+'"]').tab('show');
};

var UI_createNavBar			=	function(element,jsonDataObj,theme){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(jsonDataObj){
		UI_createJsonUL(element,jsonDataObj);
	}
	Elem.addClass('collapse navbar-collapse');
	Elem.children('ul').addClass('nav navbar-nav');
	Elem.wrap('<nav class="navbar"><div class="container-fluid"></div></nav>');
	Elem.before('<div class="navbar-header">' +
			'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#'+Elem.attr("id")+'"' +  
			'aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar">' +
			'</span><span class="icon-bar"></span><span class="icon-bar"></span></button>' +
			'<a class="navbar-brand" href="#">MAS</a></div>');
	var menuElem	=	Elem.find('ul.nav.navbar-nav > li');
	menuElem.each(function(){
		if($(this).find('ul').length > 0){
			$(this).addClass('dropdown');
			$(this).children('a').addClass('dropdown-toggle').attr({'data-toggle':'dropdown','role':'button','aria-haspopup':true}).append('<span class="caret"></span>');
			$(this).children('ul').addClass('dropdown-menu');
		}
	});
	UI_applyTheme('nav.navbar',theme,'navbar-fixed-top navbar-')
};
var UI_createJsonUL			=	function(element,jsonDataObj){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	var ulElem		=	$('<ul></ul>');
	Elem.append(ulElem);
	if(jsonDataObj['attr']){
		ulElem.attr(jsonDataObj['attr']);
	}
	if(jsonDataObj['class']){
		ulElem.addClass(jsonDataObj['class']);
	}
	var liDataArr	=	jsonDataObj['html'];
	for(var i=0;i<liDataArr.length;i++){
		ulElem.append('<li><a></a></li>');
		ulElem.find('li:last-child').find('a').attr('href',liDataArr[i]["link"]).text(liDataArr[i]["label"]);
		if(liDataArr[i]['attr']){
			ulElem.find('li').eq(i).attr(liDataArr[i]['attr']);
		}
		if(liDataArr[i]['css']){
			ulElem.find('li').eq(i).attr(liDataArr[i]['css']);
		}
		if(liDataArr[i]['class']){
			ulElem.find('li').eq(i).addClass(liDataArr[i]['class']);
		}
		if(liDataArr[i]['dropdowndata']){
			ulElem.find('li').eq(i).append('<ul></ul>');
			var dropDownUl	=	ulElem.find('li').eq(i).children('ul');
			var dropdowndata	=	liDataArr[i]['dropdowndata'];
			for(var j=0;j<dropdowndata.length;j++){
				dropDownUl.append('<li><a></a></li>');
				dropDownUl.find('li:last-child').find('a').attr('href',dropdowndata[j]["link"]).text(dropdowndata[j]["label"]);
				if(dropdowndata[j]['attr']){
					dropDownUl.find('li').eq(j).attr(dropdowndata[j]['attr']);
				}
				if(dropdowndata[j]['css']){
					dropDownUl.find('li').eq(j).attr(dropdowndata[j]['css']);
				}
				if(dropdowndata[j]['class']){
					dropDownUl.find('li').eq(j).addClass(dropdowndata[j]['class']);
				}
			}
		}
	}
};

var UI_createDropdown		=	function(element,jsonDataObj,dropupFlag){
	if($(element).length == 0)
		return false;
	var Elem =	$(element);
	if(jsonDataObj){
		UI_createJsonUL(element,jsonDataObj);
	}
	Elem.addClass("btn-group");
    if(dropupFlag){
	   Elem.addClass("dropup");
    }
	Elem.prepend('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+Elem.attr("data-label")+'<span class="caret"></span></button>');
	Elem.find('ul').addClass("dropdown-menu");
};

var UI_createGrid			=	function(){
	
};
var UI_refreshGrid			=	function(){
	
};


var UI_destroyModal			=	function(){
	
};
var UI_setTooltip			=	function(){
	
};
var UI_createTextArea		=	function(){
	
};
var UI_createSelectBox		=	function(){
	
};
var UI_resetInputValue		=	function(){
	
};
var UI_createCustomScroll	=	function(element){
	if($(element).length == 0)
		return false;
	var Elem =	$(element).addClass('scrolltargetElement');
	if(!Elem.parent().hasClass('ui_scroll_custom')){
		Elem.wrap('<div class="ui_scroll_custom"></div>');
		var scrollContainer = $(element).closest('.ui_scroll_custom');
		scrollContainer.append('<div class="scrollbar"><div class="scroller"></div></div>');
	}
	else{
		var scrollContainer = $(element).closest('.ui_scroll_custom');
	}
	Elem.css({'margin-right':'-30px','padding-right':'30px','overflow':'auto','-webkit-user-select':'none','-moz-user-select':'none','-ms-user-select':'none','user-select':'none'});
	var scrollElem	 = scrollContainer.find('.scroller'); 
	var scrollBar	 = scrollContainer.find('.scrollbar');
	scrollBar.on('click',function(event){
		var scrollerHeight = $(this).find('.scroller').css('height');
		var tarElem = $(this).closest('.ui_scroll_custom').find('.scrolltargetElement');
		tarElem.animate({'scrollTop':((event.offsetY-(parseInt(scrollerHeight)/2))*tarElem[0].scrollHeight/tarElem[0].clientHeight)});
	});
	scrollElem.css('height',Elem[0].clientHeight*Elem[0].clientHeight/Elem[0].scrollHeight+'px');
	scrollElem.css('top',Elem[0].scrollTop*Elem[0].clientHeight/Elem[0].scrollHeight+'px');
	Elem.on('scroll',function(){
		Elem.closest('.ui_scroll_custom').find('.scroller').css('top',Elem[0].scrollTop*Elem[0].clientHeight/Elem[0].scrollHeight+'px');
	});
};
var UI_alert    =   function(message){
    if($('#alert-box-container').length == 0){
        $('footer').append('<div id="alert-box-container" data-keyboard=false data-backdrop="static"><div></div><div></div><div></div></div>');
        UI_createModal('#alert-box-container');
    }
    var alertContainer  =   $('#alert-box-container');
    alertContainer.find('.modal-header > div:last-child').html('<div class="alert alert-warning" role="alert"><a href="#" class="alert-link">'+message+'</a></div>');
    alertContainer.find('.modal-footer > div:last-child').html('<button class="btn btn-primary btn-small" onclick="UI_closeModal(\'#alert-box-container\')">OK</button>');
    UI_openModal('#alert-box-container');
//    alert(message);
};var toggleDropdown	=	function(element,control,event){
	if(control==1){
		if(!$(element).hasClass('open'))
			$(element).find('ul.dropdown-menu').dropdown('toggle');
	}
	else{
		if($(element).hasClass('open'))
			$(element).find('ul.dropdown-menu').dropdown('toggle');
	}
};
var CheckImgErr =function(image){
	if((image.naturalHeight == 90 && image.naturalWidth == 120 )|| (image.naturalHeight == 0 && image.naturalWidth == 0 )){
		image.src="./"+projectFolderName+"/image/defImage.png";
	}
	return true;
};

function distinctVal(arr){
    var newArray = [];
    for(var i=0, j=arr.length; i<j; i++){
        if(newArray.indexOf(arr[i]) == -1)
              newArray.push(arr[i]);  
    }
    return newArray;
}

function createBrowserObject()
{
	if(xmlHttp)
		delete xmlHttp;
		
	var xmlHttp;
	try
	{
		xmlHttp=new XMLHttpRequest();	// Firefox, Opera 8.0+, Safari		
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); // Internet Explorer 					
		} 
		catch (e)
		{ 
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{ 
				Alert(JavascriptNotWorking); 
			}
		}
	}
	 
	return xmlHttp;
}
var animationLoading ;
var sendAjax = function(object){
	var callType = true, sendMethod	=	'POST', additionalData	=	null, callBack	=	'';
	if(IsValueNull(object.actionScriptURL))
		return false;
		
	if(IsValueNull(object.sendMethod))
		sendMethod	=	'POST';

	if(!IsValueNull(object.callType) && object.callType	==	'SYNC')	
		callType	=	false;
		
	additionalData	=	object.additionalData;
	
	var xmlHttp	=	createBrowserObject();
	if(!IsValueNull(object.callBack) )
	{
		callBack	=	object.callBack; 
		xmlHttp.onreadystatechange	=	function(){
			if(xmlHttp.readyState	==	4 && xmlHttp.status	==	200){
				callBack(xmlHttp.responseText);
			}
		}; 
	}
	xmlHttp.open(sendMethod,object.actionScriptURL,callType);
	xmlHttp.send(additionalData);
};
function IsValueNull(Value)
{
	if(Value	==	"" || Value	==	null || Value	==	undefined)
		return true;
	else
		return false;	
}
var showSubCategory = function(event){
	$(event.currentTarget).closest('ul').find('.subMenuExpand').removeClass('hiddenElem');
	$(event.currentTarget).closest('ul').find('.subMenuCollapse').addClass('hiddenElem');
	$(event.currentTarget).closest('li').find('.subMenuExpand').addClass('hiddenElem');
	$(event.currentTarget).closest('li').find('.subMenuCollapse').removeClass('hiddenElem');
	$(event.currentTarget).closest('ul').find('ul.dropdown-menu').css('display','none');
	$(event.currentTarget).closest('li').find('ul.dropdown-menu').css('display','block');
	event.preventDefault();
	event.stopPropagation();
	return false;
};
var hideSubCategory = function(event){
	$(event.currentTarget).closest('ul').find('.subMenuExpand').removeClass('hiddenElem');
	$(event.currentTarget).closest('ul').find('.subMenuCollapse').addClass('hiddenElem');
	$(event.currentTarget).closest('li').find('.subMenuExpand').removeClass('hiddenElem');
	$(event.currentTarget).closest('li').find('.subMenuCollapse').addClass('hiddenElem');
	$(event.currentTarget).closest('ul').find('ul.dropdown-menu').css('display','none');
	$(event.currentTarget).closest('li').find('ul.dropdown-menu').css('display','none');
	event.preventDefault();
	event.stopPropagation();
	return false;
};
var blockSetFlag = 0;
var UI_blockInterface = function(){
	$('#block_ui_overlay').css('display','block');
	blockSetFlag = setTimeout(function(){
		$('#block_ui_overlay').css('display','none');
	},40*1000);
};
var UI_unBlockInterface = function(){
	$('#block_ui_overlay').css('display','none');
};
var sendCaptchaRequest = function(imgElem){
	refreshCaptcha(imgElem);
};
function refreshCaptcha(imgElem){
	var elem = '[alt="captcha"]';
	if(!IsValueNull(imgElem)){
		elem	=	imgElem;
	}
	var img = $(imgElem)[0];
	img.src = img.src.substring(0,img.src.lastIndexOf("?"))+"?captcha=true&rand="+Math.random()*1000;
}

var parseQueryStringToObject	=	function(queryStr){
	var a=queryStr.split('&');
	var b = {};
	for(var i=0;i<a.length;i++){
	    var c = a[i].split('=');
	    b[c[0]]=decodeURIComponent(c[1]);
	}
	return b;
};
function numbersonly(e)
{	 
	var unicode=e.charCode? e.charCode : window.event
    if (unicode > 31 && unicode != 46 && (unicode < 48 || unicode > 57))		
    	return false //disable key press
    unicode = null;
}
function check(obj)
{	
/*
	if(obj.value != '')
	{	
		reg=/^\d+$/;	
		if(obj.value > 2147483647)
		{
			UI_alert("Digits range should be 0 to 2147483647");
            obj.focus();
            obj = null;
		}		
		if (! reg.test(obj.value))
		{
			UI_alert("Please input digits only");
            obj.focus();
            obj = null;
		}
	}	
*/
}
function secondsToTimeStr(seconds){
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
var validateAppResponse =   function(responseObj){
    var outputvalidate  =   false;
    if(responseObj.status){
        outputvalidate  =   true;
    }
    return outputvalidate;
};

//==============================================================================================//
//========================= FUNCTION TO ADD SLASHES TO A STRING LIKE PHP =======================//
//==============================================================================================//
function addslashes(string) {
  return string.replace(/\\/g, '\\\\').
      replace(/\u0008/g, '\\b').
      replace(/\t/g, '\\t').
      replace(/\n/g, '\\n').
      replace(/\f/g, '\\f').
      replace(/\r/g, '\\r').
      replace(/'/g, '\\\'').
      replace(/"/g, '\\"');
}

function removeslashes(string) {
	  return string.replace(/\\\\/g, '\\').
	      replace(/\\b/g, '\u0008').
	      replace(/\\t/g, '\t').
	      replace(/\\n/g, '\n').
	      replace(/\\f/g, '\f').
	      replace(/\\r/g, '\r').
	      replace(/\\\'/g, '\'').
	      replace(/\\"/g, '"');
}
function encodeHtmlEntities(rawStr){
    var encodedStr  =   '';
    if(typeof(rawStr) != "undefined"){
        encodedStr = rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
           return '&#'+i.charCodeAt(0)+';';
        });    
    }
    return encodedStr;
}
/** 
* @namespace CommonUtils
*/
var CommonUtils = CommonUtils || {};

/**
 * remoteCallClass class under CommonUtils namespace to implement methods for remote calls
 * @class CommonUtils.remoteCallClass
 * 
 */

CommonUtils.remoteCallClass = function(){
	var remoteCallObj;
	var status;
	var error;
	var lastMethod;
	var lastCallType;
	var lastRequestData;
	var lastUrl;
	var lastCallback;
	this.requestMethod 	=	'POST';
	this.callType		=	true;
	this.requestData	=	{};
	this.user			=	'';
	this.password		=	'';
	
	var init	=	function createBrowserObject(){
		try
		{
			remoteCallObj=new XMLHttpRequest();	// Firefox, Opera 8.0+, Safari		
		}
		catch (e)
		{
			try
			{
				remoteCallObj=new ActiveXObject("Msxml2.XMLHTTP"); // Internet Explorer 					
			} 
			catch (e)
			{ 
				try
				{
					remoteCallObj=new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e)
				{ 
					UI_alert('Enable javascript'); 
				}
			}
		}
	};
	
	this.syncGetRequest	=	function(url,callback){
		this.requestMethod 	= 'GET';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncGetRequest	=	function(url,callback){
		this.requestMethod 	= 'GET';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncPostRequest	=	function(url,callback){
		this.requestMethod 	= 'POST';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncPostRequest	=	function(url,callback){
		this.requestMethod 	= 'POST';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncPutRequest	=	function(url,callback){
		this.requestMethod 	= 'PUT';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncPutRequest	=	function(url,callback){
		this.requestMethod 	= 'PUT';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncDeleteRequest	=	function(url,callback){
		this.requestMethod 	= 'DELETE';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncDeleteRequest	=	function(url,callback){
		this.requestMethod 	= 'DELETE';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncConnectRequest	=	function(url,callback){
		this.requestMethod 	= 'CONNECT';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncConnectRequest	=	function(url,callback){
		this.requestMethod 	= 'CONNECT';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncHeadRequest	=	function(url,callback){
		this.requestMethod 	= 'HEAD';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncHeadRequest	=	function(url,callback){
		this.requestMethod 	= 'HEAD';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncOptionsRequest	=	function(url,callback){
		this.requestMethod 	= 'OPTIONS';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncOptionsRequest	=	function(url,callback){
		this.requestMethod 	= 'OPTIONS';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.syncTraceRequest	=	function(url,callback){
		this.requestMethod 	= 'TRACE';
		this.callType		= false;
		return makeRequest(url,callback,this);
	};
	
	this.asyncTraceRequest	=	function(url,callback){
		this.requestMethod 	= 'TRACE';
		this.callType		= true;
		return makeRequest(url,callback,this);
	};
	
	this.customRequest	=	function(url,callback,method,type,data){
		this.requestMethod 	= method;
		this.callType		= type;
		this.requestData	= data;
		return makeRequest(url,callback,this);
	};
	
	this.retryLastRequest	=	function(){
		this.requestMethod	=	lastMethod;
		this.callType		=	lastCallType;
		this.requestData	=	lastRequestData;
		makeRequest(lastUrl,lastCallback,this);
	};
	
	this.getLastRequestStatus	=	function(){
		return status;
	};

	this.getLastErrorMessage	=	function(){
		return error;
	};
	var setCallError	=	function(callback){
		console.log(error);
		if(!(callback == '' || callback == null || typeof(callback) == "undefined")){
			callback(error);
		}
		return error;
	};
	
	var makeRequest	=	function(url,callback,classObj){
		lastMethod		=	classObj.requestMethod;
		lastCallType	=	classObj.callType;
		lastRequestData	=	classObj.requestData;
		lastUrl 		= 	url;
		lastCallback	=	callback;
		error = '';
		status = 'PRISTINE';
		if(url == '' || url == null || typeof(url) == "undefined"){
			error = 'No target defined for the request';
			status	=	'ERROR';
			return requestCallback();
		}
		init();
        if(classObj.requestMethod == "GET" && Object.keys(classObj.requestData).length > 0){
            url +=  '?'+formatRequestData(classObj.requestData);
        }
		remoteCallObj.onreadystatechange	=	function(){
			if(remoteCallObj.readyState	==	1){
				status	=	'SENT';
			}
			else if(remoteCallObj.readyState	==	4 && remoteCallObj.status	==	200){
				status	=	'RESPONSE';
				requestCallback(remoteCallObj.response,lastCallback);
			}
		}; 
		remoteCallObj.open(classObj.requestMethod,url,classObj.callType,classObj.user,classObj.password);
		remoteCallObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		remoteCallObj.send(formatRequestData(classObj.requestData));
		classObj.requestMethod 	= '';
		classObj.callType		= '';
		classObj.requestData	=	{};
	};
	
	var formatRequestData	=	function(reqObject){
		var outputStr	=	'';
		for(var key in reqObject){
			if(outputStr != ''){
				outputStr += '&';
			}
			if(typeof(reqObject[key]) == "object"){
				outputStr	+=	formatRequestDataObject(reqObject[key],key,'');
			}
			else{
				outputStr	+=	key;
				outputStr	+=	'=';
				outputStr	+=	encodeURIComponent(reqObject[key]);
			}
		}
		return outputStr;
	};
	
	var formatRequestDataObject	=	function(levelObj,levelKey,prevObjStr){
		var outputStr	='';
		for(var key in levelObj){
			if(outputStr != ''){
				outputStr += '&';
			}
			if(typeof(levelObj[key]) == "object"){
				if(prevObjStr == ''){
					var levelObjStr	=	levelKey;
				}
				else{
					var levelObjStr	=	prevObjStr+'['+levelKey+']';
				}
				outputStr += formatRequestDataObject(levelObj[key],key,levelObjStr);
			}
			else{
				if(prevObjStr	!=	''){
					outputStr	+=	prevObjStr;
					outputStr	+=	'['+levelKey+']';
					outputStr	+=	'['+key+']';
				}
				else{
					outputStr	+=	levelKey+'['+key+']';
				}
				outputStr	+=	'=';
				outputStr	+=	encodeURIComponent(levelObj[key]);
			}
		}
		return outputStr;
	};
	
	var requestCallback	=	function(reponse,callback){
		if(status == "ERROR"){
			return setCallError(callback);
		}
		else if(status == "RESPONSE"){
			if(callback == '' || callback == null || typeof(callback) == "undefined"){
				return reponse;
			}
			else{
				return callback(reponse);
			}
		}
		else if(status == "PRISTINE"){
			error = 'Request not sent by app';
			return setCallError(callback);
		}
		else if(status == "SENT"){
			error = 'Response not received by app';
			return setCallError(callback);
		}
		else{
			error = 'Unknown error in sending request'
			return setCallError(callback);
		}
	};
};(function () {
    var homeController  =   function ($scope, $routeParams, $location, $http, $rootScope) {
        $scope.categoryItems    =   [];
        $('body').scrollTop(0);
        $('#sidebar').css('display','block');
        $('#moto').css('display','block');
        $('#navPathArea').css('display','none');
        mainAppVars.urlmalform  =   false;
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        mainAppVars.searchInputText =   '';
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppObject.setVariablesFromParams(urlparams);
        if(mainAppVars.urlmalform){
            $location.path('/');
        }
        $rootScope.l_ch =   l_ch;
        angular.element('#head').scope().searchInputText  =   mainAppVars.searchInputText;
        if(typeof $rootScope.contentList != "undefined")
            delete $rootScope.contentList;
        var data    =   {},config={},successCallback = function (response) {
            response = response.data;
            if(response.status){
                $scope.categoryItems    =   response.data;
                angular.element('#aboutWT').removeClass('hide');
            }
            else{
                console.log(response);
            }
        }, errorCallback = function (response) {
            console.log(response);
        };
        $http.get("./"+dataRequestURL+"?request=getHomeVidData", data).then(successCallback, errorCallback);    

        $scope.goToMainContent  =   function(){
            $('body').animate({'scrollTop':0},1000);
        };

    };
    homeController.$inject  =   ['$scope', '$routeParams', '$location', '$http', '$rootScope'];
    angular.module('wt').controller('homeController', homeController);
}());(function () {
    var headerController  =   function ($scope, $route, $routeParams, $location, $http, serviceBreadCrumbs, $rootScope) {
        $scope.setSearchView    =   function(){
            var locationStr =   '/search';
            if(!IsValueNull(mainAppVars.searchInputText)){
                locationStr += '/search='+ mainAppVars.searchInputText;
            }
            if(!IsValueNull(mainAppVars.searchCategory) && mainAppVars.searchCategory && mainAppVars.searchCategory != "0"){
                locationStr += '&catfilter='+mainAppVars.searchCategory;
            }
            if(locationStr == $location.$$path){
                $route.reload();
            }
            else{
                $location.path(locationStr);
            }
            $scope.$apply();
        }
        $rootScope.setCatBreadCrumb =   function(category){
            var temp_category   =   category;
            var temp_arr = [];
            while(true){
                temp_arr.push({name:mainAppVars.catNameObject[temp_category],link:'search/category='+temp_category});
                temp_category	=	parentCatObj[temp_category];
                if(typeof(temp_category)	==	"undefined"){
                    break;
                }
            }
            return temp_arr.reverse();
        };
        $scope.showFeedbackModal    =   function(){
            this.resetFeedbackInputs();
            $('#feedback-request-alert').html('It will be great to receive your valuable feedback/suggestion');
            UI_openModal('#feedback-form');
        };
        $scope.resetFeedbackInputs =   function(){
            $('#feedback-title').val('');
            $('#feedback-description').val('');
        };

        $scope.logoutUser	=	function(){
            if(typeof(gapi)	==	"undefined")
            {
                console.log("Unable to download gapi");
                return false;
            }
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
            });
            var xhrObj = new CommonUtils.remoteCallClass();
            xhrObj.requestData  =   {'request':'logout'};
            xhrObj.asyncPostRequest('./'+dataRequestURL,this.userLogoutRequestCallback);
        };
        $scope.userLogoutRequestCallback	=	function(response){
            response    =   JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                    location.reload();
            }
            else{
                UI_alert('Error in logout');
            }
        };
        $scope.getKeywordMatch  =   function(event){
            getKeywordMatch(event);
        };
        $scope.$on('breadCrumbData',function(event,data){
            $scope.BreadCrumbs = data;
        });
        $scope.gotoCuration = function(){
            if(!l_ch){
                mainAppVars.redirectUrlIndex = 1;
                UI_openModal('#sign-in-container');
            }
            else{
                location.href = './?page=list&request=curate';
            }
        };
        $scope.gotoabout    =   function(){
            $('body').animate({'scrollTop':($('#aboutWT')[0].offsetTop - 50)},1000);
        };
        $scope.gotoHome = function(){
            location.href = './';
            return true;
        };
        $scope.toggleSmallScreenControls = function(button,showOpt){
            if(showOpt){
                $('#headlogo').css('display','none');
                $('.smallScreenComponent').css('opacity',0);
                if(button == "search"){
                    $('#headsearch').css('opacity','0').removeClass('hidden-xs').animate({'opacity':'1'},300);
                }
                else if(button == "menu"){
                    $('#headbutton,#headcategory').css('opacity','0').removeClass('hidden-xs').animate({'opacity':'1'},300);
                }
            }
            else{
                $('#headlogo').css('display','block');
                $('.smallScreenComponent').css('opacity',1);
                $('#headsearch,#headcategory,#headbutton').animate({'opacity':'1'},300).addClass('hidden-xs').css('opacity','0');
            }
        };
        $scope.setCategoryData  =   function(){
            var catData	=	data.categories;
            UI_createJsonUL('#categorydropdown',{'html':catData});
            UI_createDropdown('#categorydropdown');
/*
            $('#categorydropdown > ul').children('li:nth-child(n+7)').addClass('hiddenElem');
            $('#categorydropdown > ul').append('<li class="showMoreCat"><a href="#">Show more</a></li>');
*/
//            createSubmenu();
            $('#categorydropdown > button').removeClass('btn-default').addClass('btn-link');
            UI_postAddon('#headsearchinput','glyphicon-search',false,'getKeywordMatch');
            if(!youtubeListFlag){
                UI_preAddon('#headsearchinput','<div id="searchBoxCat" data-label="All Categories"></div>');
            }
            catData.splice(0,0,{'link':'#','label':'All Categories'});
            UI_createJsonUL('#searchBoxCat',{'html':catData});
            catData.splice(0,1);
            UI_createDropdown('#searchBoxCat');
            UI_createModal('#sign-in-container','','','','resetSignUpOption',false);
            UI_bindModalButton('#headLoginButton','#sign-in-container');
            mainCatArray    =   [];
            for(var key in catData){
                mainCatArray.push(catData[key]['attr']['data-catid']);
                mainAppVars.catNameObject[catData[key]['attr']['data-catid']] = catData[key]['label'];
                $('#recommendcategoryInput').append('<option value="'+catData[key]['attr']['data-catid']+'">'+catData[key]['label']+'</option>');
            };
            var subCatData = data.allStructureCategories;
            parentCatObj    =   {};
            for(var key in subCatData){
                for(var i=0;i<subCatData[key].length;i++){
                parentCatObj[subCatData[key][i]['attr']['data-catid']]  =   key;
                    mainAppVars.catNameObject[subCatData[key][i]['attr']['data-catid']] = subCatData[key][i]['label'];
                }
            };
            mainAppVars.catBreadcrumb   =   {};
            for(var key in mainAppVars.catNameObject){
                var temp_category   =   key;
                var temp_str = '';
                while(true){
                    temp_str = mainAppVars.catNameObject[temp_category] + ' / ' + temp_str;
                    temp_category	=	parentCatObj[temp_category];
                    if(typeof(temp_category)	==	"undefined"){
                        mainAppVars.catBreadcrumb[key]  =   temp_str.replace(/\/([^\/]*)$/,'$1');;
                        break;
                    }
                }
            }

        };
        $scope.BreadCrumbs  =   serviceBreadCrumbs.pathObject;
        $scope.$watch(
            function(){serviceBreadCrumbs.pathObject},
            function(newValue, oldValue){
                $scope.BreadCrumbs  =   serviceBreadCrumbs.pathObject;
            }
        );
    };
    headerController.$inject  =   ['$scope', '$route', '$routeParams', '$location', '$http', 'serviceBreadCrumbs', '$rootScope'];
    angular.module('wt').controller('headerController', headerController);
}());(function () {
    var searchController  =   function ($scope, $routeParams, $location, $rootScope, $http, $filter, serviceListPagination, serviceBreadCrumbs) {
        $('body').scrollTop(0);
        mainAppVars.urlmalform  =   false;
        $('#sidebar').css('display','block');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppVars.nochildfilter   =   false;
        mainAppObject.resetVariables();
        mainAppObject.setVariablesFromParams(urlparams);
        if(mainAppVars.urlmalform){
            $location.path('/');
        }
        angular.element('#head').scope().searchInputText  =  decodeURIComponent(mainAppVars.searchInputText);
        $scope.urlParams    =   encodeURIComponent($routeParams.searchParams);
        var breadCrumbInput    =   [];
        $scope.categoryFacets   =   {};
        $scope.BreadCrumbs  =   [];
        $scope.searchRows   =   mainAppVars.searchRows;
        $scope.langFilters  =   data.languages;
        for(var langItem in $scope.langFilters){
            if($scope.langFilters[langItem]['status'] != '1'){
               delete $scope.langFilters[langItem]; 
            }
        }
        $scope.langFilters['0'] = {id:'0',language:'Any Language'};
        $scope.langfilter = mainAppVars.searchLanguage ? mainAppVars.searchLanguage : $scope.langFilters['0'].id;

        $scope.setSearchView    =   function(){
            var locationStr =   '/search';
            if(!IsValueNull(mainAppVars.searchInputText)){
                locationStr += '/search='+mainAppVars.searchInputText;
            }
            if(!IsValueNull(mainAppVars.searchCategory)){
                if(IsValueNull(mainAppVars.searchInputText)){
                    locationStr += '/category='+mainAppVars.searchCategory;
                    if($location.absUrl().indexOf('&catfilter=') != -1){
                        locationStr += '&catfilter=other';
                    }
                }
                else{
                    locationStr += '&catfilter='+mainAppVars.searchCategory;
                    if($location.absUrl().indexOf('&filter=') != -1){
                        locationStr += '&filter=strict';
                    }
                }
            }
            if(mainAppVars.searchStart > 0){
                locationStr += '&start='+mainAppVars.searchStart;
            }
            if(mainAppVars.searchLanguage){
                locationStr += '&langfilter='+mainAppVars.searchLanguage;
            }
            $location.path(locationStr);
        }

        if(mainAppVars.searchType == "category"){
            var searchObject    =   new mainApp.searchModule();
            searchObject.searchCategory();
            breadCrumbInput =   breadCrumbInput.concat($rootScope.setCatBreadCrumb(mainAppVars.searchCategory));
//            breadCrumbInput.push({name:mainAppVars.catBreadcrumb[mainAppVars.searchCategory] ,link:'search/category='+mainAppVars.searchCategory});
        }
        else if(mainAppVars.searchType == "keyword"){
            var searchObject    =   new mainApp.searchModule();
            searchObject.searchKeyword();
//            breadCrumbInput.push({name:mainAppVars.searchInputText ,link:'search/search='+mainAppVars.searchInputText});
        }
        if(mainAppVars.searchLanguage){
//            breadCrumbInput.push({name:'Language: '+$scope.langFilters[mainAppVars.searchLanguage]['language'] ,link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&langfilter='+mainAppVars.searchLanguage});
        }
        if(mainAppVars.searchStart > 0){
            var pageIndex = Math.ceil(mainAppVars.searchStart/mainAppVars.searchRows)+1;
//            breadCrumbInput.push({name:'Page #'+pageIndex ,link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&start='+mainAppVars.searchStart});
        }
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
        $scope.openContentInfo  =   function(event){
            openContentInfo(event);
        };
        $scope.filterListByLanguage	=	function(){
            if(this.langfilter == 0){
                mainAppVars.searchLanguage = false;
            }
            else{
                mainAppVars.searchLanguage  =   this.langfilter;
            }
            mainAppVars.searchStart = 0;
            this.setSearchView();
        };
        $scope.getFacetUrl  =   function(index,key){
            var hrefurl =   '#';
            if(mainAppVars.searchType == "keyword"){
                hrefurl = 'search/search='+mainAppVars.searchInputText;
                if(key != "other"){
                   hrefurl += '%26catfilter='+key; 
                }
                if(key == "other"){
                   hrefurl += '%26catfilter='+mainAppVars.searchCategory; 
                   hrefurl += '%26filter=strict'; 
                }
            }
            else if(mainAppVars.searchType == "category"){
                hrefurl = 'search/category='+key;
                if(key == 'other'){
                    hrefurl = 'search/category='+mainAppVars.searchCategory;
                    hrefurl += '%26catfilter='+key;
                }
            }
            if(mainAppVars.searchLanguage){
                hrefurl += '%26langfilter='+mainAppVars.searchLanguage;
            }
            return hrefurl;
        };
        $scope.filterListByAge		=		function(event){
        };
        $scope.resetListFilters	=	function(event){
        };
        $scope.resetfilterUI	=	function(){
        };
        $scope.DummyArray   =   function(n){
            if(angular.isNumber(n) && parseInt(n) == n)
                return new Array(n);
        }
        $scope.checkTopics =   function(jsonString){
            var topicsDefined    =   false;
            if(!IsValueNull(jsonString)){
                topicsDefined    =   true;
            }
            return topicsDefined;
        };
        $scope.getTopicsArr =   function(jsonString,index){
            return angular.fromJson(jsonString)['topic_info'];
        };
        $scope.$watch(function(){return $rootScope.contentList},
            function(newValue, oldValue) {
                $scope.Pagination   =   {};
                if(typeof(newValue) == "object" && newValue != oldValue){
                    $scope.Pagination   =   serviceListPagination.createPagination(newValue);
                }
            }
        );
    };
    searchController.$inject  =   ['$scope', '$routeParams', '$location','$rootScope', '$http', '$filter', 'serviceListPagination', 'serviceBreadCrumbs'];
    angular.module('wt').controller('searchController', searchController);
}());(function () {
    var viewController  =   function ($scope, $routeParams, $location, $rootScope, $http, $filter, serviceListPagination, serviceBreadCrumbs) {
        $('body').scrollTop(0);
        $('#sidebar').css('display','none');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        mainAppVars.urlmalform  =   false;
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppVars.currentBookmarkId   =   false;
        mainAppObject.setVariablesFromParams(urlparams);
        if(mainAppVars.urlmalform){
            $location.path('/');
        }
        $scope.urlParams    =   encodeURIComponent($routeParams.viewParams);
        $scope.loginUser    =   mainAppVars.loginUser;
        $scope.searchRows   =   mainAppVars.searchRows;
        if(typeof($rootScope.listLimitStart) == "undefined"){
            $rootScope.listLimitStart   =   0;
        }
        angular.element('#head').scope().searchInputText  =   decodeURIComponent(mainAppVars.searchInputText);
        mainAppVars.playerReady =   false;
        $scope.playerVideoId    =   mainAppVars.videoSourceId;
        $scope.$on('youtube.player.ready', function ($event, player) {
            vidPlayerObject  =   CreatePlayerWidget($scope.vidPlayerObject, 'YT', 'ytplayerdiv', '100%', '100%', true,true);
            mainAppVars.playerReady = true;
        });

        $scope.$on('youtube.player.buffering', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.queued', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.ended', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.playing', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
            $scope.currentVideoTime =   vidPlayerObject.playerHandle.H.currentTime;
        });
        $scope.$on('youtube.player.paused', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.error', function ($event, player, dataObj) {
            vidPlayerObject.onPlayerError(dataObj);
            console.log(dataObj);
        });


        $scope.mainCatObject    =   mainCatArray;
        $scope.recommendCat =   1;
        $scope.$watch(
            function(){
                return $rootScope.contentList;
            },
            function(oldValue,newValue){
                var getListData =   false;
                if(typeof(newValue) == "undefined" || (mainAppVars.currentVideoId.indexOf('yt-') !=0 && typeof(newValue.documents['wt-'+mainAppVars.currentVideoId]) == "undefined" && typeof(newValue.currentVideoData) == "undefined")){
                    getListData =   true;
                }
                else if(oldValue == newValue){
                    $scope.currentVideoObject   =   $rootScope.contentList.documents['wt-'+mainAppVars.currentVideoId] || newValue.currentVideoData;
                }
                else{
                      $scope.currentVideoObject   =   $rootScope.contentList.currentVideoData || $rootScope.contentList.documents['wt-'+mainAppVars.currentVideoId];
                        if(typeof($scope.currentVideoObject) == "undefined"){
                            $scope.getCurrentVideoData();
                        }
                }
                if(!getListData && typeof($scope.currentVideoObject) == "undefined"){
                    $location.path('/');
                }
                var breadCrumbInput    =   [];
                $scope.BreadCrumbs  =   [];
                if(mainAppVars.searchType == "category"){
                    if(getListData){
                        var searchObject    =   new mainApp.searchModule();
                        searchObject.searchCategory();
                    }
                    else{
                        breadCrumbInput =   breadCrumbInput.concat($rootScope.setCatBreadCrumb($scope.currentVideoObject.category));
//                        breadCrumbInput.push({name:mainAppVars.catBreadcrumb[mainAppVars.searchCategory] ,link:'search/category='+mainAppVars.searchCategory});
                    }
                }
                else if(mainAppVars.searchType == "keyword"){
                    if(getListData){
                        var searchObject    =   new mainApp.searchModule();
                        searchObject.searchKeyword();
                    }
                    else{
                        if(!IsValueNull($scope.currentVideoObject.category)){
                            breadCrumbInput =   breadCrumbInput.concat($rootScope.setCatBreadCrumb($scope.currentVideoObject.category));
//                            breadCrumbInput.push({name:mainAppVars.catBreadcrumb[$scope.currentVideoObject.category] ,link:'search/category='+$scope.currentVideoObject.category});
                        }
                    }
                }
                else if(mainAppVars.searchType  == "bookmarks"){
                    if(getListData){
                        var bookmarkObject      =  new mainApp.bookmarkModule();
                        bookmarkObject.readBookmarkByUser(mainAppVars.searchStart,mainAppVars.searchRows);
                    }
                    else{
//                        breadCrumbInput.push({name:'All Bookmarks' ,link:'bookmark/all'});
                    }
                }

                if(!getListData){
                    var viewClassObject =   new mainApp.viewModule();
                    viewClassObject.getVideoBookmarksData();

                    if(mainAppVars.searchStart > 0){
                        var pageIndex = Math.ceil(mainAppVars.searchStart/mainAppVars.searchRows)+1;
//                        breadCrumbInput.push({name:'Page #'+pageIndex ,link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&start='+mainAppVars.searchStart});
                    }
                    if(!IsValueNull(mainAppVars.currentVideoId)){
                        if(breadCrumbInput.length > 0 && typeof(breadCrumbInput[breadCrumbInput.length-1]['link']) != "undefined"){
                            breadCrumbInput.push({name:$scope.currentVideoObject['string'],link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&videoId='+mainAppVars.currentVideoId+'&contetsrc='+mainAppVars.videoSource+'&sourcevidid='+mainAppVars.videoSourceId});
                        }
                        else{
                            breadCrumbInput.push({name:$scope.currentVideoObject['string'],link:'#'});
                        }
                    }

                    if(mainAppVars.currentBookmarkId){
                        $scope.playusing    =   'bookmarks';
                    }
                    else if($scope.currentVideoObject.topicinfo.length > 0){
                        $scope.playusing    =   'topics';
                    }
                    else{
                        $scope.playusing    =   'normal';
                    }

                    $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
                    $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
                    $scope.playVideo();
                }
            }
        );
        var popoverTimeOut;
        $scope.showPopover  =   function(event){
            $(event.target).popover('show');
        };
        $scope.getCurrentVideoData =   function(){
            var xhrObj = new CommonUtils.remoteCallClass();
            xhrObj.requestData  =   {request:'currentVideoData',data:{videoId:mainAppVars.currentVideoId}};
            xhrObj.syncGetRequest('./'+dataRequestURL,this.CurrentVideoDataCallback);
        };
        $scope.CurrentVideoDataCallback =   function(response){
            response    =   JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                response    =   response.data;
                $scope.currentVideoObject   =   response;
            }
        };
        $scope.hidePopover  =   function(event){
            var eventTarget =   $(event.target);
            eventTarget.popover('hide');
        };


        $scope.playVideo    =   function(){
            if(mainAppVars.playerReady){
                $rootScope.recentContentList    =   $rootScope.recentContentList || {};
                var viewClassObject =   new mainApp.viewModule();
                switch($scope.playusing){
                    case 'normal':
                        vidPlayerObject.LoadNewVideoByID(mainAppVars.videoSourceId);
                        break;
                    case 'topics':
                        viewClassObject.CreateSegment($scope.currentVideoObject.topicinfo);
                        break;
                    case 'bookmarks':
                        viewClassObject.CreateSegment($scope.currentVideoObject.bookmarkTopics);
                        break;
                    default:
                        break;
                }
                if($('.suggestionlist-container .list-item-row.active').length > 0){
                    $('.suggestionlist-container .list-item-row.active')[0].scrollIntoView();
                }
                $rootScope.recentContentList[mainAppVars.currentVideoId]  =   $scope.currentVideoObject;
                $rootScope.recentContentList[mainAppVars.currentVideoId]['timestamp']  =   new Date().getTime();
                $rootScope.recentContentList[mainAppVars.currentVideoId]['recentPlayUrl']  =   'view/'+$scope.urlParams.split('%26videoId')[0]+'&videoId='+$scope.currentVideoObject.id+'&contentsrc=Youtube&sourcevidid='+$scope.currentVideoObject.videoid;
            }
            else{
                setTimeout(function(){
                    $scope.playVideo();
                },500);
            }
        };
        $scope.showActiveUserVideoAction	=	function(event){
            var currentAction = $(event.target).closest('.actionItem');
            $('.actionDataContainer').css('display','none');
            if(currentAction.hasClass('activeActionItem')){
                $('.activeActionItem').removeClass('activeActionItem');
                return true;
            }
            $('.activeActionItem').removeClass('activeActionItem');
            currentAction.addClass('activeActionItem');
            var contentDivClass = currentAction.attr('actDiv');
            $('.'+contentDivClass).css('display','block');
            if(contentDivClass == 'bookmarkBox'){
                $scope.bookmarkShown();
            }
        };
        $scope.showVideoRecommendInput = function(){
            $('.recommendPage').css('display','none');
            $('#recommPage_2').css({'display':'block'});
            if(mainAppVars.recaptcha){
                loadRecaptcha();
            }
//          sendCaptchaRequest('#recomCaptcha');
        };
        $scope.build_category_breadcrumb	=	function(category_id,suggested_category){
            var temp_category	=	category_id;
            var temp_bread		=	[];	
            if(typeof(mainAppVars.catNameObject[category_id])	==	"undefined"	||	IsValueNull(category_id))
            {
                temp_bread.push(suggested_category);
            }
            else
            {
                while(true)
                {
                    temp_bread.unshift(mainAppVars.catNameObject[temp_category]);
                    temp_category	=	parentCatObj[temp_category];
                    if(typeof(temp_category)	==	"undefined")
                    {
                        temp_bread.push(suggested_category);
                        break;
                    }
                }
            }
            return temp_bread.join("/");
        }
        $scope.bookmarkShown    =   function(){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.pauseVideo();
            }
            if($scope.currentVideoObject.bookmarkTopics.length == 0 && $('#video-bookmark-table').find('tr.inputRow:not(.dummyRow)').length == 0){
                var topicClassObj   =   new topicClass.handler();
                topicClassObj.addTopicInputRow('','top','video-bookmark-table');
            }
        }
        $scope.submitContentRecommendation	=	function(){
            var recomFormValid = true;
            $('#recommendation-input-form .has-error').removeClass('has-error');
            $('#recommendation-input-form').find('input,select').each(function(){
                if(IsValueNull(this.value)){
                    if(this.id == 'otherCategoryInput' && $('#recommendcategoryInput').val() != 0){
                        return true;
                    }
                    $(this).focus();
                    recomFormValid = false;
                    $scope.showRecommendationErrorMsg(RecommendErrorMsg[0],this);
                    return false;
                }
            });
            if(!recomFormValid){
                return false;
            }
            else{
                var recommCat	=	$('#recommendation-input-form select').val();
                if(recommCat == 0){
                    newRecomCat = $('#otherCategoryInput').val();
                    var cat_bread	=	this.build_category_breadcrumb("",newRecomCat)
                }
                else{
                    var newRecomCat = '';
                    var cat_bread	=	this.build_category_breadcrumb(recommCat,newRecomCat)
                }

                var recomReason	=	$('#recommendDescription').val();
                var captchaText	=	grecaptcha.getResponse(reCaptchaWidget);

                UI_blockInterface();
                var xhrObj = new CommonUtils.remoteCallClass();
                xhrObj.requestData  =   {request:'recommend',data:{videoId:$scope.playerVideoId,title:$scope.currentVideoObject.string,videoSource:'yt',catId:recommCat,newCatName:newRecomCat,category_breadcrumb:cat_bread,recommendDesc:recomReason,captcha:captchaText}};
                xhrObj.syncPostRequest('./'+dataRequestURL,this.RecommendationRequestCallback);
            }
        };
        $scope.RecommendationRequestCallback	=	function(response){
            response    =   JSON.parse(response);
            UI_unBlockInterface();
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                response    =   response.data;
                if(grecaptcha){
                    grecaptcha.reset(reCaptchaWidget);
                }
//              sendCaptchaRequest('#recomCaptcha');
                $('.recommendPage').css('display','none');
                $('#recommPage_3').css({'display':'block'});
            }
            else{
                $scope.showRecommendationErrorMsg(response.error,this);
                if(grecaptcha){
                    grecaptcha.reset(reCaptchaWidget);
                }
//              sendCaptchaRequest('#recomCaptcha');
            }
        };
        $scope.showRecommendationErrorMsg	=	function(msg,elem){
            $(elem).closest('.form-group').addClass('has-error');
            $('#recommPageError span').html(msg);
        };
        $scope.saveBookmarkData =   function(event){
            saveBookmarkData(event);
        }
        $scope.playContentThroughBookmark   =   function(event){
            $scope.playusing    =   'bookmarks';
            $scope.playVideo();
        }
        $scope.playContentThroughTopics   =   function(event){
            $scope.playusing    =   'topics';
            $scope.playVideo();
        }
        $scope.playContentNormal    =   function(event){
            $scope.playusing    =   'normal';
            if( typeof newSegInfo != "undefined"){
                newSegInfo['segmentList'] = [];
                vidPlayerObject.SegmentList =   0;
            }
            $scope.playVideo();
        };
        $scope.playVideoSegment =   function(event){
            if(event.target.hasAttribute('data-topic-index'))
                var nodeID	=	$(event.target).attr('data-topic-index');
            else{
                var nodeID	=	$(event.target).closest('[data-topic-index]').attr('data-topic-index');
            }
            vidPlayerObject.PlaySegmentIndex(nodeID); 
        };
        $scope.addNewTopicRow  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.pauseVideo();
            }
            addNewTopicRow(event);
        };
        $scope.cancelTopicAdd  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.playVideo();
            }
            cancelTopicAdd(event);
        };
        $scope.saveTopicRow  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.playVideo();
            }
            saveTopicRow(event);
        };
        $scope.editTopicRow  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.pauseVideo();
            }
            editTopicRow(event);
        };
        $scope.removeTopicRow  =   function(event){
            if(vidPlayerObject.playerHandle){
                vidPlayerObject.playerHandle.playVideo();
            }
            removeTopicRow(event);
        };
        $scope.bindcurrentPTSTimeInput  =   function(event){
            bindcurrentPTSTimeInput(event);
        };
        $scope.$on('$viewContentLoaded', function() {
            (function(d, s, id) {
                FB = null;
                var js, fjs = d.getElementsByTagName(s)[0];
                //if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&version=v2.5&appId=572940442863669";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        });
    };
    viewController.$inject  =   ['$scope', '$routeParams', '$location', '$rootScope', '$http', '$filter', 'serviceListPagination', 'serviceBreadCrumbs'];
    angular.module('wt').controller('viewController', viewController);
}());(function () {
    var footerController  =   function ($scope, $location, $routeParams, $http, $rootScope, serviceBreadCrumbs) {
        $('.section').css('display','none');
        $('body').scrollTop(0);
        $('#sidebar').css('display','none');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        $scope.BreadCrumbs  =   [];
        var breadCrumbInput =   [];
        var breacrumbStr    =   ''
        switch($location.$$path.split('/')[1]){
            case 'aboutUs':
                breacrumbStr    =   'About us'
                break;
            case 'termsOfService':
                breacrumbStr    =   'Terms of Service'
                break;
            case 'privacy':
                breacrumbStr    =   'Privacy statements'
                break;
            case 'legalNotice':
                breacrumbStr    =   'Legal Notices & Trademarks'
                break;
            default:
                break;
        }
        breadCrumbInput.push({name:breacrumbStr,'link':''});
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);

        $scope.submitfeedback  =   function(){
            var feedbackTitle   =   $('#feedback-title').val();
            var feedbackDesc   =   $('#feedback-description').val();
            if(IsValueNull(feedbackTitle) || IsValueNull(feedbackDesc)){
                $('#feedback-request-alert').html('Fill all inputs');
                return false;
            }
            var xhrObj = new CommonUtils.remoteCallClass();
            xhrObj.requestData	=	{'request':'submit_feedback','data':{'title':feedbackTitle,'desc':feedbackDesc}};
            xhrObj.asyncPostRequest("./"+dataRequestURL,this.FeedbackRequestCallback);
            UI_blockInterface();
        };
        $scope.FeedbackRequestCallback =   function(response){
            UI_unBlockInterface();
            response = JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            if(validateResponseCheck){
                $('#feedback-request-alert').html('Feedback submitted successfully');
                $('footer').scope().resetFeedbackInputs();
            }
            else{
                $('#feedback-request-alert').html('Error in feedback submission');
            }
        };
    };
    footerController.$inject  =   ['$scope','$location', '$routeParams', '$http', '$rootScope', 'serviceBreadCrumbs'];
    angular.module('wt').controller('footerController', footerController);
}());(function () {
    var profileController  =   function ($scope, $routeParams, $location, $http, $rootScope, serviceBreadCrumbs) {
        if(!l_ch){
            $location.path('/');
        }
        $('.section').css('display','none');
        $('body').scrollTop(0);
        $('#sidebar').css('display','none');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        $scope.profileData  =   [];
        $scope.loginType    =   'GOOGLE';
        $scope.BreadCrumbs  =   [];
        var breadCrumbInput =   [];
        var data    =   {},config={},successCallback = function (response) {
            response = response.data;
            if(response.status){
                $scope.profileData    =   response.data;
                $scope.loginType    =   $scope.profileData.loginType;
                $scope.locationCountry['name']  =   $scope.profileData.location;
            }
            else{
                console.log(response);
            }
        }, errorCallback = function (response) {
            console.log(response);
        };

        $http.get("./"+dataRequestURL+"?request=user_profile_read", data).then(successCallback, errorCallback);    

        $scope.editProfileInformation          =   function(event){
            var data    =   {},config={},country_jsonSuccessCallback = function (response) {
                    $scope.countriesJson    =   response.data;
             }, country_jsonErrorCallback = function (response) {
                 console.log(response);
             };

            $http.get("./"+dataRequestURL+"?request=country_json", data).then(country_jsonSuccessCallback, country_jsonErrorCallback);

            $('.profileUpdateMessageBox').text('');
            $('.editOption').addClass('hidden');
            $('.actionButton').removeClass('hidden');
            var profileInfoContainer    =   $('#generalInfoUpdate');
            var inputFields =   profileInfoContainer.find('input,select');
            profileInfoContainer.find('.display-entry').addClass('hidden');
            inputFields.each(function(){
                $(this).removeClass('hidden').val($(this).next('.display-entry').text());
            });
        };

        breadCrumbInput.push({name:'My Profile','link':''});
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
        $scope.locationCountry  =   {};

        $scope.saveProfileInformation          =   function(event){
            var userProfileForm =   $('#generalInfoUpdate');
            var remoteCallObj   =   new CommonUtils.remoteCallClass();
            if(userProfileForm.hasClass('hidden')){
                userProfileForm =   $('#passwordUpdateForm');
                var current_pass    =   userProfileForm.find('#current-password').val();
                var new_pass        =   userProfileForm.find('#new-password').val();
                var confirm_pass    =   userProfileForm.find('#confirm-password').val();
                if(current_pass	==	""){
                    $('.profileUpdateMessageBox').text('Current password cannot be blank').addClass('bg-danger');
                    return false;
                }
                if(new_pass	==	""){
                    $('.profileUpdateMessageBox').text('New password cannot be blank').addClass('bg-danger');
                    return false;
                }
                if(new_pass != confirm_pass){
                    $('.profileUpdateMessageBox').text('New password and confirm password do not match').addClass('bg-danger');
                    return false;
                }
                remoteCallObj.requestData   =   {'request':'user_profile_save','data':{'current_password':current_pass,'password':new_pass}};
                remoteCallObj.syncPostRequest('./'+dataRequestURL, this.profileInfoSaveRequestCallback);
            }
            else{
                userProfileForm.find('#sign-in-firstname').val(userProfileForm.find('#sign-in-firstname').val().trim());
                userProfileForm.find('#sign-in-lastname').val(userProfileForm.find('#sign-in-lastname').val().trim());
                if(IsValueNull(userProfileForm.find('#sign-in-firstname').val())){
                    $('.profileUpdateMessageBox').text('First name cannot be blank').addClass('bg-danger');
                    return false;
                }
                var user_username    =   userProfileForm.find('#sign-in-firstname').val()+' '+userProfileForm.find('#sign-in-lastname').val();
/*
                var user_age    =   userProfileForm.find('#sign-in-age').val();
                var user_phone    =   userProfileForm.find('#sign-in-phone').val();
*/
                var user_location   =   $scope.locationCountry.name;
                remoteCallObj.requestData   =   {'request':'user_profile_save','data':{'username':user_username,/*'age':user_age,*/'location':user_location/*,'phone':user_phone*/}};
                remoteCallObj.syncPostRequest('./'+dataRequestURL,this.profileInfoSaveRequestCallback);
            }
        };

        $scope.profileInfoSaveRequestCallback  =   function(response){
            response    =   JSON.parse(response);
            $('.profileUpdateMessageBox').removeClass('bg-success,bg-danger');
            var validateResponseCheck   =   validateAppResponse(response);
            var userProfileForm =   $('#generalInfoUpdate');
            if(validateResponseCheck){
                if(userProfileForm.hasClass('hidden')){
                    $('.profileUpdateMessageBox').text('Password updated successfully').addClass('bg-success');
                }
                else{
                    $('#userNameArea').attr('title',$('#sign-in-firstname').val()+' '+$('#sign-in-lastname').val()).text('Hi, '+$('#sign-in-firstname').val());
                    $('.user_name').text($('#sign-in-firstname').val()+' '+$('#sign-in-lastname').val());
                    $('.profileUpdateMessageBox').text('Profile updated successfully').addClass('bg-success');
                }
                $('.editOption').removeClass('hidden');
                $('.actionButton').addClass('hidden');
                if(userProfileForm.hasClass('hidden')){
                    userProfileForm.removeClass('hidden')
                    userProfileForm =   $('#passwordUpdateForm');
                    userProfileForm.addClass('hidden')
                    userProfileForm.find('input').each(function(){
                        this.value = '';
                    });
                }
                else{
                    var inputFields =   userProfileForm.find('input');
                    userProfileForm.find('.display-entry').removeClass('hidden');
                    inputFields.each(function(){
                        $(this).next('.display-entry').text($(this).val());
                        $(this).addClass('hidden').val('');
                        userProfileForm.find('select').addClass('hidden');
                    });
                    var locationText    =   $('.profile-location.display-entry').text($scope.locationCountry.name);
                }
            }
            else{
                if(IsValueNull(response.error))
                    response.error  =   'Profile not updated';
                $('.profileUpdateMessageBox').text(response.error).addClass('bg-danger');
            }
        };

        $scope.cancelEditProfileInformation    =   function(event){
            $('#generalInfoUpdate').removeClass('hidden');
            $('#passwordUpdateForm').addClass('hidden');
            $('.actionButton').addClass('hidden');
            $('.editOption').removeClass('hidden');
            $('.profileUpdateMessageBox').text('').removeClass('bg-success,bg-danger');
            var profileInfoContainer    =   $('#generalInfoUpdate');
            var inputFields =   profileInfoContainer.find('input');
            profileInfoContainer.find('.display-entry').removeClass('hidden');
            inputFields.each(function(){
                $(this).addClass('hidden').val('');
            });
            profileInfoContainer.find('select').addClass('hidden');
        };

        $scope.closeProfile =   function(){
            window.history.back();
        };

        $scope.changePasswordInformation   =   function(event){
            $('.profileUpdateMessageBox').text('');
            $('.editOption').addClass('hidden');
            $('.actionButton').removeClass('hidden');
            $('#generalInfoUpdate').addClass('hidden');
            var profileInfoContainer    =   $('#passwordUpdateForm').removeClass('hidden');
            var inputFields =   profileInfoContainer.find('input');
            inputFields.each(function(){$(this).val('');});
        };

    };
    profileController.$inject  =   ['$scope', '$routeParams', '$location', '$http', '$rootScope', 'serviceBreadCrumbs'];
    angular.module('wt').controller('profileController', profileController);
}());(function () {
    var bookmarkController  =   function ($scope, $routeParams, $location, $http, $rootScope, serviceBreadCrumbs) {
        if(!l_ch){
            $location.path('/');
        }
        $('.section').css('display','none');
        $('body').scrollTop(0);
        $('#sidebar').css('display','block');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');

        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppVars.searchStart =   0;
        $scope.BreadCrumbs  =   [];
        var breadCrumbInput =   [];
        mainAppObject.setVariablesFromParams(urlparams);
        $scope.urlParams    =   encodeURIComponent($routeParams.searchParams);
        $scope.searchStart   =   mainAppVars.searchStart;
        $rootScope.listLimitStart    =   0;
        $scope.searchRows   =   mainAppVars.searchRows;   
        $scope.openContentInfo  =   function(event){
            openContentInfo(event);
        };
        $rootScope.contentList   =   {documents:{},numFound:0};
        $scope.getBookmarkdata      =  function(start,rows){
            var bookmarkObject      =   new mainApp.bookmarkModule();
            bookmarkObject.readBookmarkByUser(start,rows);
        };
        breadCrumbInput.push({name:'All Bookmarks','link':''});
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
        $scope.getTopicsJSON    =   function(option,index){
            option.bookmarkTopics   =   JSON.parse(option.topicinfo)['topic_info'];
        };
        $scope.getBookmarkdata(mainAppVars.searchStart,mainAppVars.searchRows);
        $scope.getItemCount =   function(objectVar){
            if(typeof objectVar == "object"){
                $scope.objectLength =   Object.keys(objectVar).length;
                $scope.$apply();
            }
        };
    };
    bookmarkController.$inject  =   ['$scope', '$routeParams', '$location','$http', '$rootScope', 'serviceBreadCrumbs'];
    angular.module('wt').controller('bookmarkController', bookmarkController);
}());(function () {
    var myCurationController  =   function ($scope, $routeParams, $location, $http, $rootScope, serviceBreadCrumbs) {
        if(!l_ch){
            $location.path('/');
        }
        $('#moto').css('display','none');
        $('#navPathArea').css('display','block');
        $scope.BreadCrumbs  =   [];
        var breadCrumbInput =   [];
        breadCrumbInput.push({name:'My Curations','link':''});
        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);

        var extScripts  =   [
            {identifier:'jquery-ui',script:'./Common/js/jqueryUI/jquery-ui.custom.js'},
            {identifier:'grid-locale',script:'./Common/js/grid.locale-en.js'},
            {identifier:'jqgrid',script:'./Common/js/jquery.jqGrid.min.js'},
            {identifier:'grid-related',script:'./Common/js/GridRelated.js'},
            {identifier:'common-functions',script:'./Common/js/commonFunctions.js'},
            {identifier:'curation-grid',script:'./wisdom-talkies/js/myCurationGridData.js'},
            {identifier:'render-grid',script:'./Common/js/renderGrid.js'},
            {identifier:'create-jqgrid',script:'./wisdom-talkies/js/createjqgrid.js'}
        ];
        for(var i=0;i< extScripts.length;i++){
            if($('[data-identifier="'+extScripts[i]['identifier']+'"]').length > 0){
                ResizeCurationGrid=0;
                RenderJQGrids();
                break;
            }
            else{
                var elem    =   document.createElement('script');
                elem.setAttribute('data-identifier',extScripts[i]['identifier']);
//                elem.setAttribute('async',true);
                elem.setAttribute('type','text/javascript');
                elem.async= false;
                elem.setAttribute('src',extScripts[i]['script']);
                document.body.appendChild(elem);
            }
        }
        $scope.sendCurationDeleteRequest    =   function(event){
            if(IsValueNull(deletionContent)){
                return false;
            }
            UI_blockInterface();
            var remoteCallObj 			=   new CommonUtils.remoteCallClass();
            remoteCallObj.requestData   =   {'request':'curation_delete','data':{'videoID':deletionContent}}
            remoteCallObj.asyncPostRequest('./'+dataRequestURL,$scope.curationDeleteRequestCallback);
        };
        $scope.curationDeleteRequestCallback   =   function(response){
            UI_unBlockInterface();
            response    =   JSON.parse(response);
            var validateResponseCheck   =   validateAppResponse(response);
            $('#delete-curation-message').removeClass('hide');
            if(validateResponseCheck){
                $('#delete-curation-message').html('Content deleted successfully');
                $('#CurationListTable').trigger('reloadGrid');
            }
            else{
                $('#delete-curation-message').html(response.data.code);
            }
            deletionContent =   '';
            $('#delete-curation').find('.hide-toggle').addClass('hide');
        };
        $scope.cancelCurationDelete =   function(event){
            UI_closeModal('#delete-curation');
        }
    };
    myCurationController.$inject  =   ['$scope', '$routeParams', '$location', '$http', '$rootScope', 'serviceBreadCrumbs'];
    angular.module('wt').controller('myCurationController', myCurationController);
}());var mainApp =   mainApp || {};

mainApp.bookmarkModule  =   function(){
    this.readBookmarkById   =   function(bookmarkvideoID){
        $('#video-bookmark-table').find('tr.inputRow:not(.dummyRow),tr.readOnlyRow:not(.dummyRow)').remove();
        $('#bookmark-ptremember,#bookmarks-title').val('');
        var remoteCallObj   =   new CommonUtils.remoteCallClass();
        var bookMarkRequestObj  =   {'videoid':bookmarkvideoID};
        remoteCallObj.requestData   =   {'request':'bookmark_read','data':bookMarkRequestObj};
        remoteCallObj.asyncGetRequest("./"+dataRequestURL,this.videoBookmarkCallback);
    };
    this.videoBookmarkCallback =   function(response){
        response    =   JSON.parse(response);
        var classObj = new mainApp.bookmarkModule();
        var viewscope   =   angular.element('#view').scope();
        viewscope.currentVideoObject['bookmarkTopics'] =   [];
        var validateResponseCheck   =   validateAppResponse(response);
        if(validateResponseCheck){
            response    =   response.data.documents;
            
            if(Object.keys(response).length > 0){
                response    =   response[Object.keys(response)[0]];
                if(!IsValueNull(response)){
                    viewscope.currentVideoObject['bookmarkTopics'] =   JSON.parse(response.topicinfo)['topic_info'];
                    classObj.renderSavedBookMarks(JSON.parse(response.topicinfo)['topic_info']);
                }
            }
        }
        else{
            console.log(response);
        }
    };
    this.renderSavedBookMarks    =   function(bookMarkTopicsArr){
        var topicClassObject    =   new topicClass.handler();
        topicClassObject.renderTopics('video-bookmark-table',bookMarkTopicsArr);
    };
    this.bookmarkDataRequestCallback =   function(response){
        response    =   JSON.parse(response);
        var validateResponseCheck   =   validateAppResponse(response);
        var rootScope   =   angular.element('body').scope();
        rootScope.contentList   =   {documents:{},numFound:0};
        if(validateResponseCheck){
            var documentsObject =   {};
            for(var key in response.data.documents){
                documentsObject['wt-'+key]  =   response.data.documents[key];
            }
            rootScope.contentList  =   {documents:documentsObject,numFound:response.data.numFound};
            var tempTopicsStr   =   '';
            for(var key in rootScope.contentList.documents){
                rootScope.contentList.documents[key]['string']  =   rootScope.contentList.documents[key]['title'];
                tempTopicsStr   =   rootScope.contentList.documents[key]['topicinfo'];
                rootScope.contentList.documents[key]['bookmarkTopics']  =   angular.fromJson(tempTopicsStr)['topic_info'];
                rootScope.contentList.documents[key]['topicinfo']   =   [];
                rootScope.contentList.documents[key]['id']          =   rootScope.contentList.documents[key]['videoid'];
                rootScope.contentList.documents[key]['videoid']     =   rootScope.contentList.documents[key]['sourcevideoid'];
                rootScope.contentList.documents[key]['tnurl']       =   'https://i.ytimg.com/vi/' +rootScope.contentList.documents[key]['sourcevideoid'] + '/default.jpg';
            }
        }
        else{
            console.log(response);
        }
        rootScope.$digest();
    };
    this.saveBookmark       =   function(){
        var bookmarkDataRows    =   $('#video-bookmark-table tbody tr.readOnlyRow:not(.dummyRow)');
        bookMarkTopicsArr =   [];
        var topicsTableBody  =   $('#video-bookmark-table tbody');
        if(topicsTableBody.find('tr.inputRow').length > 1){
            UI_unBlockInterface();
            UI_alert('Please fill the topic details or remove incomplete topic entry');
            return false;
        }

        if(bookmarkDataRows.length == 0){
            bookMarkTopicsArr.push({'topic':$('#bookmarks-title').attr('value'),'start_time':0,'end_time':vidPlayerObject.playerHandle.getDuration()});
        }
        else{
            var topicText,startTime,endTime;
            for(var i=0;i<bookmarkDataRows.length;i++){
                topicText   =   bookmarkDataRows.eq(i).find('.topic-text').attr('data-topic-val');
                startTime   =   bookmarkDataRows.eq(i).find('.topic-start').attr('data-time-val');
                endTime     =   bookmarkDataRows.eq(i).find('.topic-end').attr('data-time-val');
                bookMarkTopicsArr.push({'topic':topicText,'start_time':startTime,'end_time':endTime});
            }
        }
        var bookMarkDataObj =   {};
        var bookmarkTitle   =   $('#bookmarks-title').attr('value');
        var bookmarkPTR     =   $('#bookmark-ptremember').val() || '';
        bookMarkDataObj['topicinfo']        =   JSON.stringify({'topic_info':bookMarkTopicsArr});
        bookMarkDataObj['title']            =   bookmarkTitle;
        bookMarkDataObj['videoid']          =   mainAppVars.currentVideoId;
        bookMarkDataObj['sourcevideoid']    =   mainAppVars.videoSourceId;
        bookMarkDataObj['metadata']         =   bookmarkPTR;
        var remoteCallObj   =   new CommonUtils.remoteCallClass();
        remoteCallObj.requestData   =   {'request':'bookmark_save','data':bookMarkDataObj};
        remoteCallObj.asyncPostRequest("./"+dataRequestURL,this.BookmarkSaveRequestCallback);
        var viewScope   =   angular.element('#view').scope();
        viewScope.currentVideoObject.bookmarkTopics   =   bookMarkTopicsArr;
        if(viewScope.playusing == 'bookmarks'){
            viewScope.playVideo();
        }
        viewScope.$apply();
    };
    this.readBookmarkByUser =   function(start,rows){
        var remoteCallObj       =  new CommonUtils.remoteCallClass();
        remoteCallObj.asyncGetRequest('./'+dataRequestURL+'?'+'request=bookmark_read&data[videoid]=*&data[start_index]='+start+'&data[num]='+rows,this.bookmarkDataRequestCallback);
    };
    this.deleteBookmark     =   function(){
        
    };
    this.BookmarkSaveRequestCallback =   function(response){
        response    =   JSON.parse(response);
        UI_unBlockInterface();
        var validateResponseCheck   =   validateAppResponse(response);
        if(validateResponseCheck){
            UI_alert('Bookmarks saved successfully');
        }
        else{
            UI_alert('Error! Bookmarks not saved');
            bookMarkTopicsArr   =   [];
        }
    };
};
var bookmarkClassObject = null;
var timeOutVar  =   '';
var saveBookmarkData    =   function(event){
    bookmarkClassObject =   bookmarkClassObject || new mainApp.bookmarkModule();
    UI_unBlockInterface();
    clearTimeout(timeOutVar);
    if(IsValueNull(vidPlayerObject.playerHandle)){
        UI_blockInterface();
        timeOutVar  =   setTimeout(function(){saveBookmarkData(event)},1000);
        return true;
    }
    else{
        if(IsValueNull(vidPlayerObject.playerHandle.getDuration())){
            UI_alert('Please wait for the player to load the video ');
            return false;
        }
        UI_blockInterface();
        bookmarkClassObject.saveBookmark();
    }
};var vidPlayerObject =   '';
var playerReady = false;
var gPlayerList = [];
var gPlayerObject   =   0;
var gTimerObj = 0; 
var gEventTypes = {	  ON_END:0, 
	                  ON_PLAY:1, 
	                  ON_PAUSE:2,
	                  ON_BUFFERING:3,
	                  ON_ERROR:4
                  }; 
sVideoSegment.prototype.startTime = 0; 
sVideoSegment.prototype.endTime = 0; 
function sVideoSegment(){
	sVideoSegment.prototype.startTime = 0; 
	sVideoSegment.prototype.endTime = 0; 
	
}

function CreatePlayerWidget(scopePlayerObject, playerType, divID, width, height, bShow,bControls){
	gPlayerObject =  new CVideoPlayer(playerType, divID, width, height, bShow,bControls);
    gPlayerObject.playerHandle = scopePlayerObject; 
    var iframeNode = document.getElementById(gPlayerObject.iFrameID); 
    if(gPlayerObject.bShow == false){
    	gPlayerObject.ShowVideoPlayer(gPlayerObject.bShow); 
    }
    gPlayerObject.bInitialized = true; 
    gPlayerObject.playerState = 'STOPPED';       
    
	return gPlayerObject; 
}

function CVideoPlayer(playerType, divID, width, height, bShow,bControls){
	this.playerType = playerType; //only 'YT' allowed 
	this.iFrameID = divID; //validate if this divId exists
	this.Width = width; 
	this.Height = height; 
	this.bShow = bShow; 
	if(bControls == true)
	  this.Controls = 1; 
	else
		this.Controls = 0; 
	this.CurrentDisplay = 'VISIBLE' ; //'HIDDEN'
	this.playerHandle = 0; 
	this.playerState = 'VOID'; //PLAYING, PAUSED,STOPPED,VOID
	this.currentPTS = 0; 
	this.startPTS = 0; 
	this.endPTS = 0;
	this.bInitialized = false; 
	this.playSegmentFlag =  false; 
	this.segmentHandlerfn = 0; 
	this.currentSegIndex = 0; 
	this.SegmentList = 0 ; 
	this.currentVideoID = 0; 
	this.OnErrorHandlerFn = 0; 
	this.OnPlayHandlerFn = 0; 
	this.OnPauseHandlerfn = 0; 
	this.OnEndHandlderFn = 0; 
	this.OnBufferingHandlerFn=0; 
}


CVideoPlayer.prototype.LoadNewVideoByID = function(videoID, startTime){		
		this.currentVideoID = videoID; 
	  if( this.playerHandle != 'undefined'){
		  this.ShowVideoPlayer(true)  ;  
		  if(this.playerState == 'PLAYING'){
			  this.playerHandle.stopVideo(); 
			  this.playerHandle.clearVideo(); 
		  }		  
		  this.playerHandle.loadVideoById({videoId:videoID, startSeconds:startTime}); 
		 // this.playerHandle.playVideo(); 
		  this.playerState = 'PLAYING';
		  this.videoID=videoID;
		  playSegmentFlag = false; 
	  }	 
}

CVideoPlayer.prototype.UnloadVideo = function(){
	 this.playerHandle.pauseVideo();
	 this.playerHandle.stopVideo(); 
	 this.playerHandle.clearVideo(); 
}

CVideoPlayer.prototype.ShowVideoPlayer = function(bFlag){
	var iframeNode = document.getElementById(this.iFrameID);     
	if(bFlag == false){
		iframeNode.setAttribute('hidden', true);
		this.CurrentDisplay = 'HIDDEN'; 
	}else{
		iframeNode.removeAttribute('hidden');
		this.CurrentDisplay = 'VISIBLE'; 
	}		
};

CVideoPlayer.prototype.onPlayerReady = function(event){
	 event.target.setVolume(70); 	
	 event.target.playVideo();
	 //alert('onPlayerReady'); 
}
  
CVideoPlayer.prototype.Play = function(){
	 this.playerHandle.playVideo(); 
}
 
CVideoPlayer.prototype.Pause= function(){
    this.playerHandle.pauseVideo(); 
}
 
CVideoPlayer.prototype.SeekTo =  function(timeinSec){
    this.playerHandle.seekTo(timeinSec); 
}
 
CVideoPlayer.prototype.GetCurrentPTS =  function(timeinSec){
    return this.playerHandle.getCurrentTime(); 
}
 
 /* return values 
  * 0 – ended
1 – playing
2 – paused
3 – buffering
5 – video cued
  */
CVideoPlayer.prototype.GetPlayerState =  function(timeinSec){
    return this.playerHandle.getPlayerState(); 
}
 
CVideoPlayer.prototype.onPlayerStateChange = function(event){	
    var state = event.data; 
	var fnStr=''; 
	var dur = 0; 
	
	switch(state){	 
	case gEventTypes.ON_PLAY:	
        // alert('Playing Back event'); 
        var startTime = new Number (gPlayerObject.GetCurrentPTS());		 
        dur =  new Number(gPlayerObject.endPTS - startTime);		 
		dur = dur * 1000; 
		 
        if(gPlayerObject.playSegmentFlag == true){
			 //tries to find if user changed the currenttime using seekback 
			 var newIndex = gPlayerObject.FindSegmentIndex(startTime); 
			 if(newIndex != -1){
				 if(newIndex != gPlayerObject.currentSegIndex){
					 gPlayerObject.Pause(); 
					 gPlayerObject.currentSegIndex = newIndex; 
					 gPlayerObject.endPTS = gPlayerObject.SegmentList[gPlayerObject.currentSegIndex].endTime; 					 
					 startTime = new Number (gPlayerObject.GetCurrentPTS());		 
					 dur =  new Number(gPlayerObject.endPTS - startTime);		 
					 dur = dur * 1000; 
					 gPlayerObject.Play(); 
					 var fnstr = gPlayerObject.segmentHandlerfn + '(' + gPlayerObject.currentSegIndex + ')'; 
					 eval(fnstr);					 
				 }			 
			 }
			 gTimerObj = setTimeout(function(){
					// gPlayerObject.Pause();
				   if(gPlayerObject.SegmentList){
					   if(gPlayerObject.currentSegIndex < gPlayerObject.SegmentList.length) {
						   gPlayerObject.currentSegIndex++;
						   if(gPlayerObject.currentSegIndex < gPlayerObject.SegmentList.length){
							   gPlayerObject.PlaySegmentIndex(gPlayerObject.currentSegIndex);
							   var fnstr = gPlayerObject.segmentHandlerfn + '(' + gPlayerObject.currentSegIndex + ')'; 
							   eval(fnstr);	 
						   }
						   else{
							   gPlayerObject.playerHandle.stopVideo(); 
						   }
						  
					   }
					   else{
						   gPlayerObject.playerHandle.stopVideo(); 
					   }
				   } 
				   else{
					   var fnstr = gPlayerObject.segmentHandlerfn + '()'; 
					   eval(fnstr);
				   }					 		 
				 }, 
				 dur);
			 
		 }
		 else{
			 if(gPlayerObject.OnPlayHandlerFn){
				 fnStr = gPlayerObject.OnPlayHandlerFn + '()'; 
				 eval(fnStr); 
			 }	
		 }
		 //alert('Timeout for : duration=' + dur + 'starttime= ' + startTime);
		 		 
		 break; 
	 case gEventTypes.ON_PAUSE:
		 if(gPlayerObject.playSegmentFlag == true){
			 if(gTimerObj){
				 clearTimeout(gTimerObj); 
				 gTimerObj = 0; 
				 //alert('Buffering Now starttime= ' + startTime); 
			 }
		 }
		 else if(gPlayerObject.OnPauseHandlerfn){
			 fnStr = gPlayerObject.OnPauseHandlerfn + '()'; 
			 eval(fnStr); 
		 }		
		 break;	 
	 case gEventTypes.ON_BUFFERING:		 
		 if(gPlayerObject.playSegmentFlag == true){
			 if(gTimerObj){
				 clearTimeout(gTimerObj); 
				 gTimerObj = 0; 
				 //alert('Buffering Now starttime= ' + startTime); 
			 }
		 }
		 else{
			 if(gPlayerObject.OnBufferingHandlerFn){
				 fnStr = gPlayerObject.OnBufferingHandlerFn + '()'; 
				 eval(fnStr); 
			 } 
		 }
		 	
		 break; 
	 case gEventTypes.ON_END:
		 if(gPlayerObject.OnEndHandlderFn){
			 fnStr = gPlayerObject.OnEndHandlderFn + '()'; 
			 eval(fnStr); 
		 }	
		 if(gPlayerObject.playSegmentFlag == true){
			 if(gTimerObj){
				 clearTimeout(gTimerObj); 
				 gTimerObj = 0; 
			 } 
		 }
		
		 break; 	
	 default:
		 break; 
	 } 
}
 

  CVideoPlayer.prototype.onPlayerError = function(event){	
	 var errorcode = event.data;	
	 var fnStr='';	
	 if(gPlayerObject.OnErrorHandlerFn){
			 fnStr = gPlayerObject.OnErrorHandlerFn + '(errorcode)'; 
			 eval(fnStr); 
	}	
 }

 
 //load the new videoID but doesn't play it.  
 CVideoPlayer.prototype.LoadNewVideoSegment= function(videoID, handlerFn){
	 this.SegmentList = 0; 
	 this.currentVideoID = videoID; 
	 this.videoID=videoID;
	 this.segmentHandlerfn = handlerFn;
	 if( this.playerHandle != 'undefined'){
		  this.ShowVideoPlayer(true)  ;  
		  if(this.playerState == 'PLAYING'){
			  this.playerHandle.stopVideo(); 
			  this.playerHandle.clearVideo(); 
		  }		  
	 }
	 this.playerHandle.loadVideoById({videoId:this.currentVideoID});
	 this.playSegmentFlag = true; 
	 this.Pause(); 
 }
 CVideoPlayer.prototype.LoadVideoWithSegmentList= function(videoID, segmentList, handlerFn){
	 this.currentVideoID = videoID; 
	 if( this.playerHandle != 'undefined'){
		  this.ShowVideoPlayer(true)  ;  
		  if(this.playerState == 'PLAYING'){
			  this.playerHandle.stopVideo(); 
			  this.playerHandle.clearVideo(); 
		 }	
	 }
	 this.segmentHandlerfn = handlerFn;
	 var indexLen = segmentList.length; 
	 this.SegmentList = [];//new Array(indexLen);
	// var vidSegInfo = new sVideoSegment(); 
	 for(i=0; i < indexLen; i++){
		//vidSegInfo.startTime = segmentList[i].startTime; 
		//vidSegInfo.endTime = segmentList[i].endTime; 
		this.SegmentList.push(segmentList[i]) ;
	 	if(i>0 && parseFloat(this.SegmentList[i]['startTime']) <= parseFloat(this.SegmentList[i-1]['endTime']) ){
	 		this.SegmentList[i]['startTime'] = parseFloat(this.SegmentList[i-1]['endTime']) + 0.1
	 	}
	 }
	 this.playerHandle.loadVideoById({videoId:this.currentVideoID});
	 this.playSegmentFlag = true; 
	 this.currentSegIndex = 0; 
	 this.Pause(); 
	 this.PlaySegmentIndex(this.currentSegIndex); 
	 var fnstr = this.segmentHandlerfn + '(' + this.currentSegIndex + ')'; 
	 eval(fnstr); 
 }
 
 CVideoPlayer.prototype.PlaySegmentIndex=function(segIndex){
	 var vidSegInfo =  this.SegmentList[segIndex]; 
	 this.startPTS = vidSegInfo.startTime;  
	 this.endPTS = vidSegInfo.endTime; 
	 var duration =  new Number(1000* (this.endPTS - this.startPTS)); 
	 if(duration < 0)
		 return 0; 
	 //first seek to the startTime	 
	 this.SeekTo(new Number(this.startPTS)); 	 
	 //play from there
	 this.Play(); 
}
 
 CVideoPlayer.prototype.PlaySegmentwise=function(startTime, endTime){
	 this.startPTS = startTime; 
	 this.endPTS = endTime; 
	 var duration =  new Number(1000* (endTime - startTime)); 
	 if(duration < 0)
		 return 0; 
	 //first seek to the startTime	 
	 this.SeekTo(new Number(startTime)); 	 
	 //play from there
	 this.Play(); 		 
}
 
 CVideoPlayer.prototype.PlayWithinInterval= function(startTime, endTime){
	 
	 var duration =  new Number(1000* (endTime - startTime)); 
	 if(duration < 0)
		 return ; 
	 //first seek to the startTime
	 this.SeekTo(new Number(startTime)); 	 
	 //play from there
	 this.Play(); 
	
	 setTimeout(function(){
		 gPlayerObject.Pause();			 
	 }, 
	 duration);
 } 
 
 CVideoPlayer.prototype.SetEventHandler = function(eventType, HandlerFn){
	 
	 switch(eventType){
	 case gEventTypes.ON_PLAY:
		 this.OnPlayHandlerFn = HandlerFn; 
		 break; 
	 case gEventTypes.ON_PAUSE:
		 this.OnPauseHandlerfn = HandlerFn; 
		 break; 
	 case gEventTypes.ON_ERROR:
		 this.OnErrorHandlerFn = HandlerFn; 
		 break; 
	 case gEventTypes.ON_BUFFERING:
		 this.OnBufferingHandlerFn = HandlerFn; 
		 break;
	 case gEventTypes.ON_END:
		 this.OnEndHandlderFn = HandlerFn; 
		 break; 
	default:
		break; 		 
	 
	 }
 } 
 
 CVideoPlayer.prototype.RemovetEventHandler= function(eventType){
	 
	 switch(eventType){	 
	 
	 case gEventTypes.ON_PLAY:
		 this.OnPlayHandlerFn = 0; 
		 break; 
	 case gEventTypes.ON_PAUSE:
		 this.OnPauseHandlerfn = 0; 
		 break; 
	 case gEventTypes.ON_ERROR:
		 this.OnErrorHandlerFn = 0; 
		 break; 
	 case gEventTypes.ON_BUFFERING:
		 this.OnBufferingHandlerFn = 0; 
		 break;
	 case gEventTypes.ON_END:
		 this.OnEndHandlderFn = 0; 
		 break; 
	default:
		break; 		 	 
	 }
 } 
 
 CVideoPlayer.prototype.FindSegmentIndex= function(currTime){
	 for(var j= 0; j < this.SegmentList.length; j++){
		 if( (currTime >= this.SegmentList[j].startTime ) && (currTime <= this.SegmentList[j].endTime ) )
			 return j; 
	 }
	 return -1; 
 }
 var sso=sso||{};sso.app=function(s){this.u=s,ssoUrl=s,this.reset=function(s){if(null==this.u||""==this.u)return console.log("SSO object not initialised"),!1;var t="reset";$.ajax({url:this.u,type:"POST",data:{request:"sso_initiate_reset",data:{sso_email:s}},async:!0,success:function(s){onSSOResponse(s,t)}})},this.signin=function(s,t){return null==this.u||""==this.u?(console.log("SSO object not initialised"),!1):void $.ajax({url:this.u,type:"POST",data:{request:"sso_signin_verify",data:{sso_email:s,sso_password:t}},async:!0,success:function(s){onSSOResponse(s)}})},this.signup=function(s){if(null==this.u||""==this.u)return console.log("SSO object not initialised"),!1;var t="signup";$.ajax({url:this.u,type:"POST",data:{request:"sso_initiate_signup",data:{sso_email:s}},async:!0,success:function(s){onSSOResponse(s,t)}})},this.signup_verify=function(s){return null==this.u||""==this.u?(console.log("SSO object not initialised"),!1):void $.ajax({url:this.u,type:"POST",data:{data:{sso_user_info:JSON.stringify(s)}},async:!0,success:function(s){onSSOResponse(s)}})},this.reset_verify=function(s){return null==this.u||""==this.u?(console.log("SSO object not initialised"),!1):void $.ajax({url:this.u,type:"POST",data:{data:{sso_password:s}},async:!0,success:function(s){onSSOResponse(s)}})},onSignIn=function(s){if(null==ssoUrl||""==ssoUrl)return console.log("SSO object not initialised"),!1;if(1==l_ch)return!1;var t=s.getAuthResponse().id_token;s.getBasicProfile().getImageUrl();$.ajax({url:ssoUrl,type:"POST",data:{request:"sso_google_signin",data:{sso_idtoken:t}},async:!0,success:function(s){onSSOResponse(s)}})}};window.onload   =   function()
{
	sso_obj	=	new sso.app("./"+dataRequestURL);
	$('#reset_password').click(sign_in_reset);
	$("#sign-in-password").keyup(function (e)
		{
			if (e.keyCode == 13) 
			{
				sign_in_submit(0);
			}	
		});
};

function signUptext()
{
	$("#sign-in-container .modal-content").fadeOut(100,function()
	{
		$("#sign-in-container .modal-content").fadeIn();
		$(".error").css("display","none");
		$(".sign-up-show").css("display","inline-block");
		$(".sign-up-hide").css("display","none");
	});
}

function sign_in()
{
	$("#sign-in-container .modal-content").fadeOut(100,function()
	{
		$("#sign-in-container .modal-content").fadeIn();
		$(".error").css("display","none");
		$(".sign-up-show").css("display","none");
		$(".sign-up-hide").css("display","inline-block");
		$(".sign-in-forget-password").css("display","block");
	});
}

function sign_in_submit(sign,event)
{
	$('#sign-in-error-message')[0].innerHTML="";
	$('#sign-in-error2')[0].style.display="none";
	if(sign==0)
	{
		if(!validations(0))
		{
			return false;
		}
		var email	=	$('#sign-in-email').val();
		var pass	=	$("#sign-in-password").val();
		
		if(pass	==	null	||	pass	==	"")
		{
			$('#sign-in-error-message')[0].innerHTML="Password cannot be blank";
			$('#sign-in-error2')[0].style.display="block";
			return false;
		}
		else if(pass.length	<	6)
		{
			$('#sign-in-error-message')[0].innerHTML="Password length must be atleast 6";
			$('#sign-in-error2')[0].style.display="block";
			return false;
		}
		$('#loadingDiv').css('display','inline-block');
		sso_obj.signin(email,pass);
	}
	else if(sign==1)
	{
		if(!validations(0))
		{
			return false;
		}
		var email	=	$('#sign-in-email').val();
		$('#loadingDiv').css('display','inline-block');
		sso_obj.signup(email);
			
	}
}
function sign_in_reset()
{
	var re1=/(.+)@(.+)\.(.+)/i;
	var text=$('#sign-in-email').val();
	document.getElementsByClassName("error")[0].style.display="none";
	if($('#sign-in-email').val()=="")
	{
		$('#sign-in-error2')[0].style.display="block";
		$('#sign-in-error-message')[0].innerHTML="Enter the Email address";
		return;
	}	
	else if(!re1.test(text))
	{
		$('#sign-in-error-message')[0].innerHTML="Enter valide email id";
		$('#sign-in-error2')[0].style.display="block";
		return;
	}
	else
	{
		$('#loadingDiv').css('display','inline-block');
		sso_obj.reset(text);
	}
}
function validations(msg)
{
	
	var re1=/(.+)@(.+)\.(.+)/i;
	var text=$('#sign-in-email').val();
	if(!re1.test(text))
	{
		$('#sign-in-error-message')[0].innerHTML="Invalid email!";
		$('#sign-in-error2')[0].style.display="block";
		return 0;
	}
	if(msg	==	1)
		{
			if($('#sign-in-password').val()!=$('#sign-in-confirm-password').val())
			{
				$('#sign-in-error-message')[0].innerHTML="Password do not match!";
				$('#sign-in-error2')[0].style.display="block";
				return 0;
			}
			else if(!$('#sign-in-nickname').val() || $('#sign-in-nickname').val()=="")
			{
				$('#sign-in-error-message')[0].innerHTML	=	"Enter nickname";
				$('#sign-in-error2')[0].style.display	=	"block";
				return 0;
			}
		}
	return 1;
}
function onSSOResponse(r , type)
{
	response	=	JSON.parse(r);
	if(response['status']	==	true)
		{
			if( type	==	"signup")
			{
				$('#sign-in-error-message').html("Verification link has been sent to your mail!");
				$('#sign-in-error2')[0].style.display="block";
				$('#loadingDiv').css('display','none');
			}
			else if(type	==	"reset")
			{
				$('#sign-in-error-message').html("Reset password link has been sent to your mail!");
				$('#sign-in-error2')[0].style.display="block";
				$('#loadingDiv').css('display','none');
			}
			else
			{
				if(mainAppVars.redirectUrlIndex != 0)
				{
					location.href = getLocationUrl(mainAppVars.redirectUrlIndex);
				}
				else
				{
					location.reload(); 
				}
			}
		}
	else if(response['status']	==	false)
		{
			$('#sign-in-error-message').html(response["error"]);
			$('#sign-in-error2')[0].style.display="block";
			$('#loadingDiv').css('display','none');
		}
}