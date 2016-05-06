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
};