<?php 
    if(isset($_GET['build'])){
        header('location: build/layout/1.html');
    }
    else{
        require_once __DIR__.'/home.php';
    }
?>
