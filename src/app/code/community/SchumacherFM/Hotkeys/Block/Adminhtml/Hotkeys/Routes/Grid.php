<?php

class SchumacherFM_Hotkeys_Block_Adminhtml_Hotkeys_Routes_Grid extends Mage_Adminhtml_Block_Widget_Grid
{

    public function __construct()
    {
        parent::__construct();
        $this->setId('cmsBlockGrid');
        $this->setDefaultSort('block_identifier');
        $this->setDefaultDir('ASC');
    }

    protected function _prepareCollection()
    {
        /** @var SchumacherFM_Hotkeys_Model_Resource_Routes_Collection $collection */
        $collection = Mage::getModel('hotkeys/routes')
            ->getCollection()
            ->setRoutesOrder();
        $this->setCollection($collection);
        return parent::_prepareCollection();
    }

    protected function _prepareColumns()
    {
        $baseUrl = $this->getUrl();

        $this->addColumn('id', array(
            'header' => Mage::helper('hotkeys')->__('ID'),
            'align'  => 'left',
            'index'  => 'id',
            'width'  => '70px',
        ));

        $this->addColumn('route', array(
            'header' => Mage::helper('hotkeys')->__('Route'),
            'align'  => 'left',
            'index'  => 'route'
        ));

        $this->addColumn('hotkey', array(
            'header' => Mage::helper('hotkeys')->__('Shortcut Key'),
            'align'  => 'left',
            'index'  => 'hotkey'
        ));

        return parent::_prepareColumns();
    }

    public function getRowUrl($row)
    {
        return $this->getUrl('*/*/edit', array('id' => $row->getId()));
    }
}
