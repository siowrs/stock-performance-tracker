"use client";

import { decreasePosition, increasePosition } from "@/app/lib/actions";
import { Position } from "@prisma/client";
import { Button, Form, Input } from "antd";
import { startTransition, useActionState } from "react";

export default function DecreasePositionForm({
  positionId,
}: {
  positionId: string;
}) {
  const decreasePositionById = decreasePosition.bind(null, positionId);
  const [error, formAction, isPending] = useActionState(
    decreasePositionById,
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
