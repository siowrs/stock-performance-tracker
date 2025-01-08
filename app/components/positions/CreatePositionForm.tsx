"use client";

import { createPosition } from "@/app/lib/actions";
import { Counter, Prisma } from "@prisma/client";
import { Button, Form, Input, Select } from "antd";
import { startTransition, useActionState } from "react";

export default function CreatePositionForm({
  counters,
}: {
  counters: Counter[];
}) {
  const [error, formAction, isPending] = useActionState(createPosition, null);

  const handleSubmit = (
    values: Prisma.PositionCreateInput & Prisma.PositionTransactionCreateInput
  ) => {
    startTransition(() => formAction(values));
  };

  const groupedCounters = counters.reduce((acc, counter) => {
    const country = counter.country.toLowerCase();
    //create an empty array if not yet created
    //so that we can push item inside
    if (!acc[country]) {
      acc[country] = [];
    }

    acc[country].push({
      value: counter.id,
      label: `${counter.name} (${counter.symbol})`,
    });
    return acc;
    //use Record in typescript to descript groupedCounters outcome type
  }, {} as Record<string, { label: string; value: string }[]>);

  return (
    <>
      <Form onFinish={handleSubmit} layout="vertical">
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
        <Form.Item label="Price" name="unitPrice">
          <Input />
        </Form.Item>
        <Button loading={isPending} htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}
