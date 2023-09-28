import React, { useCallback, useMemo, useState } from 'react';
import { Button, Col, Image, Modal, Row, Select, Space, Typography } from 'antd';
import Highcharts from "highcharts/highcharts.js";
import highchartsMore from "highcharts/highcharts-more.js";
import solidGauge from "highcharts/modules/solid-gauge.js";
import EditableTable from '../EditableTable';

import { tableData } from './utils';
import { useUpdateAsset } from '../../../../queries/assets';
import { Asset, AssetStatus, AssetStatusLegend } from '../../../../queries/assets/types';
import { useReadCompanie } from '../../../../queries/companies';
import { User } from '../../../../queries/users/types';
import { format } from 'date-fns';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import './index.css';
import { useReadUnit } from '../../../../queries/units';

const { Title, Text } = Typography;

highchartsMore(Highcharts);
solidGauge(Highcharts);

const AssetDetail = ({ asset, users }: { asset: Asset, users: User[] | undefined }) => {
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState<boolean>(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Array<number>>(asset.assignedUserIds);
  const [isStatusSelectVisible, setIsStatusSelectVisible] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<AssetStatus>(asset.status);

  const {
    data: dataCompanie
  } = useReadCompanie(asset.companyId);
  const {
    data: dataUnit
  } = useReadUnit(asset.companyId);

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

  const handleStatusChange = (status: AssetStatus) => {
    setSelectedStatus(status);
    const data: Asset = {
      ...asset,
      status
    };
    onUpdateAsset(data)
  };

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
      <Title level={2}>{dataUnit?.name}</Title>
      <Row>
        <Col>
          <Title className='noMarginTitle' level={3}>{asset?.name} </Title>
        </Col>
        <Col>
          {!isStatusSelectVisible
            ? <Title className='noMarginTitle' level={3}>({AssetStatusLegend[asset?.status]})</Title>
            : <Select
              placeholder='Select a status'
              value={selectedStatus}
              className='statusSelect'
              options={Object.values(AssetStatus).map(status => ({ value: status, label: AssetStatusLegend[status] }))}
              onSelect={handleStatusChange}
            />}
        </Col>
        <Col>
          <Button
            type="link"
            icon={<EditOutlined style={{ fontSize: 26, marginLeft: 4 }} />}
            onClick={() => setIsStatusSelectVisible(old => !old)}
          />
        </Col>
      </Row>
      <Row gutter={16} className='box'>
        <Col span={8}>
          <div>
            <Image
              height={500}
              className='assetImage'
              src={asset.image}
            />
          </div>
        </Col>
        <Col span={8}>
          <div>
            <Row>
              <Col>
                <Title style={{ margin: 0 }} level={3}>Assigned Users</Title>
              </Col>
              <Col>
                <Button
                  type="link"
                  icon={<PlusCircleOutlined style={{ fontSize: 24, marginLeft: 4 }} />}
                  onClick={() => showModal()}
                />
              </Col>
            </Row>
            <div>
              {users?.filter(user => asset.assignedUserIds
                .find(i => i === user.id))
                .map((user, index) => (
                  <div key={index} className='nameText'>
                    <Text>{user.name}</Text>
                  </div>
                ))}
            </div>
          </div>
          <div className='uptimeContainer'>
            <Space size={16} direction='horizontal'>
              <Text strong>Last Uptime At:</Text>
              <Text>{format(new Date(asset.metrics.lastUptimeAt), 'dd/MM/yyyy')}</Text>
            </Space>
            <Space size={16} direction='horizontal'>
              <Text strong>Total Collects Uptime:</Text>
              <Text>{asset.metrics.totalCollectsUptime}</Text>
            </Space>
            <Space size={16} direction='horizontal'>
              <Text strong>Total Uptime:</Text>
              <Text>{asset.metrics.totalUptime} hours</Text>
            </Space>
          </div>
        </Col>
        <Col span={8}>
          <EditableTable onUpdateData={onUpdateAsset} data={tableData(asset)} />
        </Col>
      </Row>
    </>
  );
};

export default AssetDetail;
