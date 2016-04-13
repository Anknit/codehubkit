<?php
    require_once __DIR__.'/commonScripts.php';
?>
<script type="text/javascript" src="https://www.youtube.com/iframe_api" async defer></script>
<script type="text/javascript" src="https://apis.google.com/js/platform.js" async defer></script>
<script type="text/javascript" src="./<?php echo projectJSFolderName; ?>/reviewinit.js?ver=<?php echo version; ?>"></script>
<?php
    if(DEVELOPMENT){
        require_once __DIR__.'./../installer/scriptConfig.php';
        if(isset($scriptArr['feedback']['source'])){
            for($script = 0; $script< count($scriptArr['feedback']['source']); $script++){
                ?>
                <script type="text/javascript" src="./<?php echo $scriptArr['feedback']['source'][$script].'?ver='.version; ?>"></script>
<?php
            }
        }
?>
<?php
    }
    else{
?>
<script type="text/javascript" src="./<?php echo projectJSFolderName; ?>/feedbackScript.min.js?ver=<?php echo version; ?>"></script>
<?php
    }
?>
<script>
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=1648955058690150";
        fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
</script>