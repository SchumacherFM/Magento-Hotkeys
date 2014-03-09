<?php

/**
 * @category    SchumacherFM_Markdown
 * @package     Observer
 * @author      Cyrill at Schumacher dot fm / @SchumacherFM
 * @copyright   Copyright (c)
 */
class SchumacherFM_Hotkeys_Model_Observer_Adminhtml_LayoutUpdate
{
    /**
     * adminhtml_block_html_before
     *
     * @param Varien_Event_Observer $observer
     *
     * @return null
     */
    public function injectHotKeysFiles(Varien_Event_Observer $observer)
    {
        if (TRUE === Mage::helper('hotkeys')->isDisabled()) {
            return NULL;
        }

        /** @var Mage_Core_Model_Layout $layout */
        $layout = $observer->getEvent()->getLayout();

        /** @var Mage_Core_Model_Layout_Update $update */
        $update = $layout->getUpdate();

        $update->addHandle('HOTKEYS_CONFIG');
    }
}