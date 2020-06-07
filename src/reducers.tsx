import {
  ChangePlayerAction,
  CHANGE_PLAYER,
  PLACE_SETTLEMENT,
  PlayerAction,
  PlayerNumbers,
} from "./Actions";
import { combineReducers } from "redux";
import { Player } from "./entities/Player";
import { Building } from "./entities/Building";

export type FoAppState = {
  currentPersonPlaying: number;
  playersByID: Map<PlayerNumbers, Player>;
};

function currentPersonPlaying(
  state: number = 1,
  action: ChangePlayerAction
): number {
  switch (action.type) {
    case CHANGE_PLAYER:
      return action.playerNum;
    default:
      return state;
  }
}

function players(
  state: Map<PlayerNumbers, Player> = new Map([
    [1, new Player(1)],
    [2, new Player(2)],
    [3, new Player(3)],
    [4, new Player(4)],
  ]),
  action: PlayerAction
): Map<PlayerNumbers, Player> {
  switch (action.type) {
    case PLACE_SETTLEMENT:
      const build = new Building(
        action.boardXPos,
        action.boardYPos,
        action.corner,
        action.playerNum
      );
      const play = new Player(action.playerNum);
      const playerFromState = state.get(action.playerNum);

      if (playerFromState) {
        play.copyFromPlayer(playerFromState);
        play.buildings.push(build);
        play.victoryPoints++;

        return new Map([...state, [action.playerNum, play]]);
      } else {
        return state;
      }
    default:
      return state;
  }
}

const FoApp = combineReducers({ currentPersonPlaying, playersByID: players });
export default FoApp;
