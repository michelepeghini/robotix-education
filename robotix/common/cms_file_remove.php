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

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_admin); 
	
$request_data = file_get_contents("php://input");
$data = json_decode($request_data);
@$file_name = $data->file_name;
@$element_id = $data->element_id; 
@$op_type = $data->op_type;

$path = $file_paths[$op_type]. "/" . $element_id;

if(file_exists($path . "/" . $file_name)) {
	if(unlink($path . "/" . $file_name)) {
		//if directory has no files delete it
		if (count(scandir($path."/*") == 2)) {
			rmdir($path);
		};
		$response->set_success();
	} else {
		$response->set_message("Unable to remove file!");
	};
};

output_response($response->get_response());