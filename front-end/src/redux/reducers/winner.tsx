import { PlayerNumber } from "../../../../types/Primitives";
import { CheckWinStateAction, CHECK_WIN_STATE } from "../Actions";

export default function winner(
  state: PlayerNumber = -1,
  action: CheckWinStateAction
): PlayerNumber {
  switch (action.type) {
    case CHECK_WIN_STATE:
      return [...action.playersByID.keys()].reduce((winner, currPlayNum) => {
        const currPlayer = action.playersByID.get(currPlayNum);

        if (currPlayer !== undefined) {
          if (currPlayer.victoryPoints + currPlayer.numberOfVPCards() >= 10) {
            return currPlayNum;
          } else {
            return winner;
          }
        } else {
          return winner;
        }
      }, -1);
    default:
      return state;
  }
}
