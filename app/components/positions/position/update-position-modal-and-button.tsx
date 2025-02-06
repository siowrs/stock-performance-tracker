"use client";

import { PositionDataType } from "@/app/lib/actions";
import { useState } from "react";
import UpdatePositionModal from "../update-position-modal";
import { Button } from "antd";

export default function UpdatePositionModalAndButton({
  position,
}: {
  position: PositionDataType;
}) {
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setUpdateModalOpen(true)}>Update Position</Button>
      <UpdatePositionModal
        updateModalOpen={updateModalOpen}
        setUpdateModalOpen={setUpdateModalOpen}
        position={position}
      />
    </>
  );
}
