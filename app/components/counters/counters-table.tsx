"use client";

import { capitalizeFirstLetter } from "@/app/lib/misc";
import { DeleteOutlined } from "@ant-design/icons";
import { Counter } from "@prisma/client";
import { Button, Space, Table, TableProps } from "antd";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function CountersTable({
  counters,
  setUpdateModalOpen,
  setSelected,
}: {
  counters: Counter[];
  setUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelected: Dispatch<SetStateAction<Counter | undefined>>;
}) {
  const columns: TableProps<Counter>["columns"] = [
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
            Update
          </Button>
          <Button>
            <Link href={`counters/${row.slug}`}>View</Link>
          </Button>
          <Button danger shape="circle" icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const data: Counter[] = counters.map((c) => ({
    key: c.id,
    ...c,
  }));
  console.log(data);
  return <Table<Counter> columns={columns} dataSource={data} />;
}
