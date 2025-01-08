import { Counter } from "@prisma/client";
import CreatePositionForm from "../components/positions/CreatePositionForm";
import { fetchCounters, fetchPositions } from "../lib/actions";
import Link from "next/link";

export default async function PositionPage() {
  const [positions, counters] = await Promise.all([
    fetchPositions(),
    fetchCounters(),
  ]);
  // console.log(counters);
  return (
    <>
      <CreatePositionForm counters={counters} />
      {positions.map((p) => (
        <li key={p.id}>
          Counter: {p.counter.name}
          <br />
          Status: {p.status}
          <br />
          Average buy price: {p.avgBuyPrice.toString()}
          <Link href={`positions/${p.id}/increase`}>Increase</Link>
          <Link href={`positions/${p.id}/decrease`}>Decrease</Link>
        </li>
      ))}
    </>
  );
}
