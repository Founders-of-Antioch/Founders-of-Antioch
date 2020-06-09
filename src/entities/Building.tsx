import { PlayerNumber } from "../redux/Actions";

// Stolen from the API repo
export class Building {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: PlayerNumber;

  constructor(bX: number, bY: number, corn: number, playerNum: PlayerNumber) {
    this.boardXPos = bX;
    this.boardYPos = bY;
    this.corner = corn;
    this.playerNum = playerNum;
  }
}
