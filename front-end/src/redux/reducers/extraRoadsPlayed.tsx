import {
  ExtraRoadActions,
  PLAY_EXTRA_ROAD,
  STOP_EXTRA_ROADS,
} from "../Actions";

const initialState = 0;

export default (
  state: number = initialState,
  action: ExtraRoadActions
): number => {
  switch (action.type) {
    case PLAY_EXTRA_ROAD:
      return state + 1;
    case STOP_EXTRA_ROADS:
      return 0;
    default:
      return state;
  }
};
