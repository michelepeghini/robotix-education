<?php
//
// Log in user
//

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_admin); 

// Create response instance. Prepare and run query
$response= new Response();

// READ REQUEST DATA
$request = json_decode(file_get_contents("php://input"));
@$email = $request->user->email;
@$password = $request->user->password; 

$user_q = "SELECT * FROM `robotix_admin` WHERE `email` = :email AND `password`= :password;";
$statement = $pdo->prepare($user_q);
$statement->bindValue(':email', $email);
$statement->bindValue(':password', $password);

if ($statement) {
	$query_result = fetch_data($pdo, $statement);
	if (count($query_result) != 1) {
		$response->set_fail();
		$response->set_message("Invalid Username or Password!");
	} else {
		$response->set_success();
		session_start();
		$_SESSION['user'] = $query_result[0];
		$response->add_data('user_id',$_SESSION['user']['id']);
		$_SESSION['uid'] = uniqid('rws-');
		$response->add_data('uid', $_SESSION['uid']);
	};
	output_response($response->get_response());
} else {
	$response->set_fail();
	$response->set_message("Unable to connect to DB, please try again.");
	output_response($response->get_response());
};