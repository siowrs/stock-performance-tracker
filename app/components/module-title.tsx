"use client";

import { Typography } from "antd";
import { TitleProps } from "antd/es/typography/Title";

export default function ModuleTitle({ children, ...props }: TitleProps) {
  const { Title } = Typography;
  return (
    <Title level={2} {...props}>
      {children}
    </Title>
  );
}
