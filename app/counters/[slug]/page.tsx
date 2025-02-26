import DisplayTitle from "@/app/components/display-title";
import PageTitle from "@/app/components/page-title";
import PageTitle2 from "@/app/components/page-subtitle";
import CustomStatistic from "@/app/components/statistic";
import ClientTitle from "@/app/components/title";
import { fetchCounterBySlug, PositionDataType } from "@/app/lib/actions";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MinusOutlined,
  PercentageOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Col, Row, Tag } from "antd";
import PageSubTitle from "@/app/components/page-subtitle";
import PositionsTableAndUpdatePositionModal from "@/app/components/positions/positions-table-and-update-position-modal";
import ContentLayout from "@/app/components/content-layout";
import { formatNumber, gainGreen, lossRed } from "@/app/lib/misc";

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
    <ContentLayout>
      <PageTitle>Counter Performance</PageTitle>

      <div>
        <DisplayTitle className="!mb-2">{formattedCounter.symbol}</DisplayTitle>
        <ClientTitle className="!mt-0" level={5}>
          {formattedCounter.name}
        </ClientTitle>
      </div>

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
            title="Realized Profit/Loss"
            value={`${formattedCounter.currency}${formatNumber(
              formattedCounter.totalRealizedGL
            )}`}
            {...(formattedCounter.gainOrLoss && {
              valueStyle: {
                color:
                  formattedCounter.gainOrLoss === "gain" ? gainGreen : lossRed,
              },

              prefix:
                formattedCounter.gainOrLoss === "gain" ? (
                  <PlusOutlined />
                ) : (
                  <MinusOutlined />
                ),

              suffix: (
                <Tag
                  className="!ms-3"
                  style={{
                    color:
                      formattedCounter.gainOrLoss === "gain"
                        ? "#133f1d"
                        : "#340e0e",
                  }}
                  color={
                    formattedCounter.gainOrLoss === "gain" ? gainGreen : lossRed
                  }
                  icon={
                    formattedCounter.gainOrLoss === "gain" ? (
                      <ArrowUpOutlined
                        style={{
                          color: "#133f1d",
                        }}
                      />
                    ) : (
                      <ArrowDownOutlined
                        style={{
                          color: "#340e0e",
                        }}
                      />
                    )
                  }
                >
                  {formattedCounter.absoluteRealizedGLPercentage}
                  <PercentageOutlined
                    style={{
                      color:
                        formattedCounter.gainOrLoss === "gain"
                          ? "#133f1d"
                          : "#340e0e",
                    }}
                  />
                </Tag>
              ),
            })}
          />
        </Col>
      </Row>
      {currPosition && (
        <>
          <PageSubTitle>Current Open Position</PageSubTitle>
          <PositionsTableAndUpdatePositionModal positions={[currPosition]} />
        </>
      )}
      <div>
        <PageSubTitle>Past Positions</PageSubTitle>
        <PositionsTableAndUpdatePositionModal positions={pastPositions} />
      </div>
    </ContentLayout>
  );
}
