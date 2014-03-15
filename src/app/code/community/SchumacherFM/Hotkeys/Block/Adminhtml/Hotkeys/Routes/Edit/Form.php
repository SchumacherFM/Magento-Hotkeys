<?php

class SchumacherFM_Hotkeys_Block_Adminhtml_Hotkeys_Routes_Edit_Form extends Mage_Adminhtml_Block_Widget_Form
{

    /**
     * Init form
     */
    public function __construct()
    {
        parent::__construct();
        $this->setId('hotkey_route_form');
        $this->setTitle(Mage::helper('hotkeys')->__('Shortcut Key (Global) edit'));
    }

    protected function _prepareForm()
    {
        /** @var SchumacherFM_Hotkeys_Model_Routes $model */
        $model = Mage::registry('hotkey_route');

        $form = new Varien_Data_Form(
            array('id' => 'edit_form', 'action' => $this->getData('action'), 'method' => 'post')
        );

        $form->setHtmlIdPrefix('hkroutes_');

        $fieldset = $form->addFieldset('base_fieldset', array('legend' => Mage::helper('hotkeys')->__('General Information'), 'class' => 'fieldset-wide'));

        if ($model->getId()) {
            $fieldset->addField('id', 'hidden', array(
                'name' => 'id',
            ));
        }

        $fieldset->addField('route', 'select', array(
            'name'     => 'route',
            'label'    => Mage::helper('hotkeys')->__('Route'),
            'required' => true,
            'values'   => $this->_getRoutesOptionArray($model->getRoute()),
        ));

        $fieldset->addField('hotkey', 'text', array(
            'name'               => 'hotkey',
            'label'              => Mage::helper('hotkeys')->__('Shortcut Key'),
            'title'              => Mage::helper('hotkeys')->__('Shortcut Key'),
            'required'           => true,
            'after_element_html' => '<p><small>Please focus the input field with the cursor and then press your favorite combination on the
            keyboard!<br>A green background color indicates that the combination is available and a red background color
            indicates that the shortcut has already been assigned.</small></p>'
        ));

        $fieldset->addField('existing_keys', 'hidden', array(
            'name' => 'existing_keys'
        ));
        $model->setData('existing_keys', $this->_getExistingKeysJson($model->getHotkey()));
        $form->setValues($model->getData());
        $form->setUseContainer(true);
        $this->setForm($form);

        return parent::_prepareForm();
    }

    /**
     * @param $currentRoute
     *
     * @return array
     */
    protected function _getRoutesOptionArray($currentRoute)
    {
        $routes  = Mage::getSingleton('hotkeys/source_adminRoutes')->toOptionArray(true);
        $hotkeys = array_flip(Mage::getSingleton('hotkeys/source_hotkeysRoutes')->getOptions());
        foreach ($routes as $k => $route) {
            if (isset($hotkeys[$route['value']]) && $route['value'] !== $currentRoute) {
                unset($routes[$k]);
            }
        }
        return $routes;
    }

    /**
     * @param string $excludingHotkey
     *
     * @return string
     */
    protected function _getExistingKeysJson($excludingHotkey)
    {
        $array = Mage::getModel('hotkeys/source_hotkeysRoutes')->getOptions();
        if (isset($array[$excludingHotkey])) {
            unset($array[$excludingHotkey]);
        }
        return json_encode($array);
    }
}
