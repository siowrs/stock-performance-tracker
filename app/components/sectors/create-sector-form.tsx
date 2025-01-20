"use client";

import React, { startTransition, useActionState } from "react";
import { Button, Form, Input, Select } from "antd";
import { createSector, SectorErrorState } from "@/app/lib/actions";
import prisma from "@/app/lib/db";
import { Prisma } from "@prisma/client";

export default function CreateSectorForm() {
  // const initialState: SectorErrorState = { values: {}, message: null };
  // const [error, formAction, isPending] = useActionState(createSector, initialState);
  const [error, formAction, isPending] = useActionState(createSector, null);

  const handleSubmit = (values: Prisma.SectorCreateInput) => {
    // const formData = new FormData();

    // // Convert plain object to FormData
    // Object.entries(values).forEach(([key, value]) => {
    //   if (typeof value === "string") {
    //     formData.append(key, value);
    //   }
    // });

    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <>
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ country: "my" }}
      >
        <Form.Item label="Sector" name="name">
          <Input placeholder="Technology" />
        </Form.Item>

        <Form.Item label="Country" name="country">
          <Select
            options={[
              { value: "my", label: "Malaysia" },
              { value: "us", label: "United States" },
            ]}
          ></Select>
        </Form.Item>

        <Button loading={isPending} htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}
