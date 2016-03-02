<?php 
    require_once __DIR__.'/header.php';
?>
    <div class="row">
        <div class="col-md-2 section">
<?php
    require_once __DIR__.'/tutorials/'.$_GET['tutorials'].'/quick_links.html';
?>
        </div>
        <div class="col-md-8 section article-section">
<?php
    if(isset($_GET['article'])){
        require_once __DIR__.'/tutorials/'.$_GET['tutorials'].'/'.$_GET['article'].'.html';
?>
        <script> var quickTopic = '<?php echo $_GET['article']; ?>' </script>
<?php
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