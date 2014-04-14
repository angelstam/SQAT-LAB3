SQAT-LAB3
=========

##HiT - Software Quality Assurance and Testing - Lab 3: Commission
This project was created as a laboration exercise in the course *Software Quality Assurance and Testing* at *Harbin Institute of Technology* during March and April in 2014 by Johan Angelstam and Fredrik Rosenqvist.

This is an application created using AngularJS with a PHP-MySQL backend.

##JSON REST API

`GET /order`
Returns a list of months not closed.

`GET /order/<month>`
Returns a list of orders for the selected month, YYYY-MM.

`POST /order/<month>`
Send an array with the keys (town, locks, stocks, barrels) to create a new order for the selected month.

`GET /commission`
Returns a list of the commission for all closed months.

## Resources
* https://github.com/mgonto/restangular

### Testing Tools
* E2E-testing: https://github.com/angular/protractor
  - Download and install Node.js from http://nodejs.org/
  - Install Protractor with `npm install -g protractor`
  - Start Selenium server with `webdriver-manager start`
* Unit Tests: http://phpunit.de/
  - Install using these instructions http://phpunit.de/getting-started.html

### Charts
* https://github.com/chinmaymk/angular-charts
* https://github.com/pablojim/highcharts-ng
* https://github.com/bouil/angular-google-chart (probably not offline)

### Authentication and REST and Angular and JSON Web Token (JWT)
* https://github.com/auth0/auth0-angular
* http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/
* http://arthur.gonigberg.com/2013/06/29/angularjs-role-based-auth/
