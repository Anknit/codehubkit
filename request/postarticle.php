<?php
    if(isset($_POST['data'])){
        $fileName   =   'untitled';
        if(isset($_POST['articleName'])){
            $fileName   =  $_POST['articleName'];
        }
        $newFile    =   fopen('./../blogs/new.html', 'w');
        fwrite($newFile, $_POST['data']);
        fclose($newFile);
        rename('./../blogs/new.html','./../blogs/'.$fileName.'.html');
        echo 1;
    }
    else{
        echo 0;
    }
?>
