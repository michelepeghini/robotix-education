<?php
//
// Sign up user
//

header('Content-Type: application/json');

// Import DB connection variables and functions
require_once('../../common/db_functions.php'); 

// Import Response class for standardized server response
require_once('../../common/response_class.php');

// Create DB connection
$pdo = create_pdo($host_name, $db_name, $robotix_user); 

// Create response instance. Prepare and run query
$response= new Response();

//Read request data
$request = json_decode(file_get_contents("php://input"));
@$email = $request->email;
@$password = $request->password; 

$user_data_q = "SELECT * FROM `robotix_user` WHERE `email` = :email;";
$account_q = "INSERT INTO `robotix_user`(`email`, `password`) VALUES (:email, :password);";


//Retrieves user data given email
function get_user($pdo, $email, $query) { 
	$statement = $pdo->prepare($query);
	$statement->bindValue(':email', $email);
	if($statement) {
		$result = fetch_data($pdo, $statement);
		return $result;
	}
	return array();
};

// Check for already existing email address and terminate with fail if so
$query_result = get_user($pdo, $email, $user_data_q);
if (!empty($query_result)){
	$response->set_fail();
	$response->set_message("Email already registered!");
	output_response($response->get_response());
	exit;
};

// User is not registered, proceed with insertion into DB
$statement = $pdo->prepare($account_q);
$statement->bindValue(':email', $email);
$statement->bindValue(':password', $password);
if($statement) {
	$query_result = insert_data($pdo, $statement);
};

// Retrieves user record from DB
$query_result = get_user($pdo, $email, $user_data_q);
if (empty($query_result)){
	$response->set_fail();
	$response->set_message("Unable to access DB");
} else {
	$response->set_success();
	session_start();
	$_SESSION['user'] = $query_result[0];
	$response->add_data('user_id',$_SESSION['user']['id']);
	$_SESSION['uid'] = uniqid('rws-');
	$response->add_data('uid', $_SESSION['uid']);
}
output_response($response->get_response());