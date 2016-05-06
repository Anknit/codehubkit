/*
Project Name       	: 	Pulsar - Content Verification System
File Or Class Name 	: 	GridRelated.js
Description			: 	Grid related common functions
Copyright          	:	Copyright  2009 - 2014 Venera Technologies.
*/

function CreateObj_to_set_GridHeadersProperties(HeaderNamesToModifyProp, GridID, type)
{
	if(type	==	'left')
	{
		var TopLevelArray	=	new Array(), SubElementsArray	=	new Array();
		for(var i = 0; i< HeaderNamesToModifyProp.length; i++)	//Make Array1 of arrays2 where in each element of arrays2 there will be array of selector, [PropertyNames], [Propertyvalues]
		{
			var	ArrayForPropertiesNames	=	new Array(), ArrayForPropertiesValues	=	new Array();
			ArrayForPropertiesNames[0]	=	'padding-left';
			ArrayForPropertiesValues[0]	=	'5px';
			
			TopLevelArray[i]	=	['#jqgh_'+GridID+'_'+HeaderNamesToModifyProp[i], ArrayForPropertiesNames, ArrayForPropertiesValues];
		}
		return TopLevelArray;
	}
	else
	{
		var TopLevelArray	=	new Array(), SubElementsArray	=	new Array();
		for(var i = 0; i< HeaderNamesToModifyProp.length; i++)	//Make Array1 of arrays2 where in each element of arrays2 there will be array of selector, [PropertyNames], [Propertyvalues]
		{
			var	ArrayForPropertiesNames	=	new Array(), ArrayForPropertiesValues	=	new Array();
			ArrayForPropertiesNames[0]	=	'text-align';
			ArrayForPropertiesValues[0]	=	'center';
			
			TopLevelArray[i]	=	['#jqgh_'+GridID+'_'+HeaderNamesToModifyProp[i], ArrayForPropertiesNames, ArrayForPropertiesValues];
		}
		return TopLevelArray;
	}
}

function ModifyGridHeaderProperties(Table)
{
	//For center cols
	var HeaderNamesToModifyProp	=	FindCenteredColsName(Table);
	var ObjectsArray	=	CreateObj_to_set_GridHeadersProperties(HeaderNamesToModifyProp, Table.attr('id'), 'center');
	SetHeaderProperties(ObjectsArray);
	
	//for left cols
	var HeaderNamesToModifyProp	=	FindLeftColsName(Table);
	var ObjectsArray	=	CreateObj_to_set_GridHeadersProperties(HeaderNamesToModifyProp, Table.attr('id'), 'left');
	SetHeaderProperties(ObjectsArray);
}

function FindLeftColsName(Table)	//Get columns which are left aligned
{
	var ArrayElementsLeft	=		$.grep(Table.jqGrid('getGridParam').colModel, function( Elem, index ) {
		return LeftAlignedCols	=	(Elem.align	==	'left');
	});
	
	var ArrayColnames	=	new Array();
	for(var i = 0; i< ArrayElementsLeft.length; i++)
	{
		ArrayColnames.push(ArrayElementsLeft[i].name);
	}
	
	return ArrayColnames;
}

function FindCenteredColsName(Table)	//Get columns which are center aligned
{
	var ArrayElementsCenter	=		$.grep(Table.jqGrid('getGridParam').colModel, function( Elem, index ) {
		return CenterAlignedCols	=	(Elem.align	==	'center');
	});
	
	var ArrayColnames	=	new Array();
	for(var i = 0; i< ArrayElementsCenter.length; i++)
	{
		ArrayColnames.push(ArrayElementsCenter[i].name);
	}
	
	return ArrayColnames;
}

function getJqGridRowData(RowObj){
    var jqTableOB            =    RowObj.closest('table');
    var RowDataArray    =    jqTableOB.jqGrid('getRowData');
    var RowID                 =    RowObj.attr('id');
    return RowDataArray[parseInt(RowID) - 1];
}

function RefreshGrid(gridID){
	$('#'+gridID).trigger('reloadGrid');
}