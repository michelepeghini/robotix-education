<?php
//
// Remove a video from DB
//

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');

// Import directories and queries for file operations
require_once('../../common/file_operations.php');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_admin); 

// Create response instance.
$response= new Response();

// READ REQUEST DATA
@$video_id = $_GET['video_id']; 
	
$delete_video_q = "DELETE FROM `video` WHERE `id`=$video_id;";
$statement = $pdo->prepare($delete_video_q);
if ($statement->execute()) {
	foreach(glob($file_paths['video'] . "/" . $video_id . "/*") as $file) {
		unlink($file);
	};
	if (rmdir($file_paths['video']. "/" . $video_id)) {
		$response->set_success();
		$response->add_data("video_id", $pdo->lastInsertId());	
	} else {
		$response->set_message("Video deleted, but unable to remove files!");
	};
} else {
	$response->set_message("Unable to delete video!");
};

output_response($response->get_response());