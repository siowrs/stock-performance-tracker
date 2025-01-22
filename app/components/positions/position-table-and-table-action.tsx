"use client";

import { useState } from "react";
import PositionTable from "./position-table";
import UpdatePositionModal from "./update-position-modal";
import { Counter, Position } from "@prisma/client";

export type PositionDataType = Omit<
  Position,
  "avgBuyPrice" | "avgSellPrice"
> & {
  avgBuyPrice: string;
  avgSellPrice: string | null;
  counter: Pick<Counter, "name" | "slug">;
};

export default function PositionTableAndTableAction({
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
      <PositionTable
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
