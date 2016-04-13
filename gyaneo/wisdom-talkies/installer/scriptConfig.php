<?php
require_once __DIR__.'./../wt_config.php';
$scriptArr  =   array('home' => array(),'curate' => array(),'sso_signup_page'=> array(),'sso_reset_page' => array(), 'feedback' => array(),'review' => array());

/* MAIN SITE SCRIPTS*/
$scriptArr['home']['source']  =   array(
    projectJSFolderName.'/contentTopicClass.js',
    projectJSFolderName.'/historyModule.js',
    projectJSFolderName.'/searchModule.js',
    projectJSFolderName.'/listModule.js',
    projectJSFolderName.'/viewModule.js',
    projectJSFolderName.'/user.js',
    projectJSFolderName.'/appVars.js',
    projectJSFolderName.'/appClass.js',
    projectJSFolderName.'/appInit.js',
    projectJSFolderName.'/UImethods.js',
    projectJSFolderName.'/common.js',
    projectJSFolderName.'/remoteCallApp.js',
    projectJSFolderName.'/controller/homeController.js',
    projectJSFolderName.'/controller/headerController.js',
    projectJSFolderName.'/controller/searchController.js',
    projectJSFolderName.'/controller/viewController.js',
    projectJSFolderName.'/controller/footerController.js',
    projectJSFolderName.'/controller/profileController.js',
    projectJSFolderName.'/controller/bookmarkController.js',
    projectJSFolderName.'/controller/myCurationController.js',
    projectJSFolderName.'/bookmarkClass.js',
    projectJSFolderName.'/videoPlayerClass.js',
    commonJSFolderName.'/sso/sso.js',
    projectJSFolderName.'/signIn.js'
);
$scriptArr['home']['output']    =   projectJSFolderName.'/homeScript.js';
$scriptArr['home']['output-min']    =   projectJSFolderName.'/homeScript.min.js';

/* CURATION SCRIPTS */
$scriptArr['curate']['source']  =   array(
    projectJSFolderName.'/contentTopicClass.js',
    projectJSFolderName.'/historyModule.js',
    projectJSFolderName.'/searchModule.js',
    projectJSFolderName.'/listModule.js',
    projectJSFolderName.'/viewModule.js',
    projectJSFolderName.'/user.js',
    projectJSFolderName.'/appVars.js',
    projectJSFolderName.'/appClass.js',
    projectJSFolderName.'/appInit.js',
    projectJSFolderName.'/UImethods.js',
    projectJSFolderName.'/common.js',
    projectJSFolderName.'/remoteCallApp.js',
    projectJSFolderName.'/controller/curationListController.js',
    projectJSFolderName.'/controller/curationController.js',
    projectJSFolderName.'/controller/headerController.js',
    projectJSFolderName.'/controller/footerController.js',
    projectJSFolderName.'/curation_lib.js',
    projectJSFolderName.'/curation.js',
    projectJSFolderName.'/videoPlayerClass.js',
    commonJSFolderName.'/sso/sso.js',
    projectJSFolderName.'/signIn.js'
);
$scriptArr['curate']['output']    =   projectJSFolderName.'/curationScript.js';
$scriptArr['curate']['output-min']    =   projectJSFolderName.'/curationScript.min.js';

/* SIGN UP PAGE SCRIPTS */
$scriptArr['sso_signup_page']['source']  =   array(
//    projectJSFolderName.'/contentTopicClass.js',
    projectJSFolderName.'/historyModule.js',
    projectJSFolderName.'/searchModule.js',
//    projectJSFolderName.'/listModule.js',
//    projectJSFolderName.'/viewModule.js',
    projectJSFolderName.'/user.js',
    projectJSFolderName.'/appVars.js',
    projectJSFolderName.'/appClass.js',
    projectJSFolderName.'/appInit.js',
    projectJSFolderName.'/UImethods.js',
    projectJSFolderName.'/common.js',
    projectJSFolderName.'/remoteCallApp.js',
    projectJSFolderName.'/controller/homeController.js',
    projectJSFolderName.'/controller/headerController.js',
//    projectJSFolderName.'/controller/searchController.js',
//    projectJSFolderName.'/controller/viewController.js',
    projectJSFolderName.'/controller/footerController.js',
//    projectJSFolderName.'/controller/profileController.js',
//    projectJSFolderName.'/controller/bookmarkController.js',
//    projectJSFolderName.'/bookmarkClass.js',
//    projectJSFolderName.'/userProfile.js',
    commonJSFolderName.'/sso/sso.js',
    projectJSFolderName.'/signUp.js'
);
$scriptArr['sso_signup_page']['output']    =   projectJSFolderName.'/signUpScript.js';
$scriptArr['sso_signup_page']['output-min']    =   projectJSFolderName.'/signUpScript.min.js';

