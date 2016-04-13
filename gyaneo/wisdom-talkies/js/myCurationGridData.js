ResizeCurationGrid = 0;
GRID_UNIQUE_ID	=	'CurationListTable';

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
	ResizeTable(Table);
	ModifyGridHeaderProperties(Table);

};

var myCurationDataColModel = function() {
	var colModel = [
	                	{name:'title',			index:'title',width:300},
						{name:'category',		index:'category',		align:"center", width:100, 	 formatter:myCurationDataFormatterFunction.category},
						{name:'modifieddate',	index:'modifieddate',	align:"center", width:100},
						{name:'curationstatus',	index:'curationstatus',	align:"center", width:100, 	 formatter:myCurationDataFormatterFunction.status},
						{name:'reviewissue',	index:'reviewissue',	align:"center", width:100},
						{name:'action',			index:'title',			align:"center", width:150, sortable:false, formatter:myCurationDataFormatterFunction.rb}
						];
	return colModel;
};

var myCurationDataFormatterFunction = new Object();

function defineMyCurationDataFormatterFunction() {

	myCurationDataFormatterFunction.category = function(val,colModelOB, rowdata) {
		var innerHtml;
        if(!IsValueNull(mainAppVars.catNameObject[val])){
            innerHtml   =   mainAppVars.catNameObject[val];
        }
        else{
            innerHtml   =   'other';
        }
		return encodeHtmlEntities(innerHtml);
	}

	myCurationDataFormatterFunction.status = function(val,colModelOB, rowdata) {
		var innerHtml;
        if(colModelOB.rowId == "1"){
            tempcuration_data = {};
        }
        tempcuration_data[rowdata.id]	=	rowdata;

		if(rowdata.curationstatus == '1'){
			innerHtml	=	'Saved for final review';
		}
		else if(rowdata.curationstatus == '2'){
			innerHtml	=	 'Incomplete';
		}
		else if(rowdata.curationstatus == '3'){
			innerHtml	=	 'Pending';
		}
		else if(rowdata.curationstatus == '4'){
			innerHtml	=	 'Approved';
		}
		else if(rowdata.curationstatus == '5'){
			innerHtml 	= 	"Recommended";
		}
		else if(rowdata.curationstatus == '6'){
			innerHtml	 =	"Rejected";
		}
		else if(rowdata.curationstatus == '7'){
			innerHtml 	=	"Processed";
		}
		else if(rowdata.curationstatus == '8'){
			innerHtml 	=	"Removed";
		}
		return innerHtml;
	}
	
	myCurationDataFormatterFunction.rb = function(val,colModelOB, rowdata) {
		var innerHtml	=	'';
		if(rowdata.curationstatus == '1' ){ 
			innerHtml	=	"<button class='watch_curate btn btn-primary' id="+rowdata.id+">" + "Watch" + "</button>";
		}
		else if(rowdata.curationstatus == '4' ){
			innerHtml	=	"<button class='modify_curate btn btn-primary' id="+rowdata.id+">" + "Edit" + "</button>";
		}
		else if(rowdata.curationstatus == '2' ){
			innerHtml	=	"<button class='modify_curate btn btn-primary' id="+rowdata.id+">" + "Edit" + "</button>&nbsp;";
			innerHtml	+=	"<button class='delete_curate btn btn-danger' data-id="+rowdata.id+">" + "Delete" + "</button>";
		}
		else if(rowdata.curationstatus == '6' ){
			innerHtml	=	"<button class='modify_curate btn btn-primary' id="+rowdata.id+">" + "Edit" + "</button>";
		}
		return innerHtml;
	}
	
	myCurationDataFormatterFunction.gridComplete	=	function(){
		var Table			=	$(this);
		GRID_UNIQUE_ID	=	GRID_UNIQUE_ID;
		if(ResizeCurationGrid	==	0){
			//addActiveJobsPagerIcons();
			CommonGridCompleteFunctions(Table);
			ResizeCurationGrid++;
		}	
		worksOnAllGridComplete(Table);
		UI_bindFunction('.modify_curate',curateContentReview,'click');
		UI_bindFunction('.delete_curate',deleteIncompleteCuration,'click');
		UI_bindFunction('.watch_curate',curateContentReview,'click');

};

}
var curateContentReview	=	function(event){
	location.href	=	'./curate/videoId='+tempcuration_data[event.target.id]['videoid']+'?page=list&request=curate&videoId='+tempcuration_data[event.target.id]['videoid']+'&category='+tempcuration_data[event.target.id]['category'];
};
var deletionContent =   '';
var deleteIncompleteCuration    =   function(event){
    $('#delete-curation').find('.hide-toggle').removeClass('hide');
    $('#delete-curation-message').addClass('hide');
    UI_openModal('#delete-curation');
    deletionContent =   tempcuration_data[$(event.currentTarget).attr('data-id')]['videoid'];
};
defineMyCurationDataFormatterFunction();
