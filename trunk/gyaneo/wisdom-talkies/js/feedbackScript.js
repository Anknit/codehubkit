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
    var reviewController  =   function ($scope, $routeParams, $rootScope, $http, $filter, serviceListPagination, serviceBreadCrumbs) {
        $('body').scrollTop(0);
        var appHistoryObject    =   new mainApp.historyModule();
        var mainAppObject       =   new mainApp.mainModule();
        $scope.loginUser    =   mainAppVars.loginUser;
        mainAppVars.playerReady =   false;
        $scope.playerVideoId    =   're';
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
        $scope.$on('youtube.player.ended', function ($event, player, dataObj, event) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });
        $scope.$on('youtube.player.playing', function ($event, player, dataObj, event) {
            vidPlayerObject.onPlayerStateChange(dataObj);
            $scope.currentVideoTime =   vidPlayerObject.playerHandle.H.currentTime;
        });
        $scope.$on('youtube.player.paused', function ($event, player, dataObj, event) {
            vidPlayerObject.onPlayerStateChange(dataObj);
        });

        $scope.playVideo    =   function(){
            if(mainAppVars.playerReady){
                $rootScope.recentContentList    =   $rootScope.recentContentList || {};
                var viewClassObject =   new mainApp.viewModule();
                switch($scope.playusing){
                    case 'normal':
                        vidPlayerObject.LoadNewVideoByID(mainAppVars.videoSourceId);
                        $rootScope.recentContentList[mainAppVars.currentVideoId]  =   $scope.currentVideoObject;
                        break;
                    case 'topics':
                        viewClassObject.CreateSegment($scope.currentVideoObject.topicinfo);
                        $rootScope.recentContentList[mainAppVars.currentVideoId]  =   $scope.currentVideoObject;
                        break;
                    case 'bookmarks':
                        viewClassObject.CreateSegment($scope.currentVideoObject.bookmarkTopics);
                        $rootScope.recentContentList[mainAppVars.currentVideoId]  =   $scope.currentVideoObject;
                        break;
                    default:
                        break;
                }
            }
            else{
                setTimeout(function(){
                    $scope.playVideo();
                },500);
            }
        };
        $scope.playContentThroughTopics   =   function(event){
            $scope.playusing    =   'topics';
            $scope.playVideo();
        }
        $scope.playVideoSegment =   function(event){
            if(event.target.hasAttribute('data-topic-index'))
                var nodeID	=	$(event.target).attr('data-topic-index');
            else{
                var nodeID	=	$(event.target).closest('[data-topic-index]').attr('data-topic-index');
            }
            vidPlayerObject.PlaySegmentIndex(nodeID); 
        };
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
    };
    reviewController.$inject  =   ['$scope', '$routeParams', '$rootScope', '$http', '$filter', 'serviceListPagination', 'serviceBreadCrumbs'];
    angular.module('wt').controller('reviewController', reviewController);
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
}());var vidPlayerObject =   '';
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
 var sso=sso||{};sso.app=function(s){this.u=s,ssoUrl=s,this.reset=function(s){if(null==this.u||""==this.u)return console.log("SSO object not initialised"),!1;var t="reset";$.ajax({url:this.u,type:"POST",data:{request:"sso_initiate_reset",data:{sso_email:s}},async:!0,success:function(s){onSSOResponse(s,t)}})},this.signin=function(s,t){return null==this.u||""==this.u?(console.log("SSO object not initialised"),!1):void $.ajax({url:this.u,type:"POST",data:{request:"sso_signin_verify",data:{sso_email:s,sso_password:t}},async:!0,success:function(s){onSSOResponse(s)}})},this.signup=function(s){if(null==this.u||""==this.u)return console.log("SSO object not initialised"),!1;var t="signup";$.ajax({url:this.u,type:"POST",data:{request:"sso_initiate_signup",data:{sso_email:s}},async:!0,success:function(s){onSSOResponse(s,t)}})},this.signup_verify=function(s){return null==this.u||""==this.u?(console.log("SSO object not initialised"),!1):void $.ajax({url:this.u,type:"POST",data:{data:{sso_user_info:JSON.stringify(s)}},async:!0,success:function(s){onSSOResponse(s)}})},this.reset_verify=function(s){return null==this.u||""==this.u?(console.log("SSO object not initialised"),!1):void $.ajax({url:this.u,type:"POST",data:{data:{sso_password:s}},async:!0,success:function(s){onSSOResponse(s)}})},onSignIn=function(s){if(null==ssoUrl||""==ssoUrl)return console.log("SSO object not initialised"),!1;if(1==l_ch)return!1;var t=s.getAuthResponse().id_token;s.getBasicProfile().getImageUrl();$.ajax({url:ssoUrl,type:"POST",data:{request:"sso_google_signin",data:{sso_idtoken:t}},async:!0,success:function(s){onSSOResponse(s)}})}};ResizeFeedbackGrid = 0;
GRID_UNIQUE_ID	=	'FeedbackTable';

var worksOnAllGridComplete	=	function(Table)
{
	var	RowDataArrays	=	Table.jqGrid('getRowData');
	return ;
//If no record is found the show no record found at the centre		
	if(RowDataArrays.length	==	0)	//If no records are found then maintain some height of table
	{
		Table.find('.jqgfirstrow').html('<td width="100%" height="200px" valign="middle" style="vertical-align:middle; border:none"><div style="text-align:center; width:100%">No records found</div></td>');
	}
};

var CommonGridCompleteFunctions = function(Table)
{
	//Get row datas in array
	var	RowDataArrays	=	Table.jqGrid('getRowData');
	ResizeTable(Table);
	ModifyGridHeaderProperties(Table);

	//createDropDownList();
	$('#t_'+GRID_UNIQUE_ID).css('border','none');
	$('#t_'+GRID_UNIQUE_ID).css('height','30px');
	$('#t_'+GRID_UNIQUE_ID).attr('align','left');
	// Manage ui-pg-input element.
	$('input.ui-pg-input').keyup(function()
	{
		if($(this).val() > TotalPages)
		{
			$(this).val(TotalPages);
			return false;
		}
		else
			return true;
	});
};

var feedbackcolmodel = function() {
	var colModel = [
	                	{name:'feedbacktitle',        index:'feedbacktitle'       ,   width:100},
						{name:'feedbackdescription',  index:'feedbackdescription' ,   align:"center", width:300},
						{name:'feedbackstatus',	index:'feedbackstatus',	align:"center", width:100, formatter:feedbackDetailsFormatterFunction.status},
						{name:'reportedby',		index:'reportedby',		align:"center", width:100},
						{name:'modifieddate',	index:'modifieddate',	align:"center", width:100},
						{name:'feedbackstatus',	index:'feedbackstatus',	align:"center", width:100, formatter: feedbackDetailsFormatterFunction.action}
						];
	return colModel;
};

var feedbackDetailsFormatterFunction = new Object();

function definefeedbackDetailsFormatterFunction() {
    feedbackDetailsFormatterFunction.status =   function(val,colModel,rowdata){
        var innerhtml;
        switch(val){
            case '1':
                innerhtml   =   'New Reported';
                break;
            case '2':
                innerhtml   =   'Issue Solved';
                break;
            case '3':
                innerhtml   =   'Issue Reopened';
                break;
            case '4':
                innerhtml   =   'Duplicate';
                break;
            case '5':
                innerhtml   =   'Invalid';
                break;
            default:
                break;
        }
        return innerhtml;
    };
    feedbackDetailsFormatterFunction.action =   function(val,colModel,rowdata){
        var innerhtml;
        if(val == '1'){
            innerhtml   =   '';
        }
        return innerhtml;
    };
	feedbackDetailsFormatterFunction.gridComplete	=	function(){
		var Table			=	$(this);
		if(ResizeFeedbackGrid	==	0){
			CommonGridCompleteFunctions(Table);
			ResizeFeedbackGrid++;
		}	
		worksOnAllGridComplete(Table);
    };
}

definefeedbackDetailsFormatterFunction();
var USER_GRID_UNIQUE_ID ;
var ciRow,ciCol;


var ResizeTable = function(Table)
{
	var TableHeight		=	Table.height();
	var MaxDivHeight	=	$('#contentPANE').height();
	var MaxDivWidth		=	$('#contentPANE').width();
	var SetHeight		=	MaxDivHeight*$(Table).attr('gridHeight');
	var SetWidth		=	MaxDivWidth*$(Table).attr('gridWidth');
	Table.jqGrid('setGridHeight', SetHeight);
	Table.jqGrid('setGridWidth', SetWidth);
};

var fetchjqGridObject = function(gridObject){
	return {
			/**
			 * If we use datatype as function our code is responsible for calling of 'loadComplete'.
			 * For datatype as function our code is responsible for some things, which jqGrid will do it 
			 * automatically. 
			 */
			datatype: 	function(postdata){
				var ts = gridObject;  // cache 'gridObject' to use later in the complete callback
				var p = gridObject.p; // cache the grid parameters
				jQuery.ajax({
					url:$(gridObject).attr('url'),
					data:postdata,
					contentType: "application/json",
					dataType:"json",
					complete: function(jsondata,stat){
					  if(stat=="success") {
						  	UI_unBlockInterface();
							TotalPages		=	jsondata.responseJSON.total;
							ResponseData	=	jsondata.responseJSON.rows;
							var thegrid 	= jQuery('#'+$(gridObject).attr('id'))[0];
							thegrid.addJSONData(jsondata.responseJSON);
							// call loadComplete
							if($.isFunction(p.loadComplete)) {
								p.loadComplete.call(ts,jsondata.responseJSON);
							}
					  }
				   }
				});
				UI_blockInterface();
			},
			colNames:$(gridObject).attr('colNames').split(','),
			colModel:window[$(gridObject).attr('colModel')](),
			jsonReader : {
				 root: "rows",
				 records: "records",
				 viewrecords: true,
				 repeatitems: true,
				 cell: "",
                 page: function (obj) { return obj.rows.length > 0 ? obj.page : 0; },
				 id: "0"
			},
			idPrefix: $(gridObject).attr('id') + "_",
			rowNum:10,
			rowList:[10,15,30,50],
			gridview: true,
			ignoreCase: true,
			autoencode: true,
			toolbarfilter: true,
			//loadonce: true,	If this is on the total pages in pager wouldn't work well. This will load records at once only
   			emptyrecords: "No records found",
   			autowidth: true,
  			shrinktoFit: true,
  			forceFit: true,
 			pager : '#gridpager_'+$(gridObject).attr('id'),
 			pagerpos:'center',
			recordpos: 'right',
			viewrecords: true,
			pginput : true,
  			sortname: $(gridObject).attr('sortBy'),
			sortorder: 'asc',
			toolbar: getToolbarProp(gridObject),
			cellsubmit: 'remote',
			cellurl:$(gridObject).attr('eurl') ? $(gridObject).attr('eurl') : "",
			cellEdit: $(gridObject).attr('cellSelector') != null,
			grouping: $(gridObject).attr('grouping') != null,
		   	groupingView : {
		   		groupField : getGroupFields(gridObject) ,
		   		groupDataSorted : true,
		   		groupColumnShow : getGroupColumnShow(gridObject),
		   		groupCollapse : false
		   	},
		   	onClickGroup: function(hid) {
		   		/* Fired when group header is toggled */
		   	},
			onSelectRow : function(id) {
				$(gridObject).setSelection(id,false);
				$(gridObject).find('tr').find("input[type='radio']").prop('checked',true);
			},
			formatCell : function(rowid, cellname, value, iRow, iCol) {
				/* You can change the cell value here which will be used in the edit mode */
				return value.replace('<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>'," ")
			},
			beforeEditCell : function(rowid, cellname, value, iRow, iCol) { 
				/*  Just before the cell jumps into edit mode this event is fired */
				var attr = $(gridObject).attr('editable');
				if(typeof attr != typeof undefined && attr !== false) {
					// Clear GridRefreshTimer
					clearGridRefreshTimer(refreshTimerID);
				}
			},
			afterEditCell : function(rowid, cellname, value, iRow, iCol) {
				/* Just after the input element is created this event will be fired */
				ciRow = iRow;
				ciCol = iCol;
			},
			beforeSaveCell : function(rowid, cellname, value, iRow, iCol) {
				/* Fires before the cell is saved, you can save the value here which is send to the server. */
			},
			beforeSubmitCell : function(rowid,cellname,value,iRow,iCol) {
				/*
				 *  Fires before value will be send to the server, you can add extra parameters 
				 *  here to the request by returning an array.
				 */
				var rdata = $(gridObject).getRowData(rowid);
				var i = $(rdata.JobID).val();
				return {jid: i,param: cellname}; // Modify the POST Request 
			},
			afterSaveCell : function(rowid, cellname, value, iRow, iCol) {
				/**
				 *  Fires when the value of the cell is saved
				 */
				var attr = $(gridObject).attr('editable');
				if(typeof attr != typeof undefined && attr !== false) {
					// Reset GridRefreshTimer
					refreshTimerID = setGridRefreshTimer($(gridObject).attr('id'));
				}
				
			},
			gridComplete: window[$(gridObject).attr('gridComplete')].gridComplete,
			loadComplete: function() {
				var gridParams = $(gridObject).jqGrid('getGridParam');
				if(gridParams.scrollTopPosition != undefined) {
					/*
					 * scrollTopPosition is set before grid refresh.
					 * Maintain scroll state of the grid
					 */
					$(gridObject).closest(".ui-jqgrid-bdiv").scrollTop(gridParams.scrollTopPosition);
				}
			}		
			
		};
};

var getToolbarProp	=	function(gridObject){
	var defaultProp	=	[false,'top'];
	if(gridObject.hasAttribute('gridToolbar_Visible'))
		defaultProp	=	[true,gridObject.getAttribute('gridToolbar_Visible')];
	return defaultProp;
};

var customJqgrid = function(gridObject){
	var GridUniqueid	=	$(gridObject).attr('id');
	var ResponseData	=	"";
	var TotalPages;
	var jqgridOBJECT = fetchjqGridObject(gridObject);
	$('#'+GridUniqueid).jqGrid(jqgridOBJECT);
};

var getGroupFields = function(gridObject) {
	if($(gridObject).attr('grouping'))
		return $(gridObject).attr('grouping').split(',');
};

var getGroupColumnShow = function(gridObject) {
	var groupColShowProperties = new Object;
	groupColShowProperties.Name = false;
	groupColShowProperties.PartNumber = false;
	
	var showProp = [];
	if($(gridObject).attr('grouping')) {
		if($(gridObject).attr('grouping').indexOf(',') != -1) {
			for(key in groupColShowProperties) {
				showProp.push(groupColShowProperties[key]);
			}
		}else {
			showProp.push(groupColShowProperties[$(gridObject).attr('grouping')]);
		}
	}else {
		showProp.push(groupColShowProperties.Name);
	}
	return showProp;
};


$(window).on('resize.jqGrid',function(event) {
	var gridList = $('.convertTojqGrid');
	gridList.each(function(){
		$('#'+$(this).attr('id')).jqGrid('setGridWidth', $('body').width() - 50);
	});
});

var RenderJQGrids = function(){ 	
	$('.convertTojqGrid').each(function(){
		customJqgrid($(this)[0]);
	});
};

$(function(){
	RenderJQGrids();
});

/*! jQuery UI - v1.10.4 - 2014-04-20
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function(e,t){function i(t,i){var s,a,o,r=t.nodeName.toLowerCase();return"area"===r?(s=t.parentNode,a=s.name,t.href&&a&&"map"===s.nodeName.toLowerCase()?(o=e("img[usemap=#"+a+"]")[0],!!o&&n(o)):!1):(/input|select|textarea|button|object/.test(r)?!t.disabled:"a"===r?t.href||i:i)&&n(t)}function n(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var s=0,a=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.4",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,n){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),n&&n.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var n,s,a=e(this[0]);a.length&&a[0]!==document;){if(n=a.css("position"),("absolute"===n||"relative"===n||"fixed"===n)&&(s=parseInt(a.css("zIndex"),10),!isNaN(s)&&0!==s))return s;a=a.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++s)})},removeUniqueId:function(){return this.each(function(){a.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,n){return!!e.data(t,n[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var n=e.attr(t,"tabindex"),s=isNaN(n);return(s||n>=0)&&i(t,!s)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,n){function s(t,i,n,s){return e.each(a,function(){i-=parseFloat(e.css(t,"padding"+this))||0,n&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var a="Width"===n?["Left","Right"]:["Top","Bottom"],o=n.toLowerCase(),r={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+n]=function(i){return i===t?r["inner"+n].call(this):this.each(function(){e(this).css(o,s(this,i)+"px")})},e.fn["outer"+n]=function(t,i){return"number"!=typeof t?r["outer"+n].call(this,t):this.each(function(){e(this).css(o,s(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,n){var s,a=e.ui[t].prototype;for(s in n)a.plugins[s]=a.plugins[s]||[],a.plugins[s].push([i,n[s]])},call:function(e,t,i){var n,s=e.plugins[t];if(s&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(n=0;s.length>n;n++)e.options[s[n][0]]&&s[n][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var n=i&&"left"===i?"scrollLeft":"scrollTop",s=!1;return t[n]>0?!0:(t[n]=1,s=t[n]>0,t[n]=0,s)}})})(jQuery);(function(t,e){var i=0,s=Array.prototype.slice,n=t.cleanData;t.cleanData=function(e){for(var i,s=0;null!=(i=e[s]);s++)try{t(i).triggerHandler("remove")}catch(o){}n(e)},t.widget=function(i,s,n){var o,a,r,h,l={},c=i.split(".")[0];i=i.split(".")[1],o=c+"-"+i,n||(n=s,s=t.Widget),t.expr[":"][o.toLowerCase()]=function(e){return!!t.data(e,o)},t[c]=t[c]||{},a=t[c][i],r=t[c][i]=function(t,i){return this._createWidget?(arguments.length&&this._createWidget(t,i),e):new r(t,i)},t.extend(r,a,{version:n.version,_proto:t.extend({},n),_childConstructors:[]}),h=new s,h.options=t.widget.extend({},h.options),t.each(n,function(i,n){return t.isFunction(n)?(l[i]=function(){var t=function(){return s.prototype[i].apply(this,arguments)},e=function(t){return s.prototype[i].apply(this,t)};return function(){var i,s=this._super,o=this._superApply;return this._super=t,this._superApply=e,i=n.apply(this,arguments),this._super=s,this._superApply=o,i}}(),e):(l[i]=n,e)}),r.prototype=t.widget.extend(h,{widgetEventPrefix:a?h.widgetEventPrefix||i:i},l,{constructor:r,namespace:c,widgetName:i,widgetFullName:o}),a?(t.each(a._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,r,i._proto)}),delete a._childConstructors):s._childConstructors.push(r),t.widget.bridge(i,r)},t.widget.extend=function(i){for(var n,o,a=s.call(arguments,1),r=0,h=a.length;h>r;r++)for(n in a[r])o=a[r][n],a[r].hasOwnProperty(n)&&o!==e&&(i[n]=t.isPlainObject(o)?t.isPlainObject(i[n])?t.widget.extend({},i[n],o):t.widget.extend({},o):o);return i},t.widget.bridge=function(i,n){var o=n.prototype.widgetFullName||i;t.fn[i]=function(a){var r="string"==typeof a,h=s.call(arguments,1),l=this;return a=!r&&h.length?t.widget.extend.apply(null,[a].concat(h)):a,r?this.each(function(){var s,n=t.data(this,o);return n?t.isFunction(n[a])&&"_"!==a.charAt(0)?(s=n[a].apply(n,h),s!==n&&s!==e?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):e):t.error("no such method '"+a+"' for "+i+" widget instance"):t.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+a+"'")}):this.each(function(){var e=t.data(this,o);e?e.option(a||{})._init():t.data(this,o,new n(a,this))}),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(e,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this.bindings=t(),this.hoverable=t(),this.focusable=t(),s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:t.noop,_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:t.noop,widget:function(){return this.element},option:function(i,s){var n,o,a,r=i;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof i)if(r={},n=i.split("."),i=n.shift(),n.length){for(o=r[i]=t.widget.extend({},this.options[i]),a=0;n.length-1>a;a++)o[n[a]]=o[n[a]]||{},o=o[n[a]];if(i=n.pop(),1===arguments.length)return o[i]===e?null:o[i];o[i]=s}else{if(1===arguments.length)return this.options[i]===e?null:this.options[i];r[i]=s}return this._setOptions(r),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return this.options[t]=e,"disabled"===t&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!e).attr("aria-disabled",e),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var o,a=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=o=t(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,o=this.widget()),t.each(n,function(n,r){function h(){return i||a.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof r?a[r]:r).apply(a,arguments):e}"string"!=typeof r&&(h.guid=r.guid=r.guid||h.guid||t.guid++);var l=n.match(/^(\w+)\s*(.*)$/),c=l[1]+a.eventNamespace,u=l[2];u?o.delegate(u,c,h):s.bind(c,h)})},_off:function(t,e){e=(e||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(e).undelegate(e)},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){t(e.currentTarget).addClass("ui-state-hover")},mouseleave:function(e){t(e.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){t(e.currentTarget).addClass("ui-state-focus")},focusout:function(e){t(e.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}})})(jQuery);(function(t){var e=!1;t(document).mouseup(function(){e=!1}),t.widget("ui.mouse",{version:"1.10.4",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.bind("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).bind("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!e){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,a="string"==typeof this.options.cancel&&i.target.nodeName?t(i.target).closest(this.options.cancel).length:!1;return n&&!a&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===t.data(i.target,this.widgetName+".preventClickEvent")&&t.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return s._mouseMove(t)},this._mouseUpDelegate=function(t){return s._mouseUp(t)},t(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),e=!0,!0)):!0}},_mouseMove:function(e){return t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button?this._mouseUp(e):this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){return t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),!1},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var a,o=Math.max,r=Math.abs,l=Math.round,h=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(a!==e)return a;var i,s,n=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=n.children()[0];return t("body").append(n),i=o.offsetWidth,n.css("overflow","scroll"),s=o.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),a=i-s},getScrollInfo:function(e){var i=e.isWindow||e.isDocument?"":e.element.css("overflow-x"),s=e.isWindow||e.isDocument?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,a="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:a?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType;return{element:i,isWindow:s,isDocument:n,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var a,p,g,m,v,_,b=t(e.of),y=t.position.getWithinInfo(e.within),k=t.position.getScrollInfo(y),w=(e.collision||"flip").split(" "),D={};return _=n(b),b[0].preventDefault&&(e.at="left top"),p=_.width,g=_.height,m=_.offset,v=t.extend({},m),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=h.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=h.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),D[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===w.length&&(w[1]=w[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=g:"center"===e.at[1]&&(v.top+=g/2),a=i(D.at,p,g),v.left+=a[0],v.top+=a[1],this.each(function(){var n,h,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),_=s(this,"marginTop"),x=u+f+s(this,"marginRight")+k.width,C=d+_+s(this,"marginBottom")+k.height,M=t.extend({},v),T=i(D.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?M.left-=u:"center"===e.my[0]&&(M.left-=u/2),"bottom"===e.my[1]?M.top-=d:"center"===e.my[1]&&(M.top-=d/2),M.left+=T[0],M.top+=T[1],t.support.offsetFractions||(M.left=l(M.left),M.top=l(M.top)),n={marginLeft:f,marginTop:_},t.each(["left","top"],function(i,s){t.ui.position[w[i]]&&t.ui.position[w[i]][s](M,{targetWidth:p,targetHeight:g,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:x,collisionHeight:C,offset:[a[0]+T[0],a[1]+T[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(h=function(t){var i=m.left-M.left,s=i+p-u,n=m.top-M.top,a=n+g-d,l={target:{element:b,left:m.left,top:m.top,width:p,height:g},element:{element:c,left:M.left,top:M.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>a?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(l.horizontal="center"),d>g&&g>r(n+a)&&(l.vertical="middle"),l.important=o(r(i),r(s))>o(r(n),r(a))?"horizontal":"vertical",e.using.call(this,t,l)}),c.offset(t.extend(M,{using:h}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,l=n-r,h=r+e.collisionWidth-a-n;e.collisionWidth>a?l>0&&0>=h?(i=t.left+l+e.collisionWidth-a-n,t.left+=l-i):t.left=h>0&&0>=l?n:l>h?n+a-e.collisionWidth:n:l>0?t.left+=l:h>0?t.left-=h:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,l=n-r,h=r+e.collisionHeight-a-n;e.collisionHeight>a?l>0&&0>=h?(i=t.top+l+e.collisionHeight-a-n,t.top+=l-i):t.top=h>0&&0>=l?n:l>h?n+a-e.collisionHeight:n:l>0?t.top+=l:h>0?t.top-=h:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,a=n.offset.left+n.scrollLeft,o=n.width,l=n.isWindow?n.scrollLeft:n.offset.left,h=t.left-e.collisionPosition.marginLeft,c=h-l,u=h+e.collisionWidth-o-l,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-o-a,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-l,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,a=n.offset.top+n.scrollTop,o=n.height,l=n.isWindow?n.scrollTop:n.offset.top,h=t.top-e.collisionPosition.marginTop,c=h-l,u=h+e.collisionHeight-o-l,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-o-a,t.top+p+f+g>c&&(0>s||r(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-l,t.top+p+f+g>u&&(i>0||u>r(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,a,o=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(o?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(a in s)e.style[a]=s[a];e.appendChild(r),i=o||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()})(jQuery);(function(t){t.widget("ui.draggable",t.ui.mouse,{version:"1.10.4",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(e){var i=this.options;return this.helper||i.disabled||t(e.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(e),this.handle?(t(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){t("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(t(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(e){var i=this.options;return this.helper=this._createHelper(e),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),t.ui.ddmanager&&(t.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offsetParent=this.helper.offsetParent(),this.offsetParentCssPosition=this.offsetParent.css("position"),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.offset.scroll=!1,t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",e)===!1?(this._clear(),!1):(this._cacheHelperProportions(),t.ui.ddmanager&&!i.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this._mouseDrag(e,!0),t.ui.ddmanager&&t.ui.ddmanager.dragStart(this,e),!0)},_mouseDrag:function(e,i){if("fixed"===this.offsetParentCssPosition&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",e,s)===!1)return this._mouseUp({}),!1;this.position=s.position}return this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),!1},_mouseStop:function(e){var i=this,s=!1;return t.ui.ddmanager&&!this.options.dropBehaviour&&(s=t.ui.ddmanager.drop(this,e)),this.dropped&&(s=this.dropped,this.dropped=!1),"original"!==this.options.helper||t.contains(this.element[0].ownerDocument,this.element[0])?("invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||t.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?t(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",e)!==!1&&i._clear()}):this._trigger("stop",e)!==!1&&this._clear(),!1):!1},_mouseUp:function(e){return t("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),t.ui.ddmanager&&t.ui.ddmanager.dragStop(this,e),t.ui.mouse.prototype._mouseUp.call(this,e)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(e){return this.options.handle?!!t(e.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return s.parents("body").length||s.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s[0]===this.element[0]||/(fixed|absolute)/.test(s.css("position"))||s.css("position","absolute"),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.element.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;return n.containment?"window"===n.containment?(this.containment=[t(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,t(window).scrollLeft()+t(window).width()-this.helperProportions.width-this.margins.left,t(window).scrollTop()+(t(window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):"document"===n.containment?(this.containment=[0,0,t(document).width()-this.helperProportions.width-this.margins.left,(t(document).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):n.containment.constructor===Array?(this.containment=n.containment,undefined):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=t(n.containment),s=i[0],s&&(e="hidden"!==i.css("overflow"),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(e?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(e?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i),undefined):(this.containment=null,undefined)},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent;return this.offset.scroll||(this.offset.scroll={top:n.scrollTop(),left:n.scrollLeft()}),{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top)*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)*s}},_generatePosition:function(e){var i,s,n,a,o=this.options,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,l=e.pageX,h=e.pageY;return this.offset.scroll||(this.offset.scroll={top:r.scrollTop(),left:r.scrollLeft()}),this.originalPosition&&(this.containment&&(this.relative_container?(s=this.relative_container.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,e.pageX-this.offset.click.left<i[0]&&(l=i[0]+this.offset.click.left),e.pageY-this.offset.click.top<i[1]&&(h=i[1]+this.offset.click.top),e.pageX-this.offset.click.left>i[2]&&(l=i[2]+this.offset.click.left),e.pageY-this.offset.click.top>i[3]&&(h=i[3]+this.offset.click.top)),o.grid&&(n=o.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/o.grid[1])*o.grid[1]:this.originalPageY,h=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-o.grid[1]:n+o.grid[1]:n,a=o.grid[0]?this.originalPageX+Math.round((l-this.originalPageX)/o.grid[0])*o.grid[0]:this.originalPageX,l=i?a-this.offset.click.left>=i[0]||a-this.offset.click.left>i[2]?a:a-this.offset.click.left>=i[0]?a-o.grid[0]:a+o.grid[0]:a)),{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top),left:l-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(e,i,s){return s=s||this._uiHash(),t.ui.plugin.call(this,e,[i,s]),"drag"===e&&(this.positionAbs=this._convertPositionTo("absolute")),t.Widget.prototype._trigger.call(this,e,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),t.ui.plugin.add("draggable","connectToSortable",{start:function(e,i){var s=t(this).data("ui-draggable"),n=s.options,a=t.extend({},i,{item:s.element});s.sortables=[],t(n.connectToSortable).each(function(){var i=t.data(this,"ui-sortable");i&&!i.options.disabled&&(s.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",e,a))})},stop:function(e,i){var s=t(this).data("ui-draggable"),n=t.extend({},i,{item:s.element});t.each(s.sortables,function(){this.instance.isOver?(this.instance.isOver=0,s.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(e),this.instance.options.helper=this.instance.options._helper,"original"===s.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",e,n))})},drag:function(e,i){var s=t(this).data("ui-draggable"),n=this;t.each(s.sortables,function(){var a=!1,o=this;this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(a=!0,t.each(s.sortables,function(){return this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this!==o&&this.instance._intersectsWith(this.instance.containerCache)&&t.contains(o.instance.element[0],this.instance.element[0])&&(a=!1),a})),a?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=t(n).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},e.target=this.instance.currentItem[0],this.instance._mouseCapture(e,!0),this.instance._mouseStart(e,!0,!0),this.instance.offset.click.top=s.offset.click.top,this.instance.offset.click.left=s.offset.click.left,this.instance.offset.parent.left-=s.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=s.offset.parent.top-this.instance.offset.parent.top,s._trigger("toSortable",e),s.dropped=this.instance.element,s.currentItem=s.element,this.instance.fromOutside=s),this.instance.currentItem&&this.instance._mouseDrag(e)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",e,this.instance._uiHash(this.instance)),this.instance._mouseStop(e,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),s._trigger("fromSortable",e),s.dropped=!1)})}}),t.ui.plugin.add("draggable","cursor",{start:function(){var e=t("body"),i=t(this).data("ui-draggable").options;e.css("cursor")&&(i._cursor=e.css("cursor")),e.css("cursor",i.cursor)},stop:function(){var e=t(this).data("ui-draggable").options;e._cursor&&t("body").css("cursor",e._cursor)}}),t.ui.plugin.add("draggable","opacity",{start:function(e,i){var s=t(i.helper),n=t(this).data("ui-draggable").options;s.css("opacity")&&(n._opacity=s.css("opacity")),s.css("opacity",n.opacity)},stop:function(e,i){var s=t(this).data("ui-draggable").options;s._opacity&&t(i.helper).css("opacity",s._opacity)}}),t.ui.plugin.add("draggable","scroll",{start:function(){var e=t(this).data("ui-draggable");e.scrollParent[0]!==document&&"HTML"!==e.scrollParent[0].tagName&&(e.overflowOffset=e.scrollParent.offset())},drag:function(e){var i=t(this).data("ui-draggable"),s=i.options,n=!1;i.scrollParent[0]!==document&&"HTML"!==i.scrollParent[0].tagName?(s.axis&&"x"===s.axis||(i.overflowOffset.top+i.scrollParent[0].offsetHeight-e.pageY<s.scrollSensitivity?i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop+s.scrollSpeed:e.pageY-i.overflowOffset.top<s.scrollSensitivity&&(i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop-s.scrollSpeed)),s.axis&&"y"===s.axis||(i.overflowOffset.left+i.scrollParent[0].offsetWidth-e.pageX<s.scrollSensitivity?i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft+s.scrollSpeed:e.pageX-i.overflowOffset.left<s.scrollSensitivity&&(i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft-s.scrollSpeed))):(s.axis&&"x"===s.axis||(e.pageY-t(document).scrollTop()<s.scrollSensitivity?n=t(document).scrollTop(t(document).scrollTop()-s.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<s.scrollSensitivity&&(n=t(document).scrollTop(t(document).scrollTop()+s.scrollSpeed))),s.axis&&"y"===s.axis||(e.pageX-t(document).scrollLeft()<s.scrollSensitivity?n=t(document).scrollLeft(t(document).scrollLeft()-s.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<s.scrollSensitivity&&(n=t(document).scrollLeft(t(document).scrollLeft()+s.scrollSpeed)))),n!==!1&&t.ui.ddmanager&&!s.dropBehaviour&&t.ui.ddmanager.prepareOffsets(i,e)}}),t.ui.plugin.add("draggable","snap",{start:function(){var e=t(this).data("ui-draggable"),i=e.options;e.snapElements=[],t(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=t(this),s=i.offset();this!==e.element[0]&&e.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:s.top,left:s.left})})},drag:function(e,i){var s,n,a,o,r,l,h,c,u,d,p=t(this).data("ui-draggable"),g=p.options,f=g.snapTolerance,m=i.offset.left,_=m+p.helperProportions.width,v=i.offset.top,b=v+p.helperProportions.height;for(u=p.snapElements.length-1;u>=0;u--)r=p.snapElements[u].left,l=r+p.snapElements[u].width,h=p.snapElements[u].top,c=h+p.snapElements[u].height,r-f>_||m>l+f||h-f>b||v>c+f||!t.contains(p.snapElements[u].item.ownerDocument,p.snapElements[u].item)?(p.snapElements[u].snapping&&p.options.snap.release&&p.options.snap.release.call(p.element,e,t.extend(p._uiHash(),{snapItem:p.snapElements[u].item})),p.snapElements[u].snapping=!1):("inner"!==g.snapMode&&(s=f>=Math.abs(h-b),n=f>=Math.abs(c-v),a=f>=Math.abs(r-_),o=f>=Math.abs(l-m),s&&(i.position.top=p._convertPositionTo("relative",{top:h-p.helperProportions.height,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:c,left:0}).top-p.margins.top),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r-p.helperProportions.width}).left-p.margins.left),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l}).left-p.margins.left)),d=s||n||a||o,"outer"!==g.snapMode&&(s=f>=Math.abs(h-v),n=f>=Math.abs(c-b),a=f>=Math.abs(r-m),o=f>=Math.abs(l-_),s&&(i.position.top=p._convertPositionTo("relative",{top:h,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:c-p.helperProportions.height,left:0}).top-p.margins.top),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r}).left-p.margins.left),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l-p.helperProportions.width}).left-p.margins.left)),!p.snapElements[u].snapping&&(s||n||a||o||d)&&p.options.snap.snap&&p.options.snap.snap.call(p.element,e,t.extend(p._uiHash(),{snapItem:p.snapElements[u].item})),p.snapElements[u].snapping=s||n||a||o||d)}}),t.ui.plugin.add("draggable","stack",{start:function(){var e,i=this.data("ui-draggable").options,s=t.makeArray(t(i.stack)).sort(function(e,i){return(parseInt(t(e).css("zIndex"),10)||0)-(parseInt(t(i).css("zIndex"),10)||0)});s.length&&(e=parseInt(t(s[0]).css("zIndex"),10)||0,t(s).each(function(i){t(this).css("zIndex",e+i)}),this.css("zIndex",e+s.length))}}),t.ui.plugin.add("draggable","zIndex",{start:function(e,i){var s=t(i.helper),n=t(this).data("ui-draggable").options;s.css("zIndex")&&(n._zIndex=s.css("zIndex")),s.css("zIndex",n.zIndex)},stop:function(e,i){var s=t(this).data("ui-draggable").options;s._zIndex&&t(i.helper).css("zIndex",s._zIndex)}})})(jQuery);(function(t){function e(t,e,i){return t>e&&e+i>t}t.widget("ui.droppable",{version:"1.10.4",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var e,i=this.options,s=i.accept;this.isover=!1,this.isout=!0,this.accept=t.isFunction(s)?s:function(t){return t.is(s)},this.proportions=function(){return arguments.length?(e=arguments[0],undefined):e?e:e={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight}},t.ui.ddmanager.droppables[i.scope]=t.ui.ddmanager.droppables[i.scope]||[],t.ui.ddmanager.droppables[i.scope].push(this),i.addClasses&&this.element.addClass("ui-droppable")},_destroy:function(){for(var e=0,i=t.ui.ddmanager.droppables[this.options.scope];i.length>e;e++)i[e]===this&&i.splice(e,1);this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(e,i){"accept"===e&&(this.accept=t.isFunction(i)?i:function(t){return t.is(i)}),t.Widget.prototype._setOption.apply(this,arguments)},_activate:function(e){var i=t.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),i&&this._trigger("activate",e,this.ui(i))},_deactivate:function(e){var i=t.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),i&&this._trigger("deactivate",e,this.ui(i))},_over:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",e,this.ui(i)))},_out:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",e,this.ui(i)))},_drop:function(e,i){var s=i||t.ui.ddmanager.current,n=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var e=t.data(this,"ui-droppable");return e.options.greedy&&!e.options.disabled&&e.options.scope===s.options.scope&&e.accept.call(e.element[0],s.currentItem||s.element)&&t.ui.intersect(s,t.extend(e,{offset:e.element.offset()}),e.options.tolerance)?(n=!0,!1):undefined}),n?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",e,this.ui(s)),this.element):!1):!1},ui:function(t){return{draggable:t.currentItem||t.element,helper:t.helper,position:t.position,offset:t.positionAbs}}}),t.ui.intersect=function(t,i,s){if(!i.offset)return!1;var n,a,o=(t.positionAbs||t.position.absolute).left,r=(t.positionAbs||t.position.absolute).top,l=o+t.helperProportions.width,h=r+t.helperProportions.height,c=i.offset.left,u=i.offset.top,d=c+i.proportions().width,p=u+i.proportions().height;switch(s){case"fit":return o>=c&&d>=l&&r>=u&&p>=h;case"intersect":return o+t.helperProportions.width/2>c&&d>l-t.helperProportions.width/2&&r+t.helperProportions.height/2>u&&p>h-t.helperProportions.height/2;case"pointer":return n=(t.positionAbs||t.position.absolute).left+(t.clickOffset||t.offset.click).left,a=(t.positionAbs||t.position.absolute).top+(t.clickOffset||t.offset.click).top,e(a,u,i.proportions().height)&&e(n,c,i.proportions().width);case"touch":return(r>=u&&p>=r||h>=u&&p>=h||u>r&&h>p)&&(o>=c&&d>=o||l>=c&&d>=l||c>o&&l>d);default:return!1}},t.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(e,i){var s,n,a=t.ui.ddmanager.droppables[e.options.scope]||[],o=i?i.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();t:for(s=0;a.length>s;s++)if(!(a[s].options.disabled||e&&!a[s].accept.call(a[s].element[0],e.currentItem||e.element))){for(n=0;r.length>n;n++)if(r[n]===a[s].element[0]){a[s].proportions().height=0;continue t}a[s].visible="none"!==a[s].element.css("display"),a[s].visible&&("mousedown"===o&&a[s]._activate.call(a[s],i),a[s].offset=a[s].element.offset(),a[s].proportions({width:a[s].element[0].offsetWidth,height:a[s].element[0].offsetHeight}))}},drop:function(e,i){var s=!1;return t.each((t.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&t.ui.intersect(e,this,this.options.tolerance)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(e,i){e.element.parentsUntil("body").bind("scroll.droppable",function(){e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)})},drag:function(e,i){e.options.refreshPositions&&t.ui.ddmanager.prepareOffsets(e,i),t.each(t.ui.ddmanager.droppables[e.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,n,a,o=t.ui.intersect(e,this,this.options.tolerance),r=!o&&this.isover?"isout":o&&!this.isover?"isover":null;r&&(this.options.greedy&&(n=this.options.scope,a=this.element.parents(":data(ui-droppable)").filter(function(){return t.data(this,"ui-droppable").options.scope===n}),a.length&&(s=t.data(a[0],"ui-droppable"),s.greedyChild="isover"===r)),s&&"isover"===r&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[r]=!0,this["isout"===r?"isover":"isout"]=!1,this["isover"===r?"_over":"_out"].call(this,i),s&&"isout"===r&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(e,i){e.element.parentsUntil("body").unbind("scroll.droppable"),e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)}}})(jQuery);(function(t){function e(t){return parseInt(t,10)||0}function i(t){return!isNaN(parseInt(t,10))}t.widget("ui.resizable",t.ui.mouse,{version:"1.10.4",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_create:function(){var e,i,s,n,a,o=this,r=this.options;if(this.element.addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!r.aspectRatio,aspectRatio:r.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:r.helper||r.ghost||r.animate?r.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.data("ui-resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=r.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),e=this.handles.split(","),this.handles={},i=0;e.length>i;i++)s=t.trim(e[i]),a="ui-resizable-"+s,n=t("<div class='ui-resizable-handle "+a+"'></div>"),n.css({zIndex:r.zIndex}),"se"===s&&n.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(n);this._renderAxis=function(e){var i,s,n,a;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String&&(this.handles[i]=t(this.handles[i],this.element).show()),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)&&(s=t(this.handles[i],this.element),a=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,a),this._proportionallyResize()),t(this.handles[i]).length},this._renderAxis(this.element),this._handles=t(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){o.resizing||(this.className&&(n=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),o.axis=n&&n[1]?n[1]:"se")}),r.autoHide&&(this._handles.hide(),t(this.element).addClass("ui-resizable-autohide").mouseenter(function(){r.disabled||(t(this).removeClass("ui-resizable-autohide"),o._handles.show())}).mouseleave(function(){r.disabled||o.resizing||(t(this).addClass("ui-resizable-autohide"),o._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(i){var s,n,a,o=this.options,r=this.element.position(),h=this.element;return this.resizing=!0,/absolute/.test(h.css("position"))?h.css({position:"absolute",top:h.css("top"),left:h.css("left")}):h.is(".ui-draggable")&&h.css({position:"absolute",top:r.top,left:r.left}),this._renderProxy(),s=e(this.helper.css("left")),n=e(this.helper.css("top")),o.containment&&(s+=t(o.containment).scrollLeft()||0,n+=t(o.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:s,top:n},this.size=this._helper?{width:this.helper.width(),height:this.helper.height()}:{width:h.width(),height:h.height()},this.originalSize=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalPosition={left:s,top:n},this.sizeDiff={width:h.outerWidth()-h.width(),height:h.outerHeight()-h.height()},this.originalMousePosition={left:i.pageX,top:i.pageY},this.aspectRatio="number"==typeof o.aspectRatio?o.aspectRatio:this.originalSize.width/this.originalSize.height||1,a=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===a?this.axis+"-resize":a),h.addClass("ui-resizable-resizing"),this._propagate("start",i),!0},_mouseDrag:function(e){var i,s=this.helper,n={},a=this.originalMousePosition,o=this.axis,r=this.position.top,h=this.position.left,l=this.size.width,c=this.size.height,u=e.pageX-a.left||0,d=e.pageY-a.top||0,p=this._change[o];return p?(i=p.apply(this,[e,u,d]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),this.position.top!==r&&(n.top=this.position.top+"px"),this.position.left!==h&&(n.left=this.position.left+"px"),this.size.width!==l&&(n.width=this.size.width+"px"),this.size.height!==c&&(n.height=this.size.height+"px"),s.css(n),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(n)||this._trigger("resize",e,this.ui()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,a,o,r,h,l=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&t.ui.hasScroll(i[0],"left")?0:c.sizeDiff.height,a=s?0:c.sizeDiff.width,o={width:c.helper.width()-a,height:c.helper.height()-n},r=parseInt(c.element.css("left"),10)+(c.position.left-c.originalPosition.left)||null,h=parseInt(c.element.css("top"),10)+(c.position.top-c.originalPosition.top)||null,l.animate||this.element.css(t.extend(o,{top:h,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!l.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(t){var e,s,n,a,o,r=this.options;o={minWidth:i(r.minWidth)?r.minWidth:0,maxWidth:i(r.maxWidth)?r.maxWidth:1/0,minHeight:i(r.minHeight)?r.minHeight:0,maxHeight:i(r.maxHeight)?r.maxHeight:1/0},(this._aspectRatio||t)&&(e=o.minHeight*this.aspectRatio,n=o.minWidth/this.aspectRatio,s=o.maxHeight*this.aspectRatio,a=o.maxWidth/this.aspectRatio,e>o.minWidth&&(o.minWidth=e),n>o.minHeight&&(o.minHeight=n),o.maxWidth>s&&(o.maxWidth=s),o.maxHeight>a&&(o.maxHeight=a)),this._vBoundaries=o},_updateCache:function(t){this.offset=this.helper.offset(),i(t.left)&&(this.position.left=t.left),i(t.top)&&(this.position.top=t.top),i(t.height)&&(this.size.height=t.height),i(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,s=this.size,n=this.axis;return i(t.height)?t.width=t.height*this.aspectRatio:i(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===n&&(t.left=e.left+(s.width-t.width),t.top=null),"nw"===n&&(t.top=e.top+(s.height-t.height),t.left=e.left+(s.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,s=this.axis,n=i(t.width)&&e.maxWidth&&e.maxWidth<t.width,a=i(t.height)&&e.maxHeight&&e.maxHeight<t.height,o=i(t.width)&&e.minWidth&&e.minWidth>t.width,r=i(t.height)&&e.minHeight&&e.minHeight>t.height,h=this.originalPosition.left+this.originalSize.width,l=this.position.top+this.size.height,c=/sw|nw|w/.test(s),u=/nw|ne|n/.test(s);return o&&(t.width=e.minWidth),r&&(t.height=e.minHeight),n&&(t.width=e.maxWidth),a&&(t.height=e.maxHeight),o&&c&&(t.left=h-e.minWidth),n&&c&&(t.left=h-e.maxWidth),r&&u&&(t.top=l-e.minHeight),a&&u&&(t.top=l-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_proportionallyResize:function(){if(this._proportionallyResizeElements.length){var t,e,i,s,n,a=this.helper||this.element;for(t=0;this._proportionallyResizeElements.length>t;t++){if(n=this._proportionallyResizeElements[t],!this.borderDif)for(this.borderDif=[],i=[n.css("borderTopWidth"),n.css("borderRightWidth"),n.css("borderBottomWidth"),n.css("borderLeftWidth")],s=[n.css("paddingTop"),n.css("paddingRight"),n.css("paddingBottom"),n.css("paddingLeft")],e=0;i.length>e;e++)this.borderDif[e]=(parseInt(i[e],10)||0)+(parseInt(s[e],10)||0);n.css({height:a.height()-this.borderDif[0]-this.borderDif[2]||0,width:a.width()-this.borderDif[1]-this.borderDif[3]||0})}}},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).data("ui-resizable"),s=i.options,n=i._proportionallyResizeElements,a=n.length&&/textarea/i.test(n[0].nodeName),o=a&&t.ui.hasScroll(n[0],"left")?0:i.sizeDiff.height,r=a?0:i.sizeDiff.width,h={width:i.size.width-r,height:i.size.height-o},l=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,c=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(h,c&&l?{top:c,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var i,s,n,a,o,r,h,l=t(this).data("ui-resizable"),c=l.options,u=l.element,d=c.containment,p=d instanceof t?d.get(0):/parent/.test(d)?u.parent().get(0):d;p&&(l.containerElement=t(p),/document/.test(d)||d===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(i=t(p),s=[],t(["Top","Right","Left","Bottom"]).each(function(t,n){s[t]=e(i.css("padding"+n))}),l.containerOffset=i.offset(),l.containerPosition=i.position(),l.containerSize={height:i.innerHeight()-s[3],width:i.innerWidth()-s[1]},n=l.containerOffset,a=l.containerSize.height,o=l.containerSize.width,r=t.ui.hasScroll(p,"left")?p.scrollWidth:o,h=t.ui.hasScroll(p)?p.scrollHeight:a,l.parentData={element:p,left:n.left,top:n.top,width:r,height:h}))},resize:function(e){var i,s,n,a,o=t(this).data("ui-resizable"),r=o.options,h=o.containerOffset,l=o.position,c=o._aspectRatio||e.shiftKey,u={top:0,left:0},d=o.containerElement;d[0]!==document&&/static/.test(d.css("position"))&&(u=h),l.left<(o._helper?h.left:0)&&(o.size.width=o.size.width+(o._helper?o.position.left-h.left:o.position.left-u.left),c&&(o.size.height=o.size.width/o.aspectRatio),o.position.left=r.helper?h.left:0),l.top<(o._helper?h.top:0)&&(o.size.height=o.size.height+(o._helper?o.position.top-h.top:o.position.top),c&&(o.size.width=o.size.height*o.aspectRatio),o.position.top=o._helper?h.top:0),o.offset.left=o.parentData.left+o.position.left,o.offset.top=o.parentData.top+o.position.top,i=Math.abs((o._helper?o.offset.left-u.left:o.offset.left-u.left)+o.sizeDiff.width),s=Math.abs((o._helper?o.offset.top-u.top:o.offset.top-h.top)+o.sizeDiff.height),n=o.containerElement.get(0)===o.element.parent().get(0),a=/relative|absolute/.test(o.containerElement.css("position")),n&&a&&(i-=Math.abs(o.parentData.left)),i+o.size.width>=o.parentData.width&&(o.size.width=o.parentData.width-i,c&&(o.size.height=o.size.width/o.aspectRatio)),s+o.size.height>=o.parentData.height&&(o.size.height=o.parentData.height-s,c&&(o.size.width=o.size.height*o.aspectRatio))},stop:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.containerOffset,n=e.containerPosition,a=e.containerElement,o=t(e.helper),r=o.offset(),h=o.outerWidth()-e.sizeDiff.width,l=o.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(a.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l}),e._helper&&!i.animate&&/static/.test(a.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).data("ui-resizable"),i=e.options,s=function(e){t(e).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseInt(e.width(),10),height:parseInt(e.height(),10),left:parseInt(e.css("left"),10),top:parseInt(e.css("top"),10)})})};"object"!=typeof i.alsoResize||i.alsoResize.parentNode?s(i.alsoResize):i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):t.each(i.alsoResize,function(t){s(t)})},resize:function(e,i){var s=t(this).data("ui-resizable"),n=s.options,a=s.originalSize,o=s.originalPosition,r={height:s.size.height-a.height||0,width:s.size.width-a.width||0,top:s.position.top-o.top||0,left:s.position.left-o.left||0},h=function(e,s){t(e).each(function(){var e=t(this),n=t(this).data("ui-resizable-alsoresize"),a={},o=s&&s.length?s:e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(o,function(t,e){var i=(n[e]||0)+(r[e]||0);i&&i>=0&&(a[e]=i||null)}),e.css(a)})};"object"!=typeof n.alsoResize||n.alsoResize.nodeType?h(n.alsoResize):t.each(n.alsoResize,function(t,e){h(t,e)})},stop:function(){t(this).removeData("resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof i.ghost?i.ghost:""),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).data("ui-resizable");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).data("ui-resizable");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.size,n=e.originalSize,a=e.originalPosition,o=e.axis,r="number"==typeof i.grid?[i.grid,i.grid]:i.grid,h=r[0]||1,l=r[1]||1,c=Math.round((s.width-n.width)/h)*h,u=Math.round((s.height-n.height)/l)*l,d=n.width+c,p=n.height+u,f=i.maxWidth&&d>i.maxWidth,g=i.maxHeight&&p>i.maxHeight,m=i.minWidth&&i.minWidth>d,v=i.minHeight&&i.minHeight>p;i.grid=r,m&&(d+=h),v&&(p+=l),f&&(d-=h),g&&(p-=l),/^(se|s|e)$/.test(o)?(e.size.width=d,e.size.height=p):/^(ne)$/.test(o)?(e.size.width=d,e.size.height=p,e.position.top=a.top-u):/^(sw)$/.test(o)?(e.size.width=d,e.size.height=p,e.position.left=a.left-c):(p-l>0?(e.size.height=p,e.position.top=a.top-u):(e.size.height=l,e.position.top=a.top+n.height-l),d-h>0?(e.size.width=d,e.position.left=a.left-c):(e.size.width=h,e.position.left=a.left+n.width-h))}})})(jQuery);(function(t){t.widget("ui.selectable",t.ui.mouse,{version:"1.10.4",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var e,i=this;this.element.addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){e=t(i.options.filter,i.element[0]),e.addClass("ui-selectee"),e.each(function(){var e=t(this),i=e.offset();t.data(this,"selectable-item",{element:this,$element:e,left:i.left,top:i.top,right:i.left+e.outerWidth(),bottom:i.top+e.outerHeight(),startselected:!1,selected:e.hasClass("ui-selected"),selecting:e.hasClass("ui-selecting"),unselecting:e.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=e.addClass("ui-selectee"),this._mouseInit(),this.helper=t("<div class='ui-selectable-helper'></div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy()},_mouseStart:function(e){var i=this,s=this.options;this.opos=[e.pageX,e.pageY],this.options.disabled||(this.selectees=t(s.filter,this.element[0]),this._trigger("start",e),t(s.appendTo).append(this.helper),this.helper.css({left:e.pageX,top:e.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=t.data(this,"selectable-item");s.startselected=!0,e.metaKey||e.ctrlKey||(s.$element.removeClass("ui-selected"),s.selected=!1,s.$element.addClass("ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",e,{unselecting:s.element}))}),t(e.target).parents().addBack().each(function(){var s,n=t.data(this,"selectable-item");return n?(s=!e.metaKey&&!e.ctrlKey||!n.$element.hasClass("ui-selected"),n.$element.removeClass(s?"ui-unselecting":"ui-selected").addClass(s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",e,{selecting:n.element}):i._trigger("unselecting",e,{unselecting:n.element}),!1):undefined}))},_mouseDrag:function(e){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,a=this.opos[0],o=this.opos[1],r=e.pageX,l=e.pageY;return a>r&&(i=r,r=a,a=i),o>l&&(i=l,l=o,o=i),this.helper.css({left:a,top:o,width:r-a,height:l-o}),this.selectees.each(function(){var i=t.data(this,"selectable-item"),h=!1;i&&i.element!==s.element[0]&&("touch"===n.tolerance?h=!(i.left>r||a>i.right||i.top>l||o>i.bottom):"fit"===n.tolerance&&(h=i.left>a&&r>i.right&&i.top>o&&l>i.bottom),h?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,s._trigger("selecting",e,{selecting:i.element}))):(i.selecting&&((e.metaKey||e.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",e,{unselecting:i.element}))),i.selected&&(e.metaKey||e.ctrlKey||i.startselected||(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",e,{unselecting:i.element})))))}),!1}},_mouseStop:function(e){var i=this;return this.dragged=!1,t(".ui-unselecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");s.$element.removeClass("ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",e,{unselected:s.element})}),t(".ui-selecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");s.$element.removeClass("ui-selecting").addClass("ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",e,{selected:s.element})}),this._trigger("stop",e),this.helper.remove(),!1}})})(jQuery);(function(t){function e(t,e,i){return t>e&&e+i>t}function i(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))}t.widget("ui.sortable",t.ui.mouse,{version:"1.10.4",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var t=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===t.axis||i(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_setOption:function(e,i){"disabled"===e?(this.options[e]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):t.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(e,i){var s=null,n=!1,o=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,o.widgetName+"-item")===o?(s=t(this),!1):undefined}),t.data(e.target,o.widgetName+"-item")===o&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,o,a=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,a.cursorAt&&this._adjustOffsetFromHelper(a.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),a.containment&&this._setContainment(),a.cursor&&"auto"!==a.cursor&&(o=this.document.find("body"),this.storedCursor=o.css("cursor"),o.css("cursor",a.cursor),this.storedStylesheet=t("<style>*{ cursor: "+a.cursor+" !important; }</style>").appendTo(o)),a.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",a.opacity)),a.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",a.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,o,a=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<a.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+a.scrollSpeed:e.pageY-this.overflowOffset.top<a.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-a.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<a.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+a.scrollSpeed:e.pageX-this.overflowOffset.left<a.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-a.scrollSpeed)):(e.pageY-t(document).scrollTop()<a.scrollSensitivity?r=t(document).scrollTop(t(document).scrollTop()-a.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<a.scrollSensitivity&&(r=t(document).scrollTop(t(document).scrollTop()+a.scrollSpeed)),e.pageX-t(document).scrollLeft()<a.scrollSensitivity?r=t(document).scrollLeft(t(document).scrollLeft()-a.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<a.scrollSensitivity&&(r=t(document).scrollLeft(t(document).scrollLeft()+a.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],o=this._intersectsWithPointer(s),o&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===o?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===o?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),o=this.options.axis,a={};o&&"x"!==o||(a.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),o&&"y"!==o||(a.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(a,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,o=t.left,a=o+t.width,r=t.top,h=r+t.height,l=this.offset.click.top,c=this.offset.click.left,u="x"===this.options.axis||s+l>r&&h>s+l,d="y"===this.options.axis||e+c>o&&a>e+c,p=u&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?p:e+this.helperProportions.width/2>o&&a>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var i="x"===this.options.axis||e(this.positionAbs.top+this.offset.click.top,t.top,t.height),s="y"===this.options.axis||e(this.positionAbs.left+this.offset.click.left,t.left,t.width),n=i&&s,o=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return n?this.floating?a&&"right"===a||"down"===o?2:1:o&&("down"===o?2:1):!1},_intersectsWithSides:function(t){var i=e(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),s=e(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),n=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();return this.floating&&o?"right"===o&&s||"left"===o&&!s:n&&("down"===n&&i||"up"===n&&!i)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){function i(){r.push(this)}var s,n,o,a,r=[],h=[],l=this._connectWith();if(l&&e)for(s=l.length-1;s>=0;s--)for(o=t(l[s]),n=o.length-1;n>=0;n--)a=t.data(o[n],this.widgetFullName),a&&a!==this&&!a.options.disabled&&h.push([t.isFunction(a.options.items)?a.options.items.call(a.element):t(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);for(h.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),s=h.length-1;s>=0;s--)h[s][0].each(i);return t(r)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,o,a,r,h,l,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i]),s=n.length-1;s>=0;s--)o=t.data(n[s],this.widgetFullName),o&&o!==this&&!o.options.disabled&&(u.push([t.isFunction(o.options.items)?o.options.items.call(o.element[0],e,{item:this.currentItem}):t(o.options.items,o.element),o]),this.containers.push(o));for(i=u.length-1;i>=0;i--)for(a=u[i][1],r=u[i][0],s=0,l=r.length;l>s;s++)h=t(r[s]),h.data(this.widgetName+"-item",a),c.push({item:h,instance:a,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,o;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),o=n.offset(),s.left=o.left,s.top=o.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)o=this.containers[i].element.offset(),this.containers[i].containerCache.left=o.left,this.containers[i].containerCache.top=o.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t("<"+s+">",e.document[0]).addClass(i||e.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?e.currentItem.children().each(function(){t("<td>&#160;</td>",e.document[0]).attr("colspan",t(this).attr("colspan")||1).appendTo(n)}):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_contactContainers:function(s){var n,o,a,r,h,l,c,u,d,p,f=null,g=null;for(n=this.containers.length-1;n>=0;n--)if(!t.contains(this.currentItem[0],this.containers[n].element[0]))if(this._intersectsWith(this.containers[n].containerCache)){if(f&&t.contains(this.containers[n].element[0],f.element[0]))continue;f=this.containers[n],g=n}else this.containers[n].containerCache.over&&(this.containers[n]._trigger("out",s,this._uiHash(this)),this.containers[n].containerCache.over=0);if(f)if(1===this.containers.length)this.containers[g].containerCache.over||(this.containers[g]._trigger("over",s,this._uiHash(this)),this.containers[g].containerCache.over=1);else{for(a=1e4,r=null,p=f.floating||i(this.currentItem),h=p?"left":"top",l=p?"width":"height",c=this.positionAbs[h]+this.offset.click[h],o=this.items.length-1;o>=0;o--)t.contains(this.containers[g].element[0],this.items[o].item[0])&&this.items[o].item[0]!==this.currentItem[0]&&(!p||e(this.positionAbs.top+this.offset.click.top,this.items[o].top,this.items[o].height))&&(u=this.items[o].item.offset()[h],d=!1,Math.abs(u-c)>Math.abs(u+this.items[o][l]-c)&&(d=!0,u+=this.items[o][l]),a>Math.abs(u-c)&&(a=Math.abs(u-c),r=this.items[o],this.direction=d?"up":"down"));if(!r&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[g])return;r?this._rearrange(s,r,null,!0):this._rearrange(s,null,this.containers[g].element,!0),this._trigger("change",s,this._uiHash()),this.containers[g]._trigger("change",s,this._uiHash(this)),this.currentContainer=this.containers[g],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[g]._trigger("over",s,this._uiHash(this)),this.containers[g].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,t("document"===n.containment?document:window).width()-this.helperProportions.width-this.margins.left,(t("document"===n.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():o?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():o?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,o=e.pageX,a=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(o=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(a=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(o=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(a=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((a-this.originalPageY)/n.grid[1])*n.grid[1],a=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((o-this.originalPageX)/n.grid[0])*n.grid[0],o=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:a-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:o-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){function i(t,e,i){return function(s){i._trigger(t,s,e._uiHash(e))}}this.reverting=!1;var s,n=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(s in this._storedCSS)("auto"===this._storedCSS[s]||"static"===this._storedCSS[s])&&(this._storedCSS[s]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&n.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||n.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(n.push(function(t){this._trigger("remove",t,this._uiHash())}),n.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),n.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),s=this.containers.length-1;s>=0;s--)e||n.push(i("deactivate",this,this.containers[s])),this.containers[s].containerCache.over&&(n.push(i("out",this,this.containers[s])),this.containers[s].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!e){for(this._trigger("beforeStop",t,this._uiHash()),s=0;n.length>s;s++)n[s].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!1}if(e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!e){for(s=0;n.length>s;s++)n[s].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}})})(jQuery);(function(e){var t=0,i={},a={};i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="hide",a.height=a.paddingTop=a.paddingBottom=a.borderTopWidth=a.borderBottomWidth="show",e.widget("ui.accordion",{version:"1.10.4",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var t=this.options;this.prevShow=this.prevHide=e(),this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist"),t.collapsible||t.active!==!1&&null!=t.active||(t.active=0),this._processPanels(),0>t.active&&(t.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():e(),content:this.active.length?this.active.next():e()}},_createIcons:function(){var t=this.options.icons;t&&(e("<span>").addClass("ui-accordion-header-icon ui-icon "+t.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(t.header).addClass(t.activeHeader),this.headers.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var e;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),this._destroyIcons(),e=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),"content"!==this.options.heightStyle&&e.css("height","")},_setOption:function(e,t){return"active"===e?(this._activate(t),undefined):("event"===e&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(t)),this._super(e,t),"collapsible"!==e||t||this.options.active!==!1||this._activate(0),"icons"===e&&(this._destroyIcons(),t&&this._createIcons()),"disabled"===e&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!t),undefined)},_keydown:function(t){if(!t.altKey&&!t.ctrlKey){var i=e.ui.keyCode,a=this.headers.length,s=this.headers.index(t.target),n=!1;switch(t.keyCode){case i.RIGHT:case i.DOWN:n=this.headers[(s+1)%a];break;case i.LEFT:case i.UP:n=this.headers[(s-1+a)%a];break;case i.SPACE:case i.ENTER:this._eventHandler(t);break;case i.HOME:n=this.headers[0];break;case i.END:n=this.headers[a-1]}n&&(e(t.target).attr("tabIndex",-1),e(n).attr("tabIndex",0),n.focus(),t.preventDefault())}},_panelKeyDown:function(t){t.keyCode===e.ui.keyCode.UP&&t.ctrlKey&&e(t.currentTarget).prev().focus()},refresh:function(){var t=this.options;this._processPanels(),t.active===!1&&t.collapsible===!0||!this.headers.length?(t.active=!1,this.active=e()):t.active===!1?this._activate(0):this.active.length&&!e.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(t.active=!1,this.active=e()):this._activate(Math.max(0,t.active-1)):t.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"),this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide()},_refresh:function(){var i,a=this.options,s=a.heightStyle,n=this.element.parent(),r=this.accordionId="ui-accordion-"+(this.element.attr("id")||++t);this.active=this._findActive(a.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"),this.active.next().addClass("ui-accordion-content-active").show(),this.headers.attr("role","tab").each(function(t){var i=e(this),a=i.attr("id"),s=i.next(),n=s.attr("id");a||(a=r+"-header-"+t,i.attr("id",a)),n||(n=r+"-panel-"+t,s.attr("id",n)),i.attr("aria-controls",n),s.attr("aria-labelledby",a)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}).next().attr({"aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}).next().attr({"aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(a.event),"fill"===s?(i=n.height(),this.element.siblings(":visible").each(function(){var t=e(this),a=t.css("position");"absolute"!==a&&"fixed"!==a&&(i-=t.outerHeight(!0))}),this.headers.each(function(){i-=e(this).outerHeight(!0)}),this.headers.next().each(function(){e(this).height(Math.max(0,i-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):"auto"===s&&(i=0,this.headers.next().each(function(){i=Math.max(i,e(this).css("height","").height())}).height(i))},_activate:function(t){var i=this._findActive(t)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:e.noop}))},_findActive:function(t){return"number"==typeof t?this.headers.eq(t):e()},_setupEvents:function(t){var i={keydown:"_keydown"};t&&e.each(t.split(" "),function(e,t){i[t]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(t){var i=this.options,a=this.active,s=e(t.currentTarget),n=s[0]===a[0],r=n&&i.collapsible,o=r?e():s.next(),h=a.next(),d={oldHeader:a,oldPanel:h,newHeader:r?e():s,newPanel:o};t.preventDefault(),n&&!i.collapsible||this._trigger("beforeActivate",t,d)===!1||(i.active=r?!1:this.headers.index(s),this.active=n?e():s,this._toggle(d),a.removeClass("ui-accordion-header-active ui-state-active"),i.icons&&a.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header),n||(s.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),i.icons&&s.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader),s.next().addClass("ui-accordion-content-active")))},_toggle:function(t){var i=t.newPanel,a=this.prevShow.length?this.prevShow:t.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=a,this.options.animate?this._animate(i,a,t):(a.hide(),i.show(),this._toggleComplete(t)),a.attr({"aria-hidden":"true"}),a.prev().attr("aria-selected","false"),i.length&&a.length?a.prev().attr({tabIndex:-1,"aria-expanded":"false"}):i.length&&this.headers.filter(function(){return 0===e(this).attr("tabIndex")}).attr("tabIndex",-1),i.attr("aria-hidden","false").prev().attr({"aria-selected":"true",tabIndex:0,"aria-expanded":"true"})},_animate:function(e,t,s){var n,r,o,h=this,d=0,c=e.length&&(!t.length||e.index()<t.index()),l=this.options.animate||{},u=c&&l.down||l,v=function(){h._toggleComplete(s)};return"number"==typeof u&&(o=u),"string"==typeof u&&(r=u),r=r||u.easing||l.easing,o=o||u.duration||l.duration,t.length?e.length?(n=e.show().outerHeight(),t.animate(i,{duration:o,easing:r,step:function(e,t){t.now=Math.round(e)}}),e.hide().animate(a,{duration:o,easing:r,complete:v,step:function(e,i){i.now=Math.round(e),"height"!==i.prop?d+=i.now:"content"!==h.options.heightStyle&&(i.now=Math.round(n-t.outerHeight()-d),d=0)}}),undefined):t.animate(i,o,r,v):e.animate(a,o,r,v)},_toggleComplete:function(e){var t=e.oldPanel;t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),t.length&&(t.parent()[0].className=t.parent()[0].className),this._trigger("activate",null,e)}})})(jQuery);(function(e){e.widget("ui.autocomplete",{version:"1.10.4",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},requestIndex:0,pending:0,_create:function(){var t,i,s,n=this.element[0].nodeName.toLowerCase(),a="textarea"===n,o="input"===n;this.isMultiLine=a?!0:o?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[a||o?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return t=!0,s=!0,i=!0,undefined;t=!1,s=!1,i=!1;var a=e.ui.keyCode;switch(n.keyCode){case a.PAGE_UP:t=!0,this._move("previousPage",n);break;case a.PAGE_DOWN:t=!0,this._move("nextPage",n);break;case a.UP:t=!0,this._keyEvent("previous",n);break;case a.DOWN:t=!0,this._keyEvent("next",n);break;case a.ENTER:case a.NUMPAD_ENTER:this.menu.active&&(t=!0,n.preventDefault(),this.menu.select(n));break;case a.TAB:this.menu.active&&this.menu.select(n);break;case a.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(t)return t=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),undefined;if(!i){var n=e.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(e){return s?(s=!1,e.preventDefault(),undefined):(this._searchTimeout(e),undefined)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(e){return this.cancelBlur?(delete this.cancelBlur,undefined):(clearTimeout(this.searching),this.close(e),this._change(e),undefined)}}),this._initSource(),this.menu=e("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(t){t.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];e(t.target).closest(".ui-menu-item").length||this._delay(function(){var t=this;this.document.one("mousedown",function(s){s.target===t.element[0]||s.target===i||e.contains(i,s.target)||t.close()})})},menufocus:function(t,i){if(this.isNewMenu&&(this.isNewMenu=!1,t.originalEvent&&/^mouse/.test(t.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){e(t.target).trigger(t.originalEvent)}),undefined;var s=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",t,{item:s})?t.originalEvent&&/^key/.test(t.originalEvent.type)&&this._value(s.value):this.liveRegion.text(s.value)},menuselect:function(e,t){var i=t.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",e,{item:i})&&this._value(i.value),this.term=this._value(),this.close(e),this.selectedItem=i}}),this.liveRegion=e("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(e,t){this._super(e,t),"source"===e&&this._initSource(),"appendTo"===e&&this.menu.element.appendTo(this._appendTo()),"disabled"===e&&t&&this.xhr&&this.xhr.abort()},_appendTo:function(){var t=this.options.appendTo;return t&&(t=t.jquery||t.nodeType?e(t):this.document.find(t).eq(0)),t||(t=this.element.closest(".ui-front")),t.length||(t=this.document[0].body),t},_initSource:function(){var t,i,s=this;e.isArray(this.options.source)?(t=this.options.source,this.source=function(i,s){s(e.ui.autocomplete.filter(t,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(t,n){s.xhr&&s.xhr.abort(),s.xhr=e.ajax({url:i,data:t,dataType:"json",success:function(e){n(e)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(e){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,e))},this.options.delay)},search:function(e,t){return e=null!=e?e:this._value(),this.term=this._value(),e.length<this.options.minLength?this.close(t):this._trigger("search",t)!==!1?this._search(e):undefined},_search:function(e){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:e},this._response())},_response:function(){var t=++this.requestIndex;return e.proxy(function(e){t===this.requestIndex&&this.__response(e),this.pending--,this.pending||this.element.removeClass("ui-autocomplete-loading")},this)},__response:function(e){e&&(e=this._normalize(e)),this._trigger("response",null,{content:e}),!this.options.disabled&&e&&e.length&&!this.cancelSearch?(this._suggest(e),this._trigger("open")):this._close()},close:function(e){this.cancelSearch=!0,this._close(e)},_close:function(e){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",e))},_change:function(e){this.previous!==this._value()&&this._trigger("change",e,{item:this.selectedItem})},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:e.map(t,function(t){return"string"==typeof t?{label:t,value:t}:e.extend({label:t.label||t.value,value:t.value||t.label},t)})},_suggest:function(t){var i=this.menu.element.empty();this._renderMenu(i,t),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(e.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var e=this.menu.element;e.outerWidth(Math.max(e.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(t,i){var s=this;e.each(i,function(e,i){s._renderItemData(t,i)})},_renderItemData:function(e,t){return this._renderItem(e,t).data("ui-autocomplete-item",t)},_renderItem:function(t,i){return e("<li>").append(e("<a>").text(i.label)).appendTo(t)},_move:function(e,t){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(e)||this.menu.isLastItem()&&/^next/.test(e)?(this._value(this.term),this.menu.blur(),undefined):(this.menu[e](t),undefined):(this.search(null,t),undefined)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(e,t){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(e,t),t.preventDefault())}}),e.extend(e.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(t,i){var s=RegExp(e.ui.autocomplete.escapeRegex(i),"i");return e.grep(t,function(e){return s.test(e.label||e.value||e)})}}),e.widget("ui.autocomplete",e.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(e){return e+(e>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(e){var t;this._superApply(arguments),this.options.disabled||this.cancelSearch||(t=e&&e.length?this.options.messages.results(e.length):this.options.messages.noResults,this.liveRegion.text(t))}})})(jQuery);(function(e){var t,i="ui-button ui-widget ui-state-default ui-corner-all",n="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",s=function(){var t=e(this);setTimeout(function(){t.find(":ui-button").button("refresh")},1)},a=function(t){var i=t.name,n=t.form,s=e([]);return i&&(i=i.replace(/'/g,"\\'"),s=n?e(n).find("[name='"+i+"']"):e("[name='"+i+"']",t.ownerDocument).filter(function(){return!this.form})),s};e.widget("ui.button",{version:"1.10.4",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,s),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var n=this,o=this.options,r="checkbox"===this.type||"radio"===this.type,h=r?"":"ui-state-active";null===o.label&&(o.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(i).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){o.disabled||this===t&&e(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){o.disabled||e(this).removeClass(h)}).bind("click"+this.eventNamespace,function(e){o.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}),this._on({focus:function(){this.buttonElement.addClass("ui-state-focus")},blur:function(){this.buttonElement.removeClass("ui-state-focus")}}),r&&this.element.bind("change"+this.eventNamespace,function(){n.refresh()}),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){return o.disabled?!1:undefined}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(o.disabled)return!1;e(this).addClass("ui-state-active"),n.buttonElement.attr("aria-pressed","true");var t=n.element[0];a(t).not(t).map(function(){return e(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){return o.disabled?!1:(e(this).addClass("ui-state-active"),t=this,n.document.one("mouseup",function(){t=null}),undefined)}).bind("mouseup"+this.eventNamespace,function(){return o.disabled?!1:(e(this).removeClass("ui-state-active"),undefined)}).bind("keydown"+this.eventNamespace,function(t){return o.disabled?!1:((t.keyCode===e.ui.keyCode.SPACE||t.keyCode===e.ui.keyCode.ENTER)&&e(this).addClass("ui-state-active"),undefined)}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){e(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(t){t.keyCode===e.ui.keyCode.SPACE&&e(this).click()})),this._setOption("disabled",o.disabled),this._resetButton()},_determineButtonType:function(){var e,t,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button","checkbox"===this.type||"radio"===this.type?(e=this.element.parents().last(),t="label[for='"+this.element.attr("id")+"']",this.buttonElement=e.find(t),this.buttonElement.length||(e=e.length?e.siblings():this.element.siblings(),this.buttonElement=e.filter(t),this.buttonElement.length||(this.buttonElement=e.find(t))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(i+" ui-state-active "+n).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(e,t){return this._super(e,t),"disabled"===e?(this.element.prop("disabled",!!t),t&&this.buttonElement.removeClass("ui-state-focus"),undefined):(this._resetButton(),undefined)},refresh:function(){var t=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOption("disabled",t),"radio"===this.type?a(this.element[0]).each(function(){e(this).is(":checked")?e(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):e(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return this.options.label&&this.element.val(this.options.label),undefined;var t=this.buttonElement.removeClass(n),i=e("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(),s=this.options.icons,a=s.primary&&s.secondary,o=[];s.primary||s.secondary?(this.options.text&&o.push("ui-button-text-icon"+(a?"s":s.primary?"-primary":"-secondary")),s.primary&&t.prepend("<span class='ui-button-icon-primary ui-icon "+s.primary+"'></span>"),s.secondary&&t.append("<span class='ui-button-icon-secondary ui-icon "+s.secondary+"'></span>"),this.options.text||(o.push(a?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||t.attr("title",e.trim(i)))):o.push("ui-button-text-only"),t.addClass(o.join(" "))}}),e.widget("ui.buttonset",{version:"1.10.4",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(e,t){"disabled"===e&&this.buttons.button("option",e,t),this._super(e,t)},refresh:function(){var t="rtl"===this.element.css("direction");this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(t?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})})(jQuery);(function(e,t){function i(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},e.extend(this._defaults,this.regional[""]),this.dpDiv=a(e("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function a(t){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return t.delegate(i,"mouseout",function(){e(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",function(){e.datepicker._isDisabledDatepicker(n.inline?t.parent()[0]:n.input[0])||(e(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),e(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).addClass("ui-datepicker-next-hover"))})}function s(t,i){e.extend(t,i);for(var a in i)null==i[a]&&(t[a]=i[a]);return t}e.extend(e.ui,{datepicker:{version:"1.10.4"}});var n,r="datepicker";e.extend(i.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(e){return s(this._defaults,e||{}),this},_attachDatepicker:function(t,i){var a,s,n;a=t.nodeName.toLowerCase(),s="div"===a||"span"===a,t.id||(this.uuid+=1,t.id="dp"+this.uuid),n=this._newInst(e(t),s),n.settings=e.extend({},i||{}),"input"===a?this._connectDatepicker(t,n):s&&this._inlineDatepicker(t,n)},_newInst:function(t,i){var s=t[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:s,input:t,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?a(e("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(t,i){var a=e(t);i.append=e([]),i.trigger=e([]),a.hasClass(this.markerClassName)||(this._attachments(a,i),a.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),e.data(t,r,i),i.settings.disabled&&this._disableDatepicker(t))},_attachments:function(t,i){var a,s,n,r=this._get(i,"appendText"),o=this._get(i,"isRTL");i.append&&i.append.remove(),r&&(i.append=e("<span class='"+this._appendClass+"'>"+r+"</span>"),t[o?"before":"after"](i.append)),t.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),a=this._get(i,"showOn"),("focus"===a||"both"===a)&&t.focus(this._showDatepicker),("button"===a||"both"===a)&&(s=this._get(i,"buttonText"),n=this._get(i,"buttonImage"),i.trigger=e(this._get(i,"buttonImageOnly")?e("<img/>").addClass(this._triggerClass).attr({src:n,alt:s,title:s}):e("<button type='button'></button>").addClass(this._triggerClass).html(n?e("<img/>").attr({src:n,alt:s,title:s}):s)),t[o?"before":"after"](i.trigger),i.trigger.click(function(){return e.datepicker._datepickerShowing&&e.datepicker._lastInput===t[0]?e.datepicker._hideDatepicker():e.datepicker._datepickerShowing&&e.datepicker._lastInput!==t[0]?(e.datepicker._hideDatepicker(),e.datepicker._showDatepicker(t[0])):e.datepicker._showDatepicker(t[0]),!1}))},_autoSize:function(e){if(this._get(e,"autoSize")&&!e.inline){var t,i,a,s,n=new Date(2009,11,20),r=this._get(e,"dateFormat");r.match(/[DM]/)&&(t=function(e){for(i=0,a=0,s=0;e.length>s;s++)e[s].length>i&&(i=e[s].length,a=s);return a},n.setMonth(t(this._get(e,r.match(/MM/)?"monthNames":"monthNamesShort"))),n.setDate(t(this._get(e,r.match(/DD/)?"dayNames":"dayNamesShort"))+20-n.getDay())),e.input.attr("size",this._formatDate(e,n).length)}},_inlineDatepicker:function(t,i){var a=e(t);a.hasClass(this.markerClassName)||(a.addClass(this.markerClassName).append(i.dpDiv),e.data(t,r,i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(t),i.dpDiv.css("display","block"))},_dialogDatepicker:function(t,i,a,n,o){var u,c,h,l,d,p=this._dialogInst;return p||(this.uuid+=1,u="dp"+this.uuid,this._dialogInput=e("<input type='text' id='"+u+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),e("body").append(this._dialogInput),p=this._dialogInst=this._newInst(this._dialogInput,!1),p.settings={},e.data(this._dialogInput[0],r,p)),s(p.settings,n||{}),i=i&&i.constructor===Date?this._formatDate(p,i):i,this._dialogInput.val(i),this._pos=o?o.length?o:[o.pageX,o.pageY]:null,this._pos||(c=document.documentElement.clientWidth,h=document.documentElement.clientHeight,l=document.documentElement.scrollLeft||document.body.scrollLeft,d=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[c/2-100+l,h/2-150+d]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),p.settings.onSelect=a,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),e.blockUI&&e.blockUI(this.dpDiv),e.data(this._dialogInput[0],r,p),this},_destroyDatepicker:function(t){var i,a=e(t),s=e.data(t,r);a.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),e.removeData(t,r),"input"===i?(s.append.remove(),s.trigger.remove(),a.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&a.removeClass(this.markerClassName).empty())},_enableDatepicker:function(t){var i,a,s=e(t),n=e.data(t,r);s.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!1,n.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(a=s.children("."+this._inlineClass),a.children().removeClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}))},_disableDatepicker:function(t){var i,a,s=e(t),n=e.data(t,r);s.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!0,n.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(a=s.children("."+this._inlineClass),a.children().addClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}),this._disabledInputs[this._disabledInputs.length]=t)},_isDisabledDatepicker:function(e){if(!e)return!1;for(var t=0;this._disabledInputs.length>t;t++)if(this._disabledInputs[t]===e)return!0;return!1},_getInst:function(t){try{return e.data(t,r)}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(i,a,n){var r,o,u,c,h=this._getInst(i);return 2===arguments.length&&"string"==typeof a?"defaults"===a?e.extend({},e.datepicker._defaults):h?"all"===a?e.extend({},h.settings):this._get(h,a):null:(r=a||{},"string"==typeof a&&(r={},r[a]=n),h&&(this._curInst===h&&this._hideDatepicker(),o=this._getDateDatepicker(i,!0),u=this._getMinMaxDate(h,"min"),c=this._getMinMaxDate(h,"max"),s(h.settings,r),null!==u&&r.dateFormat!==t&&r.minDate===t&&(h.settings.minDate=this._formatDate(h,u)),null!==c&&r.dateFormat!==t&&r.maxDate===t&&(h.settings.maxDate=this._formatDate(h,c)),"disabled"in r&&(r.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(e(i),h),this._autoSize(h),this._setDate(h,o),this._updateAlternate(h),this._updateDatepicker(h)),t)},_changeDatepicker:function(e,t,i){this._optionDatepicker(e,t,i)},_refreshDatepicker:function(e){var t=this._getInst(e);t&&this._updateDatepicker(t)},_setDateDatepicker:function(e,t){var i=this._getInst(e);i&&(this._setDate(i,t),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(e,t){var i=this._getInst(e);return i&&!i.inline&&this._setDateFromField(i,t),i?this._getDate(i):null},_doKeyDown:function(t){var i,a,s,n=e.datepicker._getInst(t.target),r=!0,o=n.dpDiv.is(".ui-datepicker-rtl");if(n._keyEvent=!0,e.datepicker._datepickerShowing)switch(t.keyCode){case 9:e.datepicker._hideDatepicker(),r=!1;break;case 13:return s=e("td."+e.datepicker._dayOverClass+":not(."+e.datepicker._currentClass+")",n.dpDiv),s[0]&&e.datepicker._selectDay(t.target,n.selectedMonth,n.selectedYear,s[0]),i=e.datepicker._get(n,"onSelect"),i?(a=e.datepicker._formatDate(n),i.apply(n.input?n.input[0]:null,[a,n])):e.datepicker._hideDatepicker(),!1;case 27:e.datepicker._hideDatepicker();break;case 33:e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(n,"stepBigMonths"):-e.datepicker._get(n,"stepMonths"),"M");break;case 34:e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(n,"stepBigMonths"):+e.datepicker._get(n,"stepMonths"),"M");break;case 35:(t.ctrlKey||t.metaKey)&&e.datepicker._clearDate(t.target),r=t.ctrlKey||t.metaKey;break;case 36:(t.ctrlKey||t.metaKey)&&e.datepicker._gotoToday(t.target),r=t.ctrlKey||t.metaKey;break;case 37:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,o?1:-1,"D"),r=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(n,"stepBigMonths"):-e.datepicker._get(n,"stepMonths"),"M");break;case 38:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,-7,"D"),r=t.ctrlKey||t.metaKey;break;case 39:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,o?-1:1,"D"),r=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(n,"stepBigMonths"):+e.datepicker._get(n,"stepMonths"),"M");break;case 40:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,7,"D"),r=t.ctrlKey||t.metaKey;break;default:r=!1}else 36===t.keyCode&&t.ctrlKey?e.datepicker._showDatepicker(this):r=!1;r&&(t.preventDefault(),t.stopPropagation())},_doKeyPress:function(i){var a,s,n=e.datepicker._getInst(i.target);return e.datepicker._get(n,"constrainInput")?(a=e.datepicker._possibleChars(e.datepicker._get(n,"dateFormat")),s=String.fromCharCode(null==i.charCode?i.keyCode:i.charCode),i.ctrlKey||i.metaKey||" ">s||!a||a.indexOf(s)>-1):t},_doKeyUp:function(t){var i,a=e.datepicker._getInst(t.target);if(a.input.val()!==a.lastVal)try{i=e.datepicker.parseDate(e.datepicker._get(a,"dateFormat"),a.input?a.input.val():null,e.datepicker._getFormatConfig(a)),i&&(e.datepicker._setDateFromField(a),e.datepicker._updateAlternate(a),e.datepicker._updateDatepicker(a))}catch(s){}return!0},_showDatepicker:function(t){if(t=t.target||t,"input"!==t.nodeName.toLowerCase()&&(t=e("input",t.parentNode)[0]),!e.datepicker._isDisabledDatepicker(t)&&e.datepicker._lastInput!==t){var i,a,n,r,o,u,c;i=e.datepicker._getInst(t),e.datepicker._curInst&&e.datepicker._curInst!==i&&(e.datepicker._curInst.dpDiv.stop(!0,!0),i&&e.datepicker._datepickerShowing&&e.datepicker._hideDatepicker(e.datepicker._curInst.input[0])),a=e.datepicker._get(i,"beforeShow"),n=a?a.apply(t,[t,i]):{},n!==!1&&(s(i.settings,n),i.lastVal=null,e.datepicker._lastInput=t,e.datepicker._setDateFromField(i),e.datepicker._inDialog&&(t.value=""),e.datepicker._pos||(e.datepicker._pos=e.datepicker._findPos(t),e.datepicker._pos[1]+=t.offsetHeight),r=!1,e(t).parents().each(function(){return r|="fixed"===e(this).css("position"),!r}),o={left:e.datepicker._pos[0],top:e.datepicker._pos[1]},e.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),e.datepicker._updateDatepicker(i),o=e.datepicker._checkOffset(i,o,r),i.dpDiv.css({position:e.datepicker._inDialog&&e.blockUI?"static":r?"fixed":"absolute",display:"none",left:o.left+"px",top:o.top+"px"}),i.inline||(u=e.datepicker._get(i,"showAnim"),c=e.datepicker._get(i,"duration"),i.dpDiv.zIndex(e(t).zIndex()+1),e.datepicker._datepickerShowing=!0,e.effects&&e.effects.effect[u]?i.dpDiv.show(u,e.datepicker._get(i,"showOptions"),c):i.dpDiv[u||"show"](u?c:null),e.datepicker._shouldFocusInput(i)&&i.input.focus(),e.datepicker._curInst=i))}},_updateDatepicker:function(t){this.maxRows=4,n=t,t.dpDiv.empty().append(this._generateHTML(t)),this._attachHandlers(t),t.dpDiv.find("."+this._dayOverClass+" a").mouseover();var i,a=this._getNumberOfMonths(t),s=a[1],r=17;t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),s>1&&t.dpDiv.addClass("ui-datepicker-multi-"+s).css("width",r*s+"em"),t.dpDiv[(1!==a[0]||1!==a[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),t.dpDiv[(this._get(t,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),t===e.datepicker._curInst&&e.datepicker._datepickerShowing&&e.datepicker._shouldFocusInput(t)&&t.input.focus(),t.yearshtml&&(i=t.yearshtml,setTimeout(function(){i===t.yearshtml&&t.yearshtml&&t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml),i=t.yearshtml=null},0))},_shouldFocusInput:function(e){return e.input&&e.input.is(":visible")&&!e.input.is(":disabled")&&!e.input.is(":focus")},_checkOffset:function(t,i,a){var s=t.dpDiv.outerWidth(),n=t.dpDiv.outerHeight(),r=t.input?t.input.outerWidth():0,o=t.input?t.input.outerHeight():0,u=document.documentElement.clientWidth+(a?0:e(document).scrollLeft()),c=document.documentElement.clientHeight+(a?0:e(document).scrollTop());return i.left-=this._get(t,"isRTL")?s-r:0,i.left-=a&&i.left===t.input.offset().left?e(document).scrollLeft():0,i.top-=a&&i.top===t.input.offset().top+o?e(document).scrollTop():0,i.left-=Math.min(i.left,i.left+s>u&&u>s?Math.abs(i.left+s-u):0),i.top-=Math.min(i.top,i.top+n>c&&c>n?Math.abs(n+o):0),i},_findPos:function(t){for(var i,a=this._getInst(t),s=this._get(a,"isRTL");t&&("hidden"===t.type||1!==t.nodeType||e.expr.filters.hidden(t));)t=t[s?"previousSibling":"nextSibling"];return i=e(t).offset(),[i.left,i.top]},_hideDatepicker:function(t){var i,a,s,n,o=this._curInst;!o||t&&o!==e.data(t,r)||this._datepickerShowing&&(i=this._get(o,"showAnim"),a=this._get(o,"duration"),s=function(){e.datepicker._tidyDialog(o)},e.effects&&(e.effects.effect[i]||e.effects[i])?o.dpDiv.hide(i,e.datepicker._get(o,"showOptions"),a,s):o.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?a:null,s),i||s(),this._datepickerShowing=!1,n=this._get(o,"onClose"),n&&n.apply(o.input?o.input[0]:null,[o.input?o.input.val():"",o]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),e.blockUI&&(e.unblockUI(),e("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(e){e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(t){if(e.datepicker._curInst){var i=e(t.target),a=e.datepicker._getInst(i[0]);(i[0].id!==e.datepicker._mainDivId&&0===i.parents("#"+e.datepicker._mainDivId).length&&!i.hasClass(e.datepicker.markerClassName)&&!i.closest("."+e.datepicker._triggerClass).length&&e.datepicker._datepickerShowing&&(!e.datepicker._inDialog||!e.blockUI)||i.hasClass(e.datepicker.markerClassName)&&e.datepicker._curInst!==a)&&e.datepicker._hideDatepicker()}},_adjustDate:function(t,i,a){var s=e(t),n=this._getInst(s[0]);this._isDisabledDatepicker(s[0])||(this._adjustInstDate(n,i+("M"===a?this._get(n,"showCurrentAtPos"):0),a),this._updateDatepicker(n))},_gotoToday:function(t){var i,a=e(t),s=this._getInst(a[0]);this._get(s,"gotoCurrent")&&s.currentDay?(s.selectedDay=s.currentDay,s.drawMonth=s.selectedMonth=s.currentMonth,s.drawYear=s.selectedYear=s.currentYear):(i=new Date,s.selectedDay=i.getDate(),s.drawMonth=s.selectedMonth=i.getMonth(),s.drawYear=s.selectedYear=i.getFullYear()),this._notifyChange(s),this._adjustDate(a)},_selectMonthYear:function(t,i,a){var s=e(t),n=this._getInst(s[0]);n["selected"+("M"===a?"Month":"Year")]=n["draw"+("M"===a?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(n),this._adjustDate(s)},_selectDay:function(t,i,a,s){var n,r=e(t);e(s).hasClass(this._unselectableClass)||this._isDisabledDatepicker(r[0])||(n=this._getInst(r[0]),n.selectedDay=n.currentDay=e("a",s).html(),n.selectedMonth=n.currentMonth=i,n.selectedYear=n.currentYear=a,this._selectDate(t,this._formatDate(n,n.currentDay,n.currentMonth,n.currentYear)))},_clearDate:function(t){var i=e(t);this._selectDate(i,"")},_selectDate:function(t,i){var a,s=e(t),n=this._getInst(s[0]);i=null!=i?i:this._formatDate(n),n.input&&n.input.val(i),this._updateAlternate(n),a=this._get(n,"onSelect"),a?a.apply(n.input?n.input[0]:null,[i,n]):n.input&&n.input.trigger("change"),n.inline?this._updateDatepicker(n):(this._hideDatepicker(),this._lastInput=n.input[0],"object"!=typeof n.input[0]&&n.input.focus(),this._lastInput=null)},_updateAlternate:function(t){var i,a,s,n=this._get(t,"altField");n&&(i=this._get(t,"altFormat")||this._get(t,"dateFormat"),a=this._getDate(t),s=this.formatDate(i,a,this._getFormatConfig(t)),e(n).each(function(){e(this).val(s)}))},noWeekends:function(e){var t=e.getDay();return[t>0&&6>t,""]},iso8601Week:function(e){var t,i=new Date(e.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),t=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((t-i)/864e5)/7)+1},parseDate:function(i,a,s){if(null==i||null==a)throw"Invalid arguments";if(a="object"==typeof a?""+a:a+"",""===a)return null;var n,r,o,u,c=0,h=(s?s.shortYearCutoff:null)||this._defaults.shortYearCutoff,l="string"!=typeof h?h:(new Date).getFullYear()%100+parseInt(h,10),d=(s?s.dayNamesShort:null)||this._defaults.dayNamesShort,p=(s?s.dayNames:null)||this._defaults.dayNames,g=(s?s.monthNamesShort:null)||this._defaults.monthNamesShort,m=(s?s.monthNames:null)||this._defaults.monthNames,f=-1,_=-1,v=-1,k=-1,y=!1,b=function(e){var t=i.length>n+1&&i.charAt(n+1)===e;return t&&n++,t},D=function(e){var t=b(e),i="@"===e?14:"!"===e?20:"y"===e&&t?4:"o"===e?3:2,s=RegExp("^\\d{1,"+i+"}"),n=a.substring(c).match(s);if(!n)throw"Missing number at position "+c;return c+=n[0].length,parseInt(n[0],10)},w=function(i,s,n){var r=-1,o=e.map(b(i)?n:s,function(e,t){return[[t,e]]}).sort(function(e,t){return-(e[1].length-t[1].length)});if(e.each(o,function(e,i){var s=i[1];return a.substr(c,s.length).toLowerCase()===s.toLowerCase()?(r=i[0],c+=s.length,!1):t}),-1!==r)return r+1;throw"Unknown name at position "+c},M=function(){if(a.charAt(c)!==i.charAt(n))throw"Unexpected literal at position "+c;c++};for(n=0;i.length>n;n++)if(y)"'"!==i.charAt(n)||b("'")?M():y=!1;else switch(i.charAt(n)){case"d":v=D("d");break;case"D":w("D",d,p);break;case"o":k=D("o");break;case"m":_=D("m");break;case"M":_=w("M",g,m);break;case"y":f=D("y");break;case"@":u=new Date(D("@")),f=u.getFullYear(),_=u.getMonth()+1,v=u.getDate();break;case"!":u=new Date((D("!")-this._ticksTo1970)/1e4),f=u.getFullYear(),_=u.getMonth()+1,v=u.getDate();break;case"'":b("'")?M():y=!0;break;default:M()}if(a.length>c&&(o=a.substr(c),!/^\s+/.test(o)))throw"Extra/unparsed characters found in date: "+o;if(-1===f?f=(new Date).getFullYear():100>f&&(f+=(new Date).getFullYear()-(new Date).getFullYear()%100+(l>=f?0:-100)),k>-1)for(_=1,v=k;;){if(r=this._getDaysInMonth(f,_-1),r>=v)break;_++,v-=r}if(u=this._daylightSavingAdjust(new Date(f,_-1,v)),u.getFullYear()!==f||u.getMonth()+1!==_||u.getDate()!==v)throw"Invalid date";return u},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(e,t,i){if(!t)return"";var a,s=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,n=(i?i.dayNames:null)||this._defaults.dayNames,r=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,o=(i?i.monthNames:null)||this._defaults.monthNames,u=function(t){var i=e.length>a+1&&e.charAt(a+1)===t;return i&&a++,i},c=function(e,t,i){var a=""+t;if(u(e))for(;i>a.length;)a="0"+a;return a},h=function(e,t,i,a){return u(e)?a[t]:i[t]},l="",d=!1;if(t)for(a=0;e.length>a;a++)if(d)"'"!==e.charAt(a)||u("'")?l+=e.charAt(a):d=!1;else switch(e.charAt(a)){case"d":l+=c("d",t.getDate(),2);break;case"D":l+=h("D",t.getDay(),s,n);break;case"o":l+=c("o",Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-new Date(t.getFullYear(),0,0).getTime())/864e5),3);break;case"m":l+=c("m",t.getMonth()+1,2);break;case"M":l+=h("M",t.getMonth(),r,o);break;case"y":l+=u("y")?t.getFullYear():(10>t.getYear()%100?"0":"")+t.getYear()%100;break;case"@":l+=t.getTime();break;case"!":l+=1e4*t.getTime()+this._ticksTo1970;break;case"'":u("'")?l+="'":d=!0;break;default:l+=e.charAt(a)}return l},_possibleChars:function(e){var t,i="",a=!1,s=function(i){var a=e.length>t+1&&e.charAt(t+1)===i;return a&&t++,a};for(t=0;e.length>t;t++)if(a)"'"!==e.charAt(t)||s("'")?i+=e.charAt(t):a=!1;else switch(e.charAt(t)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":s("'")?i+="'":a=!0;break;default:i+=e.charAt(t)}return i},_get:function(e,i){return e.settings[i]!==t?e.settings[i]:this._defaults[i]},_setDateFromField:function(e,t){if(e.input.val()!==e.lastVal){var i=this._get(e,"dateFormat"),a=e.lastVal=e.input?e.input.val():null,s=this._getDefaultDate(e),n=s,r=this._getFormatConfig(e);try{n=this.parseDate(i,a,r)||s}catch(o){a=t?"":a}e.selectedDay=n.getDate(),e.drawMonth=e.selectedMonth=n.getMonth(),e.drawYear=e.selectedYear=n.getFullYear(),e.currentDay=a?n.getDate():0,e.currentMonth=a?n.getMonth():0,e.currentYear=a?n.getFullYear():0,this._adjustInstDate(e)}},_getDefaultDate:function(e){return this._restrictMinMax(e,this._determineDate(e,this._get(e,"defaultDate"),new Date))},_determineDate:function(t,i,a){var s=function(e){var t=new Date;return t.setDate(t.getDate()+e),t},n=function(i){try{return e.datepicker.parseDate(e.datepicker._get(t,"dateFormat"),i,e.datepicker._getFormatConfig(t))}catch(a){}for(var s=(i.toLowerCase().match(/^c/)?e.datepicker._getDate(t):null)||new Date,n=s.getFullYear(),r=s.getMonth(),o=s.getDate(),u=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,c=u.exec(i);c;){switch(c[2]||"d"){case"d":case"D":o+=parseInt(c[1],10);break;case"w":case"W":o+=7*parseInt(c[1],10);break;case"m":case"M":r+=parseInt(c[1],10),o=Math.min(o,e.datepicker._getDaysInMonth(n,r));break;case"y":case"Y":n+=parseInt(c[1],10),o=Math.min(o,e.datepicker._getDaysInMonth(n,r))}c=u.exec(i)}return new Date(n,r,o)},r=null==i||""===i?a:"string"==typeof i?n(i):"number"==typeof i?isNaN(i)?a:s(i):new Date(i.getTime());return r=r&&"Invalid Date"==""+r?a:r,r&&(r.setHours(0),r.setMinutes(0),r.setSeconds(0),r.setMilliseconds(0)),this._daylightSavingAdjust(r)},_daylightSavingAdjust:function(e){return e?(e.setHours(e.getHours()>12?e.getHours()+2:0),e):null},_setDate:function(e,t,i){var a=!t,s=e.selectedMonth,n=e.selectedYear,r=this._restrictMinMax(e,this._determineDate(e,t,new Date));e.selectedDay=e.currentDay=r.getDate(),e.drawMonth=e.selectedMonth=e.currentMonth=r.getMonth(),e.drawYear=e.selectedYear=e.currentYear=r.getFullYear(),s===e.selectedMonth&&n===e.selectedYear||i||this._notifyChange(e),this._adjustInstDate(e),e.input&&e.input.val(a?"":this._formatDate(e))},_getDate:function(e){var t=!e.currentYear||e.input&&""===e.input.val()?null:this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return t},_attachHandlers:function(t){var i=this._get(t,"stepMonths"),a="#"+t.id.replace(/\\\\/g,"\\");t.dpDiv.find("[data-handler]").map(function(){var t={prev:function(){e.datepicker._adjustDate(a,-i,"M")},next:function(){e.datepicker._adjustDate(a,+i,"M")},hide:function(){e.datepicker._hideDatepicker()},today:function(){e.datepicker._gotoToday(a)},selectDay:function(){return e.datepicker._selectDay(a,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return e.datepicker._selectMonthYear(a,this,"M"),!1},selectYear:function(){return e.datepicker._selectMonthYear(a,this,"Y"),!1}};e(this).bind(this.getAttribute("data-event"),t[this.getAttribute("data-handler")])})},_generateHTML:function(e){var t,i,a,s,n,r,o,u,c,h,l,d,p,g,m,f,_,v,k,y,b,D,w,M,C,x,I,N,T,A,E,S,Y,F,P,O,j,K,R,H=new Date,W=this._daylightSavingAdjust(new Date(H.getFullYear(),H.getMonth(),H.getDate())),L=this._get(e,"isRTL"),U=this._get(e,"showButtonPanel"),B=this._get(e,"hideIfNoPrevNext"),z=this._get(e,"navigationAsDateFormat"),q=this._getNumberOfMonths(e),G=this._get(e,"showCurrentAtPos"),J=this._get(e,"stepMonths"),Q=1!==q[0]||1!==q[1],V=this._daylightSavingAdjust(e.currentDay?new Date(e.currentYear,e.currentMonth,e.currentDay):new Date(9999,9,9)),$=this._getMinMaxDate(e,"min"),X=this._getMinMaxDate(e,"max"),Z=e.drawMonth-G,et=e.drawYear;if(0>Z&&(Z+=12,et--),X)for(t=this._daylightSavingAdjust(new Date(X.getFullYear(),X.getMonth()-q[0]*q[1]+1,X.getDate())),t=$&&$>t?$:t;this._daylightSavingAdjust(new Date(et,Z,1))>t;)Z--,0>Z&&(Z=11,et--);for(e.drawMonth=Z,e.drawYear=et,i=this._get(e,"prevText"),i=z?this.formatDate(i,this._daylightSavingAdjust(new Date(et,Z-J,1)),this._getFormatConfig(e)):i,a=this._canAdjustMonth(e,-1,et,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(L?"e":"w")+"'>"+i+"</span></a>":B?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(L?"e":"w")+"'>"+i+"</span></a>",s=this._get(e,"nextText"),s=z?this.formatDate(s,this._daylightSavingAdjust(new Date(et,Z+J,1)),this._getFormatConfig(e)):s,n=this._canAdjustMonth(e,1,et,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(L?"w":"e")+"'>"+s+"</span></a>":B?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(L?"w":"e")+"'>"+s+"</span></a>",r=this._get(e,"currentText"),o=this._get(e,"gotoCurrent")&&e.currentDay?V:W,r=z?this.formatDate(r,o,this._getFormatConfig(e)):r,u=e.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(e,"closeText")+"</button>",c=U?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(L?u:"")+(this._isInRange(e,o)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+r+"</button>":"")+(L?"":u)+"</div>":"",h=parseInt(this._get(e,"firstDay"),10),h=isNaN(h)?0:h,l=this._get(e,"showWeek"),d=this._get(e,"dayNames"),p=this._get(e,"dayNamesMin"),g=this._get(e,"monthNames"),m=this._get(e,"monthNamesShort"),f=this._get(e,"beforeShowDay"),_=this._get(e,"showOtherMonths"),v=this._get(e,"selectOtherMonths"),k=this._getDefaultDate(e),y="",D=0;q[0]>D;D++){for(w="",this.maxRows=4,M=0;q[1]>M;M++){if(C=this._daylightSavingAdjust(new Date(et,Z,e.selectedDay)),x=" ui-corner-all",I="",Q){if(I+="<div class='ui-datepicker-group",q[1]>1)switch(M){case 0:I+=" ui-datepicker-group-first",x=" ui-corner-"+(L?"right":"left");break;case q[1]-1:I+=" ui-datepicker-group-last",x=" ui-corner-"+(L?"left":"right");break;default:I+=" ui-datepicker-group-middle",x=""}I+="'>"}for(I+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+x+"'>"+(/all|left/.test(x)&&0===D?L?n:a:"")+(/all|right/.test(x)&&0===D?L?a:n:"")+this._generateMonthYearHeader(e,Z,et,$,X,D>0||M>0,g,m)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",N=l?"<th class='ui-datepicker-week-col'>"+this._get(e,"weekHeader")+"</th>":"",b=0;7>b;b++)T=(b+h)%7,N+="<th"+((b+h+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+d[T]+"'>"+p[T]+"</span></th>";for(I+=N+"</tr></thead><tbody>",A=this._getDaysInMonth(et,Z),et===e.selectedYear&&Z===e.selectedMonth&&(e.selectedDay=Math.min(e.selectedDay,A)),E=(this._getFirstDayOfMonth(et,Z)-h+7)%7,S=Math.ceil((E+A)/7),Y=Q?this.maxRows>S?this.maxRows:S:S,this.maxRows=Y,F=this._daylightSavingAdjust(new Date(et,Z,1-E)),P=0;Y>P;P++){for(I+="<tr>",O=l?"<td class='ui-datepicker-week-col'>"+this._get(e,"calculateWeek")(F)+"</td>":"",b=0;7>b;b++)j=f?f.apply(e.input?e.input[0]:null,[F]):[!0,""],K=F.getMonth()!==Z,R=K&&!v||!j[0]||$&&$>F||X&&F>X,O+="<td class='"+((b+h+6)%7>=5?" ui-datepicker-week-end":"")+(K?" ui-datepicker-other-month":"")+(F.getTime()===C.getTime()&&Z===e.selectedMonth&&e._keyEvent||k.getTime()===F.getTime()&&k.getTime()===C.getTime()?" "+this._dayOverClass:"")+(R?" "+this._unselectableClass+" ui-state-disabled":"")+(K&&!_?"":" "+j[1]+(F.getTime()===V.getTime()?" "+this._currentClass:"")+(F.getTime()===W.getTime()?" ui-datepicker-today":""))+"'"+(K&&!_||!j[2]?"":" title='"+j[2].replace(/'/g,"&#39;")+"'")+(R?"":" data-handler='selectDay' data-event='click' data-month='"+F.getMonth()+"' data-year='"+F.getFullYear()+"'")+">"+(K&&!_?"&#xa0;":R?"<span class='ui-state-default'>"+F.getDate()+"</span>":"<a class='ui-state-default"+(F.getTime()===W.getTime()?" ui-state-highlight":"")+(F.getTime()===V.getTime()?" ui-state-active":"")+(K?" ui-priority-secondary":"")+"' href='#'>"+F.getDate()+"</a>")+"</td>",F.setDate(F.getDate()+1),F=this._daylightSavingAdjust(F);I+=O+"</tr>"}Z++,Z>11&&(Z=0,et++),I+="</tbody></table>"+(Q?"</div>"+(q[0]>0&&M===q[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),w+=I}y+=w}return y+=c,e._keyEvent=!1,y},_generateMonthYearHeader:function(e,t,i,a,s,n,r,o){var u,c,h,l,d,p,g,m,f=this._get(e,"changeMonth"),_=this._get(e,"changeYear"),v=this._get(e,"showMonthAfterYear"),k="<div class='ui-datepicker-title'>",y="";if(n||!f)y+="<span class='ui-datepicker-month'>"+r[t]+"</span>";else{for(u=a&&a.getFullYear()===i,c=s&&s.getFullYear()===i,y+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",h=0;12>h;h++)(!u||h>=a.getMonth())&&(!c||s.getMonth()>=h)&&(y+="<option value='"+h+"'"+(h===t?" selected='selected'":"")+">"+o[h]+"</option>");y+="</select>"}if(v||(k+=y+(!n&&f&&_?"":"&#xa0;")),!e.yearshtml)if(e.yearshtml="",n||!_)k+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(l=this._get(e,"yearRange").split(":"),d=(new Date).getFullYear(),p=function(e){var t=e.match(/c[+\-].*/)?i+parseInt(e.substring(1),10):e.match(/[+\-].*/)?d+parseInt(e,10):parseInt(e,10);
return isNaN(t)?d:t},g=p(l[0]),m=Math.max(g,p(l[1]||"")),g=a?Math.max(g,a.getFullYear()):g,m=s?Math.min(m,s.getFullYear()):m,e.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";m>=g;g++)e.yearshtml+="<option value='"+g+"'"+(g===i?" selected='selected'":"")+">"+g+"</option>";e.yearshtml+="</select>",k+=e.yearshtml,e.yearshtml=null}return k+=this._get(e,"yearSuffix"),v&&(k+=(!n&&f&&_?"":"&#xa0;")+y),k+="</div>"},_adjustInstDate:function(e,t,i){var a=e.drawYear+("Y"===i?t:0),s=e.drawMonth+("M"===i?t:0),n=Math.min(e.selectedDay,this._getDaysInMonth(a,s))+("D"===i?t:0),r=this._restrictMinMax(e,this._daylightSavingAdjust(new Date(a,s,n)));e.selectedDay=r.getDate(),e.drawMonth=e.selectedMonth=r.getMonth(),e.drawYear=e.selectedYear=r.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(e)},_restrictMinMax:function(e,t){var i=this._getMinMaxDate(e,"min"),a=this._getMinMaxDate(e,"max"),s=i&&i>t?i:t;return a&&s>a?a:s},_notifyChange:function(e){var t=this._get(e,"onChangeMonthYear");t&&t.apply(e.input?e.input[0]:null,[e.selectedYear,e.selectedMonth+1,e])},_getNumberOfMonths:function(e){var t=this._get(e,"numberOfMonths");return null==t?[1,1]:"number"==typeof t?[1,t]:t},_getMinMaxDate:function(e,t){return this._determineDate(e,this._get(e,t+"Date"),null)},_getDaysInMonth:function(e,t){return 32-this._daylightSavingAdjust(new Date(e,t,32)).getDate()},_getFirstDayOfMonth:function(e,t){return new Date(e,t,1).getDay()},_canAdjustMonth:function(e,t,i,a){var s=this._getNumberOfMonths(e),n=this._daylightSavingAdjust(new Date(i,a+(0>t?t:s[0]*s[1]),1));return 0>t&&n.setDate(this._getDaysInMonth(n.getFullYear(),n.getMonth())),this._isInRange(e,n)},_isInRange:function(e,t){var i,a,s=this._getMinMaxDate(e,"min"),n=this._getMinMaxDate(e,"max"),r=null,o=null,u=this._get(e,"yearRange");return u&&(i=u.split(":"),a=(new Date).getFullYear(),r=parseInt(i[0],10),o=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(r+=a),i[1].match(/[+\-].*/)&&(o+=a)),(!s||t.getTime()>=s.getTime())&&(!n||t.getTime()<=n.getTime())&&(!r||t.getFullYear()>=r)&&(!o||o>=t.getFullYear())},_getFormatConfig:function(e){var t=this._get(e,"shortYearCutoff");return t="string"!=typeof t?t:(new Date).getFullYear()%100+parseInt(t,10),{shortYearCutoff:t,dayNamesShort:this._get(e,"dayNamesShort"),dayNames:this._get(e,"dayNames"),monthNamesShort:this._get(e,"monthNamesShort"),monthNames:this._get(e,"monthNames")}},_formatDate:function(e,t,i,a){t||(e.currentDay=e.selectedDay,e.currentMonth=e.selectedMonth,e.currentYear=e.selectedYear);var s=t?"object"==typeof t?t:this._daylightSavingAdjust(new Date(a,i,t)):this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return this.formatDate(this._get(e,"dateFormat"),s,this._getFormatConfig(e))}}),e.fn.datepicker=function(t){if(!this.length)return this;e.datepicker.initialized||(e(document).mousedown(e.datepicker._checkExternalClick),e.datepicker.initialized=!0),0===e("#"+e.datepicker._mainDivId).length&&e("body").append(e.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof t||"isDisabled"!==t&&"getDate"!==t&&"widget"!==t?"option"===t&&2===arguments.length&&"string"==typeof arguments[1]?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof t?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this].concat(i)):e.datepicker._attachDatepicker(this,t)}):e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i))},e.datepicker=new i,e.datepicker.initialized=!1,e.datepicker.uuid=(new Date).getTime(),e.datepicker.version="1.10.4"})(jQuery);(function(e){var t={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};e.widget("ui.dialog",{version:"1.10.4",options:{appendTo:"body",autoOpen:!0,buttons:[],closeOnEscape:!0,closeText:"",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(t){var i=e(this).css(t).offset().top;0>i&&e(this).css("top",t.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),this.options.title=this.options.title||this.originalTitle,this._createWrapper(),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&e.fn.draggable&&this._makeDraggable(),this.options.resizable&&e.fn.resizable&&this._makeResizable(),this._isOpen=!1},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var t=this.options.appendTo;return t&&(t.jquery||t.nodeType)?e(t):this.document.find(t||"body").eq(0)},_destroy:function(){var e,t=this.originalPosition;this._destroyOverlay(),this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(),this.uiDialog.stop(!0,!0).remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),e=t.parent.children().eq(t.index),e.length&&e[0]!==this.element[0]?e.before(this.element):t.parent.append(this.element)},widget:function(){return this.uiDialog},disable:e.noop,enable:e.noop,close:function(t){var i,a=this;if(this._isOpen&&this._trigger("beforeClose",t)!==!1){if(this._isOpen=!1,this._destroyOverlay(),!this.opener.filter(":focusable").focus().length)try{i=this.document[0].activeElement,i&&"body"!==i.nodeName.toLowerCase()&&e(i).blur()}catch(s){}this._hide(this.uiDialog,this.options.hide,function(){a._trigger("close",t)})}},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(e,t){var i=!!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;return i&&!t&&this._trigger("focus",e),i},open:function(){var t=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),undefined):(this._isOpen=!0,this.opener=e(this.document[0].activeElement),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this._show(this.uiDialog,this.options.show,function(){t._focusTabbable(),t._trigger("focus")}),this._trigger("open"),undefined)},_focusTabbable:function(){var e=this.element.find("[autofocus]");e.length||(e=this.element.find(":tabbable")),e.length||(e=this.uiDialogButtonPane.find(":tabbable")),e.length||(e=this.uiDialogTitlebarClose.filter(":tabbable")),e.length||(e=this.uiDialog),e.eq(0).focus()},_keepFocus:function(t){function i(){var t=this.document[0].activeElement,i=this.uiDialog[0]===t||e.contains(this.uiDialog[0],t);i||this._focusTabbable()}t.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=e("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._on(this.uiDialog,{keydown:function(t){if(this.options.closeOnEscape&&!t.isDefaultPrevented()&&t.keyCode&&t.keyCode===e.ui.keyCode.ESCAPE)return t.preventDefault(),this.close(t),undefined;if(t.keyCode===e.ui.keyCode.TAB){var i=this.uiDialog.find(":tabbable"),a=i.filter(":first"),s=i.filter(":last");t.target!==s[0]&&t.target!==this.uiDialog[0]||t.shiftKey?t.target!==a[0]&&t.target!==this.uiDialog[0]||!t.shiftKey||(s.focus(1),t.preventDefault()):(a.focus(1),t.preventDefault())}},mousedown:function(e){this._moveToTop(e)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var t;this.uiDialogTitlebar=e("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog),this._on(this.uiDialogTitlebar,{mousedown:function(t){e(t.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}}),this.uiDialogTitlebarClose=e("<button type='button'></button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar),this._on(this.uiDialogTitlebarClose,{click:function(e){e.preventDefault(),this.close(e)}}),t=e("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar),this._title(t),this.uiDialog.attr({"aria-labelledby":t.attr("id")})},_title:function(e){this.options.title||e.html("&#160;"),e.text(this.options.title)},_createButtonPane:function(){this.uiDialogButtonPane=e("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),this.uiButtonSet=e("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane),this._createButtons()},_createButtons:function(){var t=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),e.isEmptyObject(i)||e.isArray(i)&&!i.length?(this.uiDialog.removeClass("ui-dialog-buttons"),undefined):(e.each(i,function(i,a){var s,n;a=e.isFunction(a)?{click:a,text:i}:a,a=e.extend({type:"button"},a),s=a.click,a.click=function(){s.apply(t.element[0],arguments)},n={icons:a.icons,text:a.showText},delete a.icons,delete a.showText,e("<button></button>",a).button(n).appendTo(t.uiButtonSet)}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),undefined)},_makeDraggable:function(){function t(e){return{position:e.position,offset:e.offset}}var i=this,a=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(a,s){e(this).addClass("ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",a,t(s))},drag:function(e,a){i._trigger("drag",e,t(a))},stop:function(s,n){a.position=[n.position.left-i.document.scrollLeft(),n.position.top-i.document.scrollTop()],e(this).removeClass("ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",s,t(n))}})},_makeResizable:function(){function t(e){return{originalPosition:e.originalPosition,originalSize:e.originalSize,position:e.position,size:e.size}}var i=this,a=this.options,s=a.resizable,n=this.uiDialog.css("position"),r="string"==typeof s?s:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:a.maxWidth,maxHeight:a.maxHeight,minWidth:a.minWidth,minHeight:this._minHeight(),handles:r,start:function(a,s){e(this).addClass("ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",a,t(s))},resize:function(e,a){i._trigger("resize",e,t(a))},stop:function(s,n){a.height=e(this).height(),a.width=e(this).width(),e(this).removeClass("ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",s,t(n))}}).css("position",n)},_minHeight:function(){var e=this.options;return"auto"===e.height?e.minHeight:Math.min(e.minHeight,e.height)},_position:function(){var e=this.uiDialog.is(":visible");e||this.uiDialog.show(),this.uiDialog.position(this.options.position),e||this.uiDialog.hide()},_setOptions:function(a){var s=this,n=!1,r={};e.each(a,function(e,a){s._setOption(e,a),e in t&&(n=!0),e in i&&(r[e]=a)}),n&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",r)},_setOption:function(e,t){var i,a,s=this.uiDialog;"dialogClass"===e&&s.removeClass(this.options.dialogClass).addClass(t),"disabled"!==e&&(this._super(e,t),"appendTo"===e&&this.uiDialog.appendTo(this._appendTo()),"buttons"===e&&this._createButtons(),"closeText"===e&&this.uiDialogTitlebarClose.button({label:""+t}),"draggable"===e&&(i=s.is(":data(ui-draggable)"),i&&!t&&s.draggable("destroy"),!i&&t&&this._makeDraggable()),"position"===e&&this._position(),"resizable"===e&&(a=s.is(":data(ui-resizable)"),a&&!t&&s.resizable("destroy"),a&&"string"==typeof t&&s.resizable("option","handles",t),a||t===!1||this._makeResizable()),"title"===e&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var e,t,i,a=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),a.minWidth>a.width&&(a.width=a.minWidth),e=this.uiDialog.css({height:"auto",width:a.width}).outerHeight(),t=Math.max(0,a.minHeight-e),i="number"==typeof a.maxHeight?Math.max(0,a.maxHeight-e):"none","auto"===a.height?this.element.css({minHeight:t,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,a.height-e)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var t=e(this);return e("<div>").css({position:"absolute",width:t.outerWidth(),height:t.outerHeight()}).appendTo(t.parent()).offset(t.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(t){return e(t.target).closest(".ui-dialog").length?!0:!!e(t.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var t=this,i=this.widgetFullName;e.ui.dialog.overlayInstances||this._delay(function(){e.ui.dialog.overlayInstances&&this.document.bind("focusin.dialog",function(a){t._allowInteraction(a)||(a.preventDefault(),e(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable())})}),this.overlay=e("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()),this._on(this.overlay,{mousedown:"_keepFocus"}),e.ui.dialog.overlayInstances++}},_destroyOverlay:function(){this.options.modal&&this.overlay&&(e.ui.dialog.overlayInstances--,e.ui.dialog.overlayInstances||this.document.unbind("focusin.dialog"),this.overlay.remove(),this.overlay=null)}}),e.ui.dialog.overlayInstances=0,e.uiBackCompat!==!1&&e.widget("ui.dialog",e.ui.dialog,{_position:function(){var t,i=this.options.position,a=[],s=[0,0];i?(("string"==typeof i||"object"==typeof i&&"0"in i)&&(a=i.split?i.split(" "):[i[0],i[1]],1===a.length&&(a[1]=a[0]),e.each(["left","top"],function(e,t){+a[e]===a[e]&&(s[e]=a[e],a[e]=t)}),i={my:a[0]+(0>s[0]?s[0]:"+"+s[0])+" "+a[1]+(0>s[1]?s[1]:"+"+s[1]),at:a.join(" ")}),i=e.extend({},e.ui.dialog.prototype.options.position,i)):i=e.ui.dialog.prototype.options.position,t=this.uiDialog.is(":visible"),t||this.uiDialog.show(),this.uiDialog.position(i),t||this.uiDialog.hide()}})})(jQuery);(function(t){t.widget("ui.menu",{version:"1.10.4",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,t.proxy(function(t){this.options.disabled&&t.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(t){t.preventDefault()},"click .ui-state-disabled > a":function(t){t.preventDefault()},"click .ui-menu-item:has(a)":function(e){var i=t(e.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.select(e),e.isPropagationStopped()||(this.mouseHandled=!0),i.has(".ui-menu").length?this.expand(e):!this.element.is(":focus")&&t(this.document[0].activeElement).closest(".ui-menu").length&&(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){var i=t(e.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(e,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.children(".ui-menu-item").eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){t.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){t(e.target).closest(".ui-menu").length||this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var e=t(this);e.data("ui-menu-submenu-carat")&&e.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(e){function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,n,a,o,r,l=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:l=!1,n=this.previousFilter||"",a=String.fromCharCode(e.keyCode),o=!1,clearTimeout(this.filterTimer),a===n?o=!0:a=n+a,r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())}),s=o&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(a=String.fromCharCode(e.keyCode),r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())})),s.length?(this.focus(e,s),s.length>1?(this.previousFilter=a,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}l&&e.preventDefault()},_activate:function(t){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i=this.options.icons.submenu,s=this.element.find(this.options.menus);this.element.toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length),s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),s=e.prev("a"),n=t("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(n),e.attr("aria-labelledby",s.attr("id"))}),e=s.add(this.element),e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),e.children(":not(.ui-menu-item)").each(function(){var e=t(this);/[^\-\u2014\u2013\s]/.test(e.text())||e.addClass("ui-widget-content ui-menu-divider")}),e.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){"icons"===t&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu),this._super(t,e)},focus:function(t,e){var i,s;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&t&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,a,o,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,a=this.activeMenu.scrollTop(),o=this.activeMenu.height(),r=e.height(),0>n?this.activeMenu.scrollTop(a+n):n+r>o&&this.activeMenu.scrollTop(a+n-o+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",t,{item:this.active}))},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),undefined):(this.next(e),undefined)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item").first())),undefined):(this.next(e),undefined)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)}})})(jQuery);(function(t,e){t.widget("ui.progressbar",{version:"1.10.4",options:{max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min}),this.valueDiv=t("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()},value:function(t){return t===e?this.options.value:(this.options.value=this._constrainedValue(t),this._refreshValue(),e)},_constrainedValue:function(t){return t===e&&(t=this.options.value),this.indeterminate=t===!1,"number"!=typeof t&&(t=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,t))},_setOptions:function(t){var e=t.value;delete t.value,this._super(t),this.options.value=this._constrainedValue(e),this._refreshValue()},_setOption:function(t,e){"max"===t&&(e=Math.max(this.min,e)),this._super(t,e)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var e=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||e>this.min).toggleClass("ui-corner-right",e===this.options.max).width(i.toFixed(0)+"%"),this.element.toggleClass("ui-progressbar-indeterminate",this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=t("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":e}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),e===this.options.max&&this._trigger("complete")}})})(jQuery);(function(t){var e=5;t.widget("ui.slider",t.ui.mouse,{version:"1.10.4",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var e,i,s=this.options,n=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),a="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",o=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),e=n.length;i>e;e++)o.push(a);this.handles=n.add(t(o.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(e){t(this).data("ui-slider-handle-index",e)})},_createRange:function(){var e=this.options,i="";e.range?(e.range===!0&&(e.values?e.values.length&&2!==e.values.length?e.values=[e.values[0],e.values[0]]:t.isArray(e.values)&&(e.values=e.values.slice(0)):e.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=t("<div></div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+("min"===e.range||"max"===e.range?" ui-slider-range-"+e.range:""))):(this.range&&this.range.remove(),this.range=null)},_setupEvents:function(){var t=this.handles.add(this.range).filter("a");this._off(t),this._on(t,this._handleEvents),this._hoverable(t),this._focusable(t)},_destroy:function(){this.handles.remove(),this.range&&this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(e){var i,s,n,a,o,r,l,h,u=this,c=this.options;return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:e.pageX,y:e.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(e){var i=Math.abs(s-u.values(e));(n>i||n===i&&(e===u._lastChangedValue||u.values(e)===c.min))&&(n=i,a=t(this),o=e)}),r=this._start(e,o),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=o,a.addClass("ui-state-active").focus(),l=a.offset(),h=!t(e.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=h?{left:0,top:0}:{left:e.pageX-l.left-a.width()/2,top:e.pageY-l.top-a.height()/2-(parseInt(a.css("borderTopWidth"),10)||0)-(parseInt(a.css("borderBottomWidth"),10)||0)+(parseInt(a.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(e,o,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(t){var e={x:t.pageX,y:t.pageY},i=this._normValueFromMouse(e);return this._slide(t,this._handleIndex,i),!1},_mouseStop:function(t){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(t,this._handleIndex),this._change(t,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(t){var e,i,s,n,a;return"horizontal"===this.orientation?(e=this.elementSize.width,i=t.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(e=this.elementSize.height,i=t.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/e,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),a=this._valueMin()+s*n,this._trimAlignValue(a)},_start:function(t,e){var i={handle:this.handles[e],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("start",t,i)},_slide:function(t,e,i){var s,n,a;this.options.values&&this.options.values.length?(s=this.values(e?0:1),2===this.options.values.length&&this.options.range===!0&&(0===e&&i>s||1===e&&s>i)&&(i=s),i!==this.values(e)&&(n=this.values(),n[e]=i,a=this._trigger("slide",t,{handle:this.handles[e],value:i,values:n}),s=this.values(e?0:1),a!==!1&&this.values(e,i))):i!==this.value()&&(a=this._trigger("slide",t,{handle:this.handles[e],value:i}),a!==!1&&this.value(i))},_stop:function(t,e){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("stop",t,i)},_change:function(t,e){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._lastChangedValue=e,this._trigger("change",t,i)}},value:function(t){return arguments.length?(this.options.value=this._trimAlignValue(t),this._refreshValue(),this._change(null,0),undefined):this._value()},values:function(e,i){var s,n,a;if(arguments.length>1)return this.options.values[e]=this._trimAlignValue(i),this._refreshValue(),this._change(null,e),undefined;if(!arguments.length)return this._values();if(!t.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(e):this.value();for(s=this.options.values,n=arguments[0],a=0;s.length>a;a+=1)s[a]=this._trimAlignValue(n[a]),this._change(null,a);this._refreshValue()},_setOption:function(e,i){var s,n=0;switch("range"===e&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),t.isArray(this.options.values)&&(n=this.options.values.length),t.Widget.prototype._setOption.apply(this,arguments),e){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;n>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var t=this.options.value;return t=this._trimAlignValue(t)},_values:function(t){var e,i,s;if(arguments.length)return e=this.options.values[t],e=this._trimAlignValue(e);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(t){if(this._valueMin()>=t)return this._valueMin();if(t>=this._valueMax())return this._valueMax();var e=this.options.step>0?this.options.step:1,i=(t-this._valueMin())%e,s=t-i;return 2*Math.abs(i)>=e&&(s+=i>0?e:-e),parseFloat(s.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var e,i,s,n,a,o=this.options.range,r=this.options,l=this,h=this._animateOff?!1:r.animate,u={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((l.values(s)-l._valueMin())/(l._valueMax()-l._valueMin())),u["horizontal"===l.orientation?"left":"bottom"]=i+"%",t(this).stop(1,1)[h?"animate":"css"](u,r.animate),l.options.range===!0&&("horizontal"===l.orientation?(0===s&&l.range.stop(1,1)[h?"animate":"css"]({left:i+"%"},r.animate),1===s&&l.range[h?"animate":"css"]({width:i-e+"%"},{queue:!1,duration:r.animate})):(0===s&&l.range.stop(1,1)[h?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&l.range[h?"animate":"css"]({height:i-e+"%"},{queue:!1,duration:r.animate}))),e=i}):(s=this.value(),n=this._valueMin(),a=this._valueMax(),i=a!==n?100*((s-n)/(a-n)):0,u["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[h?"animate":"css"](u,r.animate),"min"===o&&"horizontal"===this.orientation&&this.range.stop(1,1)[h?"animate":"css"]({width:i+"%"},r.animate),"max"===o&&"horizontal"===this.orientation&&this.range[h?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:r.animate}),"min"===o&&"vertical"===this.orientation&&this.range.stop(1,1)[h?"animate":"css"]({height:i+"%"},r.animate),"max"===o&&"vertical"===this.orientation&&this.range[h?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:r.animate}))},_handleEvents:{keydown:function(i){var s,n,a,o,r=t(i.target).data("ui-slider-handle-index");switch(i.keyCode){case t.ui.keyCode.HOME:case t.ui.keyCode.END:case t.ui.keyCode.PAGE_UP:case t.ui.keyCode.PAGE_DOWN:case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,t(i.target).addClass("ui-state-active"),s=this._start(i,r),s===!1))return}switch(o=this.options.step,n=a=this.options.values&&this.options.values.length?this.values(r):this.value(),i.keyCode){case t.ui.keyCode.HOME:a=this._valueMin();break;case t.ui.keyCode.END:a=this._valueMax();break;case t.ui.keyCode.PAGE_UP:a=this._trimAlignValue(n+(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.PAGE_DOWN:a=this._trimAlignValue(n-(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:if(n===this._valueMax())return;a=this._trimAlignValue(n+o);break;case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(n===this._valueMin())return;a=this._trimAlignValue(n-o)}this._slide(i,r,a)},click:function(t){t.preventDefault()},keyup:function(e){var i=t(e.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(e,i),this._change(e,i),t(e.target).removeClass("ui-state-active"))}}})})(jQuery);(function(t){function e(t){return function(){var e=this.element.val();t.apply(this,arguments),this._refresh(),e!==this.element.val()&&this._trigger("change")}}t.widget("ui.spinner",{version:"1.10.4",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),""!==this.value()&&this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var e={},i=this.element;return t.each(["min","max","step"],function(t,s){var n=i.attr(s);void 0!==n&&n.length&&(e[s]=n)}),e},_events:{keydown:function(t){this._start(t)&&this._keydown(t)&&t.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(this._stop(),this._refresh(),this.previous!==this.element.val()&&this._trigger("change",t),void 0)},mousewheel:function(t,e){if(e){if(!this.spinning&&!this._start(t))return!1;this._spin((e>0?1:-1)*this.options.step,t),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(t)},100),t.preventDefault()}},"mousedown .ui-spinner-button":function(e){function i(){var t=this.element[0]===this.document[0].activeElement;t||(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s}))}var s;s=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),e.preventDefault(),i.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,i.call(this)}),this._start(e)!==!1&&this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(e){return t(e.currentTarget).hasClass("ui-state-active")?this._start(e)===!1?!1:(this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e),void 0):void 0},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var t=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());this.element.attr("role","spinbutton"),this.buttons=t.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all"),this.buttons.height()>Math.ceil(.5*t.height())&&t.height()>0&&t.height(t.height()),this.options.disabled&&this.disable()},_keydown:function(e){var i=this.options,s=t.ui.keyCode;switch(e.keyCode){case s.UP:return this._repeat(null,1,e),!0;case s.DOWN:return this._repeat(null,-1,e),!0;case s.PAGE_UP:return this._repeat(null,i.page,e),!0;case s.PAGE_DOWN:return this._repeat(null,-i.page,e),!0}return!1},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;</span>"+"</a>"+"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>"+"<span class='ui-icon "+this.options.icons.down+"'>&#9660;</span>"+"</a>"},_start:function(t){return this.spinning||this._trigger("start",t)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(t,e,i){t=t||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,e,i)},t),this._spin(e*this.options.step,i)},_spin:function(t,e){var i=this.value()||0;this.counter||(this.counter=1),i=this._adjustValue(i+t*this._increment(this.counter)),this.spinning&&this._trigger("spin",e,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(e){var i=this.options.incremental;return i?t.isFunction(i)?i(e):Math.floor(e*e*e/5e4-e*e/500+17*e/200+1):1},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_adjustValue:function(t){var e,i,s=this.options;return e=null!==s.min?s.min:0,i=t-e,i=Math.round(i/s.step)*s.step,t=e+i,t=parseFloat(t.toFixed(this._precision())),null!==s.max&&t>s.max?s.max:null!==s.min&&s.min>t?s.min:t},_stop:function(t){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",t))},_setOption:function(t,e){if("culture"===t||"numberFormat"===t){var i=this._parse(this.element.val());return this.options[t]=e,this.element.val(this._format(i)),void 0}("max"===t||"min"===t||"step"===t)&&"string"==typeof e&&(e=this._parse(e)),"icons"===t&&(this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(e.up),this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(e.down)),this._super(t,e),"disabled"===t&&(e?(this.element.prop("disabled",!0),this.buttons.button("disable")):(this.element.prop("disabled",!1),this.buttons.button("enable")))},_setOptions:e(function(t){this._super(t),this._value(this.element.val())}),_parse:function(t){return"string"==typeof t&&""!==t&&(t=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(t,10,this.options.culture):+t),""===t||isNaN(t)?null:t},_format:function(t){return""===t?"":window.Globalize&&this.options.numberFormat?Globalize.format(t,this.options.numberFormat,this.options.culture):t},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},_value:function(t,e){var i;""!==t&&(i=this._parse(t),null!==i&&(e||(i=this._adjustValue(i)),t=this._format(i))),this.element.val(t),this._refresh()},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:e(function(t){this._stepUp(t)}),_stepUp:function(t){this._start()&&(this._spin((t||1)*this.options.step),this._stop())},stepDown:e(function(t){this._stepDown(t)}),_stepDown:function(t){this._start()&&(this._spin((t||1)*-this.options.step),this._stop())},pageUp:e(function(t){this._stepUp((t||1)*this.options.page)}),pageDown:e(function(t){this._stepDown((t||1)*this.options.page)}),value:function(t){return arguments.length?(e(this._value).call(this,t),void 0):this._parse(this.element.val())},widget:function(){return this.uiSpinner}})})(jQuery);(function(t,e){function i(){return++n}function s(t){return t=t.cloneNode(!1),t.hash.length>1&&decodeURIComponent(t.href.replace(a,""))===decodeURIComponent(location.href.replace(a,""))}var n=0,a=/#.*$/;t.widget("ui.tabs",{version:"1.10.4",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var e=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(e){t(this).is(".ui-state-disabled")&&e.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){t(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs(),i.active=this._initialActive(),t.isArray(i.disabled)&&(i.disabled=t.unique(i.disabled.concat(t.map(this.tabs.filter(".ui-state-disabled"),function(t){return e.tabs.index(t)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):t(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var i=this.options.active,s=this.options.collapsible,n=location.hash.substring(1);return null===i&&(n&&this.tabs.each(function(s,a){return t(a).attr("aria-controls")===n?(i=s,!1):e}),null===i&&(i=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===i||-1===i)&&(i=this.tabs.length?0:!1)),i!==!1&&(i=this.tabs.index(this.tabs.eq(i)),-1===i&&(i=s?!1:0)),!s&&i===!1&&this.anchors.length&&(i=0),i},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):t()}},_tabKeydown:function(i){var s=t(this.document[0].activeElement).closest("li"),n=this.tabs.index(s),a=!0;if(!this._handlePageNav(i)){switch(i.keyCode){case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:n++;break;case t.ui.keyCode.UP:case t.ui.keyCode.LEFT:a=!1,n--;break;case t.ui.keyCode.END:n=this.anchors.length-1;break;case t.ui.keyCode.HOME:n=0;break;case t.ui.keyCode.SPACE:return i.preventDefault(),clearTimeout(this.activating),this._activate(n),e;case t.ui.keyCode.ENTER:return i.preventDefault(),clearTimeout(this.activating),this._activate(n===this.options.active?!1:n),e;default:return}i.preventDefault(),clearTimeout(this.activating),n=this._focusNextTab(n,a),i.ctrlKey||(s.attr("aria-selected","false"),this.tabs.eq(n).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",n)},this.delay))}},_panelKeydown:function(e){this._handlePageNav(e)||e.ctrlKey&&e.keyCode===t.ui.keyCode.UP&&(e.preventDefault(),this.active.focus())},_handlePageNav:function(i){return i.altKey&&i.keyCode===t.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):i.altKey&&i.keyCode===t.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):e},_findNextTab:function(e,i){function s(){return e>n&&(e=0),0>e&&(e=n),e}for(var n=this.tabs.length-1;-1!==t.inArray(s(),this.options.disabled);)e=i?e+1:e-1;return e},_focusNextTab:function(t,e){return t=this._findNextTab(t,e),this.tabs.eq(t).focus(),t},_setOption:function(t,i){return"active"===t?(this._activate(i),e):"disabled"===t?(this._setupDisabled(i),e):(this._super(t,i),"collapsible"===t&&(this.element.toggleClass("ui-tabs-collapsible",i),i||this.options.active!==!1||this._activate(0)),"event"===t&&this._setupEvents(i),"heightStyle"===t&&this._setupHeightStyle(i),e)},_tabId:function(t){return t.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(t){return t?t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var e=this.options,i=this.tablist.children(":has(a[href])");e.disabled=t.map(i.filter(".ui-state-disabled"),function(t){return i.index(t)}),this._processTabs(),e.active!==!1&&this.anchors.length?this.active.length&&!t.contains(this.tablist[0],this.active[0])?this.tabs.length===e.disabled.length?(e.active=!1,this.active=t()):this._activate(this._findNextTab(Math.max(0,e.active-1),!1)):e.active=this.tabs.index(this.active):(e.active=!1,this.active=t()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var e=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return t("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=t(),this.anchors.each(function(i,n){var a,o,r,h=t(n).uniqueId().attr("id"),l=t(n).closest("li"),c=l.attr("aria-controls");s(n)?(a=n.hash,o=e.element.find(e._sanitizeSelector(a))):(r=e._tabId(l),a="#"+r,o=e.element.find(a),o.length||(o=e._createPanel(r),o.insertAfter(e.panels[i-1]||e.tablist)),o.attr("aria-live","polite")),o.length&&(e.panels=e.panels.add(o)),c&&l.data("ui-tabs-aria-controls",c),l.attr({"aria-controls":a.substring(1),"aria-labelledby":h}),o.attr("aria-labelledby",h)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.tablist||this.element.find("ol,ul").eq(0)},_createPanel:function(e){return t("<div>").attr("id",e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(e){t.isArray(e)&&(e.length?e.length===this.anchors.length&&(e=!0):e=!1);for(var i,s=0;i=this.tabs[s];s++)e===!0||-1!==t.inArray(s,e)?t(i).addClass("ui-state-disabled").attr("aria-disabled","true"):t(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=e},_setupEvents:function(e){var i={click:function(t){t.preventDefault()}};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(e){var i,s=this.element.parent();"fill"===e?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=t(this).outerHeight(!0)}),this.panels.each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===e&&(i=0,this.panels.each(function(){i=Math.max(i,t(this).height("").height())}).height(i))},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),a=n.closest("li"),o=a[0]===s[0],r=o&&i.collapsible,h=r?t():this._getPanelForTab(a),l=s.length?this._getPanelForTab(s):t(),c={oldTab:s,oldPanel:l,newTab:r?t():a,newPanel:h};e.preventDefault(),a.hasClass("ui-state-disabled")||a.hasClass("ui-tabs-loading")||this.running||o&&!i.collapsible||this._trigger("beforeActivate",e,c)===!1||(i.active=r?!1:this.tabs.index(a),this.active=o?t():a,this.xhr&&this.xhr.abort(),l.length||h.length||t.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(a),e),this._toggle(e,c))},_toggle:function(e,i){function s(){a.running=!1,a._trigger("activate",e,i)}function n(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),o.length&&a.options.show?a._show(o,a.options.show,s):(o.show(),s())}var a=this,o=i.newPanel,r=i.oldPanel;this.running=!0,r.length&&this.options.hide?this._hide(r,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),n()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),r.hide(),n()),r.attr({"aria-expanded":"false","aria-hidden":"true"}),i.oldTab.attr("aria-selected","false"),o.length&&r.length?i.oldTab.attr("tabIndex",-1):o.length&&this.tabs.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),o.attr({"aria-expanded":"true","aria-hidden":"false"}),i.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(e){var i,s=this._findActive(e);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return e===!1?t():this.tabs.eq(e)},_getIndex:function(t){return"string"==typeof t&&(t=this.anchors.index(this.anchors.filter("[href$='"+t+"']"))),t},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){t.data(this,"ui-tabs-destroy")?t(this).remove():t(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var e=t(this),i=e.data("ui-tabs-aria-controls");i?e.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):e.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(i){var s=this.options.disabled;s!==!1&&(i===e?s=!1:(i=this._getIndex(i),s=t.isArray(s)?t.map(s,function(t){return t!==i?t:null}):t.map(this.tabs,function(t,e){return e!==i?e:null})),this._setupDisabled(s))},disable:function(i){var s=this.options.disabled;if(s!==!0){if(i===e)s=!0;else{if(i=this._getIndex(i),-1!==t.inArray(i,s))return;s=t.isArray(s)?t.merge([i],s).sort():[i]}this._setupDisabled(s)}},load:function(e,i){e=this._getIndex(e);var n=this,a=this.tabs.eq(e),o=a.find(".ui-tabs-anchor"),r=this._getPanelForTab(a),h={tab:a,panel:r};s(o[0])||(this.xhr=t.ajax(this._ajaxSettings(o,i,h)),this.xhr&&"canceled"!==this.xhr.statusText&&(a.addClass("ui-tabs-loading"),r.attr("aria-busy","true"),this.xhr.success(function(t){setTimeout(function(){r.html(t),n._trigger("load",i,h)},1)}).complete(function(t,e){setTimeout(function(){"abort"===e&&n.panels.stop(!1,!0),a.removeClass("ui-tabs-loading"),r.removeAttr("aria-busy"),t===n.xhr&&delete n.xhr},1)})))},_ajaxSettings:function(e,i,s){var n=this;return{url:e.attr("href"),beforeSend:function(e,a){return n._trigger("beforeLoad",i,t.extend({jqXHR:e,ajaxSettings:a},s))}}},_getPanelForTab:function(e){var i=t(e).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}})})(jQuery);(function(t){function e(e,i){var s=(e.attr("aria-describedby")||"").split(/\s+/);s.push(i),e.data("ui-tooltip-id",i).attr("aria-describedby",t.trim(s.join(" ")))}function i(e){var i=e.data("ui-tooltip-id"),s=(e.attr("aria-describedby")||"").split(/\s+/),n=t.inArray(i,s);-1!==n&&s.splice(n,1),e.removeData("ui-tooltip-id"),s=t.trim(s.join(" ")),s?e.attr("aria-describedby",s):e.removeAttr("aria-describedby")}var s=0;t.widget("ui.tooltip",{version:"1.10.4",options:{content:function(){var e=t(this).attr("title")||"";return t("<a>").text(e).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable()},_setOption:function(e,i){var s=this;return"disabled"===e?(this[i?"_disable":"_enable"](),this.options[e]=i,void 0):(this._super(e,i),"content"===e&&t.each(this.tooltips,function(t,e){s._updateContent(e)}),void 0)},_disable:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0)}),this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.is("[title]")&&e.data("ui-tooltip-title",e.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.data("ui-tooltip-title")&&e.attr("title",e.data("ui-tooltip-title"))})},open:function(e){var i=this,s=t(e?e.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),e&&"mouseover"===e.type&&s.parents().each(function(){var e,s=t(this);s.data("ui-tooltip-open")&&(e=t.Event("blur"),e.target=e.currentTarget=this,i.close(e,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._updateContent(s,e))},_updateContent:function(t,e){var i,s=this.options.content,n=this,o=e?e.type:null;return"string"==typeof s?this._open(e,t,s):(i=s.call(t[0],function(i){t.data("ui-tooltip-open")&&n._delay(function(){e&&(e.type=o),this._open(e,t,i)})}),i&&this._open(e,t,i),void 0)},_open:function(i,s,n){function o(t){l.of=t,a.is(":hidden")||a.position(l)}var a,r,h,l=t.extend({},this.options.position);if(n){if(a=this._find(s),a.length)return a.find(".ui-tooltip-content").html(n),void 0;s.is("[title]")&&(i&&"mouseover"===i.type?s.attr("title",""):s.removeAttr("title")),a=this._tooltip(s),e(s,a.attr("id")),a.find(".ui-tooltip-content").html(n),this.options.track&&i&&/^mouse/.test(i.type)?(this._on(this.document,{mousemove:o}),o(i)):a.position(t.extend({of:s},this.options.position)),a.hide(),this._show(a,this.options.show),this.options.show&&this.options.show.delay&&(h=this.delayedShow=setInterval(function(){a.is(":visible")&&(o(l.of),clearInterval(h))},t.fx.interval)),this._trigger("open",i,{tooltip:a}),r={keyup:function(e){if(e.keyCode===t.ui.keyCode.ESCAPE){var i=t.Event(e);i.currentTarget=s[0],this.close(i,!0)}},remove:function(){this._removeTooltip(a)}},i&&"mouseover"!==i.type||(r.mouseleave="close"),i&&"focusin"!==i.type||(r.focusout="close"),this._on(!0,s,r)}},close:function(e){var s=this,n=t(e?e.currentTarget:this.element),o=this._find(n);this.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&n.attr("title",n.data("ui-tooltip-title")),i(n),o.stop(!0),this._hide(o,this.options.hide,function(){s._removeTooltip(t(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),e&&"mouseleave"===e.type&&t.each(this.parents,function(e,i){t(i.element).attr("title",i.title),delete s.parents[e]}),this.closing=!0,this._trigger("close",e,{tooltip:o}),this.closing=!1)},_tooltip:function(e){var i="ui-tooltip-"+s++,n=t("<div>").attr({id:i,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));return t("<div>").addClass("ui-tooltip-content").appendTo(n),n.appendTo(this.document[0].body),this.tooltips[i]=e,n},_find:function(e){var i=e.data("ui-tooltip-id");return i?t("#"+i):t()},_removeTooltip:function(t){t.remove(),delete this.tooltips[t.attr("id")]},_destroy:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0),t("#"+i).remove(),s.data("ui-tooltip-title")&&(s.attr("title",s.data("ui-tooltip-title")),s.removeData("ui-tooltip-title"))})}})})(jQuery);(function(t,e){var i="ui-effects-";t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=h(),n=s._rgba=[];return i=i.toLowerCase(),f(l,function(t,a){var o,r=a.re.exec(i),l=r&&a.parse(r),h=a.space||"rgba";return l?(o=s[h](l),s[c[h].cache]=o[c[h].cache],n=s._rgba=o._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,a.transparent),s):a[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var a,o="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,l=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],h=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=h.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),h.fn=t.extend(h.prototype,{parse:function(n,o,r,l){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(o),o=e);var u=this,d=t.type(n),p=this._rgba=[];return o!==e&&(n=[n,o,r,l],d="array"),"string"===d?this.parse(s(n)||a._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof h?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var a=s.cache;f(s.props,function(t,e){if(!u[a]&&s.to){if("alpha"===t||null==n[t])return;u[a]=s.to(u._rgba)}u[a][e.idx]=i(n[t],e,!0)}),u[a]&&0>t.inArray(null,u[a].slice(0,3))&&(u[a][3]=1,s.from&&(u._rgba=s.from(u[a])))}),this):e},is:function(t){var i=h(t),s=!0,n=this;return f(c,function(t,a){var o,r=i[a.cache];return r&&(o=n[a.cache]||a.to&&a.to(n._rgba)||[],f(a.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===o[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=h(t),n=s._space(),a=c[n],o=0===this.alpha()?h("transparent"):this,r=o[a.cache]||a.to(o._rgba),l=r.slice();return s=s[a.cache],f(a.props,function(t,n){var a=n.idx,o=r[a],h=s[a],c=u[n.type]||{};null!==h&&(null===o?l[a]=h:(c.mod&&(h-o>c.mod/2?o+=c.mod:o-h>c.mod/2&&(o-=c.mod)),l[a]=i((h-o)*e+o,n)))}),this[n](l)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=h(e)._rgba;return h(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),h.fn.parse.prototype=h.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,a=t[2]/255,o=t[3],r=Math.max(s,n,a),l=Math.min(s,n,a),h=r-l,c=r+l,u=.5*c;return e=l===r?0:s===r?60*(n-a)/h+360:n===r?60*(a-s)/h+120:60*(s-n)/h+240,i=0===h?0:.5>=u?h/c:h/(2-c),[Math.round(e)%360,i,u,null==o?1:o]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],a=t[3],o=.5>=s?s*(1+i):s+i-s*i,r=2*s-o;return[Math.round(255*n(r,o,e+1/3)),Math.round(255*n(r,o,e)),Math.round(255*n(r,o,e-1/3)),a]},f(c,function(s,n){var a=n.props,o=n.cache,l=n.to,c=n.from;h.fn[s]=function(s){if(l&&!this[o]&&(this[o]=l(this._rgba)),s===e)return this[o].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[o].slice();return f(a,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=h(c(d)),n[o]=d,n):h(d)},f(a,function(e,i){h.fn[e]||(h.fn[e]=function(n){var a,o=t.type(n),l="alpha"===e?this._hsla?"hsla":"rgba":s,h=this[l](),c=h[i.idx];return"undefined"===o?c:("function"===o&&(n=n.call(this,c),o=t.type(n)),null==n&&i.empty?this:("string"===o&&(a=r.exec(n),a&&(n=c+parseFloat(a[2])*("+"===a[1]?1:-1))),h[i.idx]=n,this[l](h)))})})}),h.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var a,o,r="";if("transparent"!==n&&("string"!==t.type(n)||(a=s(n)))){if(n=h(a||n),!d.rgba&&1!==n._rgba[3]){for(o="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&o&&o.style;)try{r=t.css(o,"backgroundColor"),o=o.parentNode}catch(l){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(l){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=h(e.elem,i),e.end=h(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},h.hook(o),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},a=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,a={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(a[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(a[i]=n[i]);return a}function s(e,i){var s,n,o={};for(s in i)n=i[s],e[s]!==n&&(a[s]||(t.fx.step[s]||!isNaN(parseFloat(n)))&&(o[s]=n));return o}var n=["add","remove","toggle"],a={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(jQuery.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(e,a,o,r){var l=t.speed(a,o,r);return this.queue(function(){var a,o=t(this),r=o.attr("class")||"",h=l.children?o.find("*").addBack():o;h=h.map(function(){var e=t(this);return{el:e,start:i(this)}}),a=function(){t.each(n,function(t,i){e[i]&&o[i+"Class"](e[i])})},a(),h=h.map(function(){return this.end=i(this.el[0]),this.diff=s(this.start,this.end),this}),o.attr("class",r),h=h.map(function(){var e=this,i=t.Deferred(),s=t.extend({},l,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,h.get()).done(function(){a(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),l.complete.call(o[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,a){return s?t.effects.animateClass.call(this,{add:i},s,n,a):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,a){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,a):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(i){return function(s,n,a,o,r){return"boolean"==typeof n||n===e?a?t.effects.animateClass.call(this,n?{add:s}:{remove:s},a,o,r):i.apply(this,arguments):t.effects.animateClass.call(this,{toggle:s},n,a,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,a){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,a)}})}(),function(){function s(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function n(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}t.extend(t.effects,{version:"1.10.4",save:function(t,e){for(var s=0;e.length>s;s++)null!==e[s]&&t.data(i+e[s],t[0].style[e[s]])},restore:function(t,s){var n,a;for(a=0;s.length>a;a++)null!==s[a]&&(n=t.data(i+s[a]),n===e&&(n=""),t.css(s[a],n))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},a=document.activeElement;try{a.id}catch(o){a=document.body}return e.wrap(s),(e[0]===a||t.contains(e[0],a))&&t(a).focus(),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).focus()),e},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var a=e.cssUnit(i);a[0]>0&&(n[i]=a[0]*s+a[1])}),n}}),t.fn.extend({effect:function(){function e(e){function s(){t.isFunction(a)&&a.call(n[0]),t.isFunction(e)&&e()}var n=t(this),a=i.complete,r=i.mode;(n.is(":hidden")?"hide"===r:"show"===r)?(n[r](),s()):o.call(n[0],i,s)}var i=s.apply(this,arguments),n=i.mode,a=i.queue,o=t.effects.effect[i.effect];return t.fx.off||!o?n?this[n](i.duration,i.complete):this.each(function(){i.complete&&i.complete.call(this)}):a===!1?this.each(e):this.queue(a||"fx",e)},show:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(t.fn.show),hide:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(t.fn.hide),toggle:function(t){return function(e){if(n(e)||"boolean"==typeof e)return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s}})}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}()})(jQuery);(function(t){var e=/up|down|vertical/,i=/up|left|vertical|horizontal/;t.effects.effect.blind=function(s,n){var a,o,r,l=t(this),h=["position","top","bottom","left","right","height","width"],c=t.effects.setMode(l,s.mode||"hide"),u=s.direction||"up",d=e.test(u),p=d?"height":"width",f=d?"top":"left",g=i.test(u),m={},v="show"===c;l.parent().is(".ui-effects-wrapper")?t.effects.save(l.parent(),h):t.effects.save(l,h),l.show(),a=t.effects.createWrapper(l).css({overflow:"hidden"}),o=a[p](),r=parseFloat(a.css(f))||0,m[p]=v?o:0,g||(l.css(d?"bottom":"right",0).css(d?"top":"left","auto").css({position:"absolute"}),m[f]=v?r:o+r),v&&(a.css(p,0),g||a.css(f,r+o)),a.animate(m,{duration:s.duration,easing:s.easing,queue:!1,complete:function(){"hide"===c&&l.hide(),t.effects.restore(l,h),t.effects.removeWrapper(l),n()}})}})(jQuery);(function(t){t.effects.effect.bounce=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],l=t.effects.setMode(o,e.mode||"effect"),h="hide"===l,c="show"===l,u=e.direction||"up",d=e.distance,p=e.times||5,f=2*p+(c||h?1:0),g=e.duration/f,m=e.easing,v="up"===u||"down"===u?"top":"left",_="up"===u||"left"===u,b=o.queue(),y=b.length;for((c||h)&&r.push("opacity"),t.effects.save(o,r),o.show(),t.effects.createWrapper(o),d||(d=o["top"===v?"outerHeight":"outerWidth"]()/3),c&&(a={opacity:1},a[v]=0,o.css("opacity",0).css(v,_?2*-d:2*d).animate(a,g,m)),h&&(d/=Math.pow(2,p-1)),a={},a[v]=0,s=0;p>s;s++)n={},n[v]=(_?"-=":"+=")+d,o.animate(n,g,m).animate(a,g,m),d=h?2*d:d/2;h&&(n={opacity:0},n[v]=(_?"-=":"+=")+d,o.animate(n,g,m)),o.queue(function(){h&&o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}),y>1&&b.splice.apply(b,[1,0].concat(b.splice(y,f+1))),o.dequeue()}})(jQuery);(function(t){t.effects.effect.clip=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],l=t.effects.setMode(o,e.mode||"hide"),h="show"===l,c=e.direction||"vertical",u="vertical"===c,d=u?"height":"width",p=u?"top":"left",f={};t.effects.save(o,r),o.show(),s=t.effects.createWrapper(o).css({overflow:"hidden"}),n="IMG"===o[0].tagName?s:o,a=n[d](),h&&(n.css(d,0),n.css(p,a/2)),f[d]=h?a:0,f[p]=h?0:a/2,n.animate(f,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){h||o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}})}})(jQuery);(function(t){t.effects.effect.drop=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","opacity","height","width"],o=t.effects.setMode(n,e.mode||"hide"),r="show"===o,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l?"pos":"neg",u={opacity:r?1:0};t.effects.save(n,a),n.show(),t.effects.createWrapper(n),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0)/2,r&&n.css("opacity",0).css(h,"pos"===c?-s:s),u[h]=(r?"pos"===c?"+=":"-=":"pos"===c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}})(jQuery);(function(t){t.effects.effect.explode=function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),g||p.hide(),i()}var a,o,r,l,h,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=t.effects.setMode(p,e.mode||"hide"),g="show"===f,m=p.show().css("visibility","hidden").offset(),v=Math.ceil(p.outerWidth()/d),_=Math.ceil(p.outerHeight()/u),b=[];for(a=0;u>a;a++)for(l=m.top+a*_,c=a-(u-1)/2,o=0;d>o;o++)r=m.left+o*v,h=o-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-o*v,top:-a*_}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:_,left:r+(g?h*v:0),top:l+(g?c*_:0),opacity:g?0:1}).animate({left:r+(g?0:h*v),top:l+(g?0:c*_),opacity:g?1:0},e.duration||500,e.easing,s)}})(jQuery);(function(t){t.effects.effect.fade=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"toggle");s.animate({opacity:n},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}})(jQuery);(function(t){t.effects.effect.fold=function(e,i){var s,n,a=t(this),o=["position","top","bottom","left","right","height","width"],r=t.effects.setMode(a,e.mode||"hide"),l="show"===r,h="hide"===r,c=e.size||15,u=/([0-9]+)%/.exec(c),d=!!e.horizFirst,p=l!==d,f=p?["width","height"]:["height","width"],g=e.duration/2,m={},v={};t.effects.save(a,o),a.show(),s=t.effects.createWrapper(a).css({overflow:"hidden"}),n=p?[s.width(),s.height()]:[s.height(),s.width()],u&&(c=parseInt(u[1],10)/100*n[h?0:1]),l&&s.css(d?{height:0,width:c}:{height:c,width:0}),m[f[0]]=l?n[0]:c,v[f[1]]=l?n[1]:0,s.animate(m,g,e.easing).animate(v,g,e.easing,function(){h&&a.hide(),t.effects.restore(a,o),t.effects.removeWrapper(a),i()})}})(jQuery);(function(t){t.effects.effect.highlight=function(e,i){var s=t(this),n=["backgroundImage","backgroundColor","opacity"],a=t.effects.setMode(s,e.mode||"show"),o={backgroundColor:s.css("backgroundColor")};"hide"===a&&(o.opacity=0),t.effects.save(s,n),s.show().css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(o,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&s.hide(),t.effects.restore(s,n),i()}})}})(jQuery);(function(t){t.effects.effect.pulsate=function(e,i){var s,n=t(this),a=t.effects.setMode(n,e.mode||"show"),o="show"===a,r="hide"===a,l=o||"hide"===a,h=2*(e.times||5)+(l?1:0),c=e.duration/h,u=0,d=n.queue(),p=d.length;for((o||!n.is(":visible"))&&(n.css("opacity",0).show(),u=1),s=1;h>s;s++)n.animate({opacity:u},c,e.easing),u=1-u;n.animate({opacity:u},c,e.easing),n.queue(function(){r&&n.hide(),i()}),p>1&&d.splice.apply(d,[1,0].concat(d.splice(p,h+1))),n.dequeue()}})(jQuery);(function(t){t.effects.effect.puff=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"hide"),a="hide"===n,o=parseInt(e.percent,10)||150,r=o/100,l={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()};t.extend(e,{effect:"scale",queue:!1,fade:!0,mode:n,complete:i,percent:a?o:100,from:a?l:{height:l.height*r,width:l.width*r,outerHeight:l.outerHeight*r,outerWidth:l.outerWidth*r}}),s.effect(e)},t.effects.effect.scale=function(e,i){var s=t(this),n=t.extend(!0,{},e),a=t.effects.setMode(s,e.mode||"effect"),o=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"hide"===a?0:100),r=e.direction||"both",l=e.origin,h={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()},c={y:"horizontal"!==r?o/100:1,x:"vertical"!==r?o/100:1};n.effect="size",n.queue=!1,n.complete=i,"effect"!==a&&(n.origin=l||["middle","center"],n.restore=!0),n.from=e.from||("show"===a?{height:0,width:0,outerHeight:0,outerWidth:0}:h),n.to={height:h.height*c.y,width:h.width*c.x,outerHeight:h.outerHeight*c.y,outerWidth:h.outerWidth*c.x},n.fade&&("show"===a&&(n.from.opacity=0,n.to.opacity=1),"hide"===a&&(n.from.opacity=1,n.to.opacity=0)),s.effect(n)},t.effects.effect.size=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","width","height","overflow","opacity"],l=["position","top","bottom","left","right","overflow","opacity"],h=["width","height","overflow"],c=["fontSize"],u=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],d=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=t.effects.setMode(o,e.mode||"effect"),f=e.restore||"effect"!==p,g=e.scale||"both",m=e.origin||["middle","center"],v=o.css("position"),_=f?r:l,b={height:0,width:0,outerHeight:0,outerWidth:0};"show"===p&&o.show(),s={height:o.height(),width:o.width(),outerHeight:o.outerHeight(),outerWidth:o.outerWidth()},"toggle"===e.mode&&"show"===p?(o.from=e.to||b,o.to=e.from||s):(o.from=e.from||("show"===p?b:s),o.to=e.to||("hide"===p?b:s)),a={from:{y:o.from.height/s.height,x:o.from.width/s.width},to:{y:o.to.height/s.height,x:o.to.width/s.width}},("box"===g||"both"===g)&&(a.from.y!==a.to.y&&(_=_.concat(u),o.from=t.effects.setTransition(o,u,a.from.y,o.from),o.to=t.effects.setTransition(o,u,a.to.y,o.to)),a.from.x!==a.to.x&&(_=_.concat(d),o.from=t.effects.setTransition(o,d,a.from.x,o.from),o.to=t.effects.setTransition(o,d,a.to.x,o.to))),("content"===g||"both"===g)&&a.from.y!==a.to.y&&(_=_.concat(c).concat(h),o.from=t.effects.setTransition(o,c,a.from.y,o.from),o.to=t.effects.setTransition(o,c,a.to.y,o.to)),t.effects.save(o,_),o.show(),t.effects.createWrapper(o),o.css("overflow","hidden").css(o.from),m&&(n=t.effects.getBaseline(m,s),o.from.top=(s.outerHeight-o.outerHeight())*n.y,o.from.left=(s.outerWidth-o.outerWidth())*n.x,o.to.top=(s.outerHeight-o.to.outerHeight)*n.y,o.to.left=(s.outerWidth-o.to.outerWidth)*n.x),o.css(o.from),("content"===g||"both"===g)&&(u=u.concat(["marginTop","marginBottom"]).concat(c),d=d.concat(["marginLeft","marginRight"]),h=r.concat(u).concat(d),o.find("*[width]").each(function(){var i=t(this),s={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};f&&t.effects.save(i,h),i.from={height:s.height*a.from.y,width:s.width*a.from.x,outerHeight:s.outerHeight*a.from.y,outerWidth:s.outerWidth*a.from.x},i.to={height:s.height*a.to.y,width:s.width*a.to.x,outerHeight:s.height*a.to.y,outerWidth:s.width*a.to.x},a.from.y!==a.to.y&&(i.from=t.effects.setTransition(i,u,a.from.y,i.from),i.to=t.effects.setTransition(i,u,a.to.y,i.to)),a.from.x!==a.to.x&&(i.from=t.effects.setTransition(i,d,a.from.x,i.from),i.to=t.effects.setTransition(i,d,a.to.x,i.to)),i.css(i.from),i.animate(i.to,e.duration,e.easing,function(){f&&t.effects.restore(i,h)})})),o.animate(o.to,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){0===o.to.opacity&&o.css("opacity",o.from.opacity),"hide"===p&&o.hide(),t.effects.restore(o,_),f||("static"===v?o.css({position:"relative",top:o.to.top,left:o.to.left}):t.each(["top","left"],function(t,e){o.css(e,function(e,i){var s=parseInt(i,10),n=t?o.to.left:o.to.top;return"auto"===i?n+"px":s+n+"px"})})),t.effects.removeWrapper(o),i()}})}})(jQuery);(function(t){t.effects.effect.shake=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","height","width"],o=t.effects.setMode(n,e.mode||"effect"),r=e.direction||"left",l=e.distance||20,h=e.times||3,c=2*h+1,u=Math.round(e.duration/c),d="up"===r||"down"===r?"top":"left",p="up"===r||"left"===r,f={},g={},m={},v=n.queue(),_=v.length;for(t.effects.save(n,a),n.show(),t.effects.createWrapper(n),f[d]=(p?"-=":"+=")+l,g[d]=(p?"+=":"-=")+2*l,m[d]=(p?"-=":"+=")+2*l,n.animate(f,u,e.easing),s=1;h>s;s++)n.animate(g,u,e.easing).animate(m,u,e.easing);n.animate(g,u,e.easing).animate(f,u/2,e.easing).queue(function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}),_>1&&v.splice.apply(v,[1,0].concat(v.splice(_,c+1))),n.dequeue()}})(jQuery);(function(t){t.effects.effect.slide=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","width","height"],o=t.effects.setMode(n,e.mode||"show"),r="show"===o,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l,u={};t.effects.save(n,a),n.show(),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0),t.effects.createWrapper(n).css({overflow:"hidden"}),r&&n.css(h,c?isNaN(s)?"-"+s:-s:s),u[h]=(r?c?"+=":"-=":c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}})(jQuery);(function(t){t.effects.effect.transfer=function(e,i){var s=t(this),n=t(e.to),a="fixed"===n.css("position"),o=t("body"),r=a?o.scrollTop():0,l=a?o.scrollLeft():0,h=n.offset(),c={top:h.top-r,left:h.left-l,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),d=t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({top:u.top-r,left:u.left-l,height:s.innerHeight(),width:s.innerWidth(),position:a?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){d.remove(),i()})}})(jQuery);/* 
* jqGrid  4.6.0 - jQuery Grid 
* Copyright (c) 2008, Tony Tomov, tony@trirand.com 
* Dual licensed under the MIT or GPL licenses 
* http://www.opensource.org/licenses/mit-license.php 
* http://www.gnu.org/licenses/gpl-2.0.html 
* Date:2014-02-20 
* Modules: grid.base.js; jquery.fmatter.js; grid.custom.js; grid.common.js; grid.formedit.js; grid.filter.js; grid.inlinedit.js; grid.celledit.js; jqModal.js; jqDnR.js; grid.subgrid.js; grid.grouping.js; grid.treegrid.js; grid.pivot.js; grid.import.js; JsonXml.js; grid.tbltogrid.js; grid.jqueryui.js; 
*/
(function(b){b.jgrid=b.jgrid||{};b.extend(b.jgrid,{version:"4.6.0",htmlDecode:function(b){return b&&("&nbsp;"===b||"&#160;"===b||1===b.length&&160===b.charCodeAt(0))?"":b?String(b).replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,'"').replace(/&amp;/g,"&"):b},htmlEncode:function(b){return b?String(b).replace(/&/g,"&amp;").replace(/\"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):b},format:function(e){var f=b.makeArray(arguments).slice(1);null==e&&(e="");return e.replace(/\{(\d+)\}/g,
function(b,d){return f[d]})},msie:"Microsoft Internet Explorer"===navigator.appName,msiever:function(){var b=-1;null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&(b=parseFloat(RegExp.$1));return b},getCellIndex:function(e){e=b(e);if(e.is("tr"))return-1;e=(e.is("td")||e.is("th")?e:e.closest("td,th"))[0];return b.jgrid.msie?b.inArray(e,e.parentNode.cells):e.cellIndex},stripHtml:function(b){b=String(b);var f=/<("[^"]*"|'[^']*'|[^'">])*>/gi;return b?(b=b.replace(f,""))&&"&nbsp;"!==b&&"&#160;"!==
b?b.replace(/\"/g,"'"):"":b},stripPref:function(e,f){var c=b.type(e);if("string"===c||"number"===c)e=String(e),f=""!==e?String(f).replace(String(e),""):f;return f},parse:function(e){"while(1);"===e.substr(0,9)&&(e=e.substr(9));"/*"===e.substr(0,2)&&(e=e.substr(2,e.length-4));e||(e="{}");return!0===b.jgrid.useJSON&&"object"===typeof JSON&&"function"===typeof JSON.parse?JSON.parse(e):eval("("+e+")")},parseDate:function(e,f,c,d){var a=/^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/,l="string"===
typeof f?f.match(a):null,a=function(a,b){a=String(a);for(b=parseInt(b,10)||2;a.length<b;)a="0"+a;return a},g={m:1,d:1,y:1970,h:0,i:0,s:0,u:0},h=0,k,n,h=function(a,b){0===a?12===b&&(b=0):12!==b&&(b+=12);return b};void 0===d&&(d=b.jgrid.formatter.date);void 0===d.parseRe&&(d.parseRe=/[#%\\\/:_;.,\t\s-]/);d.masks.hasOwnProperty(e)&&(e=d.masks[e]);if(f&&null!=f)if(isNaN(f-0)||"u"!==String(e).toLowerCase())if(f.constructor===Date)h=f;else if(null!==l){if(h=new Date(parseInt(l[1],10)),l[3]){var m=60*Number(l[5])+
Number(l[6]),m=m*("-"===l[4]?1:-1),m=m-h.getTimezoneOffset();h.setTime(Number(Number(h)+6E4*m))}}else{m=0;"ISO8601Long"===d.srcformat&&"Z"===f.charAt(f.length-1)&&(m-=(new Date).getTimezoneOffset());f=String(f).replace(/\T/g,"#").replace(/\t/,"%").split(d.parseRe);e=e.replace(/\T/g,"#").replace(/\t/,"%").split(d.parseRe);k=0;for(n=e.length;k<n;k++)"M"===e[k]&&(l=b.inArray(f[k],d.monthNames),-1!==l&&12>l&&(f[k]=l+1,g.m=f[k])),"F"===e[k]&&(l=b.inArray(f[k],d.monthNames,12),-1!==l&&11<l&&(f[k]=l+1-12,
g.m=f[k])),"a"===e[k]&&(l=b.inArray(f[k],d.AmPm),-1!==l&&2>l&&f[k]===d.AmPm[l]&&(f[k]=l,g.h=h(f[k],g.h))),"A"===e[k]&&(l=b.inArray(f[k],d.AmPm),-1!==l&&1<l&&f[k]===d.AmPm[l]&&(f[k]=l-2,g.h=h(f[k],g.h))),"g"===e[k]&&(g.h=parseInt(f[k],10)),void 0!==f[k]&&(g[e[k].toLowerCase()]=parseInt(f[k],10));g.f&&(g.m=g.f);if(0===g.m&&0===g.y&&0===g.d)return"&#160;";g.m=parseInt(g.m,10)-1;h=g.y;70<=h&&99>=h?g.y=1900+g.y:0<=h&&69>=h&&(g.y=2E3+g.y);h=new Date(g.y,g.m,g.d,g.h,g.i,g.s,g.u);0<m&&h.setTime(Number(Number(h)+
6E4*m))}else h=new Date(1E3*parseFloat(f));else h=new Date(g.y,g.m,g.d,g.h,g.i,g.s,g.u);if(void 0===c)return h;d.masks.hasOwnProperty(c)?c=d.masks[c]:c||(c="Y-m-d");e=h.getHours();f=h.getMinutes();g=h.getDate();m=h.getMonth()+1;l=h.getTimezoneOffset();k=h.getSeconds();n=h.getMilliseconds();var r=h.getDay(),p=h.getFullYear(),q=(r+6)%7+1,x=(new Date(p,m-1,g)-new Date(p,0,1))/864E5,G={d:a(g),D:d.dayNames[r],j:g,l:d.dayNames[r+7],N:q,S:d.S(g),w:r,z:x,W:5>q?Math.floor((x+q-1)/7)+1:Math.floor((x+q-1)/7)||
(4>((new Date(p-1,0,1)).getDay()+6)%7?53:52),F:d.monthNames[m-1+12],m:a(m),M:d.monthNames[m-1],n:m,t:"?",L:"?",o:"?",Y:p,y:String(p).substring(2),a:12>e?d.AmPm[0]:d.AmPm[1],A:12>e?d.AmPm[2]:d.AmPm[3],B:"?",g:e%12||12,G:e,h:a(e%12||12),H:a(e),i:a(f),s:a(k),u:n,e:"?",I:"?",O:(0<l?"-":"+")+a(100*Math.floor(Math.abs(l)/60)+Math.abs(l)%60,4),P:"?",T:(String(h).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g)||
[""]).pop().replace(/[^-+\dA-Z]/g,""),Z:"?",c:"?",r:"?",U:Math.floor(h/1E3)};return c.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,function(a){return G.hasOwnProperty(a)?G[a]:a.substring(1)})},jqID:function(b){return String(b).replace(/[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g,"\\$&")},guid:1,uidPref:"jqg",randId:function(e){return(e||b.jgrid.uidPref)+b.jgrid.guid++},getAccessor:function(b,f){var c,d,a=[],l;if("function"===typeof f)return f(b);c=b[f];if(void 0===c)try{if("string"===typeof f&&
(a=f.split(".")),l=a.length)for(c=b;c&&l--;)d=a.shift(),c=c[d]}catch(g){}return c},getXmlData:function(e,f,c){var d="string"===typeof f?f.match(/^(.*)\[(\w+)\]$/):null;if("function"===typeof f)return f(e);if(d&&d[2])return d[1]?b(d[1],e).attr(d[2]):b(e).attr(d[2]);e=b(f,e);return c?e:0<e.length?b(e).text():void 0},cellWidth:function(){var e=b("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;display:block;'></td></tr></table></div>"),
f=e.appendTo("body").find("td").width();e.remove();return 0.1<Math.abs(f-5)},cell_width:!0,ajaxOptions:{},from:function(e){return new function(e,c){"string"===typeof e&&(e=b.data(e));var d=this,a=e,l=!0,g=!1,h=c,k=/[\$,%]/g,n=null,m=null,r=0,p=!1,q="",x=[],G=!0;if("object"===typeof e&&e.push)0<e.length&&(G="object"!==typeof e[0]?!1:!0);else throw"data provides is not an array";this._hasData=function(){return null===a?!1:0===a.length?!1:!0};this._getStr=function(a){var b=[];g&&b.push("jQuery.trim(");
b.push("String("+a+")");g&&b.push(")");l||b.push(".toLowerCase()");return b.join("")};this._strComp=function(a){return"string"===typeof a?".toString()":""};this._group=function(a,b){return{field:a.toString(),unique:b,items:[]}};this._toStr=function(a){g&&(a=b.trim(a));a=a.toString().replace(/\\/g,"\\\\").replace(/\"/g,'\\"');return l?a:a.toLowerCase()};this._funcLoop=function(d){var l=[];b.each(a,function(a,b){l.push(d(b))});return l};this._append=function(a){var b;h=null===h?"":h+(""===q?" && ":
q);for(b=0;b<r;b++)h+="(";p&&(h+="!");h+="("+a+")";p=!1;q="";r=0};this._setCommand=function(a,b){n=a;m=b};this._resetNegate=function(){p=!1};this._repeatCommand=function(a,b){return null===n?d:null!==a&&null!==b?n(a,b):null!==m&&G?n(m,a):n(a)};this._equals=function(a,b){return 0===d._compare(a,b,1)};this._compare=function(a,b,d){var e=Object.prototype.toString;void 0===d&&(d=1);void 0===a&&(a=null);void 0===b&&(b=null);if(null===a&&null===b)return 0;if(null===a&&null!==b)return 1;if(null!==a&&null===
b)return-1;if("[object Date]"===e.call(a)&&"[object Date]"===e.call(b))return a<b?-d:a>b?d:0;l||"number"===typeof a||"number"===typeof b||(a=String(a),b=String(b));return a<b?-d:a>b?d:0};this._performSort=function(){0!==x.length&&(a=d._doSort(a,0))};this._doSort=function(a,b){var l=x[b].by,e=x[b].dir,g=x[b].type,c=x[b].datefmt,f=x[b].sfunc;if(b===x.length-1)return d._getOrder(a,l,e,g,c,f);b++;l=d._getGroup(a,l,e,g,c);e=[];for(g=0;g<l.length;g++)for(f=d._doSort(l[g].items,b),c=0;c<f.length;c++)e.push(f[c]);
return e};this._getOrder=function(a,e,g,c,f,h){var m=[],n=[],r="a"===g?1:-1,p,x;void 0===c&&(c="text");x="float"===c||"number"===c||"currency"===c||"numeric"===c?function(a){a=parseFloat(String(a).replace(k,""));return isNaN(a)?0:a}:"int"===c||"integer"===c?function(a){return a?parseFloat(String(a).replace(k,"")):0}:"date"===c||"datetime"===c?function(a){return b.jgrid.parseDate(f,a).getTime()}:b.isFunction(c)?c:function(a){a=a?b.trim(String(a)):"";return l?a:a.toLowerCase()};b.each(a,function(a,
d){p=""!==e?b.jgrid.getAccessor(d,e):d;void 0===p&&(p="");p=x(p,d);n.push({vSort:p,index:a})});b.isFunction(h)?n.sort(function(a,b){a=a.vSort;b=b.vSort;return h.call(this,a,b,r)}):n.sort(function(a,b){a=a.vSort;b=b.vSort;return d._compare(a,b,r)});c=0;for(var q=a.length;c<q;)g=n[c].index,m.push(a[g]),c++;return m};this._getGroup=function(a,c,e,l,g){var f=[],h=null,k=null,m;b.each(d._getOrder(a,c,e,l,g),function(a,e){m=b.jgrid.getAccessor(e,c);null==m&&(m="");d._equals(k,m)||(k=m,null!==h&&f.push(h),
h=d._group(c,m));h.items.push(e)});null!==h&&f.push(h);return f};this.ignoreCase=function(){l=!1;return d};this.useCase=function(){l=!0;return d};this.trim=function(){g=!0;return d};this.noTrim=function(){g=!1;return d};this.execute=function(){var c=h,e=[];if(null===c)return d;b.each(a,function(){eval(c)&&e.push(this)});a=e;return d};this.data=function(){return a};this.select=function(c){d._performSort();if(!d._hasData())return[];d.execute();if(b.isFunction(c)){var e=[];b.each(a,function(a,b){e.push(c(b))});
return e}return a};this.hasMatch=function(){if(!d._hasData())return!1;d.execute();return 0<a.length};this.andNot=function(a,b,c){p=!p;return d.and(a,b,c)};this.orNot=function(a,b,c){p=!p;return d.or(a,b,c)};this.not=function(a,b,c){return d.andNot(a,b,c)};this.and=function(a,b,c){q=" && ";return void 0===a?d:d._repeatCommand(a,b,c)};this.or=function(a,b,c){q=" || ";return void 0===a?d:d._repeatCommand(a,b,c)};this.orBegin=function(){r++;return d};this.orEnd=function(){null!==h&&(h+=")");return d};
this.isNot=function(a){p=!p;return d.is(a)};this.is=function(a){d._append("this."+a);d._resetNegate();return d};this._compareValues=function(a,c,e,l,g){var f;f=G?"jQuery.jgrid.getAccessor(this,'"+c+"')":"this";void 0===e&&(e=null);var h=e,m=void 0===g.stype?"text":g.stype;if(null!==e)switch(m){case "int":case "integer":h=isNaN(Number(h))||""===h?"0":h;f="parseInt("+f+",10)";h="parseInt("+h+",10)";break;case "float":case "number":case "numeric":h=String(h).replace(k,"");h=isNaN(Number(h))||""===h?
"0":h;f="parseFloat("+f+")";h="parseFloat("+h+")";break;case "date":case "datetime":h=String(b.jgrid.parseDate(g.newfmt||"Y-m-d",h).getTime());f='jQuery.jgrid.parseDate("'+g.srcfmt+'",'+f+").getTime()";break;default:f=d._getStr(f),h=d._getStr('"'+d._toStr(h)+'"')}d._append(f+" "+l+" "+h);d._setCommand(a,c);d._resetNegate();return d};this.equals=function(a,b,c){return d._compareValues(d.equals,a,b,"==",c)};this.notEquals=function(a,b,c){return d._compareValues(d.equals,a,b,"!==",c)};this.isNull=function(a,
b,c){return d._compareValues(d.equals,a,null,"===",c)};this.greater=function(a,b,c){return d._compareValues(d.greater,a,b,">",c)};this.less=function(a,b,c){return d._compareValues(d.less,a,b,"<",c)};this.greaterOrEquals=function(a,b,c){return d._compareValues(d.greaterOrEquals,a,b,">=",c)};this.lessOrEquals=function(a,b,c){return d._compareValues(d.lessOrEquals,a,b,"<=",c)};this.startsWith=function(a,c){var e=null==c?a:c,e=g?b.trim(e.toString()).length:e.toString().length;G?d._append(d._getStr("jQuery.jgrid.getAccessor(this,'"+
a+"')")+".substr(0,"+e+") == "+d._getStr('"'+d._toStr(c)+'"')):(null!=c&&(e=g?b.trim(c.toString()).length:c.toString().length),d._append(d._getStr("this")+".substr(0,"+e+") == "+d._getStr('"'+d._toStr(a)+'"')));d._setCommand(d.startsWith,a);d._resetNegate();return d};this.endsWith=function(a,c){var e=null==c?a:c,e=g?b.trim(e.toString()).length:e.toString().length;G?d._append(d._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+".substr("+d._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+".length-"+
e+","+e+') == "'+d._toStr(c)+'"'):d._append(d._getStr("this")+".substr("+d._getStr("this")+'.length-"'+d._toStr(a)+'".length,"'+d._toStr(a)+'".length) == "'+d._toStr(a)+'"');d._setCommand(d.endsWith,a);d._resetNegate();return d};this.contains=function(a,b){G?d._append(d._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+'.indexOf("'+d._toStr(b)+'",0) > -1'):d._append(d._getStr("this")+'.indexOf("'+d._toStr(a)+'",0) > -1');d._setCommand(d.contains,a);d._resetNegate();return d};this.groupBy=function(b,
c,e,l){return d._hasData()?d._getGroup(a,b,c,e,l):null};this.orderBy=function(a,c,e,l,g){c=null==c?"a":b.trim(c.toString().toLowerCase());null==e&&(e="text");null==l&&(l="Y-m-d");null==g&&(g=!1);if("desc"===c||"descending"===c)c="d";if("asc"===c||"ascending"===c)c="a";x.push({by:a,dir:c,type:e,datefmt:l,sfunc:g});return d};return d}(e,null)},getMethod:function(e){return this.getAccessor(b.fn.jqGrid,e)},extend:function(e){b.extend(b.fn.jqGrid,e);this.no_legacy_api||b.fn.extend(e)}});b.fn.jqGrid=function(e){if("string"===
typeof e){var f=b.jgrid.getMethod(e);if(!f)throw"jqGrid - No such method: "+e;var c=b.makeArray(arguments).slice(1);return f.apply(this,c)}return this.each(function(){if(!this.grid){var d=b.extend(!0,{url:"",height:150,page:1,rowNum:20,rowTotal:null,records:0,pager:"",pgbuttons:!0,pginput:!0,colModel:[],rowList:[],colNames:[],sortorder:"asc",sortname:"",datatype:"xml",mtype:"GET",altRows:!1,selarrrow:[],savedRow:[],shrinkToFit:!0,xmlReader:{},jsonReader:{},subGrid:!1,subGridModel:[],reccount:0,lastpage:0,
lastsort:0,selrow:null,beforeSelectRow:null,onSelectRow:null,onSortCol:null,ondblClickRow:null,onRightClickRow:null,onPaging:null,onSelectAll:null,onInitGrid:null,loadComplete:null,gridComplete:null,loadError:null,loadBeforeSend:null,afterInsertRow:null,beforeRequest:null,beforeProcessing:null,onHeaderClick:null,viewrecords:!1,loadonce:!1,multiselect:!1,multikey:!1,editurl:null,search:!1,caption:"",hidegrid:!0,hiddengrid:!1,postData:{},userData:{},treeGrid:!1,treeGridModel:"nested",treeReader:{},
treeANode:-1,ExpandColumn:null,tree_root_level:0,prmNames:{page:"page",rows:"rows",sort:"sidx",order:"sord",search:"_search",nd:"nd",id:"id",oper:"oper",editoper:"edit",addoper:"add",deloper:"del",subgridid:"id",npage:null,totalrows:"totalrows"},forceFit:!1,gridstate:"visible",cellEdit:!1,cellsubmit:"remote",nv:0,loadui:"enable",toolbar:[!1,""],scroll:!1,multiboxonly:!1,deselectAfterSort:!0,scrollrows:!1,autowidth:!1,scrollOffset:18,cellLayout:5,subGridWidth:20,multiselectWidth:20,gridview:!1,rownumWidth:25,
rownumbers:!1,pagerpos:"center",recordpos:"right",footerrow:!1,userDataOnFooter:!1,hoverrows:!0,altclass:"ui-priority-secondary",viewsortcols:[!1,"vertical",!0],resizeclass:"",autoencode:!1,remapColumns:[],ajaxGridOptions:{},direction:"ltr",toppager:!1,headertitles:!1,scrollTimeout:40,data:[],_index:{},grouping:!1,groupingView:{groupField:[],groupOrder:[],groupText:[],groupColumnShow:[],groupSummary:[],showSummaryOnHide:!1,sortitems:[],sortnames:[],summary:[],summaryval:[],plusicon:"ui-icon-circlesmall-plus",
minusicon:"ui-icon-circlesmall-minus",displayField:[],groupSummaryPos:[],formatDisplayField:[],_locgr:!1},ignoreCase:!1,cmTemplate:{},idPrefix:"",multiSort:!1},b.jgrid.defaults,e||{}),a=this,c={headers:[],cols:[],footers:[],dragStart:function(c,e,g){var f=b(this.bDiv).offset().left;this.resizing={idx:c,startX:e.clientX,sOL:e.clientX-f};this.hDiv.style.cursor="col-resize";this.curGbox=b("#rs_m"+b.jgrid.jqID(d.id),"#gbox_"+b.jgrid.jqID(d.id));this.curGbox.css({display:"block",left:e.clientX-f,top:g[1],
height:g[2]});b(a).triggerHandler("jqGridResizeStart",[e,c]);b.isFunction(d.resizeStart)&&d.resizeStart.call(a,e,c);document.onselectstart=function(){return!1}},dragMove:function(a){if(this.resizing){var b=a.clientX-this.resizing.startX;a=this.headers[this.resizing.idx];var c="ltr"===d.direction?a.width+b:a.width-b,e;33<c&&(this.curGbox.css({left:this.resizing.sOL+b}),!0===d.forceFit?(e=this.headers[this.resizing.idx+d.nv],b="ltr"===d.direction?e.width-b:e.width+b,33<b&&(a.newWidth=c,e.newWidth=b)):
(this.newWidth="ltr"===d.direction?d.tblwidth+b:d.tblwidth-b,a.newWidth=c))}},dragEnd:function(){this.hDiv.style.cursor="default";if(this.resizing){var c=this.resizing.idx,e=this.headers[c].newWidth||this.headers[c].width,e=parseInt(e,10);this.resizing=!1;b("#rs_m"+b.jgrid.jqID(d.id)).css("display","none");d.colModel[c].width=e;this.headers[c].width=e;this.headers[c].el.style.width=e+"px";this.cols[c].style.width=e+"px";0<this.footers.length&&(this.footers[c].style.width=e+"px");!0===d.forceFit?(e=
this.headers[c+d.nv].newWidth||this.headers[c+d.nv].width,this.headers[c+d.nv].width=e,this.headers[c+d.nv].el.style.width=e+"px",this.cols[c+d.nv].style.width=e+"px",0<this.footers.length&&(this.footers[c+d.nv].style.width=e+"px"),d.colModel[c+d.nv].width=e):(d.tblwidth=this.newWidth||d.tblwidth,b("table:first",this.bDiv).css("width",d.tblwidth+"px"),b("table:first",this.hDiv).css("width",d.tblwidth+"px"),this.hDiv.scrollLeft=this.bDiv.scrollLeft,d.footerrow&&(b("table:first",this.sDiv).css("width",
d.tblwidth+"px"),this.sDiv.scrollLeft=this.bDiv.scrollLeft));b(a).triggerHandler("jqGridResizeStop",[e,c]);b.isFunction(d.resizeStop)&&d.resizeStop.call(a,e,c)}this.curGbox=null;document.onselectstart=function(){return!0}},populateVisible:function(){c.timer&&clearTimeout(c.timer);c.timer=null;var a=b(c.bDiv).height();if(a){var e=b("table:first",c.bDiv),g,f;if(e[0].rows.length)try{f=(g=e[0].rows[1])?b(g).outerHeight()||c.prevRowHeight:c.prevRowHeight}catch(pa){f=c.prevRowHeight}if(f){c.prevRowHeight=
f;var h=d.rowNum;g=c.scrollTop=c.bDiv.scrollTop;var k=Math.round(e.position().top)-g,m=k+e.height();f*=h;var E,n,C;m<a&&0>=k&&(void 0===d.lastpage||parseInt((m+g+f-1)/f,10)<=d.lastpage)&&(n=parseInt((a-m+f-1)/f,10),0<=m||2>n||!0===d.scroll?(E=Math.round((m+g)/f)+1,k=-1):k=1);0<k&&(E=parseInt(g/f,10)+1,n=parseInt((g+a)/f,10)+2-E,C=!0);!n||d.lastpage&&(E>d.lastpage||1===d.lastpage||E===d.page&&E===d.lastpage)||(c.hDiv.loading?c.timer=setTimeout(c.populateVisible,d.scrollTimeout):(d.page=E,C&&(c.selectionPreserver(e[0]),
c.emptyRows.call(e[0],!1,!1)),c.populate(n)))}}},scrollGrid:function(a){if(d.scroll){var b=c.bDiv.scrollTop;void 0===c.scrollTop&&(c.scrollTop=0);b!==c.scrollTop&&(c.scrollTop=b,c.timer&&clearTimeout(c.timer),c.timer=setTimeout(c.populateVisible,d.scrollTimeout))}c.hDiv.scrollLeft=c.bDiv.scrollLeft;d.footerrow&&(c.sDiv.scrollLeft=c.bDiv.scrollLeft);a&&a.stopPropagation()},selectionPreserver:function(a){var c=a.p,d=c.selrow,e=c.selarrrow?b.makeArray(c.selarrrow):null,f=a.grid.bDiv.scrollLeft,g=function(){var h;
c.selrow=null;c.selarrrow=[];if(c.multiselect&&e&&0<e.length)for(h=0;h<e.length;h++)e[h]!==d&&b(a).jqGrid("setSelection",e[h],!1,null);d&&b(a).jqGrid("setSelection",d,!1,null);a.grid.bDiv.scrollLeft=f;b(a).unbind(".selectionPreserver",g)};b(a).bind("jqGridGridComplete.selectionPreserver",g)}};if("TABLE"!==this.tagName.toUpperCase())alert("Element is not a table");else if(void 0!==document.documentMode&&5>=document.documentMode)alert("Grid can not be used in this ('quirks') mode!");else{b(this).empty().attr("tabindex",
"0");this.p=d;this.p.useProp=!!b.fn.prop;var g,f;if(0===this.p.colNames.length)for(g=0;g<this.p.colModel.length;g++)this.p.colNames[g]=this.p.colModel[g].label||this.p.colModel[g].name;if(this.p.colNames.length!==this.p.colModel.length)alert(b.jgrid.errors.model);else{var k=b("<div class='ui-jqgrid-view'></div>"),n=b.jgrid.msie;a.p.direction=b.trim(a.p.direction.toLowerCase());-1===b.inArray(a.p.direction,["ltr","rtl"])&&(a.p.direction="ltr");f=a.p.direction;b(k).insertBefore(this);b(this).removeClass("scroll").appendTo(k);
var m=b("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");b(m).attr({id:"gbox_"+this.id,dir:f}).insertBefore(k);b(k).attr("id","gview_"+this.id).appendTo(m);b("<div class='ui-widget-overlay jqgrid-overlay' id='lui_"+this.id+"'></div>").insertBefore(k);b("<div class='loading ui-state-default ui-state-active' id='load_"+this.id+"'>"+this.p.loadtext+"</div>").insertBefore(k);b(this).attr({cellspacing:"0",cellpadding:"0",border:"0",role:"grid","aria-multiselectable":!!this.p.multiselect,
"aria-labelledby":"gbox_"+this.id});var r=function(a,b){a=parseInt(a,10);return isNaN(a)?b||0:a},p=function(d,e,f,g,pa,h){var k=a.p.colModel[d],m=k.align,E='style="',n=k.classes,C=k.name,A=[];m&&(E+="text-align:"+m+";");!0===k.hidden&&(E+="display:none;");if(0===e)E+="width: "+c.headers[d].width+"px;";else if(k.cellattr&&b.isFunction(k.cellattr)&&(d=k.cellattr.call(a,pa,f,g,k,h))&&"string"===typeof d)if(d=d.replace(/style/i,"style").replace(/title/i,"title"),-1<d.indexOf("title")&&(k.title=!1),-1<
d.indexOf("class")&&(n=void 0),A=d.replace("-style","-sti").split(/style/),2===A.length){A[1]=b.trim(A[1].replace("-sti","-style").replace("=",""));if(0===A[1].indexOf("'")||0===A[1].indexOf('"'))A[1]=A[1].substring(1);E+=A[1].replace(/'/gi,'"')}else E+='"';A.length||(A[0]="",E+='"');E+=(void 0!==n?' class="'+n+'"':"")+(k.title&&f?' title="'+b.jgrid.stripHtml(f)+'"':"");E+=' aria-describedby="'+a.p.id+"_"+C+'"';return E+A[0]},q=function(c){return null==c||""===c?"&#160;":a.p.autoencode?b.jgrid.htmlEncode(c):
String(c)},x=function(c,d,e,f,g){var h=a.p.colModel[e];void 0!==h.formatter?(c=""!==String(a.p.idPrefix)?b.jgrid.stripPref(a.p.idPrefix,c):c,c={rowId:c,colModel:h,gid:a.p.id,pos:e},d=b.isFunction(h.formatter)?h.formatter.call(a,d,c,f,g):b.fmatter?b.fn.fmatter.call(a,h.formatter,d,c,f,g):q(d)):d=q(d);return d},G=function(a,b,c,d,e,f){b=x(a,b,c,e,"add");return'<td role="gridcell" '+p(c,d,b,e,a,f)+">"+b+"</td>"},U=function(b,c,d,e){e='<input role="checkbox" type="checkbox" id="jqg_'+a.p.id+"_"+b+'" class="cbox" name="jqg_'+
a.p.id+"_"+b+'"'+(e?'checked="checked"':"")+"/>";return'<td role="gridcell" '+p(c,d,"",null,b,!0)+">"+e+"</td>"},M=function(a,b,c,d){c=(parseInt(c,10)-1)*parseInt(d,10)+1+b;return'<td role="gridcell" class="ui-state-default jqgrid-rownum" '+p(a,b,c,null,b,!0)+">"+c+"</td>"},ea=function(b){var c,d=[],e=0,f;for(f=0;f<a.p.colModel.length;f++)c=a.p.colModel[f],"cb"!==c.name&&"subgrid"!==c.name&&"rn"!==c.name&&(d[e]="local"===b?c.name:"xml"===b||"xmlstring"===b?c.xmlmap||c.name:c.jsonmap||c.name,!1!==
a.p.keyIndex&&!0===c.key&&(a.p.keyName=d[e]),e++);return d},W=function(c){var d=a.p.remapColumns;d&&d.length||(d=b.map(a.p.colModel,function(a,b){return b}));c&&(d=b.map(d,function(a){return a<c?null:a-c}));return d},X=function(a,c){var d;this.p.deepempty?b(this.rows).slice(1).remove():(d=0<this.rows.length?this.rows[0]:null,b(this.firstChild).empty().append(d));a&&this.p.scroll&&(b(this.grid.bDiv.firstChild).css({height:"auto"}),b(this.grid.bDiv.firstChild.firstChild).css({height:0,display:"none"}),
0!==this.grid.bDiv.scrollTop&&(this.grid.bDiv.scrollTop=0));!0===c&&this.p.treeGrid&&(this.p.data=[],this.p._index={})},O=function(){var c=a.p.data.length,d,e,f;d=!0===a.p.rownumbers?1:0;e=!0===a.p.multiselect?1:0;f=!0===a.p.subGrid?1:0;d=!1===a.p.keyIndex||!0===a.p.loadonce?a.p.localReader.id:a.p.colModel[a.p.keyIndex+e+f+d].name;for(e=0;e<c;e++)f=b.jgrid.getAccessor(a.p.data[e],d),void 0===f&&(f=String(e+1)),a.p._index[f]=e},$=function(c,d,e,f,g,h){var l="-1",k="",m;d=d?"display:none;":"";e="ui-widget-content jqgrow ui-row-"+
a.p.direction+(e?" "+e:"")+(h?" ui-state-highlight":"");h=b(a).triggerHandler("jqGridRowAttr",[f,g,c]);"object"!==typeof h&&(h=b.isFunction(a.p.rowattr)?a.p.rowattr.call(a,f,g,c):{});if(!b.isEmptyObject(h)){h.hasOwnProperty("id")&&(c=h.id,delete h.id);h.hasOwnProperty("tabindex")&&(l=h.tabindex,delete h.tabindex);h.hasOwnProperty("style")&&(d+=h.style,delete h.style);h.hasOwnProperty("class")&&(e+=" "+h["class"],delete h["class"]);try{delete h.role}catch(n){}for(m in h)h.hasOwnProperty(m)&&(k+=" "+
m+"="+h[m])}return'<tr role="row" id="'+c+'" tabindex="'+l+'" class="'+e+'"'+(""===d?"":' style="'+d+'"')+k+">"},K=function(c,d,e,f,g){var h=new Date,l="local"!==a.p.datatype&&a.p.loadonce||"xmlstring"===a.p.datatype,k=a.p.xmlReader,m="local"===a.p.datatype?"local":"xml";l&&(a.p.data=[],a.p._index={},a.p.localReader.id="_id_");a.p.reccount=0;if(b.isXMLDoc(c)){-1!==a.p.treeANode||a.p.scroll?e=1<e?e:1:(X.call(a,!1,!0),e=1);var n=b(a),C,A,R=0,p,u=!0===a.p.multiselect?1:0,z=0,x,q=!0===a.p.rownumbers?
1:0,t,Z=[],aa,v={},w,H,s=[],L=!0===a.p.altRows?a.p.altclass:"",ia;!0===a.p.subGrid&&(z=1,x=b.jgrid.getMethod("addSubGridCell"));k.repeatitems||(Z=ea(m));t=!1===a.p.keyIndex?b.isFunction(k.id)?k.id.call(a,c):k.id:a.p.keyIndex;0<Z.length&&!isNaN(t)&&(t=a.p.keyName);m=-1===String(t).indexOf("[")?Z.length?function(a,c){return b(t,a).text()||c}:function(a,c){return b(k.cell,a).eq(t).text()||c}:function(a,b){return a.getAttribute(t.replace(/[\[\]]/g,""))||b};a.p.userData={};a.p.page=r(b.jgrid.getXmlData(c,
k.page),a.p.page);a.p.lastpage=r(b.jgrid.getXmlData(c,k.total),1);a.p.records=r(b.jgrid.getXmlData(c,k.records));b.isFunction(k.userdata)?a.p.userData=k.userdata.call(a,c)||{}:b.jgrid.getXmlData(c,k.userdata,!0).each(function(){a.p.userData[this.getAttribute("name")]=b(this).text()});c=b.jgrid.getXmlData(c,k.root,!0);(c=b.jgrid.getXmlData(c,k.row,!0))||(c=[]);var S=c.length,I=0,y=[],D=parseInt(a.p.rowNum,10),B=a.p.scroll?b.jgrid.randId():1;0<S&&0>=a.p.page&&(a.p.page=1);if(c&&S){g&&(D*=g+1);g=b.isFunction(a.p.afterInsertRow);
var F=!1,J;a.p.grouping&&(F=!0===a.p.groupingView.groupCollapse,J=b.jgrid.getMethod("groupingPrepare"));for(;I<S;){w=c[I];H=m(w,B+I);H=a.p.idPrefix+H;C=0===e?0:e+1;ia=1===(C+I)%2?L:"";var K=s.length;s.push("");q&&s.push(M(0,I,a.p.page,a.p.rowNum));u&&s.push(U(H,q,I,!1));z&&s.push(x.call(n,u+q,I+e));if(k.repeatitems){aa||(aa=W(u+z+q));var N=b.jgrid.getXmlData(w,k.cell,!0);b.each(aa,function(b){var c=N[this];if(!c)return!1;p=c.textContent||c.text;v[a.p.colModel[b+u+z+q].name]=p;s.push(G(H,p,b+u+z+q,
I+e,w,v))})}else for(C=0;C<Z.length;C++)p=b.jgrid.getXmlData(w,Z[C]),v[a.p.colModel[C+u+z+q].name]=p,s.push(G(H,p,C+u+z+q,I+e,w,v));s[K]=$(H,F,ia,v,w,!1);s.push("</tr>");a.p.grouping&&(y.push(s),a.p.groupingView._locgr||J.call(n,v,I),s=[]);if(l||!0===a.p.treeGrid)v._id_=b.jgrid.stripPref(a.p.idPrefix,H),a.p.data.push(v),a.p._index[v._id_]=a.p.data.length-1;!1===a.p.gridview&&(b("tbody:first",d).append(s.join("")),n.triggerHandler("jqGridAfterInsertRow",[H,v,w]),g&&a.p.afterInsertRow.call(a,H,v,w),
s=[]);v={};R++;I++;if(R===D)break}}!0===a.p.gridview&&(A=-1<a.p.treeANode?a.p.treeANode:0,a.p.grouping?(l||n.jqGrid("groupingRender",y,a.p.colModel.length,a.p.page,D),y=null):!0===a.p.treeGrid&&0<A?b(a.rows[A]).after(s.join("")):b("tbody:first",d).append(s.join("")));if(!0===a.p.subGrid)try{n.jqGrid("addSubGrid",u+q)}catch(Q){}a.p.totaltime=new Date-h;0<R&&0===a.p.records&&(a.p.records=S);s=null;if(!0===a.p.treeGrid)try{n.jqGrid("setTreeNode",A+1,R+A+1)}catch(O){}a.p.treeGrid||a.p.scroll||(a.grid.bDiv.scrollTop=
0);a.p.reccount=R;a.p.treeANode=-1;a.p.userDataOnFooter&&n.jqGrid("footerData","set",a.p.userData,!0);l&&(a.p.records=S,a.p.lastpage=Math.ceil(S/D));f||a.updatepager(!1,!0);if(l){for(;R<S;){w=c[R];H=m(w,R+B);H=a.p.idPrefix+H;if(k.repeatitems){aa||(aa=W(u+z+q));var P=b.jgrid.getXmlData(w,k.cell,!0);b.each(aa,function(b){var c=P[this];if(!c)return!1;p=c.textContent||c.text;v[a.p.colModel[b+u+z+q].name]=p})}else for(C=0;C<Z.length;C++)p=b.jgrid.getXmlData(w,Z[C]),v[a.p.colModel[C+u+z+q].name]=p;v._id_=
b.jgrid.stripPref(a.p.idPrefix,H);a.p.grouping&&J.call(n,v,R);a.p.data.push(v);a.p._index[v._id_]=a.p.data.length-1;v={};R++}a.p.grouping&&(a.p.groupingView._locgr=!0,n.jqGrid("groupingRender",y,a.p.colModel.length,a.p.page,D),y=null)}}},Y=function(c,d,e,f,g){var h=new Date;if(c){-1!==a.p.treeANode||a.p.scroll?e=1<e?e:1:(X.call(a,!1,!0),e=1);var k,l="local"!==a.p.datatype&&a.p.loadonce||"jsonstring"===a.p.datatype;l&&(a.p.data=[],a.p._index={},a.p.localReader.id="_id_");a.p.reccount=0;"local"===a.p.datatype?
(d=a.p.localReader,k="local"):(d=a.p.jsonReader,k="json");var m=b(a),n=0,C,A,p,q=[],u=a.p.multiselect?1:0,z=!0===a.p.subGrid?1:0,x,t=!0===a.p.rownumbers?1:0,D=W(u+z+t);k=ea(k);var y,B,v,w={},H,s,L=[],ia=!0===a.p.altRows?a.p.altclass:"",S;a.p.page=r(b.jgrid.getAccessor(c,d.page),a.p.page);a.p.lastpage=r(b.jgrid.getAccessor(c,d.total),1);a.p.records=r(b.jgrid.getAccessor(c,d.records));a.p.userData=b.jgrid.getAccessor(c,d.userdata)||{};z&&(x=b.jgrid.getMethod("addSubGridCell"));v=!1===a.p.keyIndex?b.isFunction(d.id)?
d.id.call(a,c):d.id:a.p.keyIndex;d.repeatitems||(q=k,0<q.length&&!isNaN(v)&&(v=a.p.keyName));B=b.jgrid.getAccessor(c,d.root);null==B&&b.isArray(c)&&(B=c);B||(B=[]);c=B.length;A=0;0<c&&0>=a.p.page&&(a.p.page=1);var I=parseInt(a.p.rowNum,10),F=a.p.scroll?b.jgrid.randId():1,J=!1,K;g&&(I*=g+1);"local"!==a.p.datatype||a.p.deselectAfterSort||(J=!0);var N=b.isFunction(a.p.afterInsertRow),P=[],Q=!1,O;a.p.grouping&&(Q=!0===a.p.groupingView.groupCollapse,O=b.jgrid.getMethod("groupingPrepare"));for(;A<c;){g=
B[A];s=b.jgrid.getAccessor(g,v);void 0===s&&("number"===typeof v&&null!=a.p.colModel[v+u+z+t]&&(s=b.jgrid.getAccessor(g,a.p.colModel[v+u+z+t].name)),void 0===s&&(s=F+A,0===q.length&&d.cell&&(C=b.jgrid.getAccessor(g,d.cell)||g,s=null!=C&&void 0!==C[v]?C[v]:s)));s=a.p.idPrefix+s;C=1===e?0:e;S=1===(C+A)%2?ia:"";J&&(K=a.p.multiselect?-1!==b.inArray(s,a.p.selarrrow):s===a.p.selrow);var T=L.length;L.push("");t&&L.push(M(0,A,a.p.page,a.p.rowNum));u&&L.push(U(s,t,A,K));z&&L.push(x.call(m,u+t,A+e));y=k;d.repeatitems&&
(d.cell&&(g=b.jgrid.getAccessor(g,d.cell)||g),b.isArray(g)&&(y=D));for(p=0;p<y.length;p++)C=b.jgrid.getAccessor(g,y[p]),w[a.p.colModel[p+u+z+t].name]=C,L.push(G(s,C,p+u+z+t,A+e,g,w));L[T]=$(s,Q,S,w,g,K);L.push("</tr>");a.p.grouping&&(P.push(L),a.p.groupingView._locgr||O.call(m,w,A),L=[]);if(l||!0===a.p.treeGrid)w._id_=b.jgrid.stripPref(a.p.idPrefix,s),a.p.data.push(w),a.p._index[w._id_]=a.p.data.length-1;!1===a.p.gridview&&(b("#"+b.jgrid.jqID(a.p.id)+" tbody:first").append(L.join("")),m.triggerHandler("jqGridAfterInsertRow",
[s,w,g]),N&&a.p.afterInsertRow.call(a,s,w,g),L=[]);w={};n++;A++;if(n===I)break}!0===a.p.gridview&&(H=-1<a.p.treeANode?a.p.treeANode:0,a.p.grouping?l||(m.jqGrid("groupingRender",P,a.p.colModel.length,a.p.page,I),P=null):!0===a.p.treeGrid&&0<H?b(a.rows[H]).after(L.join("")):b("#"+b.jgrid.jqID(a.p.id)+" tbody:first").append(L.join("")));if(!0===a.p.subGrid)try{m.jqGrid("addSubGrid",u+t)}catch(V){}a.p.totaltime=new Date-h;0<n&&0===a.p.records&&(a.p.records=c);if(!0===a.p.treeGrid)try{m.jqGrid("setTreeNode",
H+1,n+H+1)}catch(Y){}a.p.treeGrid||a.p.scroll||(a.grid.bDiv.scrollTop=0);a.p.reccount=n;a.p.treeANode=-1;a.p.userDataOnFooter&&m.jqGrid("footerData","set",a.p.userData,!0);l&&(a.p.records=c,a.p.lastpage=Math.ceil(c/I));f||a.updatepager(!1,!0);if(l){for(;n<c&&B[n];){g=B[n];s=b.jgrid.getAccessor(g,v);void 0===s&&("number"===typeof v&&null!=a.p.colModel[v+u+z+t]&&(s=b.jgrid.getAccessor(g,a.p.colModel[v+u+z+t].name)),void 0===s&&(s=F+n,0===q.length&&d.cell&&(e=b.jgrid.getAccessor(g,d.cell)||g,s=null!=
e&&void 0!==e[v]?e[v]:s)));if(g){s=a.p.idPrefix+s;y=k;d.repeatitems&&(d.cell&&(g=b.jgrid.getAccessor(g,d.cell)||g),b.isArray(g)&&(y=D));for(p=0;p<y.length;p++)w[a.p.colModel[p+u+z+t].name]=b.jgrid.getAccessor(g,y[p]);w._id_=b.jgrid.stripPref(a.p.idPrefix,s);a.p.grouping&&O.call(m,w,n);a.p.data.push(w);a.p._index[w._id_]=a.p.data.length-1;w={}}n++}a.p.grouping&&(a.p.groupingView._locgr=!0,m.jqGrid("groupingRender",P,a.p.colModel.length,a.p.page,I))}}},oa=function(){function c(a){var b=0,d,e,g,h,k;
if(null!=a.groups){(e=a.groups.length&&"OR"===a.groupOp.toString().toUpperCase())&&u.orBegin();for(d=0;d<a.groups.length;d++){0<b&&e&&u.or();try{c(a.groups[d])}catch(l){alert(l)}b++}e&&u.orEnd()}if(null!=a.rules)try{(g=a.rules.length&&"OR"===a.groupOp.toString().toUpperCase())&&u.orBegin();for(d=0;d<a.rules.length;d++)k=a.rules[d],h=a.groupOp.toString().toUpperCase(),q[k.op]&&k.field&&(0<b&&h&&"OR"===h&&(u=u.or()),u=q[k.op](u,h)(k.field,k.data,f[k.field])),b++;g&&u.orEnd()}catch(m){alert(m)}}var d=
a.p.multiSort?[]:"",e=[],g=!1,f={},h=[],k=[],l,m,n;if(b.isArray(a.p.data)){var p=a.p.grouping?a.p.groupingView:!1,A,r;b.each(a.p.colModel,function(){m=this.sorttype||"text";"date"===m||"datetime"===m?(this.formatter&&"string"===typeof this.formatter&&"date"===this.formatter?(l=this.formatoptions&&this.formatoptions.srcformat?this.formatoptions.srcformat:b.jgrid.formatter.date.srcformat,n=this.formatoptions&&this.formatoptions.newformat?this.formatoptions.newformat:b.jgrid.formatter.date.newformat):
l=n=this.datefmt||"Y-m-d",f[this.name]={stype:m,srcfmt:l,newfmt:n,sfunc:this.sortfunc||null}):f[this.name]={stype:m,srcfmt:"",newfmt:"",sfunc:this.sortfunc||null};if(a.p.grouping)for(r=0,A=p.groupField.length;r<A;r++)if(this.name===p.groupField[r]){var c=this.name;this.index&&(c=this.index);h[r]=f[c];k[r]=c}a.p.multiSort?this.lso&&(d.push(this.name),c=this.lso.split("-"),e.push(c[c.length-1])):g||this.index!==a.p.sortname&&this.name!==a.p.sortname||(d=this.name,g=!0)});if(a.p.treeGrid)b(a).jqGrid("SortTree",
d,a.p.sortorder,f[d].stype||"text",f[d].srcfmt||"");else{var q={eq:function(a){return a.equals},ne:function(a){return a.notEquals},lt:function(a){return a.less},le:function(a){return a.lessOrEquals},gt:function(a){return a.greater},ge:function(a){return a.greaterOrEquals},cn:function(a){return a.contains},nc:function(a,b){return"OR"===b?a.orNot().contains:a.andNot().contains},bw:function(a){return a.startsWith},bn:function(a,b){return"OR"===b?a.orNot().startsWith:a.andNot().startsWith},en:function(a,
b){return"OR"===b?a.orNot().endsWith:a.andNot().endsWith},ew:function(a){return a.endsWith},ni:function(a,b){return"OR"===b?a.orNot().equals:a.andNot().equals},"in":function(a){return a.equals},nu:function(a){return a.isNull},nn:function(a,b){return"OR"===b?a.orNot().isNull:a.andNot().isNull}},u=b.jgrid.from(a.p.data);a.p.ignoreCase&&(u=u.ignoreCase());if(!0===a.p.search){var z=a.p.postData.filters;if(z)"string"===typeof z&&(z=b.jgrid.parse(z)),c(z);else try{u=q[a.p.postData.searchOper](u)(a.p.postData.searchField,
a.p.postData.searchString,f[a.p.postData.searchField])}catch(t){}}if(a.p.grouping)for(r=0;r<A;r++)u.orderBy(k[r],p.groupOrder[r],h[r].stype,h[r].srcfmt);a.p.multiSort?b.each(d,function(a){u.orderBy(this,e[a],f[this].stype,f[this].srcfmt,f[this].sfunc)}):d&&a.p.sortorder&&g&&("DESC"===a.p.sortorder.toUpperCase()?u.orderBy(a.p.sortname,"d",f[d].stype,f[d].srcfmt,f[d].sfunc):u.orderBy(a.p.sortname,"a",f[d].stype,f[d].srcfmt,f[d].sfunc));var z=u.select(),x=parseInt(a.p.rowNum,10),y=z.length,B=parseInt(a.p.page,
10),D=Math.ceil(y/x),v={};if((a.p.search||a.p.resetsearch)&&a.p.grouping&&a.p.groupingView._locgr){a.p.groupingView.groups=[];var w,G=b.jgrid.getMethod("groupingPrepare"),s,F;if(a.p.footerrow&&a.p.userDataOnFooter){for(s in a.p.userData)a.p.userData.hasOwnProperty(s)&&(a.p.userData[s]=0);F=!0}for(w=0;w<y;w++){if(F)for(s in a.p.userData)a.p.userData[s]+=parseFloat(z[w][s]||0);G.call(b(a),z[w],w,x)}}z=z.slice((B-1)*x,B*x);f=u=null;v[a.p.localReader.total]=D;v[a.p.localReader.page]=B;v[a.p.localReader.records]=
y;v[a.p.localReader.root]=z;v[a.p.localReader.userdata]=a.p.userData;z=null;return v}}},P=function(){a.grid.hDiv.loading=!0;if(!a.p.hiddengrid)switch(a.p.loadui){case "enable":b("#load_"+b.jgrid.jqID(a.p.id)).show();break;case "block":b("#lui_"+b.jgrid.jqID(a.p.id)).show(),b("#load_"+b.jgrid.jqID(a.p.id)).show()}},T=function(){a.grid.hDiv.loading=!1;switch(a.p.loadui){case "enable":b("#load_"+b.jgrid.jqID(a.p.id)).hide();break;case "block":b("#lui_"+b.jgrid.jqID(a.p.id)).hide(),b("#load_"+b.jgrid.jqID(a.p.id)).hide()}},
Q=function(c){if(!a.grid.hDiv.loading){var d=a.p.scroll&&!1===c,e={},g,f=a.p.prmNames;0>=a.p.page&&(a.p.page=Math.min(1,a.p.lastpage));null!==f.search&&(e[f.search]=a.p.search);null!==f.nd&&(e[f.nd]=(new Date).getTime());null!==f.rows&&(e[f.rows]=a.p.rowNum);null!==f.page&&(e[f.page]=a.p.page);null!==f.sort&&(e[f.sort]=a.p.sortname);null!==f.order&&(e[f.order]=a.p.sortorder);null!==a.p.rowTotal&&null!==f.totalrows&&(e[f.totalrows]=a.p.rowTotal);var h=b.isFunction(a.p.loadComplete),k=h?a.p.loadComplete:
null,l=0;c=c||1;1<c?null!==f.npage?(e[f.npage]=c,l=c-1,c=1):k=function(b){a.p.page++;a.grid.hDiv.loading=!1;h&&a.p.loadComplete.call(a,b);Q(c-1)}:null!==f.npage&&delete a.p.postData[f.npage];if(a.p.grouping){b(a).jqGrid("groupingSetup");var m=a.p.groupingView,n,p="";for(n=0;n<m.groupField.length;n++){var r=m.groupField[n];b.each(a.p.colModel,function(a,b){b.name===r&&b.index&&(r=b.index)});p+=r+" "+m.groupOrder[n]+", "}e[f.sort]=p+e[f.sort]}b.extend(a.p.postData,e);var q=a.p.scroll?a.rows.length-
1:1,e=b(a).triggerHandler("jqGridBeforeRequest");if(!1!==e&&"stop"!==e)if(b.isFunction(a.p.datatype))a.p.datatype.call(a,a.p.postData,"load_"+a.p.id,q,c,l);else{if(b.isFunction(a.p.beforeRequest)&&(e=a.p.beforeRequest.call(a),void 0===e&&(e=!0),!1===e))return;g=a.p.datatype.toLowerCase();switch(g){case "json":case "jsonp":case "xml":case "script":b.ajax(b.extend({url:a.p.url,type:a.p.mtype,dataType:g,data:b.isFunction(a.p.serializeGridData)?a.p.serializeGridData.call(a,a.p.postData):a.p.postData,
success:function(e,f,h){if(b.isFunction(a.p.beforeProcessing)&&!1===a.p.beforeProcessing.call(a,e,f,h))T();else{"xml"===g?K(e,a.grid.bDiv,q,1<c,l):Y(e,a.grid.bDiv,q,1<c,l);b(a).triggerHandler("jqGridLoadComplete",[e]);k&&k.call(a,e);b(a).triggerHandler("jqGridAfterLoadComplete",[e]);d&&a.grid.populateVisible();if(a.p.loadonce||a.p.treeGrid)a.p.datatype="local";1===c&&T()}},error:function(d,e,f){b.isFunction(a.p.loadError)&&a.p.loadError.call(a,d,e,f);1===c&&T()},beforeSend:function(c,d){var e=!0;
b.isFunction(a.p.loadBeforeSend)&&(e=a.p.loadBeforeSend.call(a,c,d));void 0===e&&(e=!0);if(!1===e)return!1;P()}},b.jgrid.ajaxOptions,a.p.ajaxGridOptions));break;case "xmlstring":P();e="string"!==typeof a.p.datastr?a.p.datastr:b.parseXML(a.p.datastr);K(e,a.grid.bDiv);b(a).triggerHandler("jqGridLoadComplete",[e]);h&&a.p.loadComplete.call(a,e);b(a).triggerHandler("jqGridAfterLoadComplete",[e]);a.p.datatype="local";a.p.datastr=null;T();break;case "jsonstring":P();e="string"===typeof a.p.datastr?b.jgrid.parse(a.p.datastr):
a.p.datastr;Y(e,a.grid.bDiv);b(a).triggerHandler("jqGridLoadComplete",[e]);h&&a.p.loadComplete.call(a,e);b(a).triggerHandler("jqGridAfterLoadComplete",[e]);a.p.datatype="local";a.p.datastr=null;T();break;case "local":case "clientside":P(),a.p.datatype="local",e=oa(),Y(e,a.grid.bDiv,q,1<c,l),b(a).triggerHandler("jqGridLoadComplete",[e]),k&&k.call(a,e),b(a).triggerHandler("jqGridAfterLoadComplete",[e]),d&&a.grid.populateVisible(),T()}}}},ha=function(c){b("#cb_"+b.jgrid.jqID(a.p.id),a.grid.hDiv)[a.p.useProp?
"prop":"attr"]("checked",c);if(a.p.frozenColumns&&a.p.id+"_frozen")b("#cb_"+b.jgrid.jqID(a.p.id),a.grid.fhDiv)[a.p.useProp?"prop":"attr"]("checked",c)},qa=function(c,e){var d="",g="<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",k="",l,m,n,p,q=function(c){var e;b.isFunction(a.p.onPaging)&&(e=a.p.onPaging.call(a,c));if("stop"===e)return!1;a.p.selrow=null;a.p.multiselect&&(a.p.selarrrow=[],ha(!1));a.p.savedRow=[];return!0};c=c.substr(1);
e+="_"+c;l="pg_"+c;m=c+"_left";n=c+"_center";p=c+"_right";b("#"+b.jgrid.jqID(c)).append("<div id='"+l+"' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='"+m+"' align='left'></td><td id='"+n+"' align='center' style='white-space:pre;'></td><td id='"+p+"' align='right'></td></tr></tbody></table></div>").attr("dir","ltr");if(0<a.p.rowList.length){k="<td dir='"+f+
"'>";k+="<select class='ui-pg-selbox' role='listbox'>";for(m=0;m<a.p.rowList.length;m++)k+='<option role="option" value="'+a.p.rowList[m]+'"'+(a.p.rowNum===a.p.rowList[m]?' selected="selected"':"")+">"+a.p.rowList[m]+"</option>";k+="</select></td>"}"rtl"===f&&(g+=k);!0===a.p.pginput&&(d="<td dir='"+f+"'>"+b.jgrid.format(a.p.pgtext||"","<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>","<span id='sp_1_"+b.jgrid.jqID(c)+"'></span>")+"</td>");!0===a.p.pgbuttons?
(m=["first"+e,"prev"+e,"next"+e,"last"+e],"rtl"===f&&m.reverse(),g+="<td id='"+m[0]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>",g+="<td id='"+m[1]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>",g=g+(""!==d?"<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>"+d+"<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>":
"")+("<td id='"+m[2]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>"),g+="<td id='"+m[3]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>"):""!==d&&(g+=d);"ltr"===f&&(g+=k);g+="</tr></tbody></table>";!0===a.p.viewrecords&&b("td#"+c+"_"+a.p.recordpos,"#"+l).append("<div dir='"+f+"' style='text-align:"+a.p.recordpos+"' class='ui-paging-info'></div>");b("td#"+c+"_"+a.p.pagerpos,"#"+l).append(g);k=b(".ui-jqgrid").css("font-size")||
"11px";b(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+k+";visibility:hidden;' ></div>");g=b(g).clone().appendTo("#testpg").width();b("#testpg").remove();0<g&&(""!==d&&(g+=50),b("td#"+c+"_"+a.p.pagerpos,"#"+l).width(g));a.p._nvtd=[];a.p._nvtd[0]=g?Math.floor((a.p.width-g)/2):Math.floor(a.p.width/3);a.p._nvtd[1]=0;g=null;b(".ui-pg-selbox","#"+l).bind("change",function(){if(!q("records"))return!1;a.p.page=Math.round(a.p.rowNum*(a.p.page-1)/
this.value-0.5)+1;a.p.rowNum=this.value;a.p.pager&&b(".ui-pg-selbox",a.p.pager).val(this.value);a.p.toppager&&b(".ui-pg-selbox",a.p.toppager).val(this.value);Q();return!1});!0===a.p.pgbuttons&&(b(".ui-pg-button","#"+l).hover(function(){b(this).hasClass("ui-state-disabled")?this.style.cursor="default":(b(this).addClass("ui-state-hover"),this.style.cursor="pointer")},function(){b(this).hasClass("ui-state-disabled")||(b(this).removeClass("ui-state-hover"),this.style.cursor="default")}),b("#first"+b.jgrid.jqID(e)+
", #prev"+b.jgrid.jqID(e)+", #next"+b.jgrid.jqID(e)+", #last"+b.jgrid.jqID(e)).click(function(){if(b(this).hasClass("ui-state-disabled"))return!1;var c=r(a.p.page,1),d=r(a.p.lastpage,1),g=!1,f=!0,h=!0,k=!0,l=!0;0===d||1===d?l=k=h=f=!1:1<d&&1<=c?1===c?h=f=!1:c===d&&(l=k=!1):1<d&&0===c&&(l=k=!1,c=d-1);if(!q(this.id))return!1;this.id==="first"+e&&f&&(a.p.page=1,g=!0);this.id==="prev"+e&&h&&(a.p.page=c-1,g=!0);this.id==="next"+e&&k&&(a.p.page=c+1,g=!0);this.id==="last"+e&&l&&(a.p.page=d,g=!0);g&&Q();
return!1}));!0===a.p.pginput&&b("input.ui-pg-input","#"+l).keypress(function(c){if(13===(c.charCode||c.keyCode||0)){if(!q("user"))return!1;b(this).val(r(b(this).val(),1));a.p.page=0<b(this).val()?b(this).val():a.p.page;Q();return!1}return this})},wa=function(c,e){var d,g="",f=a.p.colModel,h=!1,k;k=a.p.frozenColumns?e:a.grid.headers[c].el;var l="";b("span.ui-grid-ico-sort",k).addClass("ui-state-disabled");b(k).attr("aria-selected","false");if(f[c].lso)if("asc"===f[c].lso)f[c].lso+="-desc",l="desc";
else if("desc"===f[c].lso)f[c].lso+="-asc",l="asc";else{if("asc-desc"===f[c].lso||"desc-asc"===f[c].lso)f[c].lso=""}else f[c].lso=l=f[c].firstsortorder||"asc";l?(b("span.s-ico",k).show(),b("span.ui-icon-"+l,k).removeClass("ui-state-disabled"),b(k).attr("aria-selected","true")):a.p.viewsortcols[0]||b("span.s-ico",k).hide();a.p.sortorder="";b.each(f,function(b){this.lso&&(0<b&&h&&(g+=", "),d=this.lso.split("-"),g+=f[b].index||f[b].name,g+=" "+d[d.length-1],h=!0,a.p.sortorder=d[d.length-1])});k=g.lastIndexOf(a.p.sortorder);
g=g.substring(0,k);a.p.sortname=g},ra=function(c,d,e,g,f){if(a.p.colModel[d].sortable&&!(0<a.p.savedRow.length)){e||(a.p.lastsort===d?"asc"===a.p.sortorder?a.p.sortorder="desc":"desc"===a.p.sortorder&&(a.p.sortorder="asc"):a.p.sortorder=a.p.colModel[d].firstsortorder||"asc",a.p.page=1);if(a.p.multiSort)wa(d,f);else{if(g){if(a.p.lastsort===d&&a.p.sortorder===g&&!e)return;a.p.sortorder=g}e=a.grid.headers[a.p.lastsort].el;f=a.p.frozenColumns?f:a.grid.headers[d].el;b("span.ui-grid-ico-sort",e).addClass("ui-state-disabled");
b(e).attr("aria-selected","false");a.p.frozenColumns&&(a.grid.fhDiv.find("span.ui-grid-ico-sort").addClass("ui-state-disabled"),a.grid.fhDiv.find("th").attr("aria-selected","false"));b("span.ui-icon-"+a.p.sortorder,f).removeClass("ui-state-disabled");b(f).attr("aria-selected","true");a.p.viewsortcols[0]||a.p.lastsort===d||(a.p.frozenColumns&&a.grid.fhDiv.find("span.s-ico").hide(),b("span.s-ico",e).hide(),b("span.s-ico",f).show());c=c.substring(5+a.p.id.length+1);a.p.sortname=a.p.colModel[d].index||
c}"stop"===b(a).triggerHandler("jqGridSortCol",[a.p.sortname,d,a.p.sortorder])?a.p.lastsort=d:b.isFunction(a.p.onSortCol)&&"stop"===a.p.onSortCol.call(a,a.p.sortname,d,a.p.sortorder)?a.p.lastsort=d:("local"===a.p.datatype?a.p.deselectAfterSort&&b(a).jqGrid("resetSelection"):(a.p.selrow=null,a.p.multiselect&&ha(!1),a.p.selarrrow=[],a.p.savedRow=[]),a.p.scroll&&(f=a.grid.bDiv.scrollLeft,X.call(a,!0,!1),a.grid.hDiv.scrollLeft=f),a.p.subGrid&&"local"===a.p.datatype&&b("td.sgexpanded","#"+b.jgrid.jqID(a.p.id)).each(function(){b(this).trigger("click")}),
Q(),a.p.lastsort=d,a.p.sortname!==c&&d&&(a.p.lastsort=d))}},xa=function(c){c=b(a.grid.headers[c].el);c=[c.position().left+c.outerWidth()];"rtl"===a.p.direction&&(c[0]=a.p.width-c[0]);c[0]-=a.grid.bDiv.scrollLeft;c.push(b(a.grid.hDiv).position().top);c.push(b(a.grid.bDiv).offset().top-b(a.grid.hDiv).offset().top+b(a.grid.bDiv).height());return c},sa=function(c){var d,e=a.grid.headers,g=b.jgrid.getCellIndex(c);for(d=0;d<e.length;d++)if(c===e[d].el){g=d;break}return g};this.p.id=this.id;-1===b.inArray(a.p.multikey,
["shiftKey","altKey","ctrlKey"])&&(a.p.multikey=!1);a.p.keyIndex=!1;a.p.keyName=!1;for(g=0;g<a.p.colModel.length;g++)a.p.colModel[g]=b.extend(!0,{},a.p.cmTemplate,a.p.colModel[g].template||{},a.p.colModel[g]),!1===a.p.keyIndex&&!0===a.p.colModel[g].key&&(a.p.keyIndex=g);a.p.sortorder=a.p.sortorder.toLowerCase();b.jgrid.cell_width=b.jgrid.cellWidth();!0===a.p.grouping&&(a.p.scroll=!1,a.p.rownumbers=!1,a.p.treeGrid=!1,a.p.gridview=!0);if(!0===this.p.treeGrid){try{b(this).jqGrid("setTreeGrid")}catch(za){}"local"!==
a.p.datatype&&(a.p.localReader={id:"_id_"})}if(this.p.subGrid)try{b(a).jqGrid("setSubGrid")}catch(Aa){}this.p.multiselect&&(this.p.colNames.unshift("<input role='checkbox' id='cb_"+this.p.id+"' class='cbox' type='checkbox'/>"),this.p.colModel.unshift({name:"cb",width:b.jgrid.cell_width?a.p.multiselectWidth+a.p.cellLayout:a.p.multiselectWidth,sortable:!1,resizable:!1,hidedlg:!0,search:!1,align:"center",fixed:!0}));this.p.rownumbers&&(this.p.colNames.unshift(""),this.p.colModel.unshift({name:"rn",width:a.p.rownumWidth,
sortable:!1,resizable:!1,hidedlg:!0,search:!1,align:"center",fixed:!0}));a.p.xmlReader=b.extend(!0,{root:"rows",row:"row",page:"rows>page",total:"rows>total",records:"rows>records",repeatitems:!0,cell:"cell",id:"[id]",userdata:"userdata",subgrid:{root:"rows",row:"row",repeatitems:!0,cell:"cell"}},a.p.xmlReader);a.p.jsonReader=b.extend(!0,{root:"rows",page:"page",total:"total",records:"records",repeatitems:!0,cell:"cell",id:"id",userdata:"userdata",subgrid:{root:"rows",repeatitems:!0,cell:"cell"}},
a.p.jsonReader);a.p.localReader=b.extend(!0,{root:"rows",page:"page",total:"total",records:"records",repeatitems:!1,cell:"cell",id:"id",userdata:"userdata",subgrid:{root:"rows",repeatitems:!0,cell:"cell"}},a.p.localReader);a.p.scroll&&(a.p.pgbuttons=!1,a.p.pginput=!1,a.p.rowList=[]);a.p.data.length&&O();var D="<thead><tr class='ui-jqgrid-labels' role='rowheader'>",ta,F,ja,fa,ka,y,t,ba,ua=ba="",ga=[],va=[];F=[];if(!0===a.p.shrinkToFit&&!0===a.p.forceFit)for(g=a.p.colModel.length-1;0<=g;g--)if(!a.p.colModel[g].hidden){a.p.colModel[g].resizable=
!1;break}"horizontal"===a.p.viewsortcols[1]&&(ba=" ui-i-asc",ua=" ui-i-desc");ta=n?"class='ui-th-div-ie'":"";ba="<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc"+ba+" ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-"+f+"'></span>"+("<span sort='desc' class='ui-grid-ico-sort ui-icon-desc"+ua+" ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-"+f+"'></span></span>");if(a.p.multiSort)for(ga=a.p.sortname.split(","),g=0;g<ga.length;g++)F=b.trim(ga[g]).split(" "),
ga[g]=b.trim(F[0]),va[g]=F[1]?b.trim(F[1]):a.p.sortorder||"asc";for(g=0;g<this.p.colNames.length;g++)F=a.p.headertitles?' title="'+b.jgrid.stripHtml(a.p.colNames[g])+'"':"",D+="<th id='"+a.p.id+"_"+a.p.colModel[g].name+"' role='columnheader' class='ui-state-default ui-th-column ui-th-"+f+"'"+F+">",F=a.p.colModel[g].index||a.p.colModel[g].name,D+="<div id='jqgh_"+a.p.id+"_"+a.p.colModel[g].name+"' "+ta+">"+a.p.colNames[g],a.p.colModel[g].width=a.p.colModel[g].width?parseInt(a.p.colModel[g].width,10):
150,"boolean"!==typeof a.p.colModel[g].title&&(a.p.colModel[g].title=!0),a.p.colModel[g].lso="",F===a.p.sortname&&(a.p.lastsort=g),a.p.multiSort&&(F=b.inArray(F,ga),-1!==F&&(a.p.colModel[g].lso=va[F])),D+=ba+"</div></th>";D+="</tr></thead>";ba=null;b(this).append(D);b("thead tr:first th",this).hover(function(){b(this).addClass("ui-state-hover")},function(){b(this).removeClass("ui-state-hover")});if(this.p.multiselect){var la=[],ca;b("#cb_"+b.jgrid.jqID(a.p.id),this).bind("click",function(){a.p.selarrrow=
[];var c=!0===a.p.frozenColumns?a.p.id+"_frozen":"";this.checked?(b(a.rows).each(function(d){0<d&&!b(this).hasClass("ui-subgrid")&&!b(this).hasClass("jqgroup")&&!b(this).hasClass("ui-state-disabled")&&(b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(this.id))[a.p.useProp?"prop":"attr"]("checked",!0),b(this).addClass("ui-state-highlight").attr("aria-selected","true"),a.p.selarrrow.push(this.id),a.p.selrow=this.id,c&&(b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(this.id),a.grid.fbDiv)[a.p.useProp?
"prop":"attr"]("checked",!0),b("#"+b.jgrid.jqID(this.id),a.grid.fbDiv).addClass("ui-state-highlight")))}),ca=!0,la=[]):(b(a.rows).each(function(d){0<d&&!b(this).hasClass("ui-subgrid")&&!b(this).hasClass("ui-state-disabled")&&(b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(this.id))[a.p.useProp?"prop":"attr"]("checked",!1),b(this).removeClass("ui-state-highlight").attr("aria-selected","false"),la.push(this.id),c&&(b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(this.id),a.grid.fbDiv)[a.p.useProp?
"prop":"attr"]("checked",!1),b("#"+b.jgrid.jqID(this.id),a.grid.fbDiv).removeClass("ui-state-highlight")))}),a.p.selrow=null,ca=!1);b(a).triggerHandler("jqGridSelectAll",[ca?a.p.selarrrow:la,ca]);b.isFunction(a.p.onSelectAll)&&a.p.onSelectAll.call(a,ca?a.p.selarrrow:la,ca)})}!0===a.p.autowidth&&(D=b(m).innerWidth(),a.p.width=0<D?D:"nw");(function(){var d=0,e=b.jgrid.cell_width?0:r(a.p.cellLayout,0),g=0,f,h=r(a.p.scrollOffset,0),k,m=!1,n,p=0,q;b.each(a.p.colModel,function(){void 0===this.hidden&&(this.hidden=
!1);if(a.p.grouping&&a.p.autowidth){var c=b.inArray(this.name,a.p.groupingView.groupField);0<=c&&a.p.groupingView.groupColumnShow.length>c&&(this.hidden=!a.p.groupingView.groupColumnShow[c])}this.widthOrg=k=r(this.width,0);!1===this.hidden&&(d+=k+e,this.fixed?p+=k+e:g++)});isNaN(a.p.width)&&(a.p.width=d+(!1!==a.p.shrinkToFit||isNaN(a.p.height)?0:h));c.width=a.p.width;a.p.tblwidth=d;!1===a.p.shrinkToFit&&!0===a.p.forceFit&&(a.p.forceFit=!1);!0===a.p.shrinkToFit&&0<g&&(n=c.width-e*g-p,isNaN(a.p.height)||
(n-=h,m=!0),d=0,b.each(a.p.colModel,function(b){!1!==this.hidden||this.fixed||(this.width=k=Math.round(n*this.width/(a.p.tblwidth-e*g-p)),d+=k,f=b)}),q=0,m?c.width-p-(d+e*g)!==h&&(q=c.width-p-(d+e*g)-h):m||1===Math.abs(c.width-p-(d+e*g))||(q=c.width-p-(d+e*g)),a.p.colModel[f].width+=q,a.p.tblwidth=d+q+e*g+p,a.p.tblwidth>a.p.width&&(a.p.colModel[f].width-=a.p.tblwidth-parseInt(a.p.width,10),a.p.tblwidth=a.p.width))})();b(m).css("width",c.width+"px").append("<div class='ui-jqgrid-resize-mark' id='rs_m"+
a.p.id+"'>&#160;</div>");b(k).css("width",c.width+"px");var D=b("thead:first",a).get(0),V="";a.p.footerrow&&(V+="<table role='grid' style='width:"+a.p.tblwidth+"px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-"+f+"'>");var k=b("tr:first",D),da="<tr class='jqgfirstrow' role='row' style='height:auto'>";a.p.disableClick=!1;b("th",k).each(function(d){ja=a.p.colModel[d].width;void 0===a.p.colModel[d].resizable&&(a.p.colModel[d].resizable=
!0);a.p.colModel[d].resizable?(fa=document.createElement("span"),b(fa).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-"+f).css("cursor","col-resize"),b(this).addClass(a.p.resizeclass)):fa="";b(this).css("width",ja+"px").prepend(fa);fa=null;var e="";a.p.colModel[d].hidden&&(b(this).css("display","none"),e="display:none;");da+="<td role='gridcell' style='height:0px;width:"+ja+"px;"+e+"'></td>";c.headers[d]={width:ja,el:this};ka=a.p.colModel[d].sortable;"boolean"!==typeof ka&&(ka=a.p.colModel[d].sortable=
!0);e=a.p.colModel[d].name;"cb"!==e&&"subgrid"!==e&&"rn"!==e&&a.p.viewsortcols[2]&&b(">div",this).addClass("ui-jqgrid-sortable");ka&&(a.p.multiSort?a.p.viewsortcols[0]?(b("div span.s-ico",this).show(),a.p.colModel[d].lso&&b("div span.ui-icon-"+a.p.colModel[d].lso,this).removeClass("ui-state-disabled")):a.p.colModel[d].lso&&(b("div span.s-ico",this).show(),b("div span.ui-icon-"+a.p.colModel[d].lso,this).removeClass("ui-state-disabled")):a.p.viewsortcols[0]?(b("div span.s-ico",this).show(),d===a.p.lastsort&&
b("div span.ui-icon-"+a.p.sortorder,this).removeClass("ui-state-disabled")):d===a.p.lastsort&&(b("div span.s-ico",this).show(),b("div span.ui-icon-"+a.p.sortorder,this).removeClass("ui-state-disabled")));a.p.footerrow&&(V+="<td role='gridcell' "+p(d,0,"",null,"",!1)+">&#160;</td>")}).mousedown(function(d){if(1===b(d.target).closest("th>span.ui-jqgrid-resize").length){var e=sa(this);if(!0===a.p.forceFit){var g=a.p,f=e,h;for(h=e+1;h<a.p.colModel.length;h++)if(!0!==a.p.colModel[h].hidden){f=h;break}g.nv=
f-e}c.dragStart(e,d,xa(e));return!1}}).click(function(c){if(a.p.disableClick)return a.p.disableClick=!1;var d="th>div.ui-jqgrid-sortable",e,g;a.p.viewsortcols[2]||(d="th>div>span>span.ui-grid-ico-sort");c=b(c.target).closest(d);if(1===c.length){var f;if(a.p.frozenColumns){var h=b(this)[0].id.substring(a.p.id.length+1);b(a.p.colModel).each(function(a){if(this.name===h)return f=a,!1})}else f=sa(this);a.p.viewsortcols[2]||(e=!0,g=c.attr("sort"));null!=f&&ra(b("div",this)[0].id,f,e,g,this);return!1}});
if(a.p.sortable&&b.fn.sortable)try{b(a).jqGrid("sortableColumns",k)}catch(Ba){}a.p.footerrow&&(V+="</tr></tbody></table>");da+="</tr>";k=document.createElement("tbody");this.appendChild(k);b(this).addClass("ui-jqgrid-btable").append(da);var da=null,k=b("<table class='ui-jqgrid-htable' style='width:"+a.p.tblwidth+"px' role='grid' aria-labelledby='gbox_"+this.id+"' cellspacing='0' cellpadding='0' border='0'></table>").append(D),J=a.p.caption&&!0===a.p.hiddengrid?!0:!1;g=b("<div class='ui-jqgrid-hbox"+
("rtl"===f?"-rtl":"")+"'></div>");D=null;c.hDiv=document.createElement("div");b(c.hDiv).css({width:c.width+"px"}).addClass("ui-state-default ui-jqgrid-hdiv").append(g);b(g).append(k);k=null;J&&b(c.hDiv).hide();a.p.pager&&("string"===typeof a.p.pager?"#"!==a.p.pager.substr(0,1)&&(a.p.pager="#"+a.p.pager):a.p.pager="#"+b(a.p.pager).attr("id"),b(a.p.pager).css({width:c.width+"px"}).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom").appendTo(m),J&&b(a.p.pager).hide(),qa(a.p.pager,""));!1===
a.p.cellEdit&&!0===a.p.hoverrows&&b(a).bind("mouseover",function(a){t=b(a.target).closest("tr.jqgrow");"ui-subgrid"!==b(t).attr("class")&&b(t).addClass("ui-state-hover")}).bind("mouseout",function(a){t=b(a.target).closest("tr.jqgrow");b(t).removeClass("ui-state-hover")});var B,N,ma;b(a).before(c.hDiv).click(function(c){y=c.target;t=b(y,a.rows).closest("tr.jqgrow");if(0===b(t).length||-1<t[0].className.indexOf("ui-state-disabled")||(b(y,a).closest("table.ui-jqgrid-btable").attr("id")||"").replace("_frozen",
"")!==a.id)return this;var d=b(y).hasClass("cbox"),e=b(a).triggerHandler("jqGridBeforeSelectRow",[t[0].id,c]);(e=!1===e||"stop"===e?!1:!0)&&b.isFunction(a.p.beforeSelectRow)&&(e=a.p.beforeSelectRow.call(a,t[0].id,c));if("A"!==y.tagName&&("INPUT"!==y.tagName&&"TEXTAREA"!==y.tagName&&"OPTION"!==y.tagName&&"SELECT"!==y.tagName||d)&&!0===e)if(B=t[0].id,N=b.jgrid.getCellIndex(y),ma=b(y).closest("td,th").html(),b(a).triggerHandler("jqGridCellSelect",[B,N,ma,c]),b.isFunction(a.p.onCellSelect)&&a.p.onCellSelect.call(a,
B,N,ma,c),!0===a.p.cellEdit)if(a.p.multiselect&&d)b(a).jqGrid("setSelection",B,!0,c);else{B=t[0].rowIndex;try{b(a).jqGrid("editCell",B,N,!0)}catch(g){}}else if(a.p.multikey)c[a.p.multikey]?b(a).jqGrid("setSelection",B,!0,c):a.p.multiselect&&d&&(d=b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+B).is(":checked"),b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+B)[a.p.useProp?"prop":"attr"]("checked",d));else{if(a.p.multiselect&&a.p.multiboxonly&&!d){var f=a.p.frozenColumns?a.p.id+"_frozen":"";b(a.p.selarrrow).each(function(c,
d){var e=b(a).jqGrid("getGridRowById",d);b(e).removeClass("ui-state-highlight");b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(d))[a.p.useProp?"prop":"attr"]("checked",!1);f&&(b("#"+b.jgrid.jqID(d),"#"+b.jgrid.jqID(f)).removeClass("ui-state-highlight"),b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(d),"#"+b.jgrid.jqID(f))[a.p.useProp?"prop":"attr"]("checked",!1))});a.p.selarrrow=[]}b(a).jqGrid("setSelection",B,!0,c)}}).bind("reloadGrid",function(c,d){!0===a.p.treeGrid&&(a.p.datatype=a.p.treedatatype);
d&&d.current&&a.grid.selectionPreserver(a);"local"===a.p.datatype?(b(a).jqGrid("resetSelection"),a.p.data.length&&O()):a.p.treeGrid||(a.p.selrow=null,a.p.multiselect&&(a.p.selarrrow=[],ha(!1)),a.p.savedRow=[]);a.p.scroll&&X.call(a,!0,!1);if(d&&d.page){var e=d.page;e>a.p.lastpage&&(e=a.p.lastpage);1>e&&(e=1);a.p.page=e;a.grid.bDiv.scrollTop=a.grid.prevRowHeight?(e-1)*a.grid.prevRowHeight*a.p.rowNum:0}a.grid.prevRowHeight&&a.p.scroll?(delete a.p.lastpage,a.grid.populateVisible()):a.grid.populate();
!0===a.p._inlinenav&&b(a).jqGrid("showAddEditButtons");return!1}).dblclick(function(c){y=c.target;t=b(y,a.rows).closest("tr.jqgrow");0!==b(t).length&&(B=t[0].rowIndex,N=b.jgrid.getCellIndex(y),b(a).triggerHandler("jqGridDblClickRow",[b(t).attr("id"),B,N,c]),b.isFunction(a.p.ondblClickRow)&&a.p.ondblClickRow.call(a,b(t).attr("id"),B,N,c))}).bind("contextmenu",function(c){y=c.target;t=b(y,a.rows).closest("tr.jqgrow");0!==b(t).length&&(a.p.multiselect||b(a).jqGrid("setSelection",t[0].id,!0,c),B=t[0].rowIndex,
N=b.jgrid.getCellIndex(y),b(a).triggerHandler("jqGridRightClickRow",[b(t).attr("id"),B,N,c]),b.isFunction(a.p.onRightClickRow)&&a.p.onRightClickRow.call(a,b(t).attr("id"),B,N,c))});c.bDiv=document.createElement("div");n&&"auto"===String(a.p.height).toLowerCase()&&(a.p.height="100%");b(c.bDiv).append(b('<div style="position:relative;'+(n&&8>b.jgrid.msiever()?"height:0.01%;":"")+'"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({height:a.p.height+(isNaN(a.p.height)?"":"px"),
width:c.width+"px"}).scroll(c.scrollGrid);b("table:first",c.bDiv).css({width:a.p.tblwidth+"px"});b.support.tbody||2===b("tbody",this).length&&b("tbody:gt(0)",this).remove();a.p.multikey&&(b.jgrid.msie?b(c.bDiv).bind("selectstart",function(){return!1}):b(c.bDiv).bind("mousedown",function(){return!1}));J&&b(c.bDiv).hide();c.cDiv=document.createElement("div");var na=!0===a.p.hidegrid?b("<a role='link' class='ui-jqgrid-titlebar-close ui-corner-all HeaderButton' />").hover(function(){na.addClass("ui-state-hover")},
function(){na.removeClass("ui-state-hover")}).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css("rtl"===f?"left":"right","0px"):"";b(c.cDiv).append(na).append("<span class='ui-jqgrid-title'>"+a.p.caption+"</span>").addClass("ui-jqgrid-titlebar ui-jqgrid-caption"+("rtl"===f?"-rtl":"")+" ui-widget-header ui-corner-top ui-helper-clearfix");b(c.cDiv).insertBefore(c.hDiv);a.p.toolbar[0]&&(c.uDiv=document.createElement("div"),"top"===a.p.toolbar[1]?b(c.uDiv).insertBefore(c.hDiv):"bottom"===
a.p.toolbar[1]&&b(c.uDiv).insertAfter(c.hDiv),"both"===a.p.toolbar[1]?(c.ubDiv=document.createElement("div"),b(c.uDiv).addClass("ui-userdata ui-state-default").attr("id","t_"+this.id).insertBefore(c.hDiv),b(c.ubDiv).addClass("ui-userdata ui-state-default").attr("id","tb_"+this.id).insertAfter(c.hDiv),J&&b(c.ubDiv).hide()):b(c.uDiv).width(c.width).addClass("ui-userdata ui-state-default").attr("id","t_"+this.id),J&&b(c.uDiv).hide());a.p.toppager&&(a.p.toppager=b.jgrid.jqID(a.p.id)+"_toppager",c.topDiv=
b("<div id='"+a.p.toppager+"'></div>")[0],a.p.toppager="#"+a.p.toppager,b(c.topDiv).addClass("ui-state-default ui-jqgrid-toppager").width(c.width).insertBefore(c.hDiv),qa(a.p.toppager,"_t"));a.p.footerrow&&(c.sDiv=b("<div class='ui-jqgrid-sdiv'></div>")[0],g=b("<div class='ui-jqgrid-hbox"+("rtl"===f?"-rtl":"")+"'></div>"),b(c.sDiv).append(g).width(c.width).insertAfter(c.hDiv),b(g).append(V),c.footers=b(".ui-jqgrid-ftable",c.sDiv)[0].rows[0].cells,a.p.rownumbers&&(c.footers[0].className="ui-state-default jqgrid-rownum"),
J&&b(c.sDiv).hide());g=null;if(a.p.caption){var ya=a.p.datatype;!0===a.p.hidegrid&&(b(".ui-jqgrid-titlebar-close",c.cDiv).click(function(d){var e=b.isFunction(a.p.onHeaderClick),g=".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",f,h=this;!0===a.p.toolbar[0]&&("both"===a.p.toolbar[1]&&(g+=", #"+b(c.ubDiv).attr("id")),g+=", #"+b(c.uDiv).attr("id"));f=b(g,"#gview_"+b.jgrid.jqID(a.p.id)).length;"visible"===a.p.gridstate?b(g,"#gbox_"+b.jgrid.jqID(a.p.id)).slideUp("fast",function(){f--;
0===f&&(b("span",h).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"),a.p.gridstate="hidden",b("#gbox_"+b.jgrid.jqID(a.p.id)).hasClass("ui-resizable")&&b(".ui-resizable-handle","#gbox_"+b.jgrid.jqID(a.p.id)).hide(),b(a).triggerHandler("jqGridHeaderClick",[a.p.gridstate,d]),e&&(J||a.p.onHeaderClick.call(a,a.p.gridstate,d)))}):"hidden"===a.p.gridstate&&b(g,"#gbox_"+b.jgrid.jqID(a.p.id)).slideDown("fast",function(){f--;0===f&&(b("span",h).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n"),
J&&(a.p.datatype=ya,Q(),J=!1),a.p.gridstate="visible",b("#gbox_"+b.jgrid.jqID(a.p.id)).hasClass("ui-resizable")&&b(".ui-resizable-handle","#gbox_"+b.jgrid.jqID(a.p.id)).show(),b(a).triggerHandler("jqGridHeaderClick",[a.p.gridstate,d]),e&&(J||a.p.onHeaderClick.call(a,a.p.gridstate,d)))});return!1}),J&&(a.p.datatype="local",b(".ui-jqgrid-titlebar-close",c.cDiv).trigger("click")))}else b(c.cDiv).hide();b(c.hDiv).after(c.bDiv).mousemove(function(a){if(c.resizing)return c.dragMove(a),!1});b(".ui-jqgrid-labels",
c.hDiv).bind("selectstart",function(){return!1});b(document).bind("mouseup.jqGrid"+a.p.id,function(){return c.resizing?(c.dragEnd(),!1):!0});a.formatCol=p;a.sortData=ra;a.updatepager=function(c,d){var e,g,f,h,k,l,m,n="",p=a.p.pager?"_"+b.jgrid.jqID(a.p.pager.substr(1)):"",q=a.p.toppager?"_"+a.p.toppager.substr(1):"";f=parseInt(a.p.page,10)-1;0>f&&(f=0);f*=parseInt(a.p.rowNum,10);k=f+a.p.reccount;if(a.p.scroll){e=b("tbody:first > tr:gt(0)",a.grid.bDiv);f=k-e.length;a.p.reccount=e.length;if(e=e.outerHeight()||
a.grid.prevRowHeight)g=f*e,m=parseInt(a.p.records,10)*e,b(">div:first",a.grid.bDiv).css({height:m}).children("div:first").css({height:g,display:g?"":"none"}),0==a.grid.bDiv.scrollTop&&1<a.p.page&&(a.grid.bDiv.scrollTop=a.p.rowNum*(a.p.page-1)*e);a.grid.bDiv.scrollLeft=a.grid.hDiv.scrollLeft}n=a.p.pager||"";if(n+=a.p.toppager?n?","+a.p.toppager:a.p.toppager:"")m=b.jgrid.formatter.integer||{},e=r(a.p.page),g=r(a.p.lastpage),b(".selbox",n)[this.p.useProp?"prop":"attr"]("disabled",!1),!0===a.p.pginput&&
(b(".ui-pg-input",n).val(a.p.page),h=a.p.toppager?"#sp_1"+p+",#sp_1"+q:"#sp_1"+p,b(h).html(b.fmatter?b.fmatter.util.NumberFormat(a.p.lastpage,m):a.p.lastpage)),a.p.viewrecords&&(0===a.p.reccount?b(".ui-paging-info",n).html(a.p.emptyrecords):(h=f+1,l=a.p.records,b.fmatter&&(h=b.fmatter.util.NumberFormat(h,m),k=b.fmatter.util.NumberFormat(k,m),l=b.fmatter.util.NumberFormat(l,m)),b(".ui-paging-info",n).html(b.jgrid.format(a.p.recordtext,h,k,l)))),!0===a.p.pgbuttons&&(0>=e&&(e=g=0),1===e||0===e?(b("#first"+
p+", #prev"+p).addClass("ui-state-disabled").removeClass("ui-state-hover"),a.p.toppager&&b("#first_t"+q+", #prev_t"+q).addClass("ui-state-disabled").removeClass("ui-state-hover")):(b("#first"+p+", #prev"+p).removeClass("ui-state-disabled"),a.p.toppager&&b("#first_t"+q+", #prev_t"+q).removeClass("ui-state-disabled")),e===g||0===e?(b("#next"+p+", #last"+p).addClass("ui-state-disabled").removeClass("ui-state-hover"),a.p.toppager&&b("#next_t"+q+", #last_t"+q).addClass("ui-state-disabled").removeClass("ui-state-hover")):
(b("#next"+p+", #last"+p).removeClass("ui-state-disabled"),a.p.toppager&&b("#next_t"+q+", #last_t"+q).removeClass("ui-state-disabled")));!0===c&&!0===a.p.rownumbers&&b(">td.jqgrid-rownum",a.rows).each(function(a){b(this).html(f+1+a)});d&&a.p.jqgdnd&&b(a).jqGrid("gridDnD","updateDnD");b(a).triggerHandler("jqGridGridComplete");b.isFunction(a.p.gridComplete)&&a.p.gridComplete.call(a);b(a).triggerHandler("jqGridAfterGridComplete")};a.refreshIndex=O;a.setHeadCheckBox=ha;a.constructTr=$;a.formatter=function(a,
b,c,d,e){return x(a,b,c,d,e)};b.extend(c,{populate:Q,emptyRows:X,beginReq:P,endReq:T});this.grid=c;a.addXmlData=function(b){K(b,a.grid.bDiv)};a.addJSONData=function(b){Y(b,a.grid.bDiv)};this.grid.cols=this.rows[0].cells;b(a).triggerHandler("jqGridInitGrid");b.isFunction(a.p.onInitGrid)&&a.p.onInitGrid.call(a);Q();a.p.hiddengrid=!1}}}})};b.jgrid.extend({getGridParam:function(b){var f=this[0];if(f&&f.grid)return b?void 0!==f.p[b]?f.p[b]:null:f.p},setGridParam:function(e){return this.each(function(){this.grid&&
"object"===typeof e&&b.extend(!0,this.p,e)})},getGridRowById:function(e){var f;this.each(function(){try{for(var c=this.rows.length;c--;)if(e.toString()===this.rows[c].id){f=this.rows[c];break}}catch(d){f=b(this.grid.bDiv).find("#"+b.jgrid.jqID(e))}});return f},getDataIDs:function(){var e=[],f=0,c,d=0;this.each(function(){if((c=this.rows.length)&&0<c)for(;f<c;)b(this.rows[f]).hasClass("jqgrow")&&(e[d]=this.rows[f].id,d++),f++});return e},setSelection:function(e,f,c){return this.each(function(){var d,
a,l,g,h,k;void 0!==e&&(f=!1===f?!1:!0,!(a=b(this).jqGrid("getGridRowById",e))||!a.className||-1<a.className.indexOf("ui-state-disabled")||(!0===this.p.scrollrows&&(l=b(this).jqGrid("getGridRowById",e).rowIndex,0<=l&&(d=b(this.grid.bDiv)[0].clientHeight,g=b(this.grid.bDiv)[0].scrollTop,h=b(this.rows[l]).position().top,l=this.rows[l].clientHeight,h+l>=d+g?b(this.grid.bDiv)[0].scrollTop=h-(d+g)+l+g:h<d+g&&h<g&&(b(this.grid.bDiv)[0].scrollTop=h))),!0===this.p.frozenColumns&&(k=this.p.id+"_frozen"),this.p.multiselect?
(this.setHeadCheckBox(!1),this.p.selrow=a.id,g=b.inArray(this.p.selrow,this.p.selarrrow),-1===g?("ui-subgrid"!==a.className&&b(a).addClass("ui-state-highlight").attr("aria-selected","true"),d=!0,this.p.selarrrow.push(this.p.selrow)):("ui-subgrid"!==a.className&&b(a).removeClass("ui-state-highlight").attr("aria-selected","false"),d=!1,this.p.selarrrow.splice(g,1),h=this.p.selarrrow[0],this.p.selrow=void 0===h?null:h),b("#jqg_"+b.jgrid.jqID(this.p.id)+"_"+b.jgrid.jqID(a.id))[this.p.useProp?"prop":"attr"]("checked",
d),k&&(-1===g?b("#"+b.jgrid.jqID(e),"#"+b.jgrid.jqID(k)).addClass("ui-state-highlight"):b("#"+b.jgrid.jqID(e),"#"+b.jgrid.jqID(k)).removeClass("ui-state-highlight"),b("#jqg_"+b.jgrid.jqID(this.p.id)+"_"+b.jgrid.jqID(e),"#"+b.jgrid.jqID(k))[this.p.useProp?"prop":"attr"]("checked",d)),f&&(b(this).triggerHandler("jqGridSelectRow",[a.id,d,c]),this.p.onSelectRow&&this.p.onSelectRow.call(this,a.id,d,c))):"ui-subgrid"!==a.className&&(this.p.selrow!==a.id?(b(b(this).jqGrid("getGridRowById",this.p.selrow)).removeClass("ui-state-highlight").attr({"aria-selected":"false",
tabindex:"-1"}),b(a).addClass("ui-state-highlight").attr({"aria-selected":"true",tabindex:"0"}),k&&(b("#"+b.jgrid.jqID(this.p.selrow),"#"+b.jgrid.jqID(k)).removeClass("ui-state-highlight"),b("#"+b.jgrid.jqID(e),"#"+b.jgrid.jqID(k)).addClass("ui-state-highlight")),d=!0):d=!1,this.p.selrow=a.id,f&&(b(this).triggerHandler("jqGridSelectRow",[a.id,d,c]),this.p.onSelectRow&&this.p.onSelectRow.call(this,a.id,d,c)))))})},resetSelection:function(e){return this.each(function(){var f=this,c,d;!0===f.p.frozenColumns&&
(d=f.p.id+"_frozen");if(void 0!==e){c=e===f.p.selrow?f.p.selrow:e;b("#"+b.jgrid.jqID(f.p.id)+" tbody:first tr#"+b.jgrid.jqID(c)).removeClass("ui-state-highlight").attr("aria-selected","false");d&&b("#"+b.jgrid.jqID(c),"#"+b.jgrid.jqID(d)).removeClass("ui-state-highlight");if(f.p.multiselect){b("#jqg_"+b.jgrid.jqID(f.p.id)+"_"+b.jgrid.jqID(c),"#"+b.jgrid.jqID(f.p.id))[f.p.useProp?"prop":"attr"]("checked",!1);if(d)b("#jqg_"+b.jgrid.jqID(f.p.id)+"_"+b.jgrid.jqID(c),"#"+b.jgrid.jqID(d))[f.p.useProp?"prop":
"attr"]("checked",!1);f.setHeadCheckBox(!1)}c=null}else f.p.multiselect?(b(f.p.selarrrow).each(function(a,c){b(b(f).jqGrid("getGridRowById",c)).removeClass("ui-state-highlight").attr("aria-selected","false");b("#jqg_"+b.jgrid.jqID(f.p.id)+"_"+b.jgrid.jqID(c))[f.p.useProp?"prop":"attr"]("checked",!1);d&&(b("#"+b.jgrid.jqID(c),"#"+b.jgrid.jqID(d)).removeClass("ui-state-highlight"),b("#jqg_"+b.jgrid.jqID(f.p.id)+"_"+b.jgrid.jqID(c),"#"+b.jgrid.jqID(d))[f.p.useProp?"prop":"attr"]("checked",!1))}),f.setHeadCheckBox(!1),
f.p.selarrrow=[],f.p.selrow=null):f.p.selrow&&(b("#"+b.jgrid.jqID(f.p.id)+" tbody:first tr#"+b.jgrid.jqID(f.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected","false"),d&&b("#"+b.jgrid.jqID(f.p.selrow),"#"+b.jgrid.jqID(d)).removeClass("ui-state-highlight"),f.p.selrow=null);!0===f.p.cellEdit&&0<=parseInt(f.p.iCol,10)&&0<=parseInt(f.p.iRow,10)&&(b("td:eq("+f.p.iCol+")",f.rows[f.p.iRow]).removeClass("edit-cell ui-state-highlight"),b(f.rows[f.p.iRow]).removeClass("selected-row ui-state-hover"));
f.p.savedRow=[]})},getRowData:function(e){var f={},c,d=!1,a,l=0;this.each(function(){var g=this,h,k;if(void 0===e)d=!0,c=[],a=g.rows.length;else{k=b(g).jqGrid("getGridRowById",e);if(!k)return f;a=2}for(;l<a;)d&&(k=g.rows[l]),b(k).hasClass("jqgrow")&&(b('td[role="gridcell"]',k).each(function(a){h=g.p.colModel[a].name;if("cb"!==h&&"subgrid"!==h&&"rn"!==h)if(!0===g.p.treeGrid&&h===g.p.ExpandColumn)f[h]=b.jgrid.htmlDecode(b("span:first",this).html());else try{f[h]=b.unformat.call(g,this,{rowId:k.id,colModel:g.p.colModel[a]},
a)}catch(c){f[h]=b.jgrid.htmlDecode(b(this).html())}}),d&&(c.push(f),f={})),l++});return c||f},delRowData:function(e){var f=!1,c,d;this.each(function(){c=b(this).jqGrid("getGridRowById",e);if(!c)return!1;b(c).remove();this.p.records--;this.p.reccount--;this.updatepager(!0,!1);f=!0;this.p.multiselect&&(d=b.inArray(e,this.p.selarrrow),-1!==d&&this.p.selarrrow.splice(d,1));this.p.selrow=this.p.multiselect&&0<this.p.selarrrow.length?this.p.selarrrow[this.p.selarrrow.length-1]:null;if("local"===this.p.datatype){var a=
b.jgrid.stripPref(this.p.idPrefix,e),a=this.p._index[a];void 0!==a&&(this.p.data.splice(a,1),this.refreshIndex())}if(!0===this.p.altRows&&f){var l=this.p.altclass;b(this.rows).each(function(a){1===a%2?b(this).addClass(l):b(this).removeClass(l)})}});return f},setRowData:function(e,f,c){var d,a=!0,l;this.each(function(){if(!this.grid)return!1;var g=this,h,k,n=typeof c,m={};k=b(this).jqGrid("getGridRowById",e);if(!k)return!1;if(f)try{if(b(this.p.colModel).each(function(a){d=this.name;var c=b.jgrid.getAccessor(f,
d);void 0!==c&&(m[d]=this.formatter&&"string"===typeof this.formatter&&"date"===this.formatter?b.unformat.date.call(g,c,this):c,h=g.formatter(e,c,a,f,"edit"),l=this.title?{title:b.jgrid.stripHtml(h)}:{},!0===g.p.treeGrid&&d===g.p.ExpandColumn?b("td[role='gridcell']:eq("+a+") > span:first",k).html(h).attr(l):b("td[role='gridcell']:eq("+a+")",k).html(h).attr(l))}),"local"===g.p.datatype){var r=b.jgrid.stripPref(g.p.idPrefix,e),p=g.p._index[r],q;if(g.p.treeGrid)for(q in g.p.treeReader)g.p.treeReader.hasOwnProperty(q)&&
delete m[g.p.treeReader[q]];void 0!==p&&(g.p.data[p]=b.extend(!0,g.p.data[p],m));m=null}}catch(x){a=!1}a&&("string"===n?b(k).addClass(c):null!==c&&"object"===n&&b(k).css(c),b(g).triggerHandler("jqGridAfterGridComplete"))});return a},addRowData:function(e,f,c,d){c||(c="last");var a=!1,l,g,h,k,n,m,r,p,q="",x,G,U,M,ea,W;f&&(b.isArray(f)?(x=!0,c="last",G=e):(f=[f],x=!1),this.each(function(){var X=f.length;n=!0===this.p.rownumbers?1:0;h=!0===this.p.multiselect?1:0;k=!0===this.p.subGrid?1:0;x||(void 0!==
e?e=String(e):(e=b.jgrid.randId(),!1!==this.p.keyIndex&&(G=this.p.colModel[this.p.keyIndex+h+k+n].name,void 0!==f[0][G]&&(e=f[0][G]))));U=this.p.altclass;for(var O=0,$="",K={},Y=b.isFunction(this.p.afterInsertRow)?!0:!1;O<X;){M=f[O];g=[];if(x){try{e=M[G],void 0===e&&(e=b.jgrid.randId())}catch(oa){e=b.jgrid.randId()}$=!0===this.p.altRows?0===(this.rows.length-1)%2?U:"":""}W=e;e=this.p.idPrefix+e;n&&(q=this.formatCol(0,1,"",null,e,!0),g[g.length]='<td role="gridcell" class="ui-state-default jqgrid-rownum" '+
q+">0</td>");h&&(p='<input role="checkbox" type="checkbox" id="jqg_'+this.p.id+"_"+e+'" class="cbox"/>',q=this.formatCol(n,1,"",null,e,!0),g[g.length]='<td role="gridcell" '+q+">"+p+"</td>");k&&(g[g.length]=b(this).jqGrid("addSubGridCell",h+n,1));for(r=h+k+n;r<this.p.colModel.length;r++)ea=this.p.colModel[r],l=ea.name,K[l]=M[l],p=this.formatter(e,b.jgrid.getAccessor(M,l),r,M),q=this.formatCol(r,1,p,M,e,K),g[g.length]='<td role="gridcell" '+q+">"+p+"</td>";g.unshift(this.constructTr(e,!1,$,K,M,!1));
g[g.length]="</tr>";if(0===this.rows.length)b("table:first",this.grid.bDiv).append(g.join(""));else switch(c){case "last":b(this.rows[this.rows.length-1]).after(g.join(""));m=this.rows.length-1;break;case "first":b(this.rows[0]).after(g.join(""));m=1;break;case "after":if(m=b(this).jqGrid("getGridRowById",d))b(this.rows[m.rowIndex+1]).hasClass("ui-subgrid")?b(this.rows[m.rowIndex+1]).after(g):b(m).after(g.join("")),m=m.rowIndex+1;break;case "before":if(m=b(this).jqGrid("getGridRowById",d))b(m).before(g.join("")),
m=m.rowIndex-1}!0===this.p.subGrid&&b(this).jqGrid("addSubGrid",h+n,m);this.p.records++;this.p.reccount++;b(this).triggerHandler("jqGridAfterInsertRow",[e,M,M]);Y&&this.p.afterInsertRow.call(this,e,M,M);O++;"local"===this.p.datatype&&(K[this.p.localReader.id]=W,this.p._index[W]=this.p.data.length,this.p.data.push(K),K={})}!0!==this.p.altRows||x||("last"===c?1===(this.rows.length-1)%2&&b(this.rows[this.rows.length-1]).addClass(U):b(this.rows).each(function(a){1===a%2?b(this).addClass(U):b(this).removeClass(U)}));
this.updatepager(!0,!0);a=!0}));return a},footerData:function(e,f,c){function d(a){for(var b in a)if(a.hasOwnProperty(b))return!1;return!0}var a,l=!1,g={},h;void 0==e&&(e="get");"boolean"!==typeof c&&(c=!0);e=e.toLowerCase();this.each(function(){var k=this,n;if(!k.grid||!k.p.footerrow||"set"===e&&d(f))return!1;l=!0;b(this.p.colModel).each(function(d){a=this.name;"set"===e?void 0!==f[a]&&(n=c?k.formatter("",f[a],d,f,"edit"):f[a],h=this.title?{title:b.jgrid.stripHtml(n)}:{},b("tr.footrow td:eq("+d+
")",k.grid.sDiv).html(n).attr(h),l=!0):"get"===e&&(g[a]=b("tr.footrow td:eq("+d+")",k.grid.sDiv).html())})});return"get"===e?g:l},showHideCol:function(e,f){return this.each(function(){var c=this,d=!1,a=b.jgrid.cell_width?0:c.p.cellLayout,l;if(c.grid){"string"===typeof e&&(e=[e]);f="none"!==f?"":"none";var g=""===f?!0:!1,h=c.p.groupHeader&&("object"===typeof c.p.groupHeader||b.isFunction(c.p.groupHeader));h&&b(c).jqGrid("destroyGroupHeader",!1);b(this.p.colModel).each(function(h){if(-1!==b.inArray(this.name,
e)&&this.hidden===g){if(!0===c.p.frozenColumns&&!0===this.frozen)return!0;b("tr[role=rowheader]",c.grid.hDiv).each(function(){b(this.cells[h]).css("display",f)});b(c.rows).each(function(){b(this).hasClass("jqgroup")||b(this.cells[h]).css("display",f)});c.p.footerrow&&b("tr.footrow td:eq("+h+")",c.grid.sDiv).css("display",f);l=parseInt(this.width,10);c.p.tblwidth="none"===f?c.p.tblwidth-(l+a):c.p.tblwidth+(l+a);this.hidden=!g;d=!0;b(c).triggerHandler("jqGridShowHideCol",[g,this.name,h])}});!0===d&&
(!0!==c.p.shrinkToFit||isNaN(c.p.height)||(c.p.tblwidth+=parseInt(c.p.scrollOffset,10)),b(c).jqGrid("setGridWidth",!0===c.p.shrinkToFit?c.p.tblwidth:c.p.width));h&&b(c).jqGrid("setGroupHeaders",c.p.groupHeader)}})},hideCol:function(e){return this.each(function(){b(this).jqGrid("showHideCol",e,"none")})},showCol:function(e){return this.each(function(){b(this).jqGrid("showHideCol",e,"")})},remapColumns:function(e,f,c){function d(a){var c;c=a.length?b.makeArray(a):b.extend({},a);b.each(e,function(b){a[b]=
c[this]})}function a(a,c){b(">tr"+(c||""),a).each(function(){var a=this,c=b.makeArray(a.cells);b.each(e,function(){var b=c[this];b&&a.appendChild(b)})})}var l=this.get(0);d(l.p.colModel);d(l.p.colNames);d(l.grid.headers);a(b("thead:first",l.grid.hDiv),c&&":not(.ui-jqgrid-labels)");f&&a(b("#"+b.jgrid.jqID(l.p.id)+" tbody:first"),".jqgfirstrow, tr.jqgrow, tr.jqfoot");l.p.footerrow&&a(b("tbody:first",l.grid.sDiv));l.p.remapColumns&&(l.p.remapColumns.length?d(l.p.remapColumns):l.p.remapColumns=b.makeArray(e));
l.p.lastsort=b.inArray(l.p.lastsort,e);l.p.treeGrid&&(l.p.expColInd=b.inArray(l.p.expColInd,e));b(l).triggerHandler("jqGridRemapColumns",[e,f,c])},setGridWidth:function(e,f){return this.each(function(){if(this.grid){var c=this,d,a=0,l=b.jgrid.cell_width?0:c.p.cellLayout,g,h=0,k=!1,n=c.p.scrollOffset,m,r=0,p;"boolean"!==typeof f&&(f=c.p.shrinkToFit);if(!isNaN(e)){e=parseInt(e,10);c.grid.width=c.p.width=e;b("#gbox_"+b.jgrid.jqID(c.p.id)).css("width",e+"px");b("#gview_"+b.jgrid.jqID(c.p.id)).css("width",
e+"px");b(c.grid.bDiv).css("width",e+"px");b(c.grid.hDiv).css("width",e+"px");c.p.pager&&b(c.p.pager).css("width",e+"px");c.p.toppager&&b(c.p.toppager).css("width",e+"px");!0===c.p.toolbar[0]&&(b(c.grid.uDiv).css("width",e+"px"),"both"===c.p.toolbar[1]&&b(c.grid.ubDiv).css("width",e+"px"));c.p.footerrow&&b(c.grid.sDiv).css("width",e+"px");!1===f&&!0===c.p.forceFit&&(c.p.forceFit=!1);if(!0===f){b.each(c.p.colModel,function(){!1===this.hidden&&(d=this.widthOrg,a+=d+l,this.fixed?r+=d+l:h++)});if(0===
h)return;c.p.tblwidth=a;m=e-l*h-r;!isNaN(c.p.height)&&(b(c.grid.bDiv)[0].clientHeight<b(c.grid.bDiv)[0].scrollHeight||1===c.rows.length)&&(k=!0,m-=n);var a=0,q=0<c.grid.cols.length;b.each(c.p.colModel,function(b){!1!==this.hidden||this.fixed||(d=this.widthOrg,d=Math.round(m*d/(c.p.tblwidth-l*h-r)),0>d||(this.width=d,a+=d,c.grid.headers[b].width=d,c.grid.headers[b].el.style.width=d+"px",c.p.footerrow&&(c.grid.footers[b].style.width=d+"px"),q&&(c.grid.cols[b].style.width=d+"px"),g=b))});if(!g)return;
p=0;k?e-r-(a+l*h)!==n&&(p=e-r-(a+l*h)-n):1!==Math.abs(e-r-(a+l*h))&&(p=e-r-(a+l*h));c.p.colModel[g].width+=p;c.p.tblwidth=a+p+l*h+r;c.p.tblwidth>e?(k=c.p.tblwidth-parseInt(e,10),c.p.tblwidth=e,d=c.p.colModel[g].width-=k):d=c.p.colModel[g].width;c.grid.headers[g].width=d;c.grid.headers[g].el.style.width=d+"px";q&&(c.grid.cols[g].style.width=d+"px");c.p.footerrow&&(c.grid.footers[g].style.width=d+"px")}c.p.tblwidth&&(b("table:first",c.grid.bDiv).css("width",c.p.tblwidth+"px"),b("table:first",c.grid.hDiv).css("width",
c.p.tblwidth+"px"),c.grid.hDiv.scrollLeft=c.grid.bDiv.scrollLeft,c.p.footerrow&&b("table:first",c.grid.sDiv).css("width",c.p.tblwidth+"px"))}}})},setGridHeight:function(e){return this.each(function(){if(this.grid){var f=b(this.grid.bDiv);f.css({height:e+(isNaN(e)?"":"px")});!0===this.p.frozenColumns&&b("#"+b.jgrid.jqID(this.p.id)+"_frozen").parent().height(f.height()-16);this.p.height=e;this.p.scroll&&this.grid.populateVisible()}})},setCaption:function(e){return this.each(function(){this.p.caption=
e;b("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl",this.grid.cDiv).html(e);b(this.grid.cDiv).show()})},setLabel:function(e,f,c,d){return this.each(function(){var a=-1;if(this.grid&&void 0!==e&&(b(this.p.colModel).each(function(b){if(this.name===e)return a=b,!1}),0<=a)){var l=b("tr.ui-jqgrid-labels th:eq("+a+")",this.grid.hDiv);if(f){var g=b(".s-ico",l);b("[id^=jqgh_]",l).empty().html(f).append(g);this.p.colNames[a]=f}c&&("string"===typeof c?b(l).addClass(c):b(l).css(c));"object"===typeof d&&b(l).attr(d)}})},
setCell:function(e,f,c,d,a,l){return this.each(function(){var g=-1,h,k;if(this.grid&&(isNaN(f)?b(this.p.colModel).each(function(a){if(this.name===f)return g=a,!1}):g=parseInt(f,10),0<=g&&(h=b(this).jqGrid("getGridRowById",e)))){var n=b("td:eq("+g+")",h);if(""!==c||!0===l)h=this.formatter(e,c,g,h,"edit"),k=this.p.colModel[g].title?{title:b.jgrid.stripHtml(h)}:{},this.p.treeGrid&&0<b(".tree-wrap",b(n)).length?b("span",b(n)).html(h).attr(k):b(n).html(h).attr(k),"local"===this.p.datatype&&(h=this.p.colModel[g],
c=h.formatter&&"string"===typeof h.formatter&&"date"===h.formatter?b.unformat.date.call(this,c,h):c,k=this.p._index[b.jgrid.stripPref(this.p.idPrefix,e)],void 0!==k&&(this.p.data[k][h.name]=c));"string"===typeof d?b(n).addClass(d):d&&b(n).css(d);"object"===typeof a&&b(n).attr(a)}})},getCell:function(e,f){var c=!1;this.each(function(){var d=-1;if(this.grid&&(isNaN(f)?b(this.p.colModel).each(function(a){if(this.name===f)return d=a,!1}):d=parseInt(f,10),0<=d)){var a=b(this).jqGrid("getGridRowById",e);
if(a)try{c=b.unformat.call(this,b("td:eq("+d+")",a),{rowId:a.id,colModel:this.p.colModel[d]},d)}catch(l){c=b.jgrid.htmlDecode(b("td:eq("+d+")",a).html())}}});return c},getCol:function(e,f,c){var d=[],a,l=0,g,h,k;f="boolean"!==typeof f?!1:f;void 0===c&&(c=!1);this.each(function(){var n=-1;if(this.grid&&(isNaN(e)?b(this.p.colModel).each(function(a){if(this.name===e)return n=a,!1}):n=parseInt(e,10),0<=n)){var m=this.rows.length,r=0,p=0;if(m&&0<m){for(;r<m;){if(b(this.rows[r]).hasClass("jqgrow")){try{a=
b.unformat.call(this,b(this.rows[r].cells[n]),{rowId:this.rows[r].id,colModel:this.p.colModel[n]},n)}catch(q){a=b.jgrid.htmlDecode(this.rows[r].cells[n].innerHTML)}c?(k=parseFloat(a),isNaN(k)||(l+=k,void 0===h&&(h=g=k),g=Math.min(g,k),h=Math.max(h,k),p++)):f?d.push({id:this.rows[r].id,value:a}):d.push(a)}r++}if(c)switch(c.toLowerCase()){case "sum":d=l;break;case "avg":d=l/p;break;case "count":d=m-1;break;case "min":d=g;break;case "max":d=h}}}});return d},clearGridData:function(e){return this.each(function(){if(this.grid){"boolean"!==
typeof e&&(e=!1);if(this.p.deepempty)b("#"+b.jgrid.jqID(this.p.id)+" tbody:first tr:gt(0)").remove();else{var f=b("#"+b.jgrid.jqID(this.p.id)+" tbody:first tr:first")[0];b("#"+b.jgrid.jqID(this.p.id)+" tbody:first").empty().append(f)}this.p.footerrow&&e&&b(".ui-jqgrid-ftable td",this.grid.sDiv).html("&#160;");this.p.selrow=null;this.p.selarrrow=[];this.p.savedRow=[];this.p.records=0;this.p.page=1;this.p.lastpage=0;this.p.reccount=0;this.p.data=[];this.p._index={};this.updatepager(!0,!1)}})},getInd:function(e,
f){var c=!1,d;this.each(function(){(d=b(this).jqGrid("getGridRowById",e))&&(c=!0===f?d:d.rowIndex)});return c},bindKeys:function(e){var f=b.extend({onEnter:null,onSpace:null,onLeftKey:null,onRightKey:null,scrollingRows:!0},e||{});return this.each(function(){var c=this;b("body").is("[role]")||b("body").attr("role","application");c.p.scrollrows=f.scrollingRows;b(c).keydown(function(d){var a=b(c).find("tr[tabindex=0]")[0],e,g,h,k=c.p.treeReader.expanded_field;if(a)if(h=c.p._index[b.jgrid.stripPref(c.p.idPrefix,
a.id)],37===d.keyCode||38===d.keyCode||39===d.keyCode||40===d.keyCode){if(38===d.keyCode){g=a.previousSibling;e="";if(g)if(b(g).is(":hidden"))for(;g;){if(g=g.previousSibling,!b(g).is(":hidden")&&b(g).hasClass("jqgrow")){e=g.id;break}}else e=g.id;b(c).jqGrid("setSelection",e,!0,d);d.preventDefault()}if(40===d.keyCode){g=a.nextSibling;e="";if(g)if(b(g).is(":hidden"))for(;g;){if(g=g.nextSibling,!b(g).is(":hidden")&&b(g).hasClass("jqgrow")){e=g.id;break}}else e=g.id;b(c).jqGrid("setSelection",e,!0,d);
d.preventDefault()}37===d.keyCode&&(c.p.treeGrid&&c.p.data[h][k]&&b(a).find("div.treeclick").trigger("click"),b(c).triggerHandler("jqGridKeyLeft",[c.p.selrow]),b.isFunction(f.onLeftKey)&&f.onLeftKey.call(c,c.p.selrow));39===d.keyCode&&(c.p.treeGrid&&!c.p.data[h][k]&&b(a).find("div.treeclick").trigger("click"),b(c).triggerHandler("jqGridKeyRight",[c.p.selrow]),b.isFunction(f.onRightKey)&&f.onRightKey.call(c,c.p.selrow))}else 13===d.keyCode?(b(c).triggerHandler("jqGridKeyEnter",[c.p.selrow]),b.isFunction(f.onEnter)&&
f.onEnter.call(c,c.p.selrow)):32===d.keyCode&&(b(c).triggerHandler("jqGridKeySpace",[c.p.selrow]),b.isFunction(f.onSpace)&&f.onSpace.call(c,c.p.selrow))})})},unbindKeys:function(){return this.each(function(){b(this).unbind("keydown")})},getLocalRow:function(e){var f=!1,c;this.each(function(){void 0!==e&&(c=this.p._index[b.jgrid.stripPref(this.p.idPrefix,e)],0<=c&&(f=this.p.data[c]))});return f}})})(jQuery);
(function(a){a.fmatter={};a.extend(a.fmatter,{isBoolean:function(a){return"boolean"===typeof a},isObject:function(c){return c&&("object"===typeof c||a.isFunction(c))||!1},isString:function(a){return"string"===typeof a},isNumber:function(a){return"number"===typeof a&&isFinite(a)},isValue:function(a){return this.isObject(a)||this.isString(a)||this.isNumber(a)||this.isBoolean(a)},isEmpty:function(c){if(!this.isString(c)&&this.isValue(c))return!1;if(!this.isValue(c))return!0;c=a.trim(c).replace(/\&nbsp\;/ig,
"").replace(/\&#160\;/ig,"");return""===c}});a.fn.fmatter=function(c,b,d,e,f){var g=b;d=a.extend({},a.jgrid.formatter,d);try{g=a.fn.fmatter[c].call(this,b,d,e,f)}catch(h){}return g};a.fmatter.util={NumberFormat:function(c,b){a.fmatter.isNumber(c)||(c*=1);if(a.fmatter.isNumber(c)){var d=0>c,e=String(c),f=b.decimalSeparator||".",g;if(a.fmatter.isNumber(b.decimalPlaces)){var h=b.decimalPlaces,e=Math.pow(10,h),e=String(Math.round(c*e)/e);g=e.lastIndexOf(".");if(0<h)for(0>g?(e+=f,g=e.length-1):"."!==f&&
(e=e.replace(".",f));e.length-1-g<h;)e+="0"}if(b.thousandsSeparator){h=b.thousandsSeparator;g=e.lastIndexOf(f);g=-1<g?g:e.length;var f=e.substring(g),l=-1,k;for(k=g;0<k;k--)l++,0===l%3&&k!==g&&(!d||1<k)&&(f=h+f),f=e.charAt(k-1)+f;e=f}e=b.prefix?b.prefix+e:e;return e=b.suffix?e+b.suffix:e}return c}};a.fn.fmatter.defaultFormat=function(c,b){return a.fmatter.isValue(c)&&""!==c?c:b.defaultValue||"&#160;"};a.fn.fmatter.email=function(c,b){return a.fmatter.isEmpty(c)?a.fn.fmatter.defaultFormat(c,b):'<a href="mailto:'+
c+'">'+c+"</a>"};a.fn.fmatter.checkbox=function(c,b){var d=a.extend({},b.checkbox),e;void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(d=a.extend({},d,b.colModel.formatoptions));e=!0===d.disabled?'disabled="disabled"':"";if(a.fmatter.isEmpty(c)||void 0===c)c=a.fn.fmatter.defaultFormat(c,d);c=String(c);c=(c+"").toLowerCase();return'<input type="checkbox" '+(0>c.search(/(false|f|0|no|n|off|undefined)/i)?" checked='checked' ":"")+' value="'+c+'" offval="no" '+e+"/>"};a.fn.fmatter.link=function(c,
b){var d={target:b.target},e="";void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(d=a.extend({},d,b.colModel.formatoptions));d.target&&(e="target="+d.target);return a.fmatter.isEmpty(c)?a.fn.fmatter.defaultFormat(c,b):"<a "+e+' href="'+c+'">'+c+"</a>"};a.fn.fmatter.showlink=function(c,b){var d={baseLinkUrl:b.baseLinkUrl,showAction:b.showAction,addParam:b.addParam||"",target:b.target,idName:b.idName},e="";void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(d=a.extend({},d,b.colModel.formatoptions));
d.target&&(e="target="+d.target);d=d.baseLinkUrl+d.showAction+"?"+d.idName+"="+b.rowId+d.addParam;return a.fmatter.isString(c)||a.fmatter.isNumber(c)?"<a "+e+' href="'+d+'">'+c+"</a>":a.fn.fmatter.defaultFormat(c,b)};a.fn.fmatter.integer=function(c,b){var d=a.extend({},b.integer);void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(d=a.extend({},d,b.colModel.formatoptions));return a.fmatter.isEmpty(c)?d.defaultValue:a.fmatter.util.NumberFormat(c,d)};a.fn.fmatter.number=function(c,b){var d=a.extend({},
b.number);void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(d=a.extend({},d,b.colModel.formatoptions));return a.fmatter.isEmpty(c)?d.defaultValue:a.fmatter.util.NumberFormat(c,d)};a.fn.fmatter.currency=function(c,b){var d=a.extend({},b.currency);void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(d=a.extend({},d,b.colModel.formatoptions));return a.fmatter.isEmpty(c)?d.defaultValue:a.fmatter.util.NumberFormat(c,d)};a.fn.fmatter.date=function(c,b,d,e){d=a.extend({},b.date);void 0!==b.colModel&&
void 0!==b.colModel.formatoptions&&(d=a.extend({},d,b.colModel.formatoptions));return d.reformatAfterEdit||"edit"!==e?a.fmatter.isEmpty(c)?a.fn.fmatter.defaultFormat(c,b):a.jgrid.parseDate(d.srcformat,c,d.newformat,d):a.fn.fmatter.defaultFormat(c,b)};a.fn.fmatter.select=function(c,b){c=String(c);var d=!1,e=[],f,g;void 0!==b.colModel.formatoptions?(d=b.colModel.formatoptions.value,f=void 0===b.colModel.formatoptions.separator?":":b.colModel.formatoptions.separator,g=void 0===b.colModel.formatoptions.delimiter?
";":b.colModel.formatoptions.delimiter):void 0!==b.colModel.editoptions&&(d=b.colModel.editoptions.value,f=void 0===b.colModel.editoptions.separator?":":b.colModel.editoptions.separator,g=void 0===b.colModel.editoptions.delimiter?";":b.colModel.editoptions.delimiter);if(d){var h=!0===b.colModel.editoptions.multiple?!0:!1,l=[];h&&(l=c.split(","),l=a.map(l,function(b){return a.trim(b)}));if(a.fmatter.isString(d)){var k=d.split(g),m=0,n;for(n=0;n<k.length;n++)if(g=k[n].split(f),2<g.length&&(g[1]=a.map(g,
function(a,b){if(0<b)return a}).join(f)),h)-1<a.inArray(g[0],l)&&(e[m]=g[1],m++);else if(a.trim(g[0])===a.trim(c)){e[0]=g[1];break}}else a.fmatter.isObject(d)&&(h?e=a.map(l,function(a){return d[a]}):e[0]=d[c]||"")}c=e.join(", ");return""===c?a.fn.fmatter.defaultFormat(c,b):c};a.fn.fmatter.rowactions=function(c){var b=a(this).closest("tr.jqgrow"),d=b.attr("id"),e=a(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/,"$1"),e=a("#"+e),f=e[0],g=f.p,h=g.colModel[a.jgrid.getCellIndex(this)],
l=h.frozen?a("tr#"+d+" td:eq("+a.jgrid.getCellIndex(this)+") > div",e):a(this).parent(),k={extraparam:{}},m=function(b){a.isFunction(k.afterRestore)&&k.afterRestore.call(f,b);l.find("div.ui-inline-edit,div.ui-inline-del").show();l.find("div.ui-inline-save,div.ui-inline-cancel").hide()};void 0!==h.formatoptions&&(k=a.extend(k,h.formatoptions));void 0!==g.editOptions&&(k.editOptions=g.editOptions);void 0!==g.delOptions&&(k.delOptions=g.delOptions);b.hasClass("jqgrid-new-row")&&(k.extraparam[g.prmNames.oper]=
g.prmNames.addoper);b={keys:k.keys,oneditfunc:k.onEdit,successfunc:k.onSuccess,url:k.url,extraparam:k.extraparam,aftersavefunc:function(b,c){a.isFunction(k.afterSave)&&k.afterSave.call(f,b,c);l.find("div.ui-inline-edit,div.ui-inline-del").show();l.find("div.ui-inline-save,div.ui-inline-cancel").hide()},errorfunc:k.onError,afterrestorefunc:m,restoreAfterError:k.restoreAfterError,mtype:k.mtype};switch(c){case "edit":e.jqGrid("editRow",d,b);l.find("div.ui-inline-edit,div.ui-inline-del").hide();l.find("div.ui-inline-save,div.ui-inline-cancel").show();
e.triggerHandler("jqGridAfterGridComplete");break;case "save":e.jqGrid("saveRow",d,b)&&(l.find("div.ui-inline-edit,div.ui-inline-del").show(),l.find("div.ui-inline-save,div.ui-inline-cancel").hide(),e.triggerHandler("jqGridAfterGridComplete"));break;case "cancel":e.jqGrid("restoreRow",d,m);l.find("div.ui-inline-edit,div.ui-inline-del").show();l.find("div.ui-inline-save,div.ui-inline-cancel").hide();e.triggerHandler("jqGridAfterGridComplete");break;case "del":e.jqGrid("delGridRow",d,k.delOptions);
break;case "formedit":e.jqGrid("setSelection",d),e.jqGrid("editGridRow",d,k.editOptions)}};a.fn.fmatter.actions=function(c,b){var d={keys:!1,editbutton:!0,delbutton:!0,editformbutton:!1},e=b.rowId,f="";void 0!==b.colModel.formatoptions&&(d=a.extend(d,b.colModel.formatoptions));if(void 0===e||a.fmatter.isEmpty(e))return"";d.editformbutton?f+="<div title='"+a.jgrid.nav.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+("id='jEditButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ")+
"><span class='ui-icon ui-icon-pencil'></span></div>":d.editbutton&&(f+="<div title='"+a.jgrid.nav.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+("id='jEditButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ")+"><span class='ui-icon ui-icon-pencil'></span></div>");d.delbutton&&(f+="<div title='"+a.jgrid.nav.deltitle+"' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' "+
("id='jDeleteButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ")+"><span class='ui-icon ui-icon-trash'></span></div>");f+="<div title='"+a.jgrid.edit.bSubmit+"' style='float:left;display:none' class='ui-pg-div ui-inline-save' "+("id='jSaveButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ")+
"><span class='ui-icon ui-icon-disk'></span></div>";f+="<div title='"+a.jgrid.edit.bCancel+"' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' "+("id='jCancelButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ")+"><span class='ui-icon ui-icon-cancel'></span></div>";return"<div style='margin-left:8px;'>"+f+"</div>"};a.unformat=function(c,
b,d,e){var f,g=b.colModel.formatter,h=b.colModel.formatoptions||{},l=/([\.\*\_\'\(\)\{\}\+\?\\])/g,k=b.colModel.unformat||a.fn.fmatter[g]&&a.fn.fmatter[g].unformat;if(void 0!==k&&a.isFunction(k))f=k.call(this,a(c).text(),b,c);else if(void 0!==g&&a.fmatter.isString(g))switch(f=a.jgrid.formatter||{},g){case "integer":h=a.extend({},f.integer,h);b=h.thousandsSeparator.replace(l,"\\$1");b=RegExp(b,"g");f=a(c).text().replace(b,"");break;case "number":h=a.extend({},f.number,h);b=h.thousandsSeparator.replace(l,
"\\$1");b=RegExp(b,"g");f=a(c).text().replace(b,"").replace(h.decimalSeparator,".");break;case "currency":h=a.extend({},f.currency,h);b=h.thousandsSeparator.replace(l,"\\$1");b=RegExp(b,"g");f=a(c).text();h.prefix&&h.prefix.length&&(f=f.substr(h.prefix.length));h.suffix&&h.suffix.length&&(f=f.substr(0,f.length-h.suffix.length));f=f.replace(b,"").replace(h.decimalSeparator,".");break;case "checkbox":h=b.colModel.editoptions?b.colModel.editoptions.value.split(":"):["Yes","No"];f=a("input",c).is(":checked")?
h[0]:h[1];break;case "select":f=a.unformat.select(c,b,d,e);break;case "actions":return"";default:f=a(c).text()}return void 0!==f?f:!0===e?a(c).text():a.jgrid.htmlDecode(a(c).html())};a.unformat.select=function(c,b,d,e){d=[];c=a(c).text();if(!0===e)return c;e=a.extend({},void 0!==b.colModel.formatoptions?b.colModel.formatoptions:b.colModel.editoptions);b=void 0===e.separator?":":e.separator;var f=void 0===e.delimiter?";":e.delimiter;if(e.value){var g=e.value;e=!0===e.multiple?!0:!1;var h=[];e&&(h=
c.split(","),h=a.map(h,function(b){return a.trim(b)}));if(a.fmatter.isString(g)){var l=g.split(f),k=0,m;for(m=0;m<l.length;m++)if(f=l[m].split(b),2<f.length&&(f[1]=a.map(f,function(a,b){if(0<b)return a}).join(b)),e)-1<a.inArray(f[1],h)&&(d[k]=f[0],k++);else if(a.trim(f[1])===a.trim(c)){d[0]=f[0];break}}else if(a.fmatter.isObject(g)||a.isArray(g))e||(h[0]=c),d=a.map(h,function(b){var c;a.each(g,function(a,d){if(d===b)return c=a,!1});if(void 0!==c)return c});return d.join(", ")}return c||""};a.unformat.date=
function(c,b){var d=a.jgrid.formatter.date||{};void 0!==b.formatoptions&&(d=a.extend({},d,b.formatoptions));return a.fmatter.isEmpty(c)?a.fn.fmatter.defaultFormat(c,b):a.jgrid.parseDate(d.newformat,c,d.srcformat,d)}})(jQuery);
(function(a){a.jgrid.extend({getColProp:function(a){var c={},d=this[0];if(!d.grid)return!1;var d=d.p.colModel,h;for(h=0;h<d.length;h++)if(d[h].name===a){c=d[h];break}return c},setColProp:function(b,c){return this.each(function(){if(this.grid&&c){var d=this.p.colModel,h;for(h=0;h<d.length;h++)if(d[h].name===b){a.extend(!0,this.p.colModel[h],c);break}}})},sortGrid:function(a,c,d){return this.each(function(){var h=-1,k,e=!1;if(this.grid){a||(a=this.p.sortname);for(k=0;k<this.p.colModel.length;k++)if(this.p.colModel[k].index===
a||this.p.colModel[k].name===a){h=k;!0===this.p.frozenColumns&&!0===this.p.colModel[k].frozen&&(e=this.grid.fhDiv.find("#"+this.p.id+"_"+a));break}-1!==h&&(k=this.p.colModel[h].sortable,e||(e=this.grid.headers[h].el),"boolean"!==typeof k&&(k=!0),"boolean"!==typeof c&&(c=!1),k&&this.sortData("jqgh_"+this.p.id+"_"+a,h,c,d,e))}})},clearBeforeUnload:function(){return this.each(function(){var b=this.grid;a.isFunction(b.emptyRows)&&b.emptyRows.call(this,!0,!0);a(document).unbind("mouseup.jqGrid"+this.p.id);
a(b.hDiv).unbind("mousemove");a(this).unbind();b.dragEnd=null;b.dragMove=null;b.dragStart=null;b.emptyRows=null;b.populate=null;b.populateVisible=null;b.scrollGrid=null;b.selectionPreserver=null;b.bDiv=null;b.cDiv=null;b.hDiv=null;b.cols=null;var c,d=b.headers.length;for(c=0;c<d;c++)b.headers[c].el=null;this.grid=this.addJSONData=this.addXmlData=this.formatter=this.constructTr=this.setHeadCheckBox=this.refreshIndex=this.updatepager=this.sortData=this.formatCol=null})},GridDestroy:function(){return this.each(function(){if(this.grid){this.p.pager&&
a(this.p.pager).remove();try{a(this).jqGrid("clearBeforeUnload"),a("#gbox_"+a.jgrid.jqID(this.id)).remove()}catch(b){}}})},GridUnload:function(){return this.each(function(){if(this.grid){var b=a(this).attr("id"),c=a(this).attr("class");this.p.pager&&a(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");var d=document.createElement("table");a(d).attr({id:b});d.className=c;b=a.jgrid.jqID(this.id);a(d).removeClass("ui-jqgrid-btable");1===a(this.p.pager).parents("#gbox_"+
b).length?(a(d).insertBefore("#gbox_"+b).show(),a(this.p.pager).insertBefore("#gbox_"+b)):a(d).insertBefore("#gbox_"+b).show();a(this).jqGrid("clearBeforeUnload");a("#gbox_"+b).remove()}})},setGridState:function(b){return this.each(function(){this.grid&&("hidden"===b?(a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv","#gview_"+a.jgrid.jqID(this.p.id)).slideUp("fast"),this.p.pager&&a(this.p.pager).slideUp("fast"),this.p.toppager&&a(this.p.toppager).slideUp("fast"),!0===this.p.toolbar[0]&&("both"===this.p.toolbar[1]&&
a(this.grid.ubDiv).slideUp("fast"),a(this.grid.uDiv).slideUp("fast")),this.p.footerrow&&a(".ui-jqgrid-sdiv","#gbox_"+a.jgrid.jqID(this.p.id)).slideUp("fast"),a(".ui-jqgrid-titlebar-close span",this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"),this.p.gridstate="hidden"):"visible"===b&&(a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv","#gview_"+a.jgrid.jqID(this.p.id)).slideDown("fast"),this.p.pager&&a(this.p.pager).slideDown("fast"),this.p.toppager&&a(this.p.toppager).slideDown("fast"),
!0===this.p.toolbar[0]&&("both"===this.p.toolbar[1]&&a(this.grid.ubDiv).slideDown("fast"),a(this.grid.uDiv).slideDown("fast")),this.p.footerrow&&a(".ui-jqgrid-sdiv","#gbox_"+a.jgrid.jqID(this.p.id)).slideDown("fast"),a(".ui-jqgrid-titlebar-close span",this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n"),this.p.gridstate="visible"))})},filterToolbar:function(b){b=a.extend({autosearch:!0,searchOnEnter:!0,beforeSearch:null,afterSearch:null,beforeClear:null,afterClear:null,
searchurl:"",stringResult:!1,groupOp:"AND",defaultSearch:"bw",searchOperators:!1,resetIcon:"x",operands:{eq:"==",ne:"!",lt:"<",le:"<=",gt:">",ge:">=",bw:"^",bn:"!^","in":"=",ni:"!=",ew:"|",en:"!@",cn:"~",nc:"!~",nu:"#",nn:"!#"}},a.jgrid.search,b||{});return this.each(function(){var c=this;if(!this.ftoolbar){var d=function(){var d={},f=0,g,m,e={},q;a.each(c.p.colModel,function(){var l=a("#gs_"+a.jgrid.jqID(this.name),!0===this.frozen&&!0===c.p.frozenColumns?c.grid.fhDiv:c.grid.hDiv);m=this.index||
this.name;q=b.searchOperators?l.parent().prev().children("a").attr("soper")||b.defaultSearch:this.searchoptions&&this.searchoptions.sopt?this.searchoptions.sopt[0]:"select"===this.stype?"eq":b.defaultSearch;if((g="custom"===this.stype&&a.isFunction(this.searchoptions.custom_value)&&0<l.length&&"SPAN"===l[0].nodeName.toUpperCase()?this.searchoptions.custom_value.call(c,l.children(".customelement:first"),"get"):l.val())||"nu"===q||"nn"===q)d[m]=g,e[m]=q,f++;else try{delete c.p.postData[m]}catch(k){}});
var k=0<f?!0:!1;if(!0===b.stringResult||"local"===c.p.datatype){var l='{"groupOp":"'+b.groupOp+'","rules":[',n=0;a.each(d,function(a,b){0<n&&(l+=",");l+='{"field":"'+a+'",';l+='"op":"'+e[a]+'",';l+='"data":"'+(b+"").replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"}';n++});l+="]}";a.extend(c.p.postData,{filters:l});a.each(["searchField","searchString","searchOper"],function(a,b){c.p.postData.hasOwnProperty(b)&&delete c.p.postData[b]})}else a.extend(c.p.postData,d);var r;c.p.searchurl&&(r=c.p.url,a(c).jqGrid("setGridParam",
{url:c.p.searchurl}));var h="stop"===a(c).triggerHandler("jqGridToolbarBeforeSearch")?!0:!1;!h&&a.isFunction(b.beforeSearch)&&(h=b.beforeSearch.call(c));h||a(c).jqGrid("setGridParam",{search:k}).trigger("reloadGrid",[{page:1}]);r&&a(c).jqGrid("setGridParam",{url:r});a(c).triggerHandler("jqGridToolbarAfterSearch");a.isFunction(b.afterSearch)&&b.afterSearch.call(c)},h=function(e,f,g){a("#sopt_menu").remove();f=parseInt(f,10);g=parseInt(g,10)+18;f='<ul id="sopt_menu" class="ui-search-menu" role="menu" tabindex="0" style="font-size:'+
(a(".ui-jqgrid-view").css("font-size")||"11px")+";left:"+f+"px;top:"+g+'px;">';g=a(e).attr("soper");var k,h=[],q,p=0,l=a(e).attr("colname");for(k=c.p.colModel.length;p<k&&c.p.colModel[p].name!==l;)p++;p=c.p.colModel[p];l=a.extend({},p.searchoptions);l.sopt||(l.sopt=[],l.sopt[0]="select"===p.stype?"eq":b.defaultSearch);a.each(b.odata,function(){h.push(this.oper)});for(p=0;p<l.sopt.length;p++)q=a.inArray(l.sopt[p],h),-1!==q&&(k=g===b.odata[q].oper?"ui-state-highlight":"",f+='<li class="ui-menu-item '+
k+'" role="presentation"><a class="ui-corner-all g-menu-item" tabindex="0" role="menuitem" value="'+b.odata[q].oper+'" oper="'+b.operands[b.odata[q].oper]+'"><table cellspacing="0" cellpadding="0" border="0"><tr><td width="25px">'+b.operands[b.odata[q].oper]+"</td><td>"+b.odata[q].text+"</td></tr></table></a></li>");f+="</ul>";a("body").append(f);a("#sopt_menu").addClass("ui-menu ui-widget ui-widget-content ui-corner-all");a("#sopt_menu > li > a").hover(function(){a(this).addClass("ui-state-hover")},
function(){a(this).removeClass("ui-state-hover")}).click(function(f){f=a(this).attr("value");var g=a(this).attr("oper");a(c).triggerHandler("jqGridToolbarSelectOper",[f,g,e]);a("#sopt_menu").hide();a(e).text(g).attr("soper",f);!0===b.autosearch&&(g=a(e).parent().next().children()[0],(a(g).val()||"nu"===f||"nn"===f)&&d())})},k=a("<tr class='ui-search-toolbar' role='rowheader'></tr>"),e;a.each(c.p.colModel,function(h){var f=this,g,m;m="";var x="=",q,p=a("<th role='columnheader' class='ui-state-default ui-th-column ui-th-"+
c.p.direction+"'></th>"),l=a("<div style='position:relative;height:100%;padding-right:0.3em;padding-left:0.3em;'></div>"),n=a("<table class='ui-search-table' cellspacing='0'><tr><td class='ui-search-oper'></td><td class='ui-search-input'></td><td class='ui-search-clear'></td></tr></table>");!0===this.hidden&&a(p).css("display","none");this.search=!1===this.search?!1:!0;void 0===this.stype&&(this.stype="text");g=a.extend({},this.searchoptions||{});if(this.search){if(b.searchOperators){m=g.sopt?g.sopt[0]:
"select"===f.stype?"eq":b.defaultSearch;for(q=0;q<b.odata.length;q++)if(b.odata[q].oper===m){x=b.operands[m]||"";break}m="<a title='"+(null!=g.searchtitle?g.searchtitle:b.operandTitle)+"' style='padding-right: 0.5em;' soper='"+m+"' class='soptclass' colname='"+this.name+"'>"+x+"</a>"}a("td:eq(0)",n).attr("colindex",h).append(m);void 0===g.clearSearch&&(g.clearSearch=!0);g.clearSearch?(m=b.resetTitle||"Clear Search Value",a("td:eq(2)",n).append("<a title='"+m+"' style='padding-right: 0.3em;padding-left: 0.3em;' class='clearsearchclass'>"+
b.resetIcon+"</a>")):a("td:eq(2)",n).hide();switch(this.stype){case "select":if(m=this.surl||g.dataUrl)a(l).append(n),a.ajax(a.extend({url:m,dataType:"html",success:function(e){void 0!==g.buildSelect?(e=g.buildSelect(e))&&a("td:eq(1)",n).append(e):a("td:eq(1)",n).append(e);void 0!==g.defaultValue&&a("select",l).val(g.defaultValue);a("select",l).attr({name:f.index||f.name,id:"gs_"+f.name});g.attr&&a("select",l).attr(g.attr);a("select",l).css({width:"100%"});a.jgrid.bindEv.call(c,a("select",l)[0],g);
!0===b.autosearch&&a("select",l).change(function(){d();return!1});e=null}},a.jgrid.ajaxOptions,c.p.ajaxSelectOptions||{}));else{var r,w,u;f.searchoptions?(r=void 0===f.searchoptions.value?"":f.searchoptions.value,w=void 0===f.searchoptions.separator?":":f.searchoptions.separator,u=void 0===f.searchoptions.delimiter?";":f.searchoptions.delimiter):f.editoptions&&(r=void 0===f.editoptions.value?"":f.editoptions.value,w=void 0===f.editoptions.separator?":":f.editoptions.separator,u=void 0===f.editoptions.delimiter?
";":f.editoptions.delimiter);if(r){var t=document.createElement("select");t.style.width="100%";a(t).attr({name:f.index||f.name,id:"gs_"+f.name});var v;if("string"===typeof r)for(m=r.split(u),v=0;v<m.length;v++)r=m[v].split(w),u=document.createElement("option"),u.value=r[0],u.innerHTML=r[1],t.appendChild(u);else if("object"===typeof r)for(v in r)r.hasOwnProperty(v)&&(u=document.createElement("option"),u.value=v,u.innerHTML=r[v],t.appendChild(u));void 0!==g.defaultValue&&a(t).val(g.defaultValue);g.attr&&
a(t).attr(g.attr);a(l).append(n);a.jgrid.bindEv.call(c,t,g);a("td:eq(1)",n).append(t);!0===b.autosearch&&a(t).change(function(){d();return!1})}}break;case "text":w=void 0!==g.defaultValue?g.defaultValue:"";a("td:eq(1)",n).append("<input type='text' style='width:100%;padding:0px;' name='"+(f.index||f.name)+"' id='gs_"+f.name+"' value='"+w+"'/>");a(l).append(n);g.attr&&a("input",l).attr(g.attr);a.jgrid.bindEv.call(c,a("input",l)[0],g);!0===b.autosearch&&(b.searchOnEnter?a("input",l).keypress(function(a){return 13===
(a.charCode||a.keyCode||0)?(d(),!1):this}):a("input",l).keydown(function(a){switch(a.which){case 13:return!1;case 9:case 16:case 37:case 38:case 39:case 40:case 27:break;default:e&&clearTimeout(e),e=setTimeout(function(){d()},500)}}));break;case "custom":a("td:eq(1)",n).append("<span style='width:95%;padding:0px;' name='"+(f.index||f.name)+"' id='gs_"+f.name+"'/>");a(l).append(n);try{if(a.isFunction(g.custom_element))if(t=g.custom_element.call(c,void 0!==g.defaultValue?g.defaultValue:"",g))t=a(t).addClass("customelement"),
a(l).find(">span").append(t);else throw"e2";else throw"e1";}catch(y){"e1"===y&&a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_element' "+a.jgrid.edit.msg.nodefined,a.jgrid.edit.bClose),"e2"===y?a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_element' "+a.jgrid.edit.msg.novalue,a.jgrid.edit.bClose):a.jgrid.info_dialog(a.jgrid.errors.errcap,"string"===typeof y?y:y.message,a.jgrid.edit.bClose)}}}a(p).append(l);a(k).append(p);b.searchOperators||a("td:eq(0)",n).hide()});a("table thead",
c.grid.hDiv).append(k);b.searchOperators&&(a(".soptclass",k).click(function(b){var c=a(this).offset();h(this,c.left,c.top);b.stopPropagation()}),a("body").on("click",function(b){"soptclass"!==b.target.className&&a("#sopt_menu").hide()}));a(".clearsearchclass",k).click(function(e){e=a(this).parents("tr:first");var f=parseInt(a("td.ui-search-oper",e).attr("colindex"),10),g=a.extend({},c.p.colModel[f].searchoptions||{}),g=g.defaultValue?g.defaultValue:"";"select"===c.p.colModel[f].stype?g?a("td.ui-search-input select",
e).val(g):a("td.ui-search-input select",e)[0].selectedIndex=0:a("td.ui-search-input input",e).val(g);!0===b.autosearch&&d()});this.ftoolbar=!0;this.triggerToolbar=d;this.clearToolbar=function(d){var f={},g=0,e;d="boolean"!==typeof d?!0:d;a.each(c.p.colModel,function(){var b,d=a("#gs_"+a.jgrid.jqID(this.name),!0===this.frozen&&!0===c.p.frozenColumns?c.grid.fhDiv:c.grid.hDiv);this.searchoptions&&void 0!==this.searchoptions.defaultValue&&(b=this.searchoptions.defaultValue);e=this.index||this.name;switch(this.stype){case "select":d.find("option").each(function(c){0===
c&&(this.selected=!0);if(a(this).val()===b)return this.selected=!0,!1});if(void 0!==b)f[e]=b,g++;else try{delete c.p.postData[e]}catch(h){}break;case "text":d.val(b||"");if(void 0!==b)f[e]=b,g++;else try{delete c.p.postData[e]}catch(k){}break;case "custom":a.isFunction(this.searchoptions.custom_value)&&0<d.length&&"SPAN"===d[0].nodeName.toUpperCase()&&this.searchoptions.custom_value.call(c,d.children(".customelement:first"),"set",b||"")}});var k=0<g?!0:!1;c.p.resetsearch=!0;if(!0===b.stringResult||
"local"===c.p.datatype){var h='{"groupOp":"'+b.groupOp+'","rules":[',p=0;a.each(f,function(a,b){0<p&&(h+=",");h+='{"field":"'+a+'",';h+='"op":"eq",';h+='"data":"'+(b+"").replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"}';p++});h+="]}";a.extend(c.p.postData,{filters:h});a.each(["searchField","searchString","searchOper"],function(a,b){c.p.postData.hasOwnProperty(b)&&delete c.p.postData[b]})}else a.extend(c.p.postData,f);var l;c.p.searchurl&&(l=c.p.url,a(c).jqGrid("setGridParam",{url:c.p.searchurl}));var n=
"stop"===a(c).triggerHandler("jqGridToolbarBeforeClear")?!0:!1;!n&&a.isFunction(b.beforeClear)&&(n=b.beforeClear.call(c));n||d&&a(c).jqGrid("setGridParam",{search:k}).trigger("reloadGrid",[{page:1}]);l&&a(c).jqGrid("setGridParam",{url:l});a(c).triggerHandler("jqGridToolbarAfterClear");a.isFunction(b.afterClear)&&b.afterClear()};this.toggleToolbar=function(){var b=a("tr.ui-search-toolbar",c.grid.hDiv),d=!0===c.p.frozenColumns?a("tr.ui-search-toolbar",c.grid.fhDiv):!1;"none"===b.css("display")?(b.show(),
d&&d.show()):(b.hide(),d&&d.hide())}}})},destroyFilterToolbar:function(){return this.each(function(){this.ftoolbar&&(this.toggleToolbar=this.clearToolbar=this.triggerToolbar=null,this.ftoolbar=!1,a(this.grid.hDiv).find("table thead tr.ui-search-toolbar").remove())})},destroyGroupHeader:function(b){void 0===b&&(b=!0);return this.each(function(){var c,d,h,k,e,s;d=this.grid;var f=a("table.ui-jqgrid-htable thead",d.hDiv),g=this.p.colModel;if(d){a(this).unbind(".setGroupHeaders");c=a("<tr>",{role:"rowheader"}).addClass("ui-jqgrid-labels");
k=d.headers;d=0;for(h=k.length;d<h;d++){e=g[d].hidden?"none":"";e=a(k[d].el).width(k[d].width).css("display",e);try{e.removeAttr("rowSpan")}catch(m){e.attr("rowSpan",1)}c.append(e);s=e.children("span.ui-jqgrid-resize");0<s.length&&(s[0].style.height="");e.children("div")[0].style.top=""}a(f).children("tr.ui-jqgrid-labels").remove();a(f).prepend(c);!0===b&&a(this).jqGrid("setGridParam",{groupHeader:null})}})},setGroupHeaders:function(b){b=a.extend({useColSpanStyle:!1,groupHeaders:[]},b||{});return this.each(function(){this.p.groupHeader=
b;var c,d,h=0,k,e,s,f,g,m=this.p.colModel,x=m.length,q=this.grid.headers,p=a("table.ui-jqgrid-htable",this.grid.hDiv),l=p.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header");k=p.children("thead");var n=p.find(".jqg-first-row-header");void 0===n[0]?n=a("<tr>",{role:"row","aria-hidden":"true"}).addClass("jqg-first-row-header").css("height","auto"):n.empty();var r,w=function(a,b){var c=b.length,d;for(d=0;d<c;d++)if(b[d].startColumnName===a)return d;return-1};a(this).prepend(k);
k=a("<tr>",{role:"rowheader"}).addClass("ui-jqgrid-labels jqg-third-row-header");for(c=0;c<x;c++)if(s=q[c].el,f=a(s),d=m[c],e={height:"0px",width:q[c].width+"px",display:d.hidden?"none":""},a("<th>",{role:"gridcell"}).css(e).addClass("ui-first-th-"+this.p.direction).appendTo(n),s.style.width="",e=w(d.name,b.groupHeaders),0<=e){e=b.groupHeaders[e];h=e.numberOfColumns;g=e.titleText;for(e=d=0;e<h&&c+e<x;e++)m[c+e].hidden||d++;e=a("<th>").attr({role:"columnheader"}).addClass("ui-state-default ui-th-column-header ui-th-"+
this.p.direction).css({height:"22px","border-top":"0 none"}).html(g);0<d&&e.attr("colspan",String(d));this.p.headertitles&&e.attr("title",e.text());0===d&&e.hide();f.before(e);k.append(s);h-=1}else 0===h?b.useColSpanStyle?f.attr("rowspan","2"):(a("<th>",{role:"columnheader"}).addClass("ui-state-default ui-th-column-header ui-th-"+this.p.direction).css({display:d.hidden?"none":"","border-top":"0 none"}).insertBefore(f),k.append(s)):(k.append(s),h--);m=a(this).children("thead");m.prepend(n);k.insertAfter(l);
p.append(m);b.useColSpanStyle&&(p.find("span.ui-jqgrid-resize").each(function(){var b=a(this).parent();b.is(":visible")&&(this.style.cssText="height: "+b.height()+"px !important; cursor: col-resize;")}),p.find("div.ui-jqgrid-sortable").each(function(){var b=a(this),c=b.parent();c.is(":visible")&&c.is(":has(span.ui-jqgrid-resize)")&&b.css("top",(c.height()-b.outerHeight())/2+"px")}));r=m.find("tr.jqg-first-row-header");a(this).bind("jqGridResizeStop.setGroupHeaders",function(a,b,c){r.find("th").eq(c).width(b)})})},
setFrozenColumns:function(){return this.each(function(){if(this.grid){var b=this,c=b.p.colModel,d=0,h=c.length,k=-1,e=!1;if(!0!==b.p.subGrid&&!0!==b.p.treeGrid&&!0!==b.p.cellEdit&&!b.p.sortable&&!b.p.scroll){b.p.rownumbers&&d++;for(b.p.multiselect&&d++;d<h;){if(!0===c[d].frozen)e=!0,k=d;else break;d++}if(0<=k&&e){c=b.p.caption?a(b.grid.cDiv).outerHeight():0;d=a(".ui-jqgrid-htable","#gview_"+a.jgrid.jqID(b.p.id)).height();b.p.toppager&&(c+=a(b.grid.topDiv).outerHeight());!0===b.p.toolbar[0]&&"bottom"!==
b.p.toolbar[1]&&(c+=a(b.grid.uDiv).outerHeight());b.grid.fhDiv=a('<div style="position:absolute;left:0px;top:'+c+"px;height:"+d+'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');b.grid.fbDiv=a('<div style="position:absolute;left:0px;top:'+(parseInt(c,10)+parseInt(d,10)+1)+'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');a("#gview_"+a.jgrid.jqID(b.p.id)).append(b.grid.fhDiv);c=a(".ui-jqgrid-htable","#gview_"+a.jgrid.jqID(b.p.id)).clone(!0);if(b.p.groupHeader){a("tr.jqg-first-row-header, tr.jqg-third-row-header",
c).each(function(){a("th:gt("+k+")",this).remove()});var s=-1,f=-1,g,m;a("tr.jqg-second-row-header th",c).each(function(){g=parseInt(a(this).attr("colspan"),10);if(m=parseInt(a(this).attr("rowspan"),10))s++,f++;g&&(s+=g,f++);if(s===k)return!1});s!==k&&(f=k);a("tr.jqg-second-row-header",c).each(function(){a("th:gt("+f+")",this).remove()})}else a("tr",c).each(function(){a("th:gt("+k+")",this).remove()});a(c).width(1);a(b.grid.fhDiv).append(c).mousemove(function(a){if(b.grid.resizing)return b.grid.dragMove(a),
!1});a(b).bind("jqGridResizeStop.setFrozenColumns",function(c,d,e){c=a(".ui-jqgrid-htable",b.grid.fhDiv);a("th:eq("+e+")",c).width(d);c=a(".ui-jqgrid-btable",b.grid.fbDiv);a("tr:first td:eq("+e+")",c).width(d)});a(b).bind("jqGridSortCol.setFrozenColumns",function(c,d,e){c=a("tr.ui-jqgrid-labels:last th:eq("+b.p.lastsort+")",b.grid.fhDiv);d=a("tr.ui-jqgrid-labels:last th:eq("+e+")",b.grid.fhDiv);a("span.ui-grid-ico-sort",c).addClass("ui-state-disabled");a(c).attr("aria-selected","false");a("span.ui-icon-"+
b.p.sortorder,d).removeClass("ui-state-disabled");a(d).attr("aria-selected","true");b.p.viewsortcols[0]||b.p.lastsort===e||(a("span.s-ico",c).hide(),a("span.s-ico",d).show())});a("#gview_"+a.jgrid.jqID(b.p.id)).append(b.grid.fbDiv);a(b.grid.bDiv).scroll(function(){a(b.grid.fbDiv).scrollTop(a(this).scrollTop())});!0===b.p.hoverrows&&a("#"+a.jgrid.jqID(b.p.id)).unbind("mouseover").unbind("mouseout");a(b).bind("jqGridAfterGridComplete.setFrozenColumns",function(){a("#"+a.jgrid.jqID(b.p.id)+"_frozen").remove();
a(b.grid.fbDiv).height(a(b.grid.bDiv).height()-16);var c=a("#"+a.jgrid.jqID(b.p.id)).clone(!0);a("tr[role=row]",c).each(function(){a("td[role=gridcell]:gt("+k+")",this).remove()});a(c).width(1).attr("id",b.p.id+"_frozen");a(b.grid.fbDiv).append(c);!0===b.p.hoverrows&&(a("tr.jqgrow",c).hover(function(){a(this).addClass("ui-state-hover");a("#"+a.jgrid.jqID(this.id),"#"+a.jgrid.jqID(b.p.id)).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover");a("#"+a.jgrid.jqID(this.id),"#"+
a.jgrid.jqID(b.p.id)).removeClass("ui-state-hover")}),a("tr.jqgrow","#"+a.jgrid.jqID(b.p.id)).hover(function(){a(this).addClass("ui-state-hover");a("#"+a.jgrid.jqID(this.id),"#"+a.jgrid.jqID(b.p.id)+"_frozen").addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover");a("#"+a.jgrid.jqID(this.id),"#"+a.jgrid.jqID(b.p.id)+"_frozen").removeClass("ui-state-hover")}));c=null});b.grid.hDiv.loading||a(b).triggerHandler("jqGridAfterGridComplete");b.p.frozenColumns=!0}}}})},destroyFrozenColumns:function(){return this.each(function(){if(this.grid&&
!0===this.p.frozenColumns){a(this.grid.fhDiv).remove();a(this.grid.fbDiv).remove();this.grid.fhDiv=null;this.grid.fbDiv=null;a(this).unbind(".setFrozenColumns");if(!0===this.p.hoverrows){var b;a("#"+a.jgrid.jqID(this.p.id)).bind("mouseover",function(c){b=a(c.target).closest("tr.jqgrow");"ui-subgrid"!==a(b).attr("class")&&a(b).addClass("ui-state-hover")}).bind("mouseout",function(c){b=a(c.target).closest("tr.jqgrow");a(b).removeClass("ui-state-hover")})}this.p.frozenColumns=!1}})}})})(jQuery);
(function(a){a.extend(a.jgrid,{showModal:function(a){a.w.show()},closeModal:function(a){a.w.hide().attr("aria-hidden","true");a.o&&a.o.remove()},hideModal:function(d,b){b=a.extend({jqm:!0,gb:""},b||{});if(b.onClose){var c=b.gb&&"string"===typeof b.gb&&"#gbox_"===b.gb.substr(0,6)?b.onClose.call(a("#"+b.gb.substr(6))[0],d):b.onClose(d);if("boolean"===typeof c&&!c)return}if(a.fn.jqm&&!0===b.jqm)a(d).attr("aria-hidden","true").jqmHide();else{if(""!==b.gb)try{a(".jqgrid-overlay:first",b.gb).hide()}catch(g){}a(d).hide().attr("aria-hidden",
"true")}},findPos:function(a){var b=0,c=0;if(a.offsetParent){do b+=a.offsetLeft,c+=a.offsetTop;while(a=a.offsetParent)}return[b,c]},createModal:function(d,b,c,g,e,h,f){c=a.extend(!0,{},a.jgrid.jqModal||{},c);var k=document.createElement("div"),l,m=this;f=a.extend({},f||{});l="rtl"===a(c.gbox).attr("dir")?!0:!1;k.className="ui-widget ui-widget-content ui-corner-all ui-jqdialog";k.id=d.themodal;var n=document.createElement("div");n.className="ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
n.id=d.modalhead;a(n).append("<span class='ui-jqdialog-title'>"+c.caption+"</span>");var q=a("<a class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function(){q.addClass("ui-state-hover")},function(){q.removeClass("ui-state-hover")}).append("<span class='ui-icon ui-icon-closethick'></span>");a(n).append(q);l?(k.dir="rtl",a(".ui-jqdialog-title",n).css("float","right"),a(".ui-jqdialog-titlebar-close",n).css("left","0.3em")):(k.dir="ltr",a(".ui-jqdialog-title",n).css("float","left"),a(".ui-jqdialog-titlebar-close",
n).css("right","0.3em"));var p=document.createElement("div");a(p).addClass("ui-jqdialog-content ui-widget-content").attr("id",d.modalcontent);a(p).append(b);k.appendChild(p);a(k).prepend(n);!0===h?a("body").append(k):"string"===typeof h?a(h).append(k):a(k).insertBefore(g);a(k).css(f);void 0===c.jqModal&&(c.jqModal=!0);b={};if(a.fn.jqm&&!0===c.jqModal)0===c.left&&0===c.top&&c.overlay&&(f=[],f=a.jgrid.findPos(e),c.left=f[0]+4,c.top=f[1]+4),b.top=c.top+"px",b.left=c.left;else if(0!==c.left||0!==c.top)b.left=
c.left,b.top=c.top+"px";a("a.ui-jqdialog-titlebar-close",n).click(function(){var b=a("#"+a.jgrid.jqID(d.themodal)).data("onClose")||c.onClose,e=a("#"+a.jgrid.jqID(d.themodal)).data("gbox")||c.gbox;m.hideModal("#"+a.jgrid.jqID(d.themodal),{gb:e,jqm:c.jqModal,onClose:b});return!1});0!==c.width&&c.width||(c.width=300);0!==c.height&&c.height||(c.height=200);c.zIndex||(g=a(g).parents("*[role=dialog]").filter(":first").css("z-index"),c.zIndex=g?parseInt(g,10)+2:950);g=0;l&&b.left&&!h&&(g=a(c.gbox).width()-
(isNaN(c.width)?0:parseInt(c.width,10))-8,b.left=parseInt(b.left,10)+parseInt(g,10));b.left&&(b.left+="px");a(k).css(a.extend({width:isNaN(c.width)?"auto":c.width+"px",height:isNaN(c.height)?"auto":c.height+"px",zIndex:c.zIndex,overflow:"hidden"},b)).attr({tabIndex:"-1",role:"dialog","aria-labelledby":d.modalhead,"aria-hidden":"true"});void 0===c.drag&&(c.drag=!0);void 0===c.resize&&(c.resize=!0);if(c.drag)if(a(n).css("cursor","move"),a.fn.jqDrag)a(k).jqDrag(n);else try{a(k).draggable({handle:a("#"+
a.jgrid.jqID(n.id))})}catch(r){}if(c.resize)if(a.fn.jqResize)a(k).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se'></div>"),a("#"+a.jgrid.jqID(d.themodal)).jqResize(".jqResize",d.scrollelm?"#"+a.jgrid.jqID(d.scrollelm):!1);else try{a(k).resizable({handles:"se, sw",alsoResize:d.scrollelm?"#"+a.jgrid.jqID(d.scrollelm):!1})}catch(s){}!0===c.closeOnEscape&&a(k).keydown(function(b){27==b.which&&(b=a("#"+a.jgrid.jqID(d.themodal)).data("onClose")||c.onClose,
m.hideModal("#"+a.jgrid.jqID(d.themodal),{gb:c.gbox,jqm:c.jqModal,onClose:b}))})},viewModal:function(d,b){b=a.extend({toTop:!0,overlay:10,modal:!1,overlayClass:"ui-widget-overlay",onShow:a.jgrid.showModal,onHide:a.jgrid.closeModal,gbox:"",jqm:!0,jqM:!0},b||{});if(a.fn.jqm&&!0===b.jqm)b.jqM?a(d).attr("aria-hidden","false").jqm(b).jqmShow():a(d).attr("aria-hidden","false").jqmShow();else{""!==b.gbox&&(a(".jqgrid-overlay:first",b.gbox).show(),a(d).data("gbox",b.gbox));a(d).show().attr("aria-hidden",
"false");try{a(":input:visible",d)[0].focus()}catch(c){}}},info_dialog:function(d,b,c,g){var e={width:290,height:"auto",dataheight:"auto",drag:!0,resize:!1,left:250,top:170,zIndex:1E3,jqModal:!0,modal:!1,closeOnEscape:!0,align:"center",buttonalign:"center",buttons:[]};a.extend(!0,e,a.jgrid.jqModal||{},{caption:"<b>"+d+"</b>"},g||{});var h=e.jqModal,f=this;a.fn.jqm&&!h&&(h=!1);d="";if(0<e.buttons.length)for(g=0;g<e.buttons.length;g++)void 0===e.buttons[g].id&&(e.buttons[g].id="info_button_"+g),d+=
"<a id='"+e.buttons[g].id+"' class='fm-button ui-state-default ui-corner-all'>"+e.buttons[g].text+"</a>";g=isNaN(e.dataheight)?e.dataheight:e.dataheight+"px";b="<div id='info_id'>"+("<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:"+g+";"+("text-align:"+e.align+";")+"'>"+b+"</div>");b+=c?"<div class='ui-widget-content ui-helper-clearfix' style='text-align:"+e.buttonalign+";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a id='closedialog' class='fm-button ui-state-default ui-corner-all'>"+
c+"</a>"+d+"</div>":""!==d?"<div class='ui-widget-content ui-helper-clearfix' style='text-align:"+e.buttonalign+";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>"+d+"</div>":"";b+="</div>";try{"false"===a("#info_dialog").attr("aria-hidden")&&a.jgrid.hideModal("#info_dialog",{jqm:h}),a("#info_dialog").remove()}catch(k){}a.jgrid.createModal({themodal:"info_dialog",modalhead:"info_head",modalcontent:"info_content",scrollelm:"infocnt"},b,e,"","",!0);d&&a.each(e.buttons,
function(b){a("#"+a.jgrid.jqID(this.id),"#info_id").bind("click",function(){e.buttons[b].onClick.call(a("#info_dialog"));return!1})});a("#closedialog","#info_id").click(function(){f.hideModal("#info_dialog",{jqm:h,onClose:a("#info_dialog").data("onClose")||e.onClose,gb:a("#info_dialog").data("gbox")||e.gbox});return!1});a(".fm-button","#info_dialog").hover(function(){a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")});a.isFunction(e.beforeOpen)&&e.beforeOpen();a.jgrid.viewModal("#info_dialog",
{onHide:function(a){a.w.hide().remove();a.o&&a.o.remove()},modal:e.modal,jqm:h});a.isFunction(e.afterOpen)&&e.afterOpen();try{a("#info_dialog").focus()}catch(l){}},bindEv:function(d,b){a.isFunction(b.dataInit)&&b.dataInit.call(this,d,b);b.dataEvents&&a.each(b.dataEvents,function(){void 0!==this.data?a(d).bind(this.type,this.data,this.fn):a(d).bind(this.type,this.fn)})},createEl:function(d,b,c,g,e){function h(b,d,c){var e="dataInit dataEvents dataUrl buildSelect sopt searchhidden defaultValue attr custom_element custom_value".split(" ");
void 0!==c&&a.isArray(c)&&a.merge(e,c);a.each(d,function(d,c){-1===a.inArray(d,e)&&a(b).attr(d,c)});d.hasOwnProperty("id")||a(b).attr("id",a.jgrid.randId())}var f="",k=this;switch(d){case "textarea":f=document.createElement("textarea");g?b.cols||a(f).css({width:"98%"}):b.cols||(b.cols=20);b.rows||(b.rows=2);if("&nbsp;"===c||"&#160;"===c||1===c.length&&160===c.charCodeAt(0))c="";f.value=c;h(f,b);a(f).attr({role:"textbox",multiline:"true"});break;case "checkbox":f=document.createElement("input");f.type=
"checkbox";b.value?(d=b.value.split(":"),c===d[0]&&(f.checked=!0,f.defaultChecked=!0),f.value=d[0],a(f).attr("offval",d[1])):(d=(c+"").toLowerCase(),0>d.search(/(false|f|0|no|n|off|undefined)/i)&&""!==d?(f.checked=!0,f.defaultChecked=!0,f.value=c):f.value="on",a(f).attr("offval","off"));h(f,b,["value"]);a(f).attr("role","checkbox");break;case "select":f=document.createElement("select");f.setAttribute("role","select");g=[];!0===b.multiple?(d=!0,f.multiple="multiple",a(f).attr("aria-multiselectable",
"true")):d=!1;if(void 0!==b.dataUrl){d=b.name?String(b.id).substring(0,String(b.id).length-String(b.name).length-1):String(b.id);var l=b.postData||e.postData;k.p&&k.p.idPrefix&&(d=a.jgrid.stripPref(k.p.idPrefix,d));a.ajax(a.extend({url:a.isFunction(b.dataUrl)?b.dataUrl.call(k,d,c,String(b.name)):b.dataUrl,type:"GET",dataType:"html",data:a.isFunction(l)?l.call(k,d,c,String(b.name)):l,context:{elem:f,options:b,vl:c},success:function(b){var d=[],c=this.elem,e=this.vl,f=a.extend({},this.options),g=!0===
f.multiple;b=a.isFunction(f.buildSelect)?f.buildSelect.call(k,b):b;"string"===typeof b&&(b=a(a.trim(b)).html());b&&(a(c).append(b),h(c,f,l?["postData"]:void 0),void 0===f.size&&(f.size=g?3:1),g?(d=e.split(","),d=a.map(d,function(b){return a.trim(b)})):d[0]=a.trim(e),setTimeout(function(){a("option",c).each(function(b){0===b&&c.multiple&&(this.selected=!1);a(this).attr("role","option");if(-1<a.inArray(a.trim(a(this).text()),d)||-1<a.inArray(a.trim(a(this).val()),d))this.selected="selected"})},0))}},
e||{}))}else if(b.value){var m;void 0===b.size&&(b.size=d?3:1);d&&(g=c.split(","),g=a.map(g,function(b){return a.trim(b)}));"function"===typeof b.value&&(b.value=b.value());var n,q,p=void 0===b.separator?":":b.separator;e=void 0===b.delimiter?";":b.delimiter;if("string"===typeof b.value)for(n=b.value.split(e),m=0;m<n.length;m++)q=n[m].split(p),2<q.length&&(q[1]=a.map(q,function(a,b){if(0<b)return a}).join(p)),e=document.createElement("option"),e.setAttribute("role","option"),e.value=q[0],e.innerHTML=
q[1],f.appendChild(e),d||a.trim(q[0])!==a.trim(c)&&a.trim(q[1])!==a.trim(c)||(e.selected="selected"),d&&(-1<a.inArray(a.trim(q[1]),g)||-1<a.inArray(a.trim(q[0]),g))&&(e.selected="selected");else if("object"===typeof b.value)for(m in p=b.value,p)p.hasOwnProperty(m)&&(e=document.createElement("option"),e.setAttribute("role","option"),e.value=m,e.innerHTML=p[m],f.appendChild(e),d||a.trim(m)!==a.trim(c)&&a.trim(p[m])!==a.trim(c)||(e.selected="selected"),d&&(-1<a.inArray(a.trim(p[m]),g)||-1<a.inArray(a.trim(m),
g))&&(e.selected="selected"));h(f,b,["value"])}break;case "text":case "password":case "button":m="button"===d?"button":"textbox";f=document.createElement("input");f.type=d;f.value=c;h(f,b);"button"!==d&&(g?b.size||a(f).css({width:"98%"}):b.size||(b.size=20));a(f).attr("role",m);break;case "image":case "file":f=document.createElement("input");f.type=d;h(f,b);break;case "custom":f=document.createElement("span");try{if(a.isFunction(b.custom_element))if(p=b.custom_element.call(k,c,b))p=a(p).addClass("customelement").attr({id:b.id,
name:b.name}),a(f).empty().append(p);else throw"e2";else throw"e1";}catch(r){"e1"===r&&a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_element' "+a.jgrid.edit.msg.nodefined,a.jgrid.edit.bClose),"e2"===r?a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_element' "+a.jgrid.edit.msg.novalue,a.jgrid.edit.bClose):a.jgrid.info_dialog(a.jgrid.errors.errcap,"string"===typeof r?r:r.message,a.jgrid.edit.bClose)}}return f},checkDate:function(a,b){var c={},g;a=a.toLowerCase();g=-1!==a.indexOf("/")?
"/":-1!==a.indexOf("-")?"-":-1!==a.indexOf(".")?".":"/";a=a.split(g);b=b.split(g);if(3!==b.length)return!1;var e=-1,h,f=g=-1,k;for(k=0;k<a.length;k++)h=isNaN(b[k])?0:parseInt(b[k],10),c[a[k]]=h,h=a[k],-1!==h.indexOf("y")&&(e=k),-1!==h.indexOf("m")&&(f=k),-1!==h.indexOf("d")&&(g=k);h="y"===a[e]||"yyyy"===a[e]?4:"yy"===a[e]?2:-1;k=[0,31,29,31,30,31,30,31,31,30,31,30,31];var l;if(-1===e)return!1;l=c[a[e]].toString();2===h&&1===l.length&&(h=1);if(l.length!==h||0===c[a[e]]&&"00"!==b[e]||-1===f)return!1;
l=c[a[f]].toString();if(1>l.length||1>c[a[f]]||12<c[a[f]]||-1===g)return!1;l=c[a[g]].toString();if(!(h=1>l.length)&&!(h=1>c[a[g]])&&!(h=31<c[a[g]])){if(h=2===c[a[f]])e=c[a[e]],h=c[a[g]]>(0!==e%4||0===e%100&&0!==e%400?28:29);h=h||c[a[g]]>k[c[a[f]]]}return h?!1:!0},isEmpty:function(a){return a.match(/^\s+$/)||""===a?!0:!1},checkTime:function(d){var b=/^(\d{1,2}):(\d{2})([apAP][Mm])?$/;if(!a.jgrid.isEmpty(d))if(d=d.match(b)){if(d[3]){if(1>d[1]||12<d[1])return!1}else if(23<d[1])return!1;if(59<d[2])return!1}else return!1;
return!0},checkValues:function(d,b,c,g){var e,h,f;f=this.p.colModel;if(void 0===c)if("string"===typeof b)for(c=0,g=f.length;c<g;c++){if(f[c].name===b){e=f[c].editrules;b=c;null!=f[c].formoptions&&(h=f[c].formoptions.label);break}}else 0<=b&&(e=f[b].editrules);else e=c,h=void 0===g?"_":g;if(e){h||(h=null!=this.p.colNames?this.p.colNames[b]:f[b].label);if(!0===e.required&&a.jgrid.isEmpty(d))return[!1,h+": "+a.jgrid.edit.msg.required,""];c=!1===e.required?!1:!0;if(!0===e.number&&(!1!==c||!a.jgrid.isEmpty(d))&&
isNaN(d))return[!1,h+": "+a.jgrid.edit.msg.number,""];if(void 0!==e.minValue&&!isNaN(e.minValue)&&parseFloat(d)<parseFloat(e.minValue))return[!1,h+": "+a.jgrid.edit.msg.minValue+" "+e.minValue,""];if(void 0!==e.maxValue&&!isNaN(e.maxValue)&&parseFloat(d)>parseFloat(e.maxValue))return[!1,h+": "+a.jgrid.edit.msg.maxValue+" "+e.maxValue,""];if(!(!0!==e.email||!1===c&&a.jgrid.isEmpty(d)||(g=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
g.test(d))))return[!1,h+": "+a.jgrid.edit.msg.email,""];if(!(!0!==e.integer||!1===c&&a.jgrid.isEmpty(d)||!isNaN(d)&&0===d%1&&-1===d.indexOf(".")))return[!1,h+": "+a.jgrid.edit.msg.integer,""];if(!(!0!==e.date||!1===c&&a.jgrid.isEmpty(d)||(f[b].formatoptions&&f[b].formatoptions.newformat?(f=f[b].formatoptions.newformat,a.jgrid.formatter.date.masks.hasOwnProperty(f)&&(f=a.jgrid.formatter.date.masks[f])):f=f[b].datefmt||"Y-m-d",a.jgrid.checkDate(f,d))))return[!1,h+": "+a.jgrid.edit.msg.date+" - "+f,
""];if(!0===e.time&&!(!1===c&&a.jgrid.isEmpty(d)||a.jgrid.checkTime(d)))return[!1,h+": "+a.jgrid.edit.msg.date+" - hh:mm (am/pm)",""];if(!(!0!==e.url||!1===c&&a.jgrid.isEmpty(d)||(g=/^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i,g.test(d))))return[!1,h+": "+a.jgrid.edit.msg.url,""];if(!0===e.custom&&(!1!==c||!a.jgrid.isEmpty(d)))return a.isFunction(e.custom_func)?(d=e.custom_func.call(this,d,h,b),a.isArray(d)?d:[!1,a.jgrid.edit.msg.customarray,
""]):[!1,a.jgrid.edit.msg.customfcheck,""]}return[!0,"",""]}})})(jQuery);
(function(a){var b={};a.jgrid.extend({searchGrid:function(b){b=a.extend(!0,{recreateFilter:!1,drag:!0,sField:"searchField",sValue:"searchString",sOper:"searchOper",sFilter:"filters",loadDefaults:!0,beforeShowSearch:null,afterShowSearch:null,onInitializeSearch:null,afterRedraw:null,afterChange:null,closeAfterSearch:!1,closeAfterReset:!1,closeOnEscape:!1,searchOnEnter:!1,multipleSearch:!1,multipleGroup:!1,top:0,left:0,jqModal:!0,modal:!1,resize:!0,width:450,height:"auto",dataheight:"auto",showQuery:!1,
errorcheck:!0,sopt:null,stringResult:void 0,onClose:null,onSearch:null,onReset:null,toTop:!0,overlay:30,columns:[],tmplNames:null,tmplFilters:null,tmplLabel:" Template: ",showOnLoad:!1,layer:null,operands:{eq:"=",ne:"<>",lt:"<",le:"<=",gt:">",ge:">=",bw:"LIKE",bn:"NOT LIKE","in":"IN",ni:"NOT IN",ew:"LIKE",en:"NOT LIKE",cn:"LIKE",nc:"NOT LIKE",nu:"IS NULL",nn:"ISNOT NULL"}},a.jgrid.search,b||{});return this.each(function(){function c(c){w=a(e).triggerHandler("jqGridFilterBeforeShow",[c]);void 0===
w&&(w=!0);w&&a.isFunction(b.beforeShowSearch)&&(w=b.beforeShowSearch.call(e,c));w&&(a.jgrid.viewModal("#"+a.jgrid.jqID(s.themodal),{gbox:"#gbox_"+a.jgrid.jqID(h),jqm:b.jqModal,modal:b.modal,overlay:b.overlay,toTop:b.toTop}),a(e).triggerHandler("jqGridFilterAfterShow",[c]),a.isFunction(b.afterShowSearch)&&b.afterShowSearch.call(e,c))}var e=this;if(e.grid){var h="fbox_"+e.p.id,w=!0,t=!0,s={themodal:"searchmod"+h,modalhead:"searchhd"+h,modalcontent:"searchcnt"+h,scrollelm:h},r=e.p.postData[b.sFilter];
"string"===typeof r&&(r=a.jgrid.parse(r));!0===b.recreateFilter&&a("#"+a.jgrid.jqID(s.themodal)).remove();if(void 0!==a("#"+a.jgrid.jqID(s.themodal))[0])c(a("#fbox_"+a.jgrid.jqID(+e.p.id)));else{var f=a("<div><div id='"+h+"' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_"+a.jgrid.jqID(e.p.id)),k="left",u="";"rtl"===e.p.direction&&(k="right",u=" style='text-align:left'",f.attr("dir","rtl"));var x=a.extend([],e.p.colModel),d="<a id='"+h+"_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>"+
b.Find+"</a>",v="<a id='"+h+"_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>"+b.Reset+"</a>",g="",m="",p,q=!1,y=-1;b.showQuery&&(g="<a id='"+h+"_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>");b.columns.length?(x=b.columns,y=0,p=x[0].index||x[0].name):a.each(x,function(a,b){b.label||(b.label=e.p.colNames[a]);if(!q){var c=
void 0===b.search?!0:b.search,d=!0===b.hidden;if(b.searchoptions&&!0===b.searchoptions.searchhidden&&c||c&&!d)q=!0,p=b.index||b.name,y=a}});if(!r&&p||!1===b.multipleSearch){var D="eq";0<=y&&x[y].searchoptions&&x[y].searchoptions.sopt?D=x[y].searchoptions.sopt[0]:b.sopt&&b.sopt.length&&(D=b.sopt[0]);r={groupOp:"AND",rules:[{field:p,op:D,data:""}]}}q=!1;b.tmplNames&&b.tmplNames.length&&(q=!0,m=b.tmplLabel,m+="<select class='ui-template'>",m+="<option value='default'>Default</option>",a.each(b.tmplNames,
function(a,b){m+="<option value='"+a+"'>"+b+"</option>"}),m+="</select>");k="<table class='EditTable' style='border:0px none;margin-top:5px' id='"+h+"_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:"+k+"'>"+v+m+"</td><td class='EditButton' "+u+">"+g+d+"</td></tr></tbody></table>";h=a.jgrid.jqID(h);a("#"+h).jqFilter({columns:x,filter:b.loadDefaults?r:null,showQuery:b.showQuery,errorcheck:b.errorcheck,sopt:b.sopt,
groupButton:b.multipleGroup,ruleButtons:b.multipleSearch,afterRedraw:b.afterRedraw,ops:b.odata,operands:b.operands,ajaxSelectOptions:e.p.ajaxSelectOptions,groupOps:b.groupOps,onChange:function(){this.p.showQuery&&a(".query",this).html(this.toUserFriendlyString());a.isFunction(b.afterChange)&&b.afterChange.call(e,a("#"+h),b)},direction:e.p.direction,id:e.p.id});f.append(k);q&&b.tmplFilters&&b.tmplFilters.length&&a(".ui-template",f).bind("change",function(){var c=a(this).val();"default"===c?a("#"+h).jqFilter("addFilter",
r):a("#"+h).jqFilter("addFilter",b.tmplFilters[parseInt(c,10)]);return!1});!0===b.multipleGroup&&(b.multipleSearch=!0);a(e).triggerHandler("jqGridFilterInitialize",[a("#"+h)]);a.isFunction(b.onInitializeSearch)&&b.onInitializeSearch.call(e,a("#"+h));b.gbox="#gbox_"+h;b.layer?a.jgrid.createModal(s,f,b,"#gview_"+a.jgrid.jqID(e.p.id),a("#gbox_"+a.jgrid.jqID(e.p.id))[0],"#"+a.jgrid.jqID(b.layer),{position:"relative"}):a.jgrid.createModal(s,f,b,"#gview_"+a.jgrid.jqID(e.p.id),a("#gbox_"+a.jgrid.jqID(e.p.id))[0]);
(b.searchOnEnter||b.closeOnEscape)&&a("#"+a.jgrid.jqID(s.themodal)).keydown(function(c){var d=a(c.target);if(b.searchOnEnter&&13===c.which&&!(d.hasClass("add-group")||d.hasClass("add-rule")||d.hasClass("delete-group")||d.hasClass("delete-rule")||d.hasClass("fm-button")&&d.is("[id$=_query]")))return a("#"+h+"_search").click(),!1;if(b.closeOnEscape&&27===c.which)return a("#"+a.jgrid.jqID(s.modalhead)).find(".ui-jqdialog-titlebar-close").click(),!1});g&&a("#"+h+"_query").bind("click",function(){a(".queryresult",
f).toggle();return!1});void 0===b.stringResult&&(b.stringResult=b.multipleSearch);a("#"+h+"_search").bind("click",function(){var c=a("#"+h),d={},n,g;c.find(".input-elm:focus").change();g=c.jqFilter("filterData");if(b.errorcheck&&(c[0].hideError(),b.showQuery||c.jqFilter("toSQLString"),c[0].p.error))return c[0].showError(),!1;if(b.stringResult){try{n=xmlJsonClass.toJson(g,"","",!1)}catch(f){try{n=JSON.stringify(g)}catch(k){}}"string"===typeof n&&(d[b.sFilter]=n,a.each([b.sField,b.sValue,b.sOper],function(){d[this]=
""}))}else b.multipleSearch?(d[b.sFilter]=g,a.each([b.sField,b.sValue,b.sOper],function(){d[this]=""})):(d[b.sField]=g.rules[0].field,d[b.sValue]=g.rules[0].data,d[b.sOper]=g.rules[0].op,d[b.sFilter]="");e.p.search=!0;a.extend(e.p.postData,d);t=a(e).triggerHandler("jqGridFilterSearch");void 0===t&&(t=!0);t&&a.isFunction(b.onSearch)&&(t=b.onSearch.call(e,e.p.filters));!1!==t&&a(e).trigger("reloadGrid",[{page:1}]);b.closeAfterSearch&&a.jgrid.hideModal("#"+a.jgrid.jqID(s.themodal),{gb:"#gbox_"+a.jgrid.jqID(e.p.id),
jqm:b.jqModal,onClose:b.onClose});return!1});a("#"+h+"_reset").bind("click",function(){var c={},d=a("#"+h);e.p.search=!1;e.p.resetsearch=!0;!1===b.multipleSearch?c[b.sField]=c[b.sValue]=c[b.sOper]="":c[b.sFilter]="";d[0].resetFilter();q&&a(".ui-template",f).val("default");a.extend(e.p.postData,c);t=a(e).triggerHandler("jqGridFilterReset");void 0===t&&(t=!0);t&&a.isFunction(b.onReset)&&(t=b.onReset.call(e));!1!==t&&a(e).trigger("reloadGrid",[{page:1}]);b.closeAfterReset&&a.jgrid.hideModal("#"+a.jgrid.jqID(s.themodal),
{gb:"#gbox_"+a.jgrid.jqID(e.p.id),jqm:b.jqModal,onClose:b.onClose});return!1});c(a("#"+h));a(".fm-button:not(.ui-state-disabled)",f).hover(function(){a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")})}}})},editGridRow:function(z,c){c=a.extend(!0,{top:0,left:0,width:300,datawidth:"auto",height:"auto",dataheight:"auto",modal:!1,overlay:30,drag:!0,resize:!0,url:null,mtype:"POST",clearAfterAdd:!0,closeAfterEdit:!1,reloadAfterSubmit:!0,onInitializeForm:null,beforeInitData:null,
beforeShowForm:null,afterShowForm:null,beforeSubmit:null,afterSubmit:null,onclickSubmit:null,afterComplete:null,onclickPgButtons:null,afterclickPgButtons:null,editData:{},recreateForm:!1,jqModal:!0,closeOnEscape:!1,addedrow:"first",topinfo:"",bottominfo:"",saveicon:[],closeicon:[],savekey:[!1,13],navkeys:[!1,38,40],checkOnSubmit:!1,checkOnUpdate:!1,_savedData:{},processing:!1,onClose:null,ajaxEditOptions:{},serializeEditData:null,viewPagerButtons:!0,overlayClass:"ui-widget-overlay"},a.jgrid.edit,
c||{});b[a(this)[0].p.id]=c;return this.each(function(){function e(){a(p+" > tbody > tr > td > .FormElement").each(function(){var b=a(".customelement",this);if(b.length){var c=a(b[0]).attr("name");a.each(d.p.colModel,function(){if(this.name===c&&this.editoptions&&a.isFunction(this.editoptions.custom_value)){try{if(l[c]=this.editoptions.custom_value.call(d,a("#"+a.jgrid.jqID(c),p),"get"),void 0===l[c])throw"e1";}catch(b){"e1"===b?a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_value' "+
a.jgrid.edit.msg.novalue,a.jgrid.edit.bClose):a.jgrid.info_dialog(a.jgrid.errors.errcap,b.message,a.jgrid.edit.bClose)}return!0}})}else{switch(a(this).get(0).type){case "checkbox":a(this).is(":checked")?l[this.name]=a(this).val():(b=a(this).attr("offval"),l[this.name]=b);break;case "select-one":l[this.name]=a("option:selected",this).val();break;case "select-multiple":l[this.name]=a(this).val();l[this.name]=l[this.name]?l[this.name].join(","):"";a("option:selected",this).each(function(b,c){a(c).text()});
break;case "password":case "text":case "textarea":case "button":l[this.name]=a(this).val()}d.p.autoencode&&(l[this.name]=a.jgrid.htmlEncode(l[this.name]))}});return!0}function h(c,e,n,f){var k,l,p,h=0,q,m,r,C=[],u=!1,z="",t;for(t=1;t<=f;t++)z+="<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";"_empty"!==c&&(u=a(e).jqGrid("getInd",c));a(e.p.colModel).each(function(t){k=this.name;m=(l=this.editrules&&!0===this.editrules.edithidden?!1:!0===this.hidden?!0:!1)?"style='display:none'":"";
if("cb"!==k&&"subgrid"!==k&&!0===this.editable&&"rn"!==k){if(!1===u)q="";else if(k===e.p.ExpandColumn&&!0===e.p.treeGrid)q=a("td[role='gridcell']:eq("+t+")",e.rows[u]).text();else{try{q=a.unformat.call(e,a("td[role='gridcell']:eq("+t+")",e.rows[u]),{rowId:c,colModel:this},t)}catch(w){q=this.edittype&&"textarea"===this.edittype?a("td[role='gridcell']:eq("+t+")",e.rows[u]).text():a("td[role='gridcell']:eq("+t+")",e.rows[u]).html()}if(!q||"&nbsp;"===q||"&#160;"===q||1===q.length&&160===q.charCodeAt(0))q=
""}var s=a.extend({},this.editoptions||{},{id:k,name:k}),y=a.extend({},{elmprefix:"",elmsuffix:"",rowabove:!1,rowcontent:""},this.formoptions||{}),v=parseInt(y.rowpos,10)||h+1,A=parseInt(2*(parseInt(y.colpos,10)||1),10);"_empty"===c&&s.defaultValue&&(q=a.isFunction(s.defaultValue)?s.defaultValue.call(d):s.defaultValue);this.edittype||(this.edittype="text");d.p.autoencode&&(q=a.jgrid.htmlDecode(q));r=a.jgrid.createEl.call(d,this.edittype,s,q,!1,a.extend({},a.jgrid.ajaxOptions,e.p.ajaxSelectOptions||
{}));if(b[d.p.id].checkOnSubmit||b[d.p.id].checkOnUpdate)b[d.p.id]._savedData[k]=q;a(r).addClass("FormElement");-1<a.inArray(this.edittype,["text","textarea","password","select"])&&a(r).addClass("ui-widget-content ui-corner-all");p=a(n).find("tr[rowpos="+v+"]");if(y.rowabove){var x=a("<tr><td class='contentinfo' colspan='"+2*f+"'>"+y.rowcontent+"</td></tr>");a(n).append(x);x[0].rp=v}0===p.length&&(p=a("<tr "+m+" rowpos='"+v+"'></tr>").addClass("FormData").attr("id","tr_"+k),a(p).append(z),a(n).append(p),
p[0].rp=v);a("td:eq("+(A-2)+")",p[0]).html(void 0===y.label?e.p.colNames[t]:y.label);a("td:eq("+(A-1)+")",p[0]).append(y.elmprefix).append(r).append(y.elmsuffix);"custom"===this.edittype&&a.isFunction(s.custom_value)&&s.custom_value.call(d,a("#"+k,"#"+g),"set",q);a.jgrid.bindEv.call(d,r,s);C[h]=t;h++}});0<h&&(t=a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+(2*f-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='"+e.p.id+"_id' value='"+
c+"'/></td></tr>"),t[0].rp=h+999,a(n).append(t),b[d.p.id].checkOnSubmit||b[d.p.id].checkOnUpdate)&&(b[d.p.id]._savedData[e.p.id+"_id"]=c);return C}function w(c,e,n){var g,k=0,f,l,q,h,r;if(b[d.p.id].checkOnSubmit||b[d.p.id].checkOnUpdate)b[d.p.id]._savedData={},b[d.p.id]._savedData[e.p.id+"_id"]=c;var m=e.p.colModel;if("_empty"===c)a(m).each(function(){g=this.name;q=a.extend({},this.editoptions||{});(l=a("#"+a.jgrid.jqID(g),"#"+n))&&l.length&&null!==l[0]&&(h="","custom"===this.edittype&&a.isFunction(q.custom_value)?
q.custom_value.call(d,a("#"+g,"#"+n),"set",h):q.defaultValue?(h=a.isFunction(q.defaultValue)?q.defaultValue.call(d):q.defaultValue,"checkbox"===l[0].type?(r=h.toLowerCase(),0>r.search(/(false|f|0|no|n|off|undefined)/i)&&""!==r?(l[0].checked=!0,l[0].defaultChecked=!0,l[0].value=h):(l[0].checked=!1,l[0].defaultChecked=!1)):l.val(h)):"checkbox"===l[0].type?(l[0].checked=!1,l[0].defaultChecked=!1,h=a(l).attr("offval")):l[0].type&&"select"===l[0].type.substr(0,6)?l[0].selectedIndex=0:l.val(h),!0===b[d.p.id].checkOnSubmit||
b[d.p.id].checkOnUpdate)&&(b[d.p.id]._savedData[g]=h)}),a("#id_g","#"+n).val(c);else{var t=a(e).jqGrid("getInd",c,!0);t&&(a('td[role="gridcell"]',t).each(function(l){g=m[l].name;if("cb"!==g&&"subgrid"!==g&&"rn"!==g&&!0===m[l].editable){if(g===e.p.ExpandColumn&&!0===e.p.treeGrid)f=a(this).text();else try{f=a.unformat.call(e,a(this),{rowId:c,colModel:m[l]},l)}catch(q){f="textarea"===m[l].edittype?a(this).text():a(this).html()}d.p.autoencode&&(f=a.jgrid.htmlDecode(f));if(!0===b[d.p.id].checkOnSubmit||
b[d.p.id].checkOnUpdate)b[d.p.id]._savedData[g]=f;g=a.jgrid.jqID(g);switch(m[l].edittype){case "password":case "text":case "button":case "image":case "textarea":if("&nbsp;"===f||"&#160;"===f||1===f.length&&160===f.charCodeAt(0))f="";a("#"+g,"#"+n).val(f);break;case "select":var h=f.split(","),h=a.map(h,function(b){return a.trim(b)});a("#"+g+" option","#"+n).each(function(){m[l].editoptions.multiple||a.trim(f)!==a.trim(a(this).text())&&h[0]!==a.trim(a(this).text())&&h[0]!==a.trim(a(this).val())?m[l].editoptions.multiple?
-1<a.inArray(a.trim(a(this).text()),h)||-1<a.inArray(a.trim(a(this).val()),h)?this.selected=!0:this.selected=!1:this.selected=!1:this.selected=!0});break;case "checkbox":f=String(f);if(m[l].editoptions&&m[l].editoptions.value)if(m[l].editoptions.value.split(":")[0]===f)a("#"+g,"#"+n)[d.p.useProp?"prop":"attr"]({checked:!0,defaultChecked:!0});else a("#"+g,"#"+n)[d.p.useProp?"prop":"attr"]({checked:!1,defaultChecked:!1});else f=f.toLowerCase(),0>f.search(/(false|f|0|no|n|off|undefined)/i)&&""!==f?(a("#"+
g,"#"+n)[d.p.useProp?"prop":"attr"]("checked",!0),a("#"+g,"#"+n)[d.p.useProp?"prop":"attr"]("defaultChecked",!0)):(a("#"+g,"#"+n)[d.p.useProp?"prop":"attr"]("checked",!1),a("#"+g,"#"+n)[d.p.useProp?"prop":"attr"]("defaultChecked",!1));break;case "custom":try{if(m[l].editoptions&&a.isFunction(m[l].editoptions.custom_value))m[l].editoptions.custom_value.call(d,a("#"+g,"#"+n),"set",f);else throw"e1";}catch(p){"e1"===p?a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_value' "+a.jgrid.edit.msg.nodefined,
a.jgrid.edit.bClose):a.jgrid.info_dialog(a.jgrid.errors.errcap,p.message,a.jgrid.edit.bClose)}}k++}}),0<k&&a("#id_g",p).val(c))}}function t(){a.each(d.p.colModel,function(a,b){b.editoptions&&!0===b.editoptions.NullIfEmpty&&l.hasOwnProperty(b.name)&&""===l[b.name]&&(l[b.name]="null")})}function s(){var e,n=[!0,"",""],f={},k=d.p.prmNames,h,m,r,u,s,C=a(d).triggerHandler("jqGridAddEditBeforeCheckValues",[a("#"+g),B]);C&&"object"===typeof C&&(l=C);a.isFunction(b[d.p.id].beforeCheckValues)&&(C=b[d.p.id].beforeCheckValues.call(d,
l,a("#"+g),B))&&"object"===typeof C&&(l=C);for(r in l)if(l.hasOwnProperty(r)&&(n=a.jgrid.checkValues.call(d,l[r],r),!1===n[0]))break;t();n[0]&&(f=a(d).triggerHandler("jqGridAddEditClickSubmit",[b[d.p.id],l,B]),void 0===f&&a.isFunction(b[d.p.id].onclickSubmit)&&(f=b[d.p.id].onclickSubmit.call(d,b[d.p.id],l,B)||{}),n=a(d).triggerHandler("jqGridAddEditBeforeSubmit",[l,a("#"+g),B]),void 0===n&&(n=[!0,"",""]),n[0]&&a.isFunction(b[d.p.id].beforeSubmit)&&(n=b[d.p.id].beforeSubmit.call(d,l,a("#"+g),B)));
if(n[0]&&!b[d.p.id].processing){b[d.p.id].processing=!0;a("#sData",p+"_2").addClass("ui-state-active");m=k.oper;h=k.id;l[m]="_empty"===a.trim(l[d.p.id+"_id"])?k.addoper:k.editoper;l[m]!==k.addoper?l[h]=l[d.p.id+"_id"]:void 0===l[h]&&(l[h]=l[d.p.id+"_id"]);delete l[d.p.id+"_id"];l=a.extend(l,b[d.p.id].editData,f);if(!0===d.p.treeGrid)for(s in l[m]===k.addoper&&(u=a(d).jqGrid("getGridParam","selrow"),l["adjacency"===d.p.treeGridModel?d.p.treeReader.parent_id_field:"parent_id"]=u),d.p.treeReader)d.p.treeReader.hasOwnProperty(s)&&
(f=d.p.treeReader[s],!l.hasOwnProperty(f)||l[m]===k.addoper&&"parent_id_field"===s||delete l[f]);l[h]=a.jgrid.stripPref(d.p.idPrefix,l[h]);s=a.extend({url:b[d.p.id].url||a(d).jqGrid("getGridParam","editurl"),type:b[d.p.id].mtype,data:a.isFunction(b[d.p.id].serializeEditData)?b[d.p.id].serializeEditData.call(d,l):l,complete:function(f,r){var s;l[h]=d.p.idPrefix+l[h];300<=f.status&&304!==f.status?(n[0]=!1,n[1]=a(d).triggerHandler("jqGridAddEditErrorTextFormat",[f,B]),a.isFunction(b[d.p.id].errorTextFormat)?
n[1]=b[d.p.id].errorTextFormat.call(d,f,B):n[1]=r+" Status: '"+f.statusText+"'. Error code: "+f.status):(n=a(d).triggerHandler("jqGridAddEditAfterSubmit",[f,l,B]),void 0===n&&(n=[!0,"",""]),n[0]&&a.isFunction(b[d.p.id].afterSubmit)&&(n=b[d.p.id].afterSubmit.call(d,f,l,B)));if(!1===n[0])a("#FormError>td",p).html(n[1]),a("#FormError",p).show();else if(d.p.autoencode&&a.each(l,function(b,c){l[b]=a.jgrid.htmlDecode(c)}),l[m]===k.addoper?(n[2]||(n[2]=a.jgrid.randId()),l[h]=n[2],b[d.p.id].reloadAfterSubmit?
a(d).trigger("reloadGrid"):!0===d.p.treeGrid?a(d).jqGrid("addChildNode",n[2],u,l):a(d).jqGrid("addRowData",n[2],l,c.addedrow),b[d.p.id].closeAfterAdd?(!0!==d.p.treeGrid&&a(d).jqGrid("setSelection",n[2]),a.jgrid.hideModal("#"+a.jgrid.jqID(q.themodal),{gb:"#gbox_"+a.jgrid.jqID(v),jqm:c.jqModal,onClose:b[d.p.id].onClose})):b[d.p.id].clearAfterAdd&&w("_empty",d,g)):(b[d.p.id].reloadAfterSubmit?(a(d).trigger("reloadGrid"),b[d.p.id].closeAfterEdit||setTimeout(function(){a(d).jqGrid("setSelection",l[h])},
1E3)):!0===d.p.treeGrid?a(d).jqGrid("setTreeRow",l[h],l):a(d).jqGrid("setRowData",l[h],l),b[d.p.id].closeAfterEdit&&a.jgrid.hideModal("#"+a.jgrid.jqID(q.themodal),{gb:"#gbox_"+a.jgrid.jqID(v),jqm:c.jqModal,onClose:b[d.p.id].onClose})),a.isFunction(b[d.p.id].afterComplete)&&(e=f,setTimeout(function(){a(d).triggerHandler("jqGridAddEditAfterComplete",[e,l,a("#"+g),B]);b[d.p.id].afterComplete.call(d,e,l,a("#"+g),B);e=null},500)),b[d.p.id].checkOnSubmit||b[d.p.id].checkOnUpdate)if(a("#"+g).data("disabled",
!1),"_empty"!==b[d.p.id]._savedData[d.p.id+"_id"])for(s in b[d.p.id]._savedData)b[d.p.id]._savedData.hasOwnProperty(s)&&l[s]&&(b[d.p.id]._savedData[s]=l[s]);b[d.p.id].processing=!1;a("#sData",p+"_2").removeClass("ui-state-active");try{a(":input:visible","#"+g)[0].focus()}catch(t){}}},a.jgrid.ajaxOptions,b[d.p.id].ajaxEditOptions);s.url||b[d.p.id].useDataProxy||(a.isFunction(d.p.dataProxy)?b[d.p.id].useDataProxy=!0:(n[0]=!1,n[1]+=" "+a.jgrid.errors.nourl));n[0]&&(b[d.p.id].useDataProxy?(f=d.p.dataProxy.call(d,
s,"set_"+d.p.id),void 0===f&&(f=[!0,""]),!1===f[0]?(n[0]=!1,n[1]=f[1]||"Error deleting the selected row!"):(s.data.oper===k.addoper&&b[d.p.id].closeAfterAdd&&a.jgrid.hideModal("#"+a.jgrid.jqID(q.themodal),{gb:"#gbox_"+a.jgrid.jqID(v),jqm:c.jqModal,onClose:b[d.p.id].onClose}),s.data.oper===k.editoper&&b[d.p.id].closeAfterEdit&&a.jgrid.hideModal("#"+a.jgrid.jqID(q.themodal),{gb:"#gbox_"+a.jgrid.jqID(v),jqm:c.jqModal,onClose:b[d.p.id].onClose}))):a.ajax(s))}!1===n[0]&&(a("#FormError>td",p).html(n[1]),
a("#FormError",p).show())}function r(a,b){var c=!1,d;for(d in a)if(a.hasOwnProperty(d)&&a[d]!=b[d]){c=!0;break}return c}function f(){var c=!0;a("#FormError",p).hide();b[d.p.id].checkOnUpdate&&(l={},e(),M=r(l,b[d.p.id]._savedData))&&(a("#"+g).data("disabled",!0),a(".confirm","#"+q.themodal).show(),c=!1);return c}function k(){var b;if("_empty"!==z&&void 0!==d.p.savedRow&&0<d.p.savedRow.length&&a.isFunction(a.fn.jqGrid.restoreRow))for(b=0;b<d.p.savedRow.length;b++)if(d.p.savedRow[b].id==z){a(d).jqGrid("restoreRow",
z);break}}function u(b,c){var d=c[1].length-1;0===b?a("#pData",p+"_2").addClass("ui-state-disabled"):void 0!==c[1][b-1]&&a("#"+a.jgrid.jqID(c[1][b-1])).hasClass("ui-state-disabled")?a("#pData",p+"_2").addClass("ui-state-disabled"):a("#pData",p+"_2").removeClass("ui-state-disabled");b===d?a("#nData",p+"_2").addClass("ui-state-disabled"):void 0!==c[1][b+1]&&a("#"+a.jgrid.jqID(c[1][b+1])).hasClass("ui-state-disabled")?a("#nData",p+"_2").addClass("ui-state-disabled"):a("#nData",p+"_2").removeClass("ui-state-disabled")}
function x(){var b=a(d).jqGrid("getDataIDs"),c=a("#id_g",p).val();return[a.inArray(c,b),b]}var d=this;if(d.grid&&z){var v=d.p.id,g="FrmGrid_"+v,m="TblGrid_"+v,p="#"+a.jgrid.jqID(m),q={themodal:"editmod"+v,modalhead:"edithd"+v,modalcontent:"editcnt"+v,scrollelm:g},y=a.isFunction(b[d.p.id].beforeShowForm)?b[d.p.id].beforeShowForm:!1,D=a.isFunction(b[d.p.id].afterShowForm)?b[d.p.id].afterShowForm:!1,A=a.isFunction(b[d.p.id].beforeInitData)?b[d.p.id].beforeInitData:!1,E=a.isFunction(b[d.p.id].onInitializeForm)?
b[d.p.id].onInitializeForm:!1,n=!0,C=1,I=0,l,M,B,g=a.jgrid.jqID(g);"new"===z?(z="_empty",B="add",c.caption=b[d.p.id].addCaption):(c.caption=b[d.p.id].editCaption,B="edit");c.recreateForm||a(d).data("formProp")&&a.extend(b[a(this)[0].p.id],a(d).data("formProp"));var N=!0;c.checkOnUpdate&&c.jqModal&&!c.modal&&(N=!1);var H=isNaN(b[a(this)[0].p.id].dataheight)?b[a(this)[0].p.id].dataheight:b[a(this)[0].p.id].dataheight+"px",n=isNaN(b[a(this)[0].p.id].datawidth)?b[a(this)[0].p.id].datawidth:b[a(this)[0].p.id].datawidth+
"px",H=a("<form name='FormPost' id='"+g+"' class='FormGrid' onSubmit='return false;' style='width:"+n+";overflow:auto;position:relative;height:"+H+";'></form>").data("disabled",!1),F=a("<table id='"+m+"' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),n=a(d).triggerHandler("jqGridAddEditBeforeInitData",[a("#"+g),B]);void 0===n&&(n=!0);n&&A&&(n=A.call(d,a("#"+g),B));if(!1!==n){k();a(d.p.colModel).each(function(){var a=this.formoptions;C=Math.max(C,a?a.colpos||
0:0);I=Math.max(I,a?a.rowpos||0:0)});a(H).append(F);A=a("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='"+2*C+"'></td></tr>");A[0].rp=0;a(F).append(A);A=a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='"+2*C+"'>"+b[d.p.id].topinfo+"</td></tr>");A[0].rp=0;a(F).append(A);var n=(A="rtl"===d.p.direction?!0:!1)?"nData":"pData",G=A?"pData":"nData";h(z,d,F,C);var n="<a id='"+n+"' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
G="<a id='"+G+"' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",J="<a id='sData' class='fm-button ui-state-default ui-corner-all'>"+c.bSubmit+"</a>",K="<a id='cData' class='fm-button ui-state-default ui-corner-all'>"+c.bCancel+"</a>",m="<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='"+m+"_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>"+
(A?G+n:n+G)+"</td><td class='EditButton'>"+J+K+"</td></tr>"+("<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>"+b[d.p.id].bottominfo+"</td></tr>"),m=m+"</tbody></table>";if(0<I){var L=[];a.each(a(F)[0].rows,function(a,b){L[a]=b});L.sort(function(a,b){return a.rp>b.rp?1:a.rp<b.rp?-1:0});a.each(L,function(b,c){a("tbody",F).append(c)})}c.gbox="#gbox_"+a.jgrid.jqID(v);var O=!1;!0===c.closeOnEscape&&(c.closeOnEscape=!1,O=!0);m=a("<div></div>").append(H).append(m);a.jgrid.createModal(q,
m,b[a(this)[0].p.id],"#gview_"+a.jgrid.jqID(d.p.id),a("#gbox_"+a.jgrid.jqID(d.p.id))[0]);A&&(a("#pData, #nData",p+"_2").css("float","right"),a(".EditButton",p+"_2").css("text-align","left"));b[d.p.id].topinfo&&a(".tinfo",p).show();b[d.p.id].bottominfo&&a(".binfo",p+"_2").show();m=m=null;a("#"+a.jgrid.jqID(q.themodal)).keydown(function(e){var n=e.target;if(!0===a("#"+g).data("disabled"))return!1;if(!0===b[d.p.id].savekey[0]&&e.which===b[d.p.id].savekey[1]&&"TEXTAREA"!==n.tagName)return a("#sData",
p+"_2").trigger("click"),!1;if(27===e.which){if(!f())return!1;O&&a.jgrid.hideModal("#"+a.jgrid.jqID(q.themodal),{gb:c.gbox,jqm:c.jqModal,onClose:b[d.p.id].onClose});return!1}if(!0===b[d.p.id].navkeys[0]){if("_empty"===a("#id_g",p).val())return!0;if(e.which===b[d.p.id].navkeys[1])return a("#pData",p+"_2").trigger("click"),!1;if(e.which===b[d.p.id].navkeys[2])return a("#nData",p+"_2").trigger("click"),!1}});c.checkOnUpdate&&(a("a.ui-jqdialog-titlebar-close span","#"+a.jgrid.jqID(q.themodal)).removeClass("jqmClose"),
a("a.ui-jqdialog-titlebar-close","#"+a.jgrid.jqID(q.themodal)).unbind("click").click(function(){if(!f())return!1;a.jgrid.hideModal("#"+a.jgrid.jqID(q.themodal),{gb:"#gbox_"+a.jgrid.jqID(v),jqm:c.jqModal,onClose:b[d.p.id].onClose});return!1}));c.saveicon=a.extend([!0,"left","ui-icon-disk"],c.saveicon);c.closeicon=a.extend([!0,"left","ui-icon-close"],c.closeicon);!0===c.saveicon[0]&&a("#sData",p+"_2").addClass("right"===c.saveicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+
c.saveicon[2]+"'></span>");!0===c.closeicon[0]&&a("#cData",p+"_2").addClass("right"===c.closeicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+c.closeicon[2]+"'></span>");if(b[d.p.id].checkOnSubmit||b[d.p.id].checkOnUpdate)J="<a id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+c.bYes+"</a>",G="<a id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+c.bNo+"</a>",K="<a id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+
c.bExit+"</a>",m=c.zIndex||999,m++,a("<div class='"+c.overlayClass+" jqgrid-overlay confirm' style='z-index:"+m+";display:none;'>&#160;</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:"+(m+1)+"'>"+c.saveData+"<br/><br/>"+J+G+K+"</div>").insertAfter("#"+g),a("#sNew","#"+a.jgrid.jqID(q.themodal)).click(function(){s();a("#"+g).data("disabled",!1);a(".confirm","#"+a.jgrid.jqID(q.themodal)).hide();return!1}),a("#nNew","#"+a.jgrid.jqID(q.themodal)).click(function(){a(".confirm",
"#"+a.jgrid.jqID(q.themodal)).hide();a("#"+g).data("disabled",!1);setTimeout(function(){a(":input:visible","#"+g)[0].focus()},0);return!1}),a("#cNew","#"+a.jgrid.jqID(q.themodal)).click(function(){a(".confirm","#"+a.jgrid.jqID(q.themodal)).hide();a("#"+g).data("disabled",!1);a.jgrid.hideModal("#"+a.jgrid.jqID(q.themodal),{gb:"#gbox_"+a.jgrid.jqID(v),jqm:c.jqModal,onClose:b[d.p.id].onClose});return!1});a(d).triggerHandler("jqGridAddEditInitializeForm",[a("#"+g),B]);E&&E.call(d,a("#"+g),B);"_empty"!==
z&&b[d.p.id].viewPagerButtons?a("#pData,#nData",p+"_2").show():a("#pData,#nData",p+"_2").hide();a(d).triggerHandler("jqGridAddEditBeforeShowForm",[a("#"+g),B]);y&&y.call(d,a("#"+g),B);a("#"+a.jgrid.jqID(q.themodal)).data("onClose",b[d.p.id].onClose);a.jgrid.viewModal("#"+a.jgrid.jqID(q.themodal),{gbox:"#gbox_"+a.jgrid.jqID(v),jqm:c.jqModal,overlay:c.overlay,modal:c.modal,overlayClass:c.overlayClass,onHide:function(b){a(d).data("formProp",{top:parseFloat(a(b.w).css("top")),left:parseFloat(a(b.w).css("left")),
width:a(b.w).width(),height:a(b.w).height(),dataheight:a("#"+g).height(),datawidth:a("#"+g).width()});b.w.remove();b.o&&b.o.remove()}});N||a("."+a.jgrid.jqID(c.overlayClass)).click(function(){if(!f())return!1;a.jgrid.hideModal("#"+a.jgrid.jqID(q.themodal),{gb:"#gbox_"+a.jgrid.jqID(v),jqm:c.jqModal,onClose:b[d.p.id].onClose});return!1});a(".fm-button","#"+a.jgrid.jqID(q.themodal)).hover(function(){a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")});a("#sData",p+"_2").click(function(){l=
{};a("#FormError",p).hide();e();"_empty"===l[d.p.id+"_id"]?s():!0===c.checkOnSubmit?(M=r(l,b[d.p.id]._savedData))?(a("#"+g).data("disabled",!0),a(".confirm","#"+a.jgrid.jqID(q.themodal)).show()):s():s();return!1});a("#cData",p+"_2").click(function(){if(!f())return!1;a.jgrid.hideModal("#"+a.jgrid.jqID(q.themodal),{gb:"#gbox_"+a.jgrid.jqID(v),jqm:c.jqModal,onClose:b[d.p.id].onClose});return!1});a("#nData",p+"_2").click(function(){if(!f())return!1;a("#FormError",p).hide();var b=x();b[0]=parseInt(b[0],
10);if(-1!==b[0]&&b[1][b[0]+1]){a(d).triggerHandler("jqGridAddEditClickPgButtons",["next",a("#"+g),b[1][b[0]]]);var e;if(a.isFunction(c.onclickPgButtons)&&(e=c.onclickPgButtons.call(d,"next",a("#"+g),b[1][b[0]]),void 0!==e&&!1===e)||a("#"+a.jgrid.jqID(b[1][b[0]+1])).hasClass("ui-state-disabled"))return!1;w(b[1][b[0]+1],d,g);a(d).jqGrid("setSelection",b[1][b[0]+1]);a(d).triggerHandler("jqGridAddEditAfterClickPgButtons",["next",a("#"+g),b[1][b[0]]]);a.isFunction(c.afterclickPgButtons)&&c.afterclickPgButtons.call(d,
"next",a("#"+g),b[1][b[0]+1]);u(b[0]+1,b)}return!1});a("#pData",p+"_2").click(function(){if(!f())return!1;a("#FormError",p).hide();var b=x();if(-1!==b[0]&&b[1][b[0]-1]){a(d).triggerHandler("jqGridAddEditClickPgButtons",["prev",a("#"+g),b[1][b[0]]]);var e;if(a.isFunction(c.onclickPgButtons)&&(e=c.onclickPgButtons.call(d,"prev",a("#"+g),b[1][b[0]]),void 0!==e&&!1===e)||a("#"+a.jgrid.jqID(b[1][b[0]-1])).hasClass("ui-state-disabled"))return!1;w(b[1][b[0]-1],d,g);a(d).jqGrid("setSelection",b[1][b[0]-1]);
a(d).triggerHandler("jqGridAddEditAfterClickPgButtons",["prev",a("#"+g),b[1][b[0]]]);a.isFunction(c.afterclickPgButtons)&&c.afterclickPgButtons.call(d,"prev",a("#"+g),b[1][b[0]-1]);u(b[0]-1,b)}return!1});a(d).triggerHandler("jqGridAddEditAfterShowForm",[a("#"+g),B]);D&&D.call(d,a("#"+g),B);y=x();u(y[0],y)}}})},viewGridRow:function(z,c){c=a.extend(!0,{top:0,left:0,width:0,datawidth:"auto",height:"auto",dataheight:"auto",modal:!1,overlay:30,drag:!0,resize:!0,jqModal:!0,closeOnEscape:!1,labelswidth:"30%",
closeicon:[],navkeys:[!1,38,40],onClose:null,beforeShowForm:null,beforeInitData:null,viewPagerButtons:!0,recreateForm:!1},a.jgrid.view,c||{});b[a(this)[0].p.id]=c;return this.each(function(){function e(){!0!==b[r.p.id].closeOnEscape&&!0!==b[r.p.id].navkeys[0]||setTimeout(function(){a(".ui-jqdialog-titlebar-close","#"+a.jgrid.jqID(v.modalhead)).focus()},0)}function h(b,d,e,f){var g,k,h,q=0,m,p,r=[],s=!1,t,u="<td class='CaptionTD form-view-label ui-widget-content' width='"+c.labelswidth+"'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>",
y="",z=["integer","number","currency"],v=0,w=0,A,x,D;for(t=1;t<=f;t++)y+=1===t?u:"<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>";a(d.p.colModel).each(function(){(k=this.editrules&&!0===this.editrules.edithidden?!1:!0===this.hidden?!0:!1)||"right"!==this.align||(this.formatter&&-1!==a.inArray(this.formatter,z)?v=Math.max(v,parseInt(this.width,10)):w=Math.max(w,parseInt(this.width,10)))});A=0!==v?v:0!==w?w:0;s=a(d).jqGrid("getInd",
b);a(d.p.colModel).each(function(b){g=this.name;x=!1;p=(k=this.editrules&&!0===this.editrules.edithidden?!1:!0===this.hidden?!0:!1)?"style='display:none'":"";D="boolean"!==typeof this.viewable?!0:this.viewable;if("cb"!==g&&"subgrid"!==g&&"rn"!==g&&D){m=!1===s?"":g===d.p.ExpandColumn&&!0===d.p.treeGrid?a("td:eq("+b+")",d.rows[s]).text():a("td:eq("+b+")",d.rows[s]).html();x="right"===this.align&&0!==A?!0:!1;var c=a.extend({},{rowabove:!1,rowcontent:""},this.formoptions||{}),n=parseInt(c.rowpos,10)||
q+1,t=parseInt(2*(parseInt(c.colpos,10)||1),10);if(c.rowabove){var u=a("<tr><td class='contentinfo' colspan='"+2*f+"'>"+c.rowcontent+"</td></tr>");a(e).append(u);u[0].rp=n}h=a(e).find("tr[rowpos="+n+"]");0===h.length&&(h=a("<tr "+p+" rowpos='"+n+"'></tr>").addClass("FormData").attr("id","trv_"+g),a(h).append(y),a(e).append(h),h[0].rp=n);a("td:eq("+(t-2)+")",h[0]).html("<b>"+(void 0===c.label?d.p.colNames[b]:c.label)+"</b>");a("td:eq("+(t-1)+")",h[0]).append("<span>"+m+"</span>").attr("id","v_"+g);
x&&a("td:eq("+(t-1)+") span",h[0]).css({"text-align":"right",width:A+"px"});r[q]=b;q++}});0<q&&(b=a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+(2*f-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='"+b+"'/></td></tr>"),b[0].rp=q+99,a(e).append(b));return r}function w(b,c){var d,e,f=0,g,k;if(k=a(c).jqGrid("getInd",b,!0))a("td",k).each(function(b){d=c.p.colModel[b].name;e=c.p.colModel[b].editrules&&!0===c.p.colModel[b].editrules.edithidden?
!1:!0===c.p.colModel[b].hidden?!0:!1;"cb"!==d&&"subgrid"!==d&&"rn"!==d&&(g=d===c.p.ExpandColumn&&!0===c.p.treeGrid?a(this).text():a(this).html(),d=a.jgrid.jqID("v_"+d),a("#"+d+" span","#"+u).html(g),e&&a("#"+d,"#"+u).parents("tr:first").hide(),f++)}),0<f&&a("#id_g","#"+u).val(b)}function t(b,c){var d=c[1].length-1;0===b?a("#pData","#"+u+"_2").addClass("ui-state-disabled"):void 0!==c[1][b-1]&&a("#"+a.jgrid.jqID(c[1][b-1])).hasClass("ui-state-disabled")?a("#pData",u+"_2").addClass("ui-state-disabled"):
a("#pData","#"+u+"_2").removeClass("ui-state-disabled");b===d?a("#nData","#"+u+"_2").addClass("ui-state-disabled"):void 0!==c[1][b+1]&&a("#"+a.jgrid.jqID(c[1][b+1])).hasClass("ui-state-disabled")?a("#nData",u+"_2").addClass("ui-state-disabled"):a("#nData","#"+u+"_2").removeClass("ui-state-disabled")}function s(){var b=a(r).jqGrid("getDataIDs"),c=a("#id_g","#"+u).val();return[a.inArray(c,b),b]}var r=this;if(r.grid&&z){var f=r.p.id,k="ViewGrid_"+a.jgrid.jqID(f),u="ViewTbl_"+a.jgrid.jqID(f),x="ViewGrid_"+
f,d="ViewTbl_"+f,v={themodal:"viewmod"+f,modalhead:"viewhd"+f,modalcontent:"viewcnt"+f,scrollelm:k},g=a.isFunction(b[r.p.id].beforeInitData)?b[r.p.id].beforeInitData:!1,m=!0,p=1,q=0;c.recreateForm||a(r).data("viewProp")&&a.extend(b[a(this)[0].p.id],a(r).data("viewProp"));var y=isNaN(b[a(this)[0].p.id].dataheight)?b[a(this)[0].p.id].dataheight:b[a(this)[0].p.id].dataheight+"px",D=isNaN(b[a(this)[0].p.id].datawidth)?b[a(this)[0].p.id].datawidth:b[a(this)[0].p.id].datawidth+"px",x=a("<form name='FormPost' id='"+
x+"' class='FormGrid' style='width:"+D+";overflow:auto;position:relative;height:"+y+";'></form>"),A=a("<table id='"+d+"' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");g&&(m=g.call(r,a("#"+k)),void 0===m&&(m=!0));if(!1!==m){a(r.p.colModel).each(function(){var a=this.formoptions;p=Math.max(p,a?a.colpos||0:0);q=Math.max(q,a?a.rowpos||0:0)});a(x).append(A);h(z,r,A,p);d="rtl"===r.p.direction?!0:!1;g="<a id='"+(d?"nData":"pData")+"' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>";
m="<a id='"+(d?"pData":"nData")+"' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>";y="<a id='cData' class='fm-button ui-state-default ui-corner-all'>"+c.bClose+"</a>";if(0<q){var E=[];a.each(a(A)[0].rows,function(a,b){E[a]=b});E.sort(function(a,b){return a.rp>b.rp?1:a.rp<b.rp?-1:0});a.each(E,function(b,c){a("tbody",A).append(c)})}c.gbox="#gbox_"+a.jgrid.jqID(f);x=a("<div></div>").append(x).append("<table border='0' class='EditTable' id='"+
u+"_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='"+c.labelswidth+"'>"+(d?m+g:g+m)+"</td><td class='EditButton'>"+y+"</td></tr></tbody></table>");a.jgrid.createModal(v,x,c,"#gview_"+a.jgrid.jqID(r.p.id),a("#gview_"+a.jgrid.jqID(r.p.id))[0]);d&&(a("#pData, #nData","#"+u+"_2").css("float","right"),a(".EditButton","#"+u+"_2").css("text-align","left"));c.viewPagerButtons||a("#pData, #nData","#"+u+"_2").hide();x=null;a("#"+v.themodal).keydown(function(d){if(27===d.which)return b[r.p.id].closeOnEscape&&
a.jgrid.hideModal("#"+a.jgrid.jqID(v.themodal),{gb:c.gbox,jqm:c.jqModal,onClose:c.onClose}),!1;if(!0===c.navkeys[0]){if(d.which===c.navkeys[1])return a("#pData","#"+u+"_2").trigger("click"),!1;if(d.which===c.navkeys[2])return a("#nData","#"+u+"_2").trigger("click"),!1}});c.closeicon=a.extend([!0,"left","ui-icon-close"],c.closeicon);!0===c.closeicon[0]&&a("#cData","#"+u+"_2").addClass("right"===c.closeicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+c.closeicon[2]+
"'></span>");a.isFunction(c.beforeShowForm)&&c.beforeShowForm.call(r,a("#"+k));a.jgrid.viewModal("#"+a.jgrid.jqID(v.themodal),{gbox:"#gbox_"+a.jgrid.jqID(f),jqm:c.jqModal,overlay:c.overlay,modal:c.modal,onHide:function(b){a(r).data("viewProp",{top:parseFloat(a(b.w).css("top")),left:parseFloat(a(b.w).css("left")),width:a(b.w).width(),height:a(b.w).height(),dataheight:a("#"+k).height(),datawidth:a("#"+k).width()});b.w.remove();b.o&&b.o.remove()}});a(".fm-button:not(.ui-state-disabled)","#"+u+"_2").hover(function(){a(this).addClass("ui-state-hover")},
function(){a(this).removeClass("ui-state-hover")});e();a("#cData","#"+u+"_2").click(function(){a.jgrid.hideModal("#"+a.jgrid.jqID(v.themodal),{gb:"#gbox_"+a.jgrid.jqID(f),jqm:c.jqModal,onClose:c.onClose});return!1});a("#nData","#"+u+"_2").click(function(){a("#FormError","#"+u).hide();var b=s();b[0]=parseInt(b[0],10);-1!==b[0]&&b[1][b[0]+1]&&(a.isFunction(c.onclickPgButtons)&&c.onclickPgButtons.call(r,"next",a("#"+k),b[1][b[0]]),w(b[1][b[0]+1],r),a(r).jqGrid("setSelection",b[1][b[0]+1]),a.isFunction(c.afterclickPgButtons)&&
c.afterclickPgButtons.call(r,"next",a("#"+k),b[1][b[0]+1]),t(b[0]+1,b));e();return!1});a("#pData","#"+u+"_2").click(function(){a("#FormError","#"+u).hide();var b=s();-1!==b[0]&&b[1][b[0]-1]&&(a.isFunction(c.onclickPgButtons)&&c.onclickPgButtons.call(r,"prev",a("#"+k),b[1][b[0]]),w(b[1][b[0]-1],r),a(r).jqGrid("setSelection",b[1][b[0]-1]),a.isFunction(c.afterclickPgButtons)&&c.afterclickPgButtons.call(r,"prev",a("#"+k),b[1][b[0]-1]),t(b[0]-1,b));e();return!1});x=s();t(x[0],x)}}})},delGridRow:function(z,
c){c=a.extend(!0,{top:0,left:0,width:240,height:"auto",dataheight:"auto",modal:!1,overlay:30,drag:!0,resize:!0,url:"",mtype:"POST",reloadAfterSubmit:!0,beforeShowForm:null,beforeInitData:null,afterShowForm:null,beforeSubmit:null,onclickSubmit:null,afterSubmit:null,jqModal:!0,closeOnEscape:!1,delData:{},delicon:[],cancelicon:[],onClose:null,ajaxDelOptions:{},processing:!1,serializeDelData:null,useDataProxy:!1},a.jgrid.del,c||{});b[a(this)[0].p.id]=c;return this.each(function(){var e=this;if(e.grid&&
z){var h=a.isFunction(b[e.p.id].beforeShowForm),w=a.isFunction(b[e.p.id].afterShowForm),t=a.isFunction(b[e.p.id].beforeInitData)?b[e.p.id].beforeInitData:!1,s=e.p.id,r={},f=!0,k="DelTbl_"+a.jgrid.jqID(s),u,x,d,v,g="DelTbl_"+s,m={themodal:"delmod"+s,modalhead:"delhd"+s,modalcontent:"delcnt"+s,scrollelm:k};a.isArray(z)&&(z=z.join());if(void 0!==a("#"+a.jgrid.jqID(m.themodal))[0]){t&&(f=t.call(e,a("#"+k)),void 0===f&&(f=!0));if(!1===f)return;a("#DelData>td","#"+k).text(z);a("#DelError","#"+k).hide();
!0===b[e.p.id].processing&&(b[e.p.id].processing=!1,a("#dData","#"+k).removeClass("ui-state-active"));h&&b[e.p.id].beforeShowForm.call(e,a("#"+k));a.jgrid.viewModal("#"+a.jgrid.jqID(m.themodal),{gbox:"#gbox_"+a.jgrid.jqID(s),jqm:b[e.p.id].jqModal,jqM:!1,overlay:b[e.p.id].overlay,modal:b[e.p.id].modal})}else{var p=isNaN(b[e.p.id].dataheight)?b[e.p.id].dataheight:b[e.p.id].dataheight+"px",q=isNaN(c.datawidth)?c.datawidth:c.datawidth+"px",g="<div id='"+g+"' class='formdata' style='width:"+q+";overflow:auto;position:relative;height:"+
p+";'><table class='DelTable'><tbody>",g=g+"<tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>",g=g+("<tr id='DelData' style='display:none'><td >"+z+"</td></tr>"),g=g+('<tr><td class="delmsg" style="white-space:pre;">'+b[e.p.id].msg+"</td></tr><tr><td >&#160;</td></tr>"),g=g+"</tbody></table></div>",g=g+("<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='"+k+"_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>"+
("<a id='dData' class='fm-button ui-state-default ui-corner-all'>"+c.bSubmit+"</a>")+"&#160;"+("<a id='eData' class='fm-button ui-state-default ui-corner-all'>"+c.bCancel+"</a>")+"</td></tr></tbody></table>");c.gbox="#gbox_"+a.jgrid.jqID(s);a.jgrid.createModal(m,g,c,"#gview_"+a.jgrid.jqID(e.p.id),a("#gview_"+a.jgrid.jqID(e.p.id))[0]);t&&(f=t.call(e,a("#"+k)),void 0===f&&(f=!0));if(!1===f)return;a(".fm-button","#"+k+"_2").hover(function(){a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")});
c.delicon=a.extend([!0,"left","ui-icon-scissors"],b[e.p.id].delicon);c.cancelicon=a.extend([!0,"left","ui-icon-cancel"],b[e.p.id].cancelicon);!0===c.delicon[0]&&a("#dData","#"+k+"_2").addClass("right"===c.delicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+c.delicon[2]+"'></span>");!0===c.cancelicon[0]&&a("#eData","#"+k+"_2").addClass("right"===c.cancelicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+c.cancelicon[2]+"'></span>");
a("#dData","#"+k+"_2").click(function(){var f=[!0,""],g,h=a("#DelData>td","#"+k).text();r={};a.isFunction(b[e.p.id].onclickSubmit)&&(r=b[e.p.id].onclickSubmit.call(e,b[e.p.id],h)||{});a.isFunction(b[e.p.id].beforeSubmit)&&(f=b[e.p.id].beforeSubmit.call(e,h));if(f[0]&&!b[e.p.id].processing){b[e.p.id].processing=!0;d=e.p.prmNames;u=a.extend({},b[e.p.id].delData,r);v=d.oper;u[v]=d.deloper;x=d.id;h=String(h).split(",");if(!h.length)return!1;for(g in h)h.hasOwnProperty(g)&&(h[g]=a.jgrid.stripPref(e.p.idPrefix,
h[g]));u[x]=h.join();a(this).addClass("ui-state-active");g=a.extend({url:b[e.p.id].url||a(e).jqGrid("getGridParam","editurl"),type:b[e.p.id].mtype,data:a.isFunction(b[e.p.id].serializeDelData)?b[e.p.id].serializeDelData.call(e,u):u,complete:function(d,g){var q;300<=d.status&&304!==d.status?(f[0]=!1,a.isFunction(b[e.p.id].errorTextFormat)?f[1]=b[e.p.id].errorTextFormat.call(e,d):f[1]=g+" Status: '"+d.statusText+"'. Error code: "+d.status):a.isFunction(b[e.p.id].afterSubmit)&&(f=b[e.p.id].afterSubmit.call(e,
d,u));if(!1===f[0])a("#DelError>td","#"+k).html(f[1]),a("#DelError","#"+k).show();else{if(b[e.p.id].reloadAfterSubmit&&"local"!==e.p.datatype)a(e).trigger("reloadGrid");else{if(!0===e.p.treeGrid)try{a(e).jqGrid("delTreeNode",e.p.idPrefix+h[0])}catch(p){}else for(q=0;q<h.length;q++)a(e).jqGrid("delRowData",e.p.idPrefix+h[q]);e.p.selrow=null;e.p.selarrrow=[]}a.isFunction(b[e.p.id].afterComplete)&&setTimeout(function(){b[e.p.id].afterComplete.call(e,d,h)},500)}b[e.p.id].processing=!1;a("#dData","#"+
k+"_2").removeClass("ui-state-active");f[0]&&a.jgrid.hideModal("#"+a.jgrid.jqID(m.themodal),{gb:"#gbox_"+a.jgrid.jqID(s),jqm:c.jqModal,onClose:b[e.p.id].onClose})}},a.jgrid.ajaxOptions,b[e.p.id].ajaxDelOptions);g.url||b[e.p.id].useDataProxy||(a.isFunction(e.p.dataProxy)?b[e.p.id].useDataProxy=!0:(f[0]=!1,f[1]+=" "+a.jgrid.errors.nourl));f[0]&&(b[e.p.id].useDataProxy?(g=e.p.dataProxy.call(e,g,"del_"+e.p.id),void 0===g&&(g=[!0,""]),!1===g[0]?(f[0]=!1,f[1]=g[1]||"Error deleting the selected row!"):a.jgrid.hideModal("#"+
a.jgrid.jqID(m.themodal),{gb:"#gbox_"+a.jgrid.jqID(s),jqm:c.jqModal,onClose:b[e.p.id].onClose})):a.ajax(g))}!1===f[0]&&(a("#DelError>td","#"+k).html(f[1]),a("#DelError","#"+k).show());return!1});a("#eData","#"+k+"_2").click(function(){a.jgrid.hideModal("#"+a.jgrid.jqID(m.themodal),{gb:"#gbox_"+a.jgrid.jqID(s),jqm:b[e.p.id].jqModal,onClose:b[e.p.id].onClose});return!1});h&&b[e.p.id].beforeShowForm.call(e,a("#"+k));a.jgrid.viewModal("#"+a.jgrid.jqID(m.themodal),{gbox:"#gbox_"+a.jgrid.jqID(s),jqm:b[e.p.id].jqModal,
overlay:b[e.p.id].overlay,modal:b[e.p.id].modal})}w&&b[e.p.id].afterShowForm.call(e,a("#"+k));!0===b[e.p.id].closeOnEscape&&setTimeout(function(){a(".ui-jqdialog-titlebar-close","#"+a.jgrid.jqID(m.modalhead)).focus()},0)}})},navGrid:function(b,c,e,h,w,t,s){c=a.extend({edit:!0,editicon:"ui-icon-pencil",add:!0,addicon:"ui-icon-plus",del:!0,delicon:"ui-icon-trash",search:!0,searchicon:"ui-icon-search",refresh:!0,refreshicon:"ui-icon-refresh",refreshstate:"firstpage",view:!1,viewicon:"ui-icon-document",
position:"left",closeOnEscape:!0,beforeRefresh:null,afterRefresh:null,cloneToTop:!1,alertwidth:200,alertheight:"auto",alerttop:null,alertleft:null,alertzIndex:null},a.jgrid.nav,c||{});return this.each(function(){if(!this.nav){var r={themodal:"alertmod_"+this.p.id,modalhead:"alerthd_"+this.p.id,modalcontent:"alertcnt_"+this.p.id},f=this,k;if(f.grid&&"string"===typeof b){void 0===a("#"+r.themodal)[0]&&(c.alerttop||c.alertleft||(void 0!==window.innerWidth?(c.alertleft=window.innerWidth,c.alerttop=window.innerHeight):
void 0!==document.documentElement&&void 0!==document.documentElement.clientWidth&&0!==document.documentElement.clientWidth?(c.alertleft=document.documentElement.clientWidth,c.alerttop=document.documentElement.clientHeight):(c.alertleft=1024,c.alerttop=768),c.alertleft=c.alertleft/2-parseInt(c.alertwidth,10)/2,c.alerttop=c.alerttop/2-25),a.jgrid.createModal(r,"<div>"+c.alerttext+"</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>",{gbox:"#gbox_"+a.jgrid.jqID(f.p.id),jqModal:!0,
drag:!0,resize:!0,caption:c.alertcap,top:c.alerttop,left:c.alertleft,width:c.alertwidth,height:c.alertheight,closeOnEscape:c.closeOnEscape,zIndex:c.alertzIndex},"#gview_"+a.jgrid.jqID(f.p.id),a("#gbox_"+a.jgrid.jqID(f.p.id))[0],!0));var u=1,x,d=function(){a(this).hasClass("ui-state-disabled")||a(this).addClass("ui-state-hover")},v=function(){a(this).removeClass("ui-state-hover")};c.cloneToTop&&f.p.toppager&&(u=2);for(x=0;x<u;x++){var g=a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
m,p;0===x?(m=b,p=f.p.id,m===f.p.toppager&&(p+="_top",u=1)):(m=f.p.toppager,p=f.p.id+"_top");"rtl"===f.p.direction&&a(g).attr("dir","rtl").css("float","right");c.add&&(h=h||{},k=a("<td class='ui-pg-button ui-corner-all'></td>"),a(k).append("<div class='ui-pg-div'><span class='ui-icon "+c.addicon+"'></span>"+c.addtext+"</div>"),a("tr",g).append(k),a(k,g).attr({title:c.addtitle||"",id:h.id||"add_"+p}).click(function(){a(this).hasClass("ui-state-disabled")||(a.isFunction(c.addfunc)?c.addfunc.call(f):
a(f).jqGrid("editGridRow","new",h));return!1}).hover(d,v),k=null);c.edit&&(k=a("<td class='ui-pg-button ui-corner-all'></td>"),e=e||{},a(k).append("<div class='ui-pg-div'><span class='ui-icon "+c.editicon+"'></span>"+c.edittext+"</div>"),a("tr",g).append(k),a(k,g).attr({title:c.edittitle||"",id:e.id||"edit_"+p}).click(function(){if(!a(this).hasClass("ui-state-disabled")){var b=f.p.selrow;b?a.isFunction(c.editfunc)?c.editfunc.call(f,b):a(f).jqGrid("editGridRow",b,e):(a.jgrid.viewModal("#"+r.themodal,
{gbox:"#gbox_"+a.jgrid.jqID(f.p.id),jqm:!0}),a("#jqg_alrt").focus())}return!1}).hover(d,v),k=null);c.view&&(k=a("<td class='ui-pg-button ui-corner-all'></td>"),s=s||{},a(k).append("<div class='ui-pg-div'><span class='ui-icon "+c.viewicon+"'></span>"+c.viewtext+"</div>"),a("tr",g).append(k),a(k,g).attr({title:c.viewtitle||"",id:s.id||"view_"+p}).click(function(){if(!a(this).hasClass("ui-state-disabled")){var b=f.p.selrow;b?a.isFunction(c.viewfunc)?c.viewfunc.call(f,b):a(f).jqGrid("viewGridRow",b,s):
(a.jgrid.viewModal("#"+r.themodal,{gbox:"#gbox_"+a.jgrid.jqID(f.p.id),jqm:!0}),a("#jqg_alrt").focus())}return!1}).hover(d,v),k=null);c.del&&(k=a("<td class='ui-pg-button ui-corner-all'></td>"),w=w||{},a(k).append("<div class='ui-pg-div'><span class='ui-icon "+c.delicon+"'></span>"+c.deltext+"</div>"),a("tr",g).append(k),a(k,g).attr({title:c.deltitle||"",id:w.id||"del_"+p}).click(function(){if(!a(this).hasClass("ui-state-disabled")){var b;f.p.multiselect?(b=f.p.selarrrow,0===b.length&&(b=null)):b=
f.p.selrow;b?a.isFunction(c.delfunc)?c.delfunc.call(f,b):a(f).jqGrid("delGridRow",b,w):(a.jgrid.viewModal("#"+r.themodal,{gbox:"#gbox_"+a.jgrid.jqID(f.p.id),jqm:!0}),a("#jqg_alrt").focus())}return!1}).hover(d,v),k=null);(c.add||c.edit||c.del||c.view)&&a("tr",g).append("<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>");c.search&&(k=a("<td class='ui-pg-button ui-corner-all'></td>"),t=t||{},a(k).append("<div class='ui-pg-div'><span class='ui-icon "+
c.searchicon+"'></span>"+c.searchtext+"</div>"),a("tr",g).append(k),a(k,g).attr({title:c.searchtitle||"",id:t.id||"search_"+p}).click(function(){a(this).hasClass("ui-state-disabled")||(a.isFunction(c.searchfunc)?c.searchfunc.call(f,t):a(f).jqGrid("searchGrid",t));return!1}).hover(d,v),t.showOnLoad&&!0===t.showOnLoad&&a(k,g).click(),k=null);c.refresh&&(k=a("<td class='ui-pg-button ui-corner-all'></td>"),a(k).append("<div class='ui-pg-div'><span class='ui-icon "+c.refreshicon+"'></span>"+c.refreshtext+
"</div>"),a("tr",g).append(k),a(k,g).attr({title:c.refreshtitle||"",id:"refresh_"+p}).click(function(){if(!a(this).hasClass("ui-state-disabled")){a.isFunction(c.beforeRefresh)&&c.beforeRefresh.call(f);f.p.search=!1;f.p.resetsearch=!0;try{var b=f.p.id;f.p.postData.filters="";try{a("#fbox_"+a.jgrid.jqID(b)).jqFilter("resetFilter")}catch(d){}a.isFunction(f.clearToolbar)&&f.clearToolbar.call(f,!1)}catch(e){}switch(c.refreshstate){case "firstpage":a(f).trigger("reloadGrid",[{page:1}]);break;case "current":a(f).trigger("reloadGrid",
[{current:!0}])}a.isFunction(c.afterRefresh)&&c.afterRefresh.call(f)}return!1}).hover(d,v),k=null);k=a(".ui-jqgrid").css("font-size")||"11px";a("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+k+";visibility:hidden;' ></div>");k=a(g).clone().appendTo("#testpg2").width();a("#testpg2").remove();a(m+"_"+c.position,m).append(g);f.p._nvtd&&(k>f.p._nvtd[0]&&(a(m+"_"+c.position,m).width(k),f.p._nvtd[0]=k),f.p._nvtd[1]=k);g=k=k=null;this.nav=!0}}}})},navButtonAdd:function(b,
c){c=a.extend({caption:"newButton",title:"",buttonicon:"ui-icon-newwin",onClickButton:null,position:"last",cursor:"pointer"},c||{});return this.each(function(){if(this.grid){"string"===typeof b&&0!==b.indexOf("#")&&(b="#"+a.jgrid.jqID(b));var e=a(".navtable",b)[0],h=this;if(e&&(!c.id||void 0===a("#"+a.jgrid.jqID(c.id),e)[0])){var w=a("<td></td>");"NONE"===c.buttonicon.toString().toUpperCase()?a(w).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>"+c.caption+"</div>"):a(w).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon "+
c.buttonicon+"'></span>"+c.caption+"</div>");c.id&&a(w).attr("id",c.id);"first"===c.position?0===e.rows[0].cells.length?a("tr",e).append(w):a("tr td:eq(0)",e).before(w):a("tr",e).append(w);a(w,e).attr("title",c.title||"").click(function(b){a(this).hasClass("ui-state-disabled")||a.isFunction(c.onClickButton)&&c.onClickButton.call(h,b);return!1}).hover(function(){a(this).hasClass("ui-state-disabled")||a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")})}}})},navSeparatorAdd:function(b,
c){c=a.extend({sepclass:"ui-separator",sepcontent:"",position:"last"},c||{});return this.each(function(){if(this.grid){"string"===typeof b&&0!==b.indexOf("#")&&(b="#"+a.jgrid.jqID(b));var e=a(".navtable",b)[0];if(e){var h="<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='"+c.sepclass+"'></span>"+c.sepcontent+"</td>";"first"===c.position?0===e.rows[0].cells.length?a("tr",e).append(h):a("tr td:eq(0)",e).before(h):a("tr",e).append(h)}}})},GridToForm:function(b,c){return this.each(function(){var e=
this,h;if(e.grid){var w=a(e).jqGrid("getRowData",b);if(w)for(h in w)w.hasOwnProperty(h)&&(a("[name="+a.jgrid.jqID(h)+"]",c).is("input:radio")||a("[name="+a.jgrid.jqID(h)+"]",c).is("input:checkbox")?a("[name="+a.jgrid.jqID(h)+"]",c).each(function(){if(a(this).val()==w[h])a(this)[e.p.useProp?"prop":"attr"]("checked",!0);else a(this)[e.p.useProp?"prop":"attr"]("checked",!1)}):a("[name="+a.jgrid.jqID(h)+"]",c).val(w[h]))}})},FormToGrid:function(b,c,e,h){return this.each(function(){if(this.grid){e||(e=
"set");h||(h="first");var w=a(c).serializeArray(),t={};a.each(w,function(a,b){t[b.name]=b.value});"add"===e?a(this).jqGrid("addRowData",b,t,h):"set"===e&&a(this).jqGrid("setRowData",b,t)}})}})})(jQuery);
(function(a){a.fn.jqFilter=function(d){if("string"===typeof d){var q=a.fn.jqFilter[d];if(!q)throw"jqFilter - No such method: "+d;var x=a.makeArray(arguments).slice(1);return q.apply(this,x)}var n=a.extend(!0,{filter:null,columns:[],onChange:null,afterRedraw:null,checkValues:null,error:!1,errmsg:"",errorcheck:!0,showQuery:!0,sopt:null,ops:[],operands:null,numopts:"eq ne lt le gt ge nu nn in ni".split(" "),stropts:"eq ne bw bn ew en cn nc nu nn in ni".split(" "),strarr:["text","string","blob"],groupOps:[{op:"AND",
text:"AND"},{op:"OR",text:"OR"}],groupButton:!0,ruleButtons:!0,direction:"ltr"},a.jgrid.filter,d||{});return this.each(function(){if(!this.filter){this.p=n;if(null===this.p.filter||void 0===this.p.filter)this.p.filter={groupOp:this.p.groupOps[0].op,rules:[],groups:[]};var d,q=this.p.columns.length,f,w=/msie/i.test(navigator.userAgent)&&!window.opera;this.p.initFilter=a.extend(!0,{},this.p.filter);if(q){for(d=0;d<q;d++)f=this.p.columns[d],f.stype?f.inputtype=f.stype:f.inputtype||(f.inputtype="text"),
f.sorttype?f.searchtype=f.sorttype:f.searchtype||(f.searchtype="string"),void 0===f.hidden&&(f.hidden=!1),f.label||(f.label=f.name),f.index&&(f.name=f.index),f.hasOwnProperty("searchoptions")||(f.searchoptions={}),f.hasOwnProperty("searchrules")||(f.searchrules={});this.p.showQuery&&a(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='"+this.p.direction+"'><tbody><tr><td class='query'></td></tr></tbody></table>");var u=
function(g,l){var b=[!0,""],c=a("#"+a.jgrid.jqID(n.id))[0]||null;if(a.isFunction(l.searchrules))b=l.searchrules.call(c,g,l);else if(a.jgrid&&a.jgrid.checkValues)try{b=a.jgrid.checkValues.call(c,g,-1,l.searchrules,l.label)}catch(m){}b&&b.length&&!1===b[0]&&(n.error=!b[0],n.errmsg=b[1])};this.onchange=function(){this.p.error=!1;this.p.errmsg="";return a.isFunction(this.p.onChange)?this.p.onChange.call(this,this.p):!1};this.reDraw=function(){a("table.group:first",this).remove();var g=this.createTableForGroup(n.filter,
null);a(this).append(g);a.isFunction(this.p.afterRedraw)&&this.p.afterRedraw.call(this,this.p)};this.createTableForGroup=function(g,l){var b=this,c,m=a("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>"),e="left";"rtl"===this.p.direction&&(e="right",m.attr("dir","rtl"));null===l&&m.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='"+e+"'></th></tr>");var h=a("<tr></tr>");m.append(h);e=a("<th colspan='5' align='"+
e+"'></th>");h.append(e);if(!0===this.p.ruleButtons){var d=a("<select class='opsel'></select>");e.append(d);var h="",k;for(c=0;c<n.groupOps.length;c++)k=g.groupOp===b.p.groupOps[c].op?" selected='selected'":"",h+="<option value='"+b.p.groupOps[c].op+"'"+k+">"+b.p.groupOps[c].text+"</option>";d.append(h).bind("change",function(){g.groupOp=a(d).val();b.onchange()})}h="<span></span>";this.p.groupButton&&(h=a("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>"),h.bind("click",
function(){void 0===g.groups&&(g.groups=[]);g.groups.push({groupOp:n.groupOps[0].op,rules:[],groups:[]});b.reDraw();b.onchange();return!1}));e.append(h);if(!0===this.p.ruleButtons){var h=a("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>"),f;h.bind("click",function(){void 0===g.rules&&(g.rules=[]);for(c=0;c<b.p.columns.length;c++){var e=void 0===b.p.columns[c].search?!0:b.p.columns[c].search,l=!0===b.p.columns[c].hidden;if(!0===b.p.columns[c].searchoptions.searchhidden&&
e||e&&!l){f=b.p.columns[c];break}}e=f.searchoptions.sopt?f.searchoptions.sopt:b.p.sopt?b.p.sopt:-1!==a.inArray(f.searchtype,b.p.strarr)?b.p.stropts:b.p.numopts;g.rules.push({field:f.name,op:e[0],data:""});b.reDraw();return!1});e.append(h)}null!==l&&(h=a("<input type='button' value='-' title='Delete group' class='delete-group'/>"),e.append(h),h.bind("click",function(){for(c=0;c<l.groups.length;c++)if(l.groups[c]===g){l.groups.splice(c,1);break}b.reDraw();b.onchange();return!1}));if(void 0!==g.groups)for(c=
0;c<g.groups.length;c++)e=a("<tr></tr>"),m.append(e),h=a("<td class='first'></td>"),e.append(h),h=a("<td colspan='4'></td>"),h.append(this.createTableForGroup(g.groups[c],g)),e.append(h);void 0===g.groupOp&&(g.groupOp=b.p.groupOps[0].op);if(void 0!==g.rules)for(c=0;c<g.rules.length;c++)m.append(this.createTableRowForRule(g.rules[c],g));return m};this.createTableRowForRule=function(g,l){var b=this,c=a("#"+a.jgrid.jqID(n.id))[0]||null,m=a("<tr></tr>"),e,h,f,k,d="",s;m.append("<td class='first'></td>");
var p=a("<td class='columns'></td>");m.append(p);var q=a("<select></select>"),r,t=[];p.append(q);q.bind("change",function(){g.field=a(q).val();f=a(this).parents("tr:first");for(e=0;e<b.p.columns.length;e++)if(b.p.columns[e].name===g.field){k=b.p.columns[e];break}if(k){k.searchoptions.id=a.jgrid.randId();w&&"text"===k.inputtype&&!k.searchoptions.size&&(k.searchoptions.size=10);var d=a.jgrid.createEl.call(c,k.inputtype,k.searchoptions,"",!0,b.p.ajaxSelectOptions||{},!0);a(d).addClass("input-elm");h=
k.searchoptions.sopt?k.searchoptions.sopt:b.p.sopt?b.p.sopt:-1!==a.inArray(k.searchtype,b.p.strarr)?b.p.stropts:b.p.numopts;var l="",m=0;t=[];a.each(b.p.ops,function(){t.push(this.oper)});for(e=0;e<h.length;e++)r=a.inArray(h[e],t),-1!==r&&(0===m&&(g.op=b.p.ops[r].oper),l+="<option value='"+b.p.ops[r].oper+"'>"+b.p.ops[r].text+"</option>",m++);a(".selectopts",f).empty().append(l);a(".selectopts",f)[0].selectedIndex=0;a.jgrid.msie&&9>a.jgrid.msiever()&&(l=parseInt(a("select.selectopts",f)[0].offsetWidth,
10)+1,a(".selectopts",f).width(l),a(".selectopts",f).css("width","auto"));a(".data",f).empty().append(d);a.jgrid.bindEv.call(c,d,k.searchoptions);a(".input-elm",f).bind("change",function(e){e=e.target;g.data="SPAN"===e.nodeName.toUpperCase()&&k.searchoptions&&a.isFunction(k.searchoptions.custom_value)?k.searchoptions.custom_value.call(c,a(e).children(".customelement:first"),"get"):e.value;b.onchange()});setTimeout(function(){g.data=a(d).val();b.onchange()},0)}});for(e=p=0;e<b.p.columns.length;e++){s=
void 0===b.p.columns[e].search?!0:b.p.columns[e].search;var u=!0===b.p.columns[e].hidden;if(!0===b.p.columns[e].searchoptions.searchhidden&&s||s&&!u)s="",g.field===b.p.columns[e].name&&(s=" selected='selected'",p=e),d+="<option value='"+b.p.columns[e].name+"'"+s+">"+b.p.columns[e].label+"</option>"}q.append(d);d=a("<td class='operators'></td>");m.append(d);k=n.columns[p];k.searchoptions.id=a.jgrid.randId();w&&"text"===k.inputtype&&!k.searchoptions.size&&(k.searchoptions.size=10);p=a.jgrid.createEl.call(c,
k.inputtype,k.searchoptions,g.data,!0,b.p.ajaxSelectOptions||{},!0);if("nu"===g.op||"nn"===g.op)a(p).attr("readonly","true"),a(p).attr("disabled","true");var v=a("<select class='selectopts'></select>");d.append(v);v.bind("change",function(){g.op=a(v).val();f=a(this).parents("tr:first");var c=a(".input-elm",f)[0];"nu"===g.op||"nn"===g.op?(g.data="","SELECT"!==c.tagName.toUpperCase()&&(c.value=""),c.setAttribute("readonly","true"),c.setAttribute("disabled","true")):("SELECT"===c.tagName.toUpperCase()&&
(g.data=c.value),c.removeAttribute("readonly"),c.removeAttribute("disabled"));b.onchange()});h=k.searchoptions.sopt?k.searchoptions.sopt:b.p.sopt?b.p.sopt:-1!==a.inArray(k.searchtype,b.p.strarr)?b.p.stropts:b.p.numopts;d="";a.each(b.p.ops,function(){t.push(this.oper)});for(e=0;e<h.length;e++)r=a.inArray(h[e],t),-1!==r&&(s=g.op===b.p.ops[r].oper?" selected='selected'":"",d+="<option value='"+b.p.ops[r].oper+"'"+s+">"+b.p.ops[r].text+"</option>");v.append(d);d=a("<td class='data'></td>");m.append(d);
d.append(p);a.jgrid.bindEv.call(c,p,k.searchoptions);a(p).addClass("input-elm").bind("change",function(){g.data="custom"===k.inputtype?k.searchoptions.custom_value.call(c,a(this).children(".customelement:first"),"get"):a(this).val();b.onchange()});d=a("<td></td>");m.append(d);!0===this.p.ruleButtons&&(p=a("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>"),d.append(p),p.bind("click",function(){for(e=0;e<l.rules.length;e++)if(l.rules[e]===g){l.rules.splice(e,1);break}b.reDraw();
b.onchange();return!1}));return m};this.getStringForGroup=function(a){var d="(",b;if(void 0!==a.groups)for(b=0;b<a.groups.length;b++){1<d.length&&(d+=" "+a.groupOp+" ");try{d+=this.getStringForGroup(a.groups[b])}catch(c){alert(c)}}if(void 0!==a.rules)try{for(b=0;b<a.rules.length;b++)1<d.length&&(d+=" "+a.groupOp+" "),d+=this.getStringForRule(a.rules[b])}catch(f){alert(f)}d+=")";return"()"===d?"":d};this.getStringForRule=function(d){var f="",b="",c,m;for(c=0;c<this.p.ops.length;c++)if(this.p.ops[c].oper===
d.op){f=this.p.operands.hasOwnProperty(d.op)?this.p.operands[d.op]:"";b=this.p.ops[c].oper;break}for(c=0;c<this.p.columns.length;c++)if(this.p.columns[c].name===d.field){m=this.p.columns[c];break}if(void 0==m)return"";c=d.data;if("bw"===b||"bn"===b)c+="%";if("ew"===b||"en"===b)c="%"+c;if("cn"===b||"nc"===b)c="%"+c+"%";if("in"===b||"ni"===b)c=" ("+c+")";n.errorcheck&&u(d.data,m);return-1!==a.inArray(m.searchtype,["int","integer","float","number","currency"])||"nn"===b||"nu"===b?d.field+" "+f+" "+c:
d.field+" "+f+' "'+c+'"'};this.resetFilter=function(){this.p.filter=a.extend(!0,{},this.p.initFilter);this.reDraw();this.onchange()};this.hideError=function(){a("th.ui-state-error",this).html("");a("tr.error",this).hide()};this.showError=function(){a("th.ui-state-error",this).html(this.p.errmsg);a("tr.error",this).show()};this.toUserFriendlyString=function(){return this.getStringForGroup(n.filter)};this.toString=function(){function a(b){var c="(",f;if(void 0!==b.groups)for(f=0;f<b.groups.length;f++)1<
c.length&&(c="OR"===b.groupOp?c+" || ":c+" && "),c+=a(b.groups[f]);if(void 0!==b.rules)for(f=0;f<b.rules.length;f++){1<c.length&&(c="OR"===b.groupOp?c+" || ":c+" && ");var e=b.rules[f];if(d.p.errorcheck){for(var h=void 0,n=void 0,h=0;h<d.p.columns.length;h++)if(d.p.columns[h].name===e.field){n=d.p.columns[h];break}n&&u(e.data,n)}c+=e.op+"(item."+e.field+",'"+e.data+"')"}c+=")";return"()"===c?"":c}var d=this;return a(this.p.filter)};this.reDraw();if(this.p.showQuery)this.onchange();this.filter=!0}}})};
a.extend(a.fn.jqFilter,{toSQLString:function(){var a="";this.each(function(){a=this.toUserFriendlyString()});return a},filterData:function(){var a;this.each(function(){a=this.p.filter});return a},getParameter:function(a){return void 0!==a&&this.p.hasOwnProperty(a)?this.p[a]:this.p},resetFilter:function(){return this.each(function(){this.resetFilter()})},addFilter:function(d){"string"===typeof d&&(d=a.jgrid.parse(d));this.each(function(){this.p.filter=d;this.reDraw();this.onchange()})}})})(jQuery);
(function(a){a.jgrid.inlineEdit=a.jgrid.inlineEdit||{};a.jgrid.extend({editRow:function(c,e,b,l,h,n,p,g,f){var m={},d=a.makeArray(arguments).slice(1);"object"===a.type(d[0])?m=d[0]:(void 0!==e&&(m.keys=e),a.isFunction(b)&&(m.oneditfunc=b),a.isFunction(l)&&(m.successfunc=l),void 0!==h&&(m.url=h),void 0!==n&&(m.extraparam=n),a.isFunction(p)&&(m.aftersavefunc=p),a.isFunction(g)&&(m.errorfunc=g),a.isFunction(f)&&(m.afterrestorefunc=f));m=a.extend(!0,{keys:!1,oneditfunc:null,successfunc:null,url:null,
extraparam:{},aftersavefunc:null,errorfunc:null,afterrestorefunc:null,restoreAfterError:!0,mtype:"POST"},a.jgrid.inlineEdit,m);return this.each(function(){var d=this,f,e,b,g=0,h=null,n={},l,q;d.grid&&(l=a(d).jqGrid("getInd",c,!0),!1!==l&&(b=a.isFunction(m.beforeEditRow)?m.beforeEditRow.call(d,m,c):void 0,void 0===b&&(b=!0),b&&(b=a(l).attr("editable")||"0","0"!==b||a(l).hasClass("not-editable-row")||(q=d.p.colModel,a('td[role="gridcell"]',l).each(function(b){f=q[b].name;var l=!0===d.p.treeGrid&&f===
d.p.ExpandColumn;if(l)e=a("span:first",this).html();else try{e=a.unformat.call(d,this,{rowId:c,colModel:q[b]},b)}catch(m){e=q[b].edittype&&"textarea"===q[b].edittype?a(this).text():a(this).html()}if("cb"!==f&&"subgrid"!==f&&"rn"!==f&&(d.p.autoencode&&(e=a.jgrid.htmlDecode(e)),n[f]=e,!0===q[b].editable)){null===h&&(h=b);l?a("span:first",this).html(""):a(this).html("");var p=a.extend({},q[b].editoptions||{},{id:c+"_"+f,name:f});q[b].edittype||(q[b].edittype="text");if("&nbsp;"===e||"&#160;"===e||1===
e.length&&160===e.charCodeAt(0))e="";var x=a.jgrid.createEl.call(d,q[b].edittype,p,e,!0,a.extend({},a.jgrid.ajaxOptions,d.p.ajaxSelectOptions||{}));a(x).addClass("editable");l?a("span:first",this).append(x):a(this).append(x);a.jgrid.bindEv.call(d,x,p);"select"===q[b].edittype&&void 0!==q[b].editoptions&&!0===q[b].editoptions.multiple&&void 0===q[b].editoptions.dataUrl&&a.jgrid.msie&&a(x).width(a(x).width());g++}}),0<g&&(n.id=c,d.p.savedRow.push(n),a(l).attr("editable","1"),setTimeout(function(){a("td:eq("+
h+") input",l).focus()},0),!0===m.keys&&a(l).bind("keydown",function(b){if(27===b.keyCode){a(d).jqGrid("restoreRow",c,m.afterrestorefunc);if(d.p._inlinenav)try{a(d).jqGrid("showAddEditButtons")}catch(f){}return!1}if(13===b.keyCode){if("TEXTAREA"===b.target.tagName)return!0;if(a(d).jqGrid("saveRow",c,m)&&d.p._inlinenav)try{a(d).jqGrid("showAddEditButtons")}catch(e){}return!1}}),a(d).triggerHandler("jqGridInlineEditRow",[c,m]),a.isFunction(m.oneditfunc)&&m.oneditfunc.call(d,c))))))})},saveRow:function(c,
e,b,l,h,n,p){var g=a.makeArray(arguments).slice(1),f={};"object"===a.type(g[0])?f=g[0]:(a.isFunction(e)&&(f.successfunc=e),void 0!==b&&(f.url=b),void 0!==l&&(f.extraparam=l),a.isFunction(h)&&(f.aftersavefunc=h),a.isFunction(n)&&(f.errorfunc=n),a.isFunction(p)&&(f.afterrestorefunc=p));var f=a.extend(!0,{successfunc:null,url:null,extraparam:{},aftersavefunc:null,errorfunc:null,afterrestorefunc:null,restoreAfterError:!0,mtype:"POST"},a.jgrid.inlineEdit,f),m=!1,d=this[0],r,k={},y={},v={},w,z,u;if(!d.grid)return m;
u=a(d).jqGrid("getInd",c,!0);if(!1===u)return m;g=a.isFunction(f.beforeSaveRow)?f.beforeSaveRow.call(d,f,c):void 0;void 0===g&&(g=!0);if(g){g=a(u).attr("editable");f.url=f.url||d.p.editurl;if("1"===g){var t;a('td[role="gridcell"]',u).each(function(c){t=d.p.colModel[c];r=t.name;if("cb"!==r&&"subgrid"!==r&&!0===t.editable&&"rn"!==r&&!a(this).hasClass("not-editable-cell")){switch(t.edittype){case "checkbox":var b=["Yes","No"];t.editoptions&&(b=t.editoptions.value.split(":"));k[r]=a("input",this).is(":checked")?
b[0]:b[1];break;case "text":case "password":case "textarea":case "button":k[r]=a("input, textarea",this).val();break;case "select":if(t.editoptions.multiple){var b=a("select",this),e=[];k[r]=a(b).val();k[r]=k[r]?k[r].join(","):"";a("select option:selected",this).each(function(d,b){e[d]=a(b).text()});y[r]=e.join(",")}else k[r]=a("select option:selected",this).val(),y[r]=a("select option:selected",this).text();t.formatter&&"select"===t.formatter&&(y={});break;case "custom":try{if(t.editoptions&&a.isFunction(t.editoptions.custom_value)){if(k[r]=
t.editoptions.custom_value.call(d,a(".customelement",this),"get"),void 0===k[r])throw"e2";}else throw"e1";}catch(g){"e1"===g&&a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_value' "+a.jgrid.edit.msg.nodefined,a.jgrid.edit.bClose),"e2"===g?a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_value' "+a.jgrid.edit.msg.novalue,a.jgrid.edit.bClose):a.jgrid.info_dialog(a.jgrid.errors.errcap,g.message,a.jgrid.edit.bClose)}}z=a.jgrid.checkValues.call(d,k[r],c);if(!1===z[0])return!1;d.p.autoencode&&
(k[r]=a.jgrid.htmlEncode(k[r]));"clientArray"!==f.url&&t.editoptions&&!0===t.editoptions.NullIfEmpty&&""===k[r]&&(v[r]="null")}});if(!1===z[0]){try{var q=a(d).jqGrid("getGridRowById",c),s=a.jgrid.findPos(q);a.jgrid.info_dialog(a.jgrid.errors.errcap,z[1],a.jgrid.edit.bClose,{left:s[0],top:s[1]+a(q).outerHeight()})}catch(A){alert(z[1])}return m}g=d.p.prmNames;q=c;s=!1===d.p.keyIndex?g.id:d.p.colModel[d.p.keyIndex+(!0===d.p.rownumbers?1:0)+(!0===d.p.multiselect?1:0)+(!0===d.p.subGrid?1:0)].name;k&&(k[g.oper]=
g.editoper,void 0===k[s]||""===k[s]?k[s]=c:u.id!==d.p.idPrefix+k[s]&&(g=a.jgrid.stripPref(d.p.idPrefix,c),void 0!==d.p._index[g]&&(d.p._index[k[s]]=d.p._index[g],delete d.p._index[g]),c=d.p.idPrefix+k[s],a(u).attr("id",c),d.p.selrow===q&&(d.p.selrow=c),a.isArray(d.p.selarrrow)&&(g=a.inArray(q,d.p.selarrrow),0<=g&&(d.p.selarrrow[g]=c)),d.p.multiselect&&(g="jqg_"+d.p.id+"_"+c,a("input.cbox",u).attr("id",g).attr("name",g))),void 0===d.p.inlineData&&(d.p.inlineData={}),k=a.extend({},k,d.p.inlineData,
f.extraparam));if("clientArray"===f.url){k=a.extend({},k,y);d.p.autoencode&&a.each(k,function(d,b){k[d]=a.jgrid.htmlDecode(b)});g=a(d).jqGrid("setRowData",c,k);a(u).attr("editable","0");for(s=0;s<d.p.savedRow.length;s++)if(String(d.p.savedRow[s].id)===String(q)){w=s;break}0<=w&&d.p.savedRow.splice(w,1);a(d).triggerHandler("jqGridInlineAfterSaveRow",[c,g,k,f]);a.isFunction(f.aftersavefunc)&&f.aftersavefunc.call(d,c,g,f);m=!0;a(u).removeClass("jqgrid-new-row").unbind("keydown")}else a("#lui_"+a.jgrid.jqID(d.p.id)).show(),
v=a.extend({},k,v),v[s]=a.jgrid.stripPref(d.p.idPrefix,v[s]),a.ajax(a.extend({url:f.url,data:a.isFunction(d.p.serializeRowData)?d.p.serializeRowData.call(d,v):v,type:f.mtype,async:!1,complete:function(b,e){a("#lui_"+a.jgrid.jqID(d.p.id)).hide();if("success"===e){var g=!0,h;h=a(d).triggerHandler("jqGridInlineSuccessSaveRow",[b,c,f]);a.isArray(h)||(h=[!0,k]);h[0]&&a.isFunction(f.successfunc)&&(h=f.successfunc.call(d,b));a.isArray(h)?(g=h[0],k=h[1]||k):g=h;if(!0===g){d.p.autoencode&&a.each(k,function(b,
d){k[b]=a.jgrid.htmlDecode(d)});k=a.extend({},k,y);a(d).jqGrid("setRowData",c,k);a(u).attr("editable","0");for(g=0;g<d.p.savedRow.length;g++)if(String(d.p.savedRow[g].id)===String(c)){w=g;break}0<=w&&d.p.savedRow.splice(w,1);a(d).triggerHandler("jqGridInlineAfterSaveRow",[c,b,k,f]);a.isFunction(f.aftersavefunc)&&f.aftersavefunc.call(d,c,b);m=!0;a(u).removeClass("jqgrid-new-row").unbind("keydown")}else a(d).triggerHandler("jqGridInlineErrorSaveRow",[c,b,e,null,f]),a.isFunction(f.errorfunc)&&f.errorfunc.call(d,
c,b,e,null),!0===f.restoreAfterError&&a(d).jqGrid("restoreRow",c,f.afterrestorefunc)}},error:function(b,e,g){a("#lui_"+a.jgrid.jqID(d.p.id)).hide();a(d).triggerHandler("jqGridInlineErrorSaveRow",[c,b,e,g,f]);if(a.isFunction(f.errorfunc))f.errorfunc.call(d,c,b,e,g);else{b=b.responseText||b.statusText;try{a.jgrid.info_dialog(a.jgrid.errors.errcap,'<div class="ui-state-error">'+b+"</div>",a.jgrid.edit.bClose,{buttonalign:"right"})}catch(h){alert(b)}}!0===f.restoreAfterError&&a(d).jqGrid("restoreRow",
c,f.afterrestorefunc)}},a.jgrid.ajaxOptions,d.p.ajaxRowOptions||{}))}return m}},restoreRow:function(c,e){var b=a.makeArray(arguments).slice(1),l={};"object"===a.type(b[0])?l=b[0]:a.isFunction(e)&&(l.afterrestorefunc=e);l=a.extend(!0,{},a.jgrid.inlineEdit,l);return this.each(function(){var b=this,e=-1,p,g={},f;if(b.grid&&(p=a(b).jqGrid("getInd",c,!0),!1!==p&&(f=a.isFunction(l.beforeCancelRow)?l.beforeCancelRow.call(b,l,sr):void 0,void 0===f&&(f=!0),f))){for(f=0;f<b.p.savedRow.length;f++)if(String(b.p.savedRow[f].id)===
String(c)){e=f;break}if(0<=e){if(a.isFunction(a.fn.datepicker))try{a("input.hasDatepicker","#"+a.jgrid.jqID(p.id)).datepicker("hide")}catch(m){}a.each(b.p.colModel,function(){!0===this.editable&&b.p.savedRow[e].hasOwnProperty(this.name)&&(g[this.name]=b.p.savedRow[e][this.name])});a(b).jqGrid("setRowData",c,g);a(p).attr("editable","0").unbind("keydown");b.p.savedRow.splice(e,1);a("#"+a.jgrid.jqID(c),"#"+a.jgrid.jqID(b.p.id)).hasClass("jqgrid-new-row")&&setTimeout(function(){a(b).jqGrid("delRowData",
c);a(b).jqGrid("showAddEditButtons")},0)}a(b).triggerHandler("jqGridInlineAfterRestoreRow",[c]);a.isFunction(l.afterrestorefunc)&&l.afterrestorefunc.call(b,c)}})},addRow:function(c){c=a.extend(!0,{rowID:null,initdata:{},position:"first",useDefValues:!0,useFormatter:!1,addRowParams:{extraparam:{}}},c||{});return this.each(function(){if(this.grid){var e=this,b=a.isFunction(c.beforeAddRow)?c.beforeAddRow.call(e,c.addRowParams):void 0;void 0===b&&(b=!0);b&&(c.rowID=a.isFunction(c.rowID)?c.rowID.call(e,
c):null!=c.rowID?c.rowID:a.jgrid.randId(),!0===c.useDefValues&&a(e.p.colModel).each(function(){if(this.editoptions&&this.editoptions.defaultValue){var b=this.editoptions.defaultValue,b=a.isFunction(b)?b.call(e):b;c.initdata[this.name]=b}}),a(e).jqGrid("addRowData",c.rowID,c.initdata,c.position),c.rowID=e.p.idPrefix+c.rowID,a("#"+a.jgrid.jqID(c.rowID),"#"+a.jgrid.jqID(e.p.id)).addClass("jqgrid-new-row"),c.useFormatter?a("#"+a.jgrid.jqID(c.rowID)+" .ui-inline-edit","#"+a.jgrid.jqID(e.p.id)).click():
(b=e.p.prmNames,c.addRowParams.extraparam[b.oper]=b.addoper,a(e).jqGrid("editRow",c.rowID,c.addRowParams),a(e).jqGrid("setSelection",c.rowID)))}})},inlineNav:function(c,e){e=a.extend(!0,{edit:!0,editicon:"ui-icon-pencil",add:!0,addicon:"ui-icon-plus",save:!0,saveicon:"ui-icon-disk",cancel:!0,cancelicon:"ui-icon-cancel",addParams:{addRowParams:{extraparam:{}}},editParams:{},restoreAfterSelect:!0},a.jgrid.nav,e||{});return this.each(function(){if(this.grid){var b=this,l,h=a.jgrid.jqID(b.p.id);b.p._inlinenav=
!0;if(!0===e.addParams.useFormatter){var n=b.p.colModel,p;for(p=0;p<n.length;p++)if(n[p].formatter&&"actions"===n[p].formatter){n[p].formatoptions&&(n=a.extend({keys:!1,onEdit:null,onSuccess:null,afterSave:null,onError:null,afterRestore:null,extraparam:{},url:null},n[p].formatoptions),e.addParams.addRowParams={keys:n.keys,oneditfunc:n.onEdit,successfunc:n.onSuccess,url:n.url,extraparam:n.extraparam,aftersavefunc:n.afterSave,errorfunc:n.onError,afterrestorefunc:n.afterRestore});break}}e.add&&a(b).jqGrid("navButtonAdd",
c,{caption:e.addtext,title:e.addtitle,buttonicon:e.addicon,id:b.p.id+"_iladd",onClickButton:function(){a(b).jqGrid("addRow",e.addParams);e.addParams.useFormatter||(a("#"+h+"_ilsave").removeClass("ui-state-disabled"),a("#"+h+"_ilcancel").removeClass("ui-state-disabled"),a("#"+h+"_iladd").addClass("ui-state-disabled"),a("#"+h+"_iledit").addClass("ui-state-disabled"))}});e.edit&&a(b).jqGrid("navButtonAdd",c,{caption:e.edittext,title:e.edittitle,buttonicon:e.editicon,id:b.p.id+"_iledit",onClickButton:function(){var c=
a(b).jqGrid("getGridParam","selrow");c?(a(b).jqGrid("editRow",c,e.editParams),a("#"+h+"_ilsave").removeClass("ui-state-disabled"),a("#"+h+"_ilcancel").removeClass("ui-state-disabled"),a("#"+h+"_iladd").addClass("ui-state-disabled"),a("#"+h+"_iledit").addClass("ui-state-disabled")):(a.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+h,jqm:!0}),a("#jqg_alrt").focus())}});e.save&&(a(b).jqGrid("navButtonAdd",c,{caption:e.savetext||"",title:e.savetitle||"Save row",buttonicon:e.saveicon,id:b.p.id+"_ilsave",onClickButton:function(){var c=
b.p.savedRow[0].id;if(c){var f=b.p.prmNames,m=f.oper,d=e.editParams;a("#"+a.jgrid.jqID(c),"#"+h).hasClass("jqgrid-new-row")?(e.addParams.addRowParams.extraparam[m]=f.addoper,d=e.addParams.addRowParams):(e.editParams.extraparam||(e.editParams.extraparam={}),e.editParams.extraparam[m]=f.editoper);a(b).jqGrid("saveRow",c,d)&&a(b).jqGrid("showAddEditButtons")}else a.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+h,jqm:!0}),a("#jqg_alrt").focus()}}),a("#"+h+"_ilsave").addClass("ui-state-disabled"));e.cancel&&
(a(b).jqGrid("navButtonAdd",c,{caption:e.canceltext||"",title:e.canceltitle||"Cancel row editing",buttonicon:e.cancelicon,id:b.p.id+"_ilcancel",onClickButton:function(){var c=b.p.savedRow[0].id,f=e.editParams;c?(a("#"+a.jgrid.jqID(c),"#"+h).hasClass("jqgrid-new-row")&&(f=e.addParams.addRowParams),a(b).jqGrid("restoreRow",c,f),a(b).jqGrid("showAddEditButtons")):(a.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+h,jqm:!0}),a("#jqg_alrt").focus())}}),a("#"+h+"_ilcancel").addClass("ui-state-disabled"));!0===
e.restoreAfterSelect&&(l=a.isFunction(b.p.beforeSelectRow)?b.p.beforeSelectRow:!1,b.p.beforeSelectRow=function(c,f){var h=!0;0<b.p.savedRow.length&&!0===b.p._inlinenav&&c!==b.p.selrow&&null!==b.p.selrow&&(b.p.selrow===e.addParams.rowID?a(b).jqGrid("delRowData",b.p.selrow):a(b).jqGrid("restoreRow",b.p.selrow,e.editParams),a(b).jqGrid("showAddEditButtons"));l&&(h=l.call(b,c,f));return h})}})},showAddEditButtons:function(){return this.each(function(){if(this.grid){var c=a.jgrid.jqID(this.p.id);a("#"+
c+"_ilsave").addClass("ui-state-disabled");a("#"+c+"_ilcancel").addClass("ui-state-disabled");a("#"+c+"_iladd").removeClass("ui-state-disabled");a("#"+c+"_iledit").removeClass("ui-state-disabled")}})}})})(jQuery);
(function(b){b.jgrid.extend({editCell:function(d,f,a){return this.each(function(){var c=this,g,e,h,k;if(c.grid&&!0===c.p.cellEdit){f=parseInt(f,10);c.p.selrow=c.rows[d].id;c.p.knv||b(c).jqGrid("GridNav");if(0<c.p.savedRow.length){if(!0===a&&d==c.p.iRow&&f==c.p.iCol)return;b(c).jqGrid("saveCell",c.p.savedRow[0].id,c.p.savedRow[0].ic)}else window.setTimeout(function(){b("#"+b.jgrid.jqID(c.p.knv)).attr("tabindex","-1").focus()},0);k=c.p.colModel[f];g=k.name;if("subgrid"!==g&&"cb"!==g&&"rn"!==g){h=b("td:eq("+
f+")",c.rows[d]);if(!0!==k.editable||!0!==a||h.hasClass("not-editable-cell"))0<=parseInt(c.p.iCol,10)&&0<=parseInt(c.p.iRow,10)&&(b("td:eq("+c.p.iCol+")",c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"),b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover")),h.addClass("edit-cell ui-state-highlight"),b(c.rows[d]).addClass("selected-row ui-state-hover"),e=h.html().replace(/\&#160\;/ig,""),b(c).triggerHandler("jqGridSelectCell",[c.rows[d].id,g,e,d,f]),b.isFunction(c.p.onSelectCell)&&
c.p.onSelectCell.call(c,c.rows[d].id,g,e,d,f);else{0<=parseInt(c.p.iCol,10)&&0<=parseInt(c.p.iRow,10)&&(b("td:eq("+c.p.iCol+")",c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"),b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover"));b(h).addClass("edit-cell ui-state-highlight");b(c.rows[d]).addClass("selected-row ui-state-hover");try{e=b.unformat.call(c,h,{rowId:c.rows[d].id,colModel:k},f)}catch(m){e=k.edittype&&"textarea"===k.edittype?b(h).text():b(h).html()}c.p.autoencode&&
(e=b.jgrid.htmlDecode(e));k.edittype||(k.edittype="text");c.p.savedRow.push({id:d,ic:f,name:g,v:e});if("&nbsp;"===e||"&#160;"===e||1===e.length&&160===e.charCodeAt(0))e="";if(b.isFunction(c.p.formatCell)){var l=c.p.formatCell.call(c,c.rows[d].id,g,e,d,f);void 0!==l&&(e=l)}b(c).triggerHandler("jqGridBeforeEditCell",[c.rows[d].id,g,e,d,f]);b.isFunction(c.p.beforeEditCell)&&c.p.beforeEditCell.call(c,c.rows[d].id,g,e,d,f);var l=b.extend({},k.editoptions||{},{id:d+"_"+g,name:g}),q=b.jgrid.createEl.call(c,
k.edittype,l,e,!0,b.extend({},b.jgrid.ajaxOptions,c.p.ajaxSelectOptions||{}));b(h).html("").append(q).attr("tabindex","0");b.jgrid.bindEv.call(c,q,l);window.setTimeout(function(){b(q).focus()},0);b("input, select, textarea",h).bind("keydown",function(a){27===a.keyCode&&(0<b("input.hasDatepicker",h).length?b(".ui-datepicker").is(":hidden")?b(c).jqGrid("restoreCell",d,f):b("input.hasDatepicker",h).datepicker("hide"):b(c).jqGrid("restoreCell",d,f));if(13===a.keyCode)return b(c).jqGrid("saveCell",d,f),
!1;if(9===a.keyCode){if(c.grid.hDiv.loading)return!1;a.shiftKey?b(c).jqGrid("prevCell",d,f):b(c).jqGrid("nextCell",d,f)}a.stopPropagation()});b(c).triggerHandler("jqGridAfterEditCell",[c.rows[d].id,g,e,d,f]);b.isFunction(c.p.afterEditCell)&&c.p.afterEditCell.call(c,c.rows[d].id,g,e,d,f)}c.p.iCol=f;c.p.iRow=d}}})},saveCell:function(d,f){return this.each(function(){var a=this,c;if(a.grid&&!0===a.p.cellEdit){c=1<=a.p.savedRow.length?0:null;if(null!==c){var g=b("td:eq("+f+")",a.rows[d]),e,h,k=a.p.colModel[f],
m=k.name,l=b.jgrid.jqID(m);switch(k.edittype){case "select":if(k.editoptions.multiple){var l=b("#"+d+"_"+l,a.rows[d]),q=[];(e=b(l).val())?e.join(","):e="";b("option:selected",l).each(function(a,c){q[a]=b(c).text()});h=q.join(",")}else e=b("#"+d+"_"+l+" option:selected",a.rows[d]).val(),h=b("#"+d+"_"+l+" option:selected",a.rows[d]).text();k.formatter&&(h=e);break;case "checkbox":var n=["Yes","No"];k.editoptions&&(n=k.editoptions.value.split(":"));h=e=b("#"+d+"_"+l,a.rows[d]).is(":checked")?n[0]:n[1];
break;case "password":case "text":case "textarea":case "button":h=e=b("#"+d+"_"+l,a.rows[d]).val();break;case "custom":try{if(k.editoptions&&b.isFunction(k.editoptions.custom_value)){e=k.editoptions.custom_value.call(a,b(".customelement",g),"get");if(void 0===e)throw"e2";h=e}else throw"e1";}catch(r){"e1"===r&&b.jgrid.info_dialog(b.jgrid.errors.errcap,"function 'custom_value' "+b.jgrid.edit.msg.nodefined,b.jgrid.edit.bClose),"e2"===r?b.jgrid.info_dialog(b.jgrid.errors.errcap,"function 'custom_value' "+
b.jgrid.edit.msg.novalue,b.jgrid.edit.bClose):b.jgrid.info_dialog(b.jgrid.errors.errcap,r.message,b.jgrid.edit.bClose)}}if(h!==a.p.savedRow[c].v){if(c=b(a).triggerHandler("jqGridBeforeSaveCell",[a.rows[d].id,m,e,d,f]))h=e=c;b.isFunction(a.p.beforeSaveCell)&&(c=a.p.beforeSaveCell.call(a,a.rows[d].id,m,e,d,f))&&(h=e=c);var s=b.jgrid.checkValues.call(a,e,f);if(!0===s[0]){c=b(a).triggerHandler("jqGridBeforeSubmitCell",[a.rows[d].id,m,e,d,f])||{};b.isFunction(a.p.beforeSubmitCell)&&((c=a.p.beforeSubmitCell.call(a,
a.rows[d].id,m,e,d,f))||(c={}));0<b("input.hasDatepicker",g).length&&b("input.hasDatepicker",g).datepicker("hide");if("remote"===a.p.cellsubmit)if(a.p.cellurl){var p={};a.p.autoencode&&(e=b.jgrid.htmlEncode(e));p[m]=e;n=a.p.prmNames;k=n.id;l=n.oper;p[k]=b.jgrid.stripPref(a.p.idPrefix,a.rows[d].id);p[l]=n.editoper;p=b.extend(c,p);b("#lui_"+b.jgrid.jqID(a.p.id)).show();a.grid.hDiv.loading=!0;b.ajax(b.extend({url:a.p.cellurl,data:b.isFunction(a.p.serializeCellData)?a.p.serializeCellData.call(a,p):p,
type:"POST",complete:function(c,k){b("#lui_"+a.p.id).hide();a.grid.hDiv.loading=!1;if("success"===k){var l=b(a).triggerHandler("jqGridAfterSubmitCell",[a,c,p.id,m,e,d,f])||[!0,""];!0===l[0]&&b.isFunction(a.p.afterSubmitCell)&&(l=a.p.afterSubmitCell.call(a,c,p.id,m,e,d,f));!0===l[0]?(b(g).empty(),b(a).jqGrid("setCell",a.rows[d].id,f,h,!1,!1,!0),b(g).addClass("dirty-cell"),b(a.rows[d]).addClass("edited"),b(a).triggerHandler("jqGridAfterSaveCell",[a.rows[d].id,m,e,d,f]),b.isFunction(a.p.afterSaveCell)&&
a.p.afterSaveCell.call(a,a.rows[d].id,m,e,d,f),a.p.savedRow.splice(0,1)):(b.jgrid.info_dialog(b.jgrid.errors.errcap,l[1],b.jgrid.edit.bClose),b(a).jqGrid("restoreCell",d,f))}},error:function(c,e,h){b("#lui_"+b.jgrid.jqID(a.p.id)).hide();a.grid.hDiv.loading=!1;b(a).triggerHandler("jqGridErrorCell",[c,e,h]);b.isFunction(a.p.errorCell)?a.p.errorCell.call(a,c,e,h):b.jgrid.info_dialog(b.jgrid.errors.errcap,c.status+" : "+c.statusText+"<br/>"+e,b.jgrid.edit.bClose);b(a).jqGrid("restoreCell",d,f)}},b.jgrid.ajaxOptions,
a.p.ajaxCellOptions||{}))}else try{b.jgrid.info_dialog(b.jgrid.errors.errcap,b.jgrid.errors.nourl,b.jgrid.edit.bClose),b(a).jqGrid("restoreCell",d,f)}catch(t){}"clientArray"===a.p.cellsubmit&&(b(g).empty(),b(a).jqGrid("setCell",a.rows[d].id,f,h,!1,!1,!0),b(g).addClass("dirty-cell"),b(a.rows[d]).addClass("edited"),b(a).triggerHandler("jqGridAfterSaveCell",[a.rows[d].id,m,e,d,f]),b.isFunction(a.p.afterSaveCell)&&a.p.afterSaveCell.call(a,a.rows[d].id,m,e,d,f),a.p.savedRow.splice(0,1))}else try{window.setTimeout(function(){b.jgrid.info_dialog(b.jgrid.errors.errcap,
e+" "+s[1],b.jgrid.edit.bClose)},100),b(a).jqGrid("restoreCell",d,f)}catch(u){}}else b(a).jqGrid("restoreCell",d,f)}window.setTimeout(function(){b("#"+b.jgrid.jqID(a.p.knv)).attr("tabindex","-1").focus()},0)}})},restoreCell:function(d,f){return this.each(function(){var a=this,c;if(a.grid&&!0===a.p.cellEdit){c=1<=a.p.savedRow.length?0:null;if(null!==c){var g=b("td:eq("+f+")",a.rows[d]);if(b.isFunction(b.fn.datepicker))try{b("input.hasDatepicker",g).datepicker("hide")}catch(e){}b(g).empty().attr("tabindex",
"-1");b(a).jqGrid("setCell",a.rows[d].id,f,a.p.savedRow[c].v,!1,!1,!0);b(a).triggerHandler("jqGridAfterRestoreCell",[a.rows[d].id,a.p.savedRow[c].v,d,f]);b.isFunction(a.p.afterRestoreCell)&&a.p.afterRestoreCell.call(a,a.rows[d].id,a.p.savedRow[c].v,d,f);a.p.savedRow.splice(0,1)}window.setTimeout(function(){b("#"+a.p.knv).attr("tabindex","-1").focus()},0)}})},nextCell:function(d,f){return this.each(function(){var a=!1,c;if(this.grid&&!0===this.p.cellEdit){for(c=f+1;c<this.p.colModel.length;c++)if(!0===
this.p.colModel[c].editable){a=c;break}!1!==a?b(this).jqGrid("editCell",d,a,!0):0<this.p.savedRow.length&&b(this).jqGrid("saveCell",d,f)}})},prevCell:function(d,f){return this.each(function(){var a=!1,c;if(this.grid&&!0===this.p.cellEdit){for(c=f-1;0<=c;c--)if(!0===this.p.colModel[c].editable){a=c;break}!1!==a?b(this).jqGrid("editCell",d,a,!0):0<this.p.savedRow.length&&b(this).jqGrid("saveCell",d,f)}})},GridNav:function(){return this.each(function(){function d(c,d,e){if("v"===e.substr(0,1)){var f=
b(a.grid.bDiv)[0].clientHeight,g=b(a.grid.bDiv)[0].scrollTop,n=a.rows[c].offsetTop+a.rows[c].clientHeight,r=a.rows[c].offsetTop;"vd"===e&&n>=f&&(b(a.grid.bDiv)[0].scrollTop=b(a.grid.bDiv)[0].scrollTop+a.rows[c].clientHeight);"vu"===e&&r<g&&(b(a.grid.bDiv)[0].scrollTop=b(a.grid.bDiv)[0].scrollTop-a.rows[c].clientHeight)}"h"===e&&(e=b(a.grid.bDiv)[0].clientWidth,f=b(a.grid.bDiv)[0].scrollLeft,g=a.rows[c].cells[d].offsetLeft,a.rows[c].cells[d].offsetLeft+a.rows[c].cells[d].clientWidth>=e+parseInt(f,
10)?b(a.grid.bDiv)[0].scrollLeft=b(a.grid.bDiv)[0].scrollLeft+a.rows[c].cells[d].clientWidth:g<f&&(b(a.grid.bDiv)[0].scrollLeft=b(a.grid.bDiv)[0].scrollLeft-a.rows[c].cells[d].clientWidth))}function f(b,c){var d,e;if("lft"===c)for(d=b+1,e=b;0<=e;e--)if(!0!==a.p.colModel[e].hidden){d=e;break}if("rgt"===c)for(d=b-1,e=b;e<a.p.colModel.length;e++)if(!0!==a.p.colModel[e].hidden){d=e;break}return d}var a=this;if(a.grid&&!0===a.p.cellEdit){a.p.knv=a.p.id+"_kn";var c=b("<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='"+
a.p.knv+"'></div></div>"),g,e;b(c).insertBefore(a.grid.cDiv);b("#"+a.p.knv).focus().keydown(function(c){e=c.keyCode;"rtl"===a.p.direction&&(37===e?e=39:39===e&&(e=37));switch(e){case 38:0<a.p.iRow-1&&(d(a.p.iRow-1,a.p.iCol,"vu"),b(a).jqGrid("editCell",a.p.iRow-1,a.p.iCol,!1));break;case 40:a.p.iRow+1<=a.rows.length-1&&(d(a.p.iRow+1,a.p.iCol,"vd"),b(a).jqGrid("editCell",a.p.iRow+1,a.p.iCol,!1));break;case 37:0<=a.p.iCol-1&&(g=f(a.p.iCol-1,"lft"),d(a.p.iRow,g,"h"),b(a).jqGrid("editCell",a.p.iRow,g,
!1));break;case 39:a.p.iCol+1<=a.p.colModel.length-1&&(g=f(a.p.iCol+1,"rgt"),d(a.p.iRow,g,"h"),b(a).jqGrid("editCell",a.p.iRow,g,!1));break;case 13:0<=parseInt(a.p.iCol,10)&&0<=parseInt(a.p.iRow,10)&&b(a).jqGrid("editCell",a.p.iRow,a.p.iCol,!0);break;default:return!0}return!1})}})},getChangedCells:function(d){var f=[];d||(d="all");this.each(function(){var a=this,c;a.grid&&!0===a.p.cellEdit&&b(a.rows).each(function(g){var e={};b(this).hasClass("edited")&&(b("td",this).each(function(f){c=a.p.colModel[f].name;
if("cb"!==c&&"subgrid"!==c)if("dirty"===d){if(b(this).hasClass("dirty-cell"))try{e[c]=b.unformat.call(a,this,{rowId:a.rows[g].id,colModel:a.p.colModel[f]},f)}catch(k){e[c]=b.jgrid.htmlDecode(b(this).html())}}else try{e[c]=b.unformat.call(a,this,{rowId:a.rows[g].id,colModel:a.p.colModel[f]},f)}catch(m){e[c]=b.jgrid.htmlDecode(b(this).html())}}),e.id=this.id,f.push(e))})});return f}})})(jQuery);
(function(c){c.fn.jqm=function(a){var k={overlay:50,closeoverlay:!0,overlayClass:"jqmOverlay",closeClass:"jqmClose",trigger:".jqModal",ajax:d,ajaxText:"",target:d,modal:d,toTop:d,onShow:d,onHide:d,onLoad:d};return this.each(function(){if(this._jqm)return l[this._jqm].c=c.extend({},l[this._jqm].c,a);n++;this._jqm=n;l[n]={c:c.extend(k,c.jqm.params,a),a:d,w:c(this).addClass("jqmID"+n),s:n};k.trigger&&c(this).jqmAddTrigger(k.trigger)})};c.fn.jqmAddClose=function(a){return r(this,a,"jqmHide")};c.fn.jqmAddTrigger=
function(a){return r(this,a,"jqmShow")};c.fn.jqmShow=function(a){return this.each(function(){c.jqm.open(this._jqm,a)})};c.fn.jqmHide=function(a){return this.each(function(){c.jqm.close(this._jqm,a)})};c.jqm={hash:{},open:function(a,k){var b=l[a],e=b.c,h="."+e.closeClass,f=parseInt(b.w.css("z-index")),f=0<f?f:3E3,g=c("<div></div>").css({height:"100%",width:"100%",position:"fixed",left:0,top:0,"z-index":f-1,opacity:e.overlay/100});if(b.a)return d;b.t=k;b.a=!0;b.w.css("z-index",f);e.modal?(m[0]||setTimeout(function(){s("bind")},
1),m.push(a)):0<e.overlay?e.closeoverlay&&b.w.jqmAddClose(g):g=d;b.o=g?g.addClass(e.overlayClass).prependTo("body"):d;e.ajax?(f=e.target||b.w,g=e.ajax,f="string"==typeof f?c(f,b.w):c(f),g="@"==g.substr(0,1)?c(k).attr(g.substring(1)):g,f.html(e.ajaxText).load(g,function(){e.onLoad&&e.onLoad.call(this,b);h&&b.w.jqmAddClose(c(h,b.w));p(b)})):h&&b.w.jqmAddClose(c(h,b.w));e.toTop&&b.o&&b.w.before('<span id="jqmP'+b.w[0]._jqm+'"></span>').insertAfter(b.o);e.onShow?e.onShow(b):b.w.show();p(b);return d},
close:function(a){a=l[a];if(!a.a)return d;a.a=d;m[0]&&(m.pop(),m[0]||s("unbind"));a.c.toTop&&a.o&&c("#jqmP"+a.w[0]._jqm).after(a.w).remove();if(a.c.onHide)a.c.onHide(a);else a.w.hide(),a.o&&a.o.remove();return d},params:{}};var n=0,l=c.jqm.hash,m=[],d=!1,p=function(a){try{c(":input:visible",a.w)[0].focus()}catch(d){}},s=function(a){c(document)[a]("keypress",q)[a]("keydown",q)[a]("mousedown",q)},q=function(a){var d=l[m[m.length-1]],b=!c(a.target).parents(".jqmID"+d.s)[0];b&&(c(".jqmID"+d.s).each(function(){var d=
c(this),h=d.offset();if(h.top<=a.pageY&&a.pageY<=h.top+d.height()&&h.left<=a.pageX&&a.pageX<=h.left+d.width())return b=!1}),p(d));return!b},r=function(a,k,b){return a.each(function(){var a=this._jqm;c(k).each(function(){this[b]||(this[b]=[],c(this).click(function(){for(var a in{jqmShow:1,jqmHide:1})for(var b in this[a])if(l[this[a][b]])l[this[a][b]].w[a](this);return d}));this[b].push(a)})})}})(jQuery);
(function(b){b.fn.jqDrag=function(a){return h(this,a,"d")};b.fn.jqResize=function(a,b){return h(this,a,"r",b)};b.jqDnR={dnr:{},e:0,drag:function(a){"d"==d.k?e.css({left:d.X+a.pageX-d.pX,top:d.Y+a.pageY-d.pY}):(e.css({width:Math.max(a.pageX-d.pX+d.W,0),height:Math.max(a.pageY-d.pY+d.H,0)}),f&&g.css({width:Math.max(a.pageX-f.pX+f.W,0),height:Math.max(a.pageY-f.pY+f.H,0)}));return!1},stop:function(){b(document).unbind("mousemove",c.drag).unbind("mouseup",c.stop)}};var c=b.jqDnR,d=c.dnr,e=c.e,g,f,h=function(a,
c,h,n){return a.each(function(){c=c?b(c,a):a;c.bind("mousedown",{e:a,k:h},function(a){var c=a.data,k={};e=c.e;g=n?b(n):!1;if("relative"!=e.css("position"))try{e.position(k)}catch(h){}d={X:k.left||l("left")||0,Y:k.top||l("top")||0,W:l("width")||e[0].scrollWidth||0,H:l("height")||e[0].scrollHeight||0,pX:a.pageX,pY:a.pageY,k:c.k};f=g&&"d"!=c.k?{X:k.left||m("left")||0,Y:k.top||m("top")||0,W:g[0].offsetWidth||m("width")||0,H:g[0].offsetHeight||m("height")||0,pX:a.pageX,pY:a.pageY,k:c.k}:!1;if(b("input.hasDatepicker",
e[0])[0])try{b("input.hasDatepicker",e[0]).datepicker("hide")}catch(p){}b(document).mousemove(b.jqDnR.drag).mouseup(b.jqDnR.stop);return!1})})},l=function(a){return parseInt(e.css(a),10)||!1},m=function(a){return parseInt(g.css(a),10)||!1}})(jQuery);
(function(b){b.jgrid.extend({setSubGrid:function(){return this.each(function(){var d,c;this.p.subGridOptions=b.extend({plusicon:"ui-icon-plus",minusicon:"ui-icon-minus",openicon:"ui-icon-carat-1-sw",expandOnLoad:!1,delayOnLoad:50,selectOnExpand:!1,selectOnCollapse:!1,reloadOnExpand:!0},this.p.subGridOptions||{});this.p.colNames.unshift("");this.p.colModel.unshift({name:"subgrid",width:b.jgrid.cell_width?this.p.subGridWidth+this.p.cellLayout:this.p.subGridWidth,sortable:!1,resizable:!1,hidedlg:!0,
search:!1,fixed:!0});d=this.p.subGridModel;if(d[0])for(d[0].align=b.extend([],d[0].align||[]),c=0;c<d[0].name.length;c++)d[0].align[c]=d[0].align[c]||"left"})},addSubGridCell:function(b,c){var a="",p,n;this.each(function(){a=this.formatCol(b,c);n=this.p.id;p=this.p.subGridOptions.plusicon});return'<td role="gridcell" aria-describedby="'+n+'_subgrid" class="ui-sgcollapsed sgcollapsed" '+a+"><a style='cursor:pointer;'><span class='ui-icon "+p+"'></span></a></td>"},addSubGrid:function(d,c){return this.each(function(){var a=
this;if(a.grid){var p=function(c,d,h){d=b("<td align='"+a.p.subGridModel[0].align[h]+"'></td>").html(d);b(c).append(d)},n=function(c,d){var h,f,e,g=b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),k=b("<tr></tr>");for(f=0;f<a.p.subGridModel[0].name.length;f++)h=b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-"+a.p.direction+"'></th>"),b(h).html(a.p.subGridModel[0].name[f]),b(h).width(a.p.subGridModel[0].width[f]),b(k).append(h);b(g).append(k);c&&(e=a.p.xmlReader.subgrid,
b(e.root+" "+e.row,c).each(function(){k=b("<tr class='ui-widget-content ui-subtblcell'></tr>");if(!0===e.repeatitems)b(e.cell,this).each(function(a){p(k,b(this).text()||"&#160;",a)});else{var c=a.p.subGridModel[0].mapping||a.p.subGridModel[0].name;if(c)for(f=0;f<c.length;f++)p(k,b(c[f],this).text()||"&#160;",f)}b(g).append(k)}));h=b("table:first",a.grid.bDiv).attr("id")+"_";b("#"+b.jgrid.jqID(h+d)).append(g);a.grid.hDiv.loading=!1;b("#load_"+b.jgrid.jqID(a.p.id)).hide();return!1},r=function(c,d){var h,
f,e,g,k,m=b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),l=b("<tr></tr>");for(f=0;f<a.p.subGridModel[0].name.length;f++)h=b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-"+a.p.direction+"'></th>"),b(h).html(a.p.subGridModel[0].name[f]),b(h).width(a.p.subGridModel[0].width[f]),b(l).append(h);b(m).append(l);if(c&&(g=a.p.jsonReader.subgrid,h=b.jgrid.getAccessor(c,g.root),void 0!==h))for(f=0;f<h.length;f++){e=h[f];l=b("<tr class='ui-widget-content ui-subtblcell'></tr>");
if(!0===g.repeatitems)for(g.cell&&(e=e[g.cell]),k=0;k<e.length;k++)p(l,e[k]||"&#160;",k);else{var n=a.p.subGridModel[0].mapping||a.p.subGridModel[0].name;if(n.length)for(k=0;k<n.length;k++)p(l,e[n[k]]||"&#160;",k)}b(m).append(l)}f=b("table:first",a.grid.bDiv).attr("id")+"_";b("#"+b.jgrid.jqID(f+d)).append(m);a.grid.hDiv.loading=!1;b("#load_"+b.jgrid.jqID(a.p.id)).hide();return!1},v=function(c){var e,d,f,g;e=b(c).attr("id");d={nd_:(new Date).getTime()};d[a.p.prmNames.subgridid]=e;if(!a.p.subGridModel[0])return!1;
if(a.p.subGridModel[0].params)for(g=0;g<a.p.subGridModel[0].params.length;g++)for(f=0;f<a.p.colModel.length;f++)a.p.colModel[f].name===a.p.subGridModel[0].params[g]&&(d[a.p.colModel[f].name]=b("td:eq("+f+")",c).text().replace(/\&#160\;/ig,""));if(!a.grid.hDiv.loading)switch(a.grid.hDiv.loading=!0,b("#load_"+b.jgrid.jqID(a.p.id)).show(),a.p.subgridtype||(a.p.subgridtype=a.p.datatype),b.isFunction(a.p.subgridtype)?a.p.subgridtype.call(a,d):a.p.subgridtype=a.p.subgridtype.toLowerCase(),a.p.subgridtype){case "xml":case "json":b.ajax(b.extend({type:a.p.mtype,
url:a.p.subGridUrl,dataType:a.p.subgridtype,data:b.isFunction(a.p.serializeSubGridData)?a.p.serializeSubGridData.call(a,d):d,complete:function(c){"xml"===a.p.subgridtype?n(c.responseXML,e):r(b.jgrid.parse(c.responseText),e)}},b.jgrid.ajaxOptions,a.p.ajaxSubgridOptions||{}))}return!1},e,m,s,t=0,g,l;b.each(a.p.colModel,function(){!0!==this.hidden&&"rn"!==this.name&&"cb"!==this.name||t++});var u=a.rows.length,q=1;void 0!==c&&0<c&&(q=c,u=c+1);for(;q<u;)b(a.rows[q]).hasClass("jqgrow")&&b(a.rows[q].cells[d]).bind("click",
function(){var c=b(this).parent("tr")[0];l=c.nextSibling;if(b(this).hasClass("sgcollapsed")){m=a.p.id;e=c.id;if(!0===a.p.subGridOptions.reloadOnExpand||!1===a.p.subGridOptions.reloadOnExpand&&!b(l).hasClass("ui-subgrid")){s=1<=d?"<td colspan='"+d+"'>&#160;</td>":"";g=b(a).triggerHandler("jqGridSubGridBeforeExpand",[m+"_"+e,e]);(g=!1===g||"stop"===g?!1:!0)&&b.isFunction(a.p.subGridBeforeExpand)&&(g=a.p.subGridBeforeExpand.call(a,m+"_"+e,e));if(!1===g)return!1;b(c).after("<tr role='row' class='ui-subgrid'>"+
s+"<td class='ui-widget-content subgrid-cell'><span class='ui-icon "+a.p.subGridOptions.openicon+"'></span></td><td colspan='"+parseInt(a.p.colNames.length-1-t,10)+"' class='ui-widget-content subgrid-data'><div id="+m+"_"+e+" class='tablediv'></div></td></tr>");b(a).triggerHandler("jqGridSubGridRowExpanded",[m+"_"+e,e]);b.isFunction(a.p.subGridRowExpanded)?a.p.subGridRowExpanded.call(a,m+"_"+e,e):v(c)}else b(l).show();b(this).html("<a style='cursor:pointer;'><span class='ui-icon "+a.p.subGridOptions.minusicon+
"'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");a.p.subGridOptions.selectOnExpand&&b(a).jqGrid("setSelection",e)}else if(b(this).hasClass("sgexpanded")){g=b(a).triggerHandler("jqGridSubGridRowColapsed",[m+"_"+e,e]);g=!1===g||"stop"===g?!1:!0;e=c.id;g&&b.isFunction(a.p.subGridRowColapsed)&&(g=a.p.subGridRowColapsed.call(a,m+"_"+e,e));if(!1===g)return!1;!0===a.p.subGridOptions.reloadOnExpand?b(l).remove(".ui-subgrid"):b(l).hasClass("ui-subgrid")&&b(l).hide();b(this).html("<a style='cursor:pointer;'><span class='ui-icon "+
a.p.subGridOptions.plusicon+"'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed");a.p.subGridOptions.selectOnCollapse&&b(a).jqGrid("setSelection",e)}return!1}),q++;!0===a.p.subGridOptions.expandOnLoad&&b(a.rows).filter(".jqgrow").each(function(a,c){b(c.cells[0]).click()});a.subGridXml=function(a,b){n(a,b)};a.subGridJson=function(a,b){r(a,b)}}})},expandSubGridRow:function(d){return this.each(function(){if((this.grid||d)&&!0===this.p.subGrid){var c=b(this).jqGrid("getInd",d,!0);c&&(c=b("td.sgcollapsed",
c)[0])&&b(c).trigger("click")}})},collapseSubGridRow:function(d){return this.each(function(){if((this.grid||d)&&!0===this.p.subGrid){var c=b(this).jqGrid("getInd",d,!0);c&&(c=b("td.sgexpanded",c)[0])&&b(c).trigger("click")}})},toggleSubGridRow:function(d){return this.each(function(){if((this.grid||d)&&!0===this.p.subGrid){var c=b(this).jqGrid("getInd",d,!0);if(c){var a=b("td.sgcollapsed",c)[0];a?b(a).trigger("click"):(a=b("td.sgexpanded",c)[0])&&b(a).trigger("click")}}})}})})(jQuery);
(function(d){d.extend(d.jgrid,{template:function(b){var k=d.makeArray(arguments).slice(1),a,c=k.length;null==b&&(b="");return b.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,function(b,m){if(!isNaN(parseInt(m,10)))return k[parseInt(m,10)];for(a=0;a<c;a++)if(d.isArray(k[a]))for(var e=k[a],f=e.length;f--;)if(m===e[f].nm)return e[f].v})}});d.jgrid.extend({groupingSetup:function(){return this.each(function(){var b,k,a=this.p.colModel,c=this.p.groupingView;if(null===c||"object"!==typeof c&&!d.isFunction(c))this.p.grouping=
!1;else if(c.groupField.length){void 0===c.visibiltyOnNextGrouping&&(c.visibiltyOnNextGrouping=[]);c.lastvalues=[];c._locgr||(c.groups=[]);c.counters=[];for(b=0;b<c.groupField.length;b++)c.groupOrder[b]||(c.groupOrder[b]="asc"),c.groupText[b]||(c.groupText[b]="{0}"),"boolean"!==typeof c.groupColumnShow[b]&&(c.groupColumnShow[b]=!0),"boolean"!==typeof c.groupSummary[b]&&(c.groupSummary[b]=!1),c.groupSummaryPos[b]||(c.groupSummaryPos[b]="footer"),!0===c.groupColumnShow[b]?(c.visibiltyOnNextGrouping[b]=
!0,d(this).jqGrid("showCol",c.groupField[b])):(c.visibiltyOnNextGrouping[b]=d("#"+d.jgrid.jqID(this.p.id+"_"+c.groupField[b])).is(":visible"),d(this).jqGrid("hideCol",c.groupField[b]));c.summary=[];c.hideFirstGroupCol&&(c.formatDisplayField[0]=function(a){return a});b=0;for(k=a.length;b<k;b++)c.hideFirstGroupCol&&!a[b].hidden&&c.groupField[0]===a[b].name&&(a[b].formatter=function(){return""}),a[b].summaryType&&(a[b].summaryDivider?c.summary.push({nm:a[b].name,st:a[b].summaryType,v:"",sd:a[b].summaryDivider,
vd:"",sr:a[b].summaryRound,srt:a[b].summaryRoundType||"round"}):c.summary.push({nm:a[b].name,st:a[b].summaryType,v:"",sr:a[b].summaryRound,srt:a[b].summaryRoundType||"round"}))}else this.p.grouping=!1})},groupingPrepare:function(b,k){this.each(function(){var a=this.p.groupingView,c=this,g,m=a.groupField.length,e,f,h,p=0;for(g=0;g<m;g++)e=a.groupField[g],h=a.displayField[g],f=b[e],h=null==h?null:b[h],null==h&&(h=f),void 0!==f&&(0===k?(a.groups.push({idx:g,dataIndex:e,value:f,displayValue:h,startRow:k,
cnt:1,summary:[]}),a.lastvalues[g]=f,a.counters[g]={cnt:1,pos:a.groups.length-1,summary:d.extend(!0,[],a.summary)}):"object"===typeof f||(d.isArray(a.isInTheSameGroup)&&d.isFunction(a.isInTheSameGroup[g])?a.isInTheSameGroup[g].call(c,a.lastvalues[g],f,g,a):a.lastvalues[g]===f)?1===p?(a.groups.push({idx:g,dataIndex:e,value:f,displayValue:h,startRow:k,cnt:1,summary:[]}),a.lastvalues[g]=f,a.counters[g]={cnt:1,pos:a.groups.length-1,summary:d.extend(!0,[],a.summary)}):(a.counters[g].cnt+=1,a.groups[a.counters[g].pos].cnt=
a.counters[g].cnt):(a.groups.push({idx:g,dataIndex:e,value:f,displayValue:h,startRow:k,cnt:1,summary:[]}),a.lastvalues[g]=f,p=1,a.counters[g]={cnt:1,pos:a.groups.length-1,summary:d.extend(!0,[],a.summary)}),d.each(a.counters[g].summary,function(){d.isFunction(this.st)?this.v=this.st.call(c,this.v,this.nm,b):(this.v=d(c).jqGrid("groupingCalculations.handler",this.st,this.v,this.nm,this.sr,this.srt,b),"avg"===this.st.toLowerCase()&&this.sd&&(this.vd=d(c).jqGrid("groupingCalculations.handler",this.st,
this.vd,this.sd,this.sr,this.srt,b)))}),a.groups[a.counters[g].pos].summary=a.counters[g].summary)});return this},groupingToggle:function(b){this.each(function(){var k=this.p.groupingView,a=b.split("_"),c=parseInt(a[a.length-2],10);a.splice(a.length-2,2);var g=a.join("_"),a=k.minusicon,m=k.plusicon,e=d("#"+d.jgrid.jqID(b)),e=e.length?e[0].nextSibling:null,f=d("#"+d.jgrid.jqID(b)+" span.tree-wrap-"+this.p.direction),h=function(a){a=d.map(a.split(" "),function(a){if(a.substring(0,g.length+1)===g+"_")return parseInt(a.substring(g.length+
1),10)});return 0<a.length?a[0]:void 0},p,r=!1,q=this.p.frozenColumns?this.p.id+"_frozen":!1,n=q?d("#"+d.jgrid.jqID(b),"#"+d.jgrid.jqID(q)):!1,n=n&&n.length?n[0].nextSibling:null;if(f.hasClass(a)){if(k.showSummaryOnHide){if(e)for(;e&&!(d(e).hasClass("jqfoot")&&parseInt(d(e).attr("jqfootlevel"),10)<=c);)d(e).hide(),e=e.nextSibling,q&&(d(n).hide(),n=n.nextSibling)}else if(e)for(;e;){k=h(e.className);if(void 0!==k&&k<=c)break;d(e).hide();e=e.nextSibling;q&&(d(n).hide(),n=n.nextSibling)}f.removeClass(a).addClass(m);
r=!0}else{if(e)for(p=void 0;e;){k=h(e.className);void 0===p&&(p=void 0===k);if(void 0!==k){if(k<=c)break;k===c+1&&(d(e).show().find(">td>span.tree-wrap-"+this.p.direction).removeClass(a).addClass(m),q&&d(n).show().find(">td>span.tree-wrap-"+this.p.direction).removeClass(a).addClass(m))}else p&&(d(e).show(),q&&d(n).show());e=e.nextSibling;q&&(n=n.nextSibling)}f.removeClass(m).addClass(a)}d(this).triggerHandler("jqGridGroupingClickGroup",[b,r]);d.isFunction(this.p.onClickGroup)&&this.p.onClickGroup.call(this,
b,r)});return!1},groupingRender:function(b,k,a,c){return this.each(function(){function g(a,b,c){var d=!1;if(0===b)d=c[a];else{var e=c[a].idx;if(0===e)d=c[a];else for(;0<=a;a--)if(c[a].idx===e-b){d=c[a];break}}return d}function m(a,b,c,f){var h=g(a,b,c),m=e.p.colModel,n,q=h.cnt;a="";var p;for(p=f;p<k;p++){var r="<td "+e.formatCol(p,1,"")+">&#160;</td>",t="{0}";d.each(h.summary,function(){if(this.nm===m[p].name){m[p].summaryTpl&&(t=m[p].summaryTpl);"string"===typeof this.st&&"avg"===this.st.toLowerCase()&&
(this.sd&&this.vd?this.v/=this.vd:this.v&&0<q&&(this.v/=q));try{this.groupCount=h.cnt,this.groupIndex=h.dataIndex,this.groupValue=h.value,n=e.formatter("",this.v,p,this)}catch(a){n=this.v}r="<td "+e.formatCol(p,1,"")+">"+d.jgrid.format(t,n)+"</td>";return!1}});a+=r}return a}var e=this,f=e.p.groupingView,h="",p="",r,q,n=f.groupCollapse?f.plusicon:f.minusicon,t,y=[],z=f.groupField.length,n=n+(" tree-wrap-"+e.p.direction);d.each(e.p.colModel,function(a,b){var c;for(c=0;c<z;c++)if(f.groupField[c]===b.name){y[c]=
a;break}});var x=0,A=d.makeArray(f.groupSummary);A.reverse();d.each(f.groups,function(g,l){if(f._locgr&&!(l.startRow+l.cnt>(a-1)*c&&l.startRow<a*c))return!0;x++;q=e.p.id+"ghead_"+l.idx;r=q+"_"+g;p="<span style='cursor:pointer;' class='ui-icon "+n+"' onclick=\"jQuery('#"+d.jgrid.jqID(e.p.id)+"').jqGrid('groupingToggle','"+r+"');return false;\"></span>";try{d.isArray(f.formatDisplayField)&&d.isFunction(f.formatDisplayField[l.idx])?(l.displayValue=f.formatDisplayField[l.idx].call(e,l.displayValue,l.value,
e.p.colModel[y[l.idx]],l.idx,f),t=l.displayValue):t=e.formatter(r,l.displayValue,y[l.idx],l.value)}catch(C){t=l.displayValue}"header"===f.groupSummaryPos[l.idx]?(h+='<tr id="'+r+'"'+(f.groupCollapse&&0<l.idx?' style="display:none;" ':" ")+'role="row" class= "ui-widget-content jqgroup ui-row-'+e.p.direction+" "+q+'"><td style="padding-left:'+12*l.idx+'px;">'+p+d.jgrid.template(f.groupText[l.idx],t,l.cnt,l.summary)+"</td>",h+=m(g,l.idx-1,f.groups,1),h+="</tr>"):h+='<tr id="'+r+'"'+(f.groupCollapse&&
0<l.idx?' style="display:none;" ':" ")+'role="row" class= "ui-widget-content jqgroup ui-row-'+e.p.direction+" "+q+'"><td style="padding-left:'+12*l.idx+'px;" colspan="'+k+'">'+p+d.jgrid.template(f.groupText[l.idx],t,l.cnt,l.summary)+"</td></tr>";if(z-1===l.idx){var s=f.groups[g+1],v,u=0;v=l.startRow;var B=void 0!==s?f.groups[g+1].startRow:b.length;f._locgr&&(u=(a-1)*c,u>l.startRow&&(v=u));for(;v<B&&b[v-u];v++)h+=b[v-u].join("");if("header"!==f.groupSummaryPos[l.idx]){var w;if(void 0!==s){for(w=0;w<
f.groupField.length&&s.dataIndex!==f.groupField[w];w++);x=f.groupField.length-w}for(s=0;s<x;s++)A[s]&&(u="",f.groupCollapse&&!f.showSummaryOnHide&&(u=' style="display:none;"'),h+="<tr"+u+' jqfootlevel="'+(l.idx-s)+'" role="row" class="ui-widget-content jqfoot ui-row-'+e.p.direction+'">',h+=m(g,s,f.groups,0),h+="</tr>");x=w}}});d("#"+d.jgrid.jqID(e.p.id)+" tbody:first").append(h);h=null})},groupingGroupBy:function(b,k){return this.each(function(){"string"===typeof b&&(b=[b]);var a=this.p.groupingView;
this.p.grouping=!0;void 0===a.visibiltyOnNextGrouping&&(a.visibiltyOnNextGrouping=[]);var c;for(c=0;c<a.groupField.length;c++)!a.groupColumnShow[c]&&a.visibiltyOnNextGrouping[c]&&d(this).jqGrid("showCol",a.groupField[c]);for(c=0;c<b.length;c++)a.visibiltyOnNextGrouping[c]=d("#"+d.jgrid.jqID(this.p.id)+"_"+d.jgrid.jqID(b[c])).is(":visible");this.p.groupingView=d.extend(this.p.groupingView,k||{});a.groupField=b;d(this).trigger("reloadGrid")})},groupingRemove:function(b){return this.each(function(){void 0===
b&&(b=!0);this.p.grouping=!1;if(!0===b){var k=this.p.groupingView,a;for(a=0;a<k.groupField.length;a++)!k.groupColumnShow[a]&&k.visibiltyOnNextGrouping[a]&&d(this).jqGrid("showCol",k.groupField);d("tr.jqgroup, tr.jqfoot","#"+d.jgrid.jqID(this.p.id)+" tbody:first").remove();d("tr.jqgrow:hidden","#"+d.jgrid.jqID(this.p.id)+" tbody:first").show()}else d(this).trigger("reloadGrid")})},groupingCalculations:{handler:function(b,d,a,c,g,m){var e={sum:function(){return parseFloat(d||0)+parseFloat(m[a]||0)},
min:function(){return""===d?parseFloat(m[a]||0):Math.min(parseFloat(d),parseFloat(m[a]||0))},max:function(){return""===d?parseFloat(m[a]||0):Math.max(parseFloat(d),parseFloat(m[a]||0))},count:function(){""===d&&(d=0);return m.hasOwnProperty(a)?d+1:0},avg:function(){return e.sum()}};if(!e[b])throw"jqGrid Grouping No such method: "+b;b=e[b]();null!=c&&("fixed"===g?b=b.toFixed(c):(c=Math.pow(10,c),b=Math.round(b*c)/c));return b}}})})(jQuery);
(function(d){d.jgrid.extend({setTreeNode:function(b,c){return this.each(function(){var a=this;if(a.grid&&a.p.treeGrid)for(var h=a.p.expColInd,e=a.p.treeReader.expanded_field,k=a.p.treeReader.leaf_field,g=a.p.treeReader.level_field,f=a.p.treeReader.icon_field,n=a.p.treeReader.loaded,m,p,q,l;b<c;)l=d.jgrid.stripPref(a.p.idPrefix,a.rows[b].id),l=a.p.data[a.p._index[l]],"nested"!==a.p.treeGridModel||l[k]||(m=parseInt(l[a.p.treeReader.left_field],10),p=parseInt(l[a.p.treeReader.right_field],10),l[k]=p===
m+1?"true":"false",a.rows[b].cells[a.p._treeleafpos].innerHTML=l[k]),m=parseInt(l[g],10),0===a.p.tree_root_level?(q=m+1,p=m):(q=m,p=m-1),q="<div class='tree-wrap tree-wrap-"+a.p.direction+"' style='width:"+18*q+"px;'>",q+="<div style='"+("rtl"===a.p.direction?"right:":"left:")+18*p+"px;' class='ui-icon ",void 0!==l[n]&&(l[n]="true"===l[n]||!0===l[n]?!0:!1),"true"===l[k]||!0===l[k]?(q+=(void 0!==l[f]&&""!==l[f]?l[f]:a.p.treeIcons.leaf)+" tree-leaf treeclick",l[k]=!0,p="leaf"):(l[k]=!1,p=""),l[e]=("true"===
l[e]||!0===l[e]?!0:!1)&&(l[n]||void 0===l[n]),q=!1===l[e]?q+(!0===l[k]?"'":a.p.treeIcons.plus+" tree-plus treeclick'"):q+(!0===l[k]?"'":a.p.treeIcons.minus+" tree-minus treeclick'"),q+="></div></div>",d(a.rows[b].cells[h]).wrapInner("<span class='cell-wrapper"+p+"'></span>").prepend(q),m!==parseInt(a.p.tree_root_level,10)&&((l=(l=d(a).jqGrid("getNodeParent",l))&&l.hasOwnProperty(e)?l[e]:!0)||d(a.rows[b]).css("display","none")),d(a.rows[b].cells[h]).find("div.treeclick").bind("click",function(b){b=
d.jgrid.stripPref(a.p.idPrefix,d(b.target||b.srcElement,a.rows).closest("tr.jqgrow")[0].id);b=a.p._index[b];a.p.data[b][k]||(a.p.data[b][e]?(d(a).jqGrid("collapseRow",a.p.data[b]),d(a).jqGrid("collapseNode",a.p.data[b])):(d(a).jqGrid("expandRow",a.p.data[b]),d(a).jqGrid("expandNode",a.p.data[b])));return!1}),!0===a.p.ExpandColClick&&d(a.rows[b].cells[h]).find("span.cell-wrapper").css("cursor","pointer").bind("click",function(b){b=d.jgrid.stripPref(a.p.idPrefix,d(b.target||b.srcElement,a.rows).closest("tr.jqgrow")[0].id);
var c=a.p._index[b];a.p.data[c][k]||(a.p.data[c][e]?(d(a).jqGrid("collapseRow",a.p.data[c]),d(a).jqGrid("collapseNode",a.p.data[c])):(d(a).jqGrid("expandRow",a.p.data[c]),d(a).jqGrid("expandNode",a.p.data[c])));d(a).jqGrid("setSelection",b);return!1}),b++})},setTreeGrid:function(){return this.each(function(){var b=this,c=0,a,h=!1,e,k,g=[];if(b.p.treeGrid){b.p.treedatatype||d.extend(b.p,{treedatatype:b.p.datatype});b.p.subGrid=!1;b.p.altRows=!1;b.p.pgbuttons=!1;b.p.pginput=!1;b.p.gridview=!0;null===
b.p.rowTotal&&(b.p.rowNum=1E4);b.p.multiselect=!1;b.p.rowList=[];b.p.expColInd=0;a="ui-icon-triangle-1-"+("rtl"===b.p.direction?"w":"e");b.p.treeIcons=d.extend({plus:a,minus:"ui-icon-triangle-1-s",leaf:"ui-icon-radio-off"},b.p.treeIcons||{});"nested"===b.p.treeGridModel?b.p.treeReader=d.extend({level_field:"level",left_field:"lft",right_field:"rgt",leaf_field:"isLeaf",expanded_field:"expanded",loaded:"loaded",icon_field:"icon"},b.p.treeReader):"adjacency"===b.p.treeGridModel&&(b.p.treeReader=d.extend({level_field:"level",
parent_id_field:"parent",leaf_field:"isLeaf",expanded_field:"expanded",loaded:"loaded",icon_field:"icon"},b.p.treeReader));for(e in b.p.colModel)if(b.p.colModel.hasOwnProperty(e))for(k in a=b.p.colModel[e].name,a!==b.p.ExpandColumn||h||(h=!0,b.p.expColInd=c),c++,b.p.treeReader)b.p.treeReader.hasOwnProperty(k)&&b.p.treeReader[k]===a&&g.push(a);d.each(b.p.treeReader,function(a,e){e&&-1===d.inArray(e,g)&&("leaf_field"===a&&(b.p._treeleafpos=c),c++,b.p.colNames.push(e),b.p.colModel.push({name:e,width:1,
hidden:!0,sortable:!1,resizable:!1,hidedlg:!0,editable:!0,search:!1}))})}})},expandRow:function(b){this.each(function(){var c=this;if(c.grid&&c.p.treeGrid){var a=d(c).jqGrid("getNodeChildren",b),h=c.p.treeReader.expanded_field;d(a).each(function(){var a=c.p.idPrefix+d.jgrid.getAccessor(this,c.p.localReader.id);d(d(c).jqGrid("getGridRowById",a)).css("display","");this[h]&&d(c).jqGrid("expandRow",this)})}})},collapseRow:function(b){this.each(function(){var c=this;if(c.grid&&c.p.treeGrid){var a=d(c).jqGrid("getNodeChildren",
b),h=c.p.treeReader.expanded_field;d(a).each(function(){var a=c.p.idPrefix+d.jgrid.getAccessor(this,c.p.localReader.id);d(d(c).jqGrid("getGridRowById",a)).css("display","none");this[h]&&d(c).jqGrid("collapseRow",this)})}})},getRootNodes:function(){var b=[];this.each(function(){var c=this;if(c.grid&&c.p.treeGrid)switch(c.p.treeGridModel){case "nested":var a=c.p.treeReader.level_field;d(c.p.data).each(function(){parseInt(this[a],10)===parseInt(c.p.tree_root_level,10)&&b.push(this)});break;case "adjacency":var h=
c.p.treeReader.parent_id_field;d(c.p.data).each(function(){null!==this[h]&&"null"!==String(this[h]).toLowerCase()||b.push(this)})}});return b},getNodeDepth:function(b){var c=null;this.each(function(){if(this.grid&&this.p.treeGrid)switch(this.p.treeGridModel){case "nested":c=parseInt(b[this.p.treeReader.level_field],10)-parseInt(this.p.tree_root_level,10);break;case "adjacency":c=d(this).jqGrid("getNodeAncestors",b).length}});return c},getNodeParent:function(b){var c=null;this.each(function(){var a=
this;if(a.grid&&a.p.treeGrid)switch(a.p.treeGridModel){case "nested":var h=a.p.treeReader.left_field,e=a.p.treeReader.right_field,k=a.p.treeReader.level_field,g=parseInt(b[h],10),f=parseInt(b[e],10),n=parseInt(b[k],10);d(this.p.data).each(function(){if(parseInt(this[k],10)===n-1&&parseInt(this[h],10)<g&&parseInt(this[e],10)>f)return c=this,!1});break;case "adjacency":var m=a.p.treeReader.parent_id_field,p=a.p.localReader.id;d(this.p.data).each(function(){if(this[p]===d.jgrid.stripPref(a.p.idPrefix,
b[m]))return c=this,!1})}});return c},getNodeChildren:function(b){var c=[];this.each(function(){var a=this;if(a.grid&&a.p.treeGrid)switch(a.p.treeGridModel){case "nested":var h=a.p.treeReader.left_field,e=a.p.treeReader.right_field,k=a.p.treeReader.level_field,g=parseInt(b[h],10),f=parseInt(b[e],10),n=parseInt(b[k],10);d(this.p.data).each(function(){parseInt(this[k],10)===n+1&&parseInt(this[h],10)>g&&parseInt(this[e],10)<f&&c.push(this)});break;case "adjacency":var m=a.p.treeReader.parent_id_field,
p=a.p.localReader.id;d(this.p.data).each(function(){this[m]==d.jgrid.stripPref(a.p.idPrefix,b[p])&&c.push(this)})}});return c},getFullTreeNode:function(b){var c=[];this.each(function(){var a=this,h;if(a.grid&&a.p.treeGrid)switch(a.p.treeGridModel){case "nested":var e=a.p.treeReader.left_field,k=a.p.treeReader.right_field,g=a.p.treeReader.level_field,f=parseInt(b[e],10),n=parseInt(b[k],10),m=parseInt(b[g],10);d(this.p.data).each(function(){parseInt(this[g],10)>=m&&parseInt(this[e],10)>=f&&parseInt(this[e],
10)<=n&&c.push(this)});break;case "adjacency":if(b){c.push(b);var p=a.p.treeReader.parent_id_field,q=a.p.localReader.id;d(this.p.data).each(function(b){h=c.length;for(b=0;b<h;b++)if(d.jgrid.stripPref(a.p.idPrefix,c[b][q])===this[p]){c.push(this);break}})}}});return c},getNodeAncestors:function(b){var c=[];this.each(function(){if(this.grid&&this.p.treeGrid)for(var a=d(this).jqGrid("getNodeParent",b);a;)c.push(a),a=d(this).jqGrid("getNodeParent",a)});return c},isVisibleNode:function(b){var c=!0;this.each(function(){if(this.grid&&
this.p.treeGrid){var a=d(this).jqGrid("getNodeAncestors",b),h=this.p.treeReader.expanded_field;d(a).each(function(){c=c&&this[h];if(!c)return!1})}});return c},isNodeLoaded:function(b){var c;this.each(function(){if(this.grid&&this.p.treeGrid){var a=this.p.treeReader.leaf_field,h=this.p.treeReader.loaded;c=void 0!==b?void 0!==b[h]?b[h]:b[a]||0<d(this).jqGrid("getNodeChildren",b).length?!0:!1:!1}});return c},expandNode:function(b){return this.each(function(){if(this.grid&&this.p.treeGrid){var c=this.p.treeReader.expanded_field,
a=this.p.treeReader.parent_id_field,h=this.p.treeReader.loaded,e=this.p.treeReader.level_field,k=this.p.treeReader.left_field,g=this.p.treeReader.right_field;if(!b[c]){var f=d.jgrid.getAccessor(b,this.p.localReader.id),n=d("#"+this.p.idPrefix+d.jgrid.jqID(f),this.grid.bDiv)[0],m=this.p._index[f];d(this).jqGrid("isNodeLoaded",this.p.data[m])?(b[c]=!0,d("div.treeclick",n).removeClass(this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.minus+" tree-minus")):this.grid.hDiv.loading||(b[c]=!0,
d("div.treeclick",n).removeClass(this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.minus+" tree-minus"),this.p.treeANode=n.rowIndex,this.p.datatype=this.p.treedatatype,"nested"===this.p.treeGridModel?d(this).jqGrid("setGridParam",{postData:{nodeid:f,n_left:b[k],n_right:b[g],n_level:b[e]}}):d(this).jqGrid("setGridParam",{postData:{nodeid:f,parentid:b[a],n_level:b[e]}}),d(this).trigger("reloadGrid"),b[h]=!0,"nested"===this.p.treeGridModel?d(this).jqGrid("setGridParam",{postData:{nodeid:"",
n_left:"",n_right:"",n_level:""}}):d(this).jqGrid("setGridParam",{postData:{nodeid:"",parentid:"",n_level:""}}))}}})},collapseNode:function(b){return this.each(function(){if(this.grid&&this.p.treeGrid){var c=this.p.treeReader.expanded_field;b[c]&&(b[c]=!1,c=d.jgrid.getAccessor(b,this.p.localReader.id),c=d("#"+this.p.idPrefix+d.jgrid.jqID(c),this.grid.bDiv)[0],d("div.treeclick",c).removeClass(this.p.treeIcons.minus+" tree-minus").addClass(this.p.treeIcons.plus+" tree-plus"))}})},SortTree:function(b,
c,a,h){return this.each(function(){if(this.grid&&this.p.treeGrid){var e,k,g,f=[],n=this,m;e=d(this).jqGrid("getRootNodes");e=d.jgrid.from(e);e.orderBy(b,c,a,h);m=e.select();e=0;for(k=m.length;e<k;e++)g=m[e],f.push(g),d(this).jqGrid("collectChildrenSortTree",f,g,b,c,a,h);d.each(f,function(a){var b=d.jgrid.getAccessor(this,n.p.localReader.id);d("#"+d.jgrid.jqID(n.p.id)+" tbody tr:eq("+a+")").after(d("tr#"+d.jgrid.jqID(b),n.grid.bDiv))});f=m=e=null}})},collectChildrenSortTree:function(b,c,a,h,e,k){return this.each(function(){if(this.grid&&
this.p.treeGrid){var g,f,n,m;g=d(this).jqGrid("getNodeChildren",c);g=d.jgrid.from(g);g.orderBy(a,h,e,k);m=g.select();g=0;for(f=m.length;g<f;g++)n=m[g],b.push(n),d(this).jqGrid("collectChildrenSortTree",b,n,a,h,e,k)}})},setTreeRow:function(b,c){var a=!1;this.each(function(){this.grid&&this.p.treeGrid&&(a=d(this).jqGrid("setRowData",b,c))});return a},delTreeNode:function(b){return this.each(function(){var c=this.p.localReader.id,a,h=this.p.treeReader.left_field,e=this.p.treeReader.right_field,k,g,f;
if(this.grid&&this.p.treeGrid&&(a=this.p._index[b],void 0!==a)){k=parseInt(this.p.data[a][e],10);g=k-parseInt(this.p.data[a][h],10)+1;var n=d(this).jqGrid("getFullTreeNode",this.p.data[a]);if(0<n.length)for(a=0;a<n.length;a++)d(this).jqGrid("delRowData",n[a][c]);if("nested"===this.p.treeGridModel){c=d.jgrid.from(this.p.data).greater(h,k,{stype:"integer"}).select();if(c.length)for(f in c)c.hasOwnProperty(f)&&(c[f][h]=parseInt(c[f][h],10)-g);c=d.jgrid.from(this.p.data).greater(e,k,{stype:"integer"}).select();
if(c.length)for(f in c)c.hasOwnProperty(f)&&(c[f][e]=parseInt(c[f][e],10)-g)}}})},addChildNode:function(b,c,a,h){var e=this[0];if(a){var k=e.p.treeReader.expanded_field,g=e.p.treeReader.leaf_field,f=e.p.treeReader.level_field,n=e.p.treeReader.parent_id_field,m=e.p.treeReader.left_field,p=e.p.treeReader.right_field,q=e.p.treeReader.loaded,l,u,t,w,s;l=0;var v=c,x;void 0===h&&(h=!1);if(void 0===b||null===b){s=e.p.data.length-1;if(0<=s)for(;0<=s;)l=Math.max(l,parseInt(e.p.data[s][e.p.localReader.id],
10)),s--;b=l+1}var y=d(e).jqGrid("getInd",c);x=!1;void 0===c||null===c||""===c?(v=c=null,l="last",w=e.p.tree_root_level,s=e.p.data.length+1):(l="after",u=e.p._index[c],t=e.p.data[u],c=t[e.p.localReader.id],w=parseInt(t[f],10)+1,s=d(e).jqGrid("getFullTreeNode",t),s.length?(v=s=s[s.length-1][e.p.localReader.id],s=d(e).jqGrid("getInd",v)+1):s=d(e).jqGrid("getInd",c)+1,t[g]&&(x=!0,t[k]=!0,d(e.rows[y]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(e.p.treeIcons.leaf+
" tree-leaf").addClass(e.p.treeIcons.minus+" tree-minus"),e.p.data[u][g]=!1,t[q]=!0));u=s+1;void 0===a[k]&&(a[k]=!1);void 0===a[q]&&(a[q]=!1);a[f]=w;void 0===a[g]&&(a[g]=!0);"adjacency"===e.p.treeGridModel&&(a[n]=c);if("nested"===e.p.treeGridModel){var r;if(null!==c){g=parseInt(t[p],10);f=d.jgrid.from(e.p.data);f=f.greaterOrEquals(p,g,{stype:"integer"});f=f.select();if(f.length)for(r in f)f.hasOwnProperty(r)&&(f[r][m]=f[r][m]>g?parseInt(f[r][m],10)+2:f[r][m],f[r][p]=f[r][p]>=g?parseInt(f[r][p],10)+
2:f[r][p]);a[m]=g;a[p]=g+1}else{g=parseInt(d(e).jqGrid("getCol",p,!1,"max"),10);f=d.jgrid.from(e.p.data).greater(m,g,{stype:"integer"}).select();if(f.length)for(r in f)f.hasOwnProperty(r)&&(f[r][m]=parseInt(f[r][m],10)+2);f=d.jgrid.from(e.p.data).greater(p,g,{stype:"integer"}).select();if(f.length)for(r in f)f.hasOwnProperty(r)&&(f[r][p]=parseInt(f[r][p],10)+2);a[m]=g+1;a[p]=g+2}}if(null===c||d(e).jqGrid("isNodeLoaded",t)||x)d(e).jqGrid("addRowData",b,a,l,v),d(e).jqGrid("setTreeNode",s,u);t&&!t[k]&&
h&&d(e.rows[y]).find("div.treeclick").click()}}})})(jQuery);
(function(d){function I(d,n){var h,e,v=[],r;if(!this||"function"!==typeof d||d instanceof RegExp)throw new TypeError;r=this.length;for(h=0;h<r;h++)if(this.hasOwnProperty(h)&&(e=this[h],d.call(n,e,h,this))){v.push(e);break}return v}d.assocArraySize=function(d){var n=0,h;for(h in d)d.hasOwnProperty(h)&&n++;return n};d.jgrid.extend({pivotSetup:function(q,n){var h=[],e=[],v=[],r=[],b={grouping:!0,groupingView:{groupField:[],groupSummary:[],groupSummaryPos:[]}},f=[],c=d.extend({rowTotals:!1,rowTotalsText:"Total",
colTotals:!1,groupSummary:!0,groupSummaryPos:"header",frozenStaticCols:!1},n||{});this.each(function(){function n(C,c,a){C=I.call(C,c,a);return 0<C.length?C[0]:null}function J(c,a){var d=0,f=!0,h;for(h in c){if(c[h]!=this[d]){f=!1;break}d++;if(d>=this.length)break}f&&(D=a);return f}function E(c,a,f,h){var g=a.length,b,k,e,l;l=d.isArray(f)?f.length:1;r=[];for(e=r.root=0;e<l;e++){var n=[],m;for(b=0;b<g;b++){if(null==f)m=k=d.trim(a[b].member)+"_"+a[b].aggregator;else{m=f[e].replace(/\s+/g,"");try{k=
1===g?m:m+"_"+a[b].aggregator+"_"+b}catch(v){}}var t=h,u=k,x=n,y=k,w=h[k],p=a[b].member,q=c,s=void 0;switch(a[b].aggregator){case "sum":s=parseFloat(w||0)+parseFloat(q[p]||0);break;case "count":if(""===w||null==w)w=0;s=q.hasOwnProperty(p)?w+1:0;break;case "min":s=""===w||null==w?parseFloat(q[p]||0):Math.min(parseFloat(w),parseFloat(q[p]||0));break;case "max":s=""===w||null==w?parseFloat(q[p]||0):Math.max(parseFloat(w),parseFloat(q[p]||0))}t[u]=x[y]=s}r[m]=n}return h}function H(a){var d,b,g,k,e;for(g in a)if(a.hasOwnProperty(g)){if("object"!==
typeof a[g]&&("level"===g&&(void 0===F[a.level]&&(F[a.level]="",0<a.level&&"_r_Totals"!==a.text&&(f[a.level-1]={useColSpanStyle:!1,groupHeaders:[]})),F[a.level]!==a.text&&a.children.length&&"_r_Totals"!==a.text&&0<a.level&&(f[a.level-1].groupHeaders.push({titleText:a.text}),b=f[a.level-1].groupHeaders.length,e=1===b?K:G+(b-1)*z,f[a.level-1].groupHeaders[b-1].startColumnName=h[e].name,f[a.level-1].groupHeaders[b-1].numberOfColumns=h.length-e,G=h.length),F[a.level]=a.text),a.level===l&&"level"===g&&
0<l))if(1<z){b=1;for(d in a.fields)1===b&&f[l-1].groupHeaders.push({startColumnName:d,numberOfColumns:1,titleText:a.text}),b++;f[l-1].groupHeaders[f[l-1].groupHeaders.length-1].numberOfColumns=b-1}else f.splice(l-1,1);null!=a[g]&&"object"===typeof a[g]&&H(a[g]);if("level"===g&&0<a.level)for(d in b=0,a.fields){e={};for(k in c.aggregates[b])if(c.aggregates[b].hasOwnProperty(k))switch(k){case "member":case "label":case "aggregator":break;default:e[k]=c.aggregates[b][k]}1<z?(e.name=d,e.label=c.aggregates[b].label||
d):(e.name=a.text,e.label="_r_Totals"===a.text?c.rowTotalsText:a.text);h.push(e);b++}}}var m,D,a,y=q.length,s,l,z,k,p=0;c.rowTotals&&0<c.yDimension.length&&(c.yDimension.splice(0,0,{dataName:c.yDimension[0].dataName}),c.yDimension[0].converter=function(){return"_r_Totals"});s=d.isArray(c.xDimension)?c.xDimension.length:0;l=c.yDimension.length;z=d.isArray(c.aggregates)?c.aggregates.length:0;if(0===s||0===z)throw"xDimension or aggregates optiona are not set!";var x;for(a=0;a<s;a++)x={name:c.xDimension[a].dataName,
frozen:c.frozenStaticCols},x=d.extend(!0,x,c.xDimension[a]),h.push(x);x=s-1;for(var A={};p<y;){m=q[p];var t=[],u=[];k={};a=0;do t[a]=d.trim(m[c.xDimension[a].dataName]),k[c.xDimension[a].dataName]=t[a],a++;while(a<s);var g=0;D=-1;a=n(e,J,t);if(!a){g=0;if(1<=l){for(g=0;g<l;g++)u[g]=d.trim(m[c.yDimension[g].dataName]),c.yDimension[g].converter&&d.isFunction(c.yDimension[g].converter)&&(u[g]=c.yDimension[g].converter.call(this,u[g],t,u));k=E(m,c.aggregates,u,k)}else 0===l&&(k=E(m,c.aggregates,null,k));
e.push(k)}else if(0<=D){g=0;if(1<=l){for(g=0;g<l;g++)u[g]=d.trim(m[c.yDimension[g].dataName]),c.yDimension[g].converter&&d.isFunction(c.yDimension[g].converter)&&(u[g]=c.yDimension[g].converter.call(this,u[g],t,u));a=E(m,c.aggregates,u,a)}else 0===l&&(a=E(m,c.aggregates,null,a));e[D]=a}m=0;var t=k=null,B;for(B in r){if(0===m)A.children&&void 0!==A.children||(A={text:B,level:0,children:[]}),k=A.children;else{t=null;for(a=0;a<k.length;a++)if(k[a].text===B){t=k[a];break}t?k=t.children:(k.push({children:[],
text:B,level:m,fields:r[B]}),k=k[k.length-1].children)}m++}p++}var F=[],G=h.length,K=G;0<l&&(f[l-1]={useColSpanStyle:!1,groupHeaders:[]});H(A,0);if(c.colTotals)for(p=e.length;p--;)for(a=s;a<h.length;a++)y=h[a].name,v[y]=v[y]?v[y]+parseFloat(e[p][y]||0):parseFloat(e[p][y]||0);if(0<x)for(a=0;a<x;a++)b.groupingView.groupField[a]=h[a].name,b.groupingView.groupSummary[a]=c.groupSummary,b.groupingView.groupSummaryPos[a]=c.groupSummaryPos;else b.grouping=!1;b.sortname=h[x].name;b.groupingView.hideFirstGroupCol=
!0});return{colModel:h,rows:e,groupOptions:b,groupHeaders:f,summary:v}},jqPivot:function(q,n,h,e){return this.each(function(){function v(b){var f=jQuery(r).jqGrid("pivotSetup",b,n),c=0<d.assocArraySize(f.summary)?!0:!1,e=d.jgrid.from(f.rows);for(b=0;b<f.groupOptions.groupingView.groupField.length;b++)e.orderBy(f.groupOptions.groupingView.groupField[b],"a","text","");jQuery(r).jqGrid(d.extend({datastr:d.extend(e.select(),c?{userdata:f.summary}:{}),datatype:"jsonstring",footerrow:c,userDataOnFooter:c,
colModel:f.colModel,viewrecords:!0,sortname:n.xDimension[0].dataName},h||{},f.groupOptions));f=f.groupHeaders;if(f.length)for(b=0;b<f.length;b++)f[b]&&f[b].groupHeaders.length&&jQuery(r).jqGrid("setGroupHeaders",f[b]);n.frozenStaticCols&&jQuery(r).jqGrid("setFrozenColumns")}var r=this;"string"===typeof q?d.ajax(d.extend({url:q,dataType:"json",success:function(b){v(d.jgrid.getAccessor(b,e&&e.reader?e.reader:"rows"))}},e||{})):v(q)})}})})(jQuery);
(function(c){c.jgrid.extend({jqGridImport:function(a){a=c.extend({imptype:"xml",impstring:"",impurl:"",mtype:"GET",impData:{},xmlGrid:{config:"roots>grid",data:"roots>rows"},jsonGrid:{config:"grid",data:"data"},ajaxOptions:{}},a||{});return this.each(function(){var d=this,f=function(a,b){var e=c(b.xmlGrid.config,a)[0],h=c(b.xmlGrid.data,a)[0],f,g;if(xmlJsonClass.xml2json&&c.jgrid.parse){e=xmlJsonClass.xml2json(e," ");e=c.jgrid.parse(e);for(g in e)e.hasOwnProperty(g)&&(f=e[g]);h?(h=e.grid.datatype,
e.grid.datatype="xmlstring",e.grid.datastr=a,c(d).jqGrid(f).jqGrid("setGridParam",{datatype:h})):c(d).jqGrid(f)}else alert("xml2json or parse are not present")},b=function(a,b){if(a&&"string"===typeof a){var e=!1;c.jgrid.useJSON&&(c.jgrid.useJSON=!1,e=!0);var f=c.jgrid.parse(a);e&&(c.jgrid.useJSON=!0);e=f[b.jsonGrid.config];if(f=f[b.jsonGrid.data]){var g=e.datatype;e.datatype="jsonstring";e.datastr=f;c(d).jqGrid(e).jqGrid("setGridParam",{datatype:g})}else c(d).jqGrid(e)}};switch(a.imptype){case "xml":c.ajax(c.extend({url:a.impurl,
type:a.mtype,data:a.impData,dataType:"xml",complete:function(b,g){"success"===g&&(f(b.responseXML,a),c(d).triggerHandler("jqGridImportComplete",[b,a]),c.isFunction(a.importComplete)&&a.importComplete(b))}},a.ajaxOptions));break;case "xmlstring":if(a.impstring&&"string"===typeof a.impstring){var g=c.parseXML(a.impstring);g&&(f(g,a),c(d).triggerHandler("jqGridImportComplete",[g,a]),c.isFunction(a.importComplete)&&a.importComplete(g),a.impstring=null);g=null}break;case "json":c.ajax(c.extend({url:a.impurl,
type:a.mtype,data:a.impData,dataType:"json",complete:function(f){try{b(f.responseText,a),c(d).triggerHandler("jqGridImportComplete",[f,a]),c.isFunction(a.importComplete)&&a.importComplete(f)}catch(g){}}},a.ajaxOptions));break;case "jsonstring":a.impstring&&"string"===typeof a.impstring&&(b(a.impstring,a),c(d).triggerHandler("jqGridImportComplete",[a.impstring,a]),c.isFunction(a.importComplete)&&a.importComplete(a.impstring),a.impstring=null)}})},jqGridExport:function(a){a=c.extend({exptype:"xmlstring",
root:"grid",ident:"\t"},a||{});var d=null;this.each(function(){if(this.grid){var f,b=c.extend(!0,{},c(this).jqGrid("getGridParam"));b.rownumbers&&(b.colNames.splice(0,1),b.colModel.splice(0,1));b.multiselect&&(b.colNames.splice(0,1),b.colModel.splice(0,1));b.subGrid&&(b.colNames.splice(0,1),b.colModel.splice(0,1));b.knv=null;if(b.treeGrid)for(f in b.treeReader)b.treeReader.hasOwnProperty(f)&&(b.colNames.splice(b.colNames.length-1),b.colModel.splice(b.colModel.length-1));switch(a.exptype){case "xmlstring":d=
"<"+a.root+">"+xmlJsonClass.json2xml(b,a.ident)+"</"+a.root+">";break;case "jsonstring":d="{"+xmlJsonClass.toJson(b,a.root,a.ident,!1)+"}",void 0!==b.postData.filters&&(d=d.replace(/filters":"/,'filters":'),d=d.replace(/}]}"/,"}]}"))}}});return d},excelExport:function(a){a=c.extend({exptype:"remote",url:null,oper:"oper",tag:"excel",exportOptions:{}},a||{});return this.each(function(){if(this.grid){var d;"remote"===a.exptype&&(d=c.extend({},this.p.postData),d[a.oper]=a.tag,d=jQuery.param(d),d=-1!==
a.url.indexOf("?")?a.url+"&"+d:a.url+"?"+d,window.location=d)}})}})})(jQuery);
var xmlJsonClass={xml2json:function(a,b){9===a.nodeType&&(a=a.documentElement);var g=this.removeWhite(a),g=this.toObj(g),g=this.toJson(g,a.nodeName,"\t");return"{\n"+b+(b?g.replace(/\t/g,b):g.replace(/\t|\n/g,""))+"\n}"},json2xml:function(a,b){var g=function(a,b,e){var d="",f,k;if(a instanceof Array)if(0===a.length)d+=e+"<"+b+">__EMPTY_ARRAY_</"+b+">\n";else for(f=0,k=a.length;f<k;f+=1)var n=e+g(a[f],b,e+"\t")+"\n",d=d+n;else if("object"===typeof a){f=!1;d+=e+"<"+b;for(k in a)a.hasOwnProperty(k)&&
("@"===k.charAt(0)?d+=" "+k.substr(1)+'="'+a[k].toString()+'"':f=!0);d+=f?">":"/>";if(f){for(k in a)a.hasOwnProperty(k)&&("#text"===k?d+=a[k]:"#cdata"===k?d+="<![CDATA["+a[k]+"]]\x3e":"@"!==k.charAt(0)&&(d+=g(a[k],k,e+"\t")));d+=("\n"===d.charAt(d.length-1)?e:"")+"</"+b+">"}}else"function"===typeof a?d+=e+"<"+b+"><![CDATA["+a+"]]\x3e</"+b+">":(void 0===a&&(a=""),d='""'===a.toString()||0===a.toString().length?d+(e+"<"+b+">__EMPTY_STRING_</"+b+">"):d+(e+"<"+b+">"+a.toString()+"</"+b+">"));return d},
f="",e;for(e in a)a.hasOwnProperty(e)&&(f+=g(a[e],e,""));return b?f.replace(/\t/g,b):f.replace(/\t|\n/g,"")},toObj:function(a){var b={},g=/function/i;if(1===a.nodeType){if(a.attributes.length){var f;for(f=0;f<a.attributes.length;f+=1)b["@"+a.attributes[f].nodeName]=(a.attributes[f].nodeValue||"").toString()}if(a.firstChild){var e=f=0,h=!1,c;for(c=a.firstChild;c;c=c.nextSibling)1===c.nodeType?h=!0:3===c.nodeType&&c.nodeValue.match(/[^ \f\n\r\t\v]/)?f+=1:4===c.nodeType&&(e+=1);if(h)if(2>f&&2>e)for(this.removeWhite(a),
c=a.firstChild;c;c=c.nextSibling)3===c.nodeType?b["#text"]=this.escape(c.nodeValue):4===c.nodeType?g.test(c.nodeValue)?b[c.nodeName]=[b[c.nodeName],c.nodeValue]:b["#cdata"]=this.escape(c.nodeValue):b[c.nodeName]?b[c.nodeName]instanceof Array?b[c.nodeName][b[c.nodeName].length]=this.toObj(c):b[c.nodeName]=[b[c.nodeName],this.toObj(c)]:b[c.nodeName]=this.toObj(c);else a.attributes.length?b["#text"]=this.escape(this.innerXml(a)):b=this.escape(this.innerXml(a));else if(f)a.attributes.length?b["#text"]=
this.escape(this.innerXml(a)):(b=this.escape(this.innerXml(a)),"__EMPTY_ARRAY_"===b?b="[]":"__EMPTY_STRING_"===b&&(b=""));else if(e)if(1<e)b=this.escape(this.innerXml(a));else for(c=a.firstChild;c;c=c.nextSibling)if(g.test(a.firstChild.nodeValue)){b=a.firstChild.nodeValue;break}else b["#cdata"]=this.escape(c.nodeValue)}a.attributes.length||a.firstChild||(b=null)}else 9===a.nodeType?b=this.toObj(a.documentElement):alert("unhandled node type: "+a.nodeType);return b},toJson:function(a,b,g,f){void 0===
f&&(f=!0);var e=b?'"'+b+'"':"",h="\t",c="\n";f||(c=h="");if("[]"===a)e+=b?":[]":"[]";else if(a instanceof Array){var l,d,m=[];d=0;for(l=a.length;d<l;d+=1)m[d]=this.toJson(a[d],"",g+h,f);e+=(b?":[":"[")+(1<m.length?c+g+h+m.join(","+c+g+h)+c+g:m.join(""))+"]"}else if(null===a)e+=(b&&":")+"null";else if("object"===typeof a){l=[];for(d in a)a.hasOwnProperty(d)&&(l[l.length]=this.toJson(a[d],d,g+h,f));e+=(b?":{":"{")+(1<l.length?c+g+h+l.join(","+c+g+h)+c+g:l.join(""))+"}"}else e="string"===typeof a?e+
((b&&":")+'"'+a.replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"'):e+((b&&":")+a.toString());return e},innerXml:function(a){var b="";if("innerHTML"in a)b=a.innerHTML;else{var g=function(a){var b="",h;if(1===a.nodeType){b+="<"+a.nodeName;for(h=0;h<a.attributes.length;h+=1)b+=" "+a.attributes[h].nodeName+'="'+(a.attributes[h].nodeValue||"").toString()+'"';if(a.firstChild){b+=">";for(h=a.firstChild;h;h=h.nextSibling)b+=g(h);b+="</"+a.nodeName+">"}else b+="/>"}else 3===a.nodeType?b+=a.nodeValue:4===a.nodeType&&
(b+="<![CDATA["+a.nodeValue+"]]\x3e");return b};for(a=a.firstChild;a;a=a.nextSibling)b+=g(a)}return b},escape:function(a){return a.replace(/[\\]/g,"\\\\").replace(/[\"]/g,'\\"').replace(/[\n]/g,"\\n").replace(/[\r]/g,"\\r")},removeWhite:function(a){a.normalize();var b;for(b=a.firstChild;b;)if(3===b.nodeType)if(b.nodeValue.match(/[^ \f\n\r\t\v]/))b=b.nextSibling;else{var g=b.nextSibling;a.removeChild(b);b=g}else 1===b.nodeType&&this.removeWhite(b),b=b.nextSibling;return a}};
function tableToGrid(l,m){jQuery(l).each(function(){if(!this.grid){jQuery(this).width("99%");var b=jQuery(this).width(),c=jQuery("tr td:first-child input[type=checkbox]:first",jQuery(this)),a=jQuery("tr td:first-child input[type=radio]:first",jQuery(this)),c=0<c.length,a=!c&&0<a.length,k=c||a,d=[],e=[];jQuery("th",jQuery(this)).each(function(){0===d.length&&k?(d.push({name:"__selection__",index:"__selection__",width:0,hidden:!0}),e.push("__selection__")):(d.push({name:jQuery(this).attr("id")||jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
index:jQuery(this).attr("id")||jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),width:jQuery(this).width()||150}),e.push(jQuery(this).html()))});var f=[],g=[],h=[];jQuery("tbody > tr",jQuery(this)).each(function(){var b={},a=0;jQuery("td",jQuery(this)).each(function(){if(0===a&&k){var c=jQuery("input",jQuery(this)),e=c.attr("value");g.push(e||f.length);c.is(":checked")&&h.push(e);b[d[a].name]=c.attr("value")}else b[d[a].name]=jQuery(this).html();a++});0<a&&f.push(b)});
jQuery(this).empty();jQuery(this).addClass("scroll");jQuery(this).jqGrid(jQuery.extend({datatype:"local",width:b,colNames:e,colModel:d,multiselect:c},m||{}));for(b=0;b<f.length;b++)a=null,0<g.length&&(a=g[b])&&a.replace&&(a=encodeURIComponent(a).replace(/[.\-%]/g,"_")),null===a&&(a=b+1),jQuery(this).jqGrid("addRowData",a,f[b]);for(b=0;b<h.length;b++)jQuery(this).jqGrid("setSelection",h[b])}})};
(function(b){b.jgrid.msie&&8===b.jgrid.msiever()&&(b.expr[":"].hidden=function(b){return 0===b.offsetWidth||0===b.offsetHeight||"none"===b.style.display});b.jgrid._multiselect=!1;if(b.ui&&b.ui.multiselect){if(b.ui.multiselect.prototype._setSelected){var r=b.ui.multiselect.prototype._setSelected;b.ui.multiselect.prototype._setSelected=function(a,d){var c=r.call(this,a,d);if(d&&this.selectedList){var e=this.element;this.selectedList.find("li").each(function(){b(this).data("optionLink")&&b(this).data("optionLink").remove().appendTo(e)})}return c}}b.ui.multiselect.prototype.destroy&&
(b.ui.multiselect.prototype.destroy=function(){this.element.show();this.container.remove();void 0===b.Widget?b.widget.prototype.destroy.apply(this,arguments):b.Widget.prototype.destroy.apply(this,arguments)});b.jgrid._multiselect=!0}b.jgrid.extend({sortableColumns:function(a){return this.each(function(){function d(){c.p.disableClick=!0}var c=this,e=b.jgrid.jqID(c.p.id),e={tolerance:"pointer",axis:"x",scrollSensitivity:"1",items:">th:not(:has(#jqgh_"+e+"_cb,#jqgh_"+e+"_rn,#jqgh_"+e+"_subgrid),:hidden)",
placeholder:{element:function(a){return b(document.createElement(a[0].nodeName)).addClass(a[0].className+" ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0]},update:function(b,a){a.height(b.currentItem.innerHeight()-parseInt(b.currentItem.css("paddingTop")||0,10)-parseInt(b.currentItem.css("paddingBottom")||0,10));a.width(b.currentItem.innerWidth()-parseInt(b.currentItem.css("paddingLeft")||0,10)-parseInt(b.currentItem.css("paddingRight")||0,10))}},update:function(a,
e){var d=b(e.item).parent(),d=b(">th",d),f={},g=c.p.id+"_";b.each(c.p.colModel,function(b){f[this.name]=b});var l=[];d.each(function(){var a=b(">div",this).get(0).id.replace(/^jqgh_/,"").replace(g,"");f.hasOwnProperty(a)&&l.push(f[a])});b(c).jqGrid("remapColumns",l,!0,!0);b.isFunction(c.p.sortable.update)&&c.p.sortable.update(l);setTimeout(function(){c.p.disableClick=!1},50)}};c.p.sortable.options?b.extend(e,c.p.sortable.options):b.isFunction(c.p.sortable)&&(c.p.sortable={update:c.p.sortable});if(e.start){var g=
e.start;e.start=function(b,a){d();g.call(this,b,a)}}else e.start=d;c.p.sortable.exclude&&(e.items+=":not("+c.p.sortable.exclude+")");a.sortable(e).data("sortable").floating=!0})},columnChooser:function(a){function d(a,c){a&&("string"===typeof a?b.fn[a]&&b.fn[a].apply(c,b.makeArray(arguments).slice(2)):b.isFunction(a)&&a.apply(c,b.makeArray(arguments).slice(2)))}var c=this;if(!b("#colchooser_"+b.jgrid.jqID(c[0].p.id)).length){var e=b('<div id="colchooser_'+c[0].p.id+'" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>'),
g=b("select",e);a=b.extend({width:420,height:240,classname:null,done:function(b){b&&c.jqGrid("remapColumns",b,!0)},msel:"multiselect",dlog:"dialog",dialog_opts:{minWidth:470},dlog_opts:function(a){var c={};c[a.bSubmit]=function(){a.apply_perm();a.cleanup(!1)};c[a.bCancel]=function(){a.cleanup(!0)};return b.extend(!0,{buttons:c,close:function(){a.cleanup(!0)},modal:a.modal||!1,resizable:a.resizable||!0,width:a.width+20},a.dialog_opts||{})},apply_perm:function(){b("option",g).each(function(){this.selected?
c.jqGrid("showCol",k[this.value].name):c.jqGrid("hideCol",k[this.value].name)});var e=[];b("option:selected",g).each(function(){e.push(parseInt(this.value,10))});b.each(e,function(){delete p[k[parseInt(this,10)].name]});b.each(p,function(){var b=parseInt(this,10);var a=e,c=b;if(0<=c){var d=a.slice(),k=d.splice(c,Math.max(a.length-c,c));c>a.length&&(c=a.length);d[c]=b;e=d.concat(k)}else e=void 0});a.done&&a.done.call(c,e)},cleanup:function(b){d(a.dlog,e,"destroy");d(a.msel,g,"destroy");e.remove();
b&&a.done&&a.done.call(c)},msel_opts:{}},b.jgrid.col,a||{});if(b.ui&&b.ui.multiselect&&"multiselect"===a.msel){if(!b.jgrid._multiselect){alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");return}a.msel_opts=b.extend(b.ui.multiselect.defaults,a.msel_opts)}a.caption&&e.attr("title",a.caption);a.classname&&(e.addClass(a.classname),g.addClass(a.classname));a.width&&(b(">div",e).css({width:a.width,margin:"0 auto"}),g.css("width",a.width));a.height&&(b(">div",e).css("height",
a.height),g.css("height",a.height-10));var k=c.jqGrid("getGridParam","colModel"),t=c.jqGrid("getGridParam","colNames"),p={},f=[];g.empty();b.each(k,function(a){p[this.name]=a;this.hidedlg?this.hidden||f.push(a):g.append("<option value='"+a+"' "+(this.hidden?"":"selected='selected'")+">"+b.jgrid.stripHtml(t[a])+"</option>")});var q=b.isFunction(a.dlog_opts)?a.dlog_opts.call(c,a):a.dlog_opts;d(a.dlog,e,q);q=b.isFunction(a.msel_opts)?a.msel_opts.call(c,a):a.msel_opts;d(a.msel,g,q)}},sortableRows:function(a){return this.each(function(){var d=
this;d.grid&&!d.p.treeGrid&&b.fn.sortable&&(a=b.extend({cursor:"move",axis:"y",items:".jqgrow"},a||{}),a.start&&b.isFunction(a.start)?(a._start_=a.start,delete a.start):a._start_=!1,a.update&&b.isFunction(a.update)?(a._update_=a.update,delete a.update):a._update_=!1,a.start=function(c,e){b(e.item).css("border-width","0");b("td",e.item).each(function(b){this.style.width=d.grid.cols[b].style.width});if(d.p.subGrid){var g=b(e.item).attr("id");try{b(d).jqGrid("collapseSubGridRow",g)}catch(k){}}a._start_&&
a._start_.apply(this,[c,e])},a.update=function(c,e){b(e.item).css("border-width","");!0===d.p.rownumbers&&b("td.jqgrid-rownum",d.rows).each(function(a){b(this).html(a+1+(parseInt(d.p.page,10)-1)*parseInt(d.p.rowNum,10))});a._update_&&a._update_.apply(this,[c,e])},b("tbody:first",d).sortable(a),b("tbody:first",d).disableSelection())})},gridDnD:function(a){return this.each(function(){function d(){var a=b.data(c,"dnd");b("tr.jqgrow:not(.ui-draggable)",c).draggable(b.isFunction(a.drag)?a.drag.call(b(c),
a):a.drag)}var c=this,e,g;if(c.grid&&!c.p.treeGrid&&b.fn.draggable&&b.fn.droppable)if(void 0===b("#jqgrid_dnd")[0]&&b("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>"),"string"===typeof a&&"updateDnD"===a&&!0===c.p.jqgdnd)d();else if(a=b.extend({drag:function(a){return b.extend({start:function(e,d){var f;if(c.p.subGrid){f=b(d.helper).attr("id");try{b(c).jqGrid("collapseSubGridRow",f)}catch(g){}}for(f=0;f<b.data(c,"dnd").connectWith.length;f++)0===b(b.data(c,"dnd").connectWith[f]).jqGrid("getGridParam",
"reccount")&&b(b.data(c,"dnd").connectWith[f]).jqGrid("addRowData","jqg_empty_row",{});d.helper.addClass("ui-state-highlight");b("td",d.helper).each(function(b){this.style.width=c.grid.headers[b].width+"px"});a.onstart&&b.isFunction(a.onstart)&&a.onstart.call(b(c),e,d)},stop:function(e,d){var f;d.helper.dropped&&!a.dragcopy&&(f=b(d.helper).attr("id"),void 0===f&&(f=b(this).attr("id")),b(c).jqGrid("delRowData",f));for(f=0;f<b.data(c,"dnd").connectWith.length;f++)b(b.data(c,"dnd").connectWith[f]).jqGrid("delRowData",
"jqg_empty_row");a.onstop&&b.isFunction(a.onstop)&&a.onstop.call(b(c),e,d)}},a.drag_opts||{})},drop:function(a){return b.extend({accept:function(a){if(!b(a).hasClass("jqgrow"))return a;a=b(a).closest("table.ui-jqgrid-btable");return 0<a.length&&void 0!==b.data(a[0],"dnd")?(a=b.data(a[0],"dnd").connectWith,-1!==b.inArray("#"+b.jgrid.jqID(this.id),a)?!0:!1):!1},drop:function(e,d){if(b(d.draggable).hasClass("jqgrow")){var f=b(d.draggable).attr("id"),f=d.draggable.parent().parent().jqGrid("getRowData",
f);if(!a.dropbyname){var g=0,l={},h,n,s=b("#"+b.jgrid.jqID(this.id)).jqGrid("getGridParam","colModel");try{for(n in f)f.hasOwnProperty(n)&&(h=s[g].name,"cb"!==h&&"rn"!==h&&"subgrid"!==h&&f.hasOwnProperty(n)&&s[g]&&(l[h]=f[n]),g++);f=l}catch(r){}}d.helper.dropped=!0;a.beforedrop&&b.isFunction(a.beforedrop)&&(h=a.beforedrop.call(this,e,d,f,b("#"+b.jgrid.jqID(c.p.id)),b(this)),void 0!==h&&null!==h&&"object"===typeof h&&(f=h));if(d.helper.dropped){var m;a.autoid&&(b.isFunction(a.autoid)?m=a.autoid.call(this,
f):(m=Math.ceil(1E3*Math.random()),m=a.autoidprefix+m));b("#"+b.jgrid.jqID(this.id)).jqGrid("addRowData",m,f,a.droppos)}a.ondrop&&b.isFunction(a.ondrop)&&a.ondrop.call(this,e,d,f)}}},a.drop_opts||{})},onstart:null,onstop:null,beforedrop:null,ondrop:null,drop_opts:{activeClass:"ui-state-active",hoverClass:"ui-state-hover"},drag_opts:{revert:"invalid",helper:"clone",cursor:"move",appendTo:"#jqgrid_dnd",zIndex:5E3},dragcopy:!1,dropbyname:!1,droppos:"first",autoid:!0,autoidprefix:"dnd_"},a||{}),a.connectWith)for(a.connectWith=
a.connectWith.split(","),a.connectWith=b.map(a.connectWith,function(a){return b.trim(a)}),b.data(c,"dnd",a),0===c.p.reccount||c.p.jqgdnd||d(),c.p.jqgdnd=!0,e=0;e<a.connectWith.length;e++)g=a.connectWith[e],b(g).droppable(b.isFunction(a.drop)?a.drop.call(b(c),a):a.drop)})},gridResize:function(a){return this.each(function(){var d=this,c=b.jgrid.jqID(d.p.id);d.grid&&b.fn.resizable&&(a=b.extend({},a||{}),a.alsoResize?(a._alsoResize_=a.alsoResize,delete a.alsoResize):a._alsoResize_=!1,a.stop&&b.isFunction(a.stop)?
(a._stop_=a.stop,delete a.stop):a._stop_=!1,a.stop=function(e,g){b(d).jqGrid("setGridParam",{height:b("#gview_"+c+" .ui-jqgrid-bdiv").height()});b(d).jqGrid("setGridWidth",g.size.width,a.shrinkToFit);a._stop_&&a._stop_.call(d,e,g)},a.alsoResize=a._alsoResize_?eval("("+("{'#gview_"+c+" .ui-jqgrid-bdiv':true,'"+a._alsoResize_+"':true}")+")"):b(".ui-jqgrid-bdiv","#gview_"+c),delete a._alsoResize_,b("#gbox_"+c).resizable(a))})}})})(jQuery);
;(function($){
/**
 * jqGrid English Translation
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/ 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
**/
$.jgrid = $.jgrid || {};
$.extend($.jgrid,{
	defaults : {
		recordtext: "View {0} - {1} of {2}",
		emptyrecords: "No records to view",
		loadtext: "Loading...",
		pgtext : "Page {0} of {1}"
	},
	search : {
		caption: "Search...",
		Find: "Find",
		Reset: "Reset",
		odata: [{ oper:'eq', text:'equal'},{ oper:'ne', text:'not equal'},{ oper:'lt', text:'less'},{ oper:'le', text:'less or equal'},{ oper:'gt', text:'greater'},{ oper:'ge', text:'greater or equal'},{ oper:'bw', text:'begins with'},{ oper:'bn', text:'does not begin with'},{ oper:'in', text:'is in'},{ oper:'ni', text:'is not in'},{ oper:'ew', text:'ends with'},{ oper:'en', text:'does not end with'},{ oper:'cn', text:'contains'},{ oper:'nc', text:'does not contain'},{ oper:'nu', text:'is null'},{ oper:'nn', text:'is not null'}],
		groupOps: [{ op: "AND", text: "all" },{ op: "OR",  text: "any" }],
		operandTitle : "Click to select search operation.",
		resetTitle : "Reset Search Value"
	},
	edit : {
		addCaption: "Add Record",
		editCaption: "Edit Record",
		bSubmit: "Submit",
		bCancel: "Cancel",
		bClose: "Close",
		saveData: "Data has been changed! Save changes?",
		bYes : "Yes",
		bNo : "No",
		bExit : "Cancel",
		msg: {
			required:"Field is required",
			number:"Please, enter valid number",
			minValue:"value must be greater than or equal to ",
			maxValue:"value must be less than or equal to",
			email: "is not a valid e-mail",
			integer: "Please, enter valid integer value",
			date: "Please, enter valid date value",
			url: "is not a valid URL. Prefix required ('http://' or 'https://')",
			nodefined : " is not defined!",
			novalue : " return value is required!",
			customarray : "Custom function should return array!",
			customfcheck : "Custom function should be present in case of custom checking!"
		}
	},
	view : {
		caption: "View Record",
		bClose: "Close"
	},
	del : {
		caption: "Delete",
		msg: "Delete selected record(s)?",
		bSubmit: "Delete",
		bCancel: "Cancel"
	},
	nav : {
		edittext: "",
		edittitle: "Edit selected row",
		addtext:"",
		addtitle: "Add new row",
		deltext: "",
		deltitle: "Delete selected row",
		searchtext: "",
		searchtitle: "Find records",
		refreshtext: "",
		refreshtitle: "Reload Grid",
		alertcap: "Warning",
		alerttext: "Please, select row",
		viewtext: "",
		viewtitle: "View selected row"
	},
	col : {
		caption: "Select columns",
		bSubmit: "Ok",
		bCancel: "Cancel"
	},
	errors : {
		errcap : "Error",
		nourl : "No url is set",
		norecords: "No records to process",
		model : "Length of colNames <> colModel!"
	},
	formatter : {
		integer : {thousandsSeparator: ",", defaultValue: '0'},
		number : {decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, defaultValue: '0.00'},
		currency : {decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "", suffix:"", defaultValue: '0.00'},
		date : {
			dayNames:   [
				"Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat",
				"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			],
			monthNames: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
			],
			AmPm : ["am","pm","AM","PM"],
			S: function (j) {return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th';},
			srcformat: 'Y-m-d',
			newformat: 'n/j/Y',
			parseRe : /[#%\\\/:_;.,\t\s-]/,
			masks : {
				// see http://php.net/manual/en/function.date.php for PHP format used in jqGrid
				// and see http://docs.jquery.com/UI/Datepicker/formatDate
				// and https://github.com/jquery/globalize#dates for alternative formats used frequently
				// one can find on https://github.com/jquery/globalize/tree/master/lib/cultures many
				// information about date, time, numbers and currency formats used in different countries
				// one should just convert the information in PHP format
				ISO8601Long:"Y-m-d H:i:s",
				ISO8601Short:"Y-m-d",
				// short date:
				//    n - Numeric representation of a month, without leading zeros
				//    j - Day of the month without leading zeros
				//    Y - A full numeric representation of a year, 4 digits
				// example: 3/1/2012 which means 1 March 2012
				ShortDate: "n/j/Y", // in jQuery UI Datepicker: "M/d/yyyy"
				// long date:
				//    l - A full textual representation of the day of the week
				//    F - A full textual representation of a month
				//    d - Day of the month, 2 digits with leading zeros
				//    Y - A full numeric representation of a year, 4 digits
				LongDate: "l, F d, Y", // in jQuery UI Datepicker: "dddd, MMMM dd, yyyy"
				// long date with long time:
				//    l - A full textual representation of the day of the week
				//    F - A full textual representation of a month
				//    d - Day of the month, 2 digits with leading zeros
				//    Y - A full numeric representation of a year, 4 digits
				//    g - 12-hour format of an hour without leading zeros
				//    i - Minutes with leading zeros
				//    s - Seconds, with leading zeros
				//    A - Uppercase Ante meridiem and Post meridiem (AM or PM)
				FullDateTime: "l, F d, Y g:i:s A", // in jQuery UI Datepicker: "dddd, MMMM dd, yyyy h:mm:ss tt"
				// month day:
				//    F - A full textual representation of a month
				//    d - Day of the month, 2 digits with leading zeros
				MonthDay: "F d", // in jQuery UI Datepicker: "MMMM dd"
				// short time (without seconds)
				//    g - 12-hour format of an hour without leading zeros
				//    i - Minutes with leading zeros
				//    A - Uppercase Ante meridiem and Post meridiem (AM or PM)
				ShortTime: "g:i A", // in jQuery UI Datepicker: "h:mm tt"
				// long time (with seconds)
				//    g - 12-hour format of an hour without leading zeros
				//    i - Minutes with leading zeros
				//    s - Seconds, with leading zeros
				//    A - Uppercase Ante meridiem and Post meridiem (AM or PM)
				LongTime: "g:i:s A", // in jQuery UI Datepicker: "h:mm:ss tt"
				SortableDateTime: "Y-m-d\\TH:i:s",
				UniversalSortableDateTime: "Y-m-d H:i:sO",
				// month with year
				//    Y - A full numeric representation of a year, 4 digits
				//    F - A full textual representation of a month
				YearMonth: "F, Y" // in jQuery UI Datepicker: "MMMM, yyyy"
			},
			reformatAfterEdit : false
		},
		baseLinkUrl: '',
		showAction: '',
		target: '',
		checkbox : {disabled:true},
		idName : 'id'
	}
});
})(jQuery);
/*
Project Name       	: 	Pulsar - Content Verification System
File Or Class Name 	: 	GridRelated.js
Description			: 	Grid related common functions
Copyright          	:	Copyright  2009 - 2014 Venera Technologies.
*/

function CreateObj_to_set_GridHeadersProperties(HeaderNamesToModifyProp, GridID, type)
{
	if(type	==	'left')
	{
		var TopLevelArray	=	new Array(), SubElementsArray	=	new Array();
		for(var i = 0; i< HeaderNamesToModifyProp.length; i++)	//Make Array1 of arrays2 where in each element of arrays2 there will be array of selector, [PropertyNames], [Propertyvalues]
		{
			var	ArrayForPropertiesNames	=	new Array(), ArrayForPropertiesValues	=	new Array();
			ArrayForPropertiesNames[0]	=	'padding-left';
			ArrayForPropertiesValues[0]	=	'5px';
			
			TopLevelArray[i]	=	['#jqgh_'+GridID+'_'+HeaderNamesToModifyProp[i], ArrayForPropertiesNames, ArrayForPropertiesValues];
		}
		return TopLevelArray;
	}
	else
	{
		var TopLevelArray	=	new Array(), SubElementsArray	=	new Array();
		for(var i = 0; i< HeaderNamesToModifyProp.length; i++)	//Make Array1 of arrays2 where in each element of arrays2 there will be array of selector, [PropertyNames], [Propertyvalues]
		{
			var	ArrayForPropertiesNames	=	new Array(), ArrayForPropertiesValues	=	new Array();
			ArrayForPropertiesNames[0]	=	'text-align';
			ArrayForPropertiesValues[0]	=	'center';
			
			TopLevelArray[i]	=	['#jqgh_'+GridID+'_'+HeaderNamesToModifyProp[i], ArrayForPropertiesNames, ArrayForPropertiesValues];
		}
		return TopLevelArray;
	}
}

function ModifyGridHeaderProperties(Table)
{
	//For center cols
	var HeaderNamesToModifyProp	=	FindCenteredColsName(Table);
	var ObjectsArray	=	CreateObj_to_set_GridHeadersProperties(HeaderNamesToModifyProp, Table.attr('id'), 'center');
	SetHeaderProperties(ObjectsArray);
	
	//for left cols
	var HeaderNamesToModifyProp	=	FindLeftColsName(Table);
	var ObjectsArray	=	CreateObj_to_set_GridHeadersProperties(HeaderNamesToModifyProp, Table.attr('id'), 'left');
	SetHeaderProperties(ObjectsArray);
}

function FindLeftColsName(Table)	//Get columns which are left aligned
{
	var ArrayElementsLeft	=		$.grep(Table.jqGrid('getGridParam').colModel, function( Elem, index ) {
		return LeftAlignedCols	=	(Elem.align	==	'left');
	});
	
	var ArrayColnames	=	new Array();
	for(var i = 0; i< ArrayElementsLeft.length; i++)
	{
		ArrayColnames.push(ArrayElementsLeft[i].name);
	}
	
	return ArrayColnames;
}

function FindCenteredColsName(Table)	//Get columns which are center aligned
{
	var ArrayElementsCenter	=		$.grep(Table.jqGrid('getGridParam').colModel, function( Elem, index ) {
		return CenterAlignedCols	=	(Elem.align	==	'center');
	});
	
	var ArrayColnames	=	new Array();
	for(var i = 0; i< ArrayElementsCenter.length; i++)
	{
		ArrayColnames.push(ArrayElementsCenter[i].name);
	}
	
	return ArrayColnames;
}

function getJqGridRowData(RowObj){
    var jqTableOB            =    RowObj.closest('table');
    var RowDataArray    =    jqTableOB.jqGrid('getRowData');
    var RowID                 =    RowObj.attr('id');
    return RowDataArray[parseInt(RowID) - 1];
}

function RefreshGrid(gridID){
	$('#'+gridID).trigger('reloadGrid');
}/*
Project Name       	: 	COMMON JS API
File Or Class Name 	: 	commonFunction.js
Description			: 	Common function used in every files
Copyright          	:	Copyright  2009 - 2014 Venera Technologies.
*/

function IsValueNull(Value)
{
	if(Value	==	"" || Value	==	null || Value	==	undefined)
		return true;
	else
		return false;	
}

function SubmitFormFileViaAjax(File, postToUrl, callBack)
{
	var formData = new FormData();
	loadImage();
	formData.append('file', File);
	
	var xmlHttp	=	createBrowserObject(); 	
	xmlHttp.open("POST", postToUrl);
	xmlHttp.send(formData);
	
	xmlHttp.onreadystatechange=function()
	{	    
		deloadImage();
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			callBack(xmlHttp.responseText);
		}
	}
}	

//============================================================================================//
//==================================ON MOUSE OVER SHOW HIGHLIGHT EVEN ROW ====================//
//============================================================================================//

function showEvenColor(id)
{	
	showeven = document.getElementById(id);
	showeven.style.background = "#F4F4F4";
	showeven = null;
}

//==========================================================================================// 
//=========================== FUNCTION : EMAIL VALIDATION ==================================//
//==========================================================================================//

function emailcheck(str)
{
	 if (/^[a-zA-Z0-9]{1}[a-zA-Z0-9\._+-]*@[a-zA-Z0-9]{1}[a-zA-Z0-9\._+-]*\.[a-zA-Z]{2,6}$/.test(str))
	 {
		 return (true);
	 }
	 else
	 {
		return false;
	 }
}

//============================================================================================//
//================================= ON MOUSE OVER SHOW HIGHLIGHT ODD ROW =====================//
//============================================================================================//

function showOddColor(id)
{
	showodd = document.getElementById(id);
	showodd.style.background = "#FFFFFF";
	showodd = null;
}
 
//============================================================================================//
//====================================== MEMORY LEAK SOLUTION ================================//
//============================================================================================//

function memoryLeakSolution(d)
{
 	var a = d.attributes, i, l, n;
	if (a) {
		l = a.length;
		for (i = 0; i < l; i += 1) {
			n = a[i].name;
			if (typeof d[n] === 'function') {
			
				d[n] = null;
			
			}
		}
	}
	a = d.childNodes;
	if (a) {
		l = a.length;
		for (i = 0; i < l; i += 1) {
			memoryLeakSolution(d.childNodes[i]);
		}
	}	
}

//============================================================================================//
//============================= RETURN TRUE IF INTERNET EXPLORER =============================//
//============================================================================================//

var IE 				= false;
var Netscape 		= false;
var errorMessages	= "";

function getObject(a)
{
	  if(document.getElementById && document.getElementById(a))
	  {
		return document.getElementById(a)
	  }
	  else if(document.all&&document.all(a))
	  {
		return document.all(a)
	  }
	  else if(document.layers&&document.layers[a])
	  {
		return document.layers[a]
	  }
	  else
	  {
		return false
	  }
}

//================================================================================================//
//================== FUNCTION TO OPEN POPUP DIV ACCODING TO POSITION =============================//
//================================================================================================//

function getAnchorPosition(anchorname)
{
	// This function will return an Object with x and y properties
	var useWindow=false;
	var coordinates=new Object();
	var x=0,y=0;
	// Browser capability sniffing
	var use_gebi=false, use_css=false, use_layers=false;
	if (document.getElementById) { use_gebi=true; }
	else if (document.all) { use_css=true; }
	else if (document.layers) { use_layers=true; }
	// Logic to find position
 	if (use_gebi && document.all) {
		x=AnchorPosition_getPageOffsetLeft(document.all[anchorname]);
		y=AnchorPosition_getPageOffsetTop(document.all[anchorname]);
		}
	else if (use_gebi) {
		var o=document.getElementById(anchorname);
		x=AnchorPosition_getPageOffsetLeft(o);
		y=AnchorPosition_getPageOffsetTop(o);
		}
 	else if (use_css) {
		x=AnchorPosition_getPageOffsetLeft(document.all[anchorname]);
		y=AnchorPosition_getPageOffsetTop(document.all[anchorname]);
		}
	else if (use_layers) {
		var found=0;
		for (var i=0; i<document.anchors.length; i++) {
			if (document.anchors[i].name==anchorname) { found=1; break; }
			}
		if (found==0) {
			coordinates.x=0; coordinates.y=0; return coordinates;
			}
		x=document.anchors[i].x;
		y=document.anchors[i].y;
		}
	else {
		coordinates.x=0; coordinates.y=0; return coordinates;
		}
	coordinates.x=x;
	coordinates.y=y;
	return coordinates;
}

//================================================================================================//
//================================= FUNCTION TO GET ANCHOR POSITION ==============================//
//================================================================================================//

function getAnchorWindowPosition(anchorname)
{
	var coordinates=getAnchorPosition(anchorname);
	var x=0;
	var y=0;
	if (document.getElementById) {
		if (isNaN(window.screenX)) {
			x=coordinates.x-document.body.scrollLeft+window.screenLeft;
			y=coordinates.y-document.body.scrollTop+window.screenTop;
			}
		else {
			x=coordinates.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset;
			y=coordinates.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset;
			}
		}
	else if (document.all) {
		x=coordinates.x-document.body.scrollLeft+window.screenLeft;
		y=coordinates.y-document.body.scrollTop+window.screenTop;
		}
	else if (document.layers) {
		x=coordinates.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset;
		y=coordinates.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset;
		}
	coordinates.x=x;
	coordinates.y=y;
	return coordinates;
}

//================================================================================================//
//===================== FUNCTION FOR IE TO GET POSTION OF AN OBJECT ==============================//
//================================================================================================//

function AnchorPosition_getPageOffsetLeft (el) 
{
	var ol=el.offsetLeft;
	while ((el=el.offsetParent) != null) { ol += el.offsetLeft; }
	return ol;
}

//================================================================================================//
//===================== FUNCTION FOR IE TO GET POSTION OF AN OBJECT ==============================//
//================================================================================================//

function AnchorPosition_getWindowOffsetLeft (el)
{
	return AnchorPosition_getPageOffsetLeft(el)-document.body.scrollLeft;
}

//================================================================================================//
//===================== FUNCTION FOR IE TO GET POSTION OF AN OBJECT ==============================//
//================================================================================================//

function AnchorPosition_getPageOffsetTop (el)
{
	var ot=el.offsetTop;
	while((el=el.offsetParent) != null) { ot += el.offsetTop; }
	return ot;
}

//================================================================================================//
//===================== FUNCTION FOR IE TO GET POSTION OF AN OBJECT ==============================//
//================================================================================================//

function AnchorPosition_getWindowOffsetTop (el)
{
	return AnchorPosition_getPageOffsetTop(el)-document.body.scrollTop;
}

//=========================================================================================//
//========== FUNCTION TO CONVERT SINGLE DIGIT TO TWO DIGIT ===============================//
//=========================================================================================//

function convertToTwoDigit(num)
{
	switch(num)
	{
		case 0:	
		case 1:	
		case 2:	
		case 3:	
		case 4:	
		case 5:	
		case 6:	
		case 7:	
		case 8:	
		case 9:	num = "0"+num.toString();
	}		
	return num ;
}

//================================================================================================//
//======================== FUNCTION TO CHECK ONLY NUMERIC VALUE ==================================//
//================================================================================================//

function checkNum(x)
{
	 
   var s_len=x.value.length ;
   var s_charcode = 0;
     for (var s_i=0;s_i<s_len;s_i++)
     {
		  s_charcode = x.value.charCodeAt(s_i);
		  if(!((s_charcode>=48 && s_charcode<=57)))
		  {
			  Alert("Only numeric values allowed");
			  x.value=0;
			  x.focus();
			 return false;
		   }	   
     }
     return true;
 }

//===============================================================================================//
//==================== FUNCTION TO CHECK ONLY NUMERIC VALUE ON KEY PRESS ========================//
//===============================================================================================//

function numbersonly(e)
{	 
	var unicode=e.charCode? e.charCode : window.event
    if (unicode > 31 && (unicode < 48 || unicode > 57))		
    	return false //disable key press

    unicode = null;
}

function nospaceallowed(e)
{
	var unicode=e.charCode? e.charCode : window.event
	if (unicode == 32)		
		return false; //disable key press

	unicode = null;
}

function NumericOnly(e)
{	 
	var unicode=e.charCode? e.charCode : window.event
    if (unicode > 31 && (unicode < 48 || unicode > 57) && unicode != 46)		
		return false //disable key press
	
    unicode = null;
}

function NoBackSlash(e)
{
	var unicode = e.charCode? e.charCode : window.event;
    if (unicode == 92)		
		return false; //disable key press
			
    unicode = null;
}

function HexadecimalsAndDot(x)
{
   var s_len=x.length ;
   var s_charcode = 0;
     for (var s_i=0;s_i<s_len;s_i++)
     {
		  s_charcode = x.charCodeAt(s_i);
		  if(!( (s_charcode>=97 && s_charcode<=102) || (s_charcode>=65 && s_charcode<=70) || (s_charcode>=48 && s_charcode<=57) ))
		  {
			 return false;
		  }	   
     }
     return true;
}
//===============================================================================================//
//======================= FUNCTION TO CHECK ONLY PERCENTAGE VALUE ==================================//
//===============================================================================================//

function CheckPercentage(obj)
{	
	if(obj.value != '')
	{	
		reg=/^\d+$/;	
		if(obj.value > 100)
		{
			Alert("Digits range should be 0 to 100");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}		
		if (! reg.test(obj.value))
		{
			Alert("Please input digits only");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
	}	
}

//===============================================================================================//
//======================= FUNCTION TO CHECK ONLY NUMERIC VALUE ==================================//
//===============================================================================================//

function check(obj)
{	
	if(obj.value != '')
	{	
		reg=/^\d+$/;	
		if(obj.value > 2147483647)
		{
			Alert("Digits range should be 0 to 2147483647");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}		
		if (! reg.test(obj.value))
		{
			Alert("Please input digits only");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
	}	
}

function CheckNumeric(obj)
{	
	if(obj.value != '')
	{	
		reg=/^\d*\.{0,1}\d+$/;
		if(obj.value > 2147483647)
		{
			Alert("Digits range should be 0 to 2147483647");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}		
		if (! reg.test(obj.value))
		{
			Alert("Please input numeric values only\nIf you are using a decimal value then a number is required after the decimal");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
	}	
}

//===============================================================================================//
//============================ FUNCTION TO CHECK FOR BIG INTEGER ================================//
//===============================================================================================//

function checkForBigInt(obj)
{	
	if(obj.value != '')
	{	
		reg=/^\d+$/;		
		if(obj.value > 9223372036854775807)
		{
			Alert("Digits range should be 0 to 9223372036854775807");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
		
		if (!reg.test(obj.value))
		{
			Alert("Please input digits only");
			ContinueJsExecution = function (){
				obj.focus();
				obj.select();
				obj = null;
			};
		}
	}	
}

//================================================================================================//
//=================== FUNCTION TO CHECK ONLY NUMERIC VALUE ON RIGHT CLICK ========================//
//================================================================================================//

function whichButton(e)
{
	if (e.button == 2)//RIGHT CLICK
	{		
		Alert("Sorry, this functionality is disabled");
		return false;
	}
}

//================================================================================================//
//======================== FUNCTION TO CHECK ONLY NUMERIC VALUE ON CTRL KEY PRESS ================//
//================================================================================================//

function noCTRL(e)
{
	var code = (document.all) ? event.keyCode:e.which;
	var msg = "Sorry, this functionality is disabled.";
	if (parseInt(code)==17) //CTRL KEY
	{
		Alert(msg);
		window.event.returnValue = false;
	}
} 

//==============================================================================================//
//======================== FUNCTION TO CHECK NUMERIC AND DECIMAL VALUE  ========================//
//==============================================================================================//

function isNumberAndDecimal(frameRate,obj) 
{
	if(isNaN(frameRate))
	{
		var sText  		=  "";
	}
	else
	{
		if(typeof(frameRate) == 'string')
		{
			var sText  		=  document.getElementById(frameRate).value;	
		}
		else if(typeof(frameRate) == 'number')
		{
			var sText  		=  String(frameRate);
		}
	}
	
	var ValidChars 	= "0123456789.";
	var IsNumber   	= true;
	var Char;
	var dotCnt = 0;
	for (i = 0; i < sText.length && IsNumber == true; i++)
	{
		Char = sText.charAt(i);
		if (Char==".") dotCnt = dotCnt +1;
			if (ValidChars.indexOf(Char) == -1 || dotCnt>1)
			{
				Alert("Please enter numeric or decimal digits");
				ContinueJsExecution = function (){
					obj.focus();
					obj.select();
					obj = null;
				};
				IsNumber = false;
			}
	}
	
	sText 	= null;
	Char  	= null;
	dotCnt 	= null;
	
	return IsNumber;
}

function isNumber(num) 
{
	var ValidChars 	= "0123456789.";
	var IsNumber   	= true;
	var Char;
	for (i = 0; i < num.length && IsNumber == true; i++)
	{
		Char = num.charAt(i);
		if (ValidChars.indexOf(Char) == -1)
			IsNumber = false;
	}
	
	return IsNumber;
}

//For display aspect ratio
function isNumberAndDecimalForAspectRatio(frameRate,obj) 
{
	var sText  		=  document.getElementById(frameRate).value;	
	var ValidChars 	= "0123456789.:";
	var IsNumber   	= true;
	var Char;
	var dotCnt = 0;
	for (i = 0; i < sText.length && IsNumber == true; i++)
	{
		Char = sText.charAt(i);
		if (Char=="." || Char==":") dotCnt = dotCnt +1;
			if (ValidChars.indexOf(Char) == -1 || dotCnt>1)
			{
				Alert("Please enter numeric or decimal digits or in form of ratio");
				ContinueJsExecution = function (){
					obj.focus();
					obj.select();
					obj = null;
				};
				IsNumber = false;
			}		 
	}
	
	sText 	= null;
	Char  	= null;
	dotCnt 	= null;
	
	return IsNumber;
}

//==============================================================================================//
//======================== FUNCTION TO CHECK MAX REPORTING ERROR LIMIT =========================//
//==============================================================================================//

function isMaxReprtingError(maxerr, minerr, obj)
{
	var sText  		=  document.getElementById("maxErrorSet").value;	
	var ValidChars 	= "0123456789.";
	var IsNumber	= true;
	var Char;
	var dotCnt = 0;
	for (i = 0; i < sText.length && IsNumber == true; i++)
	{
		Char = sText.charAt(i);
		if (Char==".") dotCnt = dotCnt +1;
			if (ValidChars.indexOf(Char) == -1 || dotCnt>1)
			{
				Alert("Please enter numeric or decimal digits");
				ContinueJsExecution = function (){
					obj.focus();
					obj.select();
					obj = null;
				};
				IsNumber = false;
			}
	}

	if(sText==0 || sText > maxerr)
	{
		Alert("Please enter digits between " + minerr + " to "+ maxerr);
		ContinueJsExecution = function (){
			obj.focus();
			obj.select();
			obj = null;
		};
		IsNumber = false;
	}
	
	return IsNumber;
}

//==============================================================================================//
//================== FUNCTION TO ALLOW ONLY CHARACTERS AND DIGITS ON KEYPRESS  =================//
//==============================================================================================//
function ValidateAlphaDigits(evt)
{
	var keyCode = (evt.which) ? evt.which : evt.keyCode
	if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32)
	{
		if(keyCode > 47 && keyCode < 58)// if it is a number than allow it
		{
			return true;
		}
		return false;
	}
	else
	{
		return true;
	}
}

//======================================================================================================================//
//========= FUNCTIONS TO SET BITS FOR DIFFERENT CHECKS OR HTML ELEMENTS AND STORE THE VALUE IN HOLDER ELEMENT===========//
//======================================================================================================================//
function SetBitValues(Association, ValueHolder)
{
	var SelectedChecks = new Array();
	var SetThisBit;
	$('td').find('input[association="'+Association+'"]:checkbox:checked, select[association="'+Association+'"]').each(function(index, element) {
		if($(this).prop("tagName")	==	"INPUT")
		{
			SetThisBit = $(this).attr( "dbit" );
		}
		else if($(this).prop("tagName")	==	"SELECT")
		{
			SetThisBit = $(this).find(":selected").attr( "dbit" );
		}
		
		if(SetThisBit != null && SetThisBit != 0 && SetThisBit != "" && SetThisBit != undefined)
			SelectedChecks.push(SetThisBit);
    });
	
	if(SelectedChecks.length > 0)
	{
		var selectedGroupsInBits = setBitsForDecimalsInArray(SelectedChecks);
		Element(ValueHolder).value = selectedGroupsInBits;
	}
	else
	{
		Element(ValueHolder).value = 0;
	}
	return ;
}


//======================================================================================================================//
//======= FUNCTIONS TO Store last active tab in cookie and reload the page. The input is jqx selector for the tab=======//
//======================================================================================================================//
function refreshdata(tabToBeDisplay){
	var date = new Date();
	date.setTime(date.getTime()+(6*1000));
	var expires = "; expires="+date.toGMTString();
	document.cookie = "tab="+tabToBeDisplay+expires;
	location.reload();
}

function extractCookie(name){
	var cookieName	=	false;
	var cookieArray	=	document.cookie.split(';');
	for(i=0;i<cookieArray.length;i++){
		if(cookieArray[i].indexOf(name+'=') != -1){
			cookieName	=	decodeURIComponent(cookieArray[i].split('=')[1]);
			break;
		}
	}
	return cookieName;
}


//======================================================================================================================//
//================= FUNCTIONS TO SHOW/HIDE DIV/ROWS OR OTHER ENTITIES DEPENDING ON THE CONDITION=========================//
//======================================================================================================================//

function ShowHideHTMLentity(Criteria, Condition, EntityToActUpon, SpecificValue)
{
	//Criteria specifies whether style.display has to be block or table-row for displaying
	//Condition specifies whether Num(1 for displaying the html entity) or checkbox.checked or combobox value == specefic value, has to be used for displaying/hiding.
	//EntityToActUpon specifies what html element has to be hidden or displayed, it may be a string of multiple entities(comma separated)
	//SpecificValue is used in case of dropdown box, where for a specefic value only the html element is to be acted upon,
	var ArrayofHtmlEntitiesToBeActedUpon = EntityToActUpon.split(',');
	
	for (var i=0; i < ArrayofHtmlEntitiesToBeActedUpon.length; i++)
	{
		// Either Action "1" (display) or checkbox being checked or selectboxvalue == specefic value
		if(Condition == 1 || (typeof Condition == 'string') && (document.getElementById(Condition).checked || parseInt(document.getElementById(Condition).value) == SpecificValue))
		{
			switch(Criteria)
			{
				case 1: //	When there are multiple div/html entities which are to be displayed or hidden, then for condition = 1 the entities are displayed else hidden
					document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.display = 'block';
				break;	
				case 2: //	When there are multiple rows entities which are to be displayed or hidden, then for condition = 1 the entities are displayed else hidden
					document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.display = 'table-row';
				break;	
				case 3: //	When there are multiple rows entities which are to be displayed or hidden, then for condition = 1 the entities are displayed else hidden
					document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.visibility = 'visible';
				break;	
			}
		}
		else if(Criteria	==	3)
			document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.visibility = 'hidden';
		else
			document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).style.display = 'none';
	}
}

function EnableDisableEntity(Condition, EntityToActUpon, SpecificValue)
{
	//Condition specifies whether Num or checkbox.checked or combobox value == specefic value, has to be used to enable/disable. If checkbox is on then entity is enabled
	//EntityToActUpon specifies what html element has to be enabled or disabled, it may be a string of multiple entities(comma separated)
	//SpecificValue is used in case of dropdown box, where for a specefic value only the html element is to be acted upon,
	var ArrayofHtmlEntitiesToBeActedUpon = EntityToActUpon.split(',');
	
	if(typeof SpecificValue == 'string')
	{
		SpecificValueArray = SpecificValue.split(',');	//If specific values are also multiple, then set a flag for conditionalvalue == any of the specific value
	}
	var ComboBox_Condition = false;
	if(typeof Condition == 'string')
	{
		var ElementValue = parseInt(document.getElementById(Condition).value);
		
		if(typeof SpecificValue == 'string')
		{
			for(var j= 0; j<SpecificValueArray.length; j++)
			{
				if(ElementValue == parseInt(SpecificValueArray[j]))
				{
					ComboBox_Condition = true;
					break;	//If elements value is found in any of the specific values than condition is met and thus break out of the loop
				}
			}
		}
		else
		{
			if(ElementValue == SpecificValue)
			{
				ComboBox_Condition = true;
			}
		}
	}


	for (var i=0; i < ArrayofHtmlEntitiesToBeActedUpon.length; i++)
	{
		// Either Action "1" (enable) or checkbox being checked or selectboxvalue == specefic value will enable
		if(Condition == 1 || (typeof Condition == 'string') && (document.getElementById(Condition).checked || ComboBox_Condition))
			document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).disabled = false;
		else
			document.getElementById(ArrayofHtmlEntitiesToBeActedUpon[i]).disabled = true;
	}
}

//================================================================================================================//
//===================== THIS FUNCTION RETURNS THE ELEMENT BY ID. MADE FOR CONVENIENCE ============================//
//================================================================================================================//
function Element(Id_Name)
{
	return document.getElementById(Id_Name);
}

//================================================================================================================//
//====================================== COMPARE DATES AND RETURN FALSE IF FIRST DATE IS BIGGER ==================//
//================================================================================================================//
function CompareDates(Date1, Date2)
{
	var ARRAY1 = Date1.split("-");
	var ARRAY2 = Date2.split("-");

	//Compare Year
	if(parseInt(ARRAY1[0]) > parseInt(ARRAY2[0]))
	{
		return false;
	}
	else if(parseInt(ARRAY1[0]) < parseInt(ARRAY2[0]))
	{
		return true;
	}
	else if(parseInt(ARRAY1[0]) == parseInt(ARRAY2[0]))
	{	
		//CompareMonth
		if(parseInt(ARRAY1[1]) > parseInt(ARRAY2[1]))
		{
			return false;
		}
		else if(parseInt(ARRAY1[1]) < parseInt(ARRAY2[1]))
		{
			return true;
		}
		else if(parseInt(ARRAY1[1]) == parseInt(ARRAY2[1]))
		{
			//CVompareDate
			if(parseInt(ARRAY1[2]) > parseInt(ARRAY2[2]))
			{
				return false;
			}
			else if(parseInt(ARRAY1[2]) < parseInt(ARRAY2[2]))
			{
				return true;
			}
			else if(parseInt(ARRAY1[2]) == parseInt(ARRAY2[2]))
			{
				return true;
			}
		}
	}
}

//==============================================================================================//
//======================= FUNCTION TO DELAY SCRIPT EXECUTION LIKE SLEEP=========================//
//==============================================================================================//
function Sleep(TimeDuartion)
{
	var date = new Date();
	var EntryTime = date.getSeconds();
	var ReturnTime = EntryTime+TimeDuartion;
	for(EntryTime; EntryTime < ReturnTime; )
	{
		var date = new Date();
		EntryTime = date.getSeconds();
	}
	return;
}

//==============================================================================================//
//============= FUNCTION TO LOCATE POP-UP DIV AT CENTRE OF PAGE FOR ALERT MESSAGES==============//
//==============================================================================================//

function ShowDivAtPageCenter(point,obj)
{	
	var showHideSourceDiv = document.getElementById(obj); 
	myobject = showHideSourceDiv;
	showHideSourceDiv.style.top = point.y + "px";
	showHideSourceDiv.style.left = point.x + "px";	
	showHideSourceDiv.style.display = "block";	
}

function ShowAlert(Message)
{
	var InnerHtmlString = "";
	$("#AlertMessageDiv").fadeIn("slow");
	InnerHtmlString = '<p style="margin-top:6px">'+Message+'</p>' ;
	Element('AlertMessage').innerHTML = InnerHtmlString;
	$("#AlertMessage").fadeIn("slow");
	ShowDivAtPageCenter(window.center({width:400,height:300}), 'AlertMessageDiv');
}
/*======================================================================================/
//==============================GRID RELATED FUNCTIONS BUT GENERALIZED==================/
//=====================================================================================*/

function CalculateGridWidth(CorrespondingDivId)
{
	return ($('#'+CorrespondingDivId).closest('table').width() - 5);
}

function CalculatePageSize(DivId, Page)
{
	var ReductionMargin	=	75, HeightAvailableForTable	;
	switch(Page)
	{
		case 1: //Verification Active job
		break;
		case 2: //Verification Processed job
			ReductionMargin	=	130;
		break;
		case 3:	//Templates
			ReductionMargin	=	100;
		break;
	}
	
	if(DivId	==	'TemplateListDiv' || DivId	==	'SmartTemplateListDiv' || DivId	==	'AdaptiveTemplateListDiv')
		HeightAvailableForTable	=	$('#TemplateListDiv').height() - ReductionMargin ;
	else
	{
		HeightAvailableForTable	=	GetAllowableHeightWithoutScroll(document.getElementById(DivId)) - ReductionMargin ;
		if(HeightAvailableForTable	<=	0)
		{
			HeightAvailableForTable	=	550;
		}
	}
	return 	HeightAvailableForTable;
}

function GetMinAppropriateHeightForTableResizing(ObjectHeight)
{
	var HeightToBeSet	=	ObjectHeight > 500 ? ObjectHeight : 500;
	return HeightToBeSet;
}


/*=======================================================*/
//=======FUNCTION TO SET THE PROPERTIES OF OBJECTS=======
/*======================================================*/

//This function would recieve the ids of elements and set various parameters
//The argument acceptable would be object e.g. {A, B, C}where each element would be like=> A= {ElementSelector(e.g. '#id'), propertyname[], value[]}	// The length of property array and length array should be equal
function SetHeaderProperties(ObjectsArray)
{
	var i,j, ObjectElement, ElementSelector, Element, PropertiesNameArray	=	new Array(), PropertiesValueArray	=	new Array();
	if(ObjectsArray	!= null && ObjectsArray != undefined)
	{
		for(i = 0; i< ObjectsArray.length; i++)
		{
			ObjectElement			=	ObjectsArray[i];
			ElementSelector			=	ObjectElement[0];	//If string then it is selector else it would be elementitself
			PropertiesNameArray		=	ObjectElement[1];
			PropertiesValueArray	=	ObjectElement[2];
			if(typeof(ElementSelector) != 'object' && typeof(ElementSelector) == 'string')
			{
				Element	=	$(ElementSelector);
			}
			else
			{
				Element	=	ElementSelector;
			}
			
			for(j = 0; j< PropertiesNameArray.length; j++)
			{
				Element.css(PropertiesNameArray[j], PropertiesValueArray[j]);
			}
		}
	}
}



/*=======================================================*/
//===========FUNCTION TO SHOW THE LOADING EFFECT==========
/*======================================================*/
	
function loadImage()
{
	//document.getElementById('LayOutDiv').style.display = "block";
	//showCenter('<div id="fade"><img src="../../Common/images/aloader.gif"></div>');
	//document.getElementById('LayOutDiv').innerHTML = '<img src="../../Common/images/aloader.gif">'; 
	var LoadingImage	=	document.getElementById('LoadingImage');
	if(!IsValueNull(LoadingImage)){
		LoadingImage.style.display = "block";
		showCenter('LoadingImage');
	}
	LayOutDiv	=	document.getElementById('LayOutDiv');
	if(!IsValueNull(LayOutDiv))
		LayOutDiv.style.display = "block";
	setTimeout(deloadImage, 15000);
}

/*=======================================================*/
//======FUNCTION TO VALIDATE MINUTES AND SECONDS==========
/*======================================================*/
function isMinuteOrSecond(obj)
{
   if(obj.value ==	""	|| obj.value<60)
   {
     return true;	   
   }
   else
	{  
	   obj.value	=	"59";
	   return false;
	}   
}  
/*=======================================================*/
//===========FUNCTION TO HIDE THE LOADING EFFECT==========
/*======================================================*/
	
function deloadImage()
{
	//document.getElementById('LayOutDiv').innerHTML = ''; 
	LoadingImage= document.getElementById('LoadingImage');
	if(!IsValueNull(LoadingImage))
		LoadingImage.style.display = "none";
	LayOutDiv	=	document.getElementById('LayOutDiv');
	if(!IsValueNull(LayOutDiv))
		LayOutDiv.style.display = "none";
}
	
	
function HideMessageDiv(DivToHide)
{
	var HideThis = Element(DivToHide);
	HideThis.style.display = 'none';
}

function AutoHideAlertDivAfterInterval(Interval)	// This function makes the messages appearing above template type tabs, disappear after specified time interval
{
	var int=self.setTimeout(function(){$("#AlertMessageDiv").fadeOut("slow");},Interval);
}

function ShowCenter(point,obj)
{
	if(typeof obj != 'object')	
		var showHideSourceDiv = document.getElementById(obj);
	else
		var showHideSourceDiv	=	obj;
		
	myobject = showHideSourceDiv;
	showHideSourceDiv.style.top = point.y + "px";
	showHideSourceDiv.style.left = point.x + "px";	
	showHideSourceDiv.style.display = "block";	
}
//==============================================================================================//
//==== FUNCTION TO SHOW HYPHENS AS USED IN DISPLAYING TITLE IN DROP DOWN TEMPLATES LIST ========//
//==============================================================================================//
function showBar(num)
{
	var mystr = "";
	var str = "--";
	for(var i=0; i<num; i++)
	{
		mystr += str;
	}
	return mystr ;
}

//==============================================================================================//
//========================= CREATE BROWSE OBJECT FOR AJAX =======================//
//==============================================================================================//
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
 

//============================================================================================//
//========================================= BASE64 ENCODE PHP.JS =============================//
//============================================================================================//
function base64_encode(data) {
  //  discuss at: http://phpjs.org/functions/base64_encode/
  // original by: Tyler Akins (http://rumkin.com)
  // improved by: Bayron Guevara
  // improved by: Thunder.m
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Rafał Kukawski (http://kukawski.pl)
  // bugfixed by: Pellentesque Malesuada
  //   example 1: base64_encode('Kevin van Zonneveld');
  //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
  //   example 2: base64_encode('a');
  //   returns 2: 'YQ=='

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

//============================================================================================//
//========================================= BASE64 DECODE PHP.JS =============================//
//============================================================================================//

function base64_decode(data) {
  //  discuss at: http://phpjs.org/functions/base64_decode/
  // original by: Tyler Akins (http://rumkin.com)
  // improved by: Thunder.m
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Aman Gupta
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Onno Marsman
  // bugfixed by: Pellentesque Malesuada
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
  //   returns 1: 'Kevin van Zonneveld'
  //   example 2: base64_decode('YQ===');
  //   returns 2: 'a'

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    dec = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  data += '';

  do { // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;

    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);

  dec = tmp_arr.join('');

  return dec.replace(/\0+$/, '');
}

//============================================================================================//
//========================================= SEND AJAX REQUEST ================================//
//============================================================================================//
/*
mandatory 	object. It should have various properties as described below. Some are madatory and other optional
mandatory	object.actionScriptURL	=	relative path(relative to doc root of server) of page , which is to be called
						It can also be urlwith query string along
optional	object.sendMethod		=	POST/GET. Default value is post
optional	object.callType			=	ASYNC/SYNC. Default value is ASYNC
optional	object.additionalData	=	AnyData to be sent like formdata or else
optional	object.callBack			=	Any function to be called back wid response from server. If function as an object is being passed then that function must have an argument provisioning
*/
function send_remoteCall(object)
{
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
			if(xmlHttp.readyState	==	4 && xmlHttp.status	==	200)
			callBack(xmlHttp.responseText);
		}; 
	}
	xmlHttp.open(sendMethod,object.actionScriptURL,callType);
	if(additionalData != null && additionalData != undefined ){
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", additionalData.length);
		xmlHttp.setRequestHeader("Connection", "close");
	}
	xmlHttp.send(additionalData); 
}

	/********************************************************************************/
			//FUNCTION CORRESPONDING TO THAT OF PHP IN JAVASCRIPT//
	/********************************************************************************/
function json_decode (str_json)
{
  // From: http://phpjs.org/functions
  // +      original by: Public Domain (http://www.json.org/json2.js)
  // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      improved by: T.J. Leahy
  // +      improved by: Michael White
  // *        example 1: json_decode('[ 1 ]');
  // *        returns 1: true

  /*
    http://www.JSON.org/json2.js
    2008-11-19
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
  */

  var json = this.window.JSON;
  if (typeof json === 'object' && typeof json.parse === 'function') {
    try {
      return json.parse(str_json);
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        throw new Error('Unexpected error type in json_decode()');
      }
      this.php_js = this.php_js || {};
      this.php_js.last_error_json = 4; // usable by json_last_error()
      return null;
    }
  }

  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var j;
  var text = str_json;

  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.
  cx.lastIndex = 0;
  if (cx.test(text)) {
    text = text.replace(cx, function (a) {
      return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    });
  }

  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.
  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
  if ((/^[\],:{}\s]*$/).
  test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
  replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
  replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.
    j = eval('(' + text + ')');

    return j;
  }

  this.php_js = this.php_js || {};
  this.php_js.last_error_json = 4; // usable by json_last_error()
  return null;
}

function stripslashes (str) {
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Ates Goral (http://magnetiq.com)
  // +      fixed by: Mick@el
  // +   improved by: marrtins
  // +   bugfixed by: Onno Marsman
  // +   improved by: rezna
  // +   input by: Rick Waldron
  // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +   input by: Brant Messenger (http://www.brantmessenger.com/)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: stripslashes('Kevin\'s code');
  // *     returns 1: "Kevin's code"
  // *     example 2: stripslashes('Kevin\\\'s code');
  // *     returns 2: "Kevin\'s code"
  return (str + '').replace(/\\(.?)/g, function (s, n1) {
    switch (n1) {
    case '\\':
      return '\\';
    case '0':
      return '\u0000';
    case '':
      return '';
    default:
      return n1;
    }
  });
}

function wordwrap( str, width, brk, cut ) {
 
    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;
 
    if (!str) { return str; }
 
    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
 
    return str.match( RegExp(regex, 'g') ).join( brk );
 
}
//==============================================================================================//
//=================== FUNCTION TO SEARCH AN ELEMENT IF PRESENT IN ARRAY LIKE PHP ===============//
//==============================================================================================//
function in_array(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] === needle) return true;
    }
    return false;
}

//==============================================================================================//
//==== FUNCTION TO SEARCH A CASE-INSENSITIVE STRING ELEMENT IF PRESENT IN ARRAY LIKE PHP ======//
//==============================================================================================//
function stringIn_array(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
		if(needle != undefined && haystack[i] != undefined)
	        if(haystack[i].toLowerCase() == needle.toLowerCase()) return true;
    }
    return false;
}

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
//==============================================================================================//
//=================== FUNCTION TO SET BITS OF AN ARRAY HAVING SELECTIONS IN DECIMAL NUMBER======//
//==============================================================================================//
function setBitsForDecimalsInArray(arrayWithDecimalsOnly) {	//e.g. array[1,2] will return 00000011, array[1,2,3] will return 00000111, and so on
	var ResultInBits = 0;
	for(var i = 0; i < arrayWithDecimalsOnly.length; i++) {
        ResultInBits |= Math.pow(2,(arrayWithDecimalsOnly[i] - 1)).toString();
    }
    return ResultInBits;
}

function RefreshHtmlPortionsFromUrl(jqSelector, url){
	if(!IsValueNull(jqSelector) && !IsValueNull(url)) {
		
		$(jqSelector).load(document.URL +  jqSelector);
	}
}

String.prototype.wordWrap = function(m, b, c){
	var i, j, l, s, r;
	if(m < 1)
		return this;
	for(i = -1, l = (r = this.split("\n")).length; ++i < l; r[i] += s)
		for(s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : ""))
			j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length
			|| c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
	return r.join("\n");
};
//==============================================================================================//
//=================== FUNCTION TO DISALLOW  MORE THAN ONE SPACES BETWEEN NAMES==================//
//==============================================================================================//
function disallowSpacesBetweenNames(entry){
	var entry = entry.split(' ');
	var entryname = '' ;
	for(i=0;i<entry.length;i++)
	{
	   if(entry[i]!=''){
		   entryname += entry[i];
		   entryname += ' ';        
	   }
	}
	entryname = entryname.trim();
	return entryname;
}

function stopRKey(evt) { 
  var evt = (evt) ? evt : ((event) ? event : null); 
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
  if ((evt.keyCode == 13) && (node.type=="text"))  {return false;} 
} 

function convertClickToDoubleClick(src){
	$(src).dblclick();
}

$(function(){
	$('form').keypress(stopRKey);
});

/* CUSTOM JQUERY API TO UPDATE HTML ELEMENTS ON UPDATE OF DATA OBJECT
 * Requires a json object as argument
 * Binded html elements must have the custom attributes set
 * For more details read the spec of this API 
 * */
var venera_update_data	=	function(DataObjectToBind){
	if(DataObjectToBind != '' && DataObjectToBind != null && DataObjectToBind != undefined){
		$.fn.dataChange = function(){
		    var prev;
		    if ( arguments.length > 0 ){
		        prev = window["$"]["fn"][this[0].getAttribute('customValueAs')].apply(this, arguments);
		    }
		    var result = window["$"]["fn"][this[0].getAttribute('customValueAs')].apply(this, arguments);
		    if ( arguments.length > 0 && prev != window["$"]["fn"][this[0].getAttribute('customValueAs')].apply(this, arguments) ){
		        $(this).trigger("change");
		    }
		    return result;
		};
		for(key in DataObjectToBind){
			jqObject	=	$('[customValueOf="'+key+'"]');
			jqObject.dataChange(DataObjectToBind[key]);
		}
		$.fn.dataChange = null;
	}
};

function showCenter(obj)
{	
	if(typeof obj != "object")	
		var divObject = document.getElementById(obj); 
	else
		var divObject = obj; 

	myobject = divObject;

	divObject.style.top = window.screen.height/2 - 50 + 'px';
	divObject.style.left = window.screen.width/2 - 100 + 'px';	
	divObject.style.display = "block";	
}

function IsbrowserIE(){
	output	=	false;
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	var Trident = ua.indexOf("Trident");
	if (msie > 0 || Trident > 0){
		output = true;
	}
	return output;
}

$(function(){
    if(window.Alert == undefined || window.alert == null){
        Alert = function(msg){
            alert(msg);
        };
    }
});


var fetchDataFieldsAndTitles	=	function(object){
	var datafields 	=  	new Array();
	var columns		=	new Array();
	var colTitles 	=	$(object).attr('datafields').split(',');
	var colArray 	=	colTitles;
	if(!IsValueNull($(object).attr('colTitles'))) {
	    colTitles = $(object).attr('colTitles').split(',');
	}
	
	if(colArray.length != colTitles.length){
		ErrorLog('Number of column data fields is not equal to number of column titles for '+object.id);
		return false;
	}
	
	for(i=0;i<colArray.length;i++) {
		
		var datafieldsEntry = new Object();
		var columnsEntry	= new Object();
		
		datafieldsEntry.name = colArray[i];
		datafields.push(datafieldsEntry);

		columnsEntry.text 			= colTitles[i];
		columnsEntry.dataField		= colArray[i];
		if(!IsValueNull($(object).attr('cellrenderer')))
			columnsEntry.cellsrenderer	= window[$(object).attr('cellrenderer')];
		if(i != colArray.length - 1)
			columnsEntry.width = '10%';
		columns.push(columnsEntry);
		
	}
	
	if(!IsValueNull($(object).attr('datatype'))){
		var datafieldtypes = $(object).attr('datatype').split(',');
		for(j=0;j<datafieldtypes.length;j++){
			var type	=	datafieldtypes[j].split('=');
			datafields[type[0]-1].type = type[1];
		}
	}
	object.columns		=	columns;
	object.datafields	=	datafields;
	return true;
};

var generateSource				=	function(object){
	var source = {
	        datatype: "json",
	        datafields: object.datafields,
	        id: 'id',
	        url: $(object).attr('url'),
	        root: 'data',
	        pagesize: 15,
	        addrow: function (rowid, rowdata, position, commit) {
	            // synchronize with the server - send insert command
	            // call commit with parameter true if the synchronization with the server is successful 
	            //and with parameter false if the synchronization failed.
	            // you can pass additional argument to the commit callback which represents the new ID if it is generated from a DB.
	            commit(true);
	        },
	        deleterow: function (rowid, commit) {
	            // synchronize with the server - send delete command
	            // call commit with parameter true if the synchronization with the server is successful 
	            //and with parameter false if the synchronization failed.
	            commit(true);
	        },
	        updaterow: function (rowid, newdata, commit) {
	            // synchronize with the server - send update command
	            // call commit with parameter true if the synchronization with the server is successful 
	            // and with parameter false if the synchronization failed.
	            commit(true);
	        }
	    };
	
	var dataAdapter 			=	new $.jqx.dataAdapter(source);
	return dataAdapter;
};

var createNewGrid = function(jqxgridobject){
	var datafieldsAndColumns 	=	fetchDataFieldsAndTitles(jqxgridobject);
	if(!datafieldsAndColumns)
		return false;
    var dataAdapter 			=	generateSource(jqxgridobject);
//    var dataAdapter 			=	new $.jqx.dataAdapter(jqxGridsource);

	$(jqxgridobject).on('bindingcomplete', function () {
	//    alert("Binding Completed");
	}); 
    var toolBarShow			= false;
    if(!IsValueNull($(jqxgridobject).attr('toolbar')))
    	toolBarShow			= true;
	var jqxGridCallObject	=	{
	        width: $(jqxgridobject).attr('width'),
	        height: $(jqxgridobject).attr('height'),
	        source: dataAdapter,
	        columnsresize: true,
	        pagesizeoptions:['10', '15', '50', '100'],
	        pageable: true,
	        sortable: true,
	        filterable: false,
	        pagermode: 'default',
	        showtoolbar: toolBarShow,
	        columns: jqxgridobject.columns
	    };
	
	
	if(toolBarShow){
		jqxGridCallObject.rendertoolbar = window[$(jqxgridobject).attr('toolbar')];
	}
	
    $(jqxgridobject).jqxGrid(jqxGridCallObject);
    if(!IsValueNull($(jqxgridobject).attr('popupWindow'))){
    	$($(jqxgridobject).attr('popupWindow')).jqxWindow({
    		width:350, resizable: false,  isModal: true, autoOpen: false, cancelButton: $("#Cancel"), modalOpacity: 0.01           
    	});
    }
   // update the edited row when the user clicks the 'Save' button.

}
var RenderGrids	=	function(){
	$('.createGrid').each(function(){
		createNewGrid($(this)[0]);
	});
};

$(document).ready(function () {
	RenderGrids();
});

