var mainApp =   mainApp || {};

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
};