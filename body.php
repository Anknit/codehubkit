<?php
if(isset($_GET['mode']) && $_GET['mode'] == 'inventory'){
    if(isset($_GET['opt'])){
        if($_GET['opt'] == 'add'){
            require_once __DIR__.'/template/inventoryAdd.html';
        }
        if($_GET['opt'] == 'add'){
            
        }
        if($_GET['opt'] == 'add'){
            
        }
    }
    else{
        require_once __DIR__.'/template/inventoryHome.html';
    }
}
else{
    require_once __DIR__.'/template/inventoryHome.html';
}
?>