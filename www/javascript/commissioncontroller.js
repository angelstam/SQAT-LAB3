app.controller("CommissionController", function($scope, $http)
{
	$scope.locksAmount= 0;
	$scope.stocksAmount= 0;
	$scope.barrelsAmount= 0;
	$scope.soldItemValue= 0;
	$scope.totalSoldValue=0;
	$scope.monthIndex=0;
	$scope.recievedData=null;
	$scope.commissionInformation=null;
	var monthArray=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	var commissionLevel1=0;
	var commissionLevel2=0;
	var commissionLevel3=0;
	$scope.month="Jan";
	$scope.numberFormat = /^([1-9]{1}|[1-9]{1}[0-9]{1})$/;
	$scope.errorObject;

	$scope.sendOrder=function(town,locks,stocks,barrels){
		$scope.locksAmount= $scope.locksAmount+locks;
		$scope.stocksAmount= $scope.stocksAmount+stocks;
		$scope.barrelsAmount=$scope.barrelsAmount+barrels;
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

	$scope.getStuff=function(){
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