import {
  IsPlayingRoadDevCardAction,
  IS_PLAYING_ROAD_DEV_CARD,
} from "../Actions";

export default function isPlayingRoadDevCard(
  state: boolean = false,
  action: IsPlayingRoadDevCardAction
): boolean {
  switch (action.type) {
    case IS_PLAYING_ROAD_DEV_CARD:
      return action.isOrIsnt;
    default:
      return state;
  }
}
