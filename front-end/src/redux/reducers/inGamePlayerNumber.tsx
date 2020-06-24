import { DeclarePlayerNumAction, DECLARE_PLAYER_NUM } from "../Actions";
import { PlayerNumber } from "../../../../types/Primitives";

export default function inGamePlayerNumber(
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
