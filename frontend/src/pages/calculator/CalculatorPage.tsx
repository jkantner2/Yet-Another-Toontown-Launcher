import React, { useState } from "react";
import CogOptions from "./CogOptions";
import { StatusName } from "./CalcTypes.ts";
import CogStatusMenu from "./CogStatusMenu.tsx";

const Calculator: React.FC = () => {
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
      <CogOptions />
      <CogStatusMenu
        checkedStatuses={checkedStatuses}
        onStatusCheck={handleCheckedStatus}
      />
    </>
  );
};

export default Calculator;
