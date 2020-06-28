import { MoveRobberAction, MOVE_ROBBER } from "../Actions";
import BoardPoint from "../../entities/Points/BoardPoint";

export default function robberCoordinates(
  state: BoardPoint = new BoardPoint(0, 0),
  action: MoveRobberAction
): BoardPoint {
  switch (action.type) {
    case MOVE_ROBBER:
      return new BoardPoint(action.point.boardXPos, action.point.boardYPos);
    default:
      return state;
  }
}
