import { PlayerNumber, DevCardCode, ResourceString } from "../types/Primitives";

export type ResourceChangePackage = {
  playerNumber: PlayerNumber;
  resourceDeltaMap: { [index: string]: number };
  gameID: string;
};

export type ProposedTradeSocketPackage = {
  gameID: string;
  playerNumber: PlayerNumber;
  playerGetResources: { [index: string]: number };
  playerGiveResources: { [index: string]: number };
};

export type AcquireDevCardPackage = {
  gameID: string;
  playerNumber: PlayerNumber;
  code: DevCardCode;
};

export type DevCardRemovalPackage = {
  gameID: string;
  playerNumber: PlayerNumber;
  handIndex: number;
};

export type ClaimMonopolyPackage = {
  gameID: string;
  playerNumber: PlayerNumber;
  resource: ResourceString;
};

export type FoASocketPackage =
  | ResourceChangePackage
  | ProposedTradeSocketPackage
  | AcquireDevCardPackage
  | DevCardRemovalPackage
  | ClaimMonopolyPackage;
