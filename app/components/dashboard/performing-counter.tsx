import { Flex, Tag } from "antd";
import ClientText from "../text";
import ClientTitle from "../title";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MinusOutlined,
  PercentageOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CounterDataType } from "@/app/lib/actions";
import { formatNumber, gainGreen, lossRed } from "@/app/lib/misc";

export default function PerformingCounter({
  counter,
  type,
}: {
  type: "best" | "worst";
  counter: CounterDataType;
}) {
  return (
    <>
      <Flex vertical={false} gap="small">
        <img src={`https://flagcdn.com/${counter.country}.svg`} width="32" />
        <ClientText strong>{counter.symbol}</ClientText>
      </Flex>
      <ClientTitle
        level={2}
        style={{ color: type === "best" ? `${gainGreen}` : `${lossRed}` }}
      >
        {type === "best" ? (
          <PlusOutlined className="me-2" style={{ color: `${gainGreen}` }} />
        ) : (
          <MinusOutlined className="me-2" style={{ color: `${lossRed}` }} />
        )}
        {counter.currency}
        {formatNumber(counter.totalRealizedGL)}
      </ClientTitle>
      <Tag
        style={{ color: type === "best" ? "#133f1d" : "#340e0e" }}
        color={type === "best" ? gainGreen : lossRed}
        icon={
          type === "best" ? (
            <ArrowUpOutlined style={{ color: "#133f1d" }} />
          ) : (
            <ArrowDownOutlined style={{ color: "#340e0e" }} />
          )
        }
      >
        {counter.absoluteRealizedGLPercentage}
        <PercentageOutlined
          style={{ color: type === "best" ? "#133f1d" : "#340e0e" }}
        />
      </Tag>
    </>
  );
}
