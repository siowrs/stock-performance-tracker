"use client";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider, Layout, Menu, MenuProps, theme } from "antd";
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
];

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      <MessageProvider>
        <Layout>
          <Sider>
            <Menu items={menuItem} defaultSelectedKeys={["1"]} />
          </Sider>
          <Layout>
            <Content>{children}</Content>
          </Layout>
        </Layout>
      </MessageProvider>
    </ConfigProvider>
  );
}
