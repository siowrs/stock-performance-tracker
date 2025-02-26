import { Space } from "antd";
import { ReactNode } from "react";

export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <Space direction="vertical" className="w-full" size="middle">
      {children}
    </Space>
  );
}
