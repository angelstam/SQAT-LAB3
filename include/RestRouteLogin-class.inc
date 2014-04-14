<?php

require_once("RestRoute-class.inc");

/**
* RestRouteCommission:
*/
class RestRouteLogin extends RestRoute
{
	function get($p)
	{
		if($p[0]=="getAllUsers"){
			return $this->getAllUserNames();
		}
		else{
			return false;
		}
	}
	function put($p, $data)
	{
		if($p[0]=="getUser"){
			return $this->getUser($data);
		}
		else if($p[0]=="addNewUser"){
			return $this->addNewUser($data);
		}
		else if($p[0]=="changePassword"){
			return $this->changePassword($data);
		}
		else if($p[0]=="changeUsertype"){
			return $this->changeUsertype($data);
		}
		else if($p[0]=="removeUser"){
			return $this->removeUser($data);
		}
		else{
			return false;
		}
	}

	private function getUser($data)
	{
		global $db;

		$result = $db->prepare("
			SELECT
				userName,userType
			FROM
				users
			WHERE 
				userName=:userName 
				AND 
				password=:password
			");

		$result->bindParam(':userName', $data->user, PDO::PARAM_STR);
		$result->bindParam(':password', $data->password, PDO::PARAM_STR);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	private function changePassword($data)
	{
		global $db;

		$result = $db->prepare("
			UPDATE
				users
			SET
				password=:password
			WHERE 
				userName=:userName
				AND
				password=:oldPassword 
			");

		$result->bindParam(':userName', $data->user, PDO::PARAM_STR);
		$result->bindParam(':password', $data->password, PDO::PARAM_STR);
		$result->bindParam(':oldPassword', $data->oldPassword, PDO::PARAM_STR);
		$result->execute();
		return $result;
	}

	private function changeUsertype($data)
	{
		global $db;

		$result = $db->prepare("
			UPDATE
				users
			SET
				userType=:userType
			WHERE 
				userName=:userName 
			");

		$result->bindParam(':userName', $data->user, PDO::PARAM_STR);
		$result->bindParam(':userType', $data->userType, PDO::PARAM_STR);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	private function removeUser($data)
	{
		global $db;

		$result = $db->prepare("
			DELETE FROM
				users
			WHERE 
				userName=:userName 
			");

		$result->bindParam(':userName', $data->user, PDO::PARAM_STR);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	private function getAllUserNames()
	{
		global $db;

		$result = $db->query("
			SELECT
				userName
			FROM
				users
			");
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	private function addNewUser($data)
	{
		global $db;

		$result = $db->prepare("
			INSERT INTO
				users (userName,password,userType)
			VALUES (:userName,:password,:userType)
			");

		$result->bindParam(':userName', $data->user, PDO::PARAM_STR);
		$result->bindParam(':password', $data->password, PDO::PARAM_STR);
		$result->bindParam(':userType', $data->userType, PDO::PARAM_STR);
		$result->execute();
		return $result;
	}
}

?>