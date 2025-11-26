import { notifications } from "@mantine/notifications";
import { LoadTTRControls, SaveMTProfile } from "../../../../bindings/YATL/services/multiservice";
import { keyMap, MTProfile } from "./MultiToonTypes";

export function keyToPanda3DBind(key: string) {
  key = key.trim()
  if (/^[a-zA-Z0-9]$/.test(key)) {
    return key;
  }

  if (key in keyMap) {
    return keyMap[key];
  }

  return "invalid_key";
}

export async function newProfile(profile_name: string): Promise<MTProfile> {
  const ttrKeys = await LoadTTRControls()
  const keys: Record<string, string> = {};
  for (const key in ttrKeys) {
    keys[key] = "";
  }
  return {
    name: profile_name,
    keyMap: keys
  }
}

export async function saveProfiles(profiles: MTProfile[]): Promise<void> {
  for (const profile of profiles) {
    await SaveMTProfile(profile.name, profile.keyMap)
  }
  notifications.show({title: "Saving Profiles", message: "to YATL config"})
}

export async function saveProfile(profile: MTProfile): Promise<void> {
  await SaveMTProfile(profile.name, profile.keyMap)
  notifications.show({title: `Saving Profile ${profile.name}`, message: `to YATL config`})
}
