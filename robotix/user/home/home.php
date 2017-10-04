<?php 
//
// Fetch data for Homepage from DB and output results
//

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');
	
// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_guest, true); 

// Create response instance. Prepare and run query
$response = new Response();
$home_elements_q = "SELECT * FROM home_element WHERE 1";
$queries_array = array(
	"homeElements" => $home_elements_q
);

foreach ($queries_array as $key => $query) {
	$statement = $pdo->prepare($query);
	if ($statement) {
		$query_result = fetch_data($pdo, $statement);
		$response->add_data($key, $query_result);
	} else {
		$response->set_fail();
		$response->set_message("Database error, please refresh page.");
		output_response($response->get_response());
		exit;
	}
};
$response->set_success($key);
// Output results
output_response($response->get_response());