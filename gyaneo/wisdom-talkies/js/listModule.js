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
};