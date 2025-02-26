import CustomStatistic from "@/app/components/statistic";
import ClientTitle from "@/app/components/title";
import {
  fetchPositionById,
  PositionDataType,
  PositionReturnState,
} from "@/app/lib/actions";
import {
  capitalizeFirstLetter,
  formatNumber,
  gainGreen,
  lossRed,
} from "@/app/lib/misc";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MinusOutlined,
  PercentageOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Tag } from "antd";
import TransactionsTable from "@/app/components/transactions/transaction-table";
import UpdatePositionModalAndButton from "@/app/components/positions/position/update-position-modal-and-button";
import PageTitle from "@/app/components/page-title";
import DisplayTitle from "@/app/components/display-title";
import ContentLayout from "@/app/components/content-layout";

export default async function PositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const position = await fetchPositionById(id);

  //tdl error handling
  if (!position) {
    return "No Position Found";
  }

  if ("status" in position && "message" in position) {
    return position.message;
  }

  const formattedPosition = {
    ...position,
    ...(+position.realizedGL !== 0 && {
      gainOrLoss: +position.realizedGL > 0 ? "gain" : "loss",
    }),
    realizedGL: Math.abs(+position.realizedGL).toString(),
    absoluteRealizedGLPercentage: Math.abs(
      +position.absoluteRealizedGLPercentage
    ).toString(),
  };

  // console.log(formattedPosition.transaction);

  return (
    <ContentLayout>
      <PageTitle>Position Details</PageTitle>

      {position.status === "open" && (
        <UpdatePositionModalAndButton position={position} />
      )}
      <div>
        <DisplayTitle className="!mb-2">
          {formattedPosition.counter.symbol}
        </DisplayTitle>
        <ClientTitle className="!mt-0" level={5}>
          {formattedPosition.counter.name}
        </ClientTitle>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <CustomStatistic
            title="Status"
            value={capitalizeFirstLetter(formattedPosition.status)}
          />
        </Col>
        <Col span={6}>
          <CustomStatistic
            title="Quantity Available"
            value={`${formattedPosition.quantityRemaining} / ${formattedPosition.quantityBought}`}
          />
        </Col>

        <Col span={6}>
          <CustomStatistic
            title="Total Buying Cost"
            value={`${formattedPosition.counter.currency}${formattedPosition.totalCost}`}
          />
        </Col>
        <Col span={6}>
          <CustomStatistic
            title="Average Unit Buy Price"
            value={`${formattedPosition.counter.currency}${formattedPosition.avgBuyPrice}`}
          />
        </Col>

        <Col span={6}>
          <CustomStatistic
            title="Average Unit Sell Price"
            value={
              formattedPosition.avgSellPrice
                ? `${formattedPosition.counter.currency}${formattedPosition.avgSellPrice}`
                : "-"
            }
          />
        </Col>

        <Col span={6}>
          <CustomStatistic
            title="Realized Profit/Loss"
            value={`${formattedPosition.counter.currency}${formatNumber(
              formattedPosition.realizedGL
            )}`}
            {...(formattedPosition.gainOrLoss && {
              valueStyle: {
                color:
                  formattedPosition.gainOrLoss === "gain" ? gainGreen : lossRed,
              },

              prefix:
                formattedPosition.gainOrLoss === "gain" ? (
                  <PlusOutlined />
                ) : (
                  <MinusOutlined />
                ),

              suffix: (
                <Tag
                  className="!ms-3"
                  style={{
                    color:
                      formattedPosition.gainOrLoss === "gain"
                        ? "#133f1d"
                        : "#340e0e",
                  }}
                  color={
                    formattedPosition.gainOrLoss === "gain"
                      ? gainGreen
                      : lossRed
                  }
                  icon={
                    formattedPosition.gainOrLoss === "gain" ? (
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
                  {formattedPosition.absoluteRealizedGLPercentage}
                  <PercentageOutlined
                    style={{
                      color:
                        formattedPosition.gainOrLoss === "gain"
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

      <TransactionsTable
        transactions={formattedPosition.transactions}
        currency={formattedPosition.counter.currency}
      />
    </ContentLayout>
  );
}
