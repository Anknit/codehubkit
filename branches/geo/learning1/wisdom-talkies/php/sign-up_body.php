<?php
?>
<div id="main" class="container-fluid">
	<div id="home" class="section col-md-9 col-sm-12 section-cover">
		<div id="categories" class="col-md-12">
		</div>
	</div>
<div id="sign-up-details" class="modal" data-backdrop="static">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header text-center">
				<h4 class="sign-up-hide"> Profile Details</h4>
			</div>
			<div class="modal-body text-center">
					<form action="" class="form-horizontal" method="post"><?php // echo $sign_up_pass ;?>
						<div class="form-group">
							<label class="control-label col-md-3">First Name</label>
							<div class="col-md-9">
								<input id="sign-in-firstname" data-server=true type="text" class="form-control" name="first_name" placeholder="First name" >
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Last Name</label>
							<div class="col-md-9">
							<input id="sign-in-lastname" data-server=true type="text" class="form-control" name="last_name" placeholder="Last name" >
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Age</label>
							<div class="col-md-9">
							<input id="sign-in-age" data-server=true type="text" name="age" class="form-control" placeholder="Age">
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Country</label>
							<div class="col-md-9">
								<select id="sign-in-location" data-server=true type="text" name="location" class="form-control" placeholder="Location">
								</select>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Phone</label>
							<div class="col-md-9">
							<input id="sign-in-phone" data-server=true type="text" name="phone" class="form-control" placeholder="Phone" >
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Password</label>
							<div class="col-md-9">
							<input id="sign-in-password" data-server=true type="password" class="form-control" name="password" placeholder="Password" pattern=".{6,}" required title="Password length must be minimum 6">
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Confirm Password</label>
							<div class="col-md-9">
								<input id="sign-in-confirm-password" type="password" class="form-control" placeholder="Confirm password" pattern=".{6,}" required title="Password length must be minimum 6">
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
					<button class="btn btn-default" id="sign-up-text" >SIGN UP</button>
					
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