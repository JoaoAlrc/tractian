
import { theme } from 'antd';

import Layout from '../../components/Layout';

const Workorders: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
        Workorders
      </div>
    </Layout>
  );
};

export default Workorders;