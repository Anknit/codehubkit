var USER_GRID_UNIQUE_ID ;
var ciRow,ciCol;


var ResizeTable = function(Table)
{
	var TableHeight		=	Table.height();
	var MaxDivHeight	=	$('#contentPANE').height();
	var MaxDivWidth		=	$('#contentPANE').width();
	var SetHeight		=	MaxDivHeight*$(Table).attr('gridHeight');
	var SetWidth		=	MaxDivWidth*$(Table).attr('gridWidth');
	Table.jqGrid('setGridHeight', SetHeight);
	Table.jqGrid('setGridWidth', SetWidth);
};

var fetchjqGridObject = function(gridObject){
	return {
			/**
			 * If we use datatype as function our code is responsible for calling of 'loadComplete'.
			 * For datatype as function our code is responsible for some things, which jqGrid will do it 
			 * automatically. 
			 */
			datatype: 	function(postdata){
				var ts = gridObject;  // cache 'gridObject' to use later in the complete callback
				var p = gridObject.p; // cache the grid parameters
				jQuery.ajax({
					url:$(gridObject).attr('url'),
					data:postdata,
					contentType: "application/json",
					dataType:"json",
					complete: function(jsondata,stat){
					  if(stat=="success") {
						  	UI_unBlockInterface();
							TotalPages		=	jsondata.responseJSON.total;
							ResponseData	=	jsondata.responseJSON.rows;
							var thegrid 	= jQuery('#'+$(gridObject).attr('id'))[0];
							thegrid.addJSONData(jsondata.responseJSON);
							// call loadComplete
							if($.isFunction(p.loadComplete)) {
								p.loadComplete.call(ts,jsondata.responseJSON);
							}
					  }
				   }
				});
				UI_blockInterface();
			},
			colNames:$(gridObject).attr('colNames').split(','),
			colModel:window[$(gridObject).attr('colModel')](),
			jsonReader : {
				 root: "rows",
				 records: "records",
				 viewrecords: true,
				 repeatitems: true,
				 cell: "",
                 page: function (obj) { return obj.rows.length > 0 ? obj.page : 0; },
				 id: "0"
			},
			idPrefix: $(gridObject).attr('id') + "_",
			rowNum:10,
			rowList:[10,15,30,50],
			gridview: true,
			ignoreCase: true,
			autoencode: true,
			toolbarfilter: true,
			//loadonce: true,	If this is on the total pages in pager wouldn't work well. This will load records at once only
   			emptyrecords: "No records found",
   			autowidth: true,
  			shrinktoFit: true,
  			forceFit: true,
 			pager : '#gridpager_'+$(gridObject).attr('id'),
 			pagerpos:'center',
			recordpos: 'right',
			viewrecords: true,
			pginput : true,
  			sortname: $(gridObject).attr('sortBy'),
			sortorder: 'asc',
			toolbar: getToolbarProp(gridObject),
			cellsubmit: 'remote',
			cellurl:$(gridObject).attr('eurl') ? $(gridObject).attr('eurl') : "",
			cellEdit: $(gridObject).attr('cellSelector') != null,
			grouping: $(gridObject).attr('grouping') != null,
		   	groupingView : {
		   		groupField : getGroupFields(gridObject) ,
		   		groupDataSorted : true,
		   		groupColumnShow : getGroupColumnShow(gridObject),
		   		groupCollapse : false
		   	},
		   	onClickGroup: function(hid) {
		   		/* Fired when group header is toggled */
		   	},
			onSelectRow : function(id) {
				$(gridObject).setSelection(id,false);
				$(gridObject).find('tr').find("input[type='radio']").prop('checked',true);
			},
			formatCell : function(rowid, cellname, value, iRow, iCol) {
				/* You can change the cell value here which will be used in the edit mode */
				return value.replace('<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>'," ")
			},
			beforeEditCell : function(rowid, cellname, value, iRow, iCol) { 
				/*  Just before the cell jumps into edit mode this event is fired */
				var attr = $(gridObject).attr('editable');
				if(typeof attr != typeof undefined && attr !== false) {
					// Clear GridRefreshTimer
					clearGridRefreshTimer(refreshTimerID);
				}
			},
			afterEditCell : function(rowid, cellname, value, iRow, iCol) {
				/* Just after the input element is created this event will be fired */
				ciRow = iRow;
				ciCol = iCol;
			},
			beforeSaveCell : function(rowid, cellname, value, iRow, iCol) {
				/* Fires before the cell is saved, you can save the value here which is send to the server. */
			},
			beforeSubmitCell : function(rowid,cellname,value,iRow,iCol) {
				/*
				 *  Fires before value will be send to the server, you can add extra parameters 
				 *  here to the request by returning an array.
				 */
				var rdata = $(gridObject).getRowData(rowid);
				var i = $(rdata.JobID).val();
				return {jid: i,param: cellname}; // Modify the POST Request 
			},
			afterSaveCell : function(rowid, cellname, value, iRow, iCol) {
				/**
				 *  Fires when the value of the cell is saved
				 */
				var attr = $(gridObject).attr('editable');
				if(typeof attr != typeof undefined && attr !== false) {
					// Reset GridRefreshTimer
					refreshTimerID = setGridRefreshTimer($(gridObject).attr('id'));
				}
				
			},
			gridComplete: window[$(gridObject).attr('gridComplete')].gridComplete,
			loadComplete: function() {
				var gridParams = $(gridObject).jqGrid('getGridParam');
				if(gridParams.scrollTopPosition != undefined) {
					/*
					 * scrollTopPosition is set before grid refresh.
					 * Maintain scroll state of the grid
					 */
					$(gridObject).closest(".ui-jqgrid-bdiv").scrollTop(gridParams.scrollTopPosition);
				}
			}		
			
		};
};

var getToolbarProp	=	function(gridObject){
	var defaultProp	=	[false,'top'];
	if(gridObject.hasAttribute('gridToolbar_Visible'))
		defaultProp	=	[true,gridObject.getAttribute('gridToolbar_Visible')];
	return defaultProp;
};

var customJqgrid = function(gridObject){
	var GridUniqueid	=	$(gridObject).attr('id');
	var ResponseData	=	"";
	var TotalPages;
	var jqgridOBJECT = fetchjqGridObject(gridObject);
	$('#'+GridUniqueid).jqGrid(jqgridOBJECT);
};

var getGroupFields = function(gridObject) {
	if($(gridObject).attr('grouping'))
		return $(gridObject).attr('grouping').split(',');
};

var getGroupColumnShow = function(gridObject) {
	var groupColShowProperties = new Object;
	groupColShowProperties.Name = false;
	groupColShowProperties.PartNumber = false;
	
	var showProp = [];
	if($(gridObject).attr('grouping')) {
		if($(gridObject).attr('grouping').indexOf(',') != -1) {
			for(key in groupColShowProperties) {
				showProp.push(groupColShowProperties[key]);
			}
		}else {
			showProp.push(groupColShowProperties[$(gridObject).attr('grouping')]);
		}
	}else {
		showProp.push(groupColShowProperties.Name);
	}
	return showProp;
};


$(window).on('resize.jqGrid',function(event) {
	var gridList = $('.convertTojqGrid');
	gridList.each(function(){
		$('#'+$(this).attr('id')).jqGrid('setGridWidth', $('body').width() - 50);
	});
});

var RenderJQGrids = function(){ 	
	$('.convertTojqGrid').each(function(){
		customJqgrid($(this)[0]);
	});
};

$(function(){
	RenderJQGrids();
});

