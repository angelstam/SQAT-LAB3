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
		if(rowId=="empty"){
			$scope.openMonthSelected = null;
		}
		else{
			$scope.openMonthSelected = rowId;
			$scope.getOrders();
		}
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
		formData.user=$scope.getCookie('user');

		//if($scope.checkEnteredOrder()==true){
			$http({method: 'POST', url: 'json/order/putNewOrder', data: formData}).
			success(function (data, status, headers, config) {
				$scope.recievedData=data;
				formData.town=null;
				formData.locks=null;
				formData.stocks=null;
				formData.barrels=null;
				$scope.orderIsAdded=true;
				$scope.setCurrentOpenOrderMonth($scope.openMonthSelected);	
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
		$scope.temp={yearMonth:$scope.getOpenMonthSelected(),sellerId: $scope.getCookie('user')};
		$http({method: 'POST', url: 'json/endMonth', data: $scope.temp}).
		success(function (data, status, headers, config) {
			$scope.recievedData=data;
			$scope.getOpenMonths();
			$scope.setCurrentOpenOrderMonth("empty");
			
		}).
		error(function (data, status, headers, config) {
		    alert("The order failed");
		});
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
	$scope.getOpenMonths=function(){
		$http({method: 'POST', url: 'json/order/getOpenMonths', data: {'user': $scope.getCookie('user')}}).
		success(function (data, status, headers, config) {
		    $scope.openMonths=data;
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
	}
	
	/*
		This methos will return all order data for the specified month
	*/
	$scope.getOrders=function(){
		$http({method: 'POST', url: 'json/order/getOrders', data:{'month':$scope.getOpenMonthSelected(),'user': $scope.getCookie('user')}}).
		success(function (data, status, headers, config) {
		   $scope.currentMonthOrder=data;
		   $scope.calculateItemsLeftInStock($scope.currentMonthOrder);
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
		$scope.getOpenMonths();
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
		else if(redirectTo=="report"){
			$location.url('/report');
		}
	}

	// Deletes all cookies
	$scope.deleteCookies = function(){
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++){
  			document.cookie = cookies[i].split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}

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

	//On load run the following
	if($scope.isCookieSet('user')== true && ($scope.getCookie('userType')=='admin' || $scope.getCookie('userType')=='seller')){
		$scope.getOpenMonths();
		if($scope.locksMax==null){
			$scope.getItems();
		}
	}
	else{
		$scope.redirect('logout');
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
	$scope.showAddPersonDiv=false;
	$scope.showSuccessMessage=false;
	$scope.userTypes=[
	{name:'Administrator',userType:'admin'},
	{name:'Seller',userType:'seller'}
	];

	/*
	This method retrieves the data of ended months 
	for the specified user
	*/
	$scope.getEndedMonths=function(user){
		$http({method: 'GET', url: 'json/commission'}).
		success(function (data, status, headers, config) {
			$scope.endedMonthsData=data;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve users from the db");
		});
	}

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

	$scope.showCreateSalesPerson=function(){
		if($scope.showAddPersonDiv==true){
			$scope.showAddPersonDiv=false;
		}
		else{
			$scope.showAddPersonDiv=true;
			$scope.userAlternatives=$scope.userTypes[1];
		}
		$scope.showSuccessMessage=false;
		
	}

	$scope.loadUserNames=function(){
		$http({method: 'GET', url: 'json/login/getAllUsers'}).
		success(function (data, status, headers, config) {
			$scope.usersInDB=data;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve users from the db");
		});
	}

	/*
	This method will check if the new userName is unique in the 
	on the server detabase
	*/
	$scope.checkNewUsernameValidity=function(userForm)
	{	
		var validNewUserName=true;
		
		angular.forEach($scope.usersInDB,function(value){
			if(userForm.user==value.name){
				validNewUserName=false;
			}
		});
		return validNewUserName;
	}

	/*
	Returns true if the passwords match else false.
	*/
	$scope.confirmPasswords=function(userForm)
	{
		var passwordMatch = false;
		if(userForm.password==userForm.passwordConfirm){
			passwordMatch = true;
		}
		return passwordMatch;
	}

	$scope.addUser=function(userForm,userAlternatives){
		userForm.userType=userAlternatives.userType;
		
		$http({method: 'POST', url: 'json/login/addNewUser', data: userForm}).
		success(function (data, status, headers, config) {
			$scope.showAddPersonDiv=false;
			$scope.showSuccessMessage=true;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve users from the db");
		});	
	}

	/*
	Checks if there are any empty fields.
	Returns true if there are no empty fields.
	Returns false if any one field is empty.
	*/
	$scope.noEmptyFields=function(userForm)
	{	
		var isNotNull=true;
		
		if(userForm.user==null){
				isNotNull=false;
		}
		if(userForm.password==null){
				isNotNull=false;
		}
		if(userForm.passwordConfirm==null){
				isNotNull=false;
		}

		return isNotNull;
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
		else if(redirectTo=="order"){
			$location.url('/order');
		}
	}

	// Deletes all cookies
	$scope.deleteCookies = function(){
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++){
  			document.cookie = cookies[i].split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}

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

	//On load run the following
	if($scope.isCookieSet('user')== true && $scope.getCookie('userType')=='admin'){
		$scope.getEndedMonths($scope.getCookie('user'));	
	}
	else if($scope.isCookieSet('user')==true && $scope.getCookie('userType')=='seller'){
		$scope.redirect('order')
	}
	else{
		$scope.redirect('logout');
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
				$scope.setCookie('userType',data[0].userType);
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
