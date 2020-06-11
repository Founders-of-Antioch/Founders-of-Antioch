import { SelectingSettlementAction, SELECTING_SETTLEMENT } from "../Actions";

export default function isSelectingSettlement(
  state: boolean = false,
  action: SelectingSettlementAction
): boolean {
  switch (action.type) {
    case SELECTING_SETTLEMENT:
      return action.isSelecting;
    default:
      return state;
  }
}
