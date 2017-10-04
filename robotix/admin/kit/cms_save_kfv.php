<?php

// CMS SAVE KIT

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

@$kit = $request->kit; 
@$kitForVideos = $kit->kitForVideos;
unset($kit->kitForVideos);

$pdo->beginTransaction();

try {
	// update kit_build
	$clear_kit_q = "DELETE FROM `kit_build` WHERE `kit_id`='".$kit->id."';";
	$statement = $pdo->prepare($clear_kit_q);
	if($statement->execute()) {
		foreach($kitForVideos as $kfv) {
			$insert_video_q = "INSERT INTO `kit_build`(`kit_id`, `video_id`) VALUES ('".$kit->id."','".$kfv->id."');";
			$statement = $pdo->prepare($insert_video_q);
			if (!$statement->execute()){
				$response->set_message("Unable to insert $ev->name as video for $kit->name!");
			}
		};
	} else {
		$response->set_message("Unable to update list of videos in playlists!");
	};
	
	$response->set_success();
	$pdo->commit();
// add error to message to response and output response
} catch(Exception $e){
	$pdo->rollBack();
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

output_response($response->get_response());