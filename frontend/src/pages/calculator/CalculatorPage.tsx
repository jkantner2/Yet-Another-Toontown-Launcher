import React, { useState } from "react";
import { StatusName } from "./CalcTypes.ts";
import CogStatusMenu from "./CogStatusMenu.tsx";
import { Button, Drawer, NumberInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const Calculator: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [_cogLevel, setCogLevel] = useState<string | number>(12);
  const [checkedStatuses, setCheckedStatuses] = useState<
    Record<StatusName, boolean>
  >(() => {
    const initState = Object.values(StatusName).reduce((acc, status) => {
      acc[status as StatusName] = false;
      return acc;
    }, {} as Record<StatusName, boolean>);
    return initState;
  });

  const handleCheckedStatus = (status: StatusName) => {
    setCheckedStatuses((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  return (
    <>
      <Button variant="default" onClick={open}>
        Open Drawer
      </Button>
      <Drawer
        opened={opened}
        onClose={close}
        position="left"
        offset={8}
        radius="md"
      >
        <NumberInput
          label="Cog Level"
          defaultValue={12}
          min={1}
          max={20}
          onChange={setCogLevel}
        />
        <CogStatusMenu
          checkedStatuses={checkedStatuses}
          onStatusCheck={handleCheckedStatus}
        />
      </Drawer>
    </>
  );
};

export default Calculator;
