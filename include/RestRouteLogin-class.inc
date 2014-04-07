<?php

require_once("RestRoute-class.inc");

/**
* RestRouteCommission:
*/
class RestRouteLogin extends RestRoute
{
	function put($p, $data)
	{
		if($p[0]=="getUser"){
			return $this->getUser($data);
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
}

?>