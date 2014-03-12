<?php

class SchumacherFM_Hotkeys_Model_Source_HotkeysRoutes
{

    /**
     * Page layout options
     *
     * @var array
     */
    protected $_options = NULL;

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
     * Retrieve page layout options
     *
     * @return array
     */
    public function getOptions()
    {
        if ($this->_options === NULL) {
            $this->_initCollection();
        }
        return $this->_options;
    }

    /**
     * @param bool $withEmpty
     *
     * @return array
     */
    public function toOptionArray($withEmpty = FALSE)
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
