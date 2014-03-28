INSERT INTO `commissionlevels` (`commissionLevel1`, `commissionLevel2`, `commissionLevel3`) VALUES (10,15,20);

INSERT INTO `items` (`itemID`, `itemName`, `itemPrice`, `maximumAvailablePerMonth`) VALUES (1,'locks',45,70),(2,'stocks',30,80),(3,'barrels',25,90);

INSERT INTO `itemstock` (`year`, `month`, `locks`, `stocks`, `barrels`) VALUES (2014,3,43,43,43);

INSERT INTO `orders` (`date`, `town`, `locks`, `stocks`, `barrels`) VALUES ('2014-03-01','Bejing',1,2,3),('2014-03-01','Bejing',1,2,3),('2014-03-01','Norrköping',2,2,2),('2014-03-01','Norrköping',2,2,2),('2014-03-01','Linköping',2,2,2),('2014-02-20','Örebro',2,3,4),('2014-02-20','Malmö',2,3,4),('2014-02-20','Köpenhamn',2,3,4),('2014-02-20','New York',2,3,4),('2014-02-20','Dallas',2,3,4),('2014-02-20','Oklahoma',2,3,4),('2014-02-20','Kansas',2,3,4),('2014-02-20','Falköping',3,4,5);

INSERT INTO `salespersons` (`Id`, `Name`, `BankAccountValue`) VALUES (1,'Fredrik',10);
