"use client";

import { PositionTransactionDataType } from "@/app/lib/actions";
import { PositionTransaction } from "@prisma/client";
import { Table, TableProps } from "antd";
import dayjs from "dayjs";

export default function TransactionTable({
  transactions,
}: {
  transactions: PositionTransactionDataType[];
}) {
  const columns: TableProps<PositionTransactionDataType>["columns"] = [
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "date",
      render: (val) => dayjs(val).format("DD MMM YYYY"),
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
