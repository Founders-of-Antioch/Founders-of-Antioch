import { PlayerNumber, ChangePlayerAction, CHANGE_PLAYER } from "../Actions";

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
