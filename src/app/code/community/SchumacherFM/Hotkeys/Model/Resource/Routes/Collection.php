<?php

class SchumacherFM_Hotkeys_Model_Resource_Routes_Collection extends Mage_Core_Model_Resource_Db_Collection_Abstract
{
    /**
     * Define resource model
     *
     */
    protected function _construct()
    {
        $this->_init('hotkeys/routes');
    }
}
