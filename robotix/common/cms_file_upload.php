<?php

// CMS FILE UPLOAD

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../common/response_class.php');

// Import directories and queries for file operations
require_once('../common/file_operations.php');

// Create response instance. Prepare and run query
$response= new Response();

//set required variables
$data = json_decode($_POST['data']);
$element_id = $data->element_id;
$op_type = $data->op_type;
$file_name_arr = explode(".",$_FILES['file']['name']);
$file_extension = array_pop($file_name_arr);
$new_file_name = $element_id.".".$file_extension;
$temp_file = $_FILES['file']['tmp_name'];
$path = $file_paths[$op_type] . "/" . $element_id;  

//check if directory exits
if(is_dir($path)) {
	// remove already existing file if exists 
	$path .= "/".$new_file_name;
	if(file_exists($path)) {
		unlink($path);
	};
} else {
	//directory does not exist, create it
	mkdir($path, 0777);	
	$path .= "/".$new_file_name;
};

// copy new file to destination
if (move_uploaded_file($temp_file, $path)){
	chmod($path, 0777);
	$response->set_success();
	$response->set_message($path);
} else {
	$response->set_message("Unable to store ". $new_file_name .".");
};

output_response($response->get_response());