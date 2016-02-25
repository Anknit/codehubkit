<?php
    include_once __DIR__.'/header.html';
    if(isset($_REQUEST['article'])){
        if(is_file(__DIR__.'/blogs/'.$_REQUEST['article'].'.html')){
            include_once __DIR__.'/blogs/'.rawurlencode($_REQUEST['article']).'.html';
            include_once __DIR__.'/scripts.html';
        }
        else{
            include_once __DIR__.'/blogs/404.html';
        }
    }
    elseif(isset($_REQUEST['entry'])){
        include_once __DIR__.'/blogs/entry.html';
    }
    elseif(isset($_REQUEST['template'])){
        include_once __DIR__.'/static/template.html';
    }
    else{
        include_once __DIR__.'/home.html';
    }
    include_once __DIR__.'/footer.html';
?>