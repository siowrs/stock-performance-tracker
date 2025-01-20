import { Counter } from "@prisma/client";
import CreatePositionForm from "../components/positions/create-position-form";
import { fetchCounters, fetchPositions } from "../lib/actions";
import Link from "next/link";
import PositionTable from "../components/positions/position-table";
import { ClientButton } from "../components/buttons";
import CreatePositionModal from "../components/positions/create-position-modal";
import ClientTitle from "../components/title";

export default async function PositionsPage() {
  const [positions, counters] = await Promise.all([
    fetchPositions(),
    fetchCounters(),
  ]);

  //parse it again since decimal cant pass to client component
  const parsedPositions = JSON.parse(JSON.stringify(positions));

  // parsedPositions.forEach((p) => console.log(p.openedAt, typeof p.openedAt));
  return (
    <>
      <ClientTitle level={2}>Positions</ClientTitle>
      <CreatePositionModal counters={counters} />
      <PositionTable positions={parsedPositions} />
      {/* {positions.map((p) => (
        <li key={p.id}>
          Counter:{" "}
          <Link href={`counters/${p.counter.slug}`}>{p.counter.name}</Link>
          <br />
          Status: {p.status}
          <br />
          Average buy price: {p.avgBuyPrice.toString()}
          <Link href={`positions/${p.id}/increase`}>Increase</Link>
          <Link href={`positions/${p.id}/decrease`}>Decrease</Link>
        </li>
      ))} */}
    </>
  );
}
