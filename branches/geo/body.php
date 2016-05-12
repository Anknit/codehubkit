<?php
if(isset($_GET['mode']) && $_GET['mode'] == 'inventory'){
    if(isset($_GET['opt'])){
        if($_GET['opt'] == 'add'){
            require_once __DIR__.'/template/inventoryAdd.html';
        }
        elseif($_GET['opt'] == 'edit'){
            require_once __DIR__.'/template/inventoryEdit.html';
        }
        elseif($_GET['opt'] == 'del'){
            require_once __DIR__.'/template/inventoryDelete.html';
        }
    }
    else{
        require_once __DIR__.'/template/inventoryHome.html';
    }
}
else{
    require_once __DIR__.'/template/home.html';
}
?>