"use client";

import { Modal } from "antd";
import UpdateCounterForm from "./update-counter-form";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { Counter, Prisma } from "@prisma/client";
import { CounterDataType, updateCounter } from "@/app/lib/actions";
import { useMessageContext } from "@/app/lib/providers/message-toast-provider";

export default function UpdateCounterModal({
  counter,
  updateModalOpen,
  setUpdateModalOpen,
}: {
  counter: CounterDataType;
  updateModalOpen: boolean;
  setUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const updateCounterWithId = updateCounter.bind(null, counter.id);

  const initialStatus = { status: undefined, message: "" };

  const [res, formAction, isPending] = useActionState(
    updateCounterWithId,
    initialStatus
  );

  const openToast = useMessageContext();

  const handleSubmit = (values: Prisma.CounterUpdateInput) => {
    startTransition(() => {
      formAction(values);
    });
  };

  useEffect(() => {
    if (res.status === "success" && !isPending) {
      setUpdateModalOpen(false);
      openToast(res.status, res.message);
    }
  }, [res, isPending]);

  const handleModalClose = () => {
    res.status = initialStatus.status;
    res.message = initialStatus.message;
  };
  return (
    <Modal
      onClose={handleModalClose}
      title="Edit Counter Details"
      okText="Update Counter"
      okButtonProps={{ form: "updateCounterForm", htmlType: "submit" }}
      open={updateModalOpen}
      onCancel={() => setUpdateModalOpen(false)}
      confirmLoading={isPending}
      destroyOnClose={true}
    >
      <UpdateCounterForm
        res={res}
        handleSubmit={handleSubmit}
        counter={counter}
      />
    </Modal>
  );
}
