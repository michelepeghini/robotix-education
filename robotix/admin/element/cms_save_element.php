<?php

// SAVE ALREADY EXISTING ELEMENT

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
	$update_element_q = "UPDATE `home_element` SET 
		`name`=".trim($pdo->quote($element->name)).",
		`description`=".trim($pdo->quote($element->description)).",
		`image`=".trim($pdo->quote($element->image)).",
		`link`=".trim($pdo->quote($element->link))."
		WHERE `id`=".$element->id.";";
	$statement = $pdo->prepare($update_element_q);
	if (!$statement->execute()) {
		$response->set_message("Unable to update Element: $element->name!");	
	};
	$response->set_success();
// add error to message to response and output response
} catch(Exception $e){
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

output_response($response->get_response());