import React, { useCallback, useMemo, useState } from 'react';
import { Select, List, Tabs, Input, Button, Checkbox, Badge, Typography, TabsProps, message } from 'antd';
import { useCreateWorkorders, useUpdateWorkorders, useWorkorders } from '../../queries/workorders';
import Layout from '../../components/Layout';
import { useUsers } from '../../queries/users';
import { DeleteOutlined } from '@ant-design/icons';
import { useAssets } from '../../queries/assets';
import Title from 'antd/es/typography/Title';
import UsersModal from './components/UsersTab';
import { useParams } from 'react-router-dom';

const { Option } = Select;

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

const WorkordersDetail: React.FC = () => {
  const { data: workorders } = useWorkorders();
  let { assetId } = useParams();
  const useCreateWorkorder = useCreateWorkorders();
  const useUpdateWorkorder = useUpdateWorkorders();
  const { data: users } = useUsers();
  const { data: assets } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState<number | null>(Number(assetId) || null);
  const [selectedWorkorder, setSelectedWorkorder] = useState<Workorder | undefined>(undefined);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChecklistItems, setNewChecklistItems] = useState<string[]>(['', '', '']);
  const [selectedUserIds, setSelectedUserIds] = useState<number[] | undefined>([]);
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>(undefined);

  const filteredWorkorders = workorders?.filter(
    (wo) => wo.assetId === selectedAsset
  );

  const handleAssetSelect = (id: number) => {
    setSelectedAsset(id);
    setSelectedUserIds(assets?.find(i => i.id === id)?.assignedUserIds);
    setSelectedWorkorder(undefined);
    setSelectedPriority(workorders?.find(i => i.id === id)?.priority);
  };

  const handleWorkorderSelect = async (workorderId: number) => {
    const selected = workorders?.find((wo) => wo.id === workorderId);
    setSelectedWorkorder(selected);
  };

  const handleCreateWorkorder = () => {
    setShowCreateModal(true);
    setSelectedUserIds([]);
  };

  const updatedWorkorder = async () => {
    try {
      const updatedWorkorder: Workorder = {
        id: selectedWorkorder?.id!,
        assetId: selectedAsset!,
        assignedUserIds: selectedUserIds!,
        checklist: newChecklistItems.map((item) => ({ completed: false, task: item })),
        description: selectedWorkorder?.description!,
        priority: selectedPriority!,
        status: '',
        title: selectedWorkorder?.title!,
      };
      await useUpdateWorkorder.mutateAsync({ id: selectedWorkorder?.id!, data: updatedWorkorder });

      setNewChecklistItems(['', '', '']);
      setSelectedUserIds([]);
      setSelectedPriority('');
    } catch (error) {
      console.error('Error:', error);

      message.error('An error occurred while updating the workorder. Please try again later.');
    }
  };

  const createWorkorder = async (data?: Workorder) => {
    try {
      if (!!data) { await useCreateWorkorder.mutateAsync(data); }
      setShowCreateModal(false);
    } catch (error) {
      setShowCreateModal(false);
      console.error('Error:', error);

      message.error('An error occurred while saving the workorder. Please try again later.');
    }
  };


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
        onChange={(e) => {
          e.preventDefault()
          setSelectedWorkorder({
            ...selectedWorkorder!,
            description: e.target.value,
          })
        }
        } />
      <Select
        placeholder="Select Priority"
        value={selectedPriority}
        style={{ width: 200, marginBottom: 16 }}
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
        style={{ marginBottom: 16 }}
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
      {
        selectedWorkorder?.checklist.map((item, index) => (
          <div key={index}>
            <Checkbox
              checked={item.completed}
              style={{ marginBottom: 16 }}
              onChange={(e) => {
                const updatedChecklist = [...selectedWorkorder.checklist];
                updatedChecklist[index].completed = e.target.checked;
                setSelectedWorkorder({
                  ...selectedWorkorder,
                  checklist: updatedChecklist,
                });
              }}
            >
              {item.task}
            </Checkbox>
          </div>
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

  return (
    <Layout>
      <div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title style={{ margin: 0 }}>Workorders</Title>
            <Select
              style={{ width: 200, marginRight: 16, marginLeft: 16 }}
              placeholder="Select an Asset"
              value={selectedAsset}
              onChange={handleAssetSelect}
            >
              {assets?.map((wo) => (
                <Option key={wo.id} value={wo.id}>
                  Asset {wo.name}
                </Option>
              ))}
            </Select>
            {!!selectedAsset && <Button type="primary" onClick={handleCreateWorkorder}>
              Create Workorder
            </Button>}
          </div>

          <div style={{ display: 'flex', marginTop: 16 }}>
            <div style={{ flex: 1, paddingRight: 16 }}>
              <List
                dataSource={filteredWorkorders}
                renderItem={(workorder) => (
                  <List.Item
                    key={workorder.id}
                    onClick={() => handleWorkorderSelect(workorder.id)}
                    style={{
                      backgroundColor:
                        selectedWorkorder?.id === workorder.id ? '#f0f0f0' : 'transparent',
                    }}
                  >
                    {workorder.title}{' '}
                    <Badge
                      count={
                        workorder.checklist.filter((item) => !item.completed).length
                      }
                      style={{ backgroundColor: 'red', marginLeft: 8 }}
                    />
                  </List.Item>
                )}
              />
            </div>

            <div style={{ flex: 2 }}>
              {selectedWorkorder && (
                <>
                  <Tabs defaultActiveKey="details" items={items} />
                  <Button type="primary" onProgress={updatedWorkorder}>Update</Button>
                </>)}
            </div>
          </div>
        </div>

        <UsersModal open={showCreateModal} onFinish={createWorkorder} assetId={selectedAsset!} />
      </div>
    </Layout >
  );
};

export default WorkordersDetail;
