import React, { useState } from 'react';
import { Button, Modal, Table } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useCompanies } from '../../queries/companies';
import { Unit } from '../../queries/units/types';
import { useUnits } from '../../queries/units';

import UnitForm from './components/UnitsForm';
import Layout from '../../components/Layout';

import './index.css';

const Units: React.FC = () => {
  const { data } = useUnits()
  const { data: dataCompanies } = useCompanies()
  const [visible, setVisible] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<Unit>({} as Unit);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '40%',
      key: 'name',
    },
    {
      title: 'Company',
      dataIndex: 'companyId',
      width: '40%',
      key: 'companyId',
      render: (companyId: number) => (
        <span>
          {dataCompanies?.find(i => i.id === companyId)?.name}
        </span>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (text: string, record: Unit) => (
        <Button type='link' onClick={() => showEditModal(record)}>
          <EditOutlined style={{ fontSize: 26, marginLeft: 4 }} />
        </Button>
      ),
    },
  ];

  const showEditModal = (record: Unit) => {
    setDataToEdit(record);
    setVisible(true);
  };

  const cancelEditModal = () => {
    setDataToEdit({} as Unit);
    setVisible(false);
  };

  const onFinishForm = () => {
    setDataToEdit({} as Unit);
    setVisible(false);
  };

  return (
    <Layout>
      <div>
        <div className='buttonContainer'>
          <Button type="link" className='button' onClick={() => setVisible(true)}>
            <PlusCircleOutlined style={{ fontSize: 24, marginLeft: 4 }} />
          </Button>
        </div>
        <Table columns={columns} dataSource={data} />
        <Modal
          title="Add/Update Unit"
          open={visible}
          onCancel={cancelEditModal}
          footer={null}
        >
          <UnitForm data={dataToEdit} onFinishForm={onFinishForm} />
        </Modal>
      </div>
    </Layout>
  );
};

export default Units;