ResizeMovieACJ = 0;
ACJOBS_GRID_UNIQUE_ID	=	'ActiveJobs';
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
var activejcolmodel = function() {
	var colModel = [
	                	{name:'title',			index:'title',width:300, search:true},
						{name:'category',		index:'category',		align:"center", width:100, 	 formatter:activeJobDetailsFormatterFunction.category, search:true},
						{name:'istopicnull',	index:'istopicnull',	align:"center", width:100,	formatter:activeJobDetailsFormatterFunction.istopicnull, search:false},
						{name:'emailid',		index:'emailid',		align:"center", width:100, search:false},
						{name:'publisheddate',	index:'publisheddate',	align:"center", width:100, search:false},
						{name:'curationstatus',	index:'curationstatus',	align:"center", width:100, 	 formatter:activeJobDetailsFormatterFunction.status, search:false},
						{name:'reviewissue',	index:'reviewissue',	align:"center", width:100, search:false},
						{name:'action',			index:'',				sortable:false,align:"center", width:50, 	 formatter:activeJobDetailsFormatterFunction.rb, search:false}
						];
	return colModel;
};
var activeJobDetailsFormatterFunction = new Object();
function defineACJobsDetailsFormatterFunction() {
	activeJobDetailsFormatterFunction.category = function(val,colModelOB, rowdata) {
		var innerHtml;
		if(colModelOB.rowId == "1"){
			tempcuration_data = {};
		}
		tempcuration_data[rowdata.id]	=	rowdata;
		tempcuration_data[rowdata.id]['category_id']	=	rowdata.category;
		if(categoryObject[rowdata.category]['status'] == 1){
			innerHtml	=	 categoryObject[rowdata.category]['catName'];
			tempcuration_data[rowdata.id]['category']	=	innerHtml;
			tempcuration_data[rowdata.id]['other_category']	=	'';
		}
		else{
			if(categoryObject[rowdata.category]['parentCat'] != 0){
				innerHtml = categoryObject[categoryObject[rowdata.category]['parentCat']]['catName'];
				tempcuration_data[rowdata.id]['other_category']	=	categoryObject[rowdata.category]['catName'];
				tempcuration_data[rowdata.id]['category']	=	innerHtml;
			}
			else{
				innerHtml = 'other';
				tempcuration_data[rowdata.id]['other_category']	=	categoryObject[rowdata.category]['catName'];
				tempcuration_data[rowdata.id]['category']	=	innerHtml;
			}
		}
		if (IsValueNull(rowdata.language)){
			tempcuration_data[rowdata.id]['other_language']	=	'';
			tempcuration_data[rowdata.id]['language']	=	'';
		}
		else if(languageObject[rowdata.language]['status'] == 1){
			tempcuration_data[rowdata.id]['language_id']	=	rowdata.language;
			tempcuration_data[rowdata.id]['other_language']	=	'';
			tempcuration_data[rowdata.id]['language']	=	languageObject[rowdata.language]['language'];
		}
		else{
			tempcuration_data[rowdata.id]['language_id']	=	rowdata.language;
			tempcuration_data[rowdata.id]['other_language']	=	languageObject[rowdata.language]['language'];
			tempcuration_data[rowdata.id]['language']	=	'other';
		}
		return innerHtml;
	}
	activeJobDetailsFormatterFunction.status = function(val,colModelOB, rowdata) {
		var innerHtml;
		if(rowdata.curationstatus == '1'){
			innerHtml	=	'Pending for approval';
		}
		else if(rowdata.curationstatus == '2'){
			innerHtml	=	 'Incomplete';
		}
		else if(rowdata.curationstatus == '3'){
			innerHtml	=	 'Issue by reviewer';
		}
		else if(rowdata.curationstatus == '4'){
			innerHtml	=	 'Approved';
		}
		else if(rowdata.curationstatus == '5'){
			innerHtml	=	"Recommended";
		}
		else if(rowdata.curationstatus == '6'){
			innerHtml	=	"Rejected by moderator";
		}
		else if(rowdata.curationstatus == '7'){
			innerHtml	=	"Processed through recommendation";
		}
		return innerHtml;
	}
	activeJobDetailsFormatterFunction.rb = function(val,colModelOB, rowdata) {
		var innerHtml	=	'';
		if(rowdata.curationstatus == '5'){
			innerHtml	=	"<button class='curate_recommended' id="+rowdata.id+">" + "Curate" + "</button>";
		}
		else if(rowdata.curationstatus == '1'){
			innerHtml	=	"<button class='review_approve' id="+rowdata.id+">" + "Review" + "</button>";
		}
		else if(rowdata.curationstatus == '3'){
			innerHtml	=	"<button class='review_approve' id="+rowdata.id+">" + "Review" + "</button>";
			innerHtml	+=	"<button class='review_recurate' data-contentid="+rowdata.id+">" + "Re-curate" + "</button>";
		}
		else if(rowdata.curationstatus == '4' ){
			innerHtml	=	"<button class='modify_approve' data-contentid="+rowdata.id+">" + "Modify" + "</button>";
		}
		return innerHtml;
	}
	activeJobDetailsFormatterFunction.gridComplete	=	function(){
		var Table			=	$(this);
		GRID_UNIQUE_ID	=	ACJOBS_GRID_UNIQUE_ID;
		if(ResizeMovieACJ	==	0){
			//addActiveJobsPagerIcons();
			CommonGridCompleteFunctions(Table);
			ResizeMovieACJ++;
		}	
		worksOnAllGridComplete(Table);
        $('#'+GRID_UNIQUE_ID).filterToolbar({autosearch:true});
		UI_bindFunction('.review_approve',review_play,'click');
		UI_bindFunction('.curate_recommended',curateContentReview,'click');
		UI_bindFunction('.modify_approve,.review_recurate',recurate_content,'click');
/*		UI_bindFunction('.review_recurate',recurate_content,'click');
*/	}
	activeJobDetailsFormatterFunction.istopicnull = function(val,colModelOB, rowdata) {
		var innerHtml;
		if(rowdata.istopicnull == '1'){
			innerHtml	=	'NO';
		}
		else if(rowdata.istopicnull == '0'){
			innerHtml	=	 'YES';
		}
		return innerHtml;
	};
}
defineACJobsDetailsFormatterFunction();