app.controller("orderController", function($scope, $http, $location)
{
	$scope.locksMax= null;
	$scope.stocksMax= null;
	$scope.barrelsMax= null;
	$scope.items=null;
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
	$scope.endedMonthsData;
	$scope.orderIsAdded=false;
	$scope.v = {
        Dt: Date.now()
    }

	$scope.openMonths; // Months currently open for new orders
	$scope.openMonthSelected;

	$scope.isReportMode = false;
	/*
	This method will retrieve cookies stored by the application 
	and check if the session information is still valid.
	*/
	$scope.retrieveUserCookie=function()
	{
		var user=$scope.getCookie('user');
		return user;
	}

	/*
	Returns the value of the cookie given. If no cookie
	present getCookie returns "".
	*/
	$scope.getCookie=function(cookieName)
	{
		var name = cookieName + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
			var c = ca[i].trim();
			if (c.indexOf(name)==0){
				return c.substring(name.length,c.length);
			}
		}
		return "";
	}

	// Checks if the given cookie is set return true if cookie is set 
	// and false if not. 
	$scope.isCookieSet = function(cookieIdentifier){
		var identifier = $scope.getCookie(cookieIdentifier);
		if (identifier!="" && identifier!=null)
		  {
			return true;
		  } else {
			return false;
		  }
	}

	$scope.getOpenMonthSelected=function(){
		return $scope.openMonths[$scope.openMonthSelected].month;
	}

	$scope.setCurrentOpenOrderMonth=function(rowId)
	{
		$scope.openMonthSelected = rowId;
		$scope.getOrders();
	}

	$scope.getItems=function()
	{
		$http({method: 'GET', url: 'json/items'}).
		success(function (data, status, headers, config) {
			$scope.items=data;

			for (var i=0;i<$scope.items.length;i++)
			{
				if($scope.items[i].itemName == 'locks')
				{
					$scope.locksMax= $scope.items[i].maximumAvailablePerMonth;
				}else if($scope.items[i].itemName == 'stocks')
				{
					$scope.stocksMax= $scope.items[i].maximumAvailablePerMonth;
				}else if($scope.items[i].itemName == 'barrels')
				{
					$scope.barrelsMax= $scope.items[i].maximumAvailablePerMonth;
				}
			}
		}).
		error(function (data, status, headers, config) {
		    alert("The retrieving of stocklimits failed");
		});	
	}

	$scope.sendOrder=function(formData)
	{	
		formData.user=$scope.retrieveUserCookie();

		//if($scope.checkEnteredOrder()==true){
			$http({method: 'POST', url: 'json/order/putNewOrder', data: formData}).
			success(function (data, status, headers, config) {
				alert(data);
				formData.town=null;
				formData.locks=null;
				formData.stocks=null;
				formData.barrels=null;
				$scope.orderIsAdded=true;
				$scope.getOrders();
				$scope.getMonths();
			}).
			error(function (data, status, headers, config) {
			    alert("The order failed");
			});
		//}
	}

	$scope.checkEnteredOrder=function(){
		$scope.getItems();
		/*
		//Check that order don't exceed maximum limit
		if(formaData.locks<=$scope.locksMax){
			//Check that order don't exceed amount in stock
			if(){

			}else{
				return false;
			}
		}else{
			return false;
		}

		//Check that order don't exceed maximum limit
		if(formaData.stocks<=$scope.stocksMax){
			//Check that order don't exceed amount in stock
			if(){

			}else{
				return false;
			}
		}else{
			return false;
		}

		//Check that order don't exceed maximum limit
		if(formaData.barrels<=$scope.barrelsMax){
			//Check that order don't exceed amount in stock
			if(){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
		*/
	}

	$scope.endMonth=function(){
		$scope.temp={yearMonth:$scope.getOpenMonthSelected()};
		$http({method: 'POST', url: 'json/endMonth', data: $scope.temp}).
		success(function (data, status, headers, config) {
			$scope.setCurrentOpenOrderMonth(null);
		}).
		error(function (data, status, headers, config) {
		    alert("The order failed");
		});
		$scope.getMonths();
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

	/*
		This method will return all open months for the specified user
	*/
	$scope.getMonths=function(){
		$http({method: 'POST', url: 'json/order/getOpenMonths', data: {'user': $scope.retrieveUserCookie()}}).
		success(function (data, status, headers, config) {
		    $scope.openMonths=data;
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
	}
	$scope.getMonths();
	if($scope.locksMax==null){
	$scope.getItems();
	}
	/*
		This methos will return all order data for the specified month
	*/
	$scope.getOrders=function(){
		$http({method: 'POST', url: 'json/order/getOrders', data:{'month':$scope.getOpenMonthSelected(),'user': $scope.retrieveUserCookie()}}).
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

	$scope.calculateItemsLeftInStock=function(soldItems)
	{
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

	$scope.clearOrderCells=function()
	{
		//$scope.orderForm1 =
	}

	/*
	This method will handle redirection to a given module
	*/
	$scope.redirect=function()
	{
		$location.url('/order');	
	}

	/*
	This method will retrieve cookies stored by the application 
	and check if the session information is still valid.
	*/
	$scope.retrieveAndCheckCookie=function()
	{
		var user=$scope.getCookie('user');
		return user;
	}

	/*
	Returns the value of the cookie given. If no cookie
	present getCookie returns "".
	*/
	$scope.getCookie=function(cookieName)
	{
		var name = cookieName + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
			var c = ca[i].trim();
			if (c.indexOf(name)==0){
				return c.substring(name.length,c.length);
			}
		}
		return "";
	}

	/*
	This method will handle redirection to a given module
	*/
	$scope.redirect=function(redirectTo)
	{	
		if(redirectTo=="logout"){
			$scope.deleteCookies();

			$location.url('/login');
		}
	}

	// Deletes all cookies
	$scope.deleteCookies = function(){
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++){
  			document.cookie = cookies[i].split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}

	}
});

app.controller("reportController", function($scope, $http, $location)
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
	$scope.getEndedMonths();

	$scope.calculateTotalSoldValue=function(locks,stocks,barrels)
	{
		return ((locks*$scope.locksPrice)+(stocks*$scope.stocksPrice)+(barrels*$scope.barrelsPrice));
	}
	$scope.calculateCommission=function(locks,stocks,barrels)
	{	
		var totalSoldSum=$scope.calculateTotalSoldValue(locks,stocks,barrels);
		//If no whole gun has been sold, there will be no commission
		if(locks!=0&&stocks!=0&&barrels!=0)
		{
			if(totalSoldSum<=1000){
				return ($scope.commissionlevel1*totalSoldSum);
			}else if(totalSoldSum<=1800){
				return ($scope.commissionlevel1*(1000)+$scope.commissionlevel2*(totalSoldSum-1000));
			}else{
				return ($scope.commissionlevel1*(1000)+$scope.commissionlevel2*(800)+$scope.commissionlevel3*(totalSoldSum-1800));
			}
		}else
		{
			return 0;
		}
	}

	/*
	This method will retrieve cookies stored by the application 
	and check if the session information is still valid.
	*/
	$scope.retrieveAndCheckCookie=function()
	{
		var user=$scope.getCookie('user');
		return user;
	}

	/*
	Returns the value of the cookie given. If no cookie
	present getCookie returns "".
	*/
	$scope.getCookie=function(cookieName)
	{
		var name = cookieName + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
			var c = ca[i].trim();
			if (c.indexOf(name)==0){
				return c.substring(name.length,c.length);
			}
		}
		return "";
	}

	/*
	This method will handle redirection to a given module
	*/
	$scope.redirect=function(redirectTo)
	{	
		if(redirectTo=="logout"){
			$scope.deleteCookies();
			$location.url('/login');
		}
	}

	// Deletes all cookies
	$scope.deleteCookies = function(){
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++){
  			document.cookie = cookies[i].split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}

	}
});

