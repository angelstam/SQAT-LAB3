app.controller("orderController", function($scope, $http)
{
	$scope.locksMax= 70;
	$scope.stocksMax= 80;
	$scope.barrelsMax= 90;
	$scope.locksLeft=0;
	$scope.stocksLeft=0;
	$scope.barrelsLeft=0;
	$scope.soldItemValue= 0;
	$scope.totalSoldValue=0;
	$scope.monthIndex=0;
	$scope.recievedData=null;
	$scope.currentMonthOrder=null;
	$scope.leftInStock=null;
	$scope.monthArray=[{name:'January',id:'01'},{name:'February',id:'02'},{name:'Mars',id:'03'},{name:'April',id:'04'},{name:'May',id:'05'},{name:'June',id:'06'},{name:'July',id:'07'},{name:'August',id:'08'},{name:'Sepember',id:'09'},{name:'October',id:'10'},{name:'November',id:'11'},{name:'December',id:'12'}];
	$scope.commissionInformation=null;
	$scope.month="Jan";
	$scope.year="Year";
	$scope.numberFormat = /^([1-9]{1}|[1-9]{1}[0-9]{1})$/;
	$scope.errorObject;
	$scope.endedMonthsData

	$scope.openMonths; // Months currently open for new orders
	$scope.openMonthSelected;

	$scope.isReportMode = false;

	$scope.getOpenMonthSelected=function(){
		return $scope.openMonths[$scope.openMonthSelected].month;
	}

	$scope.setCurrentOpenOrderMonth=function(rowId){
		$scope.openMonthSelected = rowId;

		$scope.getOrders($scope.getOpenMonthSelected());
	}

	$scope.sendOrder=function(formData){
		$http({method: 'POST', url: 'json/order', data: formData}).
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

	$scope.getMonths=function(){
		$http({method: 'GET', url: 'json/order'}).
		success(function (data, status, headers, config) {
		    $scope.openMonths=data;
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
	}
	$scope.getMonths();

	$scope.getOrders=function(month){
		$http({method: 'GET', url: 'json/order/'+month}).
		success(function (data, status, headers, config) {
		   $scope.currentMonthOrder=data;
		    
		   $scope.calculateItemsLeftInStock($scope.currentMonthOrder);
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
		$scope.getMonths();
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

	$scope.calculateItemsLeftInStock=function(soldItems){
		var totalAmountOfLocks=0;
		var totalAmountOfStocks=0;
		var totalAmountOfBarrels=0;

		for (var i=0;i<soldItems.length;i++)
		{	
			totalAmountOfLocks=totalAmountOfLocks+parseInt(soldItems[i].locks);
			totalAmountOfStocks=totalAmountOfStocks+parseInt(soldItems[i].stocks);
			totalAmountOfBarrels=totalAmountOfBarrels+parseInt(soldItems[i].barrels);
		} 
		$scope.locksLeft=$scope.locksMax-totalAmountOfLocks;

		$scope.stocksLeft=$scope.stocksMax-totalAmountOfStocks;
		$scope.barrelsLeft=$scope.barrelsMax-totalAmountOfBarrels;
	}
});

app.controller("reportController", function($scope, $http)
{
	$scope.commissionlevel1=0.1;
	$scope.commissionlevel2=0.15;
	$scope.commissionlevel3=0.2;
	$scope.locksPrice=45;
	$scope.stocksPrice=30;
	$scope.barrelsPrice=25;
	$scope.getEndedMonths=function(){
		$http({method: 'GET', url: 'json/commission'}).
		success(function (data, status, headers, config) {
		    $scope.endedMonthsData=data;
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
	}

	$scope.calculateTotalSoldValue=function(locks,stocks,barrels)
	{
		return ((locks*$scope.locksPrice)+(stocks*$scope.stocksPrice)+(barrels*$scope.barrelsPrice));
	}
	$scope.calculateCommission=function(locks,stocks,barrels)
	{	
		var totalSoldSum=$scope.calculateTotalSoldValue(locks,stocks,barrels);
		if(totalSoldSum<=1000){
			return ($scope.commissionlevel1*totalSoldSum);
		}else if(totalSoldSum<=1800){
			return ($scope.commissionlevel1*(1000)+$scope.commissionlevel2*(totalSoldSum-1000));
		}else{
			return ($scope.commissionlevel1*(1000)+$scope.commissionlevel2*(800)+$scope.commissionlevel3*(totalSoldSum-1800));
		}
	}
});
