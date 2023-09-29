import React from 'react';
import AssetList from './components/AssetList';
import { useAssets } from '../../queries/assets';
import Layout from '../../components/Layout';
import { useUsers } from '../../queries/users';
import { Spin, Typography } from 'antd';
import { useWorkorders } from '../../queries/workorders';

import './index.css';

const { Title } = Typography;

function Assets() {
  const { isLoading: isLoadingAssets, isError: isErrorAssets } = useAssets();
  const { isLoading: isLoadingUsers, isError: isErrorUsers } = useUsers();
  const { isLoading: isLoadingWorkorders, isError: isErrorWorkorders } = useWorkorders();

  if (isLoadingAssets || isLoadingUsers || isLoadingWorkorders) {
    return <div className='loadingContainer'>
      <Spin />
    </div>
  }

  if (isErrorAssets || isErrorUsers || isErrorWorkorders) {
    return <div>Ocorreu um erro ao carregar os dados.</div>;
  }

  return (
    <Layout>
      <Title>Assets List</Title>
      <AssetList />
    </Layout>
  );
}

export default Assets;
