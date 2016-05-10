/*
* Author: Aditya
* date: 25-June-2015
* JavaScript Document
*
*/
// 
/*
	The method exports the data provided into excel file.
	@param: Heading: semicolon(';') separated string of headings text
	@param: RowData: Array of Each Row data. Row data in turn is similar to Heading, i.e. semicolon(';') separated columns text.
	@param: fileName: If you want to export file with some specific name then this may come in use. default value is 'Export data'
	
	e.g. ['Col1Data;Col2Data;Col3Data', 'Col1Data;Col2Data;Col3Data', 'Col1Data;Col2Data;Col3Data']
*/
exportTableToExcel	=	function(Heading, RowData, filename){
	if(filename == null || filename == undefined || filename.trim() == ''){
		filename = 'Export data';
	}
	var exportString	=	Heading+'%0A';
	for(i=0; i<RowData.length; i++){
	   exportString += RowData[i]+'%0A';
	}
	var a         = document.createElement('a');
	a.href        = 'data:attachment/xls,' + exportString;
	a.target      = '_blank';
	a.download    = filename+'.xls';
	document.body.appendChild(a);
	a.click();
}