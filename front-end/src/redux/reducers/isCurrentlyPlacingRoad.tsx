import { IsPlacingRoadAction, IS_PLACING_ROAD } from "../Actions";

export default function isCurrentlyPlacingRoad(
  state: boolean = false,
  action: IsPlacingRoadAction
): boolean {
  switch (action.type) {
    case IS_PLACING_ROAD:
      return action.isOrIsnt;
    default:
      return state;
  }
}
