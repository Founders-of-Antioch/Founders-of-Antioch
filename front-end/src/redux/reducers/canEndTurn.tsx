import { EndTurnAction, CAN_END_TURN } from "../Actions";

export default function (state: boolean = false, action: EndTurnAction) {
  switch (action.type) {
    case CAN_END_TURN:
      console.log(1233);
      return action.canOrCant;
    default:
      return state;
  }
}
