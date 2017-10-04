<?php
//
// Remove a element from DB
//

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
@$element_id = $_GET['element_id']; 
	
$delete_element_q = "DELETE FROM `home_element` WHERE `id`=$element_id;";
$statement = $pdo->prepare($delete_element_q);
if ($statement->execute()) {
	foreach(glob($file_paths['element'] . "/" . $element_id . "/*") as $file) {
		unlink($file);
	};
	if (rmdir($file_paths['element']. "/" . $element_id)) {
		$response->set_success();
	} else {
		$response->set_message("Element deleted, but unable to remove files!");
	};
} else {
	$response->set_message("Unable to delete Element!");
};

output_response($response->get_response());