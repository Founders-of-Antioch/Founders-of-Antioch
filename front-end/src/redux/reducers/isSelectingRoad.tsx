import { SelectingRoadAction, SELECTING_ROAD } from "../Actions";

export default function isSelectingRoad(
  state: boolean = false,
  action: SelectingRoadAction
): boolean {
  switch (action.type) {
    case SELECTING_ROAD:
      return action.isSelecting;
    default:
      return state;
  }
}
