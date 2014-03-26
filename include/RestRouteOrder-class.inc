<?php

require_once("RestRoute-class.inc");

/**
* RestRouteOrder:
*/
class RestRouteOrder extends RestRoute
{
	function get($p)
	{
		if (count($p) == 0)
		{
			return $this->getOrderMonths();
		}
		elseif (preg_match('/^\d{4}-\d{2}$/', $p[0]) !== 0)
		{
			return $this->getOrders($p[0]);
		}
		return false;
	}

	private function getOrderMonths()
	{
		global $db;

		$result = $db->query("
			SELECT
				DATE_FORMAT(date, '%Y-%m') as month
			FROM
				orders
			GROUP BY
				month
			");

		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	private function getOrders($month)
	{
		global $db;

		$result = $db->prepare("
			SELECT
				 *
			FROM
				orders
			WHERE
				DATE_FORMAT(date, '%Y-%m') = :month
			");
		
		$result->bindParam(':month', $month, PDO::PARAM_STR);
		$result->execute();

		return $result->fetchAll(PDO::FETCH_ASSOC);
	}
}

?>