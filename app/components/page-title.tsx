"use client";

import { Typography } from "antd";
import { TitleProps } from "antd/es/typography/Title";

export default function PageTitle({ children, ...props }: TitleProps) {
  const { Title } = Typography;
  return (
    <Title level={4} type="secondary" {...props}>
      {children}
    </Title>
  );
}
