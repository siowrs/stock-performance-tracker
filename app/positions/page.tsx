import { Counter } from "@prisma/client";
import CreatePositionForm from "../components/positions/create-position-form";
import { fetchCounters, fetchPositions } from "../lib/actions";
import Link from "next/link";
import PositionTable from "../components/positions/position-table";
import { ClientButton } from "../components/buttons";
import CreatePositionModal from "../components/positions/create-position-modal";
import ClientTitle from "../components/title";
import PositionTableAndTableAction from "../components/positions/position-table-and-table-action";
import ClientStatistic from "../components/statistic";

export default async function PositionsPage() {
  const [positions, counters] = await Promise.all([
    fetchPositions(),
    fetchCounters(),
  ]);

  const openPositionCount = positions.reduce(
    (acc, curr) => (curr.status === "open" ? ++acc : acc),
    0
  );

  const closedPositionCount = positions.reduce(
    (acc, curr) => (curr.status === "closed" ? ++acc : acc),
    0
  );

  //parse it again since decimal cant pass to client component
  const parsedPositions = JSON.parse(JSON.stringify(positions));

  return (
    <>
      <ClientTitle level={2}>Positions</ClientTitle>

      <CreatePositionModal counters={counters} />
      <ClientStatistic title="Open Positions" value={openPositionCount} />
      <ClientStatistic title="Closed Positions" value={closedPositionCount} />

      <PositionTableAndTableAction positions={parsedPositions} />
    </>
  );
}
