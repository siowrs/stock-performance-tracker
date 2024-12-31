"use client";

import React, { startTransition, useActionState } from "react";
import { Button, Form, Input, Select } from "antd";
import {
  createSector,
  SectorErrorState,
  updateSector,
} from "@/app/lib/actions";
import prisma from "@/app/lib/db";
import { Prisma } from "@prisma/client";

// interface FormRule {
//   name: string;
//   country: string;
// }
export default function EditSectorForm({
  sector,
}: {
  sector: Prisma.SectorUpdateInput & { id: string };
}) {
  // const initialState: SectorErrorState = { errors: {}, message: null };
  const updateSectorWithId = updateSector.bind(null, sector.id);

  const [error, formAction, isPending] = useActionState(
    updateSectorWithId,
    null
  );

  const handleSubmit = (values: Prisma.SectorUpdateInput) => {
    // console.log(sectorId);
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
        initialValues={{ name: sector.name, country: sector.country }}
      >
        <Form.Item label="Sector Name" name="name">
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
