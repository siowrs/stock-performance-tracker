"use client";

import { Statistic, StatisticProps } from "antd";

export default function ClientStatistic({ ...props }: StatisticProps) {
  return <Statistic {...props} />;
}
