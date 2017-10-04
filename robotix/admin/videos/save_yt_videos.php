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

// Create response instance. Prepare and run query
$response= new Response();

// READ REQUEST DATA
$request = json_decode(file_get_contents("php://input"));
@$playlist = $request->params->playlist;
@$videos = $request->params->videos; 

// ensures insert operations in all tables [playlist, video and videos_in_pl] are successfull
$pdo->beginTransaction();

try {
	// insert playlist data in DB
	$insert_pl_q = "INSERT INTO playlist(name, description, yt_pl_id) VALUES (:name, :description, :yt_pl_id);"; 
	$statement = $pdo->prepare($insert_pl_q);
	$statement->bindValue(':name', $playlist->name);
	$statement->bindValue(':description', $playlist->description);
	$statement->bindValue(':yt_pl_id', $playlist->yt_pl_id);

	//if playlist insertion successful, retrieve playlist ID and updata $playlist variable
	if ($statement->execute()) {
		$playlist->id = $pdo->lastInsertId();
	} else {
		$response->set_message("Unable to insert Playlist!");
	};

	// insert videos in video table and insert video/playlist reference in videos_in_pl associative table
	foreach($videos as &$video) {
		$insert_videos_q = "INSERT INTO `video`(`name`, `description`, `yt_id`) VALUES ("
			.trim($pdo->quote($video->name)).","
			.trim($pdo->quote($video->description)).","
			.trim($pdo->quote($video->yt_id)).");";	
		$statement = $pdo->prepare($insert_videos_q);
		if ($statement->execute()) {
			$insert_video_in_pl_q = "INSERT INTO `videos_in_pl`(`playlist_id`, `video_id`, `yt_id`) VALUES ("
				.$playlist->id.","
				.$pdo->lastInsertId().","
				.trim($pdo->quote($video->yt_id)).");";
			$statement = $pdo->prepare($insert_video_in_pl_q);
			if (!$statement->execute()) {
				$response->set_message("Unable to insert Video: ".$video->name."in Playlist!");
			}
		} else {
			$response->set_message("Unable to insert Video: ".$video->name."!");	
		};	
	};
	//commits transaction
	$pdo->commit();
//roll back DB, add error to message to response and output response
} catch(Exception $e){
    $pdo->rollBack();
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

if (!$response->has_message()) {
	$response->set_success();
};

output_response($response->get_response());
