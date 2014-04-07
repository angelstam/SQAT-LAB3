<?php

require_once("RestRoute-class.inc");

/**
* RestRouteEndMonth:
*/
class RestRouteEndMonth extends RestRoute
{

function put($p, $data)
	{
		return $this->endMonth($data);
		return false;
	}

private function endMonth($data)
	{
		global $db;

		$result = $db->prepare("
			INSERT INTO completed_months
			SET year=:year,month=:month
			");

		$result->bindParam(':year', substr($data->yearMonth,0,4), PDO::PARAM_INT);
		$result->bindParam(':month', substr($data->yearMonth,5,2), PDO::PARAM_INT);
		$result->execute();
		
		return $data;
	}
}