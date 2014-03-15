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
     * controller_action_layout_load_before
     *
     * @param Varien_Event_Observer $observer
     *
     * @return null
     */
    public function injectHotKeysFiles(Varien_Event_Observer $observer)
    {
        if (true === Mage::helper('hotkeys')->isDisabled()) {
            return null;
        }
        /** @var SchumacherFM_Hotkeys_Adminhtml_Hotkeys_RoutesController $action */
        $action = $observer->getEvent()->getAction();
        $route  = $action->getUsedModuleName() . '_' .
            $action->getRequest()->getControllerName() . '_' .
            $action->getRequest()->getActionName();

        if ('adminhtml_hotkeys_routes_edit' === $route) {
            return null;
        }

        /** @var Mage_Core_Model_Layout $layout */
        $layout = $observer->getEvent()->getLayout();

        /** @var Mage_Core_Model_Layout_Update $update */
        $update = $layout->getUpdate();

        $update->addHandle('HOTKEYS_CONFIG');
    }
}