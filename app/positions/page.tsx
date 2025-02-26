import { Counter } from "@prisma/client";
import CreatePositionForm from "../components/positions/create-position-form";
import { fetchCounters, fetchPositions } from "../lib/actions";
import Link from "next/link";
import { ClientButton } from "../components/buttons";
import CreatePositionModal from "../components/positions/create-position-modal";
import ClientTitle from "../components/title";
import CustomStatistic from "../components/statistic";
import PositionsTableAndUpdatePositionModal from "../components/positions/positions-table-and-update-position-modal";
import ModuleTitle from "../components/module-title";
import { Col, Flex, Row, Space } from "antd";
import ContentLayout from "../components/content-layout";

export default async function PositionsPage() {
  const [positions, counters] = await Promise.all([
    fetchPositions(),
    fetchCounters(),
  ]);

  //tdl error handling
  if ("status" in positions && "message" in positions) {
    return positions.message;
  }

  if ("status" in counters && "message" in counters) {
    return counters.message;
  }

  const openPositionCount = positions.reduce(
    (acc, curr) => (curr.status === "open" ? ++acc : acc),
    0
  );

  const closedPositionCount = positions.reduce(
    (acc, curr) => (curr.status === "closed" ? ++acc : acc),
    0
  );

  // //parse it again since decimal cant pass to client component
  // const parsedPositions = JSON.parse(JSON.stringify(positions));

  return (
    <ContentLayout>
      <Flex justify="space-between" align="center">
        <ModuleTitle>Positions</ModuleTitle>
        <CreatePositionModal counters={counters} />
      </Flex>
      <Row gutter={16}>
        <Col span={4}>
          <CustomStatistic title="Open Positions" value={openPositionCount} />
        </Col>
        <Col span={4}>
          <CustomStatistic
            title="Closed Positions"
            value={closedPositionCount}
          />
        </Col>
      </Row>

      <PositionsTableAndUpdatePositionModal positions={positions} />
    </ContentLayout>
  );
}
