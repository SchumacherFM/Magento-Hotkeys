<?php

class SchumacherFM_Hotkeys_Block_Adminhtml_Hotkeys_Routes_Edit extends Mage_Adminhtml_Block_Widget_Form_Container
{
    public function __construct()
    {
        $this->_objectId   = 'id';
        $this->_controller = 'adminhtml_hotkeys_routes';
        $this->_blockGroup = 'hotkeys';

        parent::__construct();

        $this->_updateButton('save', 'label', Mage::helper('hotkeys')->__('Save Shortcut Key'));
        $this->_updateButton('delete', 'label', Mage::helper('hotkeys')->__('Delete Shortcut Key'));
    }

    /**
     * Get edit form container header text
     *
     * @return string
     */
    public function getHeaderText()
    {
        if (Mage::registry('hotkey_route')->getId()) {
            return Mage::helper('hotkeys')->__("Edit Shortcut Key '%s'",
                $this->escapeHtml(Mage::registry('hotkey_route')->getRoute()));
        } else {
            return Mage::helper('hotkeys')->__('New Shortcut Key');
        }
    }

    /**
     * Get form action URL
     *
     * @return string
     */
    public function getFormActionUrl()
    {
        if ($this->hasFormActionUrl()) {
            return $this->getData('form_action_url');
        }
        return $this->getUrl('*/' . 'hotkeys_routes/save');
    }
}
