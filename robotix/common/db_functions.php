<?php

//Database Users variables

include("db_users.php");

//error_reporting(E_ERROR | E_PARSE);

//error_reporting(0);

//Database connection functions

// Creates a pdo instance for DB connection given host, db and user data. Allows to set connection persistency
function create_pdo($host, $db, $user, $persistency = false) {
	$pdo = new PDO("mysql:host=$host;dbname=$db", $user['user_name'], $user['password'], array(PDO::ATTR_PERSISTENT => $persistency, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false));
	$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,TRUE);
	return $pdo;
};

// fetch data from DB given a pdo and a prepared statement
function fetch_data($pdo, $prepared_statement) {
	$data = array();
	try {
		if ($prepared_statement->execute()) {
			$data = $prepared_statement->fetchAll(PDO::FETCH_ASSOC);
		}; 
		return $data;
	} catch (PDOException $e) {
// !!! needs implementation
	} catch (Exception $e) {
// !!! needs implementation
	};
};

// insert data from DB given a pdo and a prepared statement
function insert_data($pdo, $prepared_statement) {
	try {
		return $prepared_statement->execute();
	} catch (PDOException $e) {
// !!! needs implementation
	} catch (Exception $e) {
// !!! needs implementation
	};
};

// Output a JSON encoded response to client  AND exits script
function output_response($response) {
	echo ")]}',\n"; // prevent JSON vulnerability
	echo json_encode($response);
	exit;
};