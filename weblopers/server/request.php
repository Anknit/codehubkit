<?php
    function getCourseTemplate($course){
        $template   =   false;
        switch($course){
            case 'html':
                $template   =   'courseHtmlMain';
                break;
            case 'css':
                $template   =   'courseCssMain';
                break;
            case 'js':
                $template   =   'courseJsMain';
                break;
            case 'php':
                $template   =   'coursePhpMain';
                break;
            case 'jquery':
                $template   =   'courseJqueryMain';
                break;
            case 'bs':
                $template   =   'courseBsMain';
                break;
            default:
                $template   =   false;
                break;
        }
        return $template;
    }
    function getPageHeader($course){
        $template   =   false;
        switch($course){
            case 'html':
                $template   =   array('HTML','Structuring a web page');
                break;
            case 'css':
                $template   =   array('CSS','Styling a web page');
                break;
            case 'js':
                $template   =   array('JavaScript','Client Side Scripting');
                break;
            case 'php':
                $template   =   array('Php','Server Side Scripting');
                break;
            case 'jquery':
                $template   =   array('jQuery','Javascript Library');
                break;
            case 'bs':
                $template   =   array('Bootstrap','Mobile first responsive framework');
                break;
            default:
                $template   =   false;
                break;
        }
        return $template;
        
    }
?>