import prisma from "@/app/lib/db";
import EditSectorForm from "@/app/components/sectors/EditSectorForm";
import { fetchSectorBySlug } from "@/app/lib/actions";

export default async function EditSectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = await fetchSectorBySlug(slug);
  if (!sector) {
    return "No sector found.";
  }

  return <EditSectorForm sector={sector} />;
}
