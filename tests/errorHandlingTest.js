describe('basic test on website', function() {
  var angularPage = require('./AngularPage.js');
  
  beforeEach(function() {
    angularPage.navigate();
  })
  
  it('should try to insert faulty values', function() {
   /*
      Logging in
    */
    var userNameField = element(by.model('loginUserForm.user'));
    userNameField.sendKeys('johan');

    var passwordField = element(by.model('loginUserForm.password'));
    passwordField.sendKeys('123');

    var loginButton = element(by.id('loginUserButton'));
    loginButton.click();

     /*
    Placing faulty order
    */
    var locksField = element(by.model('orderForm.locks'));
    locksField.sendKeys(2);

    var stocksField = element(by.model('orderForm.stocks'));
    stocksField.sendKeys(3);

    var barrelsField = element(by.model('orderForm.barrels'));
    barrelsField.sendKeys(4);

    var placeOrderButton = element(by.model('placeOrder'));
    placeOrderButton.click();

    var errorMessage = element(by.id('errorMessage'));
    expect(errorMessage.isDisplayed()).toEqual(true);
  });
});