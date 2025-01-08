"use client";

import {
  createCounter,
  fetchCounters,
  fetchSectorsByCountry,
} from "@/app/lib/actions";
import { Prisma, Sector } from "@prisma/client";
import { Button, Form, Input, Select } from "antd";
import { startTransition, useActionState, useEffect, useState } from "react";

export default function CreateCounterForm() {
  const [country, setCountry] = useState("my");
  const [sectors, setSectors] = useState<Sector[] | null>(null);
  const [error, formAction, isPending] = useActionState(createCounter, null);
  const [form] = Form.useForm();

  useEffect(() => {
    //fetch sector
    let ignore = false;
    setSectors(null);
    //reset default selected
    form.setFieldsValue({ sector: null });

    (async () => {
      const data = await fetchSectorsByCountry(country);
      if (!ignore) {
        setSectors(data);

        if (data.length > 0) {
          //select first one by default
          form.setFieldsValue({ sector: data[0].id });
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [country]);

  const handleSubmit = (values: Prisma.CounterCreateInput) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <Form
      onFinish={handleSubmit}
      form={form}
      initialValues={{ country: country }}
    >
      <Form.Item label="Symbol" name="symbol">
        <Input />
      </Form.Item>
      <Form.Item label="Counter" name="name">
        <Input placeholder="hi" />
      </Form.Item>
      <Form.Item label="Country" name="country">
        <Select
          onChange={(val) => {
            setCountry(val);
          }}
          options={[
            { value: "my", label: "Malaysia" },
            { value: "us", label: "United States" },
          ]}
        ></Select>
      </Form.Item>
      <Form.Item label="Sector" name="sector">
        <Select
          loading={sectors === null}
          options={sectors?.map((s) => ({ value: s.id, label: s.name }))}
        ></Select>
      </Form.Item>
      <Form.Item label="Remarks" name="remarks">
        <Input />
      </Form.Item>

      <Button loading={isPending} htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}
