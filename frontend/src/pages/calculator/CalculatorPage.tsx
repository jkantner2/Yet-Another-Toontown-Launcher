import React, { useEffect, useState } from "react";
import { GagAttack, StatusName } from "./CalcTypes.ts";
import CogStatusMenu from "./CogStatusMenu.tsx";
import { Box, Button, Drawer, Grid, Image, Slider, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import GagMenu from "./GagMenu.tsx";
import { CalculateAttacks } from "../../../bindings/YATL/services/calculatorservice.ts"
import { AttackAnalysis } from "../../../bindings/YATL/lib/calculator/models.ts";
import { CatppuccinColors } from "../../themes/CatppuccinMocha.ts";

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

  useEffect(() => {
    if (selectedGags.length) {
      handleCalcGags();
    }
  }, [selectedGags, cogLevel]);

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

  const removeSelectedGag = (gag: GagAttack) => {
    setSelectedGags((prev) => {
      const index = prev.findIndex((g) => g.Gag.GagName === gag.Gag.GagName && g.IsOrg === gag.IsOrg);
      if (index === -1) return prev;

      const newGags = [...prev]
      newGags.splice(index, 1)
      return newGags
    })
  }

  const handleCogLevel = (lvl: string | number) => {
    const num = Number(lvl)
    if (!isNaN(num)) {
      setCogLevel(num)
    }
  }

  const addDamageNumbers = () => {
    let totalDamage = 0,
      totalBaseDamage = 0,
      totalLureDamage = 0,
      totalComboDamage = 0

    totalBaseDamage = Math.ceil(analyzedAttacks.reduce((total, atk) => total + atk.BaseDamage, 0))
    totalLureDamage = Math.ceil(analyzedAttacks.reduce((total, atk) => total + atk.LureDamage, 0))
    totalComboDamage = Math.ceil(analyzedAttacks.reduce((total, atk) => total + atk.ComboDamage, 0))

    totalDamage = totalBaseDamage + totalLureDamage + totalComboDamage
    return Math.ceil(totalDamage)
  }

  const handleCalcGags = async () => {
    const result = await CalculateAttacks(selectedGags, false, { level: Number(cogLevel), tier: 8, cheats: [] })

    handleAnalyzeAttacks(result)
  }

  // TODO make images for selected gag display
  return (
    <>
      <Box p='lg' style={{ borderColor: CatppuccinColors.Text, borderWidth: 5, borderRadius: 10 }}>
        <GagMenu
          onSelectedGags={handleSelectedGag}
        />
      </Box>

      <Grid
        className="selected-gags"
        columns={14}
        gutter={20}
        justify="center"
        align="center"
        h={60}
      >
        {selectedGags.map((gag, i) => {
          return (
            <Grid.Col span={2} key={i}>
              <Button
                variant="default"
                fullWidth
                h={50}
                onContextMenu={(e) => {
                  e.preventDefault()
                }}
                onClick={() => removeSelectedGag(gag)}
                style={{
                  background: gag.IsOrg ? CatppuccinColors.Green : CatppuccinColors.Blue,
                  border: 0
                }}
              >
                <Image src={gag.Gag.Resource} height={40} width={40} fit="contain" />
              </Button>
            </Grid.Col>
          )
        })}
      </Grid>

      <Button variant="default"
        onClick={open}
        onContextMenu={(e) => e.preventDefault()}
        m='sm'
      >
        Cog Settings
      </Button>

      <Button variant="default"
        onClick={clearSelectedGag}
        onContextMenu={(e) => e.preventDefault()}
        m='sm'
      >
        Clear Gags
      </Button>

      <div>{`Total damage: ${addDamageNumbers()}`}</div>
      <div>
        {`Final accuracy: ${analyzedAttacks
          .filter(
            (atk, index, self) =>
              self.findIndex((a) => a.Gag.GagType === atk.Gag.GagType) === index
          )
          .reduce((total, atk) => total * atk.FinalAcc * 0.01, 100)
          .toFixed(2)}%`}
      </div>

      {analyzedAttacks.map(atk => {
        return (
          <div>{`base: ${atk.BaseDamage} | combo: ${atk.ComboDamage.toFixed(2)} | lure: ${atk.LureDamage.toFixed(2)}`}</div>
        )
      })}

      <Drawer
        opened={opened}
        onClose={close}
        position="left"
        offset={8}
        radius="md"
      >
        <Stack>
          <Text fw={500}>Cog Level: {cogLevel}</Text>
          <Slider
            value={Number(cogLevel)}
            onChange={handleCogLevel}
            min={1}
            max={20}
            step={1}
            marks={[
              { value: 1, label: "1" },
              { value: 12, label: "12" },
              { value: 20, label: "20" },
            ]}
          />
        </Stack>
        <Box h={25}/>
        <CogStatusMenu
          checkedStatuses={checkedStatuses}
          onStatusCheck={handleCheckedStatus}
        />
      </Drawer>
    </>
  );
};

export default Calculator;
