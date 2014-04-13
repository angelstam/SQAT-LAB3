<?php

require_once("RestRoute-class.inc");

/**
* RestRouteOrder:
*/
class RestRouteOrder extends RestRoute
{
	function put($p, $data)
	{
		if ($p[0]=="putNewOrder")
		{
			return $this->putNewOrder($data);
		}
		else if($p[0]=="getOpenMonths")
		{
			return $this->getOpenMonths($data);
		}
		else if ($p[0]=="getOrders")
		{
			return $this->getOrders($data);
		}
		else if($p[0]=="getMonthsSales")
		{
			return $this->getMonthsSales($data);
		}
		return false;
	}

	private function getOpenMonths($data)
	{
		global $db;

		$result = $db->prepare("
			SELECT
				month
			FROM
				open_month_totals
			WHERE
				seller=:user
			");
		$result->bindParam(':user', $data->user, PDO::PARAM_STR);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	private function getOrders($data)
	{
		global $db;

		$result = $db->prepare("
			SELECT
				date, town, locks, stocks, barrels
			FROM
				orders
			WHERE
				DATE_FORMAT(date, '%Y-%m') = :month
			AND
				seller=:user
			");
		
		$result->bindParam(':month', $data->month, PDO::PARAM_STR);
		$result->bindParam(':user', $data->user, PDO::PARAM_STR);
		$result->execute();

		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	private function getMonthsSales($data)
	{
		global $db;

		$result = $db->prepare("
			SELECT
				sum(locks) as locks, 
				sum(stocks) as stocks, 
				sum(barrels) as barrels
			FROM
				orders
			WHERE
				DATE_FORMAT(date, '%Y-%m') = :month
			");
		
		$result->bindParam(':month', $data->month, PDO::PARAM_STR);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}
	
	private function putNewOrder($data)
	{
		global $db;

		//Add a new in the database
		$result = $db->prepare("
			INSERT INTO 
				orders (seller,date,town,locks,stocks,barrels)
			VALUES 
				(:seller,:date,:town,:orderedLocks,:orderedStocks,:orderedBarrels)");
		$result->bindParam(':seller', $data->user, PDO::PARAM_STR);
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