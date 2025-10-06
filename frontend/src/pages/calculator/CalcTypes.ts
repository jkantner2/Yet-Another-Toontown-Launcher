export interface Status {
  status: StatusName;
  location: Location;
}

export enum StatusName {
  FiredUp,
  MarketResearch,
}

export enum Location {
  FieldOffice,
  Foreman,
  Auditor,
  OldLady,
  GolfLady,
}

export const statuses: Array<Status> = [
  { status: StatusName.FiredUp, location: Location.FieldOffice },
  { status: StatusName.MarketResearch, location: Location.FieldOffice },
];
