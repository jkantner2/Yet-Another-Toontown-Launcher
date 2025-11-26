import React, { useState } from "react";
import { CogStatusMenuProps, Location, statuses } from "../logic/types";
import { Box, Checkbox, Collapse, Divider, Group, Rating, Stack, Text } from "@mantine/core";
import { IconChevronDownRight, IconChevronRight } from "@tabler/icons-react"
import * as motion from "motion/react-client"

const CogStatusMenu: React.FC<CogStatusMenuProps> = (
  { checkedStatuses, onStatusCheck, setBoilerLevel, boilerLevel },
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
    <Stack>
      {Object.values(Location).map((location) => {
        const expanded = expandedGroups[location];
        const filteredStatuses = statuses.filter(
          (status) => status.location === location
        );

        return (
          <Box key={location}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
            <Group
              onClick={() => onToggleLocation(location)}
              align="center"
              style={{ cursor: "pointer" }}
            >
              {expanded ? (
                <IconChevronDownRight size={16} />
              ) : (
                <IconChevronRight size={16} />
              )}

              <Text>{location}</Text>

              {location === "FieldOffice" && (
                <Rating count={4} size="sm" onChange={setBoilerLevel} value={boilerLevel}/>
              )}
            </Group>
            </motion.div>

            <Collapse in={expanded}>
              <Stack pl="lg" mt="xs">
                {filteredStatuses.map((status) => (
                  <Checkbox
                    key={status.status}
                    label={status.status}
                    checked={!!checkedStatuses[status.status]}
                    onChange={() => onStatusCheck(status.status)}
                  />
                ))}
              </Stack>
            </Collapse>
              <Divider my='sm'/>
          </Box>
        );
      })}
    </Stack>
  );
};

export default CogStatusMenu;
