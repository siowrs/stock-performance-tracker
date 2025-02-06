"use client";

import { PositionTransactionDataType } from "@/app/lib/actions";
import { capitalizeFirstLetter } from "@/app/lib/misc";
import { PositionTransaction } from "@prisma/client";
import { Table, TableProps, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function TransactionsTable({
  transactions,
  currency,
}: {
  transactions: PositionTransactionDataType[];
  currency: string;
}) {
  const { Text } = Typography;
  const columns: TableProps<PositionTransactionDataType>["columns"] = [
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "date",
      render: (val) => {
        dayjs.extend(relativeTime);
        return (
          <>
            <Text>{dayjs(val).format("DD MMM YYYY")}</Text>
            <br />
            <Text type="secondary">{dayjs(val).fromNow()}</Text>
          </>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (val) => capitalizeFirstLetter(val),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (val, row) => (row.action === "buy" ? "+" : "-") + val,
    },
    {
      title: "Net Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (val) => currency + val,
    },
  ];

  const data: PositionTransactionDataType[] = transactions.map((t) => ({
    key: t.id,
    ...t,
  }));

  return (
    <>
      <Table<PositionTransactionDataType> columns={columns} dataSource={data} />
    </>
  );
}
