import { IsPlacingSettlementAction, IS_PLACING_SETTLEMENT } from "../Actions";

// Default is true for when they start the game. This might need to be relooked
// if someone leaves the game and rejoins
export default function isCurrentlyPlacingSettlement(
  state: boolean = true,
  action: IsPlacingSettlementAction
): boolean {
  switch (action.type) {
    case IS_PLACING_SETTLEMENT:
      return action.isOrIsnt;
    default:
      return state;
  }
}
