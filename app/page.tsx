import { Button, Col, Flex, Row, Space, Tag, Typography } from "antd";
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
  PlusOutlined,
} from "@ant-design/icons";
import DisplayTitle from "./components/display-title";
import ClientTitle from "./components/title";
import { green } from "@ant-design/colors";
import { gainGreen } from "./lib/misc";
import YearlyPerformanceChart from "./components/dashboard/performance-chart";
import WinRateChart from "./components/dashboard/win-rate-chart";
import ClientText from "./components/text";
import PerformingCounter from "./components/dashboard/performing-counter";

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
      <ModuleTitle>Dashboard</ModuleTitle>
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <YearlyPerformanceChart />
        </Col>
        <Col span={6}>
          <WinRateChart winRate={winRate} />
        </Col>
        <Col span={8}>
          <CustomCard
            className="h-full"
            title="Open Positions"
            {...(!openPositionsError && {
              extra: `Total: ${openPositions.length}`,
            })}
          >
            {/* if error */}
            {openPositionsError && openPositions.message}

            {!openPositionsError && openPositions.length == 0 && (
              <ClientText type="secondary">No open positions.</ClientText>
            )}

            {!openPositionsError &&
              openPositions.length > 0 &&
              openPositions.map((p) => (
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
        </Col>
        <Col span={8}>
          <CustomCard className="h-full" title="Best Performing Counter">
            {!topGainerError ? (
              <PerformingCounter type="best" counter={topGainer} />
            ) : (
              <ClientText type="secondary">
                Not a single winning counter :(
              </ClientText>
            )}
          </CustomCard>
        </Col>
        <Col span={8}>
          <CustomCard className="h-full" title="Worst Performing Counter">
            {!topLoserError ? (
              <PerformingCounter type="worst" counter={topLoser} />
            ) : (
              <ClientText type="secondary">
                Not a single losing counter :)
              </ClientText>
            )}
          </CustomCard>
        </Col>
      </Row>
    </>
  );
}
