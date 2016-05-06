<?php
?>
<!--[if gte IE 9]>
  <style type="text/css">
    #top-banner {
       filter: none;
    }
  </style>
<![endif]-->
<link href='./<?php echo projectCSSFolderName; ?>/curation.css' rel="stylesheet">
<div id="main" class="container-fluid">
    <div id="routeView" data-ng-view></div>
    <div id="save-to-curation" class="ng-cloak">
        <div>
            Add to My Curation
        </div>
        <div>
            <form class="form">
                <div class="form-group">
                    <label class="control-label">Choose Category</label>
                    <div class="category-drop-down-curation" id="add-to-curation-category" data-label="Choose category"></div>
                </div>
                <div id="curationListAddMsgBox" class="alert hide">
                </div>
            </form>
        </div>
        <div>
            <button type="button" class="btn btn-primary" id="addToMyCuration">Add to List</button>
        </div>
    </div>
</div>