import React from "react";
import gagsData from "../../data/gags.json" with {type: "json"}
import { Gag, GagMenuProps } from "./CalcTypes.ts";
import { Box, Button, Grid, Image } from "@mantine/core";
import { CatppuccinColors } from "../../themes/CatppuccinMocha.ts"

const GagMenu: React.FC<GagMenuProps> = ({onSelectedGags}) => {
  const gags: Gag[] = gagsData
  const rowColors = [
                CatppuccinColors.Yellow,
                CatppuccinColors.Green,
                CatppuccinColors.Blue,
                CatppuccinColors.Peach,
                CatppuccinColors.Mauve,
                CatppuccinColors.Sky];
  let colorCounter = -1

  return (
    <Box p='lg' >
      <Grid columns={14} gutter={0}>
        {gags.slice(7).map((gag, i) => {
          if (i%7 == 0) {
            colorCounter++
          }
          return (
            <Grid.Col span={2} key={i}>
              <Box h={50} m={5}>
                <Button
                  variant="default"
                  fullWidth
                  h='100%'
                  onContextMenu={(e) => {
                    e.preventDefault()
                    onSelectedGags({Gag: gags[i+7], IsOrg: true})
                  }}
                  onClick={() => onSelectedGags({Gag: gags[i+7], IsOrg: false})}
                  style={{
                    borderWidth: 0,
                    background: rowColors[colorCounter],
                  }}
                >
                  <Image src={gag.Resource} height={40} width={40} fit="contain"/>
                </Button>
              </Box>
            </Grid.Col>
          )
        })}
      </Grid>
    </Box>
  );
};

export default GagMenu;
