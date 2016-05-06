<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
	require_once 'ErrorHandling.php';
	require_once 'EventHandling.php';
/*
	Description of RPU_MAP:-
	
	$RPU_MAP['request_name']	=	array( 'function_name', array('func_arg_1','func_arg_2','func_arg_3')	);
	(string) func_arg_1: It is the key as recieved in request parameter
	
	The modules will check if the global variable RPU_MAP is set or not.
	If not, then they will create this global variable and push the indexes corresponding to the request, function name and arguments name
	
*/
$RPU_MAP	=	array();

function RPU_GetCallBackRequestParameters($dataArray, $keysArray){
	$argumentsArray	=	array();
	for($i = 0; $i < count($keysArray); $i++){
		if(	isset( $dataArray[ $keysArray[$i] ] )	){
			$argumentsArray[$i]	=	$dataArray[ $keysArray[$i] ];
		}
	}
	
	return $argumentsArray;
}

function RPU_CloseConnection_SendOutput($output){
	ob_end_clean();
	header("Connection: close");
	ob_start();
	echo $output;
	$size = ob_get_length();
	header("Content-Length: $size");
	ob_end_flush(); 
	flush();      
	session_write_close();
	
	return true;
}
/*
	After final output is sent the request might need to continue some processing.
	For this rpu extends this api. 
	If rpu config has 'extended_processing' set with value of 'callback function name' as string, then that function will be called 
	after sending output to client, with broken connection.
	Setting extended_processing_with_rpu_config to true will pass rpu config with arguments array.
	
	@params: callback (string) should be callable.
	@params: arguments This could be assoc array. For now it will be rpu final response that is flushed to client.
	arguments array structure array(
		'rpu_response'	=>$rpu_response,
		'rpu_config'	=>$rpu_config
	)
	return value: The method will just process the request and return true
*/
function RPU_ExtendedProcessing($callback, $arguments){
	if($callback != '' && is_callable($callback)) {
		call_user_func_array($callback	,	array($arguments));
	}
	
	return true;
}

/*
	@param: arg can be assoc array.
	possible key value pairs are:-
		'config'				=>	configuration to be used for module function calls. This assumes that config will always be the last parameter to the functions
		'error_codes'			=>	assoc array of error codes that will be used to output right message to the client or final response of the rpu_process_request
		//'callback'			=>	callable function. If the function is called then argument will be output of module api,
		'send_response_indexes'	=>	indexed array that specifies which of the indexes (if present in module output be returned in final output

*/
function RPU_ProcessRequest($arg	=	''){
	global $RPU_MAP;
	$output	=	array('status'	=>	false);
	
	$module_config	=	'';
	if(isset($arg['config']))
		$module_config	=	$arg['config'];
		
	if(	isset($_REQUEST['request'])	&& isset($RPU_MAP[$_REQUEST['request']])) {
		
		if(is_callable($RPU_MAP[$_REQUEST['request']][0])) {
			$method_arguments	=	array();
			$data_array	=	array();
			if(isset($_REQUEST['data']))
				$data_array	=	$_REQUEST['data'];
			
			if(isset($arg['data_array']) && $arg['data_array']	===	true) {
				if(isset($arg['data_array'])) {
					$data_array	=	array_merge($data_array, $arg['data_array_add']);
				}
				$method_arguments		=	array($data_array);
			}
			else{
				$method_arguments	=	RPU_GetCallBackRequestParameters($data_array , $RPU_MAP[$_REQUEST['request']][1]);
			}
			
			if($module_config != '')
				array_push($method_arguments, $module_config);
				
			$output	=	call_user_func_array($RPU_MAP[$_REQUEST['request']][0]	,	$method_arguments );
		}
	
		$callback	=	'';
		if(isset($arg['callback']))
			$callback	=	$arg['callback'];
		
		$headerProcess	=	true;
		if(isset($arg['rpu_send_headers']))
			$headerProcess	=	$arg['rpu_send_headers'];
			
		if($callback != '' && is_callable($callback)) {
			call_user_func_array($callback	,	array($output));
		}

		if(!isset($APP_CONFIG)) {
			//If rpu_error_logging in app config is not off then log the error_messages
			if(!isset($APP_CONFIG['RPU_ERROR_LOGGING']) || $APP_CONFIG['RPU_ERROR_LOGGING'] != false)
				RPU_ErrorMgr($output, $arg);
			
			//If rpu_event_logging in app config is not off then log the event_messages
			if(!isset($APP_CONFIG['RPU_EVENT_LOGGING']) || $APP_CONFIG['RPU_EVENT_LOGGING'] != false)
				RPU_EventMgr($output, $arg);
		}
		
		//If headers are present in module output and rpu_send_headers is not false in rpu_config(arg) then send headers
		if($headerProcess)
			RPU_ProcessHeaders($output);
		
		// sanitize the final output
		$output	=	RPU_SanitizeOutput($output, $arg);
	}
	
	return $output;
}

/*
	1) If event_description is present then log the event_messages
*/
function RPU_ProcessHeaders($output	=	false){
	
	if(is_array($output) && isset($output['headers'])) {
		for($i = 0; $i <count($output['headers']); $i++){
			header($output['headers']);
		}
	}
	return true;
}

/*
	1) If event_description is present then log the event_messages
*/
function RPU_EventMgr($output	=	false){
	
	if(is_array($output) && isset($output['event_description'])) {
		EventLogging($output['event_description']);	
	}
	return true;
}

/*
	1) If event_description is present then log the event_messages
*/
function RPU_ErrorMgr($output	=	false){
	
	if(is_array($output) && isset($output['error_description'])) {
		ErrorLogging($output['error_description']);	
	}
	
	return true;
}

/*
	1) First it deletes the output indexes which are not be sent to the client or in final response
	2) Then it replaces error codes with the corresponding error messages
*/
function RPU_SanitizeOutput($output	=	false, $arg = ''){
	
	if(is_array($output) && is_array($arg) && isset($arg['send_response_indexes'])) {
		
		foreach($output as $key => $value ){
			if(!in_array($key, $arg['send_response_indexes'])){	//delete the indexes which are not be sent to the client or in final response
				unset($output[$key]);
			}
		}

		if(!empty($output['error']) && !empty($arg['error_codes']) && !empty($arg['error_codes'][$output['error']]) ){
			$output['error']	=	$arg['error_codes'][$output['error']];
		}
	}
	return $output;
}
?>