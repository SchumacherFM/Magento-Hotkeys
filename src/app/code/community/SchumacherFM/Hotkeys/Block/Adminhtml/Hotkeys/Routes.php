<?php

class SchumacherFM_Hotkeys_Block_Adminhtml_Hotkeys_Routes extends Mage_Adminhtml_Block_Widget_Grid_Container
{
    public function __construct()
    {
        $this->_blockGroup     = 'hotkeys';
        $this->_controller     = 'adminhtml_hotkeys_routes';
        $this->_headerText     = Mage::helper('hotkeys')->__('Shortcut Keys (Global)');
        $this->_addButtonLabel = Mage::helper('hotkeys')->__('Add New Route');
        parent::__construct();
    }
}
