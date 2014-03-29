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

	function put($p, $data)
	{
		if (count($p) == 0)
		{
			return $this->putNewOrder($data);
		}
		return false;
	}

	private function getOrderMonths()
	{
		global $db;

		$result = $db->query("
			SELECT
				DATE_FORMAT(date, '%Y-%m') as month,
				itemstock.stocks,
				itemstock.locks,
				itemstock.barrels
			FROM
				orders
				LEFT JOIN itemstock ON
					YEAR(orders.date) = itemstock.year
					AND MONTH(orders.date) = itemstock.month
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
				SUM(locks) as locks, SUM(stocks) as stocks, SUM(barrels) as barrels
			FROM
				orders
			WHERE
				DATE_FORMAT(date, '%Y-%m') = :month
			");
		
		$result->bindParam(':month', $month, PDO::PARAM_STR);
		$result->execute();

		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	private function putNewOrder($data)
	{
		global $db;

		//Add a new in the database
		$result = $db->prepare("INSERT INTO orders Values (:date,:town,:orderedLocks,:orderedStocks,:orderedBarrels)");
		$result->bindParam(':date', $data->date, PDO::PARAM_INT);
		$result->bindParam(':town', $data->town, PDO::PARAM_STR);
		$result->bindParam(':orderedLocks', $data->locks, PDO::PARAM_INT);
		$result->bindParam(':orderedStocks', $data->stocks, PDO::PARAM_INT);
		$result->bindParam(':orderedBarrels', $data->barrels, PDO::PARAM_INT);
		$result->execute();

		//Update the item stock table
//		$result = $db->prepare("UPDATE itemStock set locks = locks-:orderedLocks, stocks=stocks-:orderedStocks, barrels=barrels-:orderedBarrels");
//		$result->bindParam(':orderedLocks', $data->locks, PDO::PARAM_INT);
//		$result->bindParam(':orderedStocks', $data->stocks, PDO::PARAM_INT);
//		$result->bindParam(':orderedBarrels', $data->barrels, PDO::PARAM_INT);
//		$result->execute();

		//Retrieving amount of items left in stock
//		$result = $db->prepare("SELECT sum(locks) as locks,sum(stocks) as stocks,sum(barrels) as barrels FROM orders where month=:month GROUP BY month");
//		$result->bindParam(':month', $data->month, PDO::PARAM_INT);
//		$result->execute();
		return Array("receivedData"=>$data/*, "stockLeft"=>($result->fetchAll(PDO::FETCH_ASSOC))*/);
	}
}

?>