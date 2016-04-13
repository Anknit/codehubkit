<?php
?>
<!DOCTYPE html5>
<html>
<head>
	<script type="application/ld+json">{
		"@context": "http://schema.org",
		"@type": "Organization",
		"name" : "WisdomTalkies",
   	    "url": "https://wisdomtalkies.com",
		"sameAs" : [
    		"http://www.facebook.com/your-profile"
  		]
    	"logo": "https://wisdomtalkies.com/image/favicon.jpeg"
	}
	</script>
	<script type="application/ld+json">{
		"@context": "http://schema.org",
  		"@type": "WebSite",
  		"url": "https://wisdomtalkies.com/",
		"potentialAction": {
			"@type": "SearchAction",
			"target": "https://wisdomtalkies.com/wisdom-talkies/php/appdata.php?request=search_data&data[getData]=list&data[search]={search_term_string}&data[server]=opensearch",
			"query-input": "required name=search_term_string"
		}
	}
	</script>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="/wt_release/">
    <title>WisdomTalkies</title>
    <meta name='robots' content='noindex,follow' />
<?php
	if(isset($_SERVER['REDIRECT_URL']) && strpos($_SERVER['REDIRECT_URL'],'view/')){
  		if(strpos($_SERVER['REDIRECT_URL'],'&videoId=')){
   			$videoid		=   explode('&',explode('&videoId=',$_SERVER['REDIRECT_URL'])[1])[0];
        	$sourcevideoid 	=   explode('&',explode('&sourcevidid=',$_SERVER['REDIRECT_URL'])[1])[0];
        	if(strpos($videoid,'yt-') === 0){
	        	$metaInfoUrl		=	"https://www.googleapis.com/youtube/v3/videos?key=".sso_gc_server_key."&id=".$sourcevideoid;
	            $videoYtMetadata	=	json_decode(file_get_contents($metaInfoUrl."&part=snippet%2CcontentDetails%2Cstatistics"),true);
	            $videoMetaData  	=   array();
	            $videoMetaData[0]   =   array(
	            		'tnurl'=>$videoYtMetadata['items'][0]['snippet']['thumbnails']['high']['url'],
	            		'string'=>$videoYtMetadata['items'][0]['snippet']['title'],
	            		'description'=>$videoYtMetadata['items'][0]['snippet']['description'],
	            		'keywords'=>implode(",",$videoYtMetadata['items'][0]['snippet']['tags'])
	            );
         	}
         	else{
	         	$videoMetaData				=   DB_Query('Select tnurl,`string`,description,keywords from contentinfo where id ='.$videoid,'ASSOC','');
	            $videoMetaData[0]['tnurl']  =   str_replace('default','hqdefault',$videoMetaData[0]['tnurl']);
         	}
?>
	<meta name="description" content="<?php echo htmlspecialchars($videoMetaData[0]['description']) ?>">
	<meta name="keywords" content="<?php echo htmlspecialchars($videoMetaData[0]['keywords']) ?>">
	<meta name="title" content="<?php echo htmlspecialchars($videoMetaData[0]['string']) ?>">
	 
	<meta property="og:image"              content="<?php echo $videoMetaData[0]['tnurl'] ?>" />
    <meta property="og:url"                content="<?php echo getHttpRoot().$_SERVER['REDIRECT_URL'] ?>" />
	<meta property="og:type"               content="website" />
	<meta property="og:title"              content="<?php echo htmlspecialchars($videoMetaData[0]['string']) ?>" />
	<meta property="og:description"        content="<?php echo htmlspecialchars($videoMetaData[0]['description']) ?>" />
	<meta property="og:image:secure_url"   content="<?php echo htmlspecialchars($videoMetaData[0]['tnurl']) ?>" />
    <?php
        }
    }
    else{
    	?>
    <meta name="description"	content="<?php echo description_of_wisdomtalkies;?>">
	<meta name="keywords"		content="<?php echo title_of_wisdomtalkies;?>">
	<meta name="title"			content="<?php echo keywords_of_wisdomtalkies;?>">
    	<?php 
    }
?>    
    
    <link rel="icon" href="./<?php echo projectFolderName; ?>/image/favicon.ico?ver=<?php echo version; ?>" type="image/ico" >
<?php 
    if(isset($_REQUEST['request']) && $_REQUEST['request'] == 'review'){
?>
    <link rel="stylesheet" href='<?php echo getHttpRoot().'Common/css/ui.jqgrid.css?ver='.version ?>'  rel="stylesheet"/>
    <link rel="stylesheet" href='<?php echo getHttpRoot().'Common/css/jqueryUI/themes/jquery-ui.css?ver='.version ?>'  rel="stylesheet"/>
<?php
    }
