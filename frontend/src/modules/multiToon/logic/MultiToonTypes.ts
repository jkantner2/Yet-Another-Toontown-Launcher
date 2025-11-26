export interface MTProfile {
  name: string,
  keyMap: Record<string, string>
}

export interface MTSession {
  mt_session: number,
  window: number,
  profile: MTProfile,

}

export type MultiToonPageProps = {
  MTSessions: MTSession[];
  AddMTSession: (session: MTSession) => void;
  AddMTProfile: (profile: MTProfile) => void;
  EditMTProfile: (profile: MTProfile) => void;
  yatlProfiles: MTProfile[];
}

export const groups: Record<string, string[]> = {
  Gameplay: [
    'forward',
    'reverse',
    'left',
    'right',
    'jump',
    'walk',
    'performAction',
    'stickerBook',
    'exitActivity'
  ],
  Camera: [
    'cameraNext',
    'cameraPrev',
    'lookUp',
    'lookDown',
    'printCameraPos'
  ],
  Chat: [
    'chat',
    'groupChat',
    'friendsList'
  ],
  UI: [
    'showMap',
    'showTasks',
    'showGags',
  ],
  Debug: [
    'detectGarbage',
    'toggleGui',
    'toggleNametags',
    'options',
    'screenshot',
    'screenshotDebug',
    'synchronizeTime',
    'thinkCogHQFacilities',
    'thinkDebug',
  ],
};


export const keyMap: Record<string, string> = {
  // Func keys
  F1: "f1",
  F2: "f2",
  F3: "f3",
  F4: "f4",
  F5: "f5",
  F6: "f6",
  F7: "f7",
  F8: "f8",
  F9: "f9",
  F10: "f10",
  F11: "f11",
  F12: "f12",

  // Modifier and control keys
  Shift: "shift",
  Control: "control",
  Alt: "alt",
  Mod: "control", //no equililent in panda3d
  CapsLock: "caps_lock",
  NumLock: "num_lock",

  // Arrows
  ArrowLeft: "arrow_left",
  ArrowUp: "arrow_up",
  ArrowDown: "arrow_down",
  ArrowRight: "arrow_right",

  // Other random keyboard junk
  Backspace: "backspace",
  Tab: "tab",
  Enter: "enter",
  Return: "enter",
  Delete: "delete",
  Insert: "insert",
  Home: "home",
  End: "end",
  PageUp: "page_up",
  PageDown: "page_down",
  Escape: "escape",
  ScrollLock: "scroll_lock",
  PrintScreen: "print_screen",

  // Whitespace and punctuation
  " ": "space",
  Spacebar: "space",
};
