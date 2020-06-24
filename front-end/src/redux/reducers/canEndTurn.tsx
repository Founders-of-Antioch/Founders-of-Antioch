import { CAN_END_TURN, AllEndTurnActions, EVALUATE_TURN } from "../Actions";

export default function (
  state: boolean = false,
  action: AllEndTurnActions
): boolean {
  switch (action.type) {
    case CAN_END_TURN:
      return action.canOrCant;
    case EVALUATE_TURN:
      const {
        hasRolled,
        turnNumber,
        isCurrentlyPlacingRoad,
        isCurrentlyPlacingSettlement,
        isCurrentlyPlacingRobber,
      } = action.slice;

      return (
        (hasRolled || turnNumber <= 2) &&
        !isCurrentlyPlacingSettlement &&
        !isCurrentlyPlacingRoad &&
        !isCurrentlyPlacingRobber
      );
    default:
      return state;
  }
}
