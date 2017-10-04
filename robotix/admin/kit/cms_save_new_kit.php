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

try {
	// update kit to DB
	$insert_kit_q = "
		INSERT INTO `kit`(`name`, `price`, `description`, `qty`) 
		VALUES (
		".trim($pdo->quote($kit->name)).",
		".trim($pdo->quote($kit->price)).",
		".trim($pdo->quote($kit->description)).",
		10);";
	$statement = $pdo->prepare($insert_kit_q);
	if ($statement->execute()) {
		$response->set_success();
		$get_kit_q = "SELECT `id`,`name`,`image` FROM kit WHERE `name` = ".trim($pdo->quote($kit->name)).";";
		$statement=$pdo->prepare($get_kit_q);
		$new_kit = fetch_data($pdo, $statement)[0];
		$response->add_data("kit", $new_kit);
	} else {
		$response->set_message("Unable to update Kit: $kit->name!");	
	}

// add error to message to response and output response
} catch(Exception $e){
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

output_response($response->get_response());