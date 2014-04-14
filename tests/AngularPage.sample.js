/*
 * Defines the AngularPage used by the test cases.
 * Copy this file to AngularPage.js to use.
 */

var AngularPage = function() {
  this.navigate = function() {
    browser.get('http://sqat3.local/');
  };
};

module.exports = new AngularPage();