app.controller("loginController", function($scope, $http, $location)
{
	$scope.retrievedData=null;

	$scope.processLoginUserForm=function(loginForm)
	{	
		$http({method: 'POST', url: 'json/login/getUser', data:loginForm}).
		success(function (data, status, headers, config) {
			$scope.retrievedData=data;
		   if(data.length==1 && data!=""){
				$scope.setCookie('user',data[0].userName);
				$scope.redirect();
			}
			else{
				loginForm.password=null;
				alert("Invalid login information");
			}
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
	}

	/*
	This method will handle redirection to a given module
	*/
	$scope.redirect=function()
	{
		$location.url('/order');	
	}

	/*
	This method will retrieve cookies stored by the application 
	and check if the session information is still valid.
	*/
	$scope.retrieveAndCheckCookie=function()
	{
		alert($scope.getCookie('user'));
		var user=$scope.getCookie('user');
		return user;
	}

	/*
	Returns the value of the cookie given. If no cookie
	present getCookie returns "".
	*/
	$scope.getCookie=function(cookieName)
	{
		var name = cookieName + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
			var c = ca[i].trim();
			if (c.indexOf(name)==0){
				return c.substring(name.length,c.length);
			}
		}
		return "";
	}

	// Checks if the given cookie is set return true if cookie is set 
	// and false if not. 
	$scope.isCookieSet = function(cookieIdentifier){
		var identifier = $scope.getCookie(cookieIdentifier);
		if (identifier!="" && identifier!=null)
		  {
			return true;
		  } else {
			return false;
		  }
	}

	// Deletes all cookies
	$scope.deleteCookies = function(){
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++){
  			document.cookie = cookies[i].split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}

	}

	/*
	Set the cookie with the cookieName to the cookieValue  
	*/
	$scope.setCookie=function(cookieName,cookieValue)
	{
		document.cookie = cookieName+"="+cookieValue + ";";
	}
});
