<?php 
require_once __DIR__.'/recommend_class.php';

require_once __DIR__.'./../../Common/php/commonfunctions.php';

function recommend($data, $recommend_config = '') {
	$output				=	array('status'	=>	false);
	$recommend_config	=	config_compliance($recommend_config);
	$_recommend			=	getclassObject('_recommend', $recommend_config);

	if($_recommend->recommend_init_status)
		return $_recommend->recommend($data);
	else
		return $output;
}