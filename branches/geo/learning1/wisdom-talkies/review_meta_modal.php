<?php
?>
<div id="mod_main" class="container-fluid">
	<div id="review_metadata" class="modal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header text-center">
					<h4 class="metadata_heading"> Metadata</h4>
				</div>
				<div class="modal-body text-center">
					<form action="" class="form-horizontal" method="post">
						<div class="form-group">
							<label class="control-label col-md-3"></label>
							<div class="col-md-9">
								<p id="moderator_change_data_warning"></p>
							</div>
						</div>						
						<div class="form-group">
							<label class="control-label col-md-3">Title</label>
							<div class="col-md-7">
								<input id="moderator_title" type="text" class="form-control mod_input" name="title">
							</div>
							<div class="compulsory_mod_check" data-label>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Category</label>
							<div class="col-md-7">
								<!-- <input id="moderator_category" type="text" class="form-control" name="category"> -->
								<select id=moderator_category class="mod_input">
									<?php 
										for($i=0;$i<$temp_length_category;$i++)
										{
											if($d_data_category[$i]['status']	==	"verified")
											{
												echo "<option value=".$d_data_category[$i]['catId'].">".$d_data_category[$i]['catName']."</option>";
											}
										}
										echo "<option value='other_category'>other</option>";	
									?>
								</select>
							</div>
							<div class="compulsory_mod_check" data-label>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Other category</label>
							<div class="col-md-7">
								<input id="moderator_other_category" type="text" class="form-control mod_input" name="other_category">
							</div>
							<div class="compulsory_mod_check" data-label>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Description</label>
							<div class="col-md-7">
								<textarea id="moderator_description" type="text" class="form-control mod_input" name="description"></textarea>
							</div>
							<div class="compulsory_mod_check" data-label>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Suggested Keywords</label>
							<div class="col-md-7">
								<textarea id="moderator_keywords" type="text" class="form-control mod_input" name="keywords"></textarea>
							</div>
							<div class="compulsory_mod_check" data-label>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Language</label>
							<div class="col-md-7">
								<!-- <input id="moderator_language" type="text" class="form-control" name="language">-->
								<select id=moderator_language class="mod_input">
								<?php 
									for($i=0;$i<$temp_length_language;$i++)
									{
										if($d_data_language[$i]['status']	==	"verified")
										{
											echo "<option value=".$d_data_language[$i]['id'].">".$d_data_language[$i]['language']."</option>";
										}
									}
									echo "<option value='other_language'>other</option>";
								?>
								</select>
							</div>
							<div class="compulsory_mod_check" data-label>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Other language</label>
							<div class="col-md-7">
								<input id="moderator_other_language" type="text" class="form-control mod_input" name="other_language">
							</div>
							<div class="compulsory_mod_check" data-label>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Age-group</label>
							<div class="col-md-7">
								<!-- <input id="moderator_title" type="text" class="form-control" name="title">-->
								<select id=moderator_age class="mod_input">
									<option value=1>Kids</option>
									<option value=2>Teens</option>
									<option value=3>Adults</option>
									<option value=4>All</option>
								</select>
							</div>
							<div class="compulsory_mod_check" data-label>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3">Items-used</label>
							<div class="col-md-7">
								<textarea id="moderator_items" type="text" class="form-control mod_input" name="items"></textarea>
							</div>
							<div class="compulsory_mod_check" data-label>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3"></label>
							<div class="col-md-9">
								<p id="moderator_warning"></p>
							</div>
						</div>
					</form>
				</div> 
				<div class="modal-footer">
					<div class="approve_hide text-center" id="mod_approve_hide">
						<button class="btn btn-default" id="moderator_final_approve" disabled>Approve</button>
					</div>
					<div class="issue_unhide text-center" id="mod_issue_unhide">
						<button class="btn btn-default review_issue" id="moderator_issue">NOT Approve</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>