import EditCounterForm from "@/app/components/counters/EditCounterForm";
import { fetchCounterBySlug, fetchSectorsByCountry } from "@/app/lib/actions";

export default async function EditCounterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const counter = await fetchCounterBySlug(slug);

  return counter ? <EditCounterForm counter={counter} /> : "No counter found";
}
