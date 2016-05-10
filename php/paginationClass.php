<?php
/*
Project Name       	: 	Pulsar - Content Verification System
File Or Class Name 	: 	
Description			: 	
Copyright          	:	Copyright © 2009 - 2014 Venera Technologies.
*/
class MyPagina {
	
	var $sql;
	var $result;
	
	var $get_var = QS_VAR;
	var $rows_on_page = NUM_ROWS;
	var $str_forward = STR_FWD;
	var $str_backward = STR_BWD;
	
	var $all_rows;
	var $num_rows;
	
	var $page;
	var $number_pages;
	
	// constructor
	function MyPagina() {
		$this->connect_db();
	}
	// sets the current page number
	function set_page() {
		$this->page = (isset($_REQUEST[$this->get_var]) && $_REQUEST[$this->get_var] != "") ? $_REQUEST[$this->get_var] : 0;
		return $this->page;
	}
	// gets the total number of records 
	function get_total_rows() {
		$tmp_result = mysql_query($this->sql);
		$this->all_rows = mysql_num_rows($tmp_result);
		mysql_free_result($tmp_result);
		return $this->all_rows;
	}
	// database connection
	function connect_db() {
		global $DB_SERVER, $DB_USER, $DB_PASSWORD;
		$conn_str = mysql_connect($DB_SERVER, $DB_USER, $DB_PASSWORD);
		mysql_select_db(DB_NAME, $conn_str);
	}
	// get the totale number of result pages
	function get_num_pages() {
		$this->number_pages = ceil($this->get_total_rows() / $this->rows_on_page);
		return $this->number_pages;
	}
	// returns the records for the current page
	function get_page_result() {
		$start = $this->set_page() * $this->rows_on_page;
		//$page_sql = sprintf("LIMIT 0, 50",$this->sql, $start, $this->rows_on_page);
		$page_sql = sprintf("%s LIMIT %s, %s", $this->sql, $start, $this->rows_on_page);
		$this->result = mysql_query($page_sql);
		return $this->result;
	}
	// get the number of rows on the current page
	function get_page_num_rows() {
		$this->num_rows = mysql_num_rows($this->result);
		return $this->num_rows;
	}
	// free the database result
	function free_page_result() {
		mysql_free_result($this->result);
	}
	// function to handle other querystring than the page variable
	function rebuild_qs($curr_var) {
		if (!empty($_SERVER['QUERY_STRING'])) {
			$parts = explode("&", $_SERVER['QUERY_STRING']);
			$newParts = array();
			foreach ($parts as $val) {
				if (stristr($val, $curr_var) == false)  {
					array_push($newParts, $val);
				}
			}
			if (count($newParts) != 0) {
				$qs = "&".implode("&", $newParts);
			} else {
				return false;
			}
			return $qs; // this is your new created query string
		} else {
			return false;
		}
	} 
	// this method will return the navigation links for the conplete recordset
	function navigation($separator = " | ", $css_current = "", $back_forward = false) {
		$max_links = NUM_LINKS;
		$curr_pages = $this->set_page(); 
		$all_pages = $this->get_num_pages() - 1;
		$var = $this->get_var;
		$navi_string = "";
		if (!$back_forward) {
			$max_links = ($max_links < 2) ? 2 : $max_links;
		}
		if ($curr_pages <= $all_pages && $curr_pages >= 0) {
			if ($curr_pages > ceil($max_links/2)) {
				$start = ($curr_pages - ceil($max_links/2) > 0) ? $curr_pages - ceil($max_links/2) : 1;
				$end = $curr_pages + ceil($max_links/2);
				if ($end >= $all_pages) {
					$end = $all_pages + 1;
					$start = ($all_pages - ($max_links - 1) > 0) ? $all_pages  - ($max_links - 1) : 1;
				}
			} else {
				$start = 0;
				$end = ($all_pages >= $max_links) ? $max_links : $all_pages + 1;
			}
			if($all_pages >= 1) {
				$forward = $curr_pages + 1;
				$backward = $curr_pages - 1;
				$navi_string = ($curr_pages > 0) ? "<strong><a class=\"$css_current\" href=\"".$_SERVER['PHP_SELF']."?".$var."=".$backward.$this->rebuild_qs($var)."\">".$this->str_backward."</a></strong>&nbsp;&nbsp;&nbsp;" : $this->str_backward."&nbsp;&nbsp;&nbsp;";
				if (!$back_forward) {
					for($a = $start + 1; $a <= $end; $a++){
						$theNext = $a - 1; // because a array start with 0
						if ($theNext != $curr_pages) {
							$navi_string .= "<a class=\"$css_current\" href=\"".$_SERVER['PHP_SELF']."?".$var."=".$theNext.$this->rebuild_qs($var)."\">";
							$navi_string .= $a."</a>";
							$navi_string .= ($theNext < ($end - 1)) ? $separator : "";
						} else {
							$navi_string .= "<strong>".$a."</strong>";
							$navi_string .= ($theNext < ($end - 1)) ? $separator : "";
						}
					}
				}
				$navi_string .= ($curr_pages < $all_pages) ? "&nbsp;&nbsp;&nbsp;<strong><a class=\"$css_current\" href=\"".$_SERVER['PHP_SELF']."?".$var."=".$forward.$this->rebuild_qs($var)."\">".$this->str_forward."</a></strong>" : "&nbsp;&nbsp;&nbsp;".$this->str_forward;
			}
		}
		return $navi_string;
	}
	// this info will tell the visitor which number of records are shown on the current page
	function page_info($to = "-") {
		$first_rec_no = ($this->set_page() * $this->rows_on_page) + 1;
		$last_rec_no = $first_rec_no + $this->rows_on_page - 1;
		$last_rec_no = ($last_rec_no > $this->get_total_rows()) ? $this->get_total_rows() : $last_rec_no;
		$to = trim($to);
		$info = $first_rec_no." ".$to." ".$last_rec_no;
		return $info;
	}
	// simple method to show only the page back and forward link.
	function back_forward_link() {
		$simple_links = $this->navigation(" ", "", true);
		return $simple_links;
	}
}
?>