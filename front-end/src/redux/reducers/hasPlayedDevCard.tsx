import { HasPlayedDevCardAction, HAS_PLAYED_DEV_CARD } from "../Actions";

export function hasPlayedDevCard(
  state: boolean = false,
  action: HasPlayedDevCardAction
): boolean {
  switch (action.type) {
    case HAS_PLAYED_DEV_CARD:
      return action.hasPlayed;
    default:
      return state;
  }
}
