"use client";
import { Counter, Position } from "@prisma/client";
import { Button, Space, Table, TableProps } from "antd";
import Link from "next/link";
import dayjs from "dayjs";

type DataType = Omit<Position, "avgBuyPrice" | "avgSellPrice"> & {
  avgBuyPrice: string;
  avgSellPrice: string | null;
  counter: Pick<Counter, "name" | "slug">;
};

export default function PositionTable({
  positions,
}: {
  positions: DataType[];
}) {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Counter",
      dataIndex: ["counter", "name"],
      key: "counter",
      render: (val, row) => (
        <Link href={`counters/${row.counter.slug}`}>{val}</Link>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (val, row) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
      },
    },

    { title: "Quantity Bought", dataIndex: "quantity", key: "quantity" },
    { title: "Quantity Remaining", dataIndex: "quantity", key: "quantity" },

    {
      title: "Average Buy Price",
      dataIndex: "avgBuyPrice",
      key: "avgBuyPrice",
    },

    {
      title: "Average Sell Price",
      dataIndex: "avgSellPrice",
      key: "avgSellPrice",
      render: (val) => val ?? "-",
    },
    {
      title: "Date Opened",
      dataIndex: "openedAt",
      key: "openedAt",
      render: (val) => dayjs(val).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (val, row) => (
        <Space size="small">
          <Button>Increase</Button>
          <Button>Decrease</Button>
          <Button>View</Button>
        </Space>
      ),
    },
  ];

  const data: DataType[] = positions.map((p) => ({
    key: p.id,
    ...p,
  }));

  return <Table<DataType> columns={columns} dataSource={data} />;
}
