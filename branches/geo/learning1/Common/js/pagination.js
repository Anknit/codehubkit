/*
Project Name       	: 	Pulsar - Content Verification System
File Or Class Name 	: 	pagination.js
Description			: 	Show pagination on active job list
Copyright          	:	Copyright  2009 - 2014 Venera Technologies.
*/

//=========================================================================================//
//=================== FUNCTION : PAGINATION ON ACTIVE JOB LIST ============================//
//=========================================================================================//
var mypageForDisplay = 1;

function Pager(tableName, itemsPerPage,form, AddFunctionObjectTothePager)
{	 
    this.tableName = tableName;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = 0;
    this.inited = false;
	this.form = form;
	if(AddFunctionObjectTothePager != "" && AddFunctionObjectTothePager != null && AddFunctionObjectTothePager != undefined)
		this.AddFunctionObjectTothePager = AddFunctionObjectTothePager;
		
    this.showRecords = function(from, to) {        
        var rows = document.getElementById(tableName).rows;
           for (var i = 0; i < rows.length; i++) {
            if (i < from-1 || i > to-1)  
                rows[i].style.display = 'none';
            else
                rows[i].style.display = '';
        }
    }
    
    this.showPage = function(pageNumber){
		
		mypageForDisplay = pageNumber;
		if(globalCheckBoxBool==0)
		{
			document.frmname.reset();
		}
		
		if (! this.inited) {
			Alert("Error in pagination");
			return;
		}

        var oldPageAnchor = document.getElementById('pg'+this.currentPage);
        oldPageAnchor.className = 'pg-normal';
        
        this.currentPage = pageNumber;
        var newPageAnchor = document.getElementById('pg'+this.currentPage);
        newPageAnchor.className = 'pg-selected';
        
		//below count the number of rows required on previous page
		if(AddFunctionObjectTothePager != "" && AddFunctionObjectTothePager != null && AddFunctionObjectTothePager != undefined)
		{
			if(pageNumber > 1)
				itemsPerPage = AddFunctionObjectTothePager((pageNumber - 1));
		
			if(pageNumber == 1)
				itemsPerPage = 0;
				
			var from = itemsPerPage + 1;
			var to = from + itemsPerPage - 1;
			itemsPerPage = AddFunctionObjectTothePager(pageNumber);
			to = itemsPerPage;
		}
		else
		{
			var from = (pageNumber - 1) * itemsPerPage + 1;
			var to = from + itemsPerPage - 1;
		}
		
        this.showRecords(from, to);
    }   
    
    this.prev = function() {
        if (this.currentPage > 1)
            this.showPage(this.currentPage - 1);
    }
    
    this.next = function() {
        if (this.currentPage < this.pages) {
            this.showPage(this.currentPage + 1);
        }
    }                        
    
    this.init = function(PagesForPagination) {
        var rows = document.getElementById(tableName).rows;
        var records = (rows.length - 1);
		if(PagesForPagination != "" && PagesForPagination != null && PagesForPagination != undefined && PagesForPagination != 0)
			this.pages = PagesForPagination;
		else	
			this.pages = Math.ceil(records / itemsPerPage);
			
        this.inited = true;
    }

    this.showPageNav = function(pagerName, positionId) {
     if (! this.inited) {
      Alert("Error in pagination");
      return;
     }
     var element = document.getElementById(positionId);
     
     var pagerHtml = '<span onclick="' + pagerName + '.prev();" class="pg-normal">Previous </span> ';
        for (var page = 1; page <= this.pages; page++) 
            pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span>  ';
        pagerHtml += '<span onclick="'+pagerName+'.next();" class="pg-normal"> Next </span>';            
        
        element.innerHTML = pagerHtml;
    }
}