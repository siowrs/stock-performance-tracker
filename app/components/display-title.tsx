"use client";

import { Typography } from "antd";
import { TitleProps } from "antd/es/typography/Title";

export default function DisplayTitle({ children, ...props }: TitleProps) {
  const { Title } = Typography;
  return (
    <>
      <Title level={1} {...props}>
        {children}
      </Title>
    </>
  );
}
