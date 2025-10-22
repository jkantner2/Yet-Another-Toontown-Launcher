import { Dispatch, SetStateAction } from "react";

export interface Status {
  status: StatusName;
  location: Location;
}

export interface GagAttack {
  Gag: Gag
  IsOrg: boolean
}

export interface Gag {
  GagType: string;
  GagName: string;
  Damage: number;
  OrgDamage: number;
  Accuracy: number;
  Stun: number;
  Shorthand: string;
  Resource: string;
}

export interface Cog {
  health: number;
  level: number;
  tier: number;
  cheats: string[];
}

export interface CogStatusMenuProps {
  checkedStatuses: Record<StatusName, boolean>
  onStatusCheck: (id: StatusName) => void;
}

export interface GagMenuProps {
  onSelectedGags: (gag: GagAttack) => void;
}

export interface CogOptionsProps {
  setCogLevel: Dispatch<SetStateAction<number | string>>;
}

export enum StatusName {
  FiredUp = "FiredUp",
  MarketResearch = "MarketResearch",
  ForemanDefence = "ForemanDefence",
}

export enum Location {
  FieldOffice = "FieldOffice",
  Foreman = "Foreman",
  Auditor = "Auditor",
  OldLady = "OldLady",
  GolfLady = "GolfLady",
}

export const statuses: Array<Status> = [
  { status: StatusName.FiredUp, location: Location.FieldOffice },
  { status: StatusName.MarketResearch, location: Location.FieldOffice },
  { status: StatusName.ForemanDefence, location: Location.Foreman },
];
