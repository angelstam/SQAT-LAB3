describe('basic test on website', function() {
  var angularPage = require('./AngularPage.js');

  beforeEach(function() {
    angularPage.navigate();
  })

//Testing report page
 it('should place an order', function() {

    /*
      Logging in
    */
    var userNameField = element(by.model('loginUserForm.user'));
    userNameField.sendKeys('fredrik');

    var passwordField = element(by.model('loginUserForm.password'));
    passwordField.sendKeys('123');

    var loginButton = element(by.id('loginUserButton'));
    loginButton.click();

    /*
    Placing order
    */
    var townField = element(by.model('orderForm.town'));
    townField.sendKeys('Bejing');

    var locksField = element(by.model('orderForm.locks'));
    locksField.sendKeys(2);

    var stocksField = element(by.model('orderForm.stocks'));
    stocksField.sendKeys(3);

    var barrelsField = element(by.model('orderForm.barrels'));
    barrelsField.sendKeys(4);

    var placeOrderButton = element(by.model('placeOrder'));
    placeOrderButton.click();

   /*
    Checking result
    */
  	var successMessage = element(by.id('successMessage'));
   	expect(successMessage.isDisplayed()).toEqual(true);
  });
});