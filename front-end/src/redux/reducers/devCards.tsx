import {
  DevCardActions,
  DECLARE_DEV_CARDS,
  TAKE_TOP_DEV_CARD,
} from "../Actions";
import DevCard from "../../entities/DevCard";

export default function devCards(
  state: Array<DevCard> = [],
  action: DevCardActions
): Array<DevCard> {
  switch (action.type) {
    case DECLARE_DEV_CARDS:
      return action.listOfCards;
    case TAKE_TOP_DEV_CARD:
      if (state.length === 0) {
        return state;
      } else {
        return [...state.slice(1)];
      }
    default:
      return state;
  }
}
