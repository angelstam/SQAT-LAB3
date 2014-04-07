var app = angular.module('commissionApp', ['ngRoute']);

// configure our routes
app.config(function($routeProvider) {
	$routeProvider

	// route for the order page
		.when('/', {
			templateUrl : 'login.html',
			controller  : 'loginController'
		})

		// route for the order page
		.when('/order', {
			templateUrl : 'order.html',
			controller  : 'orderController'
		})

		// route for the order page
		.when('/login', {
			templateUrl : 'login.html',
			controller  : 'loginController'
		})

		// route for the report page
		.when('/report', {
			templateUrl : 'report.html',
			controller  : 'reportController'
		});
});

app.filter("pad", function()
{
	return function(number, padding)
	{
		padding = (padding || 0);
		if (number !== null && number !== undefined)
		{
			var str = "" + number;
			while (str.length < padding) str = "0" + str;
			return str;
		}
	};
});