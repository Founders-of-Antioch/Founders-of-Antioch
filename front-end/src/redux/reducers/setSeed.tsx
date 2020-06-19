import { FoAppState } from "./reducers";
import { SetSeedAction, SET_SEED } from "../Actions";

// WIP
export default function setSeed(
  state: FoAppState,
  action: SetSeedAction
): FoAppState {
  switch (action.type) {
    case SET_SEED:
      const pArr = action.stateSeed.playersArray;
      console.log(state);
      return {
        inGamePlayerNumber: action.stateSeed.inGamePlayerNumber,
        currentPersonPlaying: action.stateSeed.currentPersonPlaying,
        playersByID: new Map([
          [1, pArr[0]],
          [2, pArr[1]],
          [3, pArr[2]],
          [4, pArr[3]],
        ]),
        hasRolled: action.stateSeed.hasRolled,
        turnNumber: action.stateSeed.turnNumber,
        boardToBePlayed: action.stateSeed.boardToBePlayed,
        canEndTurn: false,
        isCurrentlyPlacingSettlement: false,
        isCurrentlyPlacingRoad: false,
      };
    default:
      return state;
  }
}
