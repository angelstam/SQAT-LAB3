app.controller("CommissionController", function($scope)
{
	$scope.locksAmount= 0;
	$scope.stocksAmount= 0;
	$scope.barrelsAmount= 0;
	$scope.monthIndex=0;
	var monthArray=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
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
		$scope.locksAmount=0;
		$scope.stocksAmount=0;
		$scope.barrelsAmount=0;
	}

	$scope.calculateCommission=function(locks,stocks,barrels){

	}
});