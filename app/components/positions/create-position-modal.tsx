"use client";

import { Modal, Button } from "antd";
import CreatePositionForm from "./create-position-form";
import { createPosition } from "@/app/lib/actions";
import { Counter, Prisma } from "@prisma/client";
import { useState, startTransition, useActionState, useEffect } from "react";
import { useMessageContext } from "@/app/lib/providers/message-toast-provider";
import dayjs from "dayjs";

export default function CreatePositionModal({
  counters,
}: {
  counters: Counter[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [error, formAction, isPending] = useActionState(createPosition, {
    message: null,
  });
  const openToast = useMessageContext();

  const handleSubmit = async (
    values: Prisma.PositionCreateInput & Prisma.PositionTransactionCreateInput
  ) => {
    // convert openedAt to string to prevent below error:
    // Warning: Only plain objects can be passed to Client Components from Server Components.
    // Objects with toJSON methods are not supported.
    // Convert it manually to a simple value before passing it to props.
    const newValues = {
      ...values,
      openedAt: dayjs(values.openedAt).toString(),
    };

    startTransition(() => {
      formAction(newValues);
    });
  };

  useEffect(() => {
    if (!error) {
      setOpen(false);
      openToast("success", "Position opened successfully.");
    }
  }, [error]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open New Position</Button>
      <Modal
        title="Open New Position"
        open={open}
        okText="Open New Position"
        // onOk={() => setOpen(false)}
        okButtonProps={{ form: "createPositionForm", htmlType: "submit" }}
        onCancel={() => setOpen(false)}
        centered={true}
        confirmLoading={isPending}
      >
        <CreatePositionForm
          handleSubmit={handleSubmit}
          error={error}
          counters={counters}
        />
      </Modal>
    </>
  );
}
