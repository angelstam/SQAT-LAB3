app.controller("CommissionController", function($scope, $http)
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
	$scope.commissionInformation=null;
	var monthArray=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	var commissionLevel1=0;
	var commissionLevel2=0;
	var commissionLevel3=0;
	$scope.month="Jan";
	$scope.year="Year";
	$scope.numberFormat = /^([1-9]{1}|[1-9]{1}[0-9]{1})$/;
	$scope.errorObject;

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

	$scope.getOrders=function(){
		$http({method: 'GET', url: 'json/order/2014-03'}).
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