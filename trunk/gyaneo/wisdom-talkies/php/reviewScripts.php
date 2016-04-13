<?php
    require_once __DIR__.'/commonScripts.php';
?>
<script type="text/javascript" src="https://www.youtube.com/iframe_api" async defer></script>
<script type="text/javascript" src="https://apis.google.com/js/platform.js" async defer></script>
<script type="text/javascript" src="./<?php echo projectJSFolderName; ?>/reviewinit.js?ver=<?php echo version; ?>"></script>
<?php
    if(DEVELOPMENT){
        require_once __DIR__.'./../installer/scriptConfig.php';
        if(isset($scriptArr['review']['source'])){
            for($script = 0; $script< count($scriptArr['review']['source']); $script++){
                ?>
                <script type="text/javascript" src="./<?php echo $scriptArr['review']['source'][$script].'?ver='.version; ?>"></script>
<?php
            }
        }
?>
<?php
    }
    else{
?>
<script type="text/javascript" src="./<?php echo projectJSFolderName; ?>/reviewScript.min.js?ver=<?php echo version; ?>"></script>
<?php
    }
?>