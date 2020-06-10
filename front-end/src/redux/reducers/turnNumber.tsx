import { NextTurnAction, NEXT_TURN } from "../Actions";

export default function turnNumber(
  state: number = 1,
  action: NextTurnAction
): number {
  switch (action.type) {
    case NEXT_TURN:
      return action.turnNumber;
    default:
      return state;
  }
}
