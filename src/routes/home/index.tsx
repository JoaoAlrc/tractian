
import { theme } from 'antd';

import Layout from '../../components/Layout';

const Home: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
        Hello Traction
      </div>
    </Layout>
  );
};

export default Home;