"use client";
import { Pie } from "@ant-design/charts";
import CustomCard from "../card";
import { ReturnStatus, WinRateType } from "@/app/lib/actions";
import * as d3 from "d3";

export default function WinRateChart({
  winRate,
}: {
  winRate: WinRateType | ReturnStatus;
}) {
  if ("status" in winRate && "message" in winRate) {
    // tdl error handling
    return winRate.message;
  }

  const [totalTrades, rate] = winRate;
  const config = {
    data: rate,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    tooltip: {
      items: [
        (d) => ({
          channel: "y",
          name: `${d.type}`,
          value: `${d3.format(",")(d.value)}`,
        }),
      ],
    },
    label: {
      text: (d) =>
        d.value !== 0 ? +((d.value / totalTrades) * 100).toFixed(2) + "%" : "",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: "text",
        style: {
          text: `${totalTrades} trades`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 24,
          fontStyle: "bold",
          fill: "white",
        },
      },
    ],
    theme: "classicDark",
  };

  return (
    <CustomCard title="Win Rate">
      <Pie {...config} />
    </CustomCard>
  );
}
