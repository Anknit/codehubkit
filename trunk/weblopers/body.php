<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <div class="page-header text-center">
    <?php
        require_once __DIR__.'/server/request.php';
        $pageHeader =   false;
        if(isset($_GET['course'])){
            $pageHeader =   getPageHeader($_GET['course']);
        }
        if($pageHeader){
    ?>
                <h1><?php echo $pageHeader[0];?> <small><?php echo $pageHeader[1]; ?></small></h1>
    <?php            
        }
        else{
    ?>
                <h1>Schoolap <small>Web developer learning ground</small></h1>
    <?php
        }
    ?>
            </div>
        </div>
    </div>
    <div class="col-md-2 col-sm-5 hidden-xs left-panel">
        <div class="row">
    <?php 
        include_once __DIR__.'/template/leftpanel.html';
    ?>
        </div>
    </div>
    <div class="col-md-9 col-sm-7 col-xs-12 home-center">
        <div class="row">
    <?php
        $template   =   false;
        if(isset($_GET['course'])){
            $template   =   getCourseTemplate($_GET['course']);
        }
        if($template){
            include_once __DIR__.'/template/'.$template.'.html';
        }
        else{
            include_once __DIR__.'/template/homecenter.html';
        }
    ?>
        </div>
    </div>
</div>