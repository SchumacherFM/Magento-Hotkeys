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

    public function setRoutesOrder()
    {
        $this->setOrder('route', self::SORT_ORDER_ASC);
        $this->setOrder('hotkey', self::SORT_ORDER_ASC);
        return $this;
    }
}
