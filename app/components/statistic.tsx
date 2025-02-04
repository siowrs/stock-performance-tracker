"use client";

import { Card, Statistic, StatisticProps } from "antd";

export default function ClientStatistic({ ...props }: StatisticProps) {
  return (
    <Card bordered={false}>
      <Statistic {...props} />
    </Card>
  );
}
