"use client";

import {
  CounterReturnState,
  createCounter,
  fetchCounters,
  fetchSectorsByCountry,
} from "@/app/lib/actions";
import { Prisma, Sector } from "@prisma/client";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { startTransition, useActionState, useEffect, useState } from "react";

export default function CreateCounterForm({
  res,
  handleSubmit,
}: {
  res: CounterReturnState;
  handleSubmit: (values: Prisma.CounterCreateInput) => void;
}) {
  const [country, setCountry] = useState("my");
  const [sectors, setSectors] = useState<Sector[] | null>(null);
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

  const { Text } = Typography;

  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      {res.status === "error" && !res.fieldError && (
        <Text type="danger">{res.message}</Text>
      )}
      <Form
        onFinish={handleSubmit}
        form={form}
        initialValues={{ country: country }}
        layout="vertical"
        id="createCounterForm"
      >
        <Form.Item label="Symbol" name="symbol">
          <Input />
        </Form.Item>
        <Form.Item label="Counter" name="name">
          <Input />
        </Form.Item>
        <Flex gap="middle">
          <Form.Item label="Country" name="country" style={{ width: "100%" }}>
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
          <Form.Item label="Sector" name="sector" style={{ width: "100%" }}>
            <Select
              loading={sectors === null}
              options={sectors?.map((s) => ({ value: s.id, label: s.name }))}
            ></Select>
          </Form.Item>
        </Flex>

        <Form.Item label="Remarks" name="remarks">
          <Input />
        </Form.Item>
      </Form>
    </Space>
  );
}
