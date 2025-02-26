import prisma from "@/app/lib/db";
import CreateCounterForm from "../components/counters/create-counter-form";
import { fetchCounters } from "../lib/actions";
import { DeleteButton } from "../components/buttons";
import Link from "next/link";
import ClientTitle from "../components/title";
import CountersTableAndUpdateCounterModal from "../components/counters/counters-table-and-update-counter-modal";
import CreateCounterModal from "../components/counters/create-counter-modal";
import ModuleTitle from "../components/module-title";
import ContentLayout from "../components/content-layout";
import { Flex } from "antd";

export default async function CountersPage() {
  const counters = await fetchCounters();

  //tdl error handling
  if ("status" in counters && "message" in counters) {
    return counters.message;
  }
  return (
    <ContentLayout>
      <Flex justify="space-between" align="center">
        <ModuleTitle>Counters</ModuleTitle>
        <CreateCounterModal />
      </Flex>
      <CountersTableAndUpdateCounterModal counters={counters} />
    </ContentLayout>
  );
}
