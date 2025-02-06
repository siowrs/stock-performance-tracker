import { Counter } from "@prisma/client";
import CreatePositionForm from "../components/positions/create-position-form";
import { fetchCounters, fetchPositions } from "../lib/actions";
import Link from "next/link";
import { ClientButton } from "../components/buttons";
import CreatePositionModal from "../components/positions/create-position-modal";
import ClientTitle from "../components/title";
import ClientStatistic from "../components/statistic";
import PositionsTableAndUpdatePositionModal from "../components/positions/positions-table-and-update-position-modal";

export default async function PositionsPage() {
  const [positions, counters] = await Promise.all([
    fetchPositions(),
    fetchCounters(),
  ]);

  //tdl error handling
  if ("status" in positions && "message" in positions) {
    return positions.message;
  }

  if ("status" in counters && "message" in counters) {
    return counters.message;
  }

  const openPositionCount = positions.reduce(
    (acc, curr) => (curr.status === "open" ? ++acc : acc),
    0
  );

  const closedPositionCount = positions.reduce(
    (acc, curr) => (curr.status === "closed" ? ++acc : acc),
    0
  );

  // //parse it again since decimal cant pass to client component
  // const parsedPositions = JSON.parse(JSON.stringify(positions));

  return (
    <>
      <ClientTitle level={2}>Positions</ClientTitle>

      <CreatePositionModal counters={counters} />
      <ClientStatistic title="Open Positions" value={openPositionCount} />
      <ClientStatistic title="Closed Positions" value={closedPositionCount} />

      <PositionsTableAndUpdatePositionModal positions={positions} />
    </>
  );
}
