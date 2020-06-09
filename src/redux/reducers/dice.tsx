import { HasRolledAction, HAS_ROLLED } from "../Actions";

export default function dice(
  state: boolean = true,
  action: HasRolledAction
): boolean {
  switch (action.type) {
    case HAS_ROLLED:
      return action.hasRolled;
    default:
      return state;
  }
}
