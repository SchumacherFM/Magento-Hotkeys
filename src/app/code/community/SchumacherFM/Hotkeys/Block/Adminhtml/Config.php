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
        /** @var SchumacherFM_PicturePerfect_Helper_Data $helper */
        $helper = Mage::helper('hotkeys');

        $config = array(

            'translations' => array()
        );

        $translations = array(
            'Initializing ...',
            'Waiting for upload ...',
            'Product ID:',
            'An error occurred. Tried to parse JSON response which could not be in JSON format.',
            'Invalid responseText in JSON',
            'Something went wrong during upload. Please try again. See console.log.',
            'An error occurred after uploading. No JSON found ...',
            'An error occurred. Please see console.log',
            'An error occurred:',
            'File format is not supported',
            '',
        );

        foreach ($translations as $trans) {
            $config['translations'][$trans] = $helper->__($trans);
        }

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
