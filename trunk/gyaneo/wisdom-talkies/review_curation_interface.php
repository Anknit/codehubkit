<?php 
require_once __DIR__.'/require.php';

if(is_login != true	||	($_SESSION['usertype']	!=	UT_MODERATOR	&&	$_SESSION['usertype']	!=	UT_REVIEWER))
{
	header('location:./');
	exit();
}

$query_category    	=    array('Fields'=>'*','Table'=>'categoryinfo','clause'=>'status!='.CATS_DELETED);
$d_data_category    =    DB_Read($query_category,'ASSOC','','catId');

$query_language    	=    array('Fields'=>'*','Table'=>'language','clause'=>'status!='.LS_DELETED);
$d_data_language    =    DB_Read($query_language,'ASSOC','','id');

require_once __DIR__.'/php/header.php';
?>
<link rel="stylesheet" href="./Common/css/ui.jqgrid.css" />
<link rel="stylesheet" href="./Common/css/jqueryUI/themes/jquery-ui.css" />
<link href='./<?php echo projectCSSFolderName; ?>/review_curation.css' rel="stylesheet">
<style>
    button[data-toggle="collapse"][aria-expanded="true"]{
        background-color: forestgreen;
        color:#fff;
    }
</style>
<div id="main" class="container-fluid" data-ng-controller="reviewController">
	<div id="contentPANE" style="position:relative;height:80%;width:100%;">

		<button type="button" id="grid_collapse_button" class="btn btn-default" data-toggle="collapse" aria-expanded="true" data-target="#active-jobs-grid">Grid</button>
        <button type="button" id="review_interface_collapse_button" class="btn btn-default" data-toggle="collapse" aria-expanded="false" data-target="#review_tabs_and_player">Review </button>
      	<button type="button" id="iframe_collapse_button" class="btn btn-default" aria-expanded="false" data-toggle="collapse" data-target="#iframe_div_for_curation">Curation</button>
		
    	<div class="reviewTableContainer collapse in" id="active-jobs-grid">
       	
       	<?php if($_SESSION['usertype']	==	UT_MODERATOR) {?>
       		<button type="button" id="move_category_button" class="btn btn-info" style="margin:10px 5px" disabled>Move to another category</button>
       		<button type="button" id="delete_category_button" class="btn btn-info" style="margin:10px 5px">Delete Category</button>
       		<button type="button" id="delete_language_button" class="btn btn-info" style="margin:10px 5px">Delete Language</button>
       		<button type="button" id="delete_content_button" class="btn btn-info" style="margin:10px 5px">Delete content</button>
       	<?php }?>
       	<!-- <button type="button" id="filter_button" class="btn btn-info">Filters</button> -->
		
		<div id="move_category_container" class="modal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header text-center">
						<h4 class="">Move to another category</h4>
					</div>
					<div class="modal-body text-center">
						<span class="">You have selected <span id="review_number_of_video_selected"></span> video<span id="review_is_plural_or_singular"></span></span>
		
						<div id="review_list_of_selected_video">
						
						</div> 
						<div class="category-drop-down-curation review_select_category_for_move" id="dropdown_for_move">
							
						</div>
						<p class="move_category_error">
						
						</p>
					</div>
					<div class="modal-footer">
						<div class="" id="">
							<button type="button" class="btn btn-default" id="review_final_move_category_button">Move</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div id="delete_category_container" class="modal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header text-center">
						<h4 class="">Delete category</h4>
					</div>
					<div class="modal-body text-center">
						<div class="category-drop-down-curation review_select_category_for_move" id="dropdown_for_delete">
							
						</div>
						<p class="move_category_error">
						
						</p>
					</div>
					<div class="modal-footer">
						<div class="" id="">
							<button type="button" class="btn btn-default" id="review_final_delete_category_button">Delete</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div id="delete_language_container" class="modal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header text-center">
						<h4 class="">Delete language</h4>
					</div>
					<div class="modal-body text-center">
						<div class="" id="dropdown_for_delete_language">
							<select>
							
							</select>
						</div>
						<p class="delete_language_error">
						
						</p>
					</div>
					<div class="modal-footer">
						<div class="" id="">
							<button type="button" class="btn btn-default" id="review_final_delete_language_button">Delete</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div id="filter_container" class="modal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header text-center">
						<h4 class="">Filter</h4>
					</div>
					<div class="modal-body text-center">
						<div class="" id="language_filter_options">
							
						</div>
					</div>
					<div class="modal-footer">
						<div class="" id="">
							<button type="button" class="btn btn-default" id="final_filter_button">Filter</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="delete_content_container" class="modal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header text-center">
						<h4 class="">Delete Content</h4>
					</div>
					<div class="modal-body text-center">
						<span class="">You have selected <span id="number_of_content_selected"></span> video<span id="plural_or_singular"></span></span>
		
						<div id="list_of_selected_video">
						
						</div> 
						<p class="delete_content_error">
						
						</p>
					</div>
					<div class="modal-footer">
						<div class="" id="">
							<button type="button" class="btn btn-default" id="review_final_delete_content_button">Delete</button>
						</div>
					</div>
				</div>
			</div>
		</div>
            <table class="table table-bordered convertTojqGrid ui-grid-Font clgrid" id="ActiveJobs" url='./<?php echo projectFolderName; ?>/php/review_data.php?data=8'
                colNames=",Title,Category,Topics?,Version,Curated By,Published Date,Curation Status,Review Issue,Action" colModel='activejcolmodel'
                sortBy ='publisheddate' gridComplete='activeJobDetailsFormatterFunction' gridWidth="0.98" gridHeight="0.65"> 
            </table>
            <div id="gridpager_ActiveJobs"></div>		
        </div>	
        
        
        <div id="review_tabs_and_player" class="collapse">
	        <div id="view" class="col-md-5 col-sm-12">
	            <div class="row">
	                <div id="viewcenter"  class="col-md-12 col-sm-12">
	                    <div class="row">
	                        <div id="contentplayer" class="embed-responsive embed-responsive-16by9">
	                            <youtube-video video-id="playerVideoId" player="vidPlayerObject" id="ytplayerdiv"></youtube-video>    
	                        </div>
	                    </div>
	                </div>
	            </div>
	        </div>
	        <div id="curationTopics" class="col-md-7 section-cover">
	            <!-- 
                <div class="headerFoot">
	                <div class="resultsDiv">
	                </div>
	            </div> -->
	            <div id="review_tabs">
	                <div id="review_topics_tab" data-label="Topics" class="col-md-12 section-cover">
	                    <div class="topic_container">
	                        <div class='videoTimeLineCuration'>
	                            <div class='videoTimeLineAction'>
	                                <div class='actionButtonContainer'>
	                                </div>
	                                <div class='timeLineTableContainer'>
	                                    <div id='curateScrollContainer'>
	                                        <div class='curationTablebody'>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                        </div>				
	                    </div>
	                </div>
	                <div id="review_metadata_tab" data-label="Meta data" class="col-md-12 section-cover">
	                    <div class="metadata_container">
	                        <form action="" class="form-horizontal" method="post">				
	                            <div class="form-group">
	                                <label label_name="Title" class="control-label col-md-3">Title</label>
	                                <div class="col-md-7">
	                                    <input id="moderator_title" type="text" class="form-control mod_input" name="title"
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label label_name="Description" class="control-label col-md-3">Description</label>
	                                <div class="col-md-7">
	                                    <textarea id="moderator_original_description" type="text" class="form-control mod_input" name="title" disabled></textarea>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label label_name="Category" class="control-label col-md-3">Category</label>
	                                <div class="col-md-7">
	                                    <!-- <input id="moderator_category" type="text" class="form-control" name="category"> -->
	                                    <select id=moderator_category class="mod_input" 
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>>
	                                    </select>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label label_name="Sub category" class="control-label col-md-3">Sub category</label>
	                                <div class="col-md-7">
	                                    <input id="moderator_other_category" type="text" class="form-control mod_input" name="other_category"
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label label_name="Summary" class="control-label col-md-3">Summary</label>
	                                <div class="col-md-7">
	                                    <textarea id="moderator_description" type="text" class="form-control mod_input" name="description"
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>>
	                                    </textarea>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label label_name="Suggested Keywords" class="control-label col-md-3">Suggested Keywords</label>
	                                <div class="col-md-7">
	                                    <textarea id="moderator_keywords" type="text" class="form-control mod_input" name="keywords"
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>>
	                                    </textarea>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            
	                            <div class="form-group">
	                                <label label_name="Specific tags" class="control-label col-md-3">Specific tags</label>
	                                <div class="col-md-7">
	                                    <textarea id="moderator_tags" type="text" class="form-control mod_input" name="tags"
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>>
	                                    </textarea>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            
	                            
	                            <div class="form-group">
	                                <label label_name="Language" class="control-label col-md-3">Language</label>
	                                <div class="col-md-7">
	                                    <!-- <input id="moderator_language" type="text" class="form-control" name="language">-->
	                                    <select id=moderator_language class="mod_input"
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>>
	                                    </select>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label label_name="Other language" class="control-label col-md-3">Other language</label>
	                                <div class="col-md-7">
	                                    <input id="moderator_other_language" type="text" class="form-control mod_input" name="other_language"
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label label_name="Age-group" class="control-label col-md-3">Age-group</label>
	                                <div class="col-md-7">
	                                    <!-- <input id="moderator_title" type="text" class="form-control" name="title">-->
	                                    <select id=moderator_age class="mod_input"
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>>
	                                        <option value=1>Kids</option>
	                                        <option value=2>Teens</option>
	                                        <option value=3>Adults</option>
	                                        <option value=4>All</option>
	                                    </select>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label label_name="Items-used" class="control-label col-md-3">Items-used</label>
	                                <div class="col-md-7">
	                                    <textarea id="moderator_items" type="text" class="form-control mod_input" name="items"
	                                    <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?>></textarea>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label label_name="Links" class="control-label col-md-3">Links</label>
	                                <div class="col-md-7">
	                                    <div id="moderator_links">
	                                        <div>
	                                            <div class="col-md-4">
	                                                <select <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> class="form-control mod_input content-link-select-type" id="content-link-type-1">
	                                                    <option value="website" selected>Website</option>
	                                                    <option value="facebook">Facebook</option>
	                                                    <option value="twitter">Twitter</option>
	                                                    <option value="googleplus">Google+</option>
	                                                    <option value="linkedin">Linkedin</option>
	                                                    <option value="blogger">Blogger</option>
	                                                    <option value="quora">Quora</option>
	                                                    <option value="instagram">Instagram</option>
	                                                    <option value="souncloud">Soundcloud</option>
	                                                    <option value="pinterest">Pinterest</option>
	                                                    <option value="tumblr">Tumblr</option>
	                                                    <option value="stumbleupon">StumbleUpon</option>
	                                                    <option value="reddit">Reddit</option>
	                                                    <option value="email">Email</option>
	                                                    <option value="other">Other</option>
	                                                </select>
	                                            </div>
	                                            <div class="col-md-8">
	                                                <div class="row">
	                                                    <div class="col-md-5 other_link_container" style="padding-left:0px">
	                                                        <input <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> class="mod_input form-control curate-links-other-input" placeholder="Source Name" type="url" id="content-link-other-input-1" />
	                                                    </div>
	                                                    <div class="link_url_container">
	                                                        <input <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> class="mod_input form-control curate-links" type="url" id="content-link-1" placeholder="https://www...." />
	                                                    </div>
	                                                </div>
	                                            </div>
	                                        </div>
	                                        <div>
	                                            <div class="col-md-4">
	                                                <select <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> class="mod_input form-control content-link-select-type" id="content-link-type-2">
	                                                    <option value="website" selected>Website</option>
	                                                    <option value="facebook">Facebook</option>
	                                                    <option value="twitter">Twitter</option>
	                                                    <option value="googleplus">Google+</option>
	                                                    <option value="linkedin">Linkedin</option>
	                                                    <option value="blogger">Blogger</option>
	                                                    <option value="quora">Quora</option>
	                                                    <option value="instagram">Instagram</option>
	                                                    <option value="souncloud">Soundcloud</option>
	                                                    <option value="pinterest">Pinterest</option>
	                                                    <option value="tumblr">Tumblr</option>
	                                                    <option value="stumbleupon">StumbleUpon</option>
	                                                    <option value="reddit">Reddit</option>
	                                                    <option value="email">Email</option>
	                                                    <option value="other">Other</option>
	                                                </select>
	                                            </div>
	                                            <div class="col-md-8">
	                                                <div class="row">
	                                                    <div class="col-md-5 other_link_container" style="padding-left:0px">
	                                                        <input class="mod_input form-control curate-links-other-input" <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> placeholder="Source Name" type="url" id="content-link-other-input-2" />
	                                                    </div>
	                                                    <div class="link_url_container">
	                                                        <input <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> class="mod_input form-control curate-links" type="url" id="content-link-2" placeholder="https://www...." />
	                                                    </div>
	                                                </div>
	                                            </div>
	                                        </div>
	                                        <div>
	                                            <div class="col-md-4">
	                                                <select <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> class="mod_input form-control content-link-select-type" id="content-link-type-3">
	                                                    <option value="website" selected>Website</option>
	                                                    <option value="facebook">Facebook</option>
	                                                    <option value="twitter">Twitter</option>
	                                                    <option value="googleplus">Google+</option>
	                                                    <option value="linkedin">Linkedin</option>
	                                                    <option value="blogger">Blogger</option>
	                                                    <option value="quora">Quora</option>
	                                                    <option value="instagram">Instagram</option>
	                                                    <option value="souncloud">Soundcloud</option>
	                                                    <option value="pinterest">Pinterest</option>
	                                                    <option value="tumblr">Tumblr</option>
	                                                    <option value="stumbleupon">StumbleUpon</option>
	                                                    <option value="reddit">Reddit</option>
	                                                    <option value="email">Email</option>
	                                                    <option value="other">Other</option>
	                                                </select>
	                                            </div>
	                                            <div class="col-md-8">
	                                                <div class="row">
	                                                    <div class="col-md-5 other_link_container" style="padding-left:0px">
	                                                        <input class="mod_input form-control curate-links-other-input" <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> placeholder="Source Name" type="url" id="content-link-other-input-3" />
	                                                    </div>
	                                                    <div class="link_url_container">
	                                                        <input <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> class="mod_input form-control curate-links" type="url" id="content-link-3" placeholder="https://www...." />
	                                                    </div>
	                                                </div>
	                                            </div>
	                                        </div>
	                                        <div>
	                                            <div class="col-md-4">
	                                                <select <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> class="mod_input form-control content-link-select-type" id="content-link-type-4">
	                                                    <option value="website" selected>Website</option>
	                                                    <option value="facebook">Facebook</option>
	                                                    <option value="twitter">Twitter</option>
	                                                    <option value="googleplus">Google+</option>
	                                                    <option value="linkedin">Linkedin</option>
	                                                    <option value="blogger">Blogger</option>
	                                                    <option value="quora">Quora</option>
	                                                    <option value="instagram">Instagram</option>
	                                                    <option value="souncloud">Soundcloud</option>
	                                                    <option value="pinterest">Pinterest</option>
	                                                    <option value="tumblr">Tumblr</option>
	                                                    <option value="stumbleupon">StumbleUpon</option>
	                                                    <option value="reddit">Reddit</option>
	                                                    <option value="email">Email</option>
	                                                    <option value="other">Other</option>
	                                                </select>
	                                            </div>
	                                            <div class="col-md-8">
	                                                <div class="row">
	                                                    <div class="col-md-5 other_link_container" style="padding-left:0px">
	                                                        <input class="mod_input form-control curate-links-other-input" <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> placeholder="Source Name" type="url" id="content-link-other-input-4" />
	                                                    </div>
	                                                    <div class="link_url_container">
	                                                        <input <?php if($_SESSION['usertype']	==	UT_REVIEWER) {echo "disabled";}?> class="mod_input form-control curate-links" type="url" id="content-link-4" placeholder="https://www...." />
	                                                    </div>
	                                                </div>
	                                            </div>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-success decision-btn'>
	                                        <div class='accept_metadata badge'>
	                                            <span class='glyphicon glyphicon-ok'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class='curationCell'>
	                                    <div class='btn btn-danger decision-btn'>
	                                        <div class='reject_metadata badge'>
	                                            <span class='glyphicon glyphicon-remove'>
	                                            </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                        </form>
	                    </div>
	                </div>
	                <div id="review_decision_tab" data-label="Decision" class="col-md-12 section-cover">
	                    <div class="decision_container">
	                        <form id="final_review_decision" class="form-horizontal" method="post">
	                            
	                        </form>
	                    </div>
	                </div>
	            </div>
	        </div>
       	</div>
       	
       	
       	<div id="iframe_div_for_curation" class="collapse">
       	</div>
    </div>	
</div>
<?php
    require_once __DIR__.'/php/reviewScripts.php';
    require_once __DIR__.'/php/footer.php';
?>
<script>
	var youtubeListFlag = true;
    var l_ch = true;
    var mainObject	=	<?php echo json_encode(array('category'=>$d_data_category,'language'=>$d_data_language));?>;
	var categoryObject	=	mainObject.category;
	var languageObject	=	mainObject.language;
	var typeofuser		=	<?php echo $_SESSION['usertype']; ?>
</script>