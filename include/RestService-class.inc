<?php

/**
* RestService:
*/ 
class RestService
{
	private $routes = array();

	function __construct()
	{

	}

	public function addRoute($route_name, $route)
	{
		if (array_key_exists($route_name, $this->routes))
		{
			throw new Exception('Error the route_name "'. $route_name .'" is already in use.');
		}
		
		$this->routes[$route_name] = $route;
	}

	public function output()
	{
		// Get parameters from the request.
		$p = explode("/", $_SERVER["PATH_INFO"]);
		array_shift($p);
		$route_name = array_shift($p); // shift out the route name

		if (!array_key_exists($route_name, $this->routes))
		{
			return new RestServiceError("Error: Unknown API route.");
		}

		try
		{
			switch ($_SERVER["REQUEST_METHOD"])
			{
				// Serve get requests
				case 'GET':
					$output = $this->routes[$route_name]->get($p);
					break;
				
				// Serve put requests
				case 'POST':
					$output = $this->routes[$route_name]->put($p, json_decode(file_get_contents("php://input")));
					break;
				
				// Non supported request methods
				default:
						return new RestServiceError("Error: Unknown request method.");
					break;
			}
		}
		catch (PDOException $e)
		{
		    die('ERROR: ' . $e->getMessage());
		}
		
		if ($output === false)
		{
			return new RestServiceError("Error: Invalid request method for this route.");
		}

		return $output;
	}
}

/**
* 
*/
class RestServiceError
{
	var $errorMessage;
	
	function __construct($message)
	{
		$this->errorMessage = $message;
	}
}

?>