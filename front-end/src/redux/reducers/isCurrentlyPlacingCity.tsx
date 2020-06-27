import { IsPlacingCityAction, IS_PLACING_CITY } from "../Actions";

export default function isCurrentlyPlacingCity(
  state: boolean = false,
  action: IsPlacingCityAction
): boolean {
  switch (action.type) {
    case IS_PLACING_CITY:
      return action.isOrIsnt;
    default:
      return state;
  }
}
