import {
  ChangePlayerAction,
  CHANGE_PLAYER,
  PLACE_SETTLEMENT,
  PlayerAction,
  PlayerNumber,
  DeclarePlayerNumAction,
  DECLARE_PLAYER_NUM,
  HasRolledAction,
  HAS_ROLLED,
  NextTurnAction,
  NEXT_TURN,
} from "../../Actions";
import { combineReducers } from "redux";
import { Player } from "../../entities/Player";
import { Building } from "../../entities/Building";

export type FoAppState = {
  currentPersonPlaying: PlayerNumber;
  // Number 1-4 representing which 'player' is currently taking their turn
  playersByID: Map<PlayerNumber, Player>;
  // Number 1-4 representing which player the client is
  inGamePlayerNumber: PlayerNumber;
  hasRolled: boolean;
  turnNumber: number;
};

function currentPersonPlaying(
  state: PlayerNumber = 1,
  action: ChangePlayerAction
): PlayerNumber {
  switch (action.type) {
    case CHANGE_PLAYER:
      return action.playerNum;
    default:
      return state;
  }
}

function players(
  state: Map<PlayerNumber, Player> = new Map([
    [1, new Player(1)],
    [2, new Player(2)],
    [3, new Player(3)],
    [4, new Player(4)],
  ]),
  action: PlayerAction
): Map<PlayerNumber, Player> {
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

function inGamePlayerNumber(
  state: PlayerNumber = -1,
  action: DeclarePlayerNumAction
): PlayerNumber {
  switch (action.type) {
    case DECLARE_PLAYER_NUM:
      return action.declaredPlayerNum;
    default:
      return state;
  }
}

function dice(state: boolean = true, action: HasRolledAction): boolean {
  switch (action.type) {
    case HAS_ROLLED:
      console.log(action.hasRolled);
      return action.hasRolled;
    default:
      return state;
  }
}

function turnNumber(state: number = 1, action: NextTurnAction): number {
  switch (action.type) {
    case NEXT_TURN:
      return action.turnNumber;
    default:
      return state;
  }
}

// TODO: Should be typed to state
export const FoAPP = combineReducers({
  currentPersonPlaying,
  playersByID: players,
  inGamePlayerNumber,
  hasRolled: dice,
  turnNumber,
});
