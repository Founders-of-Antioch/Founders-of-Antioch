import { RobberCoordinates } from "./reducers";
import { MoveRobberAction, MOVE_ROBBER } from "../Actions";

export default function robberCoordinates(
  state: RobberCoordinates = { boardXPos: 0, boardYPos: 0 },
  action: MoveRobberAction
): RobberCoordinates {
  switch (action.type) {
    case MOVE_ROBBER:
      return { boardXPos: action.boardXPos, boardYPos: action.boardYPos };
    default:
      return state;
  }
}
