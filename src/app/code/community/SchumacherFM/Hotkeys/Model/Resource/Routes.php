<?php

class SchumacherFM_Hotkeys_Model_Resource_Routes extends Mage_Core_Model_Resource_Db_Abstract
{
    /**
     * Initialize resource model
     *
     */
    protected function _construct()
    {
        $this->_init('hotkeys/routes', 'id');
    }

    /**
     * Retrieve select object for load object data
     *
     * @param string               $field
     * @param mixed                $value
     * @param Mage_Cms_Model_Block $object
     *
     * @return Zend_Db_Select
     */
    protected function _getLoadSelect($field, $value, $object)
    {
        return parent::_getLoadSelect($field, $value, $object);
//        $select = parent::_getLoadSelect($field, $value, $object);

        if ($object->getStoreId()) {
            $stores = array(
                (int)$object->getStoreId(),
                Mage_Core_Model_App::ADMIN_STORE_ID,
            );

            $select->join(
                array('cbs' => $this->getTable('cms/block_store')),
                $this->getMainTable() . '.block_id = cbs.block_id',
                array('store_id')
            )->where('is_active = ?', 1)
                ->where('cbs.store_id in (?) ', $stores)
                ->order('store_id DESC')
                ->limit(1);
        }

        return $select;
    }
}
