import DecreasePositionForm from "@/app/components/positions/decrease-position-form";
import { fetchPositionById } from "@/app/lib/actions";

export default async function DecreasePositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const position = await fetchPositionById(id);

  return position ? (
    <DecreasePositionForm positionId={position.id} />
  ) : (
    "No position found."
  );
}
