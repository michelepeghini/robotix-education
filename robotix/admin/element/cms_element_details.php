<?php 
//
// Fetch data for single element page given element ID and output results
//

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_guest); 

// Create response instance. Prepare and run query
$response= new Response();
$query_params = $_GET['element_id'];

// Define queries and initializes query array, all queries use element_id as bound value
$elements_q = "SELECT * FROM home_element WHERE id = ?";

// Get Element data from DB
$statement = $pdo->prepare($elements_q);
$statement->bindValue(1, $query_params);
if ($statement) {
	$element_result = fetch_data($pdo, $statement)[0];
	$response->add_data("element", $element_result);
} else {
	$response->set_fail();
	$response->set_message("Database error, Unable to fetch Element details.");
	output_response($response->get_response());
	exit;
}

$response->set_success();

// Output results
output_response($response->get_response());