"use client";

import { useState } from "react";
import PositionTable from "./positions-table";
import UpdatePositionModal from "./update-position-modal";
import { Counter, Position } from "@prisma/client";
import { PositionDataType } from "@/app/lib/actions";

// export type PositionDataType = Omit<
//   Position,
//   "avgBuyPrice" | "avgSellPrice"
// > & {
//   avgBuyPrice: string;
//   avgSellPrice: string | null;
//   counter: Pick<Counter, "name" | "slug">;
// };

export default function PositionsTableAndTableAction({
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
