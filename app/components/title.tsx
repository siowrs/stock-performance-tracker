"use client";

import { Typography, TypographyProps } from "antd";
import { TitleProps } from "antd/es/typography/Title";
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

export default function ClientTitle({ children, ...props }: TitleProps) {
  const { Title } = Typography;
  return <Title {...props}>{children}</Title>;
}
