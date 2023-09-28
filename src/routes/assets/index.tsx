import React from 'react';
import AssetList from './components/AssetList';
import { useAssets } from '../../queries/assets';
import Layout from '../../components/Layout';
import { useUsers } from '../../queries/users';
import { Typography } from 'antd';
import { useWorkorders } from '../../queries/workorders';

const { Title } = Typography;

function Assets() {
  const { data: assets, isLoading: isLoadingAssets, isError: isErrorAssets } = useAssets();
  const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers } = useUsers();
  const { data: workorders, isLoading: isLoadingWorkorders, isError: isErrorWorkorders } = useWorkorders();

  if (isLoadingAssets || isLoadingUsers || isLoadingWorkorders) {
    return <div>Carregando...</div>;
  }

  if (isErrorAssets || isErrorUsers || isErrorWorkorders) {
    return <div>Ocorreu um erro ao carregar os dados.</div>;
  }

  return (
    <Layout>
      <Title>Assets List</Title>
      <AssetList {...{ assets, users, workorders }} />
    </Layout>
  );
}

export default Assets;
