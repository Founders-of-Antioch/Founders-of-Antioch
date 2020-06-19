import { PlayerNumber } from "../types/Primitives";

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
