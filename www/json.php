<?php

$user = 'orderuser';
$pass = 'secret';
$host = '127.0.0.1';
$db_name = 'commissionlab';

require("../include/RestService-class.inc");
require("../include/RestRouteOrder-class.inc");
require("../include/RestRouteCommission-class.inc");
require("../include/RestRouteEndMonth-class.inc");
require("../include/RestRouteItems-class.inc");
require("../include/RestRouteLogin-class.inc");
try
{
	// Create a new PDO to connect to the database.
	$db = new PDO("mysql:host=$host;dbname=$db_name", $user, $pass);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e)
{
    die('ERROR: ' . $e->getMessage());
}

$rest = new RestService();
$rest->addRoute("order", new RestRouteOrder());
$rest->addRoute("commission", new RestRouteCommission());
$rest->addRoute("endMonth", new RestRouteEndMonth());
$rest->addRoute("items", new RestRouteItems());
$rest->addRoute("login", new RestRouteLogin());
echo json_encode($rest->output());
exit;

/* TODO: Rewrite as RestRoutes.
function getTotalSoldAmount()
{

	$result = $db->prepare("SELECT
				(orders.locks*(SELECT itemPrice from items where itemName='locks'))+
				(orders.stocks*(SELECT itemPrice from items where itemName='stocks'))+
				(orders.barrels*(SELECT itemPrice from items where itemName='barrels')) as totalSoldAmount
				FROM orders
				WHERE MONTH(date) = :month
				AND YEAR(date) = :year");
			
	$result->bindParam(':month', $_GET['month'], PDO::PARAM_INT);
	$result->bindParam(':year', $_GET['year'], PDO::PARAM_INT);
	$result->execute();
	echo json_encode($result->fetchAll(PDO::FETCH_OBJ));

}

try
{
	if (isset($_GET['target']))
	{
		if ($_GET['target'] == "salespersons")
		{
			$result = $db->query("SELECT * FROM salespersons");
		}
		else if ($_GET['target'] == "AddNewOrder")
		{
			//Add a new in the database
			$result = $db->prepare("INSERT INTO orders Values (:year,:month,:town,:orderedLocks,:orderedStocks,:orderedBarrels)");
			$result->bindParam(':year', $_GET['year'], PDO::PARAM_INT);
			$result->bindParam(':month', $_GET['month'], PDO::PARAM_INT);
			$result->bindParam(':town', $_GET['town'], PDO::PARAM_STR);
			$result->bindParam(':orderedLocks', $_GET['locks'], PDO::PARAM_INT);
			$result->bindParam(':orderedStocks', $_GET['stocks'], PDO::PARAM_INT);
			$result->bindParam(':orderedBarrels', $_GET['barrels'], PDO::PARAM_INT);
			$result->execute();

			//Update the item stock table
			$result = $db->prepare("UPDATE itemStock set locks = locks-:orderedLocks, stocks=stocks-:orderedStocks, barrels=barrels-:orderedBarrels");
			$result->bindParam(':orderedLocks', $_GET['locks'], PDO::PARAM_INT);
			$result->bindParam(':orderedStocks', $_GET['stocks'], PDO::PARAM_INT);
			$result->bindParam(':orderedBarrels', $_GET['barrels'], PDO::PARAM_INT);
			$result->execute();

			//Retrieving amount of items left in stock
			$result = $db->prepare("SELECT sum(locks) as locks,sum(stocks) as stocks,sum(barrels) as barrels FROM orders where month=:month GROUP BY month");
			$result->bindParam(':month', $_GET['month'], PDO::PARAM_INT);
			$result->execute();
		}
		else if ($_GET['target'] == "getStockValue")
		{
			//Collecting the amount of items left in stock for the month
			$result = $db->prepare("SELECT * FROM itemstock");
			$result->execute();
		}
		else if ($_GET['target'] == "updateTables")
		{
			//Collecting the amount of items left in stock for the month
			$result = $db->prepare("SELECT * FROM itemstock");
			$result->execute();
		}	
		else if ($_GET['target'] == "totalSoldValue")
		{
			$result = $db->prepare("SELECT
				(orders.locks*(SELECT itemPrice from items where itemName='locks'))+
				(orders.stocks*(SELECT itemPrice from items where itemName='stocks'))+
				(orders.barrels*(SELECT itemPrice from items where itemName='barrels')) as totalSoldAmount
				FROM orders
				WHERE MONTH(date) = :month
				AND YEAR(date) = :year");
			
			$result->bindParam(':month', $_GET['month'], PDO::PARAM_INT);
			$result->bindParam(':year', $_GET['year'], PDO::PARAM_INT);
			$result->execute();

		}
		else if ($_GET['target'] == "commissionLevels")
		{
			$result = $db->query("SELECT * FROM commissionlevels");
		}
	}
}
catch (PDOException $e)
{
    die('ERROR: ' . $e->getMessage());
}

echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
*/
?>