/* SIGN UP PAGE SCRIPTS */
$scriptArr['sso_reset_page']['source']  =   array(
//    projectJSFolderName.'/contentTopicClass.js',
    projectJSFolderName.'/historyModule.js',
    projectJSFolderName.'/searchModule.js',
//    projectJSFolderName.'/listModule.js',
//    projectJSFolderName.'/viewModule.js',
    projectJSFolderName.'/user.js',
    projectJSFolderName.'/appVars.js',
    projectJSFolderName.'/appClass.js',
    projectJSFolderName.'/appInit.js',
    projectJSFolderName.'/UImethods.js',
    projectJSFolderName.'/common.js',
    projectJSFolderName.'/remoteCallApp.js',
    projectJSFolderName.'/controller/homeController.js',
    projectJSFolderName.'/controller/headerController.js',
//    projectJSFolderName.'/controller/searchController.js',
//    projectJSFolderName.'/controller/viewController.js',
    projectJSFolderName.'/controller/footerController.js',
//    projectJSFolderName.'/controller/profileController.js',
//    projectJSFolderName.'/controller/bookmarkController.js',
//    projectJSFolderName.'/bookmarkClass.js',
//    projectJSFolderName.'/userProfile.js',
    commonJSFolderName.'/sso/sso.js',
    projectJSFolderName.'/reset.js'
);
$scriptArr['sso_reset_page']['output']    =   projectJSFolderName.'/resetPassScript.js';
$scriptArr['sso_reset_page']['output-min']    =   projectJSFolderName.'/resetPassScript.min.js';

/* FEEDBACK SCRIPTS */
$scriptArr['feedback']['source']  =   array(
    projectJSFolderName.'/contentTopicClass.js',
    projectJSFolderName.'/historyModule.js',
    projectJSFolderName.'/searchModule.js',
    projectJSFolderName.'/listModule.js',
    projectJSFolderName.'/viewModule.js',
    projectJSFolderName.'/user.js',
    projectJSFolderName.'/appVars.js',
    projectJSFolderName.'/appClass.js',
    projectJSFolderName.'/appInit.js',
    projectJSFolderName.'/UImethods.js',
    projectJSFolderName.'/common.js',
    projectJSFolderName.'/remoteCallApp.js',
    projectJSFolderName.'/controller/headerController.js',
    projectJSFolderName.'/controller/searchController.js',
    projectJSFolderName.'/controller/reviewController.js',
    projectJSFolderName.'/controller/footerController.js',
    projectJSFolderName.'/videoPlayerClass.js',
    commonJSFolderName.'/sso/sso.js',
    projectJSFolderName.'/feedbackGridTable.js',
    projectJSFolderName.'/createjqgrid.js',
    commonJSFolderName.'/jqueryUI/jquery-ui.custom.js',
    commonJSFolderName.'/jquery.jqGrid.min.js',
    commonJSFolderName.'/grid.locale-en.js',
    commonJSFolderName.'/GridRelated.js',
    commonJSFolderName.'/commonFunctions.js',
    commonJSFolderName.'/renderGrid.js'
);
$scriptArr['feedback']['output']    =   projectJSFolderName.'/feedbackScript.js';
$scriptArr['feedback']['output-min']    =   projectJSFolderName.'/feedbackScript.min.js';

/* REVIEW SCRIPTS */
$scriptArr['review']['source']  =   array(
    projectJSFolderName.'/contentTopicClass.js',
    projectJSFolderName.'/historyModule.js',
    projectJSFolderName.'/searchModule.js',
    projectJSFolderName.'/listModule.js',
    projectJSFolderName.'/viewModule.js',
    projectJSFolderName.'/user.js',
    projectJSFolderName.'/appVars.js',
    projectJSFolderName.'/appClass.js',
    projectJSFolderName.'/appInit.js',
    projectJSFolderName.'/UImethods.js',
    projectJSFolderName.'/common.js',
    projectJSFolderName.'/remoteCallApp.js',
    projectJSFolderName.'/controller/headerController.js',
    projectJSFolderName.'/controller/searchController.js',
    projectJSFolderName.'/controller/reviewController.js',
    projectJSFolderName.'/controller/footerController.js',
    projectJSFolderName.'/curation_lib.js',
    projectJSFolderName.'/review_curation.js',
    projectJSFolderName.'/videoPlayerClass.js',
    commonJSFolderName.'/sso/sso.js',
    projectJSFolderName.'/review_job_details.js',
    projectJSFolderName.'/createjqgrid.js',
    commonJSFolderName.'/jqueryUI/jquery-ui.custom.js',
    commonJSFolderName.'/jquery.jqGrid.min.js',
    commonJSFolderName.'/grid.locale-en.js',
    commonJSFolderName.'/GridRelated.js',
    commonJSFolderName.'/commonFunctions.js',
    commonJSFolderName.'/renderGrid.js'
);
$scriptArr['review']['output']    =   projectJSFolderName.'/reviewScript.js';
$scriptArr['review']['output-min']    =   projectJSFolderName.'/reviewScript.min.js';

?>