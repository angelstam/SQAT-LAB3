<?php
require_once 'MDB2.php';

$user = 'orderuser';
$pass = 'secret';
$host = 'localhost';
$db_name = 'commissionlab';

// Data Source Name: This is the universal connection string
$dsn = "mysql://$user:$pass@$host/$db_name";

// MDB::connect will return a PEAR MDB object on success
// or an PEAR MDB Error object on error

$db = MDB2::connect($dsn);

// With MDB::isError you can differentiate between an error or
// a valid connection.
if (MDB2::isError($db)) {
    die ($db->getMessage());
}

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
		$result = $db->query("SELECT 
			(orders.locks*prices.locks)+
			(orders.stocks*prices.stocks)+
			(orders.barrels*prices.barrels) as totalSoldAmount 
			FROM orders,prices 
			WHERE MONTH(date)=".$_GET['month']."
			AND YEAR(date)=".$_GET['year']);
	}
	else if ($_GET['target'] == "commissionLevels")
	{
		$result = $db->query("SELECT * FROM commissionlevels");
	}
}

// Always check that $result is not an error
if (MDB2::isError($result)) {
    die ($result->getMessage());
}

echo json_encode($result->fetchAll());

// close conection
$db->disconnect();
?>