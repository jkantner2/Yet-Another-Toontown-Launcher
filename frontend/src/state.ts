import { MTProfile, MTSession } from "./modules/multiToon//logic/MultiToonTypes";

export type YATLState = {
  accounts: string[];
  MTSessions: MTSession[];
  processIDs: Record<string, number>;
  MTProfiles: MTProfile[];
}

export enum YATLActionType {
  SET_ACCOUNTS = "SET_ACCOUNTS",
  ADD_ACCOUNT = "ADD_ACCOUNT",
  ADD_PID = "ADD_PID",
  REMOVE_PID = "REMOVE_PID",
  ADD_MT_SESSION = "ADD_MT_SESSION",
  REMOVE_MT_SESSION = "REMOVE_MT_SESSION",
  EDIT_MT_PROFILE = "EDIT_MT_PROFILE",
  ADD_MT_PROFILE = "ADD_MT_PROFILE",
  REMOVE_MT_PROFILE = "REMOVE_MY_PROFILE",
}

type YATLAction =
  | { type: YATLActionType.SET_ACCOUNTS; accounts: string[] }
  | { type: YATLActionType.ADD_ACCOUNT; account: string }
  | { type: YATLActionType.ADD_PID; username: string, pid: number }
  | { type: YATLActionType.REMOVE_PID; pid: number }
  | { type: YATLActionType.ADD_MT_SESSION; session: MTSession }
  | { type: YATLActionType.REMOVE_MT_SESSION; mt_session: number }
  | { type: YATLActionType.EDIT_MT_PROFILE; profile: MTProfile }
  | { type: YATLActionType.REMOVE_MT_PROFILE; name: string }
  | { type: YATLActionType.EDIT_MT_PROFILE; profile: MTProfile }
  | { type: YATLActionType.ADD_MT_PROFILE; profile: MTProfile }

export default function YATLReducer(state: YATLState, action: YATLAction): YATLState {
  switch (action.type) {
    case YATLActionType.SET_ACCOUNTS: {
      return {
        ...state,
        accounts: action.accounts
      }
    }
    case YATLActionType.ADD_ACCOUNT: {
      return {
        ...state,
        accounts: [...state.accounts, action.account]
      }
    }
    case YATLActionType.ADD_PID: {
      return {
        ...state,
        processIDs: {
          ...state.processIDs,
          [action.username]: action.pid
        }
      }
    }
    case YATLActionType.REMOVE_PID: {
      if (action.pid === -1) return state;

      const updatedProcessIDs = { ...state.processIDs };
      for (const [username, pid] of Object.entries(updatedProcessIDs)) {
        if (pid === action.pid) {
          updatedProcessIDs[username] = -1;
          break;
        }
      }

      return {
        ...state,
        processIDs: updatedProcessIDs,
      };
    }
    case YATLActionType.ADD_MT_SESSION: {
      return {
        ...state,
        MTSessions: [...state.MTSessions,
        action.session
        ]
      }
    }
    case YATLActionType.REMOVE_MT_SESSION: {
      let newSessions = [...state.MTSessions].filter((session) => session.mt_session !== action.mt_session)
      return {
        ...state,
        MTSessions: newSessions
      }
    }
    case YATLActionType.EDIT_MT_PROFILE: {
      return {
        ...state,
        MTSessions: state.MTSessions.map((session) =>
          session.profile.name === action.profile.name
            ? { ...session, profile: action.profile }
            : session
        ),
      }
    }
    case YATLActionType.ADD_MT_PROFILE: {
      if (state.MTProfiles.some(p => p.name === action.profile.name)) {
        return state;
      }
      return {
        ...state,
        MTProfiles: [...state.MTProfiles, action.profile]
      };
    }
    case YATLActionType.REMOVE_MT_PROFILE: {
      return {
        ...state,
        MTProfiles: state.MTProfiles.filter(
          profile => profile.name !== action.name
        ),
        MTSessions: state.MTSessions.filter(
          session => session.profile.name !== action.name
        )
      };
    }
    default:
      return state
  }
}
