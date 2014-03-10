<?php

class SchumacherFM_Hotkeys_Model_Source_AdminRoutes
{

    /**
     * Page layout options
     *
     * @var array
     */
    protected $_options = NULL;

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
    protected function _buildMenuArray(Varien_Simplexml_Element $parent = NULL, $path = '', $level = 0)
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
     * Retrieve page layout options
     *
     * @return array
     */
    public function getOptions()
    {
        if ($this->_options === NULL) {
            $this->_options = array();

            $this->_buildMenuArray();

            foreach ($this->_menuArr as $routes) {
                $this->_options[$routes['url']] = str_replace('adminhtml/', '', $routes['url']) . ' / ' . $routes['label'];
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
