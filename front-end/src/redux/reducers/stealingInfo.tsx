import { IsStealingAction, IS_STEALING } from "../Actions";
import { StealingInfo } from "./reducers";

export default function stealingInfo(
  state: StealingInfo = {
    isStealing: false,
    availableToSteal: [],
  },
  action: IsStealingAction
): StealingInfo {
  switch (action.type) {
    case IS_STEALING:
      return {
        isStealing: action.playerIsStealing,
        availableToSteal: action.availableToSteal,
      };
    default:
      return state;
  }
}
