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

@$playlist = $request; 
$videosInPlaylist = $playlist->videosInPlaylist;
unset($playlist->videosInPlaylist);

// ensures insert operations in all tables [playlist, video and videos_in_pl] are successfull
$pdo->beginTransaction();

try {
	// update video to DB
	$update_playlist_q = "UPDATE `playlist` SET 
		`name`=".trim($pdo->quote($playlist->name)).",
		`description`=".trim($pdo->quote($playlist->description))."
		WHERE `id`=".$pdo->quote($playlist->id).";";
	$statement = $pdo->prepare($update_playlist_q);
	
	if (!$statement->execute()) {
		$response->set_message("Unable to update Video: ".$playlist->name."!");	
	}
	
	// update videos_in_pl
	$clear_playlists_q = "DELETE FROM `videos_in_pl` WHERE `playlist_id`='".$playlist->id."';";
	$statement = $pdo->prepare($clear_playlists_q);
	if($statement->execute()) {
		foreach($videosInPlaylist as &$vip) {
			$insert_playlists_q = "INSERT INTO `videos_in_pl`(`playlist_id`, `video_id`, `yt_id`) VALUES ('".$playlist->id."','".$vip->id."','".$vip->yt_id."');";
			$statement = $pdo->prepare($insert_playlists_q);
			if (!$statement->execute()){
				$response->set_message("Unable to insert $vip->name in playlist!");
			}
		};
		
	} else {
		$response->set_message("Unable to update list of videos in playlists!");
	};
	
	$pdo->commit();
// add error to message to response and output response
} catch(Exception $e){
	$pdo->rollBack();
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

if (count($response->has_message) > 0) {
	$pdo->rollBack();
} else {
	$response->set_success();
} 

output_response($response->get_response());
