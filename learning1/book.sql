/*
SQLyog Community Edition- MySQL GUI v6.15
MySQL - 5.6.17 : Database - book
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

create database if not exists `book`;

USE `book`;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*Table structure for table `category_book` */

DROP TABLE IF EXISTS `category_book`;

CREATE TABLE `category_book` (
  `catId` bigint(20) NOT NULL AUTO_INCREMENT,
  `catName` varbinary(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`catId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

/*Data for the table `category_book` */

insert  into `category_book`(`catId`,`catName`,`status`) values (1,'Science Fiction',1),(2,'Satire',1),(3,'Drama',1),(4,'Action & Adventure',1),(5,'Romance',1),(6,'Mystery',1),(7,'Horror',1),(8,'Self Help',1),(9,'Health',1),(10,'Guide',1),(11,'Travel',1),(12,'Children\'s',1),(13,'Religion & Spirituality',1),(14,'Science',1),(15,'History',1),(16,'Mathematics',1),(17,'Anthology',1),(18,'Poetry',1),(19,'Encyclopedias',1),(20,'Dictionaries',1),(21,'Comics',1),(22,'Art',1),(23,'Cookbooks',1),(24,'Diaries',1),(25,'Journals',1),(26,'Prayer',1),(27,'Series',1),(28,'Trilogy',1),(29,'Biographies',1),(30,'Autobiographies',1),(31,'Fantasy',1);

/*Table structure for table `category_magazine` */

DROP TABLE IF EXISTS `category_magazine`;

CREATE TABLE `category_magazine` (
  `magId` bigint(20) NOT NULL AUTO_INCREMENT,
  `magName` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`magId`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

/*Data for the table `category_magazine` */

insert  into `category_magazine`(`magId`,`magName`,`status`) values (1,'Animals & Pets',1),(2,'Antiques & Collectibles',1),(3,'Art & Photography',1),(4,'Auto & Cycles',1),(5,'Entertainment & TV',1),(6,'Ethnic',1),(7,'Fashion & Style',1),(8,'Health & Fitness',1),(9,'History',1),(10,'Men\'s',1),(11,'Music',1),(12,'News & Politics',1),(13,'Newspapers',1),(14,'Business & Finance',1),(15,'Hobbies',1),(16,'Parenting',1),(17,'Children',1),(18,'Comics',1),(19,'Combo Offers',1),(20,'Computers & Electronics',1),(21,'Cooking, Food & Beverages',1),(22,'Crafts',1),(23,'Home & Gardening',1),(24,'Humor',1),(25,'Internatinal',1),(26,'Psychology',1),(27,'Religion',1),(28,'Science & Nature',1),(29,'Sports & Recreation',1),(30,'Teen',1),(31,'Digital',1),(32,'Education',1),(33,'Enrichment',1),(34,'Women\'s',1),(35,'Journals',1),(36,'Lifestyle',1),(37,'Literary',1),(38,'Local & Regional',1),(39,'Medical',1);

/*Table structure for table `inventory` */

DROP TABLE IF EXISTS `inventory`;

CREATE TABLE `inventory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `quantity` bigint(20) DEFAULT NULL,
  `product` int(11) DEFAULT NULL,
  `unit` int(11) DEFAULT NULL,
  `owner` bigint(20) DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `paperback` bigint(20) DEFAULT NULL COMMENT 'number of pages ',
  `publisher` text,
  `language` int(11) DEFAULT NULL,
  `isbn_10` bigint(20) DEFAULT NULL,
  `isbn_13` bigint(20) DEFAULT NULL,
  `dimension` text,
  `title` text,
  `description` text,
  `category1` int(11) DEFAULT NULL,
  `category2` int(11) DEFAULT NULL,
  `category3` int(11) DEFAULT NULL,
  `category4` int(11) DEFAULT NULL,
  `category5` int(11) DEFAULT NULL,
  `category6` int(11) DEFAULT NULL,
  `category7` int(11) DEFAULT NULL,
  `category8` int(11) DEFAULT NULL,
  `category9` int(11) DEFAULT NULL,
  `category10` int(11) DEFAULT NULL,
  `copyright_date` date DEFAULT NULL,
  `date` date DEFAULT NULL COMMENT 'at whichh product is added',
  `adult_content` tinyint(1) DEFAULT NULL,
  `author` text,
  `edition` text,
  `condition` int(11) DEFAULT NULL,
  `refundable` tinyint(1) DEFAULT NULL,
  `status` int(11) DEFAULT NULL COMMENT 'statys of product if booked or sold',
  `image1` text,
  `image2` text,
  `image3` text,
  `image4` text,
  `image5` text,
  `secure_id` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `inventory` */

/*Table structure for table `product_info` */

DROP TABLE IF EXISTS `product_info`;

CREATE TABLE `product_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `isbn_10` text,
  `isbn_13` text,
  `product_rating` int(11) DEFAULT NULL,
  `product_review` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `product_info` */

/*Table structure for table `transaction` */

DROP TABLE IF EXISTS `transaction`;

CREATE TABLE `transaction` (
  `transaction_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `inventory_id` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unit` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `transaction` */

/*Table structure for table `userinfo` */

DROP TABLE IF EXISTS `userinfo`;

CREATE TABLE `userinfo` (
  `userid` bigint(20) NOT NULL AUTO_INCREMENT,
  `firstName` text,
  `lastName` text,
  `status` int(11) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` text NOT NULL,
  `image` longtext,
  `rating` int(11) DEFAULT NULL,
  `review` longtext,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `userinfo` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
