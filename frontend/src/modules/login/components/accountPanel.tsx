import { Box, Button, Group, Text } from "@mantine/core";
import { IconCircleArrowUp, IconGripVertical, IconPlayerPlay, IconTrash } from "@tabler/icons-react";
import { Reorder, useDragControls } from "framer-motion"
import { useEffect, useState } from "react";
import * as motion from "motion/react-client"
import dreamlandTheme from "../../../themes/DreamlandTheme";
import { CatppuccinColors } from "../../../themes/CatppuccinMocha";

type AccountPanelProps = {
  handlePlay: (username: string) => Promise<void>;
  accounts: string[];
}

const AccountPanel: React.FC<AccountPanelProps> = ({ handlePlay, accounts }: AccountPanelProps) => {
  const [localAccounts, setLocalAccounts] = useState(accounts);

  useEffect(() => {
    setLocalAccounts(accounts);
  }, [accounts]);


  return (
    <Reorder.Group axis="y" values={localAccounts} onReorder={setLocalAccounts} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {localAccounts.map((username) => (
        <AccountItem key={username} username={username} handlePlay={handlePlay} />
      ))}
    </Reorder.Group>
  );
};

type AccountItemProps = {
  username: string;
  handlePlay: (username: string) => Promise<void>;
};

const AccountItem: React.FC<AccountItemProps> = ({ username, handlePlay }) => {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      whileTap={isDragging ? {scale: 1.01} : {scale: 1}}
    >
      <Box pb={5}>
        <Reorder.Item
          value={username}
          dragListener={false}
          dragControls={controls}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.7rem 1rem",
            borderRadius: 10,
            backgroundColor: dreamlandTheme.colors!.dark![9],
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
          }}
        >
          <Box
            onPointerDown={(e) => controls.start(e)}
            style={{ cursor: isDragging ? "grabbing" : "grab", marginRight: 12 }}
          >
            <IconGripVertical size={20} />
          </Box>

          <Text fw={500} style={{ flex: 1 }} size="lg">
            {username}
          </Text>

          <Group>
            <Button
              size="xs"
              color="#89b4fa"
              leftSection={<IconPlayerPlay size={"1rem"} color={CatppuccinColors.Mantle}/>}
              onClick={() => handlePlay(username)}
            >
              <Text c={CatppuccinColors.Mantle} fw={600}>Play</Text>
            </Button>

            <Button
              color="#89b4fa"
              size="xs"
              leftSection={<IconCircleArrowUp size={"1rem"} color={CatppuccinColors.Mantle}/>}
            >
              <Text c={CatppuccinColors.Mantle} fw={600}>Sync</Text>
            </Button>
            <Button
              size="xs"
              color="#f38ba8"
              leftSection={<IconTrash size={"1rem"} color={CatppuccinColors.Mantle}/>}
            >
              <Text c={CatppuccinColors.Mantle} fw={600}>Delete</Text>
            </Button>
          </Group>
        </Reorder.Item>
      </Box>
    </motion.div>
  );
};

export default AccountPanel;
