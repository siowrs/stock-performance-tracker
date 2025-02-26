"use client";

import { Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";
import { ReactNode } from "react";

export default function ClientText({ children, ...props }: TextProps) {
  const { Text } = Typography;

  return <Text {...props}>{children}</Text>;
}
