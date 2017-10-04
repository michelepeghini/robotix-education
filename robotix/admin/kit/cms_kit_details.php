<?php 
//
// Fetch data for single kit page given kit ID and output results
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
$query_params = $_GET['kit_id'];

// Define queries and initializes query array, all queries use kit_id as bound value
$kits_q = "SELECT * FROM kit WHERE id = ?";
$components_q = " SELECT * FROM component WHERE 1";
$parts_q = "SELECT p.component_id, p.component_qty FROM part AS p WHERE p.kit_id = ?";

// Get Kit data from DB
$statement = $pdo->prepare($kits_q);
$statement->bindValue(1, $query_params);
if ($statement) {
	$kit_result = fetch_data($pdo, $statement)[0];
} else {
	$response->set_fail();
	$response->set_message("Database error, Unable to fetch Kit details.");
	output_response($response->get_response());
	exit;
}

// Gte Components data from DB
$statement = $pdo->prepare($components_q);
if ($statement) {
	$components_result = fetch_data($pdo, $statement);
} else {
	$response->set_fail();
	$response->set_message("Database error, Unable to fetch Kit details.");
	output_response($response->get_response());
	exit;
}

// Get Parts data from DB
$statement = $pdo->prepare($parts_q);
$statement->bindValue(1, $query_params);
if ($statement) {
	$parts_result = fetch_data($pdo, $statement);
} else {
	$response->set_fail();
	$response->set_message("Database error, Unable to fetch Kit details.");
	output_response($response->get_response());
	exit;
}

// Add components quantity for kit to list of components
// and make a copy of components that have quantity in separate array, used to determine update VS insert operation during kit update operation 
$oldComponents = array();
for ($i = 0; $i < count($components_result); $i++) {
	$components_result[$i]["qty"] = 0;
	for ($j = 0; $j < count($parts_result); $j++) {
		if ($components_result[$i]["id"] == $parts_result[$j]["component_id"]) {
			$components_result[$i]["qty"] = $parts_result[$j]["component_qty"];
			//$oldComponents[] = $components_result[$i];
		} 
	}
};

$kit_result["componentsInKit"] = $components_result;
//$kit_result["oldComponents"] = $oldComponents;
$response->add_data("kit", $kit_result);
$response->set_success();

// Output results
output_response($response->get_response());