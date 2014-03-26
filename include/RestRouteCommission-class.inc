<?php

require_once("RestRoute-class.inc");

/**
* RestRouteCommission:
*/
class RestRouteCommission extends RestRoute
{
	function get($p)
	{
		if (count($p) == 0)
		{
			return $this->getCommissionMonths();
		}
		return false;
	}

	private function getCommissionMonths()
	{
		global $db;

		$result = $db->query("
			SELECT
				*
			FROM
				completed_month_totals
			");

		return $result->fetchAll(PDO::FETCH_ASSOC);
	}
}

?>