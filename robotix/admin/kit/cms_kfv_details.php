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
$videos_q = "SELECT id, name , yt_id FROM video WHERE 1;";
$statement = $pdo->prepare($videos_q);
$query_result = fetch_data($pdo, $statement);
$response->add_data("videos", $query_result);

$kits_q = "SELECT * FROM kit WHERE id = ?";
$kfv_q = "SELECT kit_id, video_id FROM kit_build WHERE kit_id = ?;";
$queries_array = array(
	"kit" => $kits_q, 
	"kitForVideos" => $kfv_q
);

foreach($queries_array as $key => $query) {
	$statement = $pdo->prepare($query);
	$statement->bindValue(1, $query_params);
	if ($statement) {
		$query_result = fetch_data($pdo, $statement);
		if($key == "kit"){
			$response->add_data($key, $query_result[0]);	
		} else {
			$response->add_data($key, $query_result);	
		}
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