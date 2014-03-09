<?php

$installer = $this;
/* @var $installer Mage_Core_Model_Resource_Setup */

$installer->startSetup();

$installer->run("
-- DROP TABLE IF EXISTS {$installer->getTable('hotkeys/routes')};
CREATE TABLE {$installer->getTable('hotkeys/routes')} (
  `id` int(6) NOT NULL auto_increment,
  `route` varchar(255) NOT NULL,
  `hotkey` varchar(50) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `uHotKey` (`hotkey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Hot keys routes and default keys';

-- DROP TABLE IF EXISTS {$installer->getTable('hotkeys/users')};
CREATE TABLE {$installer->getTable('hotkeys/users')} (
  `id` int(6) NOT NULL auto_increment,
  `route_id` int(6) NOT NULL,
  `user_id` int(6) NOT NULL,
  `hotkey` varchar(50) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `userHotKey` (`user_id`,`hotkey`),
  CONSTRAINT `FK_HOTKEYS_ROUTE` FOREIGN KEY (`route_id`) REFERENCES {$this->getTable('hotkeys/routes')} (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Hot keys per user';
");

$installer->endSetup();
