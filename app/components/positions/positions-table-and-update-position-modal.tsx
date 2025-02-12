"use client";

import { useState } from "react";
import PositionsTable from "./positions-table";
import UpdatePositionModal from "./update-position-modal";
import { Counter, Position } from "@prisma/client";
import { PositionDataType } from "@/app/lib/actions";

export default function PositionsTableAndUpdatePositionModal({
  positions,
}: {
  positions: PositionDataType[];
}) {
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<PositionDataType | undefined>(
    undefined
  );

  return (
    <>
      <PositionsTable
        positions={positions}
        setUpdateModalOpen={setUpdateModalOpen}
        setSelected={setSelected}
      />

      {selected && (
        <UpdatePositionModal
          updateModalOpen={updateModalOpen}
          setUpdateModalOpen={setUpdateModalOpen}
          position={selected}
        />
      )}
    </>
  );
}
