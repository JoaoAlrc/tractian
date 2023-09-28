import React from 'react';
import AssetList from './components/AssetList';
import { useAssets } from '../../queries/assets';
import Layout from '../../components/Layout';
import { useUsers } from '../../queries/users';
import { Typography } from 'antd';

const { Title } = Typography;

function Assets() {
  const { data: assets, isLoading: isLoadingAssets, isError: isErrorAssets } = useAssets();
  const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers } = useUsers();

  if (isLoadingAssets || isLoadingUsers) {
    return <div>Carregando...</div>;
  }

  if (isErrorAssets || isErrorUsers) {
    return <div>Ocorreu um erro ao carregar os dados.</div>;
  }

  return (
    <Layout>
      <Title>Assets List</Title>
      <AssetList {...{ assets, users }} />
    </Layout>
  );
}

export default Assets;
