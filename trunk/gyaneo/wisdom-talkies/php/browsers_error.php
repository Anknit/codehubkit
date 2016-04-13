<?php
function log_browser_error($msg,$url,$line,$col)
{
	ErrorLogging("Browsers error at line no. ".$line." and column".$col.";url=".$url.";message=".$msg);	//error logging curl failed
}
