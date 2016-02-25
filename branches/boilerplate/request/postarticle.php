<?php
    file_put_contents('/home/ankit/Desktop/work/test.txt', json_encode($_REQUEST));
    if(isset($_POST['data'])){
        echo str_word_count($_POST['data']);
    }
    else{
        echo 15;
    }
?>
