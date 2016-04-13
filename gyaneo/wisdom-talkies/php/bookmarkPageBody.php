<div>
    <div>
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-8">
<!--
                    <div class="text-default">My Topics</div>
-->
                    <div class="table-scroll-container">
                        <table id="video-bookmark-table" class="table table-bordered table-hover table-striped table-condensed topic-table">
                            <thead>
                                <tr>
                                    <th class="new-topic-icon"><span class="glyphicon glyphicon-plus glyphicon-round"></span>&nbsp;Add</th>
                                    <th>Topic</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="readOnlyRow dummyRow">
                                    <td class="new-topic-icon topic-row">
                                        <span class="glyphicon glyphicon-plus glyphicon-round"></span>
                                    </td>
                                    <td>
                                        <span class="topic-text"></span>
                                    </td>
                                    <td>
                                        <span><a class="topic-start"></a></span>
                                    </td>
                                    <td>
                                        <span><a class="topic-end"></a></span>
                                    </td>
                                    <td>
                                        <span class="glyphicon glyphicon-pencil glyphicon-multi bookmark-topic-edit"></span>
                                        <span class="glyphicon glyphicon-remove glyphicon-multi glyphicon-round bookmark-topic-remove"></span>
                                    </td>
                                </tr>
                                <tr class="inputRow dummyRow">
                                    <td>
                                        <span class="glyphicon glyphicon-remove bookmark-undo-new-topic"></span>
                                    </td>
                                    <td>
                                        <textarea class="topic-text-input"></textarea>
                                    </td>
                                    <td>
                                        <div>
                                            <span class="glyphicon glyphicon-chevron-left time-shift left-shift"></span>
                                            <span><input type="number" min="0" class="topics-time-input topic-start-time" /></span>
                                            <span class="glyphicon glyphicon-chevron-right time-shift right-shift"></span>
                                        </div>
                                        <div>
                                            <a class='currentPTSInput'>Update Time</a>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span class="glyphicon glyphicon-chevron-left time-shift left-shift"></span>
                                            <span><input type="number" min="0" class="topics-time-input topic-end-time" /></span>
                                            <span class="glyphicon glyphicon-chevron-right time-shift right-shift"></span>
                                        </div>
                                        <div>
                                            <a class='currentPTSInput'>Update Time</a>
                                        </div>
                                    </td>
                                    <td>
                                        <input type="button" class="btn btn-default bookmark-topic-save" value="Done"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="text-default">Title</div>
                    <div class="form-horizontal">
                        <div class="form-group">
                            <div class="col-md-12">
                                <input type="text" id="bookmarks-title"/>
                            </div>
                        </div>
                    </div>
                    <div class="text-default">Points to remember</div>
                    <div class="form-horizontal">
                        <div class="form-group">
                            <div class="col-md-12">
                                <textarea rows="2" id="bookmark-ptremember"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 text-center">
                        <div class="col-md-3">
                            <input type="button" id="save-bookmark" class="btn btn-primary" value="Save" />
                        </div>
                        <div class="col-md-3">
                            <input type="button" id="play-bookmark" class="btn btn-primary" value="Play" />
                        </div>
                        <div class="col-md-3">
                            <input type="button" id="mail-bookmark" class="btn btn-primary hide" value="Mail" />
                        </div>
                        <div class="col-md-3">
                            <input type="button" id="share-bookmark" class="btn btn-primary hide" value="Share" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
</div>
