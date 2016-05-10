
var fetchDataFieldsAndTitles	=	function(object){
	var datafields 	=  	new Array();
	var columns		=	new Array();
	var colTitles 	=	$(object).attr('datafields').split(',');
	var colArray 	=	colTitles;
	if(!IsValueNull($(object).attr('colTitles'))) {
	    colTitles = $(object).attr('colTitles').split(',');
	}
	
	if(colArray.length != colTitles.length){
		ErrorLog('Number of column data fields is not equal to number of column titles for '+object.id);
		return false;
	}
	
	for(i=0;i<colArray.length;i++) {
		
		var datafieldsEntry = new Object();
		var columnsEntry	= new Object();
		
		datafieldsEntry.name = colArray[i];
		datafields.push(datafieldsEntry);

		columnsEntry.text 			= colTitles[i];
		columnsEntry.dataField		= colArray[i];
		if(!IsValueNull($(object).attr('cellrenderer')))
			columnsEntry.cellsrenderer	= window[$(object).attr('cellrenderer')];
		if(i != colArray.length - 1)
			columnsEntry.width = '10%';
		columns.push(columnsEntry);
		
	}
	
	if(!IsValueNull($(object).attr('datatype'))){
		var datafieldtypes = $(object).attr('datatype').split(',');
		for(j=0;j<datafieldtypes.length;j++){
			var type	=	datafieldtypes[j].split('=');
			datafields[type[0]-1].type = type[1];
		}
	}
	object.columns		=	columns;
	object.datafields	=	datafields;
	return true;
};

var generateSource				=	function(object){
	var source = {
	        datatype: "json",
	        datafields: object.datafields,
	        id: 'id',
	        url: $(object).attr('url'),
	        root: 'data',
	        pagesize: 15,
	        addrow: function (rowid, rowdata, position, commit) {
	            // synchronize with the server - send insert command
	            // call commit with parameter true if the synchronization with the server is successful 
	            //and with parameter false if the synchronization failed.
	            // you can pass additional argument to the commit callback which represents the new ID if it is generated from a DB.
	            commit(true);
	        },
	        deleterow: function (rowid, commit) {
	            // synchronize with the server - send delete command
	            // call commit with parameter true if the synchronization with the server is successful 
	            //and with parameter false if the synchronization failed.
	            commit(true);
	        },
	        updaterow: function (rowid, newdata, commit) {
	            // synchronize with the server - send update command
	            // call commit with parameter true if the synchronization with the server is successful 
	            // and with parameter false if the synchronization failed.
	            commit(true);
	        }
	    };
	
	var dataAdapter 			=	new $.jqx.dataAdapter(source);
	return dataAdapter;
};

var createNewGrid = function(jqxgridobject){
	var datafieldsAndColumns 	=	fetchDataFieldsAndTitles(jqxgridobject);
	if(!datafieldsAndColumns)
		return false;
    var dataAdapter 			=	generateSource(jqxgridobject);
//    var dataAdapter 			=	new $.jqx.dataAdapter(jqxGridsource);

	$(jqxgridobject).on('bindingcomplete', function () {
	//    alert("Binding Completed");
	}); 
    var toolBarShow			= false;
    if(!IsValueNull($(jqxgridobject).attr('toolbar')))
    	toolBarShow			= true;
	var jqxGridCallObject	=	{
	        width: $(jqxgridobject).attr('width'),
	        height: $(jqxgridobject).attr('height'),
	        source: dataAdapter,
	        columnsresize: true,
	        pagesizeoptions:['10', '15', '50', '100'],
	        pageable: true,
	        sortable: true,
	        filterable: false,
	        pagermode: 'default',
	        showtoolbar: toolBarShow,
	        columns: jqxgridobject.columns
	    };
	
	
	if(toolBarShow){
		jqxGridCallObject.rendertoolbar = window[$(jqxgridobject).attr('toolbar')];
	}
	
    $(jqxgridobject).jqxGrid(jqxGridCallObject);
    if(!IsValueNull($(jqxgridobject).attr('popupWindow'))){
    	$($(jqxgridobject).attr('popupWindow')).jqxWindow({
    		width:350, resizable: false,  isModal: true, autoOpen: false, cancelButton: $("#Cancel"), modalOpacity: 0.01           
    	});
    }
   // update the edited row when the user clicks the 'Save' button.

}
var RenderGrids	=	function(){
	$('.createGrid').each(function(){
		createNewGrid($(this)[0]);
	});
};

$(document).ready(function () {
	RenderGrids();
});

