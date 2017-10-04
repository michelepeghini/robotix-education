<?php

//
// Response class: provides methods to standardize server responses 
//

class Response {
	private $success;
	private $message;
	private $elements;
	
	public function __construct() {
		$this->success = false;
		$this->message = array();
		$this->elements = array();
	}
	// Returns whether message array is empty or not
	public function has_message () {
		return ($this->message ? true : false);
	}
	// Sets success attribute to true
	public function set_success () {
		$this->success = true;
	}
	// Sets success attribute to false and sets "fail" message
	public function set_fail () {
		$this->success = false;
	}
	// Adds an array element in data as (key name, query result) pair
	public function add_data($key_name, $result_array) {
		$this->elements[$key_name] = $result_array;
	}
	// Sets given message to message array
	public function set_message($msg) {
			array_push($this->message, $msg);
	}
	// Returns formatted response as an associative array
	public function get_response() {
		$response = array(
			"success" => $this->success,
			"message" => $this->message,
			"elements" => $this->elements
		);
		return $response;
	}	
};