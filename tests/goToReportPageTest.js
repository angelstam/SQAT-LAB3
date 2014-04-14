describe('basic test on website', function() {
  var angularPage = require('./AngularPage.js');
  
  beforeEach(function() {
    angularPage.navigate();
  })
  
  it('go to report page', function() {
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
    Go to report page
    */
    var reportButton = element(by.id('reportButton'));
    reportButton.click();

    var completeOrders = element(by.id('completedOrdersTable'));
    expect(completeOrders.isDisplayed()).toEqual(true);
  });
});