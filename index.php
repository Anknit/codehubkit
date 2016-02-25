<?php
    include_once __DIR__.'/header.html';
    if(isset($_REQUEST['article'])){
        include_once __DIR__.'/blogs/'.$_REQUEST['article'].'.html';
    }
    elseif(isset($_REQUEST['entry'])){
        include_once __DIR__.'/blogs/entry.html';
    }
    else{
        include_once __DIR__.'/home.html';
    }
    include_once __DIR__.'/footer.html';
?>