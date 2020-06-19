import { combineReducers } from "redux";
import { Player } from "../../entities/Player";
import currentPersonPlaying from "./currentPersonPlaying";
import players from "./players";
import inGamePlayerNumber from "./inGamePlayerNumber";
import dice from "./dice";
import turnNumber from "./turnNumber";
import { TileModel } from "../../entities/TileModel";
import boardToPlay from "./boardToPlay";
import canEndTurn from "./canEndTurn";
import isCurrentlyPlacingSettlement from "./isCurrentlyPlacingSettlement";
import isCurrentlyPlacingRoad from "./isCurrentlyPlacingRoad";
import { PlayerNumber } from "../../../../types/Primitives";

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
  canEndTurn: boolean;
  isCurrentlyPlacingSettlement: boolean;
  isCurrentlyPlacingRoad: boolean;
}

// Unfortunately `Map`'s are not serializable for JSON's, so seed state has to be slightly different
// https://stackoverflow.com/questions/40766650/how-to-emit-a-map-object
export interface SeedState {
  currentPersonPlaying: PlayerNumber;
  // Number 1-4 representing which 'player' is currently taking their turn
  playersArray: Array<Player>;
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
  canEndTurn,
  isCurrentlyPlacingSettlement,
  isCurrentlyPlacingRoad,
});
