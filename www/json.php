<?php

$user = 'orderuser';
$pass = 'secret';
$host = '127.0.0.1';
$db_name = 'commissionlab';

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

?>