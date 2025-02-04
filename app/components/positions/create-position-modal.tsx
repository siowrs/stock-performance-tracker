"use client";

import { Modal, Button, Typography, Form } from "antd";
import CreatePositionForm from "./create-position-form";
import { createPosition } from "@/app/lib/actions";
import { Counter, Prisma } from "@prisma/client";
import {
  useState,
  startTransition,
  useActionState,
  useEffect,
  useRef,
} from "react";
import { useMessageContext } from "@/app/lib/providers/message-toast-provider";
import dayjs from "dayjs";

export default function CreatePositionModal({
  counters,
}: {
  counters: Counter[];
}) {
  const [createPositionModalOpen, setCreatePositionModalOpen] =
    useState<boolean>(false);

  const initialStatus = {
    status: undefined,
    message: "",
  };

  const [res, formAction, isPending] = useActionState(
    createPosition,
    initialStatus
  );

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
    // console.log(res);
    if (res.status === "success" && !isPending) {
      setCreatePositionModalOpen(false);
      openToast(res.status, res.message);
    }
  }, [res, isPending]);

  //reset res object so that the error msg disappear on modal close
  const handleModalClose = () => {
    res.status = initialStatus.status;
    res.message = initialStatus.message;
  };

  return (
    <>
      <Button onClick={() => setCreatePositionModalOpen(true)}>
        Open New Position
      </Button>
      <Modal
        afterClose={handleModalClose}
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
          res={res}
          counters={counters}
        />
      </Modal>
    </>
  );
}
