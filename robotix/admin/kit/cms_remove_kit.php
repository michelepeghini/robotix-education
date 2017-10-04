<?php
//
// Remove a kit from DB
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
@$kit_id = $_GET['kit_id']; 


	
$delete_kit_q = "DELETE FROM `kit` WHERE `id`=$kit_id;";
$statement = $pdo->prepare($delete_kit_q);
if ($statement->execute()) {
	foreach(glob($file_paths['kit'] . "/" . $kit_id . "/*") as $file) {
		unlink($file);
	};
	if (rmdir($file_paths['kit']. "/" . $kit_id)) {
		$response->set_success();
	} else {
		$response->set_message("kit deleted, but unable to remove files!");
	};
} else {
	$response->set_message("Unable to delete kit!");
};

output_response($response->get_response());