import { PlayerNumber } from "../redux/Actions";
import { TileModel } from "./TIleModel";

// Stolen from the API repo
export class Building {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: PlayerNumber;
  touchingTiles: Array<TileModel>;

  constructor(
    bX: number,
    bY: number,
    corn: number,
    playerNum: PlayerNumber,
    touchingTiles: Array<TileModel>
  ) {
    this.boardXPos = bX;
    this.boardYPos = bY;
    this.corner = corn;
    this.playerNum = playerNum;
    this.touchingTiles = touchingTiles;
  }
}
