<?php

// Save new Home Element

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

@$element = $request->element; 

try {
	// update element to DB
	$insert_element_q = "
		INSERT INTO `home_element`(`name`, `description`, `image`, `link`) 
		VALUES (
		".trim($pdo->quote($element->name)).",
		".trim($pdo->quote($element->description)).",
		".trim($pdo->quote($element->image)).",
		".trim($pdo->quote($element->link)).");";
	$statement = $pdo->prepare($insert_element_q);
	if ($statement->execute()) {
		$response->set_success();
		$get_element_q = "SELECT `id`,`name`,`image` FROM home_element WHERE `name` = ".trim($pdo->quote($element->name)).";";
		$statement=$pdo->prepare($get_element_q);
		$new_element = fetch_data($pdo, $statement)[0];
		$response->add_data("element", $new_element);
	} else {
		$response->set_message("Unable to update Element: $element->name!");	
	}

// add error to message to response and output response
} catch(Exception $e){
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

output_response($response->get_response());