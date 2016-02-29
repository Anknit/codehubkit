<?php 
    if(isset($_GET['build'])){
        header('location: build/layout/1.html');
    }
    elseif(isset($_GET['tutorials'])){
        require_once __DIR__.'/tutorials.php';
    }
    else{
        require_once __DIR__.'/home.php';
    }
?>
