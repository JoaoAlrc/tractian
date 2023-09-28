
import { Card, Divider, Space } from 'antd';

import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {

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
        <Card
          title="Companies"
          style={{ width: 180 }}
        >
          <Link to="/companies">Check it out!</Link>
        </Card> 
        <Card
          title="Units"
          style={{ width: 180 }}
        >
          <Link to="/units">Check it out!</Link>
        </Card>
        <Card
          title="Workorders"
          style={{ width: 180 }}
        >
          <Link to="/workorders">Check it out!</Link>
        </Card>
      </Space>
    </Layout>
  );
};

export default Home;