import { Button, Typography } from "antd";
import CustomCard from "./components/card";
import ModuleTitle from "./components/module-title";
import fetchWinRate, {
  fetchPositions,
  fetchTopGainer,
  fetchTopLoser,
  fetchYearlyPerformance,
  PositionDataType,
  PositionReturnState,
} from "./lib/actions";
import Link from "next/link";
import PageSubTitle from "./components/page-subtitle";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import DisplayTitle from "./components/display-title";
import ClientTitle from "./components/title";
import { green } from "@ant-design/colors";
import { gainGreen } from "./lib/misc";
import YearlyPerformanceChart from "./components/dashboard/performance-chart";
import WinRateChart from "./components/dashboard/win-rate-chart";

export default async function Dashboard() {
  const [openPositions, topGainer, topLoser, winRate] = await Promise.all([
    fetchPositions("open"),
    fetchTopGainer(),
    fetchTopLoser(),
    fetchWinRate(),
  ]);

  const openPositionsError =
    "status" in openPositions && "message" in openPositions;
  const topGainerError =
    !topGainer || ("status" in topGainer && "message" in topGainer);
  const topLoserError =
    !topLoser || ("status" in topLoser && "message" in topLoser);

  return (
    <>
      <YearlyPerformanceChart />
      <WinRateChart winRate={winRate} />
      <ModuleTitle>Dashboard</ModuleTitle>
      <CustomCard
        title="Open Positions"
        {...(!openPositionsError && {
          extra: `Total: ${openPositions.length}`,
        })}
      >
        {openPositionsError
          ? //if error
            openPositions.message
          : openPositions.map((p) => (
              <Button key={p.id}>
                <img
                  src={`https://flagcdn.com/${p.counter.country}.svg`}
                  alt="Malaysia"
                  width="16"
                />
                <Link href={`/positions/${p.id}`}>{p.counter.symbol}</Link>
              </Button>
            ))}
      </CustomCard>
      <CustomCard title="Top Gainer">
        {!topGainerError && (
          <>
            <img
              src={`https://flagcdn.com/${topGainer.country}.svg`}
              alt="Malaysia"
              width="32"
            />{" "}
            {topGainer.symbol}
            <ClientTitle level={3}>
              {topGainer.currency}
              {topGainer.totalRealizedGL}
            </ClientTitle>
            <ClientTitle level={5}>
              <ArrowUpOutlined style={{ color: `${gainGreen}` }} />
              {topGainer.absoluteRealizedGLPercentage}
              <PercentageOutlined />
            </ClientTitle>
          </>
        )}
      </CustomCard>
      <CustomCard title="Top Loser">
        {!topLoserError ? (
          <>
            <img
              src={`https://flagcdn.com/${topLoser.country}.svg`}
              alt="Malaysia"
              width="32"
            />{" "}
            {topLoser.symbol}
            <ClientTitle level={3}>
              {topLoser.currency}
              {topLoser.totalRealizedGL}
            </ClientTitle>
            <ArrowDownOutlined />
            <ClientTitle level={5}>
              {topLoser.absoluteRealizedGLPercentage}
              <PercentageOutlined />
            </ClientTitle>
          </>
        ) : (
          "No loser! :)"
        )}
      </CustomCard>
    </>
  );
}
