import { IsPlacingRobberAction, IS_PLACING_ROBBER } from "../Actions";

export default function isCurrentlyPlacingRobber(
  state: boolean = false,
  action: IsPlacingRobberAction
): boolean {
  switch (action.type) {
    case IS_PLACING_ROBBER:
      return action.isPlacingRobber;
    default:
      return state;
  }
}
