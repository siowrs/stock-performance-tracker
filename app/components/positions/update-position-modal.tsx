"use client";

import { Modal } from "antd";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { PositionDataType } from "./position-table-and-table-action";
import UpdatePositionForm from "./update-position-form";
import { updatePosition } from "@/app/lib/actions";
import { useMessageContext } from "@/app/lib/providers/message-toast-provider";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

export default function UpdatePositionModal({
  updateModalOpen,
  setUpdateModalOpen,
  position,
}: {
  updateModalOpen: boolean;
  setUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
  position: PositionDataType;
}) {
  const updatePositionById = updatePosition.bind(null, position.id);

  const [error, formAction, isPending] = useActionState(updatePositionById, {
    message: null,
  });

  const handleSubmit = (
    values: Prisma.PositionUpdateInput & Prisma.PositionTransactionCreateInput
  ) => {
    const newValues = {
      ...values,
      transactionDate: dayjs(values.transactionDate).toString(),
    };

    startTransition(() => formAction(newValues));
  };

  const openToast = useMessageContext();

  useEffect(() => {
    if (!error && !isPending) {
      setUpdateModalOpen(false);
      openToast("success", "Position updated successfully.");
    }
  }, [error, isPending]);

  return (
    <Modal
      destroyOnClose={true}
      title="Update Position"
      open={updateModalOpen}
      okText="Update Position"
      okButtonProps={{ form: "updatePositionForm", htmlType: "submit" }}
      onCancel={() => setUpdateModalOpen(false)}
      confirmLoading={isPending}
    >
      <UpdatePositionForm
        handleSubmit={handleSubmit}
        error={error}
        position={position}
      />
    </Modal>
  );
}
