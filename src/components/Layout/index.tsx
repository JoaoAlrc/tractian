import {
  DesktopOutlined,
  FileOutlined,
  HomeOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout as AntdLayout, Menu, theme } from 'antd';
import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = AntdLayout;

type MenuItem = Required<MenuProps>['items'][number];
type Props = {
  children: ReactNode;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Home", "home", <HomeOutlined />),
  getItem("Assets", "assets", <PieChartOutlined />),
  getItem("Companies", "companies", <DesktopOutlined />),
  getItem("Users", "users", <UserOutlined />),
  getItem("Units", "units", <TeamOutlined />),
  getItem("Workorders", "workorders", <FileOutlined />),
];

const Layout = ({ children }: Props) => {
  const navigate = useNavigate(); 
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const handleMenuItemClick = (item: string) => {
    if (item) {
      if (item === 'home') return navigate('/');
      navigate(`/${item}`);
    }
  };

  return (
    <AntdLayout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={({ key }) => handleMenuItemClick(key)} />
      </Sider>
      <AntdLayout>
        <Header style={{ background: colorBgContainer }} />
        <Content style={{ margin: '16px' }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>João Victor Alarcão Pereira ©2023{' - '}
          <Link to='https://joaoalrc.dev' target='_blank'>
            https://joaoalrc.dev
          </Link>
        </Footer>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;