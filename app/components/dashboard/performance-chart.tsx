"use client";
import {
  fetchYearlyPerformance,
  ReturnStatus,
  YearlyPerformanceDataType,
} from "@/app/lib/actions";
import { Line } from "@ant-design/plots";
import React, { useEffect, useState } from "react";
import CustomCard from "../card";
import { Select, Space, Typography } from "antd";
import { channel } from "diagnostics_channel";
import {
  convertDataCurrency,
  formatNumber,
  gainGreen,
  lossRed,
  parseAndStringify,
} from "@/app/lib/misc";
import { Prisma } from "@prisma/client";
import * as d3 from "d3";

export default function YearlyPerformanceChart() {
  const [data, setData] = useState<YearlyPerformanceDataType[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [currency, setCurrency] = useState<string>("RM");

  useEffect(() => {
    let ignore = false;

    (async () => {
      //tdl convert to formactionstate?
      const performance = await fetchYearlyPerformance(year, currency);
      // setData(performance);
      if ("status" in performance && "message" in performance) {
        return performance.message;
      } else {
        if (!ignore) {
          setData(performance);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [year, currency]);

  const config = {
    data,
    height: 400,
    tooltip: {
      title: (d: YearlyPerformanceDataType) => `${d.month} ${year}`,
      items: [
        {
          channel: "y",
          valueFormatter: (value: number) =>
            (value < 0 ? "- " : "") + currency + formatNumber(value),
        },
        //   (d) => ({
        //     channel: "y",
        //     value: "huuu",
        //   }),
      ],
    },

    xField: "month",
    yField: "value",
    colorField: "type",
    // scale: {
    //   color: {
    //     range: [gainGreen, lossRed],
    //   },
    // },
    theme: "classicDark",
  };

  const { Text } = Typography;

  // useEffect(() => {
  //   let ignore = false;
  //   console.log(currency);

  //   if (!ignore) {
  //     setData(
  //       data.map((d) => {
  //         // rename d.prop
  //         // tdl rework this lol
  //         const obj = {
  //           ...d,
  //           realizedGL: new Prisma.Decimal(d.realizedGL),
  //           totalCost: new Prisma.Decimal(d.totalCost),
  //         };

  //         const converted = parseAndStringify(
  //           convertDataCurrency(currency, obj)
  //         );

  //         return {
  //           ...converted,
  //           ["Total Cost"]: Number(converted["Total Cost"]),
  //           ["Realized G/L"]: Number(converted["Realized G/L"]),
  //         };
  //       })
  //     );
  //   }
  //   return () => {
  //     ignore = true;
  //   };
  // }, [currency]);

  // const handleCurrencyChange = (currency: string) => {
  // };
  return (
    <CustomCard
      title="Yearly Performance"
      extra={
        <Space>
          <Select
            defaultValue={2025}
            onChange={(val) => setYear(val)}
            style={{ width: 80 }}
            options={[
              {
                value: 2025,
                label: 2025,
              },
              {
                value: 2024,
                label: 2024,
              },
            ]}
          />
          <Select
            defaultValue="RM"
            onChange={(val) => setCurrency(val)}
            style={{ width: 80 }}
            options={[
              {
                value: "RM",
                label: "RM",
              },
              {
                value: "USD",
                label: "USD",
              },
            ]}
          />
        </Space>
      }
    >
      <Text>Based on closed positions.</Text>
      <Line {...config} />
    </CustomCard>
  );
}
