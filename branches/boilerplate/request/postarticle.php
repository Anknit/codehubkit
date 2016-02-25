<?php
    if(isset($_POST['data'])){
        echo str_word_count($_POST['data']);
    }
    else{
        echo 0;
    }
?>
