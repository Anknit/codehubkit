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
};