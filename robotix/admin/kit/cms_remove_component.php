<?php

// CMS COMPONENT REMOVE

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');

// Import directories and queries for file operations
require_once('../../common/file_operations.php');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_admin); 

// Create response instance.
$response= new Response();

// READ REQUEST DATA
@$comp_id = $_GET['component_id']; 

$remove_comp_q = "DELETE FROM `component` WHERE id=".$comp_id.";";
$statement = $pdo->prepare($remove_comp_q);
if ($statement->execute()) {
	$response->set_success();
} else {
	$response->set_message("Unable to delete kit!");
};

output_response($response->get_response());

