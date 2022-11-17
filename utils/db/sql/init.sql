-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.4.13-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Exportiere Datenbank Struktur für bhhbot
CREATE DATABASE IF NOT EXISTS `bhhbot` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `bhhbot`;

-- Exportiere Struktur von Tabelle bhhbot.guilds
CREATE TABLE IF NOT EXISTS `guilds` (
  `guildID` varchar(255) NOT NULL DEFAULT '',
  `factChannel` varchar(255) DEFAULT NULL,
  `factTime` varchar(255) DEFAULT '00:00',
  `factLang` varchar(255) DEFAULT 'de',
  `logChannel` varchar(50) DEFAULT NULL,
  `joinRole` varchar(255) DEFAULT NULL,
  `tos` TINYINT NULL DEFAULT '0',
  PRIMARY KEY (`guildID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Daten Export vom Benutzer nicht ausgewählt

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
