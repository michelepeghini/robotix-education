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
$pdo = create_pdo($host_name, $db_name, $robotix_guest, true); 

// Create response instance.
$response= new Response();

$videos_q = "SELECT * FROM video WHERE 1 ORDER BY id DESC";
$playlist_q = "SELECT * FROM playlist WHERE 1";
$kit_q = "SELECT id, name FROM kit WHERE 1";
$queries_array = array(
	"videos" => $videos_q, 
	"playlists" => $playlist_q, 
	"kitsList" => $kit_q
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

// Add playlist and kit IDs to each video
$constructed_response = $response->get_response();
$videos_in_pl_q = "SELECT video_id, playlist_id FROM videos_in_pl WHERE 1";
$kit_build_q = "SELECT * FROM kit_build WHERE 1 ORDER BY kit_id ASC";

$statement = $pdo->prepare($videos_in_pl_q);
if($statement) {
	$videos_in_pl_result = fetch_data($pdo, $statement);
};
$statement = $pdo->prepare($kit_build_q);
if($statement) {
	$kit_build_result = fetch_data($pdo, $statement);
};

for($i = 0; $i < count($constructed_response['elements']['videos']); $i++) { 
	$constructed_response['elements']['videos'][$i]['in_playlist'] = array();
	$constructed_response['elements']['videos'][$i]['in_kit'] = array();
		
	for($j = 0; $j < count($videos_in_pl_result); $j++) {
		if ($constructed_response['elements']['videos'][$i]['id'] == $videos_in_pl_result[$j]['video_id']){
			array_push($constructed_response['elements']['videos'][$i]['in_playlist'], $videos_in_pl_result[$j]['playlist_id']);
		};
	};
	for($j = 0; $j < count($kit_build_result); $j++) {
		if ($constructed_response['elements']['videos'][$i]['id'] == $kit_build_result[$j]['video_id']){
			array_push($constructed_response['elements']['videos'][$i]['in_kit'], $kit_build_result[$j]['kit_id']);
		};
	};
}

// Output results
output_response($constructed_response);