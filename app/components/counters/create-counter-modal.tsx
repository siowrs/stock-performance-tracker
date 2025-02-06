"use client";

import { Button, Modal } from "antd";
import { startTransition, useActionState, useEffect, useState } from "react";
import CreateCounterForm from "./create-counter-form";
import { createCounter } from "@/app/lib/actions";
import { Prisma } from "@prisma/client";
import { useMessageContext } from "@/app/lib/providers/message-toast-provider";

export default function CreateCounterModal() {
  const [createCounterModalOpen, setCreateCounterModalOpen] =
    useState<boolean>(false);

  const initialStatus = {
    status: undefined,
    message: "",
  };

  const [res, formAction, isPending] = useActionState(
    createCounter,
    initialStatus
  );

  const handleSubmit = (values: Prisma.CounterCreateInput) => {
    startTransition(() => {
      formAction(values);
    });
  };

  const openToast = useMessageContext();

  useEffect(() => {
    if (res.status === "success" && !isPending) {
      setCreateCounterModalOpen(false);
      openToast(res.status, res.message);
    }
  }, [res, isPending]);

  const handleModalClose = () => {
    (res.status = initialStatus.status), (res.message = initialStatus.message);
  };
  return (
    <>
      <Button onClick={() => setCreateCounterModalOpen(true)}>
        Create New Counter
      </Button>

      <Modal
        onClose={handleModalClose}
        destroyOnClose={true}
        title="Create New Counter"
        okText="Create New Counter"
        okButtonProps={{ form: "createCounterForm", htmlType: "submit" }}
        open={createCounterModalOpen}
        centered={true}
        onCancel={() => setCreateCounterModalOpen(false)}
        confirmLoading={isPending}
      >
        <CreateCounterForm handleSubmit={handleSubmit} res={res} />
      </Modal>
    </>
  );
}
