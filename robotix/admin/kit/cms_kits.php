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

$kits_q = "SELECT kit.id, kit.name, kit.image FROM kit WHERE 1";
$comp_q = "SELECT * FROM component WHERE 1";

$queries_array = array(
	"kits" => $kits_q,
	"components" => $comp_q
);


// Prepare queries, run them, add resuts in response object
foreach($queries_array as $key => $query) {
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

$response->set_success();

// Output results
output_response($response->get_response());