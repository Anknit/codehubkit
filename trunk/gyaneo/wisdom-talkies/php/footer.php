	<footer class="section-cover" data-ng-controller="footerController as footCtrl">
		<datalist id="searchData">
		</datalist>
		<div id="foot" class="container-fluid">
            <div class="col-md-12 text-center">
                <div class="col-md-6 text-left">
						<ul class="list-inline pipe-separated">
<!--
							<li>
								<a href="aboutUs">About</a>
							</li>
-->
							<li>
								<a href="termsOfService">Terms</a>
							</li>
							<li>
								<a href="privacy">Privacy</a>
							</li>
<!--
							<li class="hide">
								<a href="legalNotice">Legal Notices &amp; Trademarks</a>
							</li>
-->
						</ul>
                </div>
                <div class="col-md-6 text-right">
                    <p class="rights"><small>Copyright&nbsp;&copy;&nbsp;<?php echo copyright;?>&nbsp;. All rights reserved. </small></p>
                </div>
            </div>
<!--
			<div class="legalBanner col-md-12 small">
				<div class="row">
                    <div class="col-md-3 pull-right text-right">
                        <div class="text-primary c_p" id="feedback-control" data-ng-click="showFeedbackModal()">Report issue / Feedback</div>
                    </div>
				</div>
			</div>
-->
		</div>
    <?php 
        if(is_login) {
            ?>
        <div id="feedback-form" data-ng-class="ng-cloak" data-backdrop="static" data-keyboard="false">
            <div>
                Feedback form
            </div>
            <div>
                <form class="form">
                    <div class="form-group">
                        <label class="control-label">Title</label>
                        <input type="text" class="form-control" id="feedback-title" />
                    </div>
                    <div class="form-group">
                        <label class="control-label">Description</label>
                        <textarea class="form-control" rows="5" id="feedback-description"></textarea>
                    </div>
                    <div class="alert alert-warning" id="feedback-request-alert">It will be great to receive your valuable feedback/suggestion</div>
                </form>
            </div>
            <div>
                <button type="button" class="btn btn-primary" id="submit-feedback" data-ng-click="submitfeedback()">Submit</button>
            </div>
        </div>
        <?php 
        }
        ?>
        <div id="alert-box-container" data-keyboard=false data-backdrop="static">
            <div></div>
            <div></div>
            <div></div>
        </div>
	</footer>
</body>
</html>
