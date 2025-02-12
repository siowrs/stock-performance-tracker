"use client";

import { Counter } from "@prisma/client";
import CountersTable from "./counters-table";
import UpdateCounterModal from "./update-counter-modal";
import { useState } from "react";
import { CounterDataType } from "@/app/lib/actions";

export default function CountersTableAndUpdateCounterModal({
  counters,
}: {
  counters: CounterDataType[];
}) {
  const [selected, setSelected] = useState<CounterDataType | undefined>(
    undefined
  );
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
