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
  AccuracyUp = "AccuracyUp",                       // 75% acc inc
  FiredUp = "FiredUp",                             // -50% defence
  PayRaise = "PayRaise",                 // 60 Health increase
  // TwoStarPayRaise = "2* PayRaise",                 // 80 Health increase
  // ThreeStarPayRaise = "3* PayRaise",               // 100 Health increase
  // FourStarPayRaise = "4* PayRaise",                // 125 Health increase
  MarketResearch = "MarketResearch",     // 10% defence
  // TwoStarMarketResearch = "2* MarketResearch",     // 15% defence
  // ThreeStarMarketResearch = "3* MarketResearch",   // 20% defence
  // FourStarMarketResearch = "4* MarketResearch",    // 25% defence
  ForemanDefence = "ForemanDefence",               // 25% defence
  ForemanFiredUp = "ForemanFiredUp",               // -50% defence
  OverPaidBullion = "OverPaidBullion",             // +200 health
  OverPaidCoin = "OverPaidCoin",                   // +150 health
  BearMarket = "BearMarket",                       // 50% defence
  BullMarket = "BullMarket",                       // -50% defence
  GolfDefenseDown = "GolfDefenceDown",             // 20% per cog defeated
}

export enum Location {
  General = "General",
  FieldOffice = "FieldOffice",
  Foreman = "Foreman",
  Auditor = "Auditor",
  ClubPresident = "ClubPresident",
}

export const statuses: Array<Status> = [
  { status: StatusName.AccuracyUp, location: Location.General },

  { status: StatusName.FiredUp, location: Location.FieldOffice },
  { status: StatusName.MarketResearch, location: Location.FieldOffice },
  { status: StatusName.PayRaise, location: Location.FieldOffice },

  { status: StatusName.ForemanDefence, location: Location.Foreman },
  { status: StatusName.ForemanFiredUp, location: Location.Foreman },

  { status: StatusName.OverPaidBullion, location: Location.Auditor },
  { status: StatusName.OverPaidCoin, location: Location.Auditor },
  { status: StatusName.BearMarket, location: Location.Auditor },
  { status: StatusName.BullMarket, location: Location.Auditor },

  { status: StatusName.GolfDefenseDown, location: Location.ClubPresident },
];
