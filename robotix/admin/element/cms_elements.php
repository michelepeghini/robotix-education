<?php 
//
// Fetch data for videos page given video ID and output results
//

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_guest); 

// Create response instance.
$response= new Response();

$elements_q = "SELECT id, name, image FROM home_element WHERE 1";

// Prepare queries, run them, add resuts in response object

$statement = $pdo->prepare($elements_q);
if ($statement) {
	$query_result = fetch_data($pdo, $statement);
	$response->add_data("elements", $query_result);
} else {
	$response->set_fail();
	$response->set_message("Database error, please refresh page.");
	output_response($response->get_response());
	exit;
}

$response->set_success();

// Output results
output_response($response->get_response());