import { PlayerNumber } from "../Actions";
import { combineReducers } from "redux";
import { Player } from "../../entities/Player";
import currentPersonPlaying from "./currentPersonPlaying";
import players from "./players";
import inGamePlayerNumber from "./inGamePlayerNumber";
import dice from "./dice";
import turnNumber from "./turnNumber";
import { TileModel } from "../../entities/TIleModel";
import boardToPlay from "./boardToPlay";

export interface FoAppState {
  currentPersonPlaying: PlayerNumber;
  // Number 1-4 representing which 'player' is currently taking their turn
  playersByID: Map<PlayerNumber, Player>;
  // Number 1-4 representing which player the client is
  inGamePlayerNumber: PlayerNumber;
  hasRolled: boolean;
  turnNumber: number;
  boardToBePlayed: {
    listOfTiles: Array<TileModel>;
    gameID: string;
  };
}

// TODO: Should be typed to state
export const FoAPP = combineReducers({
  currentPersonPlaying,
  playersByID: players,
  inGamePlayerNumber,
  hasRolled: dice,
  turnNumber,
  boardToBePlayed: boardToPlay,
});
