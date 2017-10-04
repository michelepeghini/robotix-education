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

@$video = $request; 
$videoInPlaylists = $video->videoInPlaylists;
unset($video->videoInPlaylists);
$kitsForVideo = $video->kitsForVideo;
unset($video->kitsForVideo);

// ensures insert operations in all tables [playlist, video and videos_in_pl] are successfull
$pdo->beginTransaction();

try {
	// update video to DB
	$update_video_q = "UPDATE `video` SET 
		`name`=".trim($pdo->quote($video->name)).",
		`description`=".trim($pdo->quote($video->description)).",
		`manual`=".trim($pdo->quote($video->manual)).",
		`code`=".trim($pdo->quote($video->code))."
		WHERE `id`=".$video->id.";";
	$statement = $pdo->prepare($update_video_q);
	if ($statement->execute()) {
		$response->set_success();
		$response->add_data("id",array($pdo->lastInsertId()));
	} else {
		$response->set_message("Unable to update Video: ".$video->name."!");	
	};
	
	// update videos_in_pl
	$clear_playlists_q = "DELETE FROM `videos_in_pl` WHERE `video_id`='".$video->id."';";
	$statement = $pdo->prepare($clear_playlists_q);
	if($statement->execute()) {
		foreach($videoInPlaylists as &$vip) {
			$insert_playlists_q = "INSERT INTO `videos_in_pl`(`playlist_id`, `video_id`, `yt_id`) VALUES ('".$vip->id."','".$video->id."','".$video->yt_id."');";
			$statement = $pdo->prepare($insert_playlists_q);
			$statement->execute();
		};
		$response->set_success();
		$response->add_data("id",array($pdo->lastInsertId()));
	} else {
		$response->set_message("Unable to update Playlists for Video: ".$video->name."!");
	};
	
	// update videos_in_pl
	$clear_kits_q = "DELETE FROM `kit_build` WHERE `video_id`='".$video->id."';";
	$statement = $pdo->prepare($clear_kits_q);
	if($statement->execute()) {
		foreach($kitsForVideo as &$kfv) {
			$insert_kit_q = "INSERT INTO `kit_build`(`kit_id`, `video_id`) VALUES ('".$kfv->id."','".$video->id."');";
			$statement = $pdo->prepare($insert_kit_q);
			$statement->execute();
		};
		$response->set_success();
		$response->add_data("id",array($pdo->lastInsertId()));
	} else {
		$response->set_message("Unable to update Kits for Video: ".$video->name."!");
	};
	
	$pdo->commit();
// add error to message to response and output response
} catch(Exception $e){
	$pdo->rollBack();
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

output_response($response->get_response());
