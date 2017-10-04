<?php

// CMS component SAVE


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

@$component_name = $request->component->name; 


try {
	// update kit to DB
	$new_comp_q = "INSERT INTO `component`(name) VALUES ('".$component_name."');";
	$statement = $pdo->prepare($new_comp_q);
	if ($statement->execute()) {
		$response->set_success();
		$get_comp_q = "SELECT * FROM `component` WHERE `name` = '".$component_name."';";
		$statement=$pdo->prepare($get_comp_q);
		$new_comp = fetch_data($pdo, $statement)[0];
		$response->add_data("component", $new_comp);
	} else {
		$response->set_message("Unable to update Component: $component_name!");	
	}

// add error to message to response and output response
} catch(Exception $e){
	$response->set_message($e->getMessage());
    output_response($response->get_response());
    exit;
}

output_response($response->get_response());