<?php

// CMS playlist SAVE


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

@$playlist = $request->playlist; 



try {
	// update kit to DB
	$new_pl_q = "INSERT INTO `playlist`(`name`, `description`) VALUES (".trim($pdo->quote($playlist->name)).",".trim($pdo->quote($playlist->description)).");";
	$statement = $pdo->prepare($new_pl_q);
	if ($statement->execute()) {
		$response->set_success();
		$get_pl_q = "SELECT * FROM `playlist` WHERE `name` = ".trim($pdo->quote($playlist->name)).";";
		$statement = $pdo->prepare($get_pl_q);
		$new_pl = fetch_data($pdo, $statement)[0];
		$response->add_data("playlist", $new_pl);
	} else {
		$response->set_message("Unable to update Component: $playlist_name!");	
	}

// add error to message to response and output response
} catch(Exception $e){
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

output_response($response->get_response());