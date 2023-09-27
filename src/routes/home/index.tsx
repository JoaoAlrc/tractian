
import { Card, Col, Divider, Row, Space, theme } from 'antd';

import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Divider orientation="left">Welcome to Traction manager.</Divider>
      <Space direction="horizontal" size={16}>
        <Card
          title="Assets"
          style={{ width: 180 }}
        >
          <Link to="/assets">Check it out!</Link>
        </Card>
      </Space>
    </Layout>
  );
};

export default Home;