import { ChangePlayerAction, CHANGE_PLAYER } from "../Actions";
import { PlayerNumber } from "../../../../types/Primitives";

export default function currentPersonPlaying(
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
