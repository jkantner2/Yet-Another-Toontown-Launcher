import React, { useState } from "react";

const CogOptions: React.FC = () => {
  const [cogLevel, setCogLevel] = useState<number>(1);
  // const [cogStatuses, setCogStatuses] = useState<string>("");

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCogLevel(Number(e.target.value));
  };

  return (
    <>
      <div className="CogLevel">
        Cog Level
        <select value={cogLevel} onChange={handleLevelChange}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default CogOptions;
