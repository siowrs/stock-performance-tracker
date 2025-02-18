import DisplayTitle from "@/app/components/display-title";
import PageTitle from "@/app/components/page-title";
import PageTitle2 from "@/app/components/page-subtitle";
import CustomStatistic from "@/app/components/statistic";
import ClientTitle from "@/app/components/title";
import { fetchCounterBySlug, PositionDataType } from "@/app/lib/actions";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import PageSubTitle from "@/app/components/page-subtitle";
import PositionsTableAndUpdatePositionModal from "@/app/components/positions/positions-table-and-update-position-modal";

export default async function CounterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const counter = await fetchCounterBySlug(slug);
  //tdl error handling
  if (!counter) {
    return "No counter found.";
  }

  if ("status" in counter && "message" in counter) {
    return counter.message;
  }

  const { currPosition, pastPositions } = counter.positions.reduce(
    (acc, p) => {
      if (p.status === "open") {
        acc.currPosition = p;
      } else {
        acc.pastPositions.push(p);
      }
      return acc;
    },

    { currPosition: null, pastPositions: [] } as {
      currPosition: PositionDataType | null;
      pastPositions: PositionDataType[];
    }
  );

  const formattedCounter = {
    ...counter,
    ...(+counter.totalRealizedGL !== 0 && {
      gainOrLoss: +counter.totalRealizedGL > 0 ? "gain" : "loss",
    }),
    totalRealizedGL: Math.abs(+counter.totalRealizedGL).toString(),
    totalRealizedRevenue: Math.abs(+counter.totalRealizedRevenue).toString(),
    absoluteRealizedGLPercentage: Math.abs(
      +counter.absoluteRealizedGLPercentage
    ).toString(),
  };

  return (
    <>
      <PageTitle>Counter Performance</PageTitle>

      <DisplayTitle>{formattedCounter.name}</DisplayTitle>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <CustomStatistic
            title="Total Buying Cost"
            value={`${formattedCounter.currency}${formattedCounter.totalBuyingCost}`}
          />
        </Col>
        <Col span={6}>
          <CustomStatistic
            title="Total Realized Revenue"
            value={`${formattedCounter.currency}${formattedCounter.totalRealizedRevenue}`}
          />
        </Col>
        <Col span={6}>
          <CustomStatistic
            title="Total Realized GL"
            {...(formattedCounter.gainOrLoss && {
              prefix:
                formattedCounter.gainOrLoss === "gain" ? (
                  <PlusOutlined />
                ) : (
                  <MinusOutlined />
                ),
              valueStyle:
                formattedCounter.gainOrLoss === "gain"
                  ? { color: "#2dfc87" }
                  : { color: "#ff5e5e" },
            })}
            value={`${formattedCounter.currency}${formattedCounter.totalRealizedGL} (${formattedCounter.absoluteRealizedGLPercentage}%)`}
          />
        </Col>
      </Row>
      {currPosition && (
        <>
          <PageSubTitle>Current Open Position</PageSubTitle>
          <PositionsTableAndUpdatePositionModal positions={[currPosition]} />
        </>
      )}
      <PageSubTitle>Past Positions</PageSubTitle>
      <PositionsTableAndUpdatePositionModal positions={pastPositions} />
    </>
  );
}
