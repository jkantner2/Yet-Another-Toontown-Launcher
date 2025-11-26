import { Box, Button, Group, Modal, Text } from "@mantine/core"
import { MTProfile } from "../logic/MultiToonTypes"
import { IconKey, IconLink, IconPlugOff, IconTrash } from "@tabler/icons-react"
import KeybindButtons from "./keybindButtons"
import { useDisclosure } from "@mantine/hooks"
import dreamlandTheme from "../../../themes/DreamlandTheme"
import { CatppuccinColors } from "../../../themes/CatppuccinMocha"

export type MultiToonSessionHolderProps = {
  profile: MTProfile
  EditMTProfile: (profile: MTProfile) => void;
}

const MultiToonSessionHolder: React.FC<MultiToonSessionHolderProps> = ({ profile, EditMTProfile }: MultiToonSessionHolderProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Box
        style={{
          borderRadius: 10,
          borderColor: dreamlandTheme.colors!.dark![4],
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: dreamlandTheme.colors!.dark![9],
          padding: "0.7rem 1rem",
        }}
      >
        <Text fw={500} style={{ flex: 1 }} size="lg">
          {profile.name}
        </Text>

        <Group>
          <Button
            size="xs"
            leftSection={<IconPlugOff size={"1rem"} color={CatppuccinColors.Mantle} />}
            color={CatppuccinColors.Blue}
            onClick={() => { }}
          >
            <Text c={CatppuccinColors.Mantle} fw={600}>Connect Session</Text>
          </Button>
          <Button
            size="xs"
            color={CatppuccinColors.Blue}
            leftSection={<IconLink size={"1rem"} color={CatppuccinColors.Mantle} />}
          >
            <Text c={CatppuccinColors.Mantle} fw={600}>Attatch Profile</Text>
          </Button>
          <Button
            size="xs"
            color={CatppuccinColors.Blue}
            leftSection={<IconKey size={"1rem"} color={CatppuccinColors.Mantle}/>}
            onClick={open}
          >
            <Text c={CatppuccinColors.Mantle} fw={600}>Edit Keymap</Text>
          </Button>
          <Button
            size="xs"
            color={CatppuccinColors.Red}
            leftSection={<IconTrash size={"1rem"} color={CatppuccinColors.Mantle}/>}
          >
            <Text c={CatppuccinColors.Mantle} fw={600}>Delete</Text>
          </Button>
        </Group>
      </Box >
      <Modal size='lg' opened={opened} onClose={close} title={profile.name + " Key Binds"}>
        {<KeybindButtons profile={profile} EditMTProfile={EditMTProfile} />}
      </Modal>
    </>
  )
}

export default MultiToonSessionHolder
