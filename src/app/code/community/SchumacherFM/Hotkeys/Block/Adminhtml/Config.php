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
    public function getConfig()
    {
        /** @var SchumacherFM_Hotkeys_Helper_Data $helper */
        $helper = Mage::helper('hotkeys');

        $config = array(
            'keyMainMenu'   => $helper->getKeyMainMenu(),
            'manageHotKeys' => $this->getUrl('adminhtml/hotkeys_routes'),
            'baseUrl'       => $this->getBaseUrl(),
            'globalKeys'    => $array = Mage::getModel('hotkeys/source_hotkeysRoutes')->getOptionsWithUrl(),
            '__'            => array( // @todo refactor
                'Manage shortcuts'     => $helper->__('Manage shortcuts'),
                'Available Shortcuts' => $helper->__('Available Shortcuts'),
            ),
        );

        return json_encode($config);
    }
}
