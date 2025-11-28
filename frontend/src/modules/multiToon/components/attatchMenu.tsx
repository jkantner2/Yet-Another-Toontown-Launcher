import { MTProfile } from "../logic/MultiToonTypes"
import { Box, Button, Checkbox, Text } from "@mantine/core";
import { saveProfile } from "../logic/multiUtils";

type AttatchMenuProps = {
  profile: MTProfile;
  accounts: string[];
  EditMTProfile: (profile: MTProfile) => void;
}

const AttatchMenu: React.FC<AttatchMenuProps> = ({
  profile,
  accounts,
  EditMTProfile,
}) => {

  const handleToggle = (account: string) => {
    if (profile.autoAttatchAccounts.includes(account)) {
      profile.autoAttatchAccounts = profile.autoAttatchAccounts.filter(a => a !== account);
    } else {
      profile.autoAttatchAccounts.push(account);
    }

    EditMTProfile(profile);
  };

  const handleSave = () => {
    EditMTProfile(profile);
    saveProfile(profile);
  };

  return (
    <Box style={{ padding: "1rem" }}>
      <Text pb={"1rem"}>
        Selected accounts will have multitoon profiles auto-connect on launch.
      </Text>

      <Box style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {accounts.map((account) => (
          <Box key={account}>
            <Checkbox
              p={"0.4rem"}
              size="md"
              label={account}
              checked={profile.autoAttatchAccounts.includes(account)}
              onChange={() => handleToggle(account)}
            />
          </Box>
        ))}
      </Box>

      <Button
        onClick={handleSave}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Save
      </Button>
    </Box>
  );
};

export default AttatchMenu;
