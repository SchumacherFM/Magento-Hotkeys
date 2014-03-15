<?php

class SchumacherFM_Hotkeys_Model_Source_HotkeysRoutes
{

    /**
     * Page layout options
     *
     * @var array
     */
    protected $_options = null;

    protected function _initCollection()
    {
        /** @var SchumacherFM_Hotkeys_Model_Resource_Routes_Collection $collection */
        $collection     = Mage::getModel('hotkeys/routes')->getCollection();
        $this->_options = array();
        foreach ($collection as $item) {
            $this->_options[$item->getHotkey()] = $item->getRoute();
        }
        return $this;
    }

    /**
     * @return array
     */
    public function getOptionsWithUrl()
    {
        $adminRoutes = Mage::getModel('hotkeys/source_adminRoutes')->getOptions(false);
        /** @var Mage_Adminhtml_Model_Url $urlModel */
        $urlModel = Mage::getSingleton('adminhtml/url');
        $baseUrl  = $urlModel->getBaseUrl();
        $options  = $this->getOptions();
        $return   = array();

        foreach ($options as $hotkey => $route) {
            $return[$hotkey] = array(
                'l' => isset($adminRoutes[$route]) ? $adminRoutes[$route] : $route,
                'r' => str_replace($baseUrl, '', $urlModel->getUrl($route)),
            );
        }
        return $return;
    }

    /**
     * Retrieve page layout options
     *
     * @return array
     */
    public function getOptions()
    {
        if ($this->_options === null) {
            $this->_initCollection();
        }
        return $this->_options;
    }

    /**
     * @param bool $withEmpty
     *
     * @return array
     */
    public function toOptionArray($withEmpty = false)
    {
        $options = array();
        foreach ($this->getOptions() as $value => $label) {
            $options[] = array(
                'label' => $label,
                'value' => $value
            );
        }
        if ($withEmpty) {
            array_unshift($options, array('value' => '', 'label' => Mage::helper('page')->__('-- Please Select --')));
        }
        return $options;
    }
}
