import React, { useState } from 'react';
import { Button, Modal, Table } from 'antd';

import CompanyForm from './components/CompanyForm';

import Layout from '../../components/Layout';
import { Company } from '../../queries/companies/types';
import { useCompanies } from '../../queries/companies';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';

import './index.css';

const Companies: React.FC = () => {
  const { data } = useCompanies();
  const [visible, setVisible] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<Company>({} as Company);

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
      width: '80%',
      key: 'name',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (text: string, record: Company) => (
        <Button type='link' onClick={() => showEditModal(record)}>
          <EditOutlined style={{ fontSize: 26, marginLeft: 4 }} />
        </Button>
      ),
    },
  ];

  const showEditModal = (record: Company) => {
    setDataToEdit(record);
    setVisible(true);
  };

  const cancelEditModal = () => {
    setDataToEdit({} as Company);
    setVisible(false);
  };

  const onFinishForm = () => {
    setDataToEdit({} as Company);
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
          title="Add/Update Company"
          open={visible}
          onCancel={cancelEditModal}
          footer={null}
        >
          <CompanyForm data={dataToEdit} onFinishForm={onFinishForm} />
        </Modal>
      </div>
    </Layout>
  );
};

export default Companies;