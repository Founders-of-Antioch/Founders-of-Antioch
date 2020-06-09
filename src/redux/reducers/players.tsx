import { PlayerNumber, PlayerAction, PLACE_SETTLEMENT } from "../Actions";
import { Player } from "../../entities/Player";
import { Building } from "../../entities/Building";

export default function players(
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
