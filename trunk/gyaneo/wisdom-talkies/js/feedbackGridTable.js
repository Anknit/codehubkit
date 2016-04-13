ResizeFeedbackGrid = 0;
GRID_UNIQUE_ID	=	'FeedbackTable';

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

var feedbackcolmodel = function() {
	var colModel = [
	                	{name:'feedbacktitle',        index:'feedbacktitle'       ,   width:100},
						{name:'feedbackdescription',  index:'feedbackdescription' ,   align:"center", width:300},
						{name:'feedbackstatus',	index:'feedbackstatus',	align:"center", width:100, formatter:feedbackDetailsFormatterFunction.status},
						{name:'reportedby',		index:'reportedby',		align:"center", width:100},
						{name:'modifieddate',	index:'modifieddate',	align:"center", width:100},
						{name:'feedbackstatus',	index:'feedbackstatus',	align:"center", width:100, formatter: feedbackDetailsFormatterFunction.action}
						];
	return colModel;
};

var feedbackDetailsFormatterFunction = new Object();

function definefeedbackDetailsFormatterFunction() {
    feedbackDetailsFormatterFunction.status =   function(val,colModel,rowdata){
        var innerhtml;
        switch(val){
            case '1':
                innerhtml   =   'New Reported';
                break;
            case '2':
                innerhtml   =   'Issue Solved';
                break;
            case '3':
                innerhtml   =   'Issue Reopened';
                break;
            case '4':
                innerhtml   =   'Duplicate';
                break;
            case '5':
                innerhtml   =   'Invalid';
                break;
            default:
                break;
        }
        return innerhtml;
    };
    feedbackDetailsFormatterFunction.action =   function(val,colModel,rowdata){
        var innerhtml;
        if(val == '1'){
            innerhtml   =   '';
        }
        return innerhtml;
    };
	feedbackDetailsFormatterFunction.gridComplete	=	function(){
		var Table			=	$(this);
		if(ResizeFeedbackGrid	==	0){
			CommonGridCompleteFunctions(Table);
			ResizeFeedbackGrid++;
		}	
		worksOnAllGridComplete(Table);
    };
}

definefeedbackDetailsFormatterFunction();
