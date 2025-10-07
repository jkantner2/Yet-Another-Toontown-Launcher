import React from "react";
import gagsData from "../../../../data/gags.json" with {type: "json"}
import { Gag } from "./CalcTypes.ts";
const GagMenu: React.FC = () => {
  const gags: Gag[] = gagsData
  console.log(gags)
  return (
    <>

    </>
  );
};

export default GagMenu;
