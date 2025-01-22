"use client";

import {
  fetchCounters,
  fetchSectorsByCountry,
  updateCounter,
} from "@/app/lib/actions";
import { Counter, Prisma, Sector } from "@prisma/client";
import { Button, Form, Input, Select } from "antd";
import { startTransition, useActionState, useEffect, useState } from "react";

export default function EditCounterForm({
  counter,
}: {
  // counter: Prisma.CounterUpdateInput & { sectorId: string; id: string };
  counter: Counter;
}) {
  const updateCounterWithId = updateCounter.bind(null, counter.id);
  const [newCountry, setNewCountry] = useState(counter.country as string);
  const [sectors, setSectors] = useState<Sector[] | null>(null);
  const [error, formAction, isPending] = useActionState(
    updateCounterWithId,
    null
  );
  const [form] = Form.useForm();

  const { symbol, name, remarks, country, sectorId } = counter;

  // fetch sector based on counter country
  useEffect(() => {
    let ignore = false;
    setSectors(null);
    (async () => {
      const data = await fetchSectorsByCountry(newCountry);
      if (!ignore) {
        setSectors(data);

        //set the sector value here to prevent flashing
        if (!form.getFieldValue("sector")) {
          form.setFieldsValue({ sector: sectorId });
        } else {
          //should always default select the first sector
          // whenever country change
          form.setFieldsValue({ sector: data[0].id });
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [newCountry]);

  const handleSubmit = (values: Prisma.CounterUpdateInput) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <Form
      onFinish={handleSubmit}
      form={form}
      initialValues={{
        symbol,
        name,
        country,
        // dont set sector id here to prevent flashing
        // sector: sectorId,
        remarks,
      }}
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
            setNewCountry(val);
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
