describe('basic test on website', function() {
  var angularPage = require('./AngularPage.js');

  beforeEach(function() {
    angularPage.navigate();
  })

//Testing report page
  it('should show table on report page', function() {

   var reportButton = element(by.id('reportButton'));
   reportButton.click();

  	//var x = element(by.id('tableOfStock'));
  	var x = element(by.repeater('dataRow in endedMonthsData'));
   	expect(x.isDisplayed()).toEqual(true);

  });

  it('should tell me that the table size is greater than 2', function() {

   var reportButton = element(by.id('reportButton'));
   reportButton.click();

  	var x = element.all(by.css('#tableOfStock tr'));
   	expect(x.count()).toBeGreaterThan(2);
  });

//Testing order page
  it('should tell me that the table size is greater than 2', function() {

   var reportButton = element(by.id('orderButton'));
   reportButton.click();

  	var x = element.all(by.css('#tableOfStock tr'));
   	expect(x.count()).toBeGreaterThan(2);
  });

  
/*
click : Function, 
sendKeys : Function, 
getTagName : Function, 
getCssValue : Function, 
getAttribute : Function, 
getText : Function, 
getSize : Function, 
getLocation : Function, 
isEnabled : Function, 
isSelected : Function, 
submit : Function, 
clear : Function, 
isDisplayed : Function, 
getOuterHtml : Function, 
getInnerHtml : Function, 
findElements : Function, 
isElementPresent : Function,
evaluate : Function, 
$$ : Function, 
findElement : Function, 
find : Function, 
isPresent : Function, 
element : Function, 
$ : Function
 */
});