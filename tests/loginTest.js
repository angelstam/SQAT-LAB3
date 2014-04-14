describe('basic test on website', function() {
  var angularPage = require('./AngularPage.js');

  beforeEach(function() {
    angularPage.navigate();
  })

  //Testing to log in
  it('should should be able to log in', function() {

   var userNameField = element(by.model('loginUserForm.user'));
   userNameField.sendKeys('fredrik');

   var passwordField = element(by.model('loginUserForm.password'));
   passwordField.sendKeys('123');

    var loginButton = element(by.id('loginUserButton'));
    loginButton.click();

    var welcomeMessage = element(by.id('welcomeMessage'));
    expect(welcomeMessage.isDisplayed()).toEqual(true);
  });
});