var updateimage =   function(element){
    var image   =   element.parentNode.children[0];
    image.src   =   element.parentNode.children[1].textContent;
};

var postArticle =   function(){
    var xmlHttp	=	createBrowserObject();
    var postcontentContainer =   document.getElementsByClassName('blog-title')[0];
    xmlHttp.onreadystatechange	=	function(){
        if(xmlHttp.readyState	==	4 && xmlHttp.status	==	200)
        alert(xmlHttp.responseText);
    }; 
	xmlHttp.open("POST","./request/postarticle.php",true);
	xmlHttp.send(JSON.stringify({data:'hi'})); 
//	xmlHttp.send(JSON.stringify({data:encodeURIComponent(postcontentContainer.outerHTML)})); 

};
function createBrowserObject()
{
	if(xmlHttp)
		delete xmlHttp;
		
	var xmlHttp;
	try
	{
		xmlHttp=new XMLHttpRequest();	// Firefox, Opera 8.0+, Safari		
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); // Internet Explorer 					
		} 
		catch (e)
		{ 
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{ 
				Alert(JavascriptNotWorking); 
			}
		}
	}
	 
	return xmlHttp;
}
