export interface Status {
  status: StatusName;
  location: Location;
}

export interface CogStatusMenuProps {
  checkedStatuses: Record<StatusName, boolean>
  onStatusCheck: (id: StatusName) => void;
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
