import {
  DesktopOutlined,
  FileOutlined,
  HomeOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout as AntdLayout, Menu, theme } from 'antd';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const handleMenuItemClick = (item: string) => {
    if (item) {
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
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>{location.pathname.split('/')}</Breadcrumb.Item>
          </Breadcrumb>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>João Victor Alarcão Pereira ©2023 https://joaoalrc.dev</Footer>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;