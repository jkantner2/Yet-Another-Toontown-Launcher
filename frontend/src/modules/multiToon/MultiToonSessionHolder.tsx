import { Box, Button, Collapse, Group, Text } from "@mantine/core"
// import KeybindButtons from "./keybindButtons"
import { useState } from "react"

const MultiToonSessionHolder: React.FC = () => {
  const [isEditingInputs, setIsEditingInputs] = useState<boolean>(false)

  return (
    <Box
      pt={10}
      pb={20}
      style={{ borderRadius: 20, backgroundColor: "#1b1b1e" }}
    >
      <Group justify="left" pl={20}>
        <Text>
          Profile Attatched to window 560329
        </Text>
      </Group>

      <Group justify="left" pl={20}>
        <Button variant="outline">Attatch To Session</Button>
        <Button variant="outline" onClick={() => { setIsEditingInputs(!isEditingInputs) }}>Edit Inputs</Button>
      </Group>

      <Collapse in={isEditingInputs}>
        {/* <KeybindButtons /> */}
      </Collapse>
    </Box>
  )
}

export default MultiToonSessionHolder
