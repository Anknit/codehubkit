<?php 
    if(isset($_POST['layout'])){
        $fileName   =   'untitled';
        if(isset($_POST['templateName'])){
            $fileName   =  $_POST['templateName'];
        }
        $newFile    =   fopen('./../template/new.html', 'w');
        fwrite($newFile, $_POST['layout']);
        fclose($newFile);
        rename('./../template/new.html','./../template/'.$fileName.'.html');
        echo 1;
    }
?>