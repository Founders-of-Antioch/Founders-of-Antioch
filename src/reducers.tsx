import { FoActionTypes, ChangePlayerAction, CHANGE_PLAYER } from "./Actions";
import { combineReducers } from "redux";

export type FoAppState = {
  currentPersonPlaying: number;
};

function currentPersonPlaying(state = 1, action: ChangePlayerAction) {
  switch (action.type) {
    case CHANGE_PLAYER:
      return action.playerNum;
    default:
      return state;
  }
}

const FoApp = combineReducers({ currentPersonPlaying });
export default FoApp;
