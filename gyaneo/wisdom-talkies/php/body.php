<?php
?>
<!--[if gte IE 9]>
  <style type="text/css">
    #top-banner {
       filter: none;
    }
  </style>
<![endif]-->
<div id="main" class="container-fluid">
    <div id="routeView" data-ng-view></div>
    <?php 
//        require_once __DIR__.'/body-side.php';
    ?>
</div>
<script>
    progressChange(30);
</script>
