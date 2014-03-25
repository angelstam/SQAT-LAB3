<?php
require_once 'MDB2.php';

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

try
{
	if (isset($_GET['target']))
	{
		if ($_GET['target'] == "salespersons")
		{
			$result = $db->query("SELECT * FROM salespersons");
		}
		else if ($_GET['target'] == "orders")
		{
			$result = $db->query("SELECT * FROM orders");
		}
		else if ($_GET['target'] == "totalSoldValue")
		{
			$result = $db->prepare("SELECT
				(orders.locks*prices.locks)+
				(orders.stocks*prices.stocks)+
				(orders.barrels*prices.barrels) as totalSoldAmount
				FROM orders,prices
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

// close conection
$db->disconnect();
?>