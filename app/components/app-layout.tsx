"use client";
import "@ant-design/v5-patch-for-react-19";
import {
  ConfigProvider,
  Layout,
  Menu,
  MenuProps,
  theme,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  HomeOutlined,
  MailOutlined,
  PieChartOutlined,
  ProfileOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Key, ReactNode } from "react";
import Link from "next/link";
import { MessageProvider } from "../lib/providers/message-toast-provider";
import DisplayTitle from "./display-title";
import ModuleTitle from "./module-title";
import PageTitle from "./page-title";

const { darkAlgorithm } = theme;
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  key: Key,
  label: ReactNode,
  icon?: ReactNode,
  children?: ReactNode
) {
  return {
    key,
    label,
    icon,
    children,
  };
}

const menuItem: MenuItem[] = [
  getItem(1, <Link href="/">Dashboard</Link>, <HomeOutlined />),
  getItem(2, <Link href="/positions">Positions</Link>, <ProfileOutlined />),
  getItem(3, <Link href="/counters">Counters</Link>, <ShopOutlined />),
  getItem(4, <Link href="/sectors">Sectors</Link>, <ShopOutlined />),
];

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",

  // overflow: 'auto',
  // height: '100vh',
  // position: 'sticky',
  // insetInlineStart: 0,
  // top: 0,
  // bottom: 0,
  // scrollbarWidth: 'thin',
  // scrollbarGutter: 'stable',
};

const { Title } = Typography;

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
        token: {
          borderRadius: 16,
        },
        components: {
          Layout: {
            siderBg: "rgb(20,20,20)",
          },
          Menu: {
            darkItemBg: "rgb(20,20,20)",
          },
          Card: {
            colorBgContainer: "rgb(20,20,20)",
          },
        },
      }}
    >
      <Layout hasSider>
        <Sider width={240} className="p-4 !sticky top-0 h-dvh">
          <Title level={4} className="!mb-8">
            Trading
            <br />
            Performance
            <br />
            Tracker
          </Title>
          <Menu theme="dark" items={menuItem} defaultSelectedKeys={["1"]} />
        </Sider>
        <Layout>
          <Content className="p-4">{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
