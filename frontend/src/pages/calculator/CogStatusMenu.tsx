import React, { useState } from "react";
import { CogStatusMenuProps, Location, statuses } from "./CalcTypes";

const CogStatusMenu: React.FC<CogStatusMenuProps> = (
  { checkedStatuses, onStatusCheck },
) => {
  const [expandedGroups, setExpandedGroups] = useState<
    Record<Location, boolean>
  >(() => {
    const initState: Record<Location, boolean> = Object.values(Location).reduce(
      (acc, loc) => {
        acc[loc as Location] = false;
        return acc;
      },
      {} as Record<Location, boolean>,
    );

    return initState;
  });

  const onToggleLocation = (location: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  return (
    <>
      {(Object.values(Location)).map((location) => (
        <div className="locationGroup" key={location}>
          <div
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() =>
              onToggleLocation(location)}
          >
            {expandedGroups[location] ? "▼" : " "} {location}
          </div>

          {expandedGroups[location] && (
            <ul style={{ listStyle: "none", paddingLeft: "1rem" }}>
              {statuses
                .filter((status) =>
                  status.location === location
                )
                .map((status) => (
                  <li key={status.status}>
                    <input
                      id={status.status}
                      type="checkbox"
                      checked={!!checkedStatuses[status.status]}
                      onChange={() => onStatusCheck(status.status)}
                    />
                    <label
                      htmlFor={status.status}
                      style={{ cursor: "pointer" }}
                    >
                      {status.status}
                    </label>
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
};

export default CogStatusMenu;
