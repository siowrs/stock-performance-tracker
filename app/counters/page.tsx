import prisma from "@/app/lib/db";
import CreateCounterForm from "../components/counters/create-counter-form";
import { deleteCounter, fetchCounters } from "../lib/actions";
import { DeleteButton } from "../components/buttons";
import Link from "next/link";

export default async function CountersPage() {
  const counters = await fetchCounters();
  return (
    <>
      <CreateCounterForm />
      {counters.map((c) => (
        <li key={c.id}>
          {c.symbol} - {c.name}
          <DeleteButton id={c.id} action={deleteCounter} />
          <Link href={`counters/${c.slug}/edit`}>Edit</Link>
        </li>
      ))}
    </>
  );
}
