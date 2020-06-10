import { TileModel } from "../../entities/TIleModel";
import { DeclareBoardAction, DECLARE_BOARD } from "../Actions";

type board = { listOfTiles: Array<TileModel>; gameID: string };

export default function boardToPlay(
  state: board = { listOfTiles: [], gameID: "-1" },
  action: DeclareBoardAction
): board {
  switch (action.type) {
    case DECLARE_BOARD:
      return {
        listOfTiles: action.board.listOfTiles,
        gameID: action.board.gameID,
      };
    default:
      return state;
  }
}