?>    
<!--
    <link href="https://fonts.googleapis.com/css?family=Roboto:regular,italic,bold" rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Raleway:regular,italic,bold" rel='stylesheet' type='text/css'>
-->
    <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' rel="stylesheet">
    <link href='./<?php echo projectCSSFolderName; ?>/main.css?ver=<?php echo version; ?>' rel="stylesheet">
    <script src="./<?php echo projectJSFolderName; ?>/progress.js?ver=<?php echo version; ?>" ></script>
    <script type="text/javascript"> var file_version= <?php echo version; ?>;</script>
</head>
<body data-ng-app="wt">
	<?php if(!DEVELOPMENT){?>
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', 'UA-75257514-1', 'auto');
			ga('send', 'pageview');
		</script>
	<?php }?>
	<div id="block_ui_overlay">
		<div>
			<div class="whirly-loader">Loading...</div>
			<span>Please wait ...</span>
		</div>
	</div>
	<header data-ng-controller="headerController as headCtrl">
		<div id="progressArea">
			<div id="progressBar"></div>
		</div>
		<div id="head">
			<div class="row">
				<div id="smallScreenMenu" class="visible-xs smallScreenComponent" data-ng-click="toggleSmallScreenControls('menu',true)">
					<span class="glyphicon glyphicon-menu-hamburger"></span>
				</div>
				<div id="smallScreenSearch" class="visible-xs smallScreenComponent" data-ng-click="toggleSmallScreenControls('search',true)">
					<span class="glyphicon glyphicon-search"></span>
				</div>
				<div id="headlogo" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 text-center">
					<a id="logo" href='./'>
                        <img id="brandLogo" src="./<?php echo projectFolderName; ?>/image/wisdomtalkies.png?ver=<?php echo version; ?>" alt="Wisdomtalkies"/>
					</a>
				</div>
				<?php 
					if($_REQUEST['request'] == 'home'){
				?>
				<div id="headcategory" class="col-lg-1 col-md-2 col-sm-2 col-xs-6 hidden-xs">
					<div class="visible-xs closeSearchSmallScreen" data-ng-click="toggleSmallScreenControls('',false)">
						<span class="glyphicon glyphicon-remove-sign"></span>
					</div>
					<div id="categorydropdown" data-label="Go to"></div>
				</div>
				<?php 
					}
					else{
				?>
				<div class="col-lg-1 col-xs-6">
				</div>
				<?php 
					}
				?>
				<div id="headbutton" class="col-sm-3 col-sm-push-7 col-lg-3 col-md-3 col-md-push-5 col-lg-push-6 col-xs-6 hidden-xs">
				<?php 
					if($_REQUEST['request'] == 'home'	&&	isset($Module['curation'])	&&	$Module['curation']	==	true){
				?>
					<div class="headButtonContainer pull-left btn btn-info" id="headContributeButton" data-ng-click="gotoCuration()">
						<span class="glyphicon glyphicon-share" aria-hidden="true"></span>Curate
					</div>
				<?php 
					}
					else if($_REQUEST['request'] == 'curate'	&&	isset($Module['curation'])	&&	$Module['curation']	==	true){
				?>
					<div class="headButtonContainer pull-left" id="headHomeButton" data-ng-click="gotoHome()">
						<span class="glyphicon glyphicon-home" aria-hidden="true"></span>Home
					</div>
				<?php 
					}
				?>
				<?php 
					if(is_login) {
						$session_data	=	session_manager_get(array('username', 'user_login_source','usertype'));
						$Name_array	=	explode(' ', $session_data['data']['username']); 
				?>
                    <div class="dropdown pull-right">
                        <button class="btn btn-link dropdown-toggle" id="dropdown2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="<?php echo htmlentities($session_data['data']['username']);?>">
                            <div id="userNameArea"><?php echo 'Hi, '.$Name_array[0];?></div>
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <li>
                                <a>
                                    <div class="text-primary">Welcome&nbsp;
                                        <span class="user_name"><?php echo htmlentities($session_data['data']['username']);?></span>
                                    </div>
                                </a>
                            </li>
                            <li role="separator" class="divider"></li>
                        <?php 
                            if($_REQUEST['request'] == 'home'){
                        ?>
                            <li>
                                <a href="profile">My Profile</a>
                            </li>
                            <li>
                                <a href="bookmark/all">My Bookmarks</a>
                            </li>
                        <?php
                            if($Module['curation']){
                        ?>
                            <li>
                                <a href="curations">My Curations</a>
                            </li>
                        <?php
                                }
                            }
                        ?>
                            <li>
                                <a href="#" data-ng-click="logoutUser()" >
                                    Sign out
                                </a>
                            </li>
                        </ul>
                    </div>

				<?php 	
				}else{
				?>
					<div class="headButtonContainer pull-right" id="headLoginButton" >
						<span class="glyphicon glyphicon-lock" ></span>Sign in
					</div>
				<?php 	
				}
				?>
				</div>
				<div id="headsearch" class="col-lg-6 col-md-5 col-md-pull-3 col-sm-7 col-sm-pull-3 col-lg-pull-3 hidden-xs">
                    <?php
                        if($_REQUEST['request'] != 'review' && $_REQUEST['request'] != 'feedback'){
                    ?> 
					<div class="visible-xs closeSearchSmallScreen" data-ng-click="toggleSmallScreenControls('',false)">
						<span class="glyphicon glyphicon-remove-sign"></span>
					</div>
                    <input type="text" data-ng-keyup="getKeywordMatch($event)" class="form-control" data-ng-model="searchInputText" placeholder="Search keywords..." id="headsearchinput" list="searchData">
                    <?php
                        }
                    ?>
				<?php 
					if($_REQUEST['request'] == 'home'){
				?>
                    <div id="learn-filter" class="checkbox">
                        <label>
                            <input type="checkbox" checked="checked" id="learnFilterCheck" data-ng-init="is_learn_selected = true" data-ng-model="is_learn_selected" />Learning Videos
                        </label>
                    </div>
				<?php 
                    }
				?>
				</div>
			</div>
		</div>
		<div id="moto" class="container-fluid">
			<div id="top-banner">
                <div id="banner-slide" class="carousel slide" data-ride="carousel">
