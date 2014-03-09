<?php

/**
 * @category    SchumacherFM_PicturePerfect
 * @package     Block
 * @author      Cyrill at Schumacher dot fm / @SchumacherFM
 * @copyright   Copyright (c) Please read the EULA
 */
class SchumacherFM_Hotkeys_Block_Adminhtml_Config extends Mage_Adminhtml_Block_Abstract
{
    /**
     * @return string json encoded
     */
    protected function _getConfig()
    {
        /** @var SchumacherFM_Hotkeys_Helper_Data $helper */
        $helper = Mage::helper('hotkeys');

        $config = array(
            'keyMainMenu' => $helper->getKeyMainMenu()
        );

        return Zend_Json_Encoder::encode($config);
    }

    /**
     * @return string
     */
    protected function _toHtml()
    {
        return '<div style="display:none;" id="hotkeysConfig" data-config=\'' .
        $this->_getConfig() . '\'></div>';
    }
}
