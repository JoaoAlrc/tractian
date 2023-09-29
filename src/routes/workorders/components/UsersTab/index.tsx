import React, { useCallback, useMemo, useState } from 'react';
import { Select, Tabs, Input, Button, Modal, Typography, TabsProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useUsers } from '../../../../queries/users';

type ChecklistItem = {
  completed: boolean;
  task: string;
};

type Workorder = {
  assetId: number;
  assignedUserIds: number[];
  checklist: ChecklistItem[];
  description: string;
  id: number;
  priority: string;
  status: string;
  title: string;
};

const UsersModal = ({ open, onFinish, assetId }: { open: boolean, onFinish: (data?: Workorder) => void, assetId: number }) => {
  const { data: users } = useUsers();
  const [selectedWorkorder, setSelectedWorkorder] = useState<Workorder | undefined>(undefined);
  const [newChecklistItems, setNewChecklistItems] = useState<string[]>(['', '', '']);
  const [selectedUserIds, setSelectedUserIds] = useState<number[] | undefined>([]);
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>(undefined);

  const handleUserSelectionChange = useCallback((userId: number) => {
    setSelectedUserIds(prevIds => {
      if (prevIds?.includes(userId)) {
        return prevIds.filter(id => id !== userId);
      } else {
        return [...prevIds!, userId];
      }
    });
  }, []);

  const availableUsers = useMemo(() => {
    return users?.filter(user => !selectedUserIds?.includes(user.id)) || [];
  }, [users, selectedUserIds]);

  const Details = () => (
    <>
      <Input placeholder="Title"
        value={selectedWorkorder?.title}
        style={{ marginBottom: 16 }}
        onChange={(e) =>
          setSelectedWorkorder({
            ...selectedWorkorder!,
            title: e.target.value,
          })
        } />
      <Input.TextArea placeholder="Description"
        value={selectedWorkorder?.description}
        style={{ marginBottom: 16 }}
        onChange={(e) =>
          setSelectedWorkorder({
            ...selectedWorkorder!,
            description: e.target.value,
          })
        } />
      <Select
        placeholder="Select Priority"
        value={selectedPriority}
        style={{ width: 200 }}
        onChange={setSelectedPriority}
        options={[{ label: 'Low', value: 'low' },
        { label: 'High', value: 'high' }].map(({ value, label }) => ({ value, label }))}
      />
    </>
  )

  const Users = () => (
    <>
      <Select
        placeholder='Select the desired users'
        value={[]}
        options={availableUsers.map(user => ({ value: user.id, label: user.name }))}
        onSelect={handleUserSelectionChange}
      />
      {selectedUserIds?.map(userId => {
        const user = users?.find(user => user.id === userId);
        if (user) {
          return (
            <div key={user.id} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography.Text>{user.name}</Typography.Text>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleUserSelectionChange(userId)}
              />
            </div>
          );
        }
        return null;
      })}
    </>
  )

  const Checklist = () => (
    <>
      {newChecklistItems.map((item, index) => (
        <Input
          key={index}
          style={{ marginBottom: 16 }}
          placeholder={`Checklist Item ${index + 1}`}
          value={item}
          onChange={(e) => {
            const updatedItems = [...newChecklistItems];
            updatedItems[index] = e.target.value;
            setNewChecklistItems(updatedItems);
          }}
        />
      ))}
    </>
  )

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Details',
      children: <Details />,
    },
    {
      key: '2',
      label: 'Users',
      children: <Users />,
    },
    {
      key: '3',
      label: 'Checklist',
      children: <Checklist />,
    }
  ]

  const handleCancel = () => {
    onFinish();
    setNewChecklistItems(['', '', '']);
    setSelectedWorkorder(undefined);
    setSelectedUserIds([]);
    setSelectedPriority('');
  };

  const handleCreate = () => {
    const newWorkorder: Workorder = {
      assetId,
      assignedUserIds: selectedUserIds!,
      checklist: newChecklistItems.map((item) => ({ completed: false, task: item })),
      description: selectedWorkorder?.description!,
      id: 0,
      priority: selectedPriority!,
      status: '',
      title: selectedWorkorder?.title!,
    };


    onFinish(newWorkorder);
    setNewChecklistItems(['', '', '']);
    setSelectedWorkorder(undefined);
    setSelectedUserIds([]);
    setSelectedPriority('');
  };

  return (
    <>
      <Modal
        title="Create Workorder"
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="create" type="primary" onClick={handleCreate}>
            Create
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="details" items={items} />
      </Modal>
    </ >
  );
};

export default UsersModal;
