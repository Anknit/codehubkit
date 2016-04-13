var mainApp =   mainApp || {};

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
