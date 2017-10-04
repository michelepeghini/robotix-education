<?php
//
// Save Playlist and videos to DB
//

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_admin); 

// Create response instance.
$response= new Response();

// READ REQUEST DATA
$request = json_decode(file_get_contents("php://input"));
@$video = $request->video; 

try {
	// insert video into DB
	$insert_videos_q = "INSERT INTO `video`(`name`, `description`, `yt_id`) VALUES ("
		.trim($pdo->quote($video->name)).","
		.trim($pdo->quote($video->description)).","
		.trim($pdo->quote($video->yt_id)).");";	
	$statement = $pdo->prepare($insert_videos_q);
	if ($statement->execute()) {
		$response->set_success();
		$response->add_data("id",array($pdo->lastInsertId()));
	} else {
		$response->set_message("Unable to insert Video: ".$video->name."!");	
	};	
// add error to message to response and output response
} catch(Exception $e){
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

output_response($response->get_response());
