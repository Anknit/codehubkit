<?php
require_once __DIR__.'/Db.php';
require_once __DIR__.'./../Common/php/sso/php/sso.php';
?>
<meta name="google-signin-client_id" content="<?php echo sso_gwt_browser_key;?>"><!--42338840257-9ll1lip2eqc6dg2p00ntl94njnb39d1r.apps.googleusercontent.com-->
<div id="sign-in-container" class="modal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header text-center">
				<h4 class="sign-up-hide"> SIGN IN</h4>
				<h4 class="sign-up-show" style="display:none">SIGN UP</h4>
			</div>
			<div class="modal-body text-center">
				<div class="sign-in-social-icons reset-hide">
					<div class="g-signin2" data-onsuccess="onSignIn"></div>
				</div>
				<span class="sign-in-or reset">OR</span>
				<div id="sign-in-error1"></div>
				<div class="sign-in-form">
					<form>
						<div class="form-group">
							<input id="sign-in-email" class="form-control" type="email" name="email" placeholder="Email ID" required>
						</div>
						<div class="form-group">
							<input class="reset-hide sign-up-hide form-control" id="sign-in-password" type="password" name="password" placeholder="Password" required>
						</div>
					</form>
				</div> 
				<div class="error" id="sign-in-error2" style="display:none;">
					<div id="sign-in-error-message">The username or password is incorrect</div>
				</div>
				    <img id="loadingDiv" src="./<?php echo projectFolderName; ?>/image/loading.gif" style="display:none;width:32px;"/>
				<div id="sign-in-button">
					<a class="sign-up-hide btn btn-danger" onclick="sign_in_submit(0)" id="sign-in-submit" checked="checked">
					SIGN IN</a>
					<a class="sign-up-show btn btn-danger" onclick="sign_in_submit(1)" id="sign-in-submit" checked="checked" style="display:none">
					SIGN UP</a>
					<div class="sign-in-forget-password sign-up-hide reset-hide">
						<a id="reset_password">Reset Password</a>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<div class="reset-hide text-center" id="sign-in-signup">
					<span class="sign-up-notify sign-up-hide">
						"Don't have an account yet? "
						<a id="sign-up-text" onclick="signUptext()">SIGN UP</a>
					</span>
					<span class="sign-up-notify sign-up-show" style="display:none;">
						Already have an account
						<a id='sign-in-text' onclick="sign_in()" >SIGN IN</a>
					</span>
				</div>
			</div>
		</div>
	</div>
</div>
<?php 
/*
<script src="./<?php echo projectJSFolderName; ?>/signIn.js"></script>
*/
?>
<script>
	progressChange(50);
</script>