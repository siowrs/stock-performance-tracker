"use client";

import { Counter } from "@prisma/client";
import CountersTable from "./counters-table";
import UpdateCounterModal from "./update-counter-modal";
import { useState } from "react";

export default function CountersTableAndUpdateCounterModal({
  counters,
}: {
  counters: Counter[];
}) {
  const [selected, setSelected] = useState<Counter | undefined>(undefined);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  return (
    <>
      <CountersTable
        counters={counters}
        setSelected={setSelected}
        setUpdateModalOpen={setUpdateModalOpen}
      />

      {selected && (
        <UpdateCounterModal
          updateModalOpen={updateModalOpen}
          setUpdateModalOpen={setUpdateModalOpen}
          counter={selected}
        />
      )}
    </>
  );
}
