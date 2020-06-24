export type DevCardCode = "KNIGHT" | "YOP" | "MONOPOLY" | "ROADS" | "VP";

export type ResourceString =
  | "desert"
  | "wood"
  | "brick"
  | "ore"
  | "sheep"
  | "wheat";

// -1 For when the have not joined yet and are waiting for the backend
export type PlayerNumber = 1 | 2 | 3 | 4 | -1;
