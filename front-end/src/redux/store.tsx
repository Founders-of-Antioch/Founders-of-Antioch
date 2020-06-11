import { createStore } from "redux";
import { FoAPP, FoAppState, SeedState } from "./reducers/reducers";

function mapSeedToRealState(stateSeed: SeedState): FoAppState {
  const pArr = stateSeed.playersArray;
  console.log(12);
  return {
    inGamePlayerNumber: stateSeed.inGamePlayerNumber,
    currentPersonPlaying: stateSeed.currentPersonPlaying,
    playersByID: new Map([
      [1, pArr[0]],
      [2, pArr[1]],
      [3, pArr[2]],
      [4, pArr[3]],
    ]),
    hasRolled: stateSeed.hasRolled,
    turnNumber: stateSeed.turnNumber,
    boardToBePlayed: stateSeed.boardToBePlayed,
  };
}
// mapSeedToRealState;

export default createStore(FoAPP);
