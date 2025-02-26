"use client";

import { Modal } from "antd";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import UpdatePositionForm from "./update-position-form";
import { PositionDataType, updatePosition } from "@/app/lib/actions";
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

  const initialStatus = {
    status: undefined,
    message: "",
  };

  const [res, formAction, isPending] = useActionState(
    updatePositionById,
    initialStatus
  );

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
    if (res.status === "success" && !isPending) {
      setUpdateModalOpen(false);
      openToast(res.status, res.message);
    }
  }, [res, isPending]);

  //reset res object so that the error msg disappear on modal close
  const handleModalClose = () => {
    res.status = initialStatus.status;
    res.message = initialStatus.message;
  };

  return (
    <Modal
      afterClose={handleModalClose}
      destroyOnClose={true}
      title="Update Position"
      open={updateModalOpen}
      okText="Update Position"
      okButtonProps={{ form: "updatePositionForm", htmlType: "submit" }}
      onCancel={() => setUpdateModalOpen(false)}
      confirmLoading={isPending}
      centered={true}
    >
      <UpdatePositionForm
        handleSubmit={handleSubmit}
        res={res}
        position={position}
      />
    </Modal>
  );
}
