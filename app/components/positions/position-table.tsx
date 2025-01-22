"use client";
import { Counter, Position } from "@prisma/client";
import { Button, Popconfirm, Space, Table, TableProps, Typography } from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import { useState, Dispatch, SetStateAction, useActionState } from "react";

import { PositionDataType } from "./position-table-and-table-action";
import {
  DeleteFilled,
  DeleteTwoTone,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { deletePosition } from "@/app/lib/actions";
import { useMessageContext } from "@/app/lib/providers/message-toast-provider";

export default function PositionTable({
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
    const error = await deletePosition(id);
    if (!error) {
      openToast("success", "Position deleted successfully.");
    }
  };

  const columns: TableProps<PositionDataType>["columns"] = [
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
        <div className="w-full flex gap-x-2">
          <Button
            onClick={() => {
              setUpdateModalOpen(true);
              setSelected(positions.find((p) => p.id == row.id));
            }}
          >
            Update
          </Button>

          <Button>View</Button>
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
              icon={<DeleteFilled />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const data: PositionDataType[] = positions.map((p) => ({
    key: p.id,
    ...p,
  }));

  return <Table<PositionDataType> columns={columns} dataSource={data} />;
}
