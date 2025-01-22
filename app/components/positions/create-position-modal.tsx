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
  const [createPositionModalOpen, setCreatePositionModalOpen] =
    useState<boolean>(false);

  const [error, formAction, isPending] = useActionState(createPosition, {
    message: null,
  });

  const openToast = useMessageContext();

  const handleSubmit = (
    values: Prisma.PositionCreateInput & Prisma.PositionTransactionCreateInput
  ) => {
    // convert transactionDate to string to prevent below error:
    // Warning: Only plain objects can be passed to Client Components from Server Components.
    // Objects with toJSON methods are not supported.
    // Convert it manually to a simple value before passing it to props.
    const newValues = {
      ...values,
      transactionDate: dayjs(values.transactionDate).toString(),
    };

    startTransition(() => {
      formAction(newValues);
    });
  };

  useEffect(() => {
    if (!error && !isPending) {
      setCreatePositionModalOpen(false);
      openToast("success", "Position opened successfully.");
    }
  }, [error, isPending]);

  return (
    <>
      <Button onClick={() => setCreatePositionModalOpen(true)}>
        Open New Position
      </Button>
      <Modal
        destroyOnClose={true}
        title="Open New Position"
        open={createPositionModalOpen}
        okText="Open New Position"
        // onOk={() => setCreatePositionModalOpen(false)}
        okButtonProps={{ form: "createPositionForm", htmlType: "submit" }}
        onCancel={() => setCreatePositionModalOpen(false)}
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
