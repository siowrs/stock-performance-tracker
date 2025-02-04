"use client";

import {
  PositionDataType,
  PositionReturnState,
  updatePosition,
} from "@/app/lib/actions";
import { Position, Prisma } from "@prisma/client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Typography,
} from "antd";
import { startTransition, useActionState } from "react";

export default function UpdatePositionForm({
  position,
  res,
  handleSubmit,
}: {
  position: PositionDataType;
  res: PositionReturnState;
  handleSubmit: (
    values: Prisma.PositionUpdateInput & Prisma.PositionTransactionCreateInput
  ) => void;
}) {
  const { counter } = position;

  const { Text } = Typography;

  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      <Text>Update position for {counter.name}.</Text>

      {res.status === "error" && !res.fieldError && (
        <Text type="danger">{res.message}</Text>
      )}

      <Form onFinish={handleSubmit} layout="vertical" id="updatePositionForm">
        <Form.Item label="Action" name="action">
          <Select
            placeholder="Select action"
            options={[
              { value: "buy", label: "Increase" },
              { value: "sell", label: "Decrease" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Quantity" name="quantity">
          <Input />
        </Form.Item>
        <Form.Item label="Unit Price" name="unitPrice">
          <Input />
        </Form.Item>
        <Form.Item label="Transaction Date" name="transactionDate">
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
    </Space>
  );
}
