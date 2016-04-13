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
	                	{name:'',				index:'', search:false,								width:20,	formatter:activeJobDetailsFormatterFunction.select},
	                	{name:'title',			index:'title', search:true,							width:300},
						{name:'category_breadcrumb',		index:'category_breadcrumb', search:true,		align:"center", width:100, 	 formatter:activeJobDetailsFormatterFunction.category},
						{name:'istopicnull',	index:'istopicnull',	align:"center", width:80, search:false,	formatter:activeJobDetailsFormatterFunction.istopicnull},
						{name:'version',		index:'version',		align:"center", width:80, search:false},
						{name:'emailid',		index:'emailid',		align:"center", width:130, search:true},
						{name:'publisheddate',	index:'publisheddate',	align:"center", width:100, search:false},
						{name:'curationstatus',	index:'curationstatus',	align:"center", width:100, search:false, 	 formatter:activeJobDetailsFormatterFunction.status},
						{name:'reviewissue',	index:'reviewissue',	align:"center", width:100, search:false},
						{name:'action',			index:'', search:false,				sortable:false,align:"center", width:50, 	 formatter:activeJobDetailsFormatterFunction.rb}
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
		if(!IsValueNull(categoryObject[rowdata.category]))
		{
			if(categoryObject[rowdata.category]['status'] == 1){
	/*
				innerHtml	=	 categoryObject[rowdata.category]['catName'];
	*/
				tempcuration_data[rowdata.id]['category']	=	categoryObject[rowdata.category]['catName'];
				tempcuration_data[rowdata.id]['other_category']	=	'';
			}
			else{
				if(categoryObject[rowdata.category]['parentCat'] != 0){
	/*
					innerHtml = categoryObject[categoryObject[rowdata.category]['parentCat']]['catName'];
	*/
					tempcuration_data[rowdata.id]['other_category']	=	categoryObject[rowdata.category]['catName'];
					tempcuration_data[rowdata.id]['category']	=	categoryObject[categoryObject[rowdata.category]['parentCat']]['catName'];
				}
				else{
	/*
					innerHtml = 'other';
	*/
					tempcuration_data[rowdata.id]['other_category']	=	categoryObject[rowdata.category]['catName'];
					tempcuration_data[rowdata.id]['category']	=	'other';
				}
			}
			innerHtml	=	 rowdata.category_breadcrumb;
		}
		else{
			innerHtml	=	 'Not defined';
		}
		
		if (IsValueNull(rowdata.language)){
			tempcuration_data[rowdata.id]['other_language']	=	'';
			tempcuration_data[rowdata.id]['language']	=	'';
		}
		
		if(!IsValueNull(languageObject[rowdata.language]))
		{
			if(languageObject[rowdata.language]['status'] == 1){
				tempcuration_data[rowdata.id]['language_id']	=	rowdata.language;
				tempcuration_data[rowdata.id]['other_language']	=	'';
				tempcuration_data[rowdata.id]['language']	=	languageObject[rowdata.language]['language'];
			}
			else{
				tempcuration_data[rowdata.id]['language_id']	=	rowdata.language;
				tempcuration_data[rowdata.id]['other_language']	=	languageObject[rowdata.language]['language'];
				tempcuration_data[rowdata.id]['language']	=	'other';
			}
		}
		else
		{
		}
		return encodeHtmlEntities(innerHtml);
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
		else if(rowdata.curationstatus == '8'){
			innerHtml	=	"Deleted";
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
			innerHtml	+=	"<button class='modify_approve' data-contentid="+rowdata.id+">" + "Modify" + "</button>";
		}
		else if(rowdata.curationstatus == '3'){
			innerHtml	=	"<button class='review_approve' id="+rowdata.id+">" + "Review" + "</button>";
			innerHtml	+=	"<button class='review_recurate' data-contentid="+rowdata.id+">" + "Re-curate" + "</button>";
		}
		else if(rowdata.curationstatus == '4' ){
			innerHtml	=	"<button class='modify_approve' data-contentid="+rowdata.id+">" + "Modify" + "</button>";
		}
		else if(rowdata.curationstatus == '6' ){
			innerHtml	=	"<button class='modify_approve' data-contentid="+rowdata.id+">" + "Modify" + "</button>";
		}
		
		return innerHtml;
	}
	activeJobDetailsFormatterFunction.select	=	function(val,colModelOB, rowdata){
		var innerHtml	=	'';
		innerHtml	=	"<input type='checkbox' class='review_checkboxes' name='review_select_checkbox' id="+rowdata.id+">";
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
		UI_bindFunction('.review_checkboxes',on_review_checkbox_change,'change');
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
