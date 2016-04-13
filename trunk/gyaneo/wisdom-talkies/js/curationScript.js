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
    var curationListController  =   function ($scope, $routeParams, $http, $rootScope, serviceListPagination, serviceBreadCrumbs) {
        $('body').scrollTop(0);
        $('#sidebar').css('display','none');
        $('#moto').css('display','none');
        $('#navPathArea').css('display','none');
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        var breadCrumbInput =   [];
        $scope.searchRows   =   50;
        mainAppVars.searchInputText =   'learning';
        $scope.urlParams    =   encodeURIComponent($routeParams.searchParams || "search=learning");
        mainAppObject.setVariablesFromParams(urlparams);
        angular.element('#head').scope().searchInputText  =   decodeURIComponent(mainAppVars.searchInputText);
        var searchObject    =   new mainApp.searchModule();
        searchObject.searchKeyword();
        breadCrumbInput.push({name:mainAppVars.searchInputText ,link:'search/search='+mainAppVars.searchInputText});
        if(mainAppVars.searchStart > 0){
            var pageIndex = Math.ceil(mainAppVars.searchStart/mainAppVars.searchRows)+1;
            breadCrumbInput.push({name:'Page #'+pageIndex ,link:breadCrumbInput[breadCrumbInput.length-1]['link']+'&start='+mainAppVars.searchStart});
        }
        mainAppVars.playerReady =   false;
        mainAppVars.videoSourceId   =   'qw';
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


        $scope.BreadCrumbs  =   serviceBreadCrumbs.appendBreadCrumb(breadCrumbInput);
        $rootScope.$broadcast('breadCrumbData',$scope.BreadCrumbs);
        $scope.openContentInfo  =   function(event){
            openContentInfo(event);
        };
        $scope.DummyArray   =   function(n){
            return new Array(n);
        }
        $scope.$watch(function(){return $rootScope.contentList},
            function(newValue, oldValue) {
                $scope.Pagination   =   {};
                if(typeof(newValue) == "object" && newValue != oldValue){
                    $scope.Pagination   =   serviceListPagination.createPagination(newValue);
                }
            }
        );
        $scope.playVideo    =   function(){
            if(mainAppVars.playerReady){
                var viewClassObject =   new mainApp.viewModule();
                vidPlayerObject.LoadNewVideoByID(mainAppVars.videoSourceId);
            }
            else{
                setTimeout(function(){
                    $scope.playVideo();
                },500);
            }
        };
        $scope.saveVideoToCuration  =   function(event){
            curation_handle.videoID = $(event.target).attr('data-videoid');
            UI_openModal('#save-to-curation');
        };
        $scope.watchVideoCurate =   function(event){
            $('body').animate({'scrollTop':0},1000);
            mainAppVars.videoSourceId = $(event.target).attr('data-videoid');
            $scope.playVideo();
        };
    };
    curationListController.$inject  =   ['$scope', '$routeParams', '$http', '$rootScope', 'serviceListPagination', 'serviceBreadCrumbs'];
    angular.module('wt').controller('curationListController', curationListController);
}());(function () {
    var curationController  =   function ($scope, $routeParams, $http, $rootScope, $timeout) {
        $('body').scrollTop(0);
        $('#moto').css('display','none');
        $('#navPathArea').css('display','none');
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        mainAppVars.searchInputText =   '';
        mainAppVars.playerReady	=	false;
        var urlparams           =   appHistoryObject.parseCurrentUrl();
        mainAppObject.setVariablesFromParams(urlparams);
        $scope.urlParams    =   encodeURIComponent($routeParams.curateParams);
        angular.element('#head').scope().searchInputText  =   decodeURIComponent(mainAppVars.searchInputText);
        $scope.initFunction =   function(){
            var catData	=	data.categories;
            UI_createJsonUL('#curationcategorydropdown',{'html':catData});
            UI_createDropdown('#curationcategorydropdown','',false);
            var subMenuObj = data.subCategories;
            for(var key in subMenuObj){
                var dropDownArray   =   $('#curationcategorydropdown');
                dropDownArray.each(function(){
                    var menuItem = $(this).find('ul.dropdown-menu li[data-catid="'+key+'"]');
                    menuItem.find('a').addClass("dropdown-toggle").attr("data-toggle","dropdown");
                    menuItem.addClass('dropdown-submenu').append('<div class="subMenuExpand visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-down"></div><div class="subMenuCollapse hiddenElem visible-xs visible-sm"><span class="glyphicon glyphicon-chevron-up"></span></div><ul class="dropdown-menu"></ul>');
                    for(var i=0;i<subMenuObj[key].length;i++){
                        menuItem.find('ul.dropdown-menu').append('<li data-catId="'+subMenuObj[key][i]['attr']['data-catid']+'" data-vidId="'+subMenuObj[key][i]['attr']['data-vidId']+'"><a href="'+subMenuObj[key][i]['link']+'">'+subMenuObj[key][i]['label']+'</a></li>');
                    }
                });
            }
            $('#curationcategorydropdown').on('click','li[data-catId] a',setCurationVideoCategory);
            var temp_is_lang	=	false;
            data.languages['other_language']    =   {id:'other_language',language:'other'};
            $scope.langObject   =   data.languages;
            $scope.curation_language = $scope.langObject['1'].id;
            $('.category-drop-down-curation').on('click','li[data-catId] a',setCurationVideoCategory);
            $("#curate_other_category").change(function(){
                build_breadcrumb_of_category($("#curationcategorydropdown").attr("category-value"));
            });
        };
        $scope.playerVideoId    =   mainAppVars.currentVideoId;
        $scope.$on('youtube.player.ready', function ($event, player) {
            vidPlayerObject  =   CreatePlayerWidget($scope.vidPlayerObject, 'YT', 'ytplayerdiv', '100%', '100%', true,true);
            mainAppVars.playerReady = true;
            vidPlayerObject.videoID =   $scope.playerVideoId;
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
            vidPlayerObject.onPlayerError(dataObj);
        });


        $scope.DummyArray   =   function(n){
            return new Array(n);
        }
        $scope.playVideo    =   function(){
            if(mainAppVars.playerReady){
                var viewClassObject =   new mainApp.viewModule();
                vidPlayerObject.LoadNewVideoByID(mainAppVars.videoSourceId);
            }
            else{
                setTimeout(function(){
                    $scope.playVideo();
                },500);
            }
        };
        $scope.socialPlatforms      =   [{name:"website",value:"Website"},
                                        {name:"facebook",value:"Facebook"},
                                        {name:"twitter",value:"Twitter"},
                                        {name:"googleplus",value:"Google"},
                                        {name:"linkedin",value:"Linkedin"},
                                        {name:"blogger",value:"Blogger"},
                                        {name:"quora",value:"Quora"},
                                        {name:"instagram",value:"Instagram"},
                                        {name:"souncloud",value:"Soundcloud"},
                                        {name:"pinterest",value:"Pinterest"},
                                        {name:"tumblr",value:"Tumblr"},
                                        {name:"stumbleupon",value:"StumbleUpon"},
                                        {name:"reddit",value:"Reddit"},
                                        {name:"email",value:"Email"},
                                        {name:"other",value:"Other"}];

        $scope.curationLinksInput   =   [{modelval:'model1',label:'Link #1',id:'content-link-type-1',otherPlatformid:'content-link-other-input-1',socialPlatforms:$scope.socialPlatforms},{modelval:'model2',label:'Link #2',id:'content-link-type-2',otherPlatformid:'content-link-other-input-2',socialPlatforms:$scope.socialPlatforms},{modelval:'model3',label:'Link #3',id:'content-link-type-3',otherPlatformid:'content-link-other-input-3',socialPlatforms:$scope.socialPlatforms},{modelval:'model4',label:'Link #4',id:'content-link-type-4',otherPlatformid:'content-link-other-input-4',socialPlatforms:$scope.socialPlatforms}];
        LoadVideoforCuration(mainAppVars.currentVideoId,'yt');
        $scope.initFunction();
        $scope.playCurationTopic    =   function(event){
            var start_time	=	$(event.currentTarget).closest('tr').find('.topic-start').attr('data-time-val');
            var end_time	=	$(event.currentTarget).closest('tr').find('.topic-end').attr('data-time-val');
            var numRow      = $(event.currentTarget).closest('tr').prevAll('tr.readOnlyRow:not(.dummyRow)').length;
            newSegInfo		=	curation_handle.CreateSegment(numRow,'',true)[0];
            length			=	newSegInfo.segmentList.length;
            content_json	=	curation_handle.CreateSegment(numRow,'',true)[1];
            $(".playActive").removeClass('playActive');
            $(event.currentTarget).closest('tr').addClass('playActive');
            vidPlayerObject.LoadNewVideoSegment(newSegInfo.videoID, 'handle_segmentwise');
            vidPlayerObject.PlaySegmentwise(start_time,end_time);
        }
        $scope.addNewTopicRow  =   function(event){
            addNewTopicRow(event);
        };
        $scope.cancelTopicAdd  =   function(event){
            cancelTopicAdd(event);
        };
        $scope.saveTopicRow  =   function(event){
            saveTopicRow(event);
        };
        $scope.editTopicRow  =   function(event){
            editTopicRow(event);
        };
        $scope.removeTopicRow  =   function(event){
            removeTopicRow(event);
        };
        $scope.bindcurrentPTSTimeInput  =   function(event){
            bindcurrentPTSTimeInput(event);
        };
        $scope.publish  =   function(event){
            publish(event);
        };
        $scope.final_publish  =   function(event){
            final_publish(event);
        };
        $scope.playSegments  =   function(args){
            playSegments(args);
        };
        $scope.saveOnPublish    =   function(){
            $timeout(function() {
                angular.element('#save_curation').triggerHandler('click');
            }, 100);
        };
    };
    curationController.$inject  =   ['$scope', '$routeParams', '$http', '$rootScope', '$timeout'];
    angular.module('wt').controller('curationController', curationController);
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
}());var curate_libs	=	function()
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
};var content_json		=	"";
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