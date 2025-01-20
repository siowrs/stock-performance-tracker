import prisma from "@/app/lib/db";
import EditSectorForm from "@/app/components/sectors/edit-sector-form";
import { fetchSectorBySlug } from "@/app/lib/actions";

export default async function EditSectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = await fetchSectorBySlug(slug);

  return sector ? <EditSectorForm sector={sector} /> : "No sector found.";
}
