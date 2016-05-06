<div class="section col-md-9 col-sm-12 section-cover" id="profile" style="display: none;">
    <div id="profileleft" class="col-md-3">
        
    </div>
    <div id="profileCenter" class="col-md-12">
        <div class="row">
            <div class="col-md-12" id="profileItemsContainer">
                <div class="profileItem form-horizontal" data-label="My Profile" id="profileInformation">
                    <div class='form-group'>
                        <button class="btn btn-warning editOption" id="editProfileInfo">Edit Profile</button>
                        <?php 
                            if(!empty($session_data) && $session_data['data']['user_login_source'] != Google){
                        ?>
                            <button class="btn btn-warning editOption" id="changePassword">Change Password</button>
                        <?php
                            }
                        ?>
                        <button class="btn btn-success hidden actionButton" id="saveProfileInfo">Save</button>
                        <button class="btn btn-default hidden actionButton" id="cancelEditProfileInfo">Cancel</button>
                    </div>
                    <table class="table table-condensed" id="generalInfoUpdate">
                        <tbody>
                            <tr>
                                <td>
                                    <div class="form-group">
                                        <label class="control-label col-md-2">First Name</label>
                                        <div class="col-md-10">
                                            <input id="sign-in-firstname" type="text" class="hidden form-control" name="first_name" placeholder="First name" >
                                            <div class="profile-firstName display-entry"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="form-group">
                                        <label class="control-label col-md-2">Last Name</label>
                                        <div class="col-md-10">
                                            <input id="sign-in-lastname" type="text" class="hidden form-control" name="last_name" placeholder="Last name" >
                                            <div class="profile-lastName display-entry"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="form-group">
                                        <label class="control-label col-md-2">Age</label>
                                        <div class="col-md-10">
                                            <input id="sign-in-age" type="text" name="age" class="hidden form-control" placeholder="Age">
                                            <div class="profile-age display-entry"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="form-group">
                                        <label class="control-label col-md-2">Location</label>
                                        <div class="col-md-10">
                                            <input id="sign-in-location" type="text" name="location" class="hidden form-control" placeholder="Location" >
                                            <div class="profile-location display-entry"></div>
                                        </div>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="form-group">
                                        <label class="control-label col-md-2">Phone</label>
                                        <div class="col-md-10">
                                            <input id="sign-in-phone" type="text" name="phone" class="hidden form-control" placeholder="Phone" >
                                            <div class="profile-phone display-entry"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="profileUpdateMessageBox"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-condensed hidden" id="passwordUpdateForm">
                        <tr>
                            <td>
                                <div class="form-group">
                                    <label class="control-label col-md-2">Current password</label>
                                    <div class="col-md-10">
                                        <input id="current-password" type="password" class="form-control" placeholder="Type your current password" >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="form-group">
                                    <label class="control-label col-md-2">New password</label>
                                    <div class="col-md-10">
                                        <input id="new-password" type="password" class="form-control" placeholder="Enter new password" >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="form-group">
                                    <label class="control-label col-md-2">Retype password</label>
                                    <div class="col-md-10">
                                        <input id="confirm-password" type="password" class="form-control" placeholder="Re-enter new password" >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="profileUpdateMessageBox"></div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="profileItem" data-label="My Bookmarks" id="savedBookmarks">
                    <h3>
                        My Bookmarks
                    </h3>
                    <div id="bookmarkListContainer" class="list-group">
                        <div class="container-fluid">
                            <div class="row list-item-row dummyRow">
                                <div class="col-md-3 col-sm-12 tn_col">
                                    <div class="row">
                                        <div class="col-md-12 overlay-info text-center">
                                            <img class="list_tn bookmark-item-image bookmark-play" onload="CheckImgErr(this);">
                                            <span class="play-icon"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-9 toggle-container">
                                    <div class="row bookmarkListItemHead">
                                        <div class="col-md-12 list_title bookmark-title bookmark-play">                                        
                                        </div>
                                        <div class="container-fluid text-right">
                                            Modified Date&mdash;<span class="bookmark-item-date"></span>
                                        </div>
                                    </div>
                                    <div class="row bookmarkListItemBody content-data content-toggle row">
                                        <div class="col-md-6">
                                            <div>
                                                <ol class="bookmark-item-topics content-topic-list">
                                                </ol>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="bookmark-item-ptr">
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row bookmarkListItemFoot">
                                        
                                    </div>
                                </div>
                                <div class="col-md-9 col-md-offset-3 col-sm-12 col-sm-offset-0 toggle-button">
                                    <div class="media-toggle-link closed">More...</div>
                                    <div class="media-toggle-link open">Back</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profileItem" data-label="My Curations" id="savedCurations">
                    <h3>
                        My Curations
                    </h3>
                    <div id="curationListContainer" class="list-group">
                        <table class="table table-bordered convertTojqGrid ui-grid-Font clgrid" id="CurationListTable" url='./<?php echo projectFolderName; ?>/php/userCurationData.php?request=curation_read'
                            colNames="Title,Category,Modified Date,Curation Status,Review Issue,Action" colModel='myCurationDataColModel'
                            sortBy ='publisheddate' gridComplete='myCurationDataFormatterFunction' gridWidth="0.99" gridHeight="0.90"> 
                        </table>
                        <div id="gridpager_CurationListTable"></div>
                    </div>
                    <div id="delete-curation" class="data-display-load">
                        <div>
                            Delete Confirmation
                        </div>
                        <div>
                            <div class="panel panel-primary hide-toggle">
                                <div class="panel-heading">
                                    Are you sure you want to delete this content from your curation list?
                                </div>
                            </div>
                            <div class="alert alert-warning hide" id="delete-curation-message"></div>
                        </div>
                        <div>
                            <div class="hide-toggle">
                                <button type="button" class="btn btn-danger" id="confirm-delete-curation">Delete</button>
                                <button type="button" class="btn btn-default" id="cancel-delete-curation">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="profileRight" class="col-md-3">
        
    </div>
</div>