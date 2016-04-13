<div id="viewcenter"  class="col-md-9 col-md-push-3 col-sm-12">
    <div class="row">
        <div id="contentplayer" class="col-md-8">
            <div id="YTPlayerDiv"></div>    
        </div>
        <div id="viewtopics" class="playListContainer col-md-4 section-cover contentSpecificVisible">
            <input type="button" value="Play Using My Bookmarks" class="indexSwitch index-bookmarks btn btn-default btn-block" />
            <div class="topicshead">Topics</div>
            <div class="topiclist-container row">

            </div>
        </div>
        <?php 
            require_once __DIR__.'/body-view-center-recommend.php';
        ?>
        <div id="viewbookmarks" class="playListContainer col-md-4 section-cover contentSpecificVisible">
            <input type="button" value="Play Using Topics" class="indexSwitch index-topics btn btn-default btn-block" />
            <div class="topicshead">Bookmarks</div>
            <div class="bookmarklist-container row">
                
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12" style="padding-right:0px;">
            <div id="contentinfo">
                <div class="col-md-12" id="content-title">
                    <strong ></strong>
                </div>
                <div class="col-md-12" id="content-stats">
                    <div class="row">
                        <div class="col-md-2">
                            views &nbsp;<span id="content-views" class=""></span>
                        </div>
                        <div class="col-md-4">
                            <div>Curator: <strong id="content-shared-by"></strong></div>
                        </div>
                    </div>
                </div>
<!--
                <div class="col-md-12 content-credits">
                    <div class="col-md-4 text-left">
                    </div>
                    <div class="col-md-4 text-center">
                        <div>Shared: <strong id="content-shared-by"></strong></div>
                    </div>
                    <div class="col-md-4 text-right">
                        <span class="glyphicon glyphicon-thumbs-up"></span><div id="content-likes-count"></div>
                    </div>
                </div>
-->
                <div class="col-md-12">
                    <div id="contentactions" class="row">
                        <div class='actionItem hide'>
                            <div class='actCon'>
                            <div class='actionIcon qaicon'>
                            </div>
                            <div class='actionName'>Q & A</div>
                            </div>
                        </div>
                        <div class='actionItem hide' actDiv='shareBox'>
                            <div class='actCon'>
                            <div class='actionIcon comicon'>
                            </div>
                            <div class='actionName'>Comments</div>
                            </div>
                        </div>
                        <div class='actionItem activeActionItem' actDiv='bookmarkBox'>
                            <div class='actCon'>
                            <div class='actionIcon bookmarkicon'>
                            </div>
                            <div class='actionName'>My Bookmark</div>
                            </div>
                        </div>
                        <div class='actionItem hide' actDiv='mailBox'>
                            <div class='actCon'>
                            <div class='actionIcon mailicon'>
                            </div>
                            <div class='actionName'>Mail</div>
                            </div>
                        </div>
                        <div class='actionItem' actDiv='socialBox'>
                            <div class='actCon'>
                            <div class='actionIcon shareicon'>
                            </div>
                            <div class='actionName'>Share</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='shareBox actionDataContainer'>
                <div class='shareContainer'>
                    <div class='inputShare'>
                        <input type='text' placeholder='Share your Comments' />
                    </div>
                    <div class='buttonShare'>
                        <input type='button' value='Post' />
                    </div>
                </div>
            </div>
            <div class='bookmarkBox actionDataContainer' style='display:block'>
                <div class='bookmarkContainer'>
<!--
                    <form>
                        <table>
                            <tr>
                                <td>
                                    <label for='bookmarkTitle'>Title</label>
                                </td>
                                <td>
                                    <input type='text' placeholder='Write a title' value='Introduction to violin playing. User can change this' name='bookmarkTitle' id='bookmarkTitle' />
                                </td>
                                <td>
                                    <label for='bookmarkStart'>Start time</label>
                                </td>
                                <td>
                                    <div id='bookmarkStart' name='bookmarkStart'>00:05:30</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for='bookmarkNotes'>Notes</label>
                                </td>
                                <td colspan='3'>
                                    <textarea type='text' id='bookmarkNotes' name='bookmarkNotes'></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for='bookmarkFolder'>Folder</label>
                                </td>
                                <td colspan='2'>
                                    <input type="text" disabled id='bookmarkFolder' class='disabledText' value='Home/Not Editable/' name='bookmarkFolder'/>
                                </td>
                                <td>
                                    <input type="button" value='Select' />
                                </td>
                            </tr>
                            <tr>
                                <td colspan='4' style='text-align:center'>
                                    <input type='button' class='bookmarkSubmit' value='Save' />
                                </td>
                        </table>
                    </form>
