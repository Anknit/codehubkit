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
