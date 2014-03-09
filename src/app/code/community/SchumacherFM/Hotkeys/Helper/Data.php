<?php

/**
 * @category    SchumacherFM_Hotkeys
 * @package     Helper
 * @author      Cyrill at Schumacher dot fm / @SchumacherFM
 * @copyright   Copyright (c) Please read the EULA
 */
class SchumacherFM_Hotkeys_Helper_Data extends Mage_Core_Helper_Abstract
{

    public function isDisabled()
    {
        return !Mage::getStoreConfigFlag('system/hotkeys/enable');
    }

    public function getKeyMainMenu()
    {
        return Mage::getStoreConfig('system/hotkeys/key_main_menu');
    }
}