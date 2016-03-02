$(function(){
    if(typeof(quickTopic) != "undefined"){
        $('[data-link="'+quickTopic+'"]').addClass('active');
    }
    else{
        $('[data-link]').eq(0).addClass('active');
    }
})