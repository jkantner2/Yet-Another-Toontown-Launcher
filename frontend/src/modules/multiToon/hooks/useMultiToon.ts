export type MultiState = {
  pressed_keys: Record<string, boolean>
}

export enum MultiActionType {
  SET_KEY_DOWN = "SET_KEY_DOWN",
  SET_KEY_UP = "SET_KEY_UP"
}

type MultiAction =
  | { type: MultiActionType.SET_KEY_UP; key: string }
  | { type: MultiActionType.SET_KEY_DOWN; key: string }

export default function multiReducer(state: MultiState, action: MultiAction): MultiState {
  switch (action.type) {
    case MultiActionType.SET_KEY_DOWN: {
      return {
        ...state,
        pressed_keys: { ...state.pressed_keys, [action.key]: false }
      }
    }
    case MultiActionType.SET_KEY_UP: {
      return {
        ...state,
        pressed_keys: { ...state.pressed_keys, [action.key]: true }
      }
    }
    default:
      return state
  }
}
