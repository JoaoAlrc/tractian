import React, { useState } from 'react';
import { Button, Modal, Table } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useCompanies } from '../../queries/companies';
import { User } from '../../queries/users/types';
import { useUsers } from '../../queries/users';

import UserForm from './components/UsersForm';
import Layout from '../../components/Layout';

import './index.css';
import { useUnits } from '../../queries/units';

const Users: React.FC = () => {
  const { data } = useUsers();
  const { data: dataCompanies } = useCompanies();
  const { data: dataUnits } = useUnits();

  const [visible, setVisible] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<User>({} as User);

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
      width: '30%',
      key: 'name',
    },
    {
      title: 'Company',
      dataIndex: 'companyId',
      width: '30%',
      key: 'companyId',
      render: (companyId: number) => (
        <span>
          {dataCompanies?.find(i => i.id === companyId)?.name}
        </span>
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'unitId',
      width: '30%',
      key: 'unitId',
      render: (unitId: number) => (
        <span>
          {dataUnits?.find(i => i.id === unitId)?.name}
        </span>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (text: string, record: User) => (
        <Button type='link' onClick={() => showEditModal(record)}>
          <EditOutlined style={{ fontSize: 26, marginLeft: 4 }} />
        </Button>
      ),
    },
  ];

  const showEditModal = (record: User) => {
    setDataToEdit(record);
    setVisible(true);
  };

  const cancelEditModal = () => {
    setDataToEdit({} as User);
    setVisible(false);
  };

  const onFinishForm = () => {
    setDataToEdit({} as User);
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
          title="Add/Update User"
          open={visible}
          onCancel={cancelEditModal}
          footer={null}
        >
          <UserForm data={dataToEdit} onFinishForm={onFinishForm} />
        </Modal>
      </div>
    </Layout>
  );
};

export default Users;