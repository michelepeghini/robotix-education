<?php 
//
// Fetch data for single kit page given kit ID and output results
//

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_classphp');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_guest); 

// Create response instance. Prepare and run query
$response= new Response();
$query_params = $_GET['kit_id'];

// Define queries and initializes query array, all queries use kit_id as bound value
$kits_q = "SELECT * FROM kit WHERE id = ?";
$components_q = "
	SELECT c.name , p.component_qty 
	FROM component AS c, part AS p
	WHERE p.kit_id = ? AND c.id = p.component_id;";
$videos_q = "
	SELECT v.id, v.name , v.yt_id 
	FROM video AS v, kit_build AS kb
	WHERE kb.kit_id = ? AND kb.video_id = v.id;";
$queries_array = array(
	"kit" => $kits_q, 
	"componentsInKit" => $components_q, 
	"videosForKit" => $videos_q
);

foreach($queries_array as $key => $query) {
	$statement = $pdo->prepare($query);
	$statement->bindValue(1, $query_params);
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