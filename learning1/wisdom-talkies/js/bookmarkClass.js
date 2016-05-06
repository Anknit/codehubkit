var mainApp =   mainApp || {};

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
};