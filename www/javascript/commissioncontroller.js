app.controller("orderController", function($scope, $http, $location)
{
	$scope.stock=null;
	$scope.soldItemValue= 0;
	$scope.totalSoldValue=0;
	$scope.monthIndex=0;
	$scope.recievedData=null;
	$scope.currentMonthOrder=null;
	$scope.leftInStock=null;
	$scope.commissionInformation=null;
	$scope.numberFormat = /^([1-9]{1}|[1-9]{1}[0-9]{1})$/;
	$scope.errorObject={};
	$scope.errorObject.errorHasOccured=false;
	$scope.endedMonthsData;
	$scope.monthToProcess=null;
	$scope.orderIsAdded=false;
	$scope.v = {
        Dt: Date.now()
    }

	$scope.openMonths; // Months currently open for new orders
	$scope.openMonthSelected=null;

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
		$scope.monthToProcess=$scope.openMonths[$scope.openMonthSelected].month;
		return $scope.openMonths[$scope.openMonthSelected].month;
	}

	$scope.setCurrentOpenOrderMonth=function(rowId,callback)
	{
		$scope.errorObject.errorHasOccured=false;
		if(rowId=="empty"){
			$scope.openMonthSelected = null;
		}
		else
		{
			$scope.openMonthSelected = rowId;
			$scope.getOrders(callback);
		}
	}

	$scope.getItems=function()
	{
		$http({method: 'GET', url: 'json/items'}).
		success(function (data, status, headers, config) {
			$scope.stock=data;

			for (var i=0;i<$scope.stock.length;i++)
			{
				if($scope.stock[i].itemName == 'locks')
				{
					$scope.stock.locksMax=$scope.stock[i].maximumAvailablePerMonth;
				}else if($scope.stock[i].itemName == 'stocks')
				{
					$scope.stock.stocksMax= $scope.stock[i].maximumAvailablePerMonth;
				}else if($scope.stock[i].itemName == 'barrels')
				{
					$scope.stock.barrelsMax= $scope.stock[i].maximumAvailablePerMonth;
				}
			}
		}).
		error(function (data, status, headers, config) {
		    alert("The retrieving of stocklimits failed");
		});	
	}

	$scope.sendOrder=function(formData)
	{	
		if($scope.isOrderValid(formData)==true){
			formData.user=$scope.getCookie('user');
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
		}
	}

	$scope.processOrder=function(orderForm){
		$scope.monthToProcess=orderForm.date.substring(0,7);
		/*
		Check if entered month is active
		*/
		for(var i=0;i<$scope.openMonths.length;i++){
			//The chosen month is currently open
			if($scope.openMonths[i].month==$scope.monthToProcess){
				$scope.setCurrentOpenOrderMonth(i, function(){
					if($scope.isOrderValid(orderForm)==true){
						$scope.sendOrder(orderForm);
					}
				});
				return;
			}
		}
		
		/*
		If month isn't allready open
		*/
		if($scope.isOrderValid(orderForm)==true){
			$scope.sendOrder(orderForm);
		}
	}

	$scope.isOrderValid=function(orderForm){
		$scope.errorObject.errorHasOccured=false;
		if($scope.isDateValid(orderForm)==true 
			&& $scope.isTownValid(orderForm)==true 
			&& $scope.isItemOrderValid(orderForm)==true){
			return true;
		}else{
			return false;
		}
	}

	$scope.isDateValid=function(orderForm){
		//current date
		var currentDate = new Date();
		//entered date in order
		var orderDate = new Date($scope.monthToProcess);

		/*
		The chosen month is not currently open
		*/
		if((currentDate.getMonth()+1)<=(orderDate.getMonth()+1) 
			&& currentDate.getFullYear()<=orderDate.getFullYear()){
				return true;
		}else{
			$scope.errorObject.message="Not allowed to start report for a past month";
			$scope.errorObject.errorHasOccured=true;
			return false;
		}
	}

	$scope.isItemOrderValid=function(formData){

		/*
		Handle the case where no information has been added in the 
		locks,stocks or barrels fields
		*/
		if(formData.locks==null){
			formData.locks=0;
		}
		if(formData.stocks==null){
			formData.stocks=0;
		}
		if(formData.barrels==null){
			formData.barrels=0;
		}

		/*
		Check if the order contains any locks,stocks or barrels
		*/
		if(formData.locks==0 && formData.stocks==0 && formData.barrels==0){
			$scope.errorObject.message="No items added in the order";
			$scope.errorObject.errorHasOccured=true;
			return false;
		}

		/*
		Check that locks order don't exceed stock limit
		*/
		if(formData.locks<=$scope.stock.locksMax||$scope.openMonthSelected!=null){
			//Check that order don't exceed amount in stock
			if($scope.openMonthSelected!=null && formData.locks<=$scope.stock.locksLeft){
				//Do nothing
			}else{
				$scope.errorObject.message="Locks order exceeds stock limit of: "+$scope.stock.locksLeft+" locks"
				$scope.errorObject.errorHasOccured=true;
				return false;
			}
		}else{
			$scope.errorObject.message="Locks order exceeds stock limit of: "+$scope.stock.locksMax+" locks"
			$scope.errorObject.errorHasOccured=true;
			return false;
		}

		/*
		Check that stocks order don't exceed stock limit
		*/
		if(formData.stocks<=$scope.stock.stocksMax||$scope.openMonthSelected!=null){
			//Check that order don't exceed amount in stock
			if($scope.openMonthSelected!=null && formData.stocks<=$scope.stock.stocksLeft){
				//Do nothing
			}else{
				$scope.errorObject.message="Stocks order exceeds stock limit of: "+$scope.stock.stocksLeft+" stocks"
				$scope.errorObject.errorHasOccured=true;
				return false;
			}
		}else{
			$scope.errorObject.message="Stocks order exceeds stock limit of: "+$scope.stock.stocksLeft+" stocks"
			$scope.errorObject.errorHasOccured=true;
			return false;
		}

		/*
		Check that barrels order don't exceed stock limit
		*/
		if(formData.barrels<=$scope.stock.barrelsMax||$scope.openMonthSelected!=null){
			//Check that order don't exceed amount in stock
			if($scope.openMonthSelected!=null && formData.barrels<=$scope.stock.barrelsLeft){
				return true;
			}else{
				$scope.errorObject.message="Barrels order exceeds stock limit of: "+$scope.stock.barrelsLeft+" barrels"
				$scope.errorObject.errorHasOccured=true;
				return false;
			}
		}else{
			$scope.errorObject.message="Barrels order exceeds stock limit of: "+$scope.stock.barrelsLeft+" barrels"
			$scope.errorObject.errorHasOccured=true;
			return false;
		}
		return true;
	}

	$scope.isTownValid=function(formData){
		/*
		Checks if a town has been added
		*/
		if(formData.town==null){
			$scope.errorObject.message="No town added in the order";
			$scope.errorObject.errorHasOccured=true;
			return false;
		}else{
			return true;
		}
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
	$scope.getOrders=function(callback){
		$http({method: 'POST', url: 'json/order/getOrders', data:{'month':$scope.getOpenMonthSelected(),'user': $scope.getCookie('user')}}).
		success(function (data, status, headers, config) {
		   $scope.currentMonthOrder=data;
		   $scope.getOpenMonths();
		   $scope.calculateItemsLeftInStock();
		   if(callback!=null)
		   {
		   		callback();
		   }
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

	$scope.calculateItemsLeftInStock=function()
	{
		$http({method: 'POST', url: 'json/order/getMonthsSales', data:{'month':$scope.monthToProcess}}).
		success(function (data, status, headers, config) {
		   	$scope.monthSales=data;
		   	$scope.stock.locksLeft=$scope.stock.locksMax-$scope.monthSales[0].locks;
			$scope.stock.stocksLeft=$scope.stock.stocksMax-$scope.monthSales[0].stocks;
			$scope.stock.barrelsLeft=$scope.stock.barrelsMax-$scope.monthSales[0].barrels;
		}).
		error(function (data, status, headers, config) {
		    // ...
		});
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
		if($scope.stock==null){
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
	$scope.showEditUserDiv=false;
	$scope.showChangeUserType=false;
	$scope.showRemoveUser=false;
	$scope.showChangePassword=false;
	$scope.showSuccessMessage=false;
	$scope.addUserForm={};
	$scope.passwordForm={};
	$scope.userTypeForm={};
	$scope.removeUserForm={};
	$scope.successObject={};
	$scope.graphSeries=[];
	$scope.graphXaxis=[];
	$scope.successObject.showSuccessMessage=false;
	$scope.userTypes=[
	{name:'Administrator',userType:'admin'},
	{name:'Seller',userType:'seller'}
	];

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'line'
            }
        },
        series:$scope.graphSeries,
        xAxis: {
        categories: ['Jan']
    	},
        title: {
            text: 'Sale statistics'
        },

        loading: false
    }

	/*
	This method retrieves the data of ended months 
	for the specified user
	*/
	$scope.getEndedMonths=function(user){
		$http({method: 'GET', url: 'json/commission'}).
		success(function (data, status, headers, config) {
			$scope.endedMonthsData=data;
			$scope.createGraphData($scope.endedMonthsData);
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

	$scope.createGraphData=function(endedMonthsData){
		$scope.loadUserNames();
		angular.forEach($scope.usersInDB,function(value){
			$scope.graphSeries.push(
	        	{'name':value.userName,'data':[]}
	        	);
		});

		angular.forEach(endedMonthsData,function(value){
			appendDataForName(value.seller,$scope.calculateTotalSoldValue(value.locks,value.stocks,value.barrels));
		});
	}

	function appendDataForName(name,data){
		angular.forEach($scope.graphSeries,function(serie){
			if(serie.name==name){
				serie.data.push(data);
			}
		});
	}

	$scope.showCreateUser=function(){
		if($scope.showAddPersonDiv==true){
			$scope.showAddPersonDiv=false;
		}
		else{
			if($scope.showEditUserDiv=true){
				$scope.showEditUserDiv=false;
			}
			$scope.showAddPersonDiv=true;
			$scope.userAlternatives=$scope.userTypes[1];
		}
		$scope.showSuccessMessage=false;
		
	}

	$scope.showEditUser=function(){
		if($scope.showEditUserDiv==true){
			$scope.showEditUserDiv=false;
		}
		else{
			if($scope.showAddPersonDiv=true){
				$scope.showAddPersonDiv=false;
			}
			$scope.showEditUserDiv=true;
			$scope.userAlternatives=$scope.userTypes[1];
		}
		$scope.showSuccessMessage=false;
	}

	$scope.showEditOption=function(optionToShow){
		$scope.successObject.showSuccessMessage=false;
		$scope.showChangePassword=false;
		$scope.showChangeUserType=false;
		$scope.showRemoveUser=false;
		if(optionToShow=='password'){
			$scope.showChangePassword=true;
		}else if(optionToShow=='userType'){
			$scope.showChangeUserType=true;
		}else if(optionToShow=='remove'){
			$scope.showRemoveUser=true;
		}
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
	Checks if there are any empty fields.
	Returns true if there are no empty fields.
	Returns false if any one field is empty.
	*/
	$scope.noEmptyFields=function(userForm)
	{	
		var noEmptyFields=true;
		
		if(userForm.user==null){
				noEmptyFields=false;
		}
		if(userForm.password==null){
				noEmptyFields=false;
		}
		if(userForm.passwordConfirm==null){
				noEmptyFields=false;
		}
		return noEmptyFields;
	}

	/*
	This method will check if the new userName is unique in the 
	on the server detabase
	*/
	$scope.userNameExistInDB=function(userForm)
	{	
		if(userForm.user!=null){
			var userNameExists=false;
			angular.forEach($scope.usersInDB,function(value){
				if(userForm.user==value.userName){
					userNameExists=true;
				}
			});
		}else
		{
			var userNameExists=false;
		}
		return userNameExists;
	}

	/*
	Returns true if the passwords match else false.
	*/
	$scope.confirmPasswords=function(userForm)
	{
		var passwordMatch = false;
		if(userForm.password!=null && userForm.passwordConfirm!=null && userForm.password==userForm.passwordConfirm){
			passwordMatch = true;
		}
		return passwordMatch;
	}

	$scope.addUser=function(userForm,userAlternatives){
		userForm.userType=userAlternatives.userType;
		
		$http({method: 'POST', url: 'json/login/addNewUser', data: userForm}).
		success(function (data, status, headers, config) {
			$scope.showAddPersonDiv=false;
			$scope.successObject.message="The new user was added";
			$scope.successObject.showSuccessMessage=true;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve users from the db");
		});	
	}

	$scope.changePassword=function(userForm){	
		$http({method: 'POST', url: 'json/login/changePassword', data: userForm}).
		success(function (data, status, headers, config) {
			$scope.showChangePassword=false;
			$scope.showEditUserDiv=false;
			$scope.successObject.message="The password was changed";
			$scope.successObject.showSuccessMessage=true;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to change password");
		});	
	}

	$scope.changeUserType=function(userForm,userAlternatives){
		userForm.userType=userAlternatives.userType;
		$http({method: 'POST', url: 'json/login/changeUsertype', data: userForm}).
		success(function (data, status, headers, config) {
			$scope.showChangeUserType=false;
			$scope.showEditUserDiv=false;
			$scope.successObject.message="The user type was changed";
			$scope.successObject.showSuccessMessage=true;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to change user type");
		});	
	}

	$scope.removeUser=function(userForm){

		if (confirm('Are you sure you want to remove '+userForm.user+' from the database?')) {
		    $http({method: 'POST', url: 'json/login/removeUser', data: userForm}).
			success(function (data, status, headers, config) {
			$scope.showRemoveUser=false;
			$scope.showEditUserDiv=false;
			$scope.successObject.message="The user was removed";
			$scope.successObject.showSuccessMessage=true;
			}).
			error(function (data, status, headers, config) {
			    alert("Failed to remove user");
			});	
		} else {
		    // Do nothing!
		}
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
