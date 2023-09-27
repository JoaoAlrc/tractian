import React, { useCallback, useMemo, useState } from 'react';
import { Button, Col, Image, Modal, Row, Select, Space, Typography } from 'antd';
import Highcharts from "highcharts/highcharts.js";
import highchartsMore from "highcharts/highcharts-more.js";
import solidGauge from "highcharts/modules/solid-gauge.js";
import EditableTable from '../../../../components/EditableTable';

import { tableData } from './utils';
import { useUpdateAsset } from '../../../../queries/assets';
import { Asset, AssetStatusLegend } from '../../../../queries/assets/types';
import { useReadCompanie } from '../../../../queries/companies';
import { User } from '../../../../queries/users/types';
import { format } from 'date-fns';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

highchartsMore(Highcharts);
solidGauge(Highcharts);

const AssetDetail = ({ asset, users }: { asset: Asset, users: User[] | undefined }) => {
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState<boolean>(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Array<number>>(asset.assignedUserIds);

  const {
    data: dataCompanie
  } = useReadCompanie(asset.companyId);

  const updateAssetMutation = useUpdateAsset();

  const onUpdateAsset = async (data: Asset) => {
    try {
      await updateAssetMutation.mutateAsync({ id: asset.id, data });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const showModal = () => {
    setIsDelegateModalOpen(true);
  };

  const handleOk = () => {
    const data: Asset = {
      ...asset,
      assignedUserIds: selectedUserIds,
    };
    setIsDelegateModalOpen(false);
    onUpdateAsset(data);
  };


  const handleCancel = () => {
    setIsDelegateModalOpen(false);
    setSelectedUserIds(asset.assignedUserIds);
  };

  const availableUsers = useMemo(() => {
    return users?.filter(user => !selectedUserIds.includes(user.id)) || [];
  }, [users, selectedUserIds]);

  const handleUserSelectionChange = useCallback((userId: number) => {
    setSelectedUserIds(prevIds => {
      if (prevIds.includes(userId)) {
        return prevIds.filter(id => id !== userId);
      } else {
        return [...prevIds, userId];
      }
    });
  }, []);

  return (
    <>
      <Modal
        title="Delegate Users"
        open={isDelegateModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Space wrap>
          <Select
            placeholder='Assign users to this asset'
            value={[]}
            options={availableUsers.map(user => ({ value: user.id, label: user.name }))}
            onSelect={handleUserSelectionChange}
          />
        </Space>
        <div>
          <Typography.Title level={4}>Delegated Users</Typography.Title>
          {selectedUserIds.map(userId => {
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
        </div>
      </Modal>

      <Title>{dataCompanie?.name}</Title>
      <Title level={2}>{asset?.name} ({AssetStatusLegend[asset?.status]})</Title>
      <Row gutter={16}>
        <Col span={8}>
          <div>
            <Image
              height={500}
              src={asset.image}
            /></div>
        </Col>
        <Col span={8}>
          <div>
            <Space size={16} direction='horizontal' align='center'>
              <Title level={3}>Assigned Users</Title>
              <Button
                size="large"
                type="link"
                icon={<PlusCircleOutlined />}
                onClick={() => showModal()}
              /></Space>
            <div>
              {users?.filter(user => asset.assignedUserIds
                .find(i => i === user.id))
                .map((user, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <Text>{user.name}</Text>
                  </div>
                ))}
            </div>

          </div>
        </Col>
        <Col span={8}>
          <Title level={3}>Last Uptime At</Title>
          {format(new Date(asset.metrics.lastUptimeAt), 'dd/MM/yyyy')}
        </Col>
      </Row>

      <Row style={{ marginTop: '16px' }}>
        <Col span={24}>
          <EditableTable onUpdateData={onUpdateAsset} data={tableData(asset)} />
        </Col>
      </Row>
    </>
  );
};

export default AssetDetail;