<!--
                    <ol class="carousel-indicators">
                        <li data-target="#banner-slide" data-slide-to="0" class="active"></li>
                        <li data-target="#banner-slide" data-slide-to="1"></li>
                        <li data-target="#banner-slide" data-slide-to="2"></li>
                    </ol>
-->
                    <div class="carousel-inner" role="listbox">
                        <div class="item active" id="carousel-item-1">
                            <div class="middle-box">
                                <div class="carousel-item-text">
                                    <div class="carousel-message">
                                        <strong>Bookmark</strong> interesting parts of your wisdom videos
                                    <button class="btn btn-lg btn-info about-link" data-ng-click="gotoabout()">Read More</button>
                                    </div>
                                </div>
                            </div>
                            <div style="display:table-cell">&nbsp;</div>
                        </div>
                        <div class="item" id="carousel-item-2">
                            <div class="middle-box">
                                <div class="carousel-item-text">
                                    <div class="carousel-message">
                                        Sharing begins with your <strong>Recommendations</strong>
                                    <button class="btn btn-lg btn-info about-link" data-ng-click="gotoabout()">Read More</button>
                                    </div>
                                </div>
                            </div>
                            <div style="display:table-cell">&nbsp;</div>
                        </div>
                        <div class="item" id="carousel-item-3">
                            <div class="middle-box">
                                <div class="carousel-item-text">
                                    <div class="carousel-message">
                                        <strong>Preserve</strong> and <strong>Share</strong> the Collective wisdom
                                    <button class="btn btn-lg btn-info about-link" data-ng-click="gotoabout()">Read More</button>
                                    </div>
                                </div>
                            </div>
                            <div style="display:table-cell">&nbsp;</div>
                        </div>
                    </div>
                    <a class="left carousel-control" data-target="#banner-slide" role="button" data-slide="prev">
                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="right carousel-control" data-target="#banner-slide" role="button" data-slide="next">
                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
			</div>
        </div>
        <div id="navPathArea" class="col-md-12">
            <div class="row">
            <?php
                if($_REQUEST['request'] != 'review' && $_REQUEST['request'] != 'feedback'){
            ?> 
            <ol class="breadcrumb" id="topBreadCrumbNav">
                <li data-ng-repeat="value in BreadCrumbs" data-ng-class="{'active': !$first && $last}" >
                    <a data-ng-href="{{value.link}}" data-ng-if="!$last || ($first && $last)">{{value.name}}</a>
                    <span data-ng-href="{{value.link}}" data-ng-if="$last && (!($first && $last))">{{value.name}}</span>
                </li>
            </ol>
            <?php
                        }
            ?>
    <?php 
        if(is_login) {
            ?>
            <div class="text-primary btn" data-title="Provide your valuable feedback" data-toggle="tooltip" data-placement="left" id="feedback-control" data-ng-click="showFeedbackModal()">Feedback</div>
            <?php }?>
            </div>
        </div>

	</header>
	<script>
		progressChange(10);
	</script>