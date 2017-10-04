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

$playlist_id = $_GET['playlist_id'];

// Create response instance.
$response= new Response();

$playlist_q = "SELECT * FROM playlist WHERE id = ?";
$videos_in_pl_q = "SELECT * FROM  videos_in_pl WHERE playlist_id = ?";
$queries_array = array(
	"playlist" => $playlist_q, 
	"videosInPlaylist" => $videos_in_pl_q
);

// Prepare queries, run them, add resuts in response object
foreach($queries_array as $key => $query) {
	$statement = $pdo->prepare($query);
	$statement->bindValue(1, $playlist_id);
	if ($statement) {
		if ($key == "playlist") {
			$query_result = fetch_data($pdo, $statement)[0];
		} else {
			$query_result = fetch_data($pdo, $statement);
		}
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