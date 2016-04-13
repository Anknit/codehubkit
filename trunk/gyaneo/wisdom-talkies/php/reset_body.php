<?php
?>
<div id="main" class="container-fluid">
	<div id="home" class="section col-md-9 col-sm-12 section-cover">
		<div id="categories" class="col-md-12">
		</div>
	</div>
<div id="reset-password" class="modal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header text-center">
				<h4 class="reset"> Set New Password</h4>
			</div>
			<div class="modal-body text-center">
					<form action="<?php echo $reset ;?>" class="form-horizontal" method="post">
						<div class="form-group">
							<label class="control-label col-md-3">Password</label>
							<div class="col-md-9">
							<input id="reset-in-password" type="password" class="form-control" name="password" placeholder="Password" pattern=".{6,}" required title="Password length must be minimum 6">
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Confirm Password</label>
							<div class="col-md-9">
								<input id="reset-confirm-password" type="password" class="form-control" placeholder="Confirm password" pattern=".{6,}" required title="Password length must be minimum 6">
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3"></label>
							<div class="col-md-9">
								<p id="error"></p>
							</div>
						</div>
					</form>
			</div> 
			<div class="modal-footer">
				<div class="reset-hide text-center" id="sign-in-signup">
					<button class="btn btn-default" id="reset-text" >Reset</button>
					
				</div>
			</div>
		</div>
	</div>
</div>
	<div id="sidebar" class="col-md-3 col-sm-12 col-md-offset-0 col-sm-offset-0 pull-right">
		<div class="row">
			<div class="col-md-12">
				<div class="sideBannerItem text-center section-cover">
					<img src="./<?php echo projectFolderName; ?>/image/sideItem2.png" alt="Right Banner"/>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<div class="sideBannerItem text-center section-cover">
					<img src="./<?php echo projectFolderName; ?>/image/sideItem1.png" alt="Right Banner"/>
				</div>
			</div>
		</div>
	</div>
</div>