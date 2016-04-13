<?php
    require_once __DIR__.'/scriptConfig.php';
    require_once __DIR__.'./../../Common/php/commonfunctions.php';
    require_once __DIR__.'/minify/src/Minify.php';
    require_once __DIR__.'/minify/src/CSS.php';
    require_once __DIR__.'/minify/src/JS.php';
    require_once __DIR__.'/minify/src/Exception.php';
    require_once __DIR__.'/path-converter/src/Converter.php';
    $httppath   =   getHttpRoot();
    $setupPath  =   getSetupRoot();
    use MatthiasMullie\Minify;
    foreach($scriptArr as $appPage => $filesArr){
        $allFilesContent    =   '';
        file_put_contents($setupPath.$filesArr['output'],$allFilesContent);
        for($file=0;$file< count($filesArr['source']);$file++){
            $allFilesContent    =  file_get_contents($httppath.$filesArr['source'][$file]);
            file_put_contents($setupPath.$filesArr['output'],$allFilesContent, FILE_APPEND);
        }
        $minifier = new Minify\JS($setupPath.$filesArr['output']);
        $minifier->minify($setupPath.$filesArr['output-min']);
    }
    

?>