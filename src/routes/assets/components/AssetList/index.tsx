import React, { useState } from 'react';
import { Asset } from '../../../../queries/assets/types';
import AssetDetail from '../AssetDetail';
import { Col, Row, Select } from 'antd';
import { User } from '../../../../queries/users/types';
import HealthscorePieChart from '../HealthscorePieChart';
import StatusStackedBarChart from '../StatusStackedBarChart';
import MaxTempBarChart from '../MaxTempBarChart';
import RPMBarChart from '../RPMBarChart';

type Props = {
  assets: Asset[] | undefined,
  users: User[] | undefined
}

const AssetList = ({ assets, users }: Props) => {
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);

  const findAssetById = (id: number) => {
    return assets?.find(asset => asset.id === id) || null;
  };

  const handleAssetChange = (value: number | null) => {
    setSelectedAssetId(value);
  };

  return (
    <>
      <Select
        placeholder='Select the desired asset to inspect'
        onChange={handleAssetChange}
        options={assets?.map(asset => ({ value: asset.id, label: asset.name }))}
      />
      {!!selectedAssetId && <AssetDetail asset={findAssetById(selectedAssetId)!} {...{ users }} />}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <MaxTempBarChart />
        </Col>
        <Col span={12}>
          <RPMBarChart />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <HealthscorePieChart />
        </Col>
        <Col span={12}>
          <StatusStackedBarChart />
        </Col>
      </Row>
    </>
  );
};

export default AssetList;
