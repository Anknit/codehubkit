<?php
    if(isset($_REQUEST['request'])){
        if($_REQUEST['request'] == 'add_product'){
            if(isset($_REQUEST['data'])){
                echo json_encode(array('status'=>true,'data'=>array()));
                exit();
            }
        }
    }
?>