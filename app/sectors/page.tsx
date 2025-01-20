import { DeleteTwoTone } from "@ant-design/icons";
import prisma from "../lib/db";
import CreateSectorForm from "../components/sectors/create-sector-form";
import { Button } from "antd";
import { DeleteButton } from "../components/buttons";
import { deleteSector, fetchSectors } from "../lib/actions";
import Link from "next/link";

export default async function SectorsPage() {
  const sectors = await fetchSectors();
  return (
    <>
      <CreateSectorForm />
      {sectors.map((s) => (
        <li key={s.id}>
          {s.name}
          <DeleteButton id={s.id} action={deleteSector} />
          {/* <EditButton id={s.id} action={deleteSector} /> */}
          <Link href={`sectors/${s.slug}/edit`}>Edit</Link>
        </li>
      ))}
    </>
  );
}
