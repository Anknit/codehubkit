<?php
?>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-route.min.js"></script>
<script type="text/javascript" src="https://brandly.github.io/angular-youtube-embed/angular-youtube-embed.js"></script>
<script>
    window.onload =   function(){
        if (typeof jQuery == 'undefined') {
            document.write(unescape("%3Cscript src='./Common/js/jquery.js' type='text/javascript'%3E%3C/script%3E"));
        }
        if(typeof(window.angular) == "undefined"){
            document.write(unescape("%3Cscript src='./Common/js/angular/angular.min.js' type='text/javascript'%3E%3C/script%3E"));
        }
        if(typeof(window.angular.module('ngRoute')) == "undefined"){
            document.write(unescape("%3Cscript src='./Common/js/angular/angular-route.min.js' type='text/javascript'%3E%3C/script%3E"));
        }
        if(typeof(window.angular.module('youtube-embed')) == "undefined"){
            document.write(unescape("%3Cscript src='./wisdom-talkies/js/angular-youtube-embed.js' type='text/javascript'%3E%3C/script%3E"));
        }
        if(typeof($.fn.modal) == "undefined"){
            document.write(unescape("%3Cscript src='./Common/js/bootstrap/bootstrap.min.js' type='text/javascript'%3E%3C/script%3E"));
        }
    };
</script>
