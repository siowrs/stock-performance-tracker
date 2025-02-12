"use client";

import {
  CounterDataType,
  createPosition,
  PositionReturnState,
} from "@/app/lib/actions";
import { Counter, Prisma } from "@prisma/client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Typography,
} from "antd";
import { ReactNode, startTransition, useActionState, useRef } from "react";

export default function CreatePositionForm({
  counters,
  res,
  handleSubmit,
}: {
  counters: CounterDataType[];
  res: PositionReturnState;
  handleSubmit: (
    values: Prisma.PositionCreateInput & Prisma.PositionTransactionCreateInput
  ) => void;
}) {
  const { Text } = Typography;
  const groupedCounters = counters.reduce((acc, counter) => {
    const country = counter.country.toLowerCase();
    //create an empty array if not yet created
    //so that we can push item inside
    if (!acc[country]) {
      acc[country] = [];
    }

    acc[country].push({
      value: counter.id,
      label: counter.symbol,
    });
    return acc;
    //use Record in typescript to descript groupedCounters outcome type
  }, {} as Record<string, { label: string; value: string }[]>);

  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      {res.status === "error" && !res.fieldError && (
        <Text type="danger">{res.message}</Text>
      )}

      <Form onFinish={handleSubmit} layout="vertical" id="createPositionForm">
        <Form.Item label="Counter" name="counter">
          <Select
            showSearch
            placeholder="Select a counter"
            optionFilterProp="label"
            options={[
              {
                label: "Malaysia",
                title: "Malaysia",
                options: groupedCounters["my"] || [],
              },
              {
                label: "United States",
                title: "United States",
                options: groupedCounters["us"] || [],
              },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item label="Quantity" name="quantity">
          <Input />
        </Form.Item>
        <Form.Item label="Unit Price" name="unitPrice">
          <Input />
        </Form.Item>
        <Form.Item label="Open Date" name="transactionDate">
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
    </Space>
  );
}
