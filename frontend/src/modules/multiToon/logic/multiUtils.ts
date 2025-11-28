import { notifications } from "@mantine/notifications";
import { LoadTTRControls, Mt_get_window_grom_pid, Mt_init, Mt_select_window, Mt_set_key_down, Mt_set_key_up, SaveMTProfile } from "../../../../bindings/YATL/services/multiservice";
import { MTProfile, MTSession } from "./MultiToonTypes";

let ttrKeys: Record<string, string> = {};

// async initialization function
export async function initTTRKeys(): Promise<void> {
  ttrKeys = await LoadTTRControls();
}

export async function newProfile(profile_name: string): Promise<MTProfile> {
  const keys: Record<string, string> = {};
  for (const key in ttrKeys) {
    keys[key] = "";
  }
  return {
    name: profile_name,
    keyMap: keys,
    autoAttatchProfiles: [],
  }

} function getActionForKey(profileKeyMap: Record<string, string>, pressedKey: string): string | undefined {
  return Object.entries(profileKeyMap).find(([, key]) => key === pressedKey)?.[0];
}

function getTTRBindForAction(action: string): string | undefined {
  return ttrKeys[action];
}

function getPanda3DBindFromProfileKey(profileKey: string, profileKeyMap: Record<string, string>): string | undefined {
  const action = getActionForKey(profileKeyMap, profileKey);
  if (!action) return undefined;

  const ttrBind = getTTRBindForAction(action);
  if (!ttrBind) return undefined;

  return ttrBind;
}

export async function saveProfiles(profiles: MTProfile[]): Promise<void> {
  for (const profile of profiles) {
    await SaveMTProfile(profile.name, profile.keyMap)
  }
  notifications.show({ title: "Saving Profiles", message: "to YATL config" })
}

export async function saveProfile(profile: MTProfile): Promise<void> {
  await SaveMTProfile(profile.name, profile.keyMap)
  notifications.show({ title: `Saving Profile ${profile.name}`, message: `to YATL config` })
}

export async function setKeyDown(key: string, session: MTSession): Promise<void> {
  const pandaKey = getPanda3DBindFromProfileKey(key, session.profile.keyMap);
  if (!pandaKey) return;

  await Mt_set_key_down(session.mt_session, session.window, pandaKey);
}

export async function setKeyUp(key: string, session: MTSession): Promise<void> {
  const pandaKey = getPanda3DBindFromProfileKey(key, session.profile.keyMap);
  if (!pandaKey) return;

  await Mt_set_key_up(session.mt_session, session.window, pandaKey);
}

export async function createSessionWithClick(profile: MTProfile): Promise<MTSession> {
  const session_id = await Mt_init();
  const window = await Mt_select_window(session_id);
  const session: MTSession = { mt_session: session_id, window: window, profile: profile, attatchedUser: "" }
  notifications.show({ title: `${window}`, message: `${session.profile.name}` })
  return session
}

export async function createSessionForUser(processIDs: Record<string, number>, profile: MTProfile, user: string): Promise<MTSession> {
  const session_id = await Mt_init();
  const session: MTSession = { mt_session: session_id, window: 0, profile: profile, attatchedUser: user}

  const pid = processIDs[user]

  notifications.show({title: "PID for user", message: `${pid}`})
  if (pid === undefined || pid === -1) {
    return session
  }

  const w = await Mt_get_window_grom_pid(session.mt_session, pid)
  session.window = w

  notifications.show({title: "window for user", message: `${w}`})

  return session
}
