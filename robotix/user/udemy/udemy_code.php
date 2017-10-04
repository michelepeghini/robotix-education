<?php

//
// Generate link to get free access to Udemy course given a code	
//

//header('Content-Type: application/x-www-form-urlencoded');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_guest); 

// Create response instance. Prepare and run query
$response= new Response();


$code = $_GET['code']; // user code to redeem course
$today = new DateTime($_GET['date']); //create DateTime instance 
$week_of_year= $today->format('W');//convert date to week of the year
$course_name = "computational-thinking-in-python";
$udemy_link = "https://www.udemy.com/$course_name/?couponCode=";

$code_q = "SELECT * FROM udemy_codes WHERE code = ?;";
$coupon_q = "SELECT `coupon` FROM `udemy_coupon` WHERE `week_of_year` = ?;";// use week_of_year to determine what coupon code to return
$statement = $pdo->prepare($code_q);
$statement->bindValue(1, $code);

if ($statement) {
	$query_result = fetch_data($pdo, $statement);
	switch(count($query_result)) {
		case 0: $response->set_message("Code is incorrect.");
				break;
		case 1:	if ($query_result[0]['redeem_date'] == null) {
					$statement = $pdo->prepare($coupon_q);
					$statement->bindValue(1,$week_of_year);
					if($statement) {
						$query_result = fetch_data($pdo, $statement);
						$response->set_success();
						$response->add_data("udemyLink", $udemy_link . $query_result[0]['coupon']);
					}
				} else {
					$response->set_message("Your Code has already been redeemed on " . $query_result[0]['redeem_date']);
				}
				break;
		default: $response->set_message("Database error!");
	}
} else {
	$response->set_message("Database error! Please refresh the page.");
}

// Output results
output_response($response->get_response());