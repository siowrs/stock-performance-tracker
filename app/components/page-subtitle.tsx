"use client";

import { Typography } from "antd";
import { TitleProps } from "antd/es/typography/Title";

export default function PageSubTitle({ children, ...props }: TitleProps) {
  const { Title } = Typography;
  return (
    <Title level={5} type="secondary" {...props}>
      {children}
    </Title>
  );
}
