<?php
//
// Remove a video from DB
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
@$pl_id = $_GET['pl_id']; 

$delete_pl_q = "DELETE FROM `playlist` WHERE `id`=$pl_id;";
$statement = $pdo->prepare($delete_pl_q);
if ($statement->execute()) {
		$response->set_success();
} else {
	$response->set_message("Unable to delete playlist!");
};

output_response($response->get_response());