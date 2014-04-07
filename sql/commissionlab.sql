CREATE DATABASE  IF NOT EXISTS `commissionlab` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `commissionlab`;
-- MySQL dump 10.13  Distrib 5.6.13, for Win32 (x86)
--
-- Host: 127.0.0.1    Database: commissionlab
-- ------------------------------------------------------
-- Server version	5.6.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `commissionlevels`
--

DROP TABLE IF EXISTS `commissionlevels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commissionlevels` (
  `commissionLevel1` int(11) DEFAULT NULL,
  `commissionLevel2` int(11) DEFAULT NULL,
  `commissionLevel3` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commissionlevels`
--

LOCK TABLES `commissionlevels` WRITE;
/*!40000 ALTER TABLE `commissionlevels` DISABLE KEYS */;
/*!40000 ALTER TABLE `commissionlevels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `completed_month_totals`
--

DROP TABLE IF EXISTS `completed_month_totals`;
/*!50001 DROP VIEW IF EXISTS `completed_month_totals`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `completed_month_totals` (
  `year` tinyint NOT NULL,
  `month` tinyint NOT NULL,
  `yearmonth` tinyint NOT NULL,
  `locks` tinyint NOT NULL,
  `stocks` tinyint NOT NULL,
  `barrels` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `completed_months`
--

DROP TABLE IF EXISTS `completed_months`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `completed_months` (
  `year` int(11) NOT NULL,
  `month` tinyint(4) NOT NULL,
  `completed_on_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`year`,`month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `completed_months`
--

LOCK TABLES `completed_months` WRITE;
/*!40000 ALTER TABLE `completed_months` DISABLE KEYS */;
INSERT INTO `completed_months` (`year`, `month`, `completed_on_date`) VALUES (2014,1,NULL),(2014,2,NULL),(2014,3,NULL),(2014,5,NULL);
/*!40000 ALTER TABLE `completed_months` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `itemID` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(45) DEFAULT NULL,
  `itemPrice` int(11) DEFAULT NULL,
  `maximumAvailablePerMonth` int(11) DEFAULT NULL,
  PRIMARY KEY (`itemID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` (`itemID`, `itemName`, `itemPrice`, `maximumAvailablePerMonth`) VALUES (1,'locks',45,70),(2,'stocks',30,80),(3,'barrels',25,90);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `month_totals`
--

DROP TABLE IF EXISTS `month_totals`;
/*!50001 DROP VIEW IF EXISTS `month_totals`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `month_totals` (
  `seller` tinyint NOT NULL,
  `year` tinyint NOT NULL,
  `month` tinyint NOT NULL,
  `yearmonth` tinyint NOT NULL,
  `locks` tinyint NOT NULL,
  `stocks` tinyint NOT NULL,
  `barrels` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `open_month_totals`
--

DROP TABLE IF EXISTS `open_month_totals`;
/*!50001 DROP VIEW IF EXISTS `open_month_totals`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `open_month_totals` (
  `seller` tinyint NOT NULL,
  `month` tinyint NOT NULL,
  `locks` tinyint NOT NULL,
  `stocks` tinyint NOT NULL,
  `barrels` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `seller` varchar(45) NOT NULL,
  `date` date DEFAULT NULL,
  `town` varchar(45) DEFAULT NULL,
  `locks` int(11) DEFAULT NULL,
  `stocks` int(11) DEFAULT NULL,
  `barrels` int(11) DEFAULT NULL,
  PRIMARY KEY (`seller`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`seller`, `date`, `town`, `locks`, `stocks`, `barrels`) VALUES ('fredrik','2014-04-08','Harbin',1,2,3),('undefined','2014-04-07','Harbin',1,2,3);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prices`
--

DROP TABLE IF EXISTS `prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prices` (
  `locks` int(11) DEFAULT NULL,
  `stocks` int(11) DEFAULT NULL,
  `barrels` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prices`
--

LOCK TABLES `prices` WRITE;
/*!40000 ALTER TABLE `prices` DISABLE KEYS */;
/*!40000 ALTER TABLE `prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userName` varchar(45) NOT NULL,
  `password` varchar(45) DEFAULT NULL,
  `userType` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`userName`, `password`, `userType`) VALUES ('fredrik','123','seller'),('johan','123','admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `completed_month_totals`
--

/*!50001 DROP TABLE IF EXISTS `completed_month_totals`*/;
/*!50001 DROP VIEW IF EXISTS `completed_month_totals`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `completed_month_totals` AS select `completed_months`.`year` AS `year`,`completed_months`.`month` AS `month`,`month_totals`.`yearmonth` AS `yearmonth`,`month_totals`.`locks` AS `locks`,`month_totals`.`stocks` AS `stocks`,`month_totals`.`barrels` AS `barrels` from (`completed_months` left join `month_totals` on(((`completed_months`.`year` = `month_totals`.`year`) and (`completed_months`.`month` = `month_totals`.`month`)))) group by `completed_months`.`year`,`completed_months`.`month` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `month_totals`
--

/*!50001 DROP TABLE IF EXISTS `month_totals`*/;
/*!50001 DROP VIEW IF EXISTS `month_totals`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `month_totals` AS select `orders`.`seller` AS `seller`,year(`orders`.`date`) AS `year`,month(`orders`.`date`) AS `month`,date_format(`orders`.`date`,'%Y-%m') AS `yearmonth`,sum(`orders`.`locks`) AS `locks`,sum(`orders`.`stocks`) AS `stocks`,sum(`orders`.`barrels`) AS `barrels` from `orders` group by `year`,`month` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `open_month_totals`
--

/*!50001 DROP TABLE IF EXISTS `open_month_totals`*/;
/*!50001 DROP VIEW IF EXISTS `open_month_totals`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `open_month_totals` AS select `mt`.`seller` AS `seller`,`mt`.`yearmonth` AS `month`,`mt`.`locks` AS `locks`,`mt`.`stocks` AS `stocks`,`mt`.`barrels` AS `barrels` from `month_totals` `mt` where (not(exists(select `cm`.`year`,`cm`.`month` from `completed_months` `cm` where ((`mt`.`year` = `cm`.`year`) and (`mt`.`month` = `cm`.`month`))))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-04-08  0:48:49
