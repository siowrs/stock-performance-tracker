"use client";
import { Pie } from "@ant-design/charts";
import CustomCard from "../card";
import {
  ReturnStatus,
  WinRateDetailsDataType,
  WinRateType,
} from "@/app/lib/actions";
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
    height: 400,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    tooltip: {
      items: [
        (d: WinRateDetailsDataType) => ({
          channel: "y",
          name: `${d.type}`,
          value: `${d3.format(",")(d.value)}`,
        }),
      ],
    },
    label: {
      text: (d: WinRateDetailsDataType) =>
        d.value !== 0 ? +((d.value / totalTrades) * 100).toFixed(2) + "%" : "",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        // title: false,
        position: "bottom",
        rowPadding: 5,
        layout: {
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        },
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
          fontSize: 16,
          fontStyle: "bold",
          fill: "white",
        },
      },
    ],
    theme: "classicDark",
  };

  return (
    <CustomCard title="Win Rate" className="h-full">
      <Pie {...config} />
      {/* tdl add top trade and worst trade here*/}
    </CustomCard>
  );
}
