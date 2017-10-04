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

@$editedComponents = $request->kit->editedComponents;
unset($request->kit->editedComponents);
@$kit = $request->kit; 
unset($request->kit->componentsInKit);

// ensures insert operations in all tables are successfull
$pdo->beginTransaction();

try {
	// update kit to DB
	$update_kit_q = "UPDATE `kit` SET 
		`name`=".trim($pdo->quote($kit->name)).",
		`description`=".trim($pdo->quote($kit->description)).",
		`price`=".trim($pdo->quote($kit->price)).",
		`qty`=".trim($pdo->quote($kit->qty)).",
		`image`=".trim($pdo->quote($kit->image))."
		WHERE `id`=".$kit->id.";";
	$statement = $pdo->prepare($update_kit_q);
	if (!$statement->execute()) {
		$response->set_message("Unable to update Kit: $kit->name!");	
	};
	
	// create array of id of components that has qty = 0 
	// and remove those components from $editedComponents array
	$parts_to_remove = array();
	foreach($editedComponents as $key => &$val) {
		if($editedComponents[$key]->qty == 0) { 
			$parts_to_remove[] = $editedComponents[$key]->id;
			unset($editedComponents[$key]);
		}
	}
	unset($val);//break reference

	// remove components that has qty = 0 from parts, if any
	if (count($parts_to_remove) > 0) {
		$clear_part_q = "DELETE FROM `part` WHERE `kit_id`=$kit->id AND `component_id`IN (".implode(" , ", $parts_to_remove).");";
		$statement = $pdo->prepare($clear_part_q);
		$statement->execute();
	}
	
	//get list of already existing components in kit from DB
	$old_components_q = "SELECT p.component_id FROM part AS p WHERE p.kit_id = $kit->id";
	$statement = $pdo->prepare($old_components_q);
	$old_components = fetch_data($pdo, $statement);
	
	// create array of components that need to be updated and not inserted 
	// by removing components from $editedComponents that are also present in $old_components
	$parts_to_update = array();
	foreach($editedComponents as $edit_key => &$edit_val) {
		foreach($old_components as $old_comp) {
			if($editedComponents[$edit_key]->id == $old_comp['component_id']) {
				$parts_to_update[] = $editedComponents[$edit_key];
				unset($editedComponents[$edit_key]);
			}
		}
	}
	unset($edit_val);//break reference
	
	// UPDATE parts with edited qty, if any
	if (count($parts_to_update) > 0){
		foreach($parts_to_update as &$ptu) {
			$update_part_q = "UPDATE `part` SET `component_qty`=$ptu->qty WHERE `kit_id`=$kit->id AND `component_id`=$ptu->id";
			$statement = $pdo->prepare($update_part_q);
			$statement->execute();
		}
	}
		
	// INSERT new parts, if any
	if(count($editedComponents) > 0){
		foreach($editedComponents as &$ec) {
			$insert_part_q = "INSERT INTO `part`(`kit_id`, `component_id`, `component_qty`) VALUES ($kit->id,$ec->id,$ec->qty)";
			$statement = $pdo->prepare($insert_part_q);
			$statement->execute();
		}
	}
	
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