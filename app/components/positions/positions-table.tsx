"use client";
import { Counter, Position } from "@prisma/client";
import { Button, Popconfirm, Space, Table, TableProps, Typography } from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import { useState, Dispatch, SetStateAction, useActionState } from "react";

import {
  DeleteFilled,
  DeleteOutlined,
  DeleteTwoTone,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { deletePosition, PositionDataType } from "@/app/lib/actions";
import { useMessageContext } from "@/app/lib/providers/message-toast-provider";
import { capitalizeFirstLetter } from "@/app/lib/misc";
import { usePathname } from "next/navigation";

export default function PositionsTable({
  positions,
  setUpdateModalOpen,
  setSelected,
}: {
  positions: PositionDataType[];
  setUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelected: Dispatch<SetStateAction<PositionDataType | undefined>>;
}) {
  const openToast = useMessageContext();

  const { Text } = Typography;

  const handleDelete = async (id: string) => {
    const res = await deletePosition(id);
    if (res.status) {
      openToast(res.status, res.message);
    }
  };

  const pathname = usePathname();

  const columns: TableProps<PositionDataType>["columns"] = [
    // onlyshow counter name column when not in counter page
    ...(!pathname.startsWith("/counters")
      ? [
          {
            title: "Counter",
            dataIndex: ["counter", "symbol"],
            key: "counter",
            render: (val: string, row: PositionDataType) => (
              <Link href={`counters/${row.counter.slug}`}>{val}</Link>
            ),
          },
        ]
      : []),
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (val, row) => {
        return capitalizeFirstLetter(val);
      },
    },

    {
      title: "Quantity",
      dataIndex: "quantityBought",
      key: "quantity",
      render: (val, row) => (
        <Space direction="vertical" size="small">
          <Text>Bought: {val}</Text>
          <Text>Remaining: {row.quantityRemaining}</Text>
        </Space>
      ),
    },
    // {
    //   title: "Quantity Remaining",
    //   dataIndex: "quantityRemaining",
    //   key: "quantityRemaining",
    // },

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
        // <div className="w-full flex gap-x-2">
        <Space>
          <Button
            disabled={row.status === "open" ? false : true}
            onClick={() => {
              setUpdateModalOpen(true);
              setSelected(positions.find((p) => p.id == row.id));
            }}
          >
            Update
          </Button>

          <Link href={`/positions/${row.id}`}>
            <Button>View</Button>
          </Link>

          <Popconfirm
            okText="Delete"
            placement="topRight"
            okType="danger"
            overlayInnerStyle={{ padding: "1rem 1.25rem" }}
            onConfirm={() => handleDelete(row.id)}
            title={
              <>
                <ExclamationCircleOutlined
                  style={{ color: "red" }}
                  className="me-2"
                />
                Delete Position?
              </>
            }
            icon=""
            description={
              <div className="mb-2">This action cannot be undone.</div>
            }
          >
            <Button
              // onClick={() => setDeleteModalOpen(true)}
              // className="ml-auto"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
        // </div>
      ),
    },
  ];

  const data: PositionDataType[] = positions.map((p) => ({
    key: p.id,
    ...p,
  }));

  return (
    <Table<PositionDataType>
      pagination={{ hideOnSinglePage: true }}
      columns={columns}
      dataSource={data}
    />
  );
}
