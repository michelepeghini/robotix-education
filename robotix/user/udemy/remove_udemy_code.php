<?php

//
// Remove codfe after user has follower Udemy link
//

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_guest); 

// Create response instance. Prepare and run query
$response= new Response();

$code = $_GET['code']; // user code to redeem course
$date = new DateTime($_GET['date']); //create DateTime instance 
$redeem_date= $date->format('Y-m-d');//convert UTC date to DB date format

// updates code entry with current redeem date
$redeem_code_q = "UPDATE `udemy_codes` SET `redeem_date` = :date WHERE `code` = :code;";
$statement = $pdo->prepare($redeem_code_q);
$statement->bindValue(':date', $redeem_date);
$statement->bindValue(':code', $code);

if ($statement->execute()) {
	$response->set_success();
} else {
	$response->set_message("Database error!");
}

// Output results
output_response($response->get_response());