<?php

require_once("RestRoute-class.inc");

/**
* RestRouteItems:
*/
class RestRouteItems extends RestRoute
{

function get($p)
	{
		return $this->getItems();
		return false;
	}

private function getItems()
	{
		global $db;

		$result = $db->prepare("
			SELECT * 
			FROM items
			");
		
		$result->execute();
		
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}
}