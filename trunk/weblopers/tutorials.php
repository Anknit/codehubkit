<?php 
    require_once __DIR__.'/header.php';
    if(isset($_GET['article'])){
        require_once __DIR__.'/tutorials/'.$_GET['tutorials'].'/'.$_GET['article'].'.html';
    }
    else{
        require_once __DIR__.'/tutorials/'.$_GET['tutorials'].'/intro.html';
    }
    require_once __DIR__.'/footer.php';
?>