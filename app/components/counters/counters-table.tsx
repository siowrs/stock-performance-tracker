"use client";

import { CounterDataType } from "@/app/lib/actions";
import { capitalizeFirstLetter } from "@/app/lib/misc";
import { DeleteOutlined } from "@ant-design/icons";
import { Counter } from "@prisma/client";
import { Button, Space, Table, TableProps, Typography } from "antd";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function CountersTable({
  counters,
  setUpdateModalOpen,
  setSelected,
}: {
  counters: CounterDataType[];
  setUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelected: Dispatch<SetStateAction<CounterDataType | undefined>>;
}) {
  const { Text } = Typography;
  const columns: TableProps<CounterDataType>["columns"] = [
    {
      title: "Counter",
      dataIndex: "symbol",
      key: "counter",
    },
    {
      title: "Sector",
      dataIndex: ["sector", "name"],
      key: "sector",
      render: (val) => capitalizeFirstLetter(val),
    },
    {
      title: "Realized Gain/Loss",
      dataIndex: "realizedGL",
      key: "realizedGL",
      render: (val, row) => {
        return (
          <>
            <Text {...(val != 0 && { type: val > 0 ? "success" : "danger" })}>
              {val}
            </Text>
            <br />
            <Text type="secondary">{row.absoluteRealizedGLPercentage}%</Text>
          </>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Actions",
      key: "actions",
      render: (val, row) => (
        <Space>
          <Button
            onClick={() => {
              setSelected(counters.find((c) => c.id === row.id));
              setUpdateModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Link href={`/counters/${row.slug}`}>
            <Button>View</Button>
          </Link>
          <Button danger shape="circle" icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const data: CounterDataType[] = counters.map((c) => ({
    key: c.id,
    ...c,
  }));
  return <Table<CounterDataType> columns={columns} dataSource={data} />;
}
