// "use client";

import { Card, Statistic, StatisticProps } from "antd";
import CustomCard from "./card";

export default function CustomStatistic({ ...props }: StatisticProps) {
  return (
    <CustomCard>
      <Statistic {...props} />
    </CustomCard>
  );
}
