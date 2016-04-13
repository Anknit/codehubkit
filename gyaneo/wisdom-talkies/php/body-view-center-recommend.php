<div id="recommendContainer" class="col-md-4 section-cover contentSpecificVisible">
    <input type="button" value="Play Using My Bookmarks" class="indexSwitch index-bookmarks btn btn-default btn-block" />
    <div class="recommendPage row" id="recommPage_1">
        <div class="col-md-12 recommPageInfo">
            <span>*This content is not yet curated !</span>
        </div>
        <table>
            <tr>
                <td>
                    <div>
                        <h4>
                            <strong>This video solves your problem ?</strong>
                        </h4>
                        <h4>
                            <span>Help others find it easily.</span>
                        </h4>
                        <button class="btn btn-success btn-large btn-block" id="recommendCurationHomeBtn">
                            <h4 class="text-center">Recommend video for <br/> curation</h4>
                        </button>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <div class="recommendPage row" id="recommPage_2">
        <div class="col-md-12 recommPageInfo">
            <h4>
                <span>Your Recommendation</span>
            </h4>
        </div>
        <table>
            <tr>
                <td>
                    <form id="recommendation-input-form">
                        <div class="form-group">
                            <label for="recommendcategoryInput">Category</label>
                            <select class="form-control" id="recommendcategoryInput">
                                <option value="0">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="text" required class="form-control" id="otherCategoryInput" placeholder="Type new category name">
                        </div>
                        <div class="form-group">
                            <label for="recommendDescription">What problem was solved ?</label>
                            <textarea rows="2" required class="form-control" id="recommendDescription" placeholder="Please write few words on the problem this video solves"></textarea>
                        </div>
                        <div id="captchaBlock" class="text-center">
                            <img style="width:80px" src="./<?php echo projectFolderName; ?>/php/appdata.php?captcha=true&rand=<?php echo rand();?>" alt='captcha' id="recomCaptcha"/>
                            <input type="text" id="recomCaptchaText" class="captchaInput"/>
                            <div><a onclick="refreshCaptcha('#recomCaptcha');"><span class="glyphicon glyphicon-refresh"></span>Refresh</a></div>
                        </div>
                        <div class="form-group">
                            <button type="button" class="pull-right btn btn-primary text-right" id="submitRecommBtn">Submit</button>
                        </div>
                    </form>
                </td>
            </tr>
        </table>
        <div class="col-md-12" id="recommPageError">
            <span></span>
        </div>
    </div>
    <div class="recommendPage row" id="recommPage_3">
        <div class="col-md-12 recommPageInfo">
            <span>We value your association</span>
        </div>
        <table>
            <tr>
                <td>
                    <div>
                        <h2 class="text-center">
                            <span>Thank you <br/> for the recommendation</span>
                        </h2>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>
