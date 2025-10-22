import React, { useState } from "react";
import { GagAttack, StatusName } from "./CalcTypes.ts";
import CogStatusMenu from "./CogStatusMenu.tsx";
import { Box, Button, Drawer, NumberInput, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import GagMenu from "./GagMenu.tsx";
import { CalculateAttacks } from "../../../bindings/YATL/services/calculatorservice.ts"
import { AttackAnalysis } from "../../../bindings/YATL/lib/calculator/models.ts";

const Calculator: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [cogLevel, setCogLevel] = useState<string | number>(12);
  const [selectedGags, setSelectedGags] = useState<Array<GagAttack>>([]);
  const [analyzedAttacks, setAnalyzedAttacks] = useState<Array<AttackAnalysis>>([]);

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

  const handleAnalyzeAttacks = (attacks: Array<AttackAnalysis>) => {
    setAnalyzedAttacks(() => [...attacks])
  }

  const handleSelectedGag = (gag: GagAttack) => {
    if (selectedGags.length >= 4) {
      clearSelectedGag()
    }

    setSelectedGags((prev) => [...prev, gag])
  };

  const clearSelectedGag = () => {
    setSelectedGags(() => [])
  }

// func (g *CalculatorService) CalculateAttacks(gags[] calculator.GagAttack, isLured bool, cog calculator.Cog) []calculator.AttackAnalysis {
/*
export interface Cog {
  health: number;
  level: number;
  tier: number;
  cheats: string[];
}

  */
  const handleCalcGags = async () => {
    const result = await CalculateAttacks(selectedGags, false, {level: cogLevel})

    handleAnalyzeAttacks(result)
  }

  // TODO make images for selected gag display
  return (
    <>
      <Box p='lg'>
        <GagMenu
          onSelectedGags={handleSelectedGag}
        />
      </Box>

      <Button variant="default"
        onClick={open}
        onContextMenu={(e) => e.preventDefault()}
        m='sm'
      >
        Open Drawer
      </Button>

      <Button variant="default"
        onClick={clearSelectedGag}
        onContextMenu={(e) => e.preventDefault()}
        m='sm'
      >
        Clear Gags
      </Button>

      <Button variant="default"
        onClick={handleCalcGags}
        onContextMenu={(e) => e.preventDefault()}
        m='sm'
      >
        Calculate
      </Button>


      <Box>
        {selectedGags.map(gag => {
          return (
          <Text>
            {`Gag: ${gag.Gag.GagName} Org: ${gag.IsOrg}`}
          </Text>
          )
        })}
      </Box>

      <>
          {analyzedAttacks.map(atk => {
            return(
              <Box>
                <div>{`${atk.Gag.GagName}`}</div>
              </Box>
            )
          })}
      </>

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
