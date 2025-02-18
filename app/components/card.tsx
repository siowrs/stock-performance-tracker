// "use client";

import { Card, CardProps } from "antd";

export default function CustomCard({ children, ...props }: CardProps) {
  return (
    <Card bordered={false} {...props}>
      {children}
    </Card>
  );
}
