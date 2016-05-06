var vidPlayerObject =   '';
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
 