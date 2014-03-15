<?php

class SchumacherFM_Hotkeys_Model_Source_AdminRoutes
{
    /**
     * Page layout options
     *
     * @var array
     */
    protected $_options = null;

    protected $_menuArr = array();

    /**
     * Recursive Build Menu array
     *
     * @param Varien_Simplexml_Element $parent
     * @param string                   $path
     * @param int                      $level
     *
     * @return array
     */
    protected function _buildMenuArray(Varien_Simplexml_Element $parent = null, $path = '', $level = 0)
    {
        if (is_null($parent)) {
            $parent = Mage::getSingleton('admin/config')->getAdminhtmlConfig()->getNode('menu');
        }

        foreach ($parent->children() as $childName => $child) {
            if (1 == $child->disabled) {
                continue;
            }

            if ($child->action) {
                $this->_menuArr[] = array(
                    'label' => (string)$child->title,
                    'url'   => (string)$child->action
                );
            }

            if ($child->children) {
                $this->_buildMenuArray($child->children, $path . $childName . '/', $level + 1);
            }
        }

        return $this;
    }

    /**
     * @param bool $includeUrlInLabel
     *
     * @return array
     */
    public function getOptions($includeUrlInLabel = true)
    {
        if ($this->_options === null) {
            $this->_options = array();
            $this->_buildMenuArray();

            $longestUrlLength = 0;
            foreach ($this->_menuArr as $routes) {
                $urlLength = strlen($routes['url']);
                if ($urlLength > $longestUrlLength) {
                    $longestUrlLength = $urlLength;
                }
            }
            $longestUrlLength += 2;

            foreach ($this->_menuArr as $routes) {
                $label                          = true === $includeUrlInLabel
                    ? str_pad(trim($routes['url'], '/'), $longestUrlLength, '_', STR_PAD_RIGHT) . $routes['label']
                    : $routes['label'];
                $this->_options[$routes['url']] = str_replace('adminhtml/', '', $label);
            }
            ksort($this->_options);
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
