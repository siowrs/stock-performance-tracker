"use client";

import { increasePosition } from "@/app/lib/actions";
import { Position } from "@prisma/client";
import { Button, Form, Input } from "antd";
import { startTransition, useActionState } from "react";

export default function IncreasePositionForm({
  positionId,
}: {
  positionId: string;
}) {
  const increasePositionById = increasePosition.bind(null, positionId);
  const [error, formAction, isPending] = useActionState(
    increasePositionById,
    null
  );
  const handleSubmit = (values: any) =>
    startTransition(() => formAction(values));

  return (
    <>
      <Form onFinish={handleSubmit}>
        <Form.Item label="quantity" name="quantity">
          <Input />
        </Form.Item>
        <Form.Item label="price" name="unitPrice">
          <Input />
        </Form.Item>

        <Button htmlType="submit" loading={isPending}>
          Submit
        </Button>
      </Form>
    </>
  );
}
