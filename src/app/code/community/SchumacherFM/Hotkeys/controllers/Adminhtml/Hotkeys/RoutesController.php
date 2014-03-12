<?php

/**
 * @category    SchumacherFM_Hotkeys
 * @package     Controller
 * @author      Cyrill at Schumacher dot fm / @SchumacherFM
 * @copyright   Copyright (c) Please read the EULA
 */

/**
 * The usual Magento CRUD app @todo
 *
 * Class SchumacherFM_Hotkeys_Adminhtml_HotkeysController
 */
class SchumacherFM_Hotkeys_Adminhtml_Hotkeys_RoutesController extends Mage_Adminhtml_Controller_Action
{
    /**
     * Init actions
     *
     * @return Mage_Adminhtml_Cms_BlockController
     */
    protected function _initAction()
    {
        // load layout, set active menu and breadcrumbs
        $this->loadLayout()
            ->_setActiveMenu('system/tools/hotkeys')
            ->_addBreadcrumb(Mage::helper('hotkeys')->__('System'), Mage::helper('hotkeys')->__('System'))
            ->_addBreadcrumb(Mage::helper('hotkeys')->__('Tools'), Mage::helper('hotkeys')->__('Tools'))
            ->_addBreadcrumb(Mage::helper('hotkeys')->__('Shortcut Keys'), Mage::helper('hotkeys')->__('Shortcut Keys'));
        return $this;
    }

    /**
     * Index action
     */
    public function indexAction()
    {
        $this->_title($this->__('Hotkeys (Global)'));
        $this->_initAction();
        $this->renderLayout();
    }

    /**
     * Create new CMS block
     */
    public function newAction()
    {
        // the same form is used to create and edit
        $this->_forward('edit');
    }

    /**
     * Edit CMS block
     */
    public function editAction()
    {
        $this->_title($this->__('hotkeys'))->_title($this->__('Shortcut Keys'));

        // 1. Get ID and create model
        $id = (int)$this->getRequest()->getParam('id', 0);
        /** @var SchumacherFM_Hotkeys_Model_Routes $model */
        $model = Mage::getModel('hotkeys/routes');

        // 2. Initial checking
        if ($id > 0) {
            $model->load($id);
            if (!$model->getId()) {
                Mage::getSingleton('adminhtml/session')->addError(Mage::helper('hotkeys')->__('This shortcut key no longer exists.'));
                $this->_redirect('*/*/');
                return;
            }
        }

        $this->_title($model->getId() ? $model->getTitle() : $this->__('New Shortcut Key (Global)'));

        // 3. Set entered data if was error when we do save
        $data = Mage::getSingleton('adminhtml/session')->getFormData(TRUE);
        if (!empty($data)) {
            $model->setData($data);
        }

        // 4. Register model to use later in blocks
        Mage::register('hotkey_route', $model);

        // 5. Build edit form
        $this->_initAction()
            ->_addBreadcrumb($id ? Mage::helper('hotkeys')->__('Edit Shortcut key') : Mage::helper('hotkeys')->__('New Shortcut key'),
                $id ? Mage::helper('hotkeys')->__('Edit Shortcut key') : Mage::helper('hotkeys')->__('New Shortcut key'))
            ->renderLayout();
    }

    /**
     * Save action
     */
    public function saveAction()
    {
        // check if data sent
        if ($data = $this->getRequest()->getPost()) {

            $id = (int)$this->getRequest()->getParam('id', 0);
            /** @var SchumacherFM_Hotkeys_Model_Routes $model */
            $model = Mage::getModel('hotkeys/routes')->load($id);
            if (!$model->getId() && $id) {
                Mage::getSingleton('adminhtml/session')->addError(Mage::helper('hotkeys')->__('This route/shortcut no longer exists.'));
                $this->_redirect('*/*/');
                return;
            }

            // init model and set data
            $model->setData($data);

            // try to save it
            try {
                // save the data
                $model->save();
                Mage::getSingleton('adminhtml/session')->addSuccess(Mage::helper('hotkeys')->__('The route/shortcut has been saved.'));
                Mage::getSingleton('adminhtml/session')->setFormData(FALSE);

                // check if 'Save and Continue'
                if ($this->getRequest()->getParam('back')) {
                    $this->_redirect('*/*/edit', array('id' => (int)$model->getId()));
                    return;
                }
                // go to grid
                $this->_redirect('*/*/');
                return;
            } catch (Exception $e) {
                // display error message
                Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
                // save data in session
                Mage::getSingleton('adminhtml/session')->setFormData($data);
                // redirect to edit form
                $this->_redirect('*/*/edit', array('id' => $this->getRequest()->getParam('id')));
                return;
            }
        }
        $this->_redirect('*/*/');
    }

    /**
     * Delete action
     */
    public function deleteAction()
    {
        // check if we know what should be deleted
        $id = (int)$this->getRequest()->getParam('id', 0);
        if ($id > 0) {
            try {
                /** @var SchumacherFM_Hotkeys_Model_Routes $model */
                $model = Mage::getModel('hotkeys/routes')->load($id);
                $model->delete();
                // display success message
                Mage::getSingleton('adminhtml/session')->addSuccess(Mage::helper('hotkeys')->__('The route/shortcut has been deleted.'));
                // go to grid
                $this->_redirect('*/*/');
                return;
            } catch (Exception $e) {
                // display error message
                Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
                // go back to edit form
                $this->_redirect('*/*/edit', array('id' => $id));
                return;
            }
        }
        // display error message
        Mage::getSingleton('adminhtml/session')->addError(Mage::helper('hotkeys')->__('Unable to find a route/shortcut to delete.'));
        // go to grid
        $this->_redirect('*/*/');
    }

    /**
     * Check the permission to run it
     *
     * @return boolean
     */
    protected function _isAllowed()
    {
        return Mage::getSingleton('admin/session')->isAllowed('system/tools/hotkeys');
    }
}