<?php 
    require_once __DIR__.'/header.php';
?>
    <div class="row">
        <div class="col-md-2 section">
<?php
    require_once __DIR__.'/tutorials/'.$_GET['tutorials'].'/quick_links.html';
?>
        </div>
        <div class="col-md-8 section">
<?php
    if(isset($_GET['article'])){
        require_once __DIR__.'/tutorials/'.$_GET['tutorials'].'/'.$_GET['article'].'.html';
    }
    else{
        require_once __DIR__.'/tutorials/'.$_GET['tutorials'].'/intro.html';
    }
?>
        </div>
        <div class="col-md-2 section">
        
        </div>
    </div>
<?php
    require_once __DIR__.'/footer.php';
?>