-->
<!--
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-8">
                                <div>
                                    <div class="form-horizontal">
                                        <div class="form-group">
                                            <label class="col-md-2">Title</label>
                                            <div class="col-md-10">
                                                <input type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="container-fluid">
                                        <div class="col-md-6">
                                            <span>Topic</span>
                                        </div>
                                        <div class="col-md-2">
                                            <span>Start Time</span>
                                        </div>
                                        <div class="col-md-2">
                                            <span>End Time</span>
                                        </div>
                                        <div class="col-md-1 no-padding">
                                            <span>Edit</span>
                                        </div>
                                        <div class="col-md-1 no-padding">
                                            <span>Remove</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="container-fluid">
                                        <div class="col-md-6">
                                            <textarea></textarea>
                                        </div>
                                        <div class="col-md-2">
                                            <input type="text" />
                                        </div>
                                        <div class="col-md-2">
                                            <input type="text" />
                                        </div>
                                        <div class="col-md-1 no-padding">
                                            <span>&nbsp;</span>
                                        </div>
                                        <div class="col-md-1 no-padding">
                                            <span>&nbsp;</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div>
                                    <div class="form-horizontal">
                                        <div class="form-group">
                                            <label class="col-md-2">Notes</label>
                                            <div class="col-md-10">
                                                <textarea></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
-->
                    <?php
                        if(is_login){
                            require_once    __DIR__.'/bookmarkPageBody.php';
                        }
                        else{
                    ?>
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <div class="col-md-12">
                                <div class="well">
                                    <p>
                                        Please <span class='sign-in-button'>Sign-in</span> to use Bookmarks 
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php
                        }
                    ?>
                </div>
            </div>
            <div class='mailBox actionDataContainer'>
                <div class='mailContainer'>
                    <form>
                        <table>
                            <tr>
                                <td>
                                    <label for='mailto'>To</label>
                                </td>
                                <td>
                                    <input type='text' id='mailto' name='mailto' value='bob@yahoo.com ; Email Address'>
                                </td>
                                <td>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for='mailsubject'>Subject</label>
                                </td>
                                <td>
                                    <input type='text' id='mailsubject' name='mailsubject'>
                                </td>
                                <td>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for='mailvideo'>To</label>
                                </td>
                                <td>
                                    <input type='text' id='mailvideo' class='disabledText' name='mailvideo' value='URL of this video. Non editable'>
                                </td>
                                <td>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td>&nbsp;
                                </td>
                                <td>
                                    <textarea id='mailmessage' name='mailmessage' placeholder='Your message'></textarea>
                                </td>
                                <td>
                                    <input type='button' class='bookmarkSubmit' value='Send' />
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
            </div>
            <div class='socialBox actionDataContainer'>
                <div class='socialContainer'>
                    <div class='socialIcon socialIconFacebook'>
                    	<div id="fb-root"></div>
						<!-- Your share button code -->
						<div class="fb-share-button" data-href="" data-layout="button"></div>
                    </div>
                    <div class='socialIcon socialIconTwitter'>
                    </div>
                    <div class='socialIcon socialIconGoogleplus'>
                    </div>
                    <div class='socialIcon socialIconBlogger'>
                    </div>
                    <div class='socialIcon socialIconReddit'>
                    </div>
                    <div class='socialIcon socialIconTumblr'>
                    </div>
                    <div class='socialIcon socialIconLinkedin'>
                    </div>
                    <div class='socialIcon socialIconPinterest'>
                    </div>
                    <div class='socialIcon socialIconStumbleupon'>
                    </div>
                    <div class='socialIcon socialIconHi5'>
                    </div>
                    <div class='socialIcon socialIconDigg'>
                    </div>
                    <div class='socialIcon socialIconYahoo'>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
