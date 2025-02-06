import ClientStatistic from "@/app/components/statistic";
import ClientTitle from "@/app/components/title";
import {
  fetchPositionById,
  PositionDataType,
  PositionReturnState,
} from "@/app/lib/actions";
import { capitalizeFirstLetter } from "@/app/lib/misc";
import {
  MinusOutlined,
  PercentageOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import TransactionsTable from "@/app/components/transactions/transaction-table";
import UpdatePositionModalAndButton from "@/app/components/positions/position/update-position-modal-and-button";

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
    gainOrLoss: +position.realizedGL > 0 ? "gain" : "loss",
    realizedGL: Math.abs(+position.realizedGL).toString(),
    totalRealizedGLPercentage: Math.abs(
      +position.totalRealizedGLPercentage
    ).toString(),
  };

  // console.log(formattedPosition.transaction);

  return (
    <>
      <ClientTitle level={4} type="secondary">
        Position Details
      </ClientTitle>
      {position.status === "open" && (
        <UpdatePositionModalAndButton position={position} />
      )}
      <ClientTitle level={1}>{formattedPosition.counter.symbol}</ClientTitle>
      <ClientTitle level={5}>{formattedPosition.counter.name}</ClientTitle>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <ClientStatistic
            title="Status"
            value={capitalizeFirstLetter(formattedPosition.status)}
          />
        </Col>
        <Col span={6}>
          <ClientStatistic
            title="Quantity Bought"
            value={formattedPosition.quantityBought}
          />
        </Col>

        <Col span={6}>
          <ClientStatistic
            title="Quantity Remaining"
            value={formattedPosition.quantityRemaining}
          />
        </Col>

        <Col span={6}>
          <ClientStatistic
            title="Total Buying Cost"
            value={`${formattedPosition.counter.currency}${formattedPosition.totalCost}`}
          />
        </Col>
        <Col span={6}>
          <ClientStatistic
            title="Average Unit Buy Price"
            value={`${formattedPosition.counter.currency}${formattedPosition.avgBuyPrice}`}
          />
        </Col>

        <Col span={6}>
          <ClientStatistic
            title="Average Unit Sell Price"
            value={
              formattedPosition.avgSellPrice
                ? `${formattedPosition.counter.currency}${formattedPosition.avgSellPrice}`
                : "-"
            }
          />
        </Col>

        <Col span={6}>
          <ClientStatistic
            title="Realized Profit/Loss"
            value={`${formattedPosition.counter.currency}${formattedPosition.realizedGL}`}
            prefix={
              formattedPosition.gainOrLoss === "gain" ? (
                <PlusOutlined />
              ) : (
                <MinusOutlined />
              )
            }
            valueStyle={
              formattedPosition.gainOrLoss === "gain"
                ? { color: "#2dfc87" }
                : { color: "#ff5e5e" }
            }
          />
        </Col>

        <Col span={6}>
          <ClientStatistic
            title="Realized Profit/Loss %"
            value={formattedPosition.totalRealizedGLPercentage}
            prefix={
              formattedPosition.gainOrLoss === "gain" ? (
                <PlusOutlined />
              ) : (
                <MinusOutlined />
              )
            }
            suffix={<PercentageOutlined />}
            valueStyle={
              formattedPosition.gainOrLoss === "gain"
                ? { color: "#2dfc87" }
                : { color: "#ff5e5e" }
            }
          />
        </Col>
      </Row>

      <TransactionsTable
        transactions={formattedPosition.transaction}
        currency={formattedPosition.counter.currency}
      />
    </>
  );
}
