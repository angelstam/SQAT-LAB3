var commissionApp = angular.module('commissionApp', ['ngRoute']);

// configure our routes
	commissionApp.config(function($routeProvider) {
		$routeProvider

		// route for the order page
			.when('/', {
				templateUrl : 'order.html',
				controller  : 'orderController'
			})

			// route for the order page
			.when('/order', {
				templateUrl : 'order.html',
				controller  : 'orderController'
			})

			// route for the report page
			.when('/report', {
				templateUrl : 'report.html',
				controller  : 'reportController'
			})
	});

commissionApp.controller("orderController", function($scope, $http)
{
	$scope.locksAmount= 0;
	$scope.stocksAmount= 0;
	$scope.barrelsAmount= 0;
	$scope.soldItemValue= 0;
	$scope.totalSoldValue=0;
	$scope.monthIndex=0;
	$scope.recievedData=null;
	$scope.currentMonthOrder=null;
	$scope.leftInStock=null;
	$scope.monthArray=[{name:'January',id:1},{name:'February',id:2},{name:'Mars',id:3},{name:'April',id:4},{name:'May',id:5},{name:'June',id:6},{name:'July',id:7},{name:'August',id:8},{name:'Sepember',id:9},{name:'October',id:10},{name:'November',id:11},{name:'December',id:12}];
	$scope.commissionInformation=null;
	$scope.month="Jan";
	$scope.year="Year";
	$scope.numberFormat = /^([1-9]{1}|[1-9]{1}[0-9]{1})$/;
	$scope.errorObject;

	$scope.openMonths; // Months currently open for new orders
	$scope.openMonthSelected;

	$scope.isReportMode = false;

	$scope.sendOrder=function(year,month,town,locks,stocks,barrels){
		$http({method: 'GET', url: 'json.php?target=AddNewOrder&year='+year+'&month='+month+'&town='+town+'&locks='+locks+'&stocks='+stocks+'&barrels='+barrels}).
		success(function (data, status, headers, config) {
			$scope.currentMonthOrder=data;
			alert("The order was added:");
			$http({method: 'GET', url: 'json.php?target=getStockValue'}).
			success(function (data, status, headers, config) {
				alert("JA");
				$scope.leftInStock=data;
			}).
			error(function (data, status, headers, config) {
				alert("Nej");
			});
		}).
		error(function (data, status, headers, config) {
		    alert("The order failed");
		});
	}

	$scope.endMonth=function(town,month,locks,stocks,barrels){
		//Loopar månader
		if($scope.monthIndex<11)
		{
			$scope.monthIndex=$scope.monthIndex+1;
			$scope.month=monthArray[$scope.monthIndex];
		}else
		{
			$scope.monthIndex=0;
			$scope.month=monthArray[$scope.monthIndex];
		}

		$scope.calculateCommission($scope.locksAmount,$scope.stocksAmount,$scope.barrelsAmount);

		$scope.locksAmount=0;
		$scope.stocksAmount=0;
		$scope.barrelsAmount=0;
	}

	$scope.getTotalSoldValue=function(year,month){
		$http({method: 'GET', url: 'json.php?target=totalSoldValue&year='+year+'&month='+month}).
		success(function (data, status, headers, config) {
		    $scope.recievedData=data;
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
	}

	$scope.getOrders=function(month){
		$http({method: 'GET', url: 'json/order/'+month}).
		success(function (data, status, headers, config) {
		    $scope.currentMonthOrder=data;
		     alert($scope.currentMonthOrder);
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
	}

	$scope.update=function()
	{
		//Update items in stock
		$http({method: 'GET', url: 'json.php?target=orders'}).
		success(function (data, status, headers, config) {
		    $scope.recievedData=data
		}).
		error(function (data, status, headers, config) {
		    // ...
		});

		// Update orders for this month
		$http({method: 'GET', url: 'json.php?target=orders'}).
		success(function (data, status, headers, config) {
		    $scope.recievedData=data
		}).
		error(function (data, status, headers, config) {
		    // ...
		});

		//Update ended month table
		$http({method: 'GET', url: 'json.php?target=orders'}).
		success(function (data, status, headers, config) {
		    $scope.recievedData=data
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
	}

	$scope.calculateCommission=function(locks,stocks,barrels){
		$http({method: 'GET', url: 'json.php?target=totalSoldValue'}).
		  success(function (data, status, headers, config) {
		   	$scope.commissionInformation=data;
		}).
		error(function (data, status, headers, config) {
		    // ...
		});

		commissionLevel1=$scope.commissionInformation[0][0];
		commissionLevel2=$scope.commissionInformation[0][1];
		commissionLevel3=$scope.commissionInformation[0][2];
	}

});

commissionApp.controller("reportController", function($scope, $http)
{


});

/*
commissionApp.controller("CommissionController", function($scope, $http)
{
	

});
*/