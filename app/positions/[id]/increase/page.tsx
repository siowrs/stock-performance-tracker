import IncreasePositionForm from "@/app/components/positions/IncreasePositionForm";
import { fetchPositionById } from "@/app/lib/actions";
import { Position } from "@prisma/client";

export default async function IncreasePositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const position = await fetchPositionById(id);
  //parse it again since decimal cant pass to client component
  //   const data = JSON.parse(JSON.stringify(position));
  return position ? (
    <IncreasePositionForm positionId={position.id} />
  ) : (
    "No position found."
  );
}
