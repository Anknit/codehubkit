<?php
    require_once __DIR__.'/require.php';
?>
<html data-ng-app="gyaneo">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="description" content="Geo">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<meta content="html" lang="en" name="Geo">
        <meta name="google-signin-client_id" content="<?php echo sso_gwt_browser_key;?>"><!--42338840257-9ll1lip2eqc6dg2p00ntl94njnb39d1r.apps.googleusercontent.com-->
        <title ng-bind="pageTitle">Gyaneo</title>
        <link rel="stylesheet" type="text/css" href="css/bootstrap/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="css/common.css" />
    </head>
    <body>
        <style>.ng-cloak{display:none;}</style>
        <header>
            <nav>
                <ul>
                    <li class="header-brand">
                        <a href="./">
                            <strong>Gyaneo</strong>
                        </a>
                    </li>
                    <li>
                        <a href="">
                            How it works
                        </a>
                    </li>
                    <li>
                        <a href="">
                            About
                        </a>
                    </li>
                </ul>
            </nav>
            <nav class="pull-right">
                <ul>
<!--
                	<fb:login-button scope="public_profile,email" onclick="fb_login_onclick();">
					
					</fb:login-button>
-->
                    <li data-ng-controller="siginmodal">
                        <button type="button" class="btn btn-default" ng-click="open('lg')">Sign-in</button>
                    </li>
                    <li>
                        Create Account
                    </li>
                    <li class="hide">
                        My Account
                    </li>
                    <li class="hide">
                        <a href="">
                            Inventory
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
        <div id="main" class="body-container">
            <div class="container-fluid search-header">
                <div class="container">
                    <h3>Search for used books</h3>
                    <div class="col-xs-12 col-md-3">
                        <select class="form-control">
                            <option>Select City</option>
                        </select>
                    </div>
                    <div class="col-xs-12 col-md-3">
                        <select class="form-control">
                            <option>All Category</option>
                        </select>
                    </div>
                    <div class="col-xs-12 col-md-3">
                        <input type="search" class="form-control" placeholder="Title,Author,keyword" />
                    </div>
                    <div class="col-xs-12 col-md-3">
                        <button class="btn btn-primary">Search</button>
                    </div>
                </div>
            </div>
