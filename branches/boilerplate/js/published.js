window.onload   =   function(){
    var editableItems   =   $('[contenteditable="true"]').each(function(){$(this).attr('contenteditable',false);});
    $('.edit-only').each(function(){$(this).remove();});
}