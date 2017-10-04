<?php 
//
// Fetch data for single video page given video id and output results
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
$query_params = $_GET['playlist_id'];

// Define queries and initializes query array, all queries use video_id as bound value
$playlist_q = "SELECT * FROM playlist WHERE id = ?;";
$playlist_videos_q = "
	SELECT * 
	FROM video AS v
	WHERE v.id IN (
		SELECT vp.video_id
		FROM videos_in_pl AS vp
		WHERE vp.playlist_id = ?);";
$queries_array = array(
	"playlist" => $playlist_q,
	"playlistVideos" => $playlist_videos_q
);

// Prepare queries, run them, add resuts in response object
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