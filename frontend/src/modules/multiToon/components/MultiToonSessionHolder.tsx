import { Box, Button, Group, Modal, Text } from "@mantine/core"
import { MTProfile, MTSession } from "../logic/MultiToonTypes"
import { IconKey, IconLink, IconPlugConnected, IconPlugOff, IconTrash } from "@tabler/icons-react"
import KeybindButtons from "./keybindButtons"
import { useDisclosure } from "@mantine/hooks"
import dreamlandTheme from "../../../themes/DreamlandTheme"
import { CatppuccinColors } from "../../../themes/CatppuccinMocha"
import { createSessionWithClick } from "../logic/multiUtils"
import { notifications } from "@mantine/notifications"

export type MultiToonSessionHolderProps = {
  profile: MTProfile
  yatlSessions: MTSession[]
  EditMTProfile: (profile: MTProfile) => void;
  addMTSession: (session: MTSession) => void;
}

const MultiToonSessionHolder: React.FC<MultiToonSessionHolderProps> = ({ profile, EditMTProfile, addMTSession, yatlSessions }: MultiToonSessionHolderProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const sessions = yatlSessions;
  const isSessionConnected = sessions.some((session) => {
    return session.profile.name === profile.name
  })

  const handleConnectSession = async () => {
    const session: MTSession = await createSessionWithClick(profile)
    addMTSession(session)
    notifications.show({
      title: `Created New MultiToon Session ${session.mt_session}`,
      message: `On Profile ${profile.name} for window ${session.window}`
    })
  }

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
            leftSection={isSessionConnected ?
              <IconPlugConnected size={"1rem"} color={CatppuccinColors.Mantle} /> :
              <IconPlugOff size={"1rem"} color={CatppuccinColors.Mantle} />
            }
            color={isSessionConnected ? CatppuccinColors.Green : CatppuccinColors.Blue}
            onClick={handleConnectSession}
          >
            <Text c={CatppuccinColors.Mantle} fw={600}>{isSessionConnected ? "Connected" : "Connect Session"}</Text>
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
            leftSection={<IconKey size={"1rem"} color={CatppuccinColors.Mantle} />}
            onClick={open}
          >
            <Text c={CatppuccinColors.Mantle} fw={600}>Edit Keymap</Text>
          </Button>
          <Button
            size="xs"
            color={CatppuccinColors.Red}
          >
            <IconTrash size={"1rem"} color={CatppuccinColors.Mantle} />
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
