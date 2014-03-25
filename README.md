SQAT-LAB3
=========

HiT - Software Quality Assurance and Testing - Lab 3: Commission

This is an application created using AngularJS with a MySQL backend.

##JSON REST API

`GET /order`
Returns a list of months not closed.

`GET /order/<month>`
Returns a list of orders for the selected month, YYYY-MM.

`POST /order/<month>`
Send an array with the keys (town, locks, stocks, barrels) to create a new order for the selected month.

`GET /commission`
Returns a list of the commission for all closed months